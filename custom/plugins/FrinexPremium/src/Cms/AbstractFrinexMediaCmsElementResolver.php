<?php declare(strict_types=1);

namespace FrinexPremium\Cms;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Content\Cms\SalesChannel\Struct\ImageStruct;
use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;

/**
 * Gemeinsame Basis für alle FRINEX-Elemente mit einem einzelnen
 * "media"-Konfigurationsfeld (Hero, Banner, Testimonial): löst die
 * Media-ID zur MediaEntity auf und stellt sie als element.data.media
 * im Storefront-Template bereit — gleiches Muster wie das Core-Image-
 * Element, nur ohne dessen Zusatzfelder.
 */
abstract class AbstractFrinexMediaCmsElementResolver extends AbstractCmsElementResolver
{
    private const CONFIG_KEY = 'media';

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $mediaConfig = $slot->getFieldConfig()->get(self::CONFIG_KEY);
        if ($mediaConfig === null || $mediaConfig->isMapped() || $mediaConfig->getValue() === null) {
            return null;
        }

        $criteria = new Criteria([$mediaConfig->getValue()]);

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('media_' . $slot->getUniqueIdentifier(), MediaDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $image = new ImageStruct();
        $slot->setData($image);

        $mediaConfig = $slot->getFieldConfig()->get(self::CONFIG_KEY);
        if ($mediaConfig === null || $mediaConfig->getValue() === null) {
            return;
        }

        $image->setMediaId((string) $mediaConfig->getValue());

        $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());
        if ($searchResult === null) {
            return;
        }

        $media = $searchResult->get($mediaConfig->getValue());
        if ($media instanceof MediaEntity) {
            $image->setMedia($media);
        }
    }
}
