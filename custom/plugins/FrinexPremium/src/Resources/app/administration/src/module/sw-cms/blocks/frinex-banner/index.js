/**
 * Block „FRINEX Kampagnen-Banner" — ein Slot mit dem Element
 * frinex-banner; beliebig oft pro Erlebniswelt einsetzbar.
 */

Shopware.Component.register('sw-cms-block-frinex-banner', {
    template: `
        <div class="sw-cms-block-frinex-banner">
            <slot name="banner"></slot>
        </div>
    `,
});

Shopware.Component.register('sw-cms-preview-frinex-banner', {
    template: `
        <div style="padding: 12px; background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;">
            <div style="width: 22%; height: 4px; background: #f2a900; border-radius: 2px; margin-bottom: 5px;"></div>
            <div style="width: 50%; height: 7px; background: rgba(255,255,255,.9); border-radius: 3px; margin-bottom: 8px;"></div>
            <div style="width: 28%; height: 10px; background: #ffffff; border-radius: 99px;"></div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsBlock({
    name: 'frinex-banner',
    label: 'sw-cms.blocks.frinex.banner.label',
    category: 'image',
    component: 'sw-cms-block-frinex-banner',
    previewComponent: 'sw-cms-preview-frinex-banner',
    defaultConfig: {
        marginBottom: null,
        marginTop: null,
        marginLeft: null,
        marginRight: null,
        sizingMode: 'boxed',
    },
    slots: {
        banner: 'frinex-banner',
    },
});
