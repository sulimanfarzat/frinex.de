<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Service;

use Shopware\Core\Content\Product\SalesChannel\ProductAvailableFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\System\SalesChannel\Entity\SalesChannelRepository;
use Shopware\Core\System\SalesChannel\SalesChannelContext;

/**
 * Lädt die im Sales Channel kaufbaren Produkte, gruppiert nach
 * Hauptprodukt mit seinen Varianten — gemeinsame Datenbasis für die
 * Produkt-/Größen-Dropdowns (Warenkorb-Schnellerfassung und
 * B2B-Bestellseite).
 */
class ProductOptionsLoader
{
    // Obergrenze als Schutz bei großen Katalogen
    private const MAX_OPTIONS = 500;

    public function __construct(
        private readonly SalesChannelRepository $productRepository
    ) {
    }

    /**
     * @return list<array{label: string, variants: list<array{number: string, label: string}>}>
     */
    public function load(SalesChannelContext $context): array
    {
        $criteria = (new Criteria())
            ->addFilter(new ProductAvailableFilter($context->getSalesChannelId()))
            ->addSorting(new FieldSorting('productNumber', FieldSorting::ASCENDING))
            ->setLimit(self::MAX_OPTIONS);
        $criteria->setTitle('zero-budget-b2b::product-options');

        // ohne options.group bleibt getVariation() leer — die Größen-
        // Labels der Varianten wären dann leer
        $criteria->addAssociation('options.group');

        $products = $this->productRepository->search($criteria, $context);

        $groups = [];
        foreach ($products as $product) {
            // Eltern-Artikel mit Varianten sind selbst nicht kaufbar.
            // Bewusst in PHP statt als SQL-Filter: childCount ist bei
            // Varianten NULL, NULL-Vergleiche kippen den Filter.
            if (($product->getChildCount() ?? 0) > 0) {
                continue;
            }

            $groupKey = $product->getParentId() ?? $product->getId();

            // Variantenname erbt vom Elternprodukt (Inheritance des
            // SalesChannelRepository), taugt daher als Gruppenlabel
            $groups[$groupKey] ??= [
                'label' => $product->getTranslation('name') ?? $product->getProductNumber(),
                'variants' => [],
            ];

            $optionValues = [];
            foreach ($product->getVariation() as $variation) {
                $optionValues[] = $variation['option'];
            }

            $groups[$groupKey]['variants'][] = [
                'number' => $product->getProductNumber(),
                // variantenlose Produkte haben keine Ausprägung —
                // im Größen-Dropdown als „Standard" anzeigen
                'label' => $optionValues !== [] ? implode(', ', $optionValues) : 'Standard',
            ];
        }

        return array_values($groups);
    }
}
