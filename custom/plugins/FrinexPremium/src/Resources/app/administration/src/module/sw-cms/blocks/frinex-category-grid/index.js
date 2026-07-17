/**
 * Block „FRINEX Kategorien-Grid" — ein Slot mit dem Element
 * frinex-category-grid (6–8 Kategorie-Kacheln, im Admin wählbar).
 */

Shopware.Component.register('sw-cms-block-frinex-category-grid', {
    template: `
        <div class="sw-cms-block-frinex-category-grid">
            <slot name="grid"></slot>
        </div>
    `,
});

Shopware.Component.register('sw-cms-preview-frinex-category-grid', {
    template: `
        <div style="padding: 10px;">
            <div style="width: 40%; height: 6px; background: #d0d5db; border-radius: 3px; margin-bottom: 8px;"></div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;">
                <div v-for="n in 8" :key="n" style="aspect-ratio: 4/3; border-radius: 3px;
                     background: linear-gradient(180deg, #e8eef5 60%, #9fb4c8);"></div>
            </div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsBlock({
    name: 'frinex-category-grid',
    label: 'sw-cms.blocks.frinex.categoryGrid.label',
    category: 'commerce',
    component: 'sw-cms-block-frinex-category-grid',
    previewComponent: 'sw-cms-preview-frinex-category-grid',
    defaultConfig: {
        marginBottom: null,
        marginTop: null,
        marginLeft: null,
        marginRight: null,
        sizingMode: 'boxed',
    },
    slots: {
        grid: 'frinex-category-grid',
    },
});
