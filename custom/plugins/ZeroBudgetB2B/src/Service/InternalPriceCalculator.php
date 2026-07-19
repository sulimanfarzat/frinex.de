<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Service;

use Shopware\Core\Checkout\Cart\Price\Struct\CalculatedPrice;
use Shopware\Core\Checkout\Cart\Price\Struct\ListPrice;
use Shopware\Core\Checkout\Cart\Price\Struct\PriceCollection;
use Shopware\Core\Checkout\Cart\Price\Struct\ReferencePrice;
use Shopware\Core\Checkout\Cart\Tax\Struct\CalculatedTax;
use Shopware\Core\Checkout\Cart\Tax\Struct\CalculatedTaxCollection;
use Shopware\Core\Content\Product\DataAbstractionLayer\CheapestPrice\CalculatedCheapestPrice;
use Shopware\Core\Content\Product\SalesChannel\Price\AbstractProductPriceCalculator;
use Shopware\Core\Content\Product\SalesChannel\SalesChannelProductEntity;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Core\System\SystemConfig\SystemConfigService;

/**
 * Interne Verrechnungspreise für den Einkaufskanal (fritz.frinex.de):
 * dekoriert den Core-Preisrechner und rabattiert alle berechneten
 * Produktpreise um einen konfigurierbaren Prozentsatz (Plugin-Config
 * „internalDiscountPercent", Standard 15 %). Wirkt damit konsistent
 * in Listing, Detailseite, Bedarfsanforderung UND Warenkorb/Bestellung,
 * ohne je Produkt erweiterte Preise pflegen zu müssen.
 */
class InternalPriceCalculator extends AbstractProductPriceCalculator
{
    /** Verkaufskanal „Einkauf intern" */
    private const INTERNAL_SALES_CHANNEL_ID = '216e9e38b0656b4b3280e0b3b11270f9';

    private const CONFIG_KEY = 'ZeroBudgetB2B.config.internalDiscountPercent';

    private const DEFAULT_DISCOUNT = 15.0;

    public function __construct(
        private readonly AbstractProductPriceCalculator $decorated,
        private readonly SystemConfigService $systemConfig
    ) {
    }

    public function getDecorated(): AbstractProductPriceCalculator
    {
        return $this->decorated;
    }

    // kernel.reset zeigt nach der Dekoration auf diesen Service —
    // den Cache-Reset des Core-Rechners weiterreichen
    public function reset(): void
    {
        $this->decorated->reset();
    }

    public function calculate(iterable $products, SalesChannelContext $context): void
    {
        $this->decorated->calculate($products, $context);

        if ($context->getSalesChannelId() !== self::INTERNAL_SALES_CHANNEL_ID) {
            return;
        }

        $percent = $this->systemConfig->get(self::CONFIG_KEY, $context->getSalesChannelId());
        $percent = \is_numeric($percent) ? (float) $percent : self::DEFAULT_DISCOUNT;

        if ($percent <= 0 || $percent >= 100) {
            return;
        }

        $factor = 1 - ($percent / 100);

        foreach ($products as $product) {
            if (!$product instanceof SalesChannelProductEntity) {
                continue;
            }

            $product->setCalculatedPrice($this->scale($product->getCalculatedPrice(), $factor));

            $scaledGraduations = [];
            foreach ($product->getCalculatedPrices() as $graduation) {
                $scaledGraduations[] = $this->scale($graduation, $factor);
            }
            $product->setCalculatedPrices(new PriceCollection($scaledGraduations));

            $cheapest = $product->getCalculatedCheapestPrice();
            if ($cheapest !== null) {
                $product->setCalculatedCheapestPrice($this->scaleCheapest($cheapest, $factor));
            }
        }
    }

    private function scale(CalculatedPrice $price, float $factor): CalculatedPrice
    {
        return new CalculatedPrice(
            $price->getUnitPrice() * $factor,
            $price->getTotalPrice() * $factor,
            $this->scaleTaxes($price->getCalculatedTaxes(), $factor),
            $price->getTaxRules(),
            $price->getQuantity(),
            $this->scaleReference($price->getReferencePrice(), $factor),
            $this->scaleList($price, $factor),
            $price->getRegulationPrice()
        );
    }

    private function scaleCheapest(CalculatedCheapestPrice $price, float $factor): CalculatedCheapestPrice
    {
        $scaled = new CalculatedCheapestPrice(
            $price->getUnitPrice() * $factor,
            $price->getTotalPrice() * $factor,
            $this->scaleTaxes($price->getCalculatedTaxes(), $factor),
            $price->getTaxRules(),
            $price->getQuantity(),
            $this->scaleReference($price->getReferencePrice(), $factor),
            $this->scaleList($price, $factor),
            $price->getRegulationPrice()
        );
        $scaled->setHasRange($price->hasRange());
        $scaled->setVariantId($price->getVariantId());

        return $scaled;
    }

    private function scaleTaxes(CalculatedTaxCollection $taxes, float $factor): CalculatedTaxCollection
    {
        $scaled = new CalculatedTaxCollection();
        foreach ($taxes as $tax) {
            $scaled->add(new CalculatedTax(
                $tax->getTax() * $factor,
                $tax->getTaxRate(),
                $tax->getPrice() * $factor
            ));
        }

        return $scaled;
    }

    private function scaleReference(?ReferencePrice $reference, float $factor): ?ReferencePrice
    {
        if ($reference === null) {
            return null;
        }

        return new ReferencePrice(
            $reference->getPrice() * $factor,
            $reference->getPurchaseUnit(),
            $reference->getReferenceUnit(),
            $reference->getUnitName()
        );
    }

    /**
     * Streichpreis (UVP) bewusst NICHT rabattieren — so ist intern
     * sichtbar, was der Artikel regulär kostet; die Ersparnis-Prozente
     * werden auf den neuen Einheitspreis neu berechnet.
     */
    private function scaleList(CalculatedPrice $price, float $factor): ?ListPrice
    {
        $list = $price->getListPrice();
        if ($list === null) {
            return null;
        }

        return ListPrice::createFromUnitPrice($price->getUnitPrice() * $factor, $list->getPrice());
    }
}
