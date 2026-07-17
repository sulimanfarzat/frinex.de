/**
 * Block „FRINEX Testimonials" — 3 Slots mit dem Element
 * frinex-testimonial; Karten ohne Zitat werden im Storefront
 * übersprungen (funktioniert also auch mit 1–2 Testimonials).
 */

Shopware.Component.register('sw-cms-block-frinex-testimonials', {
    template: `
        <div class="sw-cms-block-frinex-testimonials"
             style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
            <slot name="one"></slot>
            <slot name="two"></slot>
            <slot name="three"></slot>
        </div>
    `,
});

Shopware.Component.register('sw-cms-preview-frinex-testimonials', {
    template: `
        <div style="padding: 10px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
            <div v-for="n in 3" :key="n" style="background: #f4f5f7; border-radius: 4px; padding: 8px;">
                <div style="width: 90%; height: 4px; background: #d0d5db; border-radius: 2px; margin-bottom: 3px;"></div>
                <div style="width: 70%; height: 4px; background: #d0d5db; border-radius: 2px; margin-bottom: 8px;"></div>
                <div style="display: flex; gap: 4px; align-items: center;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #9fb4c8;"></span>
                    <span style="width: 45%; height: 4px; background: #c4cad1; border-radius: 2px;"></span>
                </div>
            </div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsBlock({
    name: 'frinex-testimonials',
    label: 'sw-cms.blocks.frinex.testimonials.label',
    category: 'text-image',
    component: 'sw-cms-block-frinex-testimonials',
    previewComponent: 'sw-cms-preview-frinex-testimonials',
    defaultConfig: {
        marginBottom: null,
        marginTop: null,
        marginLeft: null,
        marginRight: null,
        sizingMode: 'boxed',
    },
    slots: {
        one: 'frinex-testimonial',
        two: 'frinex-testimonial',
        three: 'frinex-testimonial',
    },
});
