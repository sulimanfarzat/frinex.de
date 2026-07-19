<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Storefront\Controller;

use Doctrine\DBAL\Connection;
use Shopware\Core\Checkout\Cart\Cart;
use Shopware\Core\Checkout\Cart\LineItem\LineItem;
use Shopware\Core\Checkout\Cart\SalesChannel\CartService;
use Shopware\Core\Content\Product\SalesChannel\ProductAvailableFilter;
use Shopware\Core\Content\Product\SalesChannel\SalesChannelProductEntity;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\ContainsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\MultiFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\NotFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\RangeFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\Framework\Validation\DataBag\RequestDataBag;
use Shopware\Core\PlatformRequest;
use Shopware\Core\System\SalesChannel\Entity\SalesChannelRepository;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Storefront\Controller\StorefrontController;
use Shopware\Storefront\Framework\Routing\StorefrontRouteScope;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use ZeroBudgetB2B\Service\RequisitionFavorites;

/**
 * Interne Bedarfsanforderung (BANF) — ERP-artige Bestellmaske für den
 * internen Einkaufskanal: Produkttabelle mit Livesuche und Filtern,
 * AJAX-Warenkorb als „Anforderung", Abteilungsdaten am Abschluss.
 * Die Anforderung wird als reguläre Bestellung angelegt; Abteilung,
 * Kostenstelle usw. landen im Kundenkommentar + in Custom Fields.
 */
#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]
class RequisitionController extends StorefrontController
{
    /** Kundengruppen mit Zugriff: „Einkauf intern" + B2B-Kunden */
    private const ALLOWED_GROUP_IDS = [
        '704ff13a705bd0278c17e434a34ca1de',
        '019aadeaffb07664b610d2bf2752c1f8',
    ];

    private const PAGE_SIZE = 50;

    private const PRIORITIES = [
        'niedrig' => 'Niedrig',
        'normal' => 'Normal',
        'hoch' => 'Hoch',
        'dringend' => 'Dringend',
    ];

    public function __construct(
        private readonly CartService $cartService,
        private readonly SalesChannelRepository $productRepository,
        private readonly EntityRepository $categoryRepository,
        private readonly EntityRepository $orderRepository,
        private readonly Connection $connection,
        private readonly RequisitionFavorites $favorites
    ) {
    }

    #[Route(path: '/requisition', name: 'frontend.requisition.page', methods: ['GET'])]
    public function page(SalesChannelContext $context): Response
    {
        $customer = $context->getCustomer();

        if ($customer === null) {
            return $this->redirectToRoute('frontend.account.login.page', [
                'redirectTo' => 'frontend.requisition.page',
            ]);
        }

        if (!\in_array($customer->getGroupId(), self::ALLOWED_GROUP_IDS, true)) {
            $this->addFlash('danger', 'Die Bedarfsanforderung ist nur für interne Besteller freigegeben.');

            return $this->redirectToRoute('frontend.home.page');
        }

        $cart = $this->cartService->getCart($context->getToken(), $context);

        return $this->renderStorefront('@ZeroBudgetB2B/storefront/page/requisition/index.html.twig', [
            'requisitionCategories' => $this->loadCategories($context),
            'requisitionFavorites' => $this->favorites->get($customer),
            'requisitionPanel' => $this->panelState($cart),
        ]);
    }

    #[Route(path: '/requisition/products', name: 'frontend.requisition.products', defaults: ['XmlHttpRequest' => true], methods: ['GET'])]
    public function products(Request $request, SalesChannelContext $context): Response
    {
        if (($denied = $this->denyJson($context)) !== null) {
            return $denied;
        }

        $term = trim((string) $request->query->get('q', ''));
        $categoryId = (string) $request->query->get('category', '');
        $view = (string) $request->query->get('view', 'all');
        $inStock = $request->query->getBoolean('inStock');
        $page = max(1, $request->query->getInt('p', 1));

        // Favoriten/Häufig bestellt: feste ID-Menge statt Katalog-Paging
        $idPool = null;
        if ($view === 'favorites') {
            $idPool = $this->favorites->get($context->getCustomer());
        } elseif ($view === 'frequent') {
            $idPool = $this->frequentProductIds($context->getCustomer()->getId());
        }

        if ($idPool !== null && $idPool === []) {
            return new JsonResponse(['items' => [], 'total' => 0, 'page' => 1, 'pageCount' => 1]);
        }

        $criteria = $idPool !== null ? new Criteria($idPool) : new Criteria();
        $criteria->setTitle('zero-budget-b2b::requisition-products');
        $criteria->addFilter(new ProductAvailableFilter($context->getSalesChannelId()));

        // Eltern-Artikel mit Varianten sind selbst nicht bestellbar:
        // einfache Produkte (childCount = 0) oder Varianten (parentId gesetzt)
        $criteria->addFilter(new MultiFilter(MultiFilter::CONNECTION_OR, [
            new EqualsFilter('childCount', 0),
            new NotFilter(NotFilter::CONNECTION_AND, [new EqualsFilter('parentId', null)]),
        ]));

        if ($term !== '') {
            $criteria->addFilter(new MultiFilter(MultiFilter::CONNECTION_OR, [
                new ContainsFilter('productNumber', $term),
                new ContainsFilter('name', $term),
                new ContainsFilter('ean', $term),
                new ContainsFilter('manufacturer.name', $term),
                new ContainsFilter('customSearchKeywords', $term),
            ]));
        }

        if ($categoryId !== '' && Uuid::isValid($categoryId)) {
            // categoriesRo enthält auch alle Elternkategorien — filtert
            // damit inklusive Unterkategorien
            $criteria->addFilter(new EqualsFilter('categoriesRo.id', $categoryId));
        }

        if ($inStock) {
            $criteria->addFilter(new RangeFilter('availableStock', [RangeFilter::GT => 0]));
        }

        $criteria->addAssociation('cover.media');
        $criteria->addAssociation('unit');
        $criteria->addAssociation('manufacturer');
        $criteria->addAssociation('categories');
        $criteria->addAssociation('options.group');

        $criteria->addSorting(new FieldSorting('name', FieldSorting::ASCENDING));
        $criteria->addSorting(new FieldSorting('productNumber', FieldSorting::ASCENDING));
        $criteria->setLimit(self::PAGE_SIZE);
        $criteria->setOffset(($page - 1) * self::PAGE_SIZE);
        $criteria->setTotalCountMode(Criteria::TOTAL_COUNT_MODE_EXACT);

        $result = $this->productRepository->search($criteria, $context);
        $favoriteIds = $this->favorites->get($context->getCustomer());

        $items = [];
        foreach ($result as $product) {
            $items[] = $this->productData($product, $favoriteIds);
        }

        // „Häufig bestellt": Reihenfolge nach Bestellhäufigkeit statt Name
        if ($view === 'frequent' && $idPool !== null) {
            $byId = array_column($items, null, 'id');
            $items = array_values(array_filter(array_map(
                static fn (string $id) => $byId[$id] ?? null,
                $idPool
            )));
        }

        $total = $result->getTotal();

        return new JsonResponse([
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'pageCount' => max(1, (int) ceil($total / self::PAGE_SIZE)),
        ]);
    }

    #[Route(path: '/requisition/line-item', name: 'frontend.requisition.lineitem.add', defaults: ['XmlHttpRequest' => true], methods: ['POST'])]
    public function addLineItem(Request $request, SalesChannelContext $context): Response
    {
        if (($denied = $this->denyJson($context)) !== null) {
            return $denied;
        }

        $productId = (string) $request->request->get('productId', '');
        $quantity = max(1, min(9999, $request->request->getInt('quantity', 1)));

        if (!Uuid::isValid($productId)) {
            return new JsonResponse(['message' => 'Ungültiges Produkt.'], Response::HTTP_BAD_REQUEST);
        }

        $lineItem = (new LineItem($productId, LineItem::PRODUCT_LINE_ITEM_TYPE, $productId, $quantity))
            ->setStackable(true)
            ->setRemovable(true);

        $cart = $this->cartService->getCart($context->getToken(), $context);
        $cart = $this->cartService->add($cart, $lineItem, $context);

        return $this->panelResponse($cart);
    }

    #[Route(path: '/requisition/line-item/update', name: 'frontend.requisition.lineitem.update', defaults: ['XmlHttpRequest' => true], methods: ['POST'])]
    public function updateLineItem(Request $request, SalesChannelContext $context): Response
    {
        if (($denied = $this->denyJson($context)) !== null) {
            return $denied;
        }

        $lineItemId = (string) $request->request->get('lineItemId', '');
        $quantity = max(1, min(9999, $request->request->getInt('quantity', 1)));

        $cart = $this->cartService->getCart($context->getToken(), $context);

        if ($cart->getLineItems()->get($lineItemId) === null) {
            return new JsonResponse(['message' => 'Position nicht gefunden.'], Response::HTTP_BAD_REQUEST);
        }

        $cart = $this->cartService->changeQuantity($cart, $lineItemId, $quantity, $context);

        return $this->panelResponse($cart);
    }

    #[Route(path: '/requisition/line-item/remove', name: 'frontend.requisition.lineitem.remove', defaults: ['XmlHttpRequest' => true], methods: ['POST'])]
    public function removeLineItem(Request $request, SalesChannelContext $context): Response
    {
        if (($denied = $this->denyJson($context)) !== null) {
            return $denied;
        }

        $lineItemId = (string) $request->request->get('lineItemId', '');
        $cart = $this->cartService->getCart($context->getToken(), $context);

        if ($cart->getLineItems()->get($lineItemId) !== null) {
            $cart = $this->cartService->remove($cart, $lineItemId, $context);
        }

        return $this->panelResponse($cart);
    }

    #[Route(path: '/requisition/favorite', name: 'frontend.requisition.favorite', defaults: ['XmlHttpRequest' => true], methods: ['POST'])]
    public function toggleFavorite(Request $request, SalesChannelContext $context): Response
    {
        if (($denied = $this->denyJson($context)) !== null) {
            return $denied;
        }

        $productId = (string) $request->request->get('productId', '');

        if (!Uuid::isValid($productId)) {
            return new JsonResponse(['message' => 'Ungültiges Produkt.'], Response::HTTP_BAD_REQUEST);
        }

        $ids = $this->favorites->toggle($context->getCustomer(), $productId, $context->getContext());

        return new JsonResponse(['favorites' => $ids]);
    }

    /**
     * Kennzahlen fürs interne Dashboard (Startseite Einkaufskanal):
     * letzte Anforderungen, Favoriten-/Häufig-bestellt-Zähler, offene
     * Positionen der aktuellen Anforderung.
     */
    #[Route(path: '/requisition/summary', name: 'frontend.requisition.summary', defaults: ['XmlHttpRequest' => true], methods: ['GET'])]
    public function summary(SalesChannelContext $context): Response
    {
        if (($denied = $this->denyJson($context)) !== null) {
            return $denied;
        }

        $customer = $context->getCustomer();

        $criteria = (new Criteria())
            ->addFilter(new EqualsFilter('orderCustomer.customerId', $customer->getId()))
            ->addSorting(new FieldSorting('orderDateTime', FieldSorting::DESCENDING))
            ->setLimit(5);
        $criteria->addAssociation('stateMachineState');
        $criteria->addAssociation('lineItems');
        $criteria->setTitle('zero-budget-b2b::requisition-summary');

        $orders = [];
        foreach ($this->orderRepository->search($criteria, $context->getContext()) as $order) {
            $orders[] = [
                'number' => $order->getOrderNumber(),
                'date' => $order->getOrderDateTime()->format('d.m.Y'),
                'state' => $order->getStateMachineState()?->getTranslated()['name'] ?? '',
                'positions' => $order->getLineItems()?->count() ?? 0,
                'total' => $order->getAmountTotal(),
            ];
        }

        $cart = $this->cartService->getCart($context->getToken(), $context);

        return new JsonResponse([
            'orders' => $orders,
            'favoritesCount' => \count($this->favorites->get($customer)),
            'frequentCount' => \count($this->frequentProductIds($customer->getId())),
            'openPositions' => $this->panelState($cart)['positionCount'],
        ]);
    }

    #[Route(path: '/requisition/submit', name: 'frontend.requisition.submit', defaults: ['XmlHttpRequest' => true], methods: ['POST'])]
    public function submit(Request $request, SalesChannelContext $context): Response
    {
        if (($denied = $this->denyJson($context)) !== null) {
            return $denied;
        }

        $cart = $this->cartService->getCart($context->getToken(), $context);

        if ($cart->getLineItems()->count() === 0) {
            return new JsonResponse(['message' => 'Die Anforderung enthält keine Artikel.'], Response::HTTP_BAD_REQUEST);
        }

        $department = trim((string) $request->request->get('department', ''));
        $costCenter = trim((string) $request->request->get('costCenter', ''));
        $project = trim((string) $request->request->get('project', ''));
        $deliveryDate = trim((string) $request->request->get('deliveryDate', ''));
        $priority = (string) $request->request->get('priority', 'normal');
        $notes = trim((string) $request->request->get('notes', ''));

        if ($department === '' || $costCenter === '') {
            return new JsonResponse(['message' => 'Bitte Abteilung und Kostenstelle angeben.'], Response::HTTP_BAD_REQUEST);
        }

        $date = \DateTimeImmutable::createFromFormat('Y-m-d', $deliveryDate) ?: null;
        if ($date === null) {
            return new JsonResponse(['message' => 'Bitte ein gültiges Lieferdatum wählen.'], Response::HTTP_BAD_REQUEST);
        }

        if (!\array_key_exists($priority, self::PRIORITIES)) {
            $priority = 'normal';
        }

        $comment = implode("\n", array_filter([
            '— Interne Bedarfsanforderung —',
            'Abteilung: ' . $department,
            'Kostenstelle: ' . $costCenter,
            $project !== '' ? 'Projekt: ' . $project : null,
            'Gewünschter Liefertermin: ' . $date->format('d.m.Y'),
            'Priorität: ' . self::PRIORITIES[$priority],
            $notes !== '' ? 'Anmerkungen: ' . $notes : null,
        ]));

        try {
            $orderId = $this->cartService->order($cart, $context, new RequestDataBag());
        } catch (\Throwable $e) {
            return new JsonResponse([
                'message' => 'Die Anforderung konnte nicht übermittelt werden: ' . $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }

        // Abteilungsdaten an der Bestellung hinterlegen — Kommentar für die
        // Sichtbarkeit in der Administration, Custom Fields für Auswertungen
        $this->orderRepository->update([[
            'id' => $orderId,
            'customerComment' => $comment,
            'customFields' => [
                'zb_req_department' => $department,
                'zb_req_cost_center' => $costCenter,
                'zb_req_project' => $project,
                'zb_req_delivery_date' => $date->format('Y-m-d'),
                'zb_req_priority' => $priority,
            ],
        ]], $context->getContext());

        $order = $this->orderRepository->search(new Criteria([$orderId]), $context->getContext())->first();

        return new JsonResponse([
            'orderNumber' => $order?->getOrderNumber() ?? '',
        ]);
    }

    // ---------------------------------------------------------------

    private function denyJson(SalesChannelContext $context): ?JsonResponse
    {
        $customer = $context->getCustomer();

        if ($customer === null) {
            return new JsonResponse(['message' => 'Bitte einloggen.'], Response::HTTP_UNAUTHORIZED);
        }

        if (!\in_array($customer->getGroupId(), self::ALLOWED_GROUP_IDS, true)) {
            return new JsonResponse(['message' => 'Kein Zugriff.'], Response::HTTP_FORBIDDEN);
        }

        return null;
    }

    private function panelResponse(Cart $cart): JsonResponse
    {
        $messages = [];
        foreach ($cart->getErrors() as $error) {
            $messages[] = $error->getMessage();
        }
        $cart->getErrors()->clear();

        return new JsonResponse([
            'panel' => $this->panelState($cart),
            'messages' => $messages,
        ]);
    }

    /**
     * @return array{items: list<array<string, mixed>>, positionCount: int, totalQuantity: int, net: float, total: float}
     */
    private function panelState(Cart $cart): array
    {
        $items = [];
        foreach ($cart->getLineItems() as $lineItem) {
            if ($lineItem->getType() !== LineItem::PRODUCT_LINE_ITEM_TYPE) {
                continue;
            }

            $items[] = [
                'id' => $lineItem->getId(),
                'productId' => $lineItem->getReferencedId(),
                'number' => (string) ($lineItem->getPayload()['productNumber'] ?? ''),
                'label' => (string) $lineItem->getLabel(),
                'quantity' => $lineItem->getQuantity(),
                'unitPrice' => $lineItem->getPrice()?->getUnitPrice() ?? 0.0,
                'total' => $lineItem->getPrice()?->getTotalPrice() ?? 0.0,
            ];
        }

        return [
            'items' => $items,
            'positionCount' => \count($items),
            'totalQuantity' => (int) array_sum(array_column($items, 'quantity')),
            'net' => $cart->getPrice()->getNetPrice(),
            'total' => $cart->getPrice()->getTotalPrice(),
        ];
    }

    /**
     * @param list<string> $favoriteIds
     *
     * @return array<string, mixed>
     */
    private function productData(SalesChannelProductEntity $product, array $favoriteIds): array
    {
        $image = null;
        $media = $product->getCover()?->getMedia();
        if ($media !== null) {
            $image = $media->getUrl();
            $smallest = null;
            foreach ($media->getThumbnails() ?? [] as $thumbnail) {
                if ($smallest === null || $thumbnail->getWidth() < $smallest->getWidth()) {
                    $smallest = $thumbnail;
                }
            }
            if ($smallest !== null) {
                $image = $smallest->getUrl();
            }
        }

        $variation = [];
        foreach ($product->getVariation() as $option) {
            $variation[] = $option['option'];
        }

        $unit = $product->getPackUnit()
            ?: $product->getUnit()?->getTranslation('shortCode')
            ?: $product->getUnit()?->getTranslation('name')
            ?: 'Stk.';

        $maxPurchase = $product->getCalculatedMaxPurchase() ?: ($product->getMaxPurchase() ?? 9999);

        return [
            'id' => $product->getId(),
            'number' => $product->getProductNumber(),
            'name' => $product->getTranslation('name') ?? $product->getProductNumber(),
            'variation' => implode(' · ', $variation),
            'manufacturer' => $product->getManufacturer()?->getTranslation('name') ?? '',
            'category' => $product->getCategories()?->first()?->getTranslation('name') ?? '',
            'stock' => $product->getAvailableStock() ?? 0,
            'unit' => $unit,
            'minPurchase' => $product->getMinPurchase() ?? 1,
            'purchaseSteps' => $product->getPurchaseSteps() ?? 1,
            'maxPurchase' => min(9999, max(1, $maxPurchase)),
            'price' => $product->getCalculatedPrice()->getUnitPrice(),
            'image' => $image,
            'favorite' => \in_array($product->getId(), $favoriteIds, true),
        ];
    }

    /**
     * Meistbestellte Produkte des Mitarbeiters (12 Monate, live-Version).
     *
     * @return list<string>
     */
    private function frequentProductIds(string $customerId): array
    {
        $rows = $this->connection->fetchAllAssociative(
            'SELECT LOWER(HEX(oli.product_id)) AS id, SUM(oli.quantity) AS qty
             FROM order_line_item oli
             INNER JOIN `order` o
                ON o.id = oli.order_id AND o.version_id = oli.order_version_id
             INNER JOIN order_customer oc
                ON oc.order_id = o.id AND oc.order_version_id = o.version_id
             WHERE oc.customer_id = :customer
               AND o.version_id = :version
               AND oli.type = :type
               AND oli.product_id IS NOT NULL
               AND o.order_date_time >= :since
             GROUP BY oli.product_id
             ORDER BY qty DESC
             LIMIT 24',
            [
                'customer' => Uuid::fromHexToBytes($customerId),
                'version' => Uuid::fromHexToBytes(Defaults::LIVE_VERSION),
                'type' => LineItem::PRODUCT_LINE_ITEM_TYPE,
                'since' => (new \DateTimeImmutable('-12 months'))->format('Y-m-d H:i:s'),
            ]
        );

        return array_column($rows, 'id');
    }

    /**
     * Kategorien unterhalb der Kanal-Navigation für den Filter,
     * in Baum-Reihenfolge mit Einrücktiefe.
     *
     * @return list<array{id: string, name: string, depth: int}>
     */
    private function loadCategories(SalesChannelContext $context): array
    {
        $rootId = $context->getSalesChannel()->getNavigationCategoryId();

        $criteria = (new Criteria())
            ->addFilter(new ContainsFilter('path', '|' . $rootId . '|'))
            ->addFilter(new EqualsFilter('active', true))
            ->addSorting(new FieldSorting('path', FieldSorting::ASCENDING))
            ->addSorting(new FieldSorting('name', FieldSorting::ASCENDING))
            ->setLimit(200);
        $criteria->setTitle('zero-budget-b2b::requisition-categories');

        $categories = [];
        $baseLevel = null;
        foreach ($this->categoryRepository->search($criteria, $context->getContext()) as $category) {
            $level = $category->getLevel() ?? 1;
            $baseLevel ??= $level;
            $categories[] = [
                'id' => $category->getId(),
                'name' => $category->getTranslation('name') ?? '',
                'depth' => max(0, $level - $baseLevel),
            ];
        }

        return $categories;
    }
}
