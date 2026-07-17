/**
 * FRINEX Testimonial — Zitat + Name + Position/Firma + optionales
 * Foto/Logo. Wird im Block „FRINEX Testimonials" bis zu 3× verwendet.
 */

Shopware.Component.register('sw-cms-el-frinex-testimonial', {
    template: `
        <div style="background: #f4f5f7; border-radius: 8px; padding: 20px; height: 100%;">
            <div style="color: #0f4c81; font-size: 24px; font-family: Georgia, serif; line-height: 1;">&ldquo;</div>
            <p style="font-size: 13px; color: #14181e; margin: 6px 0 14px;">
                {{ element.config.quote.value || $tc('sw-cms.elements.frinexTestimonial.placeholder.quote') }}
            </p>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="width: 32px; height: 32px; border-radius: 50%; background: #d0d5db; flex-shrink: 0;"></span>
                <span>
                    <span style="display: block; font-weight: 700; font-size: 12px; color: #14181e;">
                        {{ element.config.authorName.value || $tc('sw-cms.elements.frinexTestimonial.placeholder.author') }}
                    </span>
                    <span style="display: block; font-size: 11px; color: #5b6470;">
                        {{ element.config.authorRole.value }}
                    </span>
                </span>
            </div>
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    created() {
        this.initElementConfig('frinex-testimonial');
        this.initElementData('frinex-testimonial');
    },
});

Shopware.Component.register('sw-cms-el-config-frinex-testimonial', {
    template: `
        <div class="sw-cms-el-config-frinex-testimonial">
            <mt-textarea
                v-model="element.config.quote.value"
                :label="$tc('sw-cms.elements.frinexTestimonial.config.quote')" />
            <mt-text-field
                v-model="element.config.authorName.value"
                :label="$tc('sw-cms.elements.frinexTestimonial.config.authorName')" />
            <mt-text-field
                v-model="element.config.authorRole.value"
                :label="$tc('sw-cms.elements.frinexTestimonial.config.authorRole')" />
            <sw-media-field
                v-model:value="element.config.media.value"
                :label="$tc('sw-cms.elements.frinexTestimonial.config.media')" />
        </div>
    `,
    mixins: [Shopware.Mixin.getByName('cms-element')],
    created() {
        this.initElementConfig('frinex-testimonial');
    },
});

Shopware.Component.register('sw-cms-el-preview-frinex-testimonial', {
    template: `
        <div style="padding: 12px; background: #f4f5f7; border-radius: 4px;">
            <div style="width: 85%; height: 5px; background: #d0d5db; border-radius: 3px; margin-bottom: 4px;"></div>
            <div style="width: 70%; height: 5px; background: #d0d5db; border-radius: 3px; margin-bottom: 10px;"></div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 14px; height: 14px; border-radius: 50%; background: #9fb4c8;"></span>
                <span style="width: 40%; height: 5px; background: #c4cad1; border-radius: 3px;"></span>
            </div>
        </div>
    `,
});

Shopware.Service('cmsService').registerCmsElement({
    name: 'frinex-testimonial',
    label: 'sw-cms.elements.frinexTestimonial.label',
    component: 'sw-cms-el-frinex-testimonial',
    configComponent: 'sw-cms-el-config-frinex-testimonial',
    previewComponent: 'sw-cms-el-preview-frinex-testimonial',
    defaultConfig: {
        quote: { source: 'static', value: '' },
        authorName: { source: 'static', value: '' },
        authorRole: { source: 'static', value: '' },
        media: { source: 'static', value: null, entity: { name: 'media' } },
    },
});
