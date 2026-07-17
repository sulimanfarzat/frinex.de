<?php declare(strict_types=1);

namespace FrinexPremium\Cms;

use Shopware\Core\Content\Category\CategoryDefinition;
use Shopware\Core\Content\Category\CategoryEntity;
use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\Struct\ArrayStruct;

/**
 * Lädt die im Admin gewählten Kategorien (inkl. Vorschaubild) für das
 * Kategorien-Grid. Die Reihenfolge der Auswahl im Admin bleibt erhalten.
 */
class FrinexCategoryGridCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'frinex-category-grid';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $categoriesConfig = $slot->getFieldConfig()->get('categories');
        if ($categoriesConfig === null || $categoriesConfig->isMapped() || $categoriesConfig->getArrayValue() === []) {
            return null;
        }

        $criteria = new Criteria($categoriesConfig->getArrayValue());
        $criteria->addAssociation('media');

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('categories_' . $slot->getUniqueIdentifier(), CategoryDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $data = new ArrayStruct(['categories' => []]);
        $slot->setData($data);

        $categoriesConfig = $slot->getFieldConfig()->get('categories');
        if ($categoriesConfig === null || $categoriesConfig->getArrayValue() === []) {
            return;
        }

        $searchResult = $result->get('categories_' . $slot->getUniqueIdentifier());
        if ($searchResult === null) {
            return;
        }

        $categories = [];
        foreach ($categoriesConfig->getArrayValue() as $categoryId) {
            $category = $searchResult->get($categoryId);
            if ($category instanceof CategoryEntity) {
                $categories[] = $category;
            }
        }

        $data->set('categories', $categories);
    }
}
