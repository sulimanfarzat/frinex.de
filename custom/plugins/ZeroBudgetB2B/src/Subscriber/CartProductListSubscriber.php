<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Subscriber;

use Shopware\Core\Framework\Struct\ArrayStruct;
use Shopware\Storefront\Page\Checkout\Cart\CheckoutCartPageLoadedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use ZeroBudgetB2B\Service\ProductOptionsLoader;

/**
 * Stellt dem „Produktnummer"-Formular der Warenkorbseite die im Shop
 * angelegten Produkte bereit (gruppiert: Produkt → Varianten). Das
 * Template rendert daraus die Produkt-/Größen-Dropdowns.
 */
class CartProductListSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly ProductOptionsLoader $optionsLoader
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [CheckoutCartPageLoadedEvent::class => 'onCartPageLoaded'];
    }

    public function onCartPageLoaded(CheckoutCartPageLoadedEvent $event): void
    {
        $event->getPage()->addExtension(
            'frxProductOptions',
            new ArrayStruct($this->optionsLoader->load($event->getSalesChannelContext()))
        );
    }
}
