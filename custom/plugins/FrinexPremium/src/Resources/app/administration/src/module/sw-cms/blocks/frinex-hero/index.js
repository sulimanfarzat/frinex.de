/**
 * Block „FRINEX Hero" — ein Slot mit dem Element frinex-hero.
 * Empfohlen in einer Sektion mit voller Breite als erster Block.
 */

Shopware.Component.register('sw-cms-block-frinex-hero', {
    template: `
        <div class="sw-cms-block-frinex-hero">
            <slot name="hero"></slot>
        </div>
    `,
});

Shopware.Component.register('sw-cms-preview-frinex-hero', {
    template: `
        <div style="padding: 14px; background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;">
            <div style="width: 55%; height: 9px; background: rgba(255,255,255,.95); border-radius: 4px; margin-bottom: 6px;"></div>
            <div style="width: 75%; height: 5px; background: rgba(255,255,255,.5); border-radius: 4px; margin-bottom: 10px;"></div>
            <div style="display: flex; gap: 6px; margin-bottom: 12px;">
                <div style="width: 30%; height: 11px; background: #ffffff; border-radius: 99px;"></div>
                <div style="width: 26%; height: 11px; border: 1px solid rgba(255,255,255,.7); border-radius: 99px;"></div>
            </div>
            <div style="display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,.25); padding-top: 8px;">
                <div v-for="n in 4" :key="n" style="width: 20%; height: 4px; background: rgba(255,255,255,.45); border-radius: 2px;"></div>
            </div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsBlock({
    name: 'frinex-hero',
    label: 'sw-cms.blocks.frinex.hero.label',
    category: 'image',
    component: 'sw-cms-block-frinex-hero',
    previewComponent: 'sw-cms-preview-frinex-hero',
    defaultConfig: {
        marginBottom: null,
        marginTop: null,
        marginLeft: null,
        marginRight: null,
        sizingMode: 'full_width',
    },
    slots: {
        hero: 'frinex-hero',
    },
});
