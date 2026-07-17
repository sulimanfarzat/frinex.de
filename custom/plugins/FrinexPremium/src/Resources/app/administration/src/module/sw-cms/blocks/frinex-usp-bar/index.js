/**
 * Block „FRINEX USP-Leiste" — 4 Spalten mit je einem frinex-usp-item
 * (Icon + Titel + Kurztext), sinnvoll direkt unter dem Hero.
 */

Shopware.Component.register('sw-cms-block-frinex-usp-bar', {
    template: `
        <div class="sw-cms-block-frinex-usp-bar"
             style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
            <slot name="first"></slot>
            <slot name="second"></slot>
            <slot name="third"></slot>
            <slot name="fourth"></slot>
        </div>
    `,
});

Shopware.Component.register('sw-cms-preview-frinex-usp-bar', {
    template: `
        <div style="padding: 12px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
            <div v-for="n in 4" :key="n" style="text-align: center;">
                <div style="width: 18px; height: 18px; border-radius: 50%; background: #e8eef5; margin: 0 auto 5px;"></div>
                <div style="width: 80%; height: 5px; background: #d0d5db; border-radius: 3px; margin: 0 auto 3px;"></div>
                <div style="width: 95%; height: 3px; background: #e4e7eb; border-radius: 2px; margin: 0 auto;"></div>
            </div>
        </div>
    `,
});

const uspItemDefault = (title, text, icon) => ({
    type: 'frinex-usp-item',
    default: {
        config: {
            icon: { source: 'static', value: icon },
            title: { source: 'static', value: title },
            text: { source: 'static', value: text },
        },
    },
});

Shopware.Service('cmsService').registerCmsBlock({
    name: 'frinex-usp-bar',
    label: 'sw-cms.blocks.frinex.uspBar.label',
    category: 'text-image',
    component: 'sw-cms-block-frinex-usp-bar',
    previewComponent: 'sw-cms-preview-frinex-usp-bar',
    defaultConfig: {
        marginBottom: null,
        marginTop: null,
        marginLeft: null,
        marginRight: null,
        sizingMode: 'boxed',
    },
    slots: {
        first: uspItemDefault('Nettopreise', 'Transparente B2B-Konditionen', 'tag'),
        second: uspItemDefault('Kauf auf Rechnung', 'Zahlungsziel für Geschäftskunden', 'invoice'),
        third: uspItemDefault('Versand in 24 h', 'Heute bestellt, morgen versandt', 'truck'),
        fourth: uspItemDefault('Persönlicher Ansprechpartner', 'Direkter Draht statt Hotline', 'headset'),
    },
});
