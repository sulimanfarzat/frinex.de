<?php declare(strict_types=1);

namespace FrinexPremium\Cms;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Content\Cms\SalesChannel\Struct\ImageSliderItemStruct;
use Shopware\Core\Content\Cms\SalesChannel\Struct\ImageSliderStruct;
use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;

/**
 * FRINEX Hero-Slider — löst mehrere einzelne "media"-Slots (media1..media6)
 * zu einem ImageSliderStruct auf. Bewusst mehrere Einzel-Felder statt einer
 * Medienliste: so bleibt die Admin-Konfiguration mit dem schlanken
 * sw-media-field-Muster der übrigen FRINEX-Elemente konsistent. Die
 * Reihenfolge der Slots ist die Reihenfolge im Slider; leere Slots werden
 * übersprungen. Das Storefront-Template iteriert über element.data.sliderItems
 * (gleiche Struct wie das Core-Image-Slider-Element).
 */
class FrinexHeroSliderCmsElementResolver extends AbstractCmsElementResolver
{
    private const MEDIA_KEYS = ['media1', 'media2', 'media3', 'media4', 'media5', 'media6'];

    public function getType(): string
    {
        return 'frinex-hero-slider';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $mediaIds = $this->collectMediaIds($slot);
        if ($mediaIds === []) {
            return null;
        }

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add(
            'media_' . $slot->getUniqueIdentifier(),
            MediaDefinition::class,
            new Criteria($mediaIds)
        );

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $imageSlider = new ImageSliderStruct();
        $slot->setData($imageSlider);

        $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());
        if ($searchResult === null) {
            return;
        }

        foreach ($this->collectMediaIds($slot) as $mediaId) {
            $media = $searchResult->get($mediaId);
            if (!$media instanceof MediaEntity) {
                continue;
            }

            $item = new ImageSliderItemStruct();
            $item->setMedia($media);
            $imageSlider->addSliderItem($item);
        }
    }

    /**
     * IDs der befüllten Bild-Slots in Slot-Reihenfolge (dedupliziert).
     *
     * @return list<string>
     */
    private function collectMediaIds(CmsSlotEntity $slot): array
    {
        $fieldConfig = $slot->getFieldConfig();
        $ids = [];

        foreach (self::MEDIA_KEYS as $key) {
            $config = $fieldConfig->get($key);
            if ($config === null || $config->isMapped() || $config->getValue() === null) {
                continue;
            }

            $value = (string) $config->getValue();
            if ($value !== '' && !\in_array($value, $ids, true)) {
                $ids[] = $value;
            }
        }

        return $ids;
    }
}
