/**
 * FRINEX CTA-Sektion — Registrierungsaufforderung mit B2B-Vorteilen
 * (Textarea: eine Zeile = ein Vorteil) und Button, gedacht als letzte
 * Sektion vor dem Footer.
 */

Shopware.Component.register('sw-cms-el-frinex-cta', {
    template: `
        <div style="background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 8px; padding: 32px;
                    display: flex; align-items: center; justify-content: space-between; gap: 24px;">
            <div>
                <div style="color: #fff; font-weight: 800; font-size: 18px; margin-bottom: 6px;">
                    {{ element.config.headline.value || $tc('sw-cms.elements.frinexCta.placeholder.headline') }}
                </div>
                <div style="color: rgba(255,255,255,.85); font-size: 13px; margin-bottom: 10px;">
                    {{ element.config.text.value }}
                </div>
                <div style="color: rgba(255,255,255,.9); font-size: 12px;">
                    <div v-for="(benefit, index) in benefits" :key="index" style="margin-bottom: 2px;">
                        <span style="color: #f2a900;">✓</span> {{ benefit }}
                    </div>
                </div>
            </div>
            <span style="flex-shrink: 0; background: #f2a900; color: #14181e; border-radius: 99px;
                         padding: 10px 24px; font-weight: 700; font-size: 13px;">
                {{ element.config.ctaLabel.value || $tc('sw-cms.elements.frinexCta.placeholder.cta') }}
            </span>
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    computed: {
        benefits() {
            return (this.element?.config?.benefits?.value || '')
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
        },
    },
    created() {
        this.initElementConfig('frinex-cta');
    },
});

Shopware.Component.register('sw-cms-el-config-frinex-cta', {
    template: `
        <div class="sw-cms-el-config-frinex-cta">
            <mt-text-field
                v-model="element.config.headline.value"
                :label="$tc('sw-cms.elements.frinexCta.config.headline')" />
            <mt-textarea
                v-model="element.config.text.value"
                :label="$tc('sw-cms.elements.frinexCta.config.text')" />
            <mt-textarea
                v-model="element.config.benefits.value"
                :label="$tc('sw-cms.elements.frinexCta.config.benefits')"
                :help-text="$tc('sw-cms.elements.frinexCta.config.benefitsHelp')" />
            <mt-text-field
                v-model="element.config.ctaLabel.value"
                :label="$tc('sw-cms.elements.frinexCta.config.ctaLabel')" />
            <mt-text-field
                v-model="element.config.ctaUrl.value"
                :label="$tc('sw-cms.elements.frinexCta.config.ctaUrl')"
                :help-text="$tc('sw-cms.elements.frinexCta.config.ctaUrlHelp')"
                placeholder="/account/register" />
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    created() {
        this.initElementConfig('frinex-cta');
    },
});

Shopware.Component.register('sw-cms-el-preview-frinex-cta', {
    template: `
        <div style="padding: 12px; background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;
                    display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <div style="flex-grow: 1;">
                <div style="width: 70%; height: 6px; background: rgba(255,255,255,.9); border-radius: 3px; margin-bottom: 5px;"></div>
                <div style="width: 50%; height: 4px; background: rgba(255,255,255,.5); border-radius: 3px;"></div>
            </div>
            <div style="width: 32px; height: 12px; background: #f2a900; border-radius: 99px; flex-shrink: 0;"></div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsElement({
    name: 'frinex-cta',
    label: 'sw-cms.elements.frinexCta.label',
    component: 'sw-cms-el-frinex-cta',
    configComponent: 'sw-cms-el-config-frinex-cta',
    previewComponent: 'sw-cms-el-preview-frinex-cta',
    defaultConfig: {
        headline: { source: 'static', value: '' },
        text: { source: 'static', value: '' },
        benefits: { source: 'static', value: '' },
        ctaLabel: { source: 'static', value: '' },
        ctaUrl: { source: 'static', value: '' },
    },
});
