/**
 * Block „FRINEX CTA-Sektion" — ein Slot mit dem Element frinex-cta,
 * gedacht als letzte Sektion vor dem Footer.
 */

Shopware.Component.register('sw-cms-block-frinex-cta', {
    template: `
        <div class="sw-cms-block-frinex-cta">
            <slot name="cta"></slot>
        </div>
    `,
});

Shopware.Component.register('sw-cms-preview-frinex-cta', {
    template: `
        <div style="padding: 12px; background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;
                    display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <div style="flex-grow: 1;">
                <div style="width: 65%; height: 7px; background: rgba(255,255,255,.9); border-radius: 3px; margin-bottom: 5px;"></div>
                <div style="width: 45%; height: 4px; background: rgba(255,255,255,.5); border-radius: 2px; margin-bottom: 4px;"></div>
                <div style="width: 45%; height: 4px; background: rgba(255,255,255,.5); border-radius: 2px;"></div>
            </div>
            <div style="width: 34px; height: 13px; background: #f2a900; border-radius: 99px; flex-shrink: 0;"></div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsBlock({
    name: 'frinex-cta',
    label: 'sw-cms.blocks.frinex.cta.label',
    category: 'text-image',
    component: 'sw-cms-block-frinex-cta',
    previewComponent: 'sw-cms-preview-frinex-cta',
    defaultConfig: {
        marginBottom: null,
        marginTop: null,
        marginLeft: null,
        marginRight: null,
        sizingMode: 'boxed',
    },
    slots: {
        cta: 'frinex-cta',
    },
});
