/**
 * Block „FRINEX Produkt-Slider" — nutzt das Core-Element product-slider
 * (dynamische Produktgruppen für „Bestseller"/„Neuheiten" funktionieren
 * wie gewohnt); das B2B-Styling kommt aus dem Storefront-Block-Template.
 */

Shopware.Component.register('sw-cms-block-frinex-product-slider', {
    template: `
        <div class="sw-cms-block-frinex-product-slider">
            <slot name="products"></slot>
        </div>
    `,
});

Shopware.Component.register('sw-cms-preview-frinex-product-slider', {
    template: `
        <div style="padding: 10px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; align-items: end;">
            <div v-for="n in 4" :key="n" style="border: 1px solid #e4e7eb; border-radius: 4px; padding: 6px;">
                <div style="aspect-ratio: 1; background: #f4f5f7; border-radius: 3px; margin-bottom: 5px;"></div>
                <div style="width: 90%; height: 4px; background: #e4e7eb; border-radius: 2px; margin-bottom: 4px;"></div>
                <div style="width: 50%; height: 6px; background: #14181e; border-radius: 2px; margin-bottom: 5px;"></div>
                <div style="width: 100%; height: 9px; background: #0f4c81; border-radius: 99px;"></div>
            </div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsBlock({
    name: 'frinex-product-slider',
    label: 'sw-cms.blocks.frinex.productSlider.label',
    category: 'commerce',
    component: 'sw-cms-block-frinex-product-slider',
    previewComponent: 'sw-cms-preview-frinex-product-slider',
    defaultConfig: {
        marginBottom: null,
        marginTop: null,
        marginLeft: null,
        marginRight: null,
        sizingMode: 'boxed',
    },
    slots: {
        products: 'product-slider',
    },
});
