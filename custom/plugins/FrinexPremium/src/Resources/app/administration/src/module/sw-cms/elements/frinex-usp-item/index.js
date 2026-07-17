/**
 * FRINEX USP-Element — Icon (auswählbar) + Titel + Kurztext.
 * Wird im Block „FRINEX USP-Leiste" viermal nebeneinander verwendet.
 */

Shopware.Component.register('sw-cms-el-frinex-usp-item', {
    template: `
        <div style="text-align: center; padding: 24px 12px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #f4f5f7; color: #0f4c81;
                        display: inline-flex; align-items: center; justify-content: center;
                        font-size: 20px; margin-bottom: 8px;">✓</div>
            <div style="font-weight: 700; font-size: 14px; color: #14181e;">
                {{ element.config.title.value || $tc('sw-cms.elements.frinexUspItem.placeholder.title') }}
            </div>
            <div style="font-size: 12px; color: #5b6470;">
                {{ element.config.text.value || $tc('sw-cms.elements.frinexUspItem.placeholder.text') }}
            </div>
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    created() {
        this.initElementConfig('frinex-usp-item');
    },
});

Shopware.Component.register('sw-cms-el-config-frinex-usp-item', {
    template: `
        <div class="sw-cms-el-config-frinex-usp-item">
            <mt-select
                v-model="element.config.icon.value"
                :label="$tc('sw-cms.elements.frinexUspItem.config.icon')"
                :options="iconOptions" />
            <mt-text-field
                v-model="element.config.title.value"
                :label="$tc('sw-cms.elements.frinexUspItem.config.title')" />
            <mt-text-field
                v-model="element.config.text.value"
                :label="$tc('sw-cms.elements.frinexUspItem.config.text')" />
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    computed: {
        iconOptions() {
            return ['truck', 'invoice', 'headset', 'tag', 'shield', 'box'].map((icon) => ({
                id: icon,
                value: icon,
                label: this.$tc(`sw-cms.elements.frinexUspItem.icons.${icon}`),
            }));
        },
    },
    created() {
        this.initElementConfig('frinex-usp-item');
    },
});

Shopware.Component.register('sw-cms-el-preview-frinex-usp-item', {
    template: `
        <div style="padding: 12px; text-align: center;">
            <div style="width: 22px; height: 22px; border-radius: 50%; background: #e8eef5; margin: 0 auto 6px;"></div>
            <div style="width: 60%; height: 6px; background: #d0d5db; border-radius: 3px; margin: 0 auto 4px;"></div>
            <div style="width: 80%; height: 4px; background: #e4e7eb; border-radius: 3px; margin: 0 auto;"></div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsElement({
    name: 'frinex-usp-item',
    label: 'sw-cms.elements.frinexUspItem.label',
    component: 'sw-cms-el-frinex-usp-item',
    configComponent: 'sw-cms-el-config-frinex-usp-item',
    previewComponent: 'sw-cms-el-preview-frinex-usp-item',
    defaultConfig: {
        icon: { source: 'static', value: 'truck' },
        title: { source: 'static', value: '' },
        text: { source: 'static', value: '' },
    },
});
