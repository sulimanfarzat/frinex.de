<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Service;

use Shopware\Core\Checkout\Customer\CustomerEntity;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\Uuid\Uuid;

/**
 * Favoriten der Bedarfsanforderung — je Mitarbeiter als Produkt-ID-Liste
 * im Custom Field des Kunden gespeichert. Bewusst ohne eigene Entität:
 * upgrade-sicher, keine Migration, kein Indexer.
 */
class RequisitionFavorites
{
    private const CUSTOM_FIELD = 'zb_requisition_favorites';

    public function __construct(
        private readonly EntityRepository $customerRepository
    ) {
    }

    /**
     * @return list<string>
     */
    public function get(CustomerEntity $customer): array
    {
        $ids = $customer->getCustomFields()[self::CUSTOM_FIELD] ?? [];

        if (!\is_array($ids)) {
            return [];
        }

        return array_values(array_filter($ids, static fn ($id) => \is_string($id) && Uuid::isValid($id)));
    }

    /**
     * Produkt an-/abwählen, gibt die neue Favoritenliste zurück.
     *
     * @return list<string>
     */
    public function toggle(CustomerEntity $customer, string $productId, Context $context): array
    {
        // Frisch aus der DB lesen — der Kunde im SalesChannelContext kann
        // aus dem Context-Cache stammen und veraltete Custom Fields tragen
        $fresh = $this->customerRepository
            ->search(new Criteria([$customer->getId()]), $context)
            ->first();

        $ids = $fresh instanceof CustomerEntity ? $this->get($fresh) : [];

        if (\in_array($productId, $ids, true)) {
            $ids = array_values(array_diff($ids, [$productId]));
        } else {
            $ids[] = $productId;
        }

        $this->customerRepository->update([[
            'id' => $customer->getId(),
            'customFields' => [self::CUSTOM_FIELD => $ids],
        ]], $context);

        return $ids;
    }
}
