/**
 * FRINEX Kategorien-Grid — Kategorien werden im Admin per Multi-Select
 * gewählt (Reihenfolge = Anzeige-Reihenfolge); Bilder kommen aus dem
 * Kategorie-Medium (Storefront-Resolver: FrinexCategoryGridCmsElementResolver).
 */

Shopware.Component.register('sw-cms-el-frinex-category-grid', {
    template: `
        <div style="padding: 12px;">
            <div style="font-weight: 800; color: #14181e; margin-bottom: 12px;">
                {{ element.config.headline.value || $tc('sw-cms.elements.frinexCategoryGrid.placeholder.headline') }}
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                <div v-for="n in tileCount" :key="n"
                     style="aspect-ratio: 4/3; border-radius: 8px; background: linear-gradient(180deg, #e8eef5 55%, #9fb4c8);
                            display: flex; align-items: flex-end; padding: 8px;">
                    <span style="width: 60%; height: 6px; background: rgba(255,255,255,.9); border-radius: 3px;"></span>
                </div>
            </div>
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    computed: {
        tileCount() {
            const selected = this.element?.config?.categories?.value ?? [];
            return Math.min(Math.max(selected.length, 4), 8);
        },
    },
    created() {
        this.initElementConfig('frinex-category-grid');
        this.initElementData('frinex-category-grid');
    },
});

Shopware.Component.register('sw-cms-el-config-frinex-category-grid', {
    template: `
        <div class="sw-cms-el-config-frinex-category-grid">
            <mt-text-field
                v-model="element.config.headline.value"
                :label="$tc('sw-cms.elements.frinexCategoryGrid.config.headline')" />
            <sw-entity-multi-id-select
                v-model:value="element.config.categories.value"
                :repository="categoryRepository"
                :label="$tc('sw-cms.elements.frinexCategoryGrid.config.categories')"
                :help-text="$tc('sw-cms.elements.frinexCategoryGrid.config.categoriesHelp')" />
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    inject: ['repositoryFactory'],
    computed: {
        categoryRepository() {
            return this.repositoryFactory.create('category');
        },
    },
    created() {
        this.initElementConfig('frinex-category-grid');
    },
});

Shopware.Component.register('sw-cms-el-preview-frinex-category-grid', {
    template: `
        <div style="padding: 10px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
            <div v-for="n in 6" :key="n" style="aspect-ratio: 4/3; border-radius: 4px; background: #e8eef5;"></div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsElement({
    name: 'frinex-category-grid',
    label: 'sw-cms.elements.frinexCategoryGrid.label',
    component: 'sw-cms-el-frinex-category-grid',
    configComponent: 'sw-cms-el-config-frinex-category-grid',
    previewComponent: 'sw-cms-el-preview-frinex-category-grid',
    defaultConfig: {
        headline: { source: 'static', value: '' },
        categories: { source: 'static', value: [], entity: { name: 'category' } },
    },
});
