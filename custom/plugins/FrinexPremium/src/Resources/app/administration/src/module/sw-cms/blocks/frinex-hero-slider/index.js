/**
 * Block „FRINEX Hero-Slider" — ein Slot mit dem Element frinex-hero-slider.
 * Empfohlen in einer Sektion mit voller Breite als erster Block.
 */

Shopware.Component.register('sw-cms-block-frinex-hero-slider', {
    template: `
        <div class="sw-cms-block-frinex-hero-slider">
            <slot name="heroSlider"></slot>
        </div>
    `,
});

Shopware.Component.register('sw-cms-preview-frinex-hero-slider', {
    template: `
        <div style="position: relative; padding: 14px; overflow: hidden;
                    background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;">
            <div style="width: 55%; height: 9px; background: rgba(255,255,255,.95); border-radius: 4px; margin-bottom: 6px;"></div>
            <div style="width: 75%; height: 5px; background: rgba(255,255,255,.5); border-radius: 4px; margin-bottom: 10px;"></div>
            <div style="display: flex; gap: 6px; margin-bottom: 12px;">
                <div style="width: 30%; height: 11px; background: #ffffff; border-radius: 99px;"></div>
                <div style="width: 26%; height: 11px; border: 1px solid rgba(255,255,255,.7); border-radius: 99px;"></div>
            </div>
            <div style="display: flex; gap: 5px;">
                <div style="width: 22px; height: 5px; background: #fff; border-radius: 99px;"></div>
                <div v-for="n in 3" :key="n" style="width: 8px; height: 5px; background: rgba(255,255,255,.45); border-radius: 99px;"></div>
            </div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsBlock({
    name: 'frinex-hero-slider',
    label: 'sw-cms.blocks.frinex.heroSlider.label',
    category: 'image',
    component: 'sw-cms-block-frinex-hero-slider',
    previewComponent: 'sw-cms-preview-frinex-hero-slider',
    defaultConfig: {
        marginBottom: null,
        marginTop: null,
        marginLeft: null,
        marginRight: null,
        sizingMode: 'full_width',
    },
    slots: {
        heroSlider: 'frinex-hero-slider',
    },
});
