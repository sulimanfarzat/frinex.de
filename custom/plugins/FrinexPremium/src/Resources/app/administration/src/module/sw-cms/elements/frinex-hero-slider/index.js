/**
 * FRINEX Hero-Slider — CMS-Element: wie der FRINEX Hero (Headline, Subline,
 * 2 CTAs, Trust-Leiste), aber mit bis zu sechs pflegbaren Bildern, die im
 * Storefront automatisch rotieren (Autoplay + Punkte + Swipe via Core-Slider).
 * Bewusst sechs einzelne sw-media-field-Slots statt einer Medienliste —
 * konsistent zum schlanken Muster der übrigen FRINEX-Elemente.
 */

// Canvas-Darstellung im Erlebniswelten-Editor
Shopware.Component.register('sw-cms-el-frinex-hero-slider', {
    template: `
        <div class="sw-cms-el-frinex-hero-slider"
             style="position: relative; min-height: 340px; display: flex; align-items: center;
                    border-radius: 4px; overflow: hidden;
                    background: linear-gradient(135deg, #0f4c81 0%, #0a3b65 100%);">
            <div style="padding: 40px; max-width: 65%; position: relative; z-index: 2;">
                <h2 style="color: #fff; font-weight: 800; margin: 0 0 8px;">
                    {{ element.config.headline.value || $tc('sw-cms.elements.frinexHeroSlider.placeholder.headline') }}
                </h2>
                <p style="color: rgba(255,255,255,.85); margin: 0 0 20px;">
                    {{ element.config.subline.value || $tc('sw-cms.elements.frinexHeroSlider.placeholder.subline') }}
                </p>
                <span style="display: inline-block; background: #fff; color: #0f4c81; border-radius: 99px;
                             padding: 8px 22px; font-weight: 700; margin-right: 8px;">
                    {{ element.config.ctaPrimaryLabel.value || $tc('sw-cms.elements.frinexHeroSlider.placeholder.ctaPrimary') }}
                </span>
                <div style="display: flex; gap: 6px; margin-top: 24px;">
                    <span v-for="n in imageCount" :key="n"
                          :style="{ width: n === 1 ? '26px' : '11px', height: '11px', borderRadius: '99px',
                                    background: n === 1 ? '#fff' : 'rgba(255,255,255,.4)' }"></span>
                </div>
            </div>
            <div style="position: absolute; inset: 0; z-index: 1;
                        background: linear-gradient(90deg, rgba(10,22,34,.55) 0%, rgba(10,22,34,.1) 70%);"></div>
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    computed: {
        imageCount() {
            const keys = ['media1', 'media2', 'media3', 'media4', 'media5', 'media6'];
            const count = keys.filter((k) => this.element.config[k] && this.element.config[k].value).length;
            return Math.max(count, 3);
        },
    },
    created() {
        this.initElementConfig('frinex-hero-slider');
        this.initElementData('frinex-hero-slider');
    },
});

// Konfigurations-Panel (rechte Seitenleiste)
Shopware.Component.register('sw-cms-el-config-frinex-hero-slider', {
    template: `
        <div class="sw-cms-el-config-frinex-hero-slider">
            <mt-text-field
                v-model="element.config.headline.value"
                :label="$tc('sw-cms.elements.frinexHeroSlider.config.headline')" />
            <mt-textarea
                v-model="element.config.subline.value"
                :label="$tc('sw-cms.elements.frinexHeroSlider.config.subline')" />
            <mt-text-field
                v-model="element.config.ctaPrimaryLabel.value"
                :label="$tc('sw-cms.elements.frinexHeroSlider.config.ctaPrimaryLabel')"
                :placeholder="$tc('sw-cms.elements.frinexHeroSlider.placeholder.ctaPrimary')" />
            <mt-text-field
                v-model="element.config.ctaPrimaryUrl.value"
                :label="$tc('sw-cms.elements.frinexHeroSlider.config.ctaPrimaryUrl')"
                :help-text="$tc('sw-cms.elements.frinexHeroSlider.config.ctaPrimaryUrlHelp')"
                placeholder="/account/register" />
            <mt-text-field
                v-model="element.config.ctaSecondaryLabel.value"
                :label="$tc('sw-cms.elements.frinexHeroSlider.config.ctaSecondaryLabel')"
                :placeholder="$tc('sw-cms.elements.frinexHeroSlider.placeholder.ctaSecondary')" />
            <mt-text-field
                v-model="element.config.ctaSecondaryUrl.value"
                :label="$tc('sw-cms.elements.frinexHeroSlider.config.ctaSecondaryUrl')"
                :help-text="$tc('sw-cms.elements.frinexHeroSlider.config.ctaSecondaryUrlHelp')" />
            <mt-switch
                v-model="element.config.showTrustBar.value"
                :label="$tc('sw-cms.elements.frinexHeroSlider.config.showTrustBar')" />

            <hr />
            <mt-switch
                v-model="element.config.autoplay.value"
                :label="$tc('sw-cms.elements.frinexHeroSlider.config.autoplay')" />
            <mt-number-field
                v-model="element.config.interval.value"
                :label="$tc('sw-cms.elements.frinexHeroSlider.config.interval')"
                :help-text="$tc('sw-cms.elements.frinexHeroSlider.config.intervalHelp')"
                :min="2" :max="20" number-type="int" />

            <hr />
            <p class="sw-cms-el-config-frinex-hero-slider__hint"
               style="margin: 0 0 12px; color: #52667a; font-size: 13px;">
                {{ $tc('sw-cms.elements.frinexHeroSlider.config.imagesHelp') }}
            </p>
            <sw-media-field
                v-for="n in 6" :key="n"
                v-model:value="element.config['media' + n].value"
                :label="$tc('sw-cms.elements.frinexHeroSlider.config.image', 0, { index: n })" />
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    created() {
        this.initElementConfig('frinex-hero-slider');
    },
});

// Vorschau im „Element ersetzen/wählen"-Dialog
Shopware.Component.register('sw-cms-el-preview-frinex-hero-slider', {
    template: `
        <div style="position: relative; padding: 12px; overflow: hidden;
                    background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;">
            <div style="width: 55%; height: 8px; background: rgba(255,255,255,.9); border-radius: 4px; margin-bottom: 6px;"></div>
            <div style="width: 75%; height: 5px; background: rgba(255,255,255,.5); border-radius: 4px; margin-bottom: 10px;"></div>
            <div style="width: 34%; height: 10px; background: #f2a900; border-radius: 99px; margin-bottom: 12px;"></div>
            <div style="display: flex; gap: 5px;">
                <span style="width: 20px; height: 5px; background: #fff; border-radius: 99px;"></span>
                <span style="width: 8px; height: 5px; background: rgba(255,255,255,.45); border-radius: 99px;"></span>
                <span style="width: 8px; height: 5px; background: rgba(255,255,255,.45); border-radius: 99px;"></span>
            </div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsElement({
    name: 'frinex-hero-slider',
    label: 'sw-cms.elements.frinexHeroSlider.label',
    component: 'sw-cms-el-frinex-hero-slider',
    configComponent: 'sw-cms-el-config-frinex-hero-slider',
    previewComponent: 'sw-cms-el-preview-frinex-hero-slider',
    defaultConfig: {
        headline: { source: 'static', value: '' },
        subline: { source: 'static', value: '' },
        ctaPrimaryLabel: { source: 'static', value: '' },
        ctaPrimaryUrl: { source: 'static', value: '' },
        ctaSecondaryLabel: { source: 'static', value: '' },
        ctaSecondaryUrl: { source: 'static', value: '' },
        showTrustBar: { source: 'static', value: true },
        autoplay: { source: 'static', value: true },
        interval: { source: 'static', value: 6 },
        media1: { source: 'static', value: null, entity: { name: 'media' } },
        media2: { source: 'static', value: null, entity: { name: 'media' } },
        media3: { source: 'static', value: null, entity: { name: 'media' } },
        media4: { source: 'static', value: null, entity: { name: 'media' } },
        media5: { source: 'static', value: null, entity: { name: 'media' } },
        media6: { source: 'static', value: null, entity: { name: 'media' } },
    },
});
