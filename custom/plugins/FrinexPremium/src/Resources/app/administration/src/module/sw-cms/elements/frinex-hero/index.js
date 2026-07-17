/**
 * FRINEX Hero — CMS-Element: Headline, Subline, 2 CTAs, Hintergrundbild,
 * Trust-Leiste (Inhalte der Leiste kommen übersetzbar aus Storefront-Snippets).
 */

// Canvas-Darstellung im Erlebniswelten-Editor
Shopware.Component.register('sw-cms-el-frinex-hero', {
    template: `
        <div class="sw-cms-el-frinex-hero"
             style="min-height: 340px; display: flex; align-items: center; border-radius: 4px;
                    background: linear-gradient(135deg, #0f4c81 0%, #0a3b65 100%); overflow: hidden;">
            <div style="padding: 40px; max-width: 65%;">
                <h2 style="color: #fff; font-weight: 800; margin: 0 0 8px;">
                    {{ element.config.headline.value || $tc('sw-cms.elements.frinexHero.placeholder.headline') }}
                </h2>
                <p style="color: rgba(255,255,255,.85); margin: 0 0 20px;">
                    {{ element.config.subline.value || $tc('sw-cms.elements.frinexHero.placeholder.subline') }}
                </p>
                <span style="display: inline-block; background: #fff; color: #0f4c81; border-radius: 99px;
                             padding: 8px 22px; font-weight: 700; margin-right: 8px;">
                    {{ element.config.ctaPrimaryLabel.value || $tc('sw-cms.elements.frinexHero.placeholder.ctaPrimary') }}
                </span>
                <div v-if="element.config.showTrustBar.value"
                     style="margin-top: 28px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,.25);
                            color: rgba(255,255,255,.85); font-size: 12px;">
                    ✓ Nettopreise &nbsp; ✓ Kauf auf Rechnung &nbsp; ✓ Versand in 24 h &nbsp; ✓ Persönlicher Ansprechpartner
                </div>
            </div>
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    created() {
        this.initElementConfig('frinex-hero');
        this.initElementData('frinex-hero');
    },
});

// Konfigurations-Panel (rechte Seitenleiste)
Shopware.Component.register('sw-cms-el-config-frinex-hero', {
    template: `
        <div class="sw-cms-el-config-frinex-hero">
            <mt-text-field
                v-model="element.config.headline.value"
                :label="$tc('sw-cms.elements.frinexHero.config.headline')" />
            <mt-textarea
                v-model="element.config.subline.value"
                :label="$tc('sw-cms.elements.frinexHero.config.subline')" />
            <mt-text-field
                v-model="element.config.ctaPrimaryLabel.value"
                :label="$tc('sw-cms.elements.frinexHero.config.ctaPrimaryLabel')"
                :placeholder="$tc('sw-cms.elements.frinexHero.placeholder.ctaPrimary')" />
            <mt-text-field
                v-model="element.config.ctaPrimaryUrl.value"
                :label="$tc('sw-cms.elements.frinexHero.config.ctaPrimaryUrl')"
                :help-text="$tc('sw-cms.elements.frinexHero.config.ctaPrimaryUrlHelp')"
                placeholder="/account/register" />
            <mt-text-field
                v-model="element.config.ctaSecondaryLabel.value"
                :label="$tc('sw-cms.elements.frinexHero.config.ctaSecondaryLabel')"
                :placeholder="$tc('sw-cms.elements.frinexHero.placeholder.ctaSecondary')" />
            <mt-text-field
                v-model="element.config.ctaSecondaryUrl.value"
                :label="$tc('sw-cms.elements.frinexHero.config.ctaSecondaryUrl')"
                :help-text="$tc('sw-cms.elements.frinexHero.config.ctaSecondaryUrlHelp')" />
            <mt-switch
                v-model="element.config.showTrustBar.value"
                :label="$tc('sw-cms.elements.frinexHero.config.showTrustBar')" />
            <sw-media-field
                v-model:value="element.config.media.value"
                :label="$tc('sw-cms.elements.frinexHero.config.media')" />
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    created() {
        this.initElementConfig('frinex-hero');
    },
});

// Vorschau im „Element ersetzen/wählen"-Dialog
Shopware.Component.register('sw-cms-el-preview-frinex-hero', {
    template: `
        <div style="padding: 12px; background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;">
            <div style="width: 55%; height: 8px; background: rgba(255,255,255,.9); border-radius: 4px; margin-bottom: 6px;"></div>
            <div style="width: 75%; height: 5px; background: rgba(255,255,255,.5); border-radius: 4px; margin-bottom: 10px;"></div>
            <div style="width: 34%; height: 10px; background: #f2a900; border-radius: 99px;"></div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsElement({
    name: 'frinex-hero',
    label: 'sw-cms.elements.frinexHero.label',
    component: 'sw-cms-el-frinex-hero',
    configComponent: 'sw-cms-el-config-frinex-hero',
    previewComponent: 'sw-cms-el-preview-frinex-hero',
    defaultConfig: {
        headline: { source: 'static', value: '' },
        subline: { source: 'static', value: '' },
        ctaPrimaryLabel: { source: 'static', value: '' },
        ctaPrimaryUrl: { source: 'static', value: '' },
        ctaSecondaryLabel: { source: 'static', value: '' },
        ctaSecondaryUrl: { source: 'static', value: '' },
        showTrustBar: { source: 'static', value: true },
        media: { source: 'static', value: null, entity: { name: 'media' } },
    },
});
