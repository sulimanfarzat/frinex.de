<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Storefront\Controller;

use Shopware\Core\Checkout\Cart\LineItem\LineItem;
use Shopware\Core\Checkout\Cart\SalesChannel\CartService;
use Shopware\Core\Content\Product\SalesChannel\ProductAvailableFilter;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\PlatformRequest;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Storefront\Controller\StorefrontController;
use Shopware\Storefront\Framework\Routing\StorefrontRouteScope;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Wie die Core-Route frontend.checkout.product.add-by-number, aber mit
 * Mengenangabe — genutzt vom „Produktnummer"-Formular der Warenkorbseite.
 * Bewusst ohne Login-/Gruppenprüfung: das Formular ist öffentlich.
 */
#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]
class AddByNumberQuantityController extends StorefrontController
{
    public function __construct(
        private readonly CartService $cartService,
        private readonly EntityRepository $productRepository
    ) {
    }

    #[Route(path: '/checkout/product/add-by-number-qty', name: 'frontend.checkout.product.add-by-number-qty', defaults: ['XmlHttpRequest' => true], methods: ['POST'])]
    public function add(Request $request, SalesChannelContext $context): Response
    {
        $number = trim((string) $request->request->get('number'));
        $quantity = max(1, min(9999, (int) $request->request->get('quantity', 1)));

        if ($number === '') {
            $this->addFlash('danger', $this->trans('error.VIOLATION::IS_BLANK_ERROR'));

            return $this->createActionResponse($request);
        }

        $criteria = (new Criteria())
            ->addFilter(new EqualsFilter('productNumber', $number))
            ->addFilter(new ProductAvailableFilter($context->getSalesChannelId()))
            ->setLimit(1);

        $product = $this->productRepository->search($criteria, $context->getContext())->first();

        if ($product === null) {
            $this->addFlash('danger', $this->trans('error.productNotFound', ['%number%' => $number]));

            return $this->createActionResponse($request);
        }

        $lineItem = (new LineItem($product->getId(), LineItem::PRODUCT_LINE_ITEM_TYPE, $product->getId(), $quantity))
            ->setStackable(true)
            ->setRemovable(true);

        $cart = $this->cartService->getCart($context->getToken(), $context);
        $cart = $this->cartService->add($cart, $lineItem, $context);

        if ($cart->getErrors()->count() === 0) {
            $this->addFlash('success', $this->trans('checkout.addToCartSuccess', ['%count%' => 1]));
        }

        return $this->createActionResponse($request);
    }
}
