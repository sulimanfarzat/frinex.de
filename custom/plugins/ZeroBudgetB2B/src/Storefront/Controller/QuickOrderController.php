<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Storefront\Controller;

use Shopware\Core\Content\Product\SalesChannel\ProductAvailableFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsAnyFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use ZeroBudgetB2B\Service\ProductOptionsLoader;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Checkout\Cart\SalesChannel\CartService;
use Shopware\Core\PlatformRequest;
use Shopware\Storefront\Framework\Routing\StorefrontRouteScope;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Storefront\Controller\StorefrontController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Shopware\Core\Framework\Routing\Annotation\RouteScope;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\Checkout\Cart\LineItem\LineItem;
use Shopware\Core\Content\Product\SalesChannel\Price\AbstractProductPriceCalculator;
use Shopware\Core\Content\Product\SalesChannel\Detail\ProductDetailRoute;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository as ProductRepository;
use Shopware\Core\Checkout\Cart\Price\Struct\QuantityPriceDefinition;
use Shopware\Core\System\Currency\Struct\CurrencyRounding;


#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]
class QuickOrderController extends StorefrontController
{
    private CartService $cartService;
    private EntityRepository $productRepository;
    private ProductDetailRoute $productDetailRoute;
    private ProductOptionsLoader $productOptionsLoader;

    public function __construct(CartService $cartService,                  // Argument 1
    EntityRepository $productRepository,      // Argument 2 (jetzt aliast)
    ProductDetailRoute $productDetailRoute,   // Argument 3
    ProductOptionsLoader $productOptionsLoader // Argument 4: Daten für die Produkt-/Größen-Dropdowns
	)
    {
	$this->productDetailRoute = $productDetailRoute;
        $this->cartService = $cartService;
        $this->productRepository = $productRepository;
        $this->productOptionsLoader = $productOptionsLoader;
    }

    #[Route(path: '/quickorder', name: 'frontend.quickorder.page', methods: ['GET'])]
    public function showQuickOrderPage(SalesChannelContext $context): Response
    {
	// ID der B2B-Kundengruppe
        $b2bGroupId = '019aadeaffb07664b610d2bf2752c1f8'; /* HIER IST DIE ECHTE ID EINGEFÜGT! Diese haben wir von der Datenbank durch diesen Command bekommen "SELECT     HEX(cg.id) AS id,     cgt.name FROM     customer_group cg JOIN     customer_group_translation cgt ON cg.id = cgt.cu
stomer_group_id;"*/
        $customer = $context->getCustomer();

        // ⭐ B2B-Check 1: Ist der Kunde eingeloggt?
        if (!$customer) {
            $this->addFlash('danger', $this->trans('Sie müssen eingeloggt sein'));
            // Weiterleitung zur Login-Seite, wenn nicht eingeloggt
            return $this->redirectToRoute('frontend.account.login.page');
        }

        // 2. B2B-CHECK: Ist der Kunde in der richtigen Gruppe?
            if ($customer->getGroupId() !== $b2bGroupId) {
                $this->addFlash('danger', $this->trans('Nur für Geschäftskunden erlaubt'));
                return $this->redirectToRoute('frontend.home.page');
            }

        // Optional: Hier könnte eine erweiterte Prüfung auf eine bestimmte B2B-Kundengruppe folgen.

        return $this->renderStorefront('@ZeroBudgetB2B/storefront/page/quick-order/index.html.twig', [
            'quickOrderData' => [],
            'frxProductGroups' => $this->productOptionsLoader->load($context),
        ]);
    }

    /**
     * Mehrere Zeilen (Produkt + Menge) auf einmal in den Warenkorb —
     * Ziel des Zeilen-Formulars der B2B-Bestellseite. Preise berechnet
     * der CartService selbst (keine eigene PriceDefinition nötig).
     */
    #[Route(path: '/quickorder/add-items', name: 'frontend.quickorder.add.items', methods: ['POST'])]
    public function addItems(Request $request, SalesChannelContext $context): Response
    {
        // gleiche Zugangsprüfung wie die Seite selbst
        $b2bGroupId = '019aadeaffb07664b610d2bf2752c1f8';
        $customer = $context->getCustomer();

        if (!$customer) {
            $this->addFlash('danger', $this->trans('Sie müssen eingeloggt sein'));
            return $this->redirectToRoute('frontend.account.login.page');
        }

        if ($customer->getGroupId() !== $b2bGroupId) {
            $this->addFlash('danger', $this->trans('Nur für Geschäftskunden erlaubt'));
            return $this->redirectToRoute('frontend.home.page');
        }

        // Nummer => Menge einsammeln; leere Zeilen überspringen,
        // doppelt erfasste Nummern aufsummieren
        $wanted = [];
        foreach ($request->request->all('items') as $item) {
            $number = trim((string) ($item['number'] ?? ''));
            $quantity = max(1, min(9999, (int) ($item['quantity'] ?? 1)));

            if ($number === '') {
                continue;
            }

            $wanted[$number] = ($wanted[$number] ?? 0) + $quantity;
        }

        if ($wanted === []) {
            $this->addFlash('danger', 'Bitte mindestens einen Artikel auswählen.');
            return $this->redirectToRoute('frontend.quickorder.page');
        }

        $criteria = (new Criteria())
            ->addFilter(new EqualsAnyFilter('productNumber', array_keys($wanted)))
            ->addFilter(new ProductAvailableFilter($context->getSalesChannelId()));

        $byNumber = [];
        foreach ($this->productRepository->search($criteria, $context->getContext()) as $product) {
            $byNumber[$product->getProductNumber()] = $product->getId();
        }

        $lineItems = [];
        foreach ($wanted as $number => $quantity) {
            $productId = $byNumber[$number] ?? null;

            if ($productId === null) {
                $this->addFlash('danger', $this->trans('quickorder.productNotFound', ['%sku%' => $number]));
                continue;
            }

            $lineItems[] = (new LineItem($productId, LineItem::PRODUCT_LINE_ITEM_TYPE, $productId, $quantity))
                ->setStackable(true)
                ->setRemovable(true);
        }

        if ($lineItems !== []) {
            $cart = $this->cartService->getCart($context->getToken(), $context);
            $this->cartService->add($cart, $lineItems, $context);
            $this->addFlash('success', \count($lineItems) . ' Artikel in den Warenkorb gelegt.');
        }

        return $this->redirectToRoute('frontend.quickorder.page');
    }

    #[Route(path: '/quickorder/add', name: 'frontend.quickorder.add', methods: ['POST'])]
    public function addQuickOrder(Request $request, SalesChannelContext $context): Response
    {

	// ID der B2B-Kundengruppe
    	$b2bGroupId = '019aadeaffb07664b610d2bf2752c1f8'; // HIER IST DIE ECHTE ID EINGEFÜGT!
    	$customer = $context->getCustomer();
        
	// 1. Ist der Kunde eingeloggt?
        if (!$customer) {
            $this->addFlash('danger', $this->trans('Sie müssen eingeloggt sein'));
            return $this->redirectToRoute('frontend.account.login.page');
        }

        // 2. ⭐ ZUSÄTZLICHER B2B-CHECK: Ist der Kunde in der richtigen Gruppe?
        if ($customer->getGroupId() !== $b2bGroupId) {
            $this->addFlash('danger', $this->trans('Nur für Geschäftskunden erlaubt'));
            return $this->redirectToRoute('frontend.home.page');
        }

        $sku = (string) $request->get('sku');
        $quantity = (int) $request->get('quantity', 1);

        // 1. Produkt über die SKU finden (Suche nach product.productNumber)
        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('productNumber', $sku));
        $criteria->addFilter(new ProductAvailableFilter($context->getSalesChannel()->getId()));

	$productId = $request->request->get('sku'); 

	if (!$productId) {
	    // Wenn die ID nicht gefunden wird, geben Sie eine Fehlermeldung aus und beenden Sie den Vorgang.
	    $this->addFlash('danger', $this->trans('Produkt konnte nicht gefunden werden'));
	    return $this->redirectToRoute('frontend.quickorder.page');
	}

	$searchCriteria = (new Criteria())
	    // ⭐ WICHTIG: Die Datenbankspalte, in der die Artikelnummer gespeichert ist, heißt 'productNumber'.
	    // Wir filtern diese Spalte mit dem Wert aus Ihrer Variable $productId (der Artikelnummer).
	    ->addFilter(new EqualsFilter('productNumber', $productId)) 
	    ->setLimit(1);
	
	$productSearchResult = $this->productRepository->search($searchCriteria, $context->getContext());

	if ($productSearchResult->count() === 0) {
	    // Fehlerbehandlung falls Produkt nicht gefunden
	    $this->addFlash('danger', $this->trans('Produkt konnte nicht gefunden werden', ['%sku%' => $productId]));
	    return $this->redirectToRoute('frontend.quickorder.page');
	}

	// 3. ⭐ UUID abrufen und der Variablen $productUuid zuweisen ⭐
	// Wir definieren eine NEUE Variable, um die korrekte UUID zu speichern, 
	// damit wir die Artikelnummer ($productId) nicht überschreiben.
	$productUuid = $productSearchResult->first()->getId();

	$cart = $this->cartService->getCart($context->getToken(), $context);


	// Wir übergeben die NEU gefundene UUID an die Route
	$productResult = $this->productDetailRoute->load($productUuid, new Request(), $context, new Criteria());
	$product = $productResult->getProduct();

	//dd($product); diesen Kommentar lass ich, da dieser Command die Variable im Frontend zeigen kann. Also ist nützlich.

        // Prüfen, ob der Artikel bereits im Warenkorb ist
        $existingItem = $cart->getLineItems()->get($product->getId());

        if ($existingItem) {
            // ARTIKEL IST BEREITS DA: Menge aktualisieren
            $newQuantity = $existingItem->getQuantity() + $quantity;
            
            $update = [
                'id' => $existingItem->getId(),
                'quantity' => $newQuantity
            ];
            
            // Verwende den update-Service, um die Menge zu ändern
            $cart = $this->cartService->update($cart, [$update], $context);

        } else {
		$calculatedPrice = $product->getCalculatedPrice();
            if (!$calculatedPrice) {
                $this->addFlash('danger', $this->trans('Preis konnte nicht ermittelt werden'));
                return $this->redirectToRoute('frontend.quickorder.page');
            }
            
            $unitPrice = $calculatedPrice->getUnitPrice();
            $taxRules = $calculatedPrice->getTaxRules();

            // ARTIKEL IST NEU: Hinzufügen (Ihre bisherige Logik)
            $lineItem = (new LineItem(
                $product->getId(), 
                LineItem::PRODUCT_LINE_ITEM_TYPE, // Der korrigierte Typ-String
                $product->getId(),
                $quantity
            ))->setRemovable(true)
    ->setStackable(true);

		$lineItem->setLabel($product->getTranslation('name'));
            
		// 3. DIE PREISDEFINITION ZUWEISEN
            $lineItem->setPriceDefinition(new QuantityPriceDefinition(
                $unitPrice, 
                $taxRules, 
                $quantity,
                // 2. Rufe die Precision von diesem Objekt ab
    		$context->getCurrency()->getItemRounding()->getDecimals()
            ));

            $cart = $this->cartService->add($cart, $lineItem, $context);
        }

	// 4. Erfolgs- und Fehlerprüfung
	if ($cart->getErrors()->count() > 0) {
	    // Wenn der Cart Service Fehler meldet (z.B. Lagerbestand)
	    $errorMessage = $this->trans('quickorder.cartError') . ': ' . $cart->getErrors()->first()->getMessage();
	    $this->addFlash('danger', $errorMessage);
	} else {
	    // Erfolg
	    $this->addFlash('success', $this->trans('Produkt: "'.$product->getTranslation('name'). '" "Menge: '.$quantity.'" erfolgreich zum Warenkorb hinzugefügt'));
	}

	return $this->redirectToRoute('frontend.quickorder.page');
    }
}
