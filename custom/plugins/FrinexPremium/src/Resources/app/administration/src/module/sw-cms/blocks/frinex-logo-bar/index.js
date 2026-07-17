/**
 * Block „FRINEX Logo-Leiste" — 6 Slots mit dem Core-Element image
 * für Kundenlogos (Social Proof). Nicht gepflegte Slots werden im
 * Storefront übersprungen.
 */

Shopware.Component.register('sw-cms-block-frinex-logo-bar', {
    template: `
        <div class="sw-cms-block-frinex-logo-bar"
             style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; align-items: center;">
            <slot name="logo-one"></slot>
            <slot name="logo-two"></slot>
            <slot name="logo-three"></slot>
            <slot name="logo-four"></slot>
            <slot name="logo-five"></slot>
            <slot name="logo-six"></slot>
        </div>
    `,
});

Shopware.Component.register('sw-cms-preview-frinex-logo-bar', {
    template: `
        <div style="padding: 14px; display: flex; justify-content: center; gap: 10px; align-items: center;">
            <div v-for="n in 6" :key="n" style="width: 13%; height: 12px; background: #d0d5db; border-radius: 3px; opacity: .7;"></div>
        </div>
    `,
});

const logoSlot = {
    type: 'image',
    default: {
        config: {
            displayMode: { source: 'static', value: 'standard' },
        },
    },
};

Shopware.Service('cmsService').registerCmsBlock({
    name: 'frinex-logo-bar',
    label: 'sw-cms.blocks.frinex.logoBar.label',
    category: 'image',
    component: 'sw-cms-block-frinex-logo-bar',
    previewComponent: 'sw-cms-preview-frinex-logo-bar',
    defaultConfig: {
        marginBottom: null,
        marginTop: null,
        marginLeft: null,
        marginRight: null,
        sizingMode: 'boxed',
    },
    slots: {
        'logo-one': logoSlot,
        'logo-two': logoSlot,
        'logo-three': logoSlot,
        'logo-four': logoSlot,
        'logo-five': logoSlot,
        'logo-six': logoSlot,
    },
});
