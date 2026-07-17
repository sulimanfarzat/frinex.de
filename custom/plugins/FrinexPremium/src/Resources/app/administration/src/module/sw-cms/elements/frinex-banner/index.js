/**
 * FRINEX Kampagnen-Banner — Bild + Eyebrow + Headline + Text + CTA,
 * Ausrichtung links/zentriert. Beliebig oft pro Erlebniswelt einsetzbar.
 */

Shopware.Component.register('sw-cms-el-frinex-banner', {
    template: `
        <div style="min-height: 200px; display: flex; align-items: center; border-radius: 8px;
                    background: linear-gradient(135deg, #0f4c81, #0a3b65);"
             :style="{ justifyContent: element.config.contentAlign.value === 'center' ? 'center' : 'flex-start',
                       textAlign: element.config.contentAlign.value === 'center' ? 'center' : 'left' }">
            <div style="padding: 28px; max-width: 60%;">
                <div style="color: #f2a900; font-size: 11px; font-weight: 700; text-transform: uppercase;
                            letter-spacing: .08em; margin-bottom: 6px;">
                    {{ element.config.eyebrow.value }}
                </div>
                <div style="color: #fff; font-weight: 800; font-size: 18px; margin-bottom: 6px;">
                    {{ element.config.headline.value || $tc('sw-cms.elements.frinexBanner.placeholder.headline') }}
                </div>
                <div style="color: rgba(255,255,255,.85); font-size: 13px; margin-bottom: 14px;">
                    {{ element.config.text.value }}
                </div>
                <span style="display: inline-block; background: #fff; color: #0f4c81; border-radius: 99px;
                             padding: 6px 18px; font-weight: 700; font-size: 13px;">
                    {{ element.config.ctaLabel.value || $tc('sw-cms.elements.frinexBanner.placeholder.cta') }}
                </span>
            </div>
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    created() {
        this.initElementConfig('frinex-banner');
        this.initElementData('frinex-banner');
    },
});

Shopware.Component.register('sw-cms-el-config-frinex-banner', {
    template: `
        <div class="sw-cms-el-config-frinex-banner">
            <mt-text-field
                v-model="element.config.eyebrow.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.eyebrow')" />
            <mt-text-field
                v-model="element.config.headline.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.headline')" />
            <mt-textarea
                v-model="element.config.text.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.text')" />
            <mt-text-field
                v-model="element.config.ctaLabel.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.ctaLabel')" />
            <mt-text-field
                v-model="element.config.ctaUrl.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.ctaUrl')"
                :help-text="$tc('sw-cms.elements.frinexBanner.config.ctaUrlHelp')" />
            <mt-select
                v-model="element.config.contentAlign.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.contentAlign')"
                :options="alignOptions" />
            <sw-media-field
                v-model:value="element.config.media.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.media')" />
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    computed: {
        alignOptions() {
            return ['left', 'center'].map((align) => ({
                id: align,
                value: align,
                label: this.$tc(`sw-cms.elements.frinexBanner.align.${align}`),
            }));
        },
    },
    created() {
        this.initElementConfig('frinex-banner');
    },
});

Shopware.Component.register('sw-cms-el-preview-frinex-banner', {
    template: `
        <div style="padding: 12px; background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;">
            <div style="width: 25%; height: 4px; background: #f2a900; border-radius: 2px; margin-bottom: 6px;"></div>
            <div style="width: 55%; height: 7px; background: rgba(255,255,255,.9); border-radius: 3px; margin-bottom: 8px;"></div>
            <div style="width: 30%; height: 9px; background: #ffffff; border-radius: 99px;"></div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsElement({
    name: 'frinex-banner',
    label: 'sw-cms.elements.frinexBanner.label',
    component: 'sw-cms-el-frinex-banner',
    configComponent: 'sw-cms-el-config-frinex-banner',
    previewComponent: 'sw-cms-el-preview-frinex-banner',
    defaultConfig: {
        eyebrow: { source: 'static', value: '' },
        headline: { source: 'static', value: '' },
        text: { source: 'static', value: '' },
        ctaLabel: { source: 'static', value: '' },
        ctaUrl: { source: 'static', value: '' },
        contentAlign: { source: 'static', value: 'left' },
        media: { source: 'static', value: null, entity: { name: 'media' } },
    },
});
