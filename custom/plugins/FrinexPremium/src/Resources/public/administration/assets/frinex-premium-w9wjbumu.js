Shopware.Component.register("sw-cms-el-frinex-hero",{template:`
        <div class="sw-cms-el-frinex-hero"
             style="min-height: 340px; display: flex; align-items: center; border-radius: 4px;
                    background: linear-gradient(135deg, #0f4c81 0%, #0a3b65 100%); overflow: hidden;">
            <div style="padding: 40px; max-width: 65%;">
                <h2 style="color: #fff; font-weight: 800; margin: 0 0 8px;">
                    {{ element.config.headline.value || $tc('sw-cms.elements.frinexHero.placeholder.headline') }}
                </h2>
                <p style="color: rgba(255,255,255,.85); margin: 0 0 20px;">
                    {{ element.config.subline.value || $tc('sw-cms.elements.frinexHero.placeholder.subline') }}
                </p>
                <span style="display: inline-block; background: #fff; color: #0f4c81; border-radius: 99px;
                             padding: 8px 22px; font-weight: 700; margin-right: 8px;">
                    {{ element.config.ctaPrimaryLabel.value || $tc('sw-cms.elements.frinexHero.placeholder.ctaPrimary') }}
                </span>
                <div v-if="element.config.showTrustBar.value"
                     style="margin-top: 28px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,.25);
                            color: rgba(255,255,255,.85); font-size: 12px;">
                    ✓ Nettopreise &nbsp; ✓ Kauf auf Rechnung &nbsp; ✓ Versand in 24 h &nbsp; ✓ Persönlicher Ansprechpartner
                </div>
            </div>
        </div>
    `,mixins:[Shopware.Mixin.getByName("cms-element")],created(){this.initElementConfig("frinex-hero"),this.initElementData("frinex-hero")}});Shopware.Component.register("sw-cms-el-config-frinex-hero",{template:`
        <div class="sw-cms-el-config-frinex-hero">
            <mt-text-field
                v-model="element.config.headline.value"
                :label="$tc('sw-cms.elements.frinexHero.config.headline')" />
            <mt-textarea
                v-model="element.config.subline.value"
                :label="$tc('sw-cms.elements.frinexHero.config.subline')" />
            <mt-text-field
                v-model="element.config.ctaPrimaryLabel.value"
                :label="$tc('sw-cms.elements.frinexHero.config.ctaPrimaryLabel')"
                :placeholder="$tc('sw-cms.elements.frinexHero.placeholder.ctaPrimary')" />
            <mt-text-field
                v-model="element.config.ctaPrimaryUrl.value"
                :label="$tc('sw-cms.elements.frinexHero.config.ctaPrimaryUrl')"
                :help-text="$tc('sw-cms.elements.frinexHero.config.ctaPrimaryUrlHelp')"
                placeholder="/account/register" />
            <mt-text-field
                v-model="element.config.ctaSecondaryLabel.value"
                :label="$tc('sw-cms.elements.frinexHero.config.ctaSecondaryLabel')"
                :placeholder="$tc('sw-cms.elements.frinexHero.placeholder.ctaSecondary')" />
            <mt-text-field
                v-model="element.config.ctaSecondaryUrl.value"
                :label="$tc('sw-cms.elements.frinexHero.config.ctaSecondaryUrl')"
                :help-text="$tc('sw-cms.elements.frinexHero.config.ctaSecondaryUrlHelp')" />
            <mt-switch
                v-model="element.config.showTrustBar.value"
                :label="$tc('sw-cms.elements.frinexHero.config.showTrustBar')" />
            <sw-media-field
                v-model:value="element.config.media.value"
                :label="$tc('sw-cms.elements.frinexHero.config.media')" />
        </div>
    `,mixins:[Shopware.Mixin.getByName("cms-element")],created(){this.initElementConfig("frinex-hero")}});Shopware.Component.register("sw-cms-el-preview-frinex-hero",{template:`
        <div style="padding: 12px; background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;">
            <div style="width: 55%; height: 8px; background: rgba(255,255,255,.9); border-radius: 4px; margin-bottom: 6px;"></div>
            <div style="width: 75%; height: 5px; background: rgba(255,255,255,.5); border-radius: 4px; margin-bottom: 10px;"></div>
            <div style="width: 34%; height: 10px; background: #f2a900; border-radius: 99px;"></div>
        </div>
    `});Shopware.Service("cmsService").registerCmsElement({name:"frinex-hero",label:"sw-cms.elements.frinexHero.label",component:"sw-cms-el-frinex-hero",configComponent:"sw-cms-el-config-frinex-hero",previewComponent:"sw-cms-el-preview-frinex-hero",defaultConfig:{headline:{source:"static",value:""},subline:{source:"static",value:""},ctaPrimaryLabel:{source:"static",value:""},ctaPrimaryUrl:{source:"static",value:""},ctaSecondaryLabel:{source:"static",value:""},ctaSecondaryUrl:{source:"static",value:""},showTrustBar:{source:"static",value:!0},media:{source:"static",value:null,entity:{name:"media"}}}});Shopware.Component.register("sw-cms-el-frinex-usp-item",{template:`
        <div style="text-align: center; padding: 24px 12px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #f4f5f7; color: #0f4c81;
                        display: inline-flex; align-items: center; justify-content: center;
                        font-size: 20px; margin-bottom: 8px;">✓</div>
            <div style="font-weight: 700; font-size: 14px; color: #14181e;">
                {{ element.config.title.value || $tc('sw-cms.elements.frinexUspItem.placeholder.title') }}
            </div>
            <div style="font-size: 12px; color: #5b6470;">
                {{ element.config.text.value || $tc('sw-cms.elements.frinexUspItem.placeholder.text') }}
            </div>
        </div>
    `,mixins:[Shopware.Mixin.getByName("cms-element")],created(){this.initElementConfig("frinex-usp-item")}});Shopware.Component.register("sw-cms-el-config-frinex-usp-item",{template:`
        <div class="sw-cms-el-config-frinex-usp-item">
            <mt-select
                v-model="element.config.icon.value"
                :label="$tc('sw-cms.elements.frinexUspItem.config.icon')"
                :options="iconOptions" />
            <mt-text-field
                v-model="element.config.title.value"
                :label="$tc('sw-cms.elements.frinexUspItem.config.title')" />
            <mt-text-field
                v-model="element.config.text.value"
                :label="$tc('sw-cms.elements.frinexUspItem.config.text')" />
        </div>
    `,mixins:[Shopware.Mixin.getByName("cms-element")],computed:{iconOptions(){return["truck","invoice","headset","tag","shield","box"].map(e=>({id:e,value:e,label:this.$tc(`sw-cms.elements.frinexUspItem.icons.${e}`)}))}},created(){this.initElementConfig("frinex-usp-item")}});Shopware.Component.register("sw-cms-el-preview-frinex-usp-item",{template:`
        <div style="padding: 12px; text-align: center;">
            <div style="width: 22px; height: 22px; border-radius: 50%; background: #e8eef5; margin: 0 auto 6px;"></div>
            <div style="width: 60%; height: 6px; background: #d0d5db; border-radius: 3px; margin: 0 auto 4px;"></div>
            <div style="width: 80%; height: 4px; background: #e4e7eb; border-radius: 3px; margin: 0 auto;"></div>
        </div>
    `});Shopware.Service("cmsService").registerCmsElement({name:"frinex-usp-item",label:"sw-cms.elements.frinexUspItem.label",component:"sw-cms-el-frinex-usp-item",configComponent:"sw-cms-el-config-frinex-usp-item",previewComponent:"sw-cms-el-preview-frinex-usp-item",defaultConfig:{icon:{source:"static",value:"truck"},title:{source:"static",value:""},text:{source:"static",value:""}}});Shopware.Component.register("sw-cms-el-frinex-category-grid",{template:`
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
    `,mixins:[Shopware.Mixin.getByName("cms-element")],computed:{tileCount(){var i,t,n;const e=((n=(t=(i=this.element)==null?void 0:i.config)==null?void 0:t.categories)==null?void 0:n.value)??[];return Math.min(Math.max(e.length,4),8)}},created(){this.initElementConfig("frinex-category-grid"),this.initElementData("frinex-category-grid")}});Shopware.Component.register("sw-cms-el-config-frinex-category-grid",{template:`
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
    `,mixins:[Shopware.Mixin.getByName("cms-element")],inject:["repositoryFactory"],computed:{categoryRepository(){return this.repositoryFactory.create("category")}},created(){this.initElementConfig("frinex-category-grid")}});Shopware.Component.register("sw-cms-el-preview-frinex-category-grid",{template:`
        <div style="padding: 10px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
            <div v-for="n in 6" :key="n" style="aspect-ratio: 4/3; border-radius: 4px; background: #e8eef5;"></div>
        </div>
    `});Shopware.Service("cmsService").registerCmsElement({name:"frinex-category-grid",label:"sw-cms.elements.frinexCategoryGrid.label",component:"sw-cms-el-frinex-category-grid",configComponent:"sw-cms-el-config-frinex-category-grid",previewComponent:"sw-cms-el-preview-frinex-category-grid",defaultConfig:{headline:{source:"static",value:""},categories:{source:"static",value:[],entity:{name:"category"}}}});Shopware.Component.register("sw-cms-el-frinex-banner",{template:`
        <div style="min-height: 200px; display: flex; align-items: center; border-radius: 8px;
                    background: linear-gradient(135deg, #0f4c81, #0a3b65);"
             :style="{ justifyContent: element.config.contentAlign.value === 'center' ? 'center' : 'flex-start',
                       textAlign: element.config.contentAlign.value === 'center' ? 'center' : 'left' }">
            <div style="padding: 28px; max-width: 60%;">
                <div style="color: #f2a900; font-size: 11px; font-weight: 700; text-transform: uppercase;
                            letter-spacing: .08em; margin-bottom: 6px;">
                    {{ element.config.eyebrow.value }}
                </div>
                <div style="color: #fff; font-weight: 800; font-size: 18px; margin-bottom: 6px;">
                    {{ element.config.headline.value || $tc('sw-cms.elements.frinexBanner.placeholder.headline') }}
                </div>
                <div style="color: rgba(255,255,255,.85); font-size: 13px; margin-bottom: 14px;">
                    {{ element.config.text.value }}
                </div>
                <span style="display: inline-block; background: #fff; color: #0f4c81; border-radius: 99px;
                             padding: 6px 18px; font-weight: 700; font-size: 13px;">
                    {{ element.config.ctaLabel.value || $tc('sw-cms.elements.frinexBanner.placeholder.cta') }}
                </span>
            </div>
        </div>
    `,mixins:[Shopware.Mixin.getByName("cms-element")],created(){this.initElementConfig("frinex-banner"),this.initElementData("frinex-banner")}});Shopware.Component.register("sw-cms-el-config-frinex-banner",{template:`
        <div class="sw-cms-el-config-frinex-banner">
            <mt-text-field
                v-model="element.config.eyebrow.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.eyebrow')" />
            <mt-text-field
                v-model="element.config.headline.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.headline')" />
            <mt-textarea
                v-model="element.config.text.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.text')" />
            <mt-text-field
                v-model="element.config.ctaLabel.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.ctaLabel')" />
            <mt-text-field
                v-model="element.config.ctaUrl.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.ctaUrl')"
                :help-text="$tc('sw-cms.elements.frinexBanner.config.ctaUrlHelp')" />
            <mt-select
                v-model="element.config.contentAlign.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.contentAlign')"
                :options="alignOptions" />
            <sw-media-field
                v-model:value="element.config.media.value"
                :label="$tc('sw-cms.elements.frinexBanner.config.media')" />
        </div>
    `,mixins:[Shopware.Mixin.getByName("cms-element")],computed:{alignOptions(){return["left","center"].map(e=>({id:e,value:e,label:this.$tc(`sw-cms.elements.frinexBanner.align.${e}`)}))}},created(){this.initElementConfig("frinex-banner")}});Shopware.Component.register("sw-cms-el-preview-frinex-banner",{template:`
        <div style="padding: 12px; background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;">
            <div style="width: 25%; height: 4px; background: #f2a900; border-radius: 2px; margin-bottom: 6px;"></div>
            <div style="width: 55%; height: 7px; background: rgba(255,255,255,.9); border-radius: 3px; margin-bottom: 8px;"></div>
            <div style="width: 30%; height: 9px; background: #ffffff; border-radius: 99px;"></div>
        </div>
    `});Shopware.Service("cmsService").registerCmsElement({name:"frinex-banner",label:"sw-cms.elements.frinexBanner.label",component:"sw-cms-el-frinex-banner",configComponent:"sw-cms-el-config-frinex-banner",previewComponent:"sw-cms-el-preview-frinex-banner",defaultConfig:{eyebrow:{source:"static",value:""},headline:{source:"static",value:""},text:{source:"static",value:""},ctaLabel:{source:"static",value:""},ctaUrl:{source:"static",value:""},contentAlign:{source:"static",value:"left"},media:{source:"static",value:null,entity:{name:"media"}}}});Shopware.Component.register("sw-cms-el-frinex-testimonial",{template:`
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
    `,mixins:[Shopware.Mixin.getByName("cms-element")],created(){this.initElementConfig("frinex-testimonial"),this.initElementData("frinex-testimonial")}});Shopware.Component.register("sw-cms-el-config-frinex-testimonial",{template:`
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
    `,mixins:[Shopware.Mixin.getByName("cms-element")],created(){this.initElementConfig("frinex-testimonial")}});Shopware.Component.register("sw-cms-el-preview-frinex-testimonial",{template:`
        <div style="padding: 12px; background: #f4f5f7; border-radius: 4px;">
            <div style="width: 85%; height: 5px; background: #d0d5db; border-radius: 3px; margin-bottom: 4px;"></div>
            <div style="width: 70%; height: 5px; background: #d0d5db; border-radius: 3px; margin-bottom: 10px;"></div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 14px; height: 14px; border-radius: 50%; background: #9fb4c8;"></span>
                <span style="width: 40%; height: 5px; background: #c4cad1; border-radius: 3px;"></span>
            </div>
        </div>
    `});Shopware.Service("cmsService").registerCmsElement({name:"frinex-testimonial",label:"sw-cms.elements.frinexTestimonial.label",component:"sw-cms-el-frinex-testimonial",configComponent:"sw-cms-el-config-frinex-testimonial",previewComponent:"sw-cms-el-preview-frinex-testimonial",defaultConfig:{quote:{source:"static",value:""},authorName:{source:"static",value:""},authorRole:{source:"static",value:""},media:{source:"static",value:null,entity:{name:"media"}}}});Shopware.Component.register("sw-cms-el-frinex-cta",{template:`
        <div style="background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 8px; padding: 32px;
                    display: flex; align-items: center; justify-content: space-between; gap: 24px;">
            <div>
                <div style="color: #fff; font-weight: 800; font-size: 18px; margin-bottom: 6px;">
                    {{ element.config.headline.value || $tc('sw-cms.elements.frinexCta.placeholder.headline') }}
                </div>
                <div style="color: rgba(255,255,255,.85); font-size: 13px; margin-bottom: 10px;">
                    {{ element.config.text.value }}
                </div>
                <div style="color: rgba(255,255,255,.9); font-size: 12px;">
                    <div v-for="(benefit, index) in benefits" :key="index" style="margin-bottom: 2px;">
                        <span style="color: #f2a900;">✓</span> {{ benefit }}
                    </div>
                </div>
            </div>
            <span style="flex-shrink: 0; background: #f2a900; color: #14181e; border-radius: 99px;
                         padding: 10px 24px; font-weight: 700; font-size: 13px;">
                {{ element.config.ctaLabel.value || $tc('sw-cms.elements.frinexCta.placeholder.cta') }}
            </span>
        </div>
    `,mixins:[Shopware.Mixin.getByName("cms-element")],computed:{benefits(){var e,i,t;return(((t=(i=(e=this.element)==null?void 0:e.config)==null?void 0:i.benefits)==null?void 0:t.value)||"").split(`
`).map(n=>n.trim()).filter(n=>n.length>0)}},created(){this.initElementConfig("frinex-cta")}});Shopware.Component.register("sw-cms-el-config-frinex-cta",{template:`
        <div class="sw-cms-el-config-frinex-cta">
            <mt-text-field
                v-model="element.config.headline.value"
                :label="$tc('sw-cms.elements.frinexCta.config.headline')" />
            <mt-textarea
                v-model="element.config.text.value"
                :label="$tc('sw-cms.elements.frinexCta.config.text')" />
            <mt-textarea
                v-model="element.config.benefits.value"
                :label="$tc('sw-cms.elements.frinexCta.config.benefits')"
                :help-text="$tc('sw-cms.elements.frinexCta.config.benefitsHelp')" />
            <mt-text-field
                v-model="element.config.ctaLabel.value"
                :label="$tc('sw-cms.elements.frinexCta.config.ctaLabel')" />
            <mt-text-field
                v-model="element.config.ctaUrl.value"
                :label="$tc('sw-cms.elements.frinexCta.config.ctaUrl')"
                :help-text="$tc('sw-cms.elements.frinexCta.config.ctaUrlHelp')"
                placeholder="/account/register" />
        </div>
    `,mixins:[Shopware.Mixin.getByName("cms-element")],created(){this.initElementConfig("frinex-cta")}});Shopware.Component.register("sw-cms-el-preview-frinex-cta",{template:`
        <div style="padding: 12px; background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;
                    display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <div style="flex-grow: 1;">
                <div style="width: 70%; height: 6px; background: rgba(255,255,255,.9); border-radius: 3px; margin-bottom: 5px;"></div>
                <div style="width: 50%; height: 4px; background: rgba(255,255,255,.5); border-radius: 3px;"></div>
            </div>
            <div style="width: 32px; height: 12px; background: #f2a900; border-radius: 99px; flex-shrink: 0;"></div>
        </div>
    `});Shopware.Service("cmsService").registerCmsElement({name:"frinex-cta",label:"sw-cms.elements.frinexCta.label",component:"sw-cms-el-frinex-cta",configComponent:"sw-cms-el-config-frinex-cta",previewComponent:"sw-cms-el-preview-frinex-cta",defaultConfig:{headline:{source:"static",value:""},text:{source:"static",value:""},benefits:{source:"static",value:""},ctaLabel:{source:"static",value:""},ctaUrl:{source:"static",value:""}}});Shopware.Component.register("sw-cms-block-frinex-hero",{template:`
        <div class="sw-cms-block-frinex-hero">
            <slot name="hero"></slot>
        </div>
    `});Shopware.Component.register("sw-cms-preview-frinex-hero",{template:`
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
    `});Shopware.Service("cmsService").registerCmsBlock({name:"frinex-hero",label:"sw-cms.blocks.frinex.hero.label",category:"image",component:"sw-cms-block-frinex-hero",previewComponent:"sw-cms-preview-frinex-hero",defaultConfig:{marginBottom:null,marginTop:null,marginLeft:null,marginRight:null,sizingMode:"full_width"},slots:{hero:"frinex-hero"}});Shopware.Component.register("sw-cms-block-frinex-usp-bar",{template:`
        <div class="sw-cms-block-frinex-usp-bar"
             style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
            <slot name="first"></slot>
            <slot name="second"></slot>
            <slot name="third"></slot>
            <slot name="fourth"></slot>
        </div>
    `});Shopware.Component.register("sw-cms-preview-frinex-usp-bar",{template:`
        <div style="padding: 12px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
            <div v-for="n in 4" :key="n" style="text-align: center;">
                <div style="width: 18px; height: 18px; border-radius: 50%; background: #e8eef5; margin: 0 auto 5px;"></div>
                <div style="width: 80%; height: 5px; background: #d0d5db; border-radius: 3px; margin: 0 auto 3px;"></div>
                <div style="width: 95%; height: 3px; background: #e4e7eb; border-radius: 2px; margin: 0 auto;"></div>
            </div>
        </div>
    `});const a=(e,i,t)=>({type:"frinex-usp-item",default:{config:{icon:{source:"static",value:t},title:{source:"static",value:e},text:{source:"static",value:i}}}});Shopware.Service("cmsService").registerCmsBlock({name:"frinex-usp-bar",label:"sw-cms.blocks.frinex.uspBar.label",category:"text-image",component:"sw-cms-block-frinex-usp-bar",previewComponent:"sw-cms-preview-frinex-usp-bar",defaultConfig:{marginBottom:null,marginTop:null,marginLeft:null,marginRight:null,sizingMode:"boxed"},slots:{first:a("Nettopreise","Transparente B2B-Konditionen","tag"),second:a("Kauf auf Rechnung","Zahlungsziel für Geschäftskunden","invoice"),third:a("Versand in 24 h","Heute bestellt, morgen versandt","truck"),fourth:a("Persönlicher Ansprechpartner","Direkter Draht statt Hotline","headset")}});Shopware.Component.register("sw-cms-block-frinex-category-grid",{template:`
        <div class="sw-cms-block-frinex-category-grid">
            <slot name="grid"></slot>
        </div>
    `});Shopware.Component.register("sw-cms-preview-frinex-category-grid",{template:`
        <div style="padding: 10px;">
            <div style="width: 40%; height: 6px; background: #d0d5db; border-radius: 3px; margin-bottom: 8px;"></div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;">
                <div v-for="n in 8" :key="n" style="aspect-ratio: 4/3; border-radius: 3px;
                     background: linear-gradient(180deg, #e8eef5 60%, #9fb4c8);"></div>
            </div>
        </div>
    `});Shopware.Service("cmsService").registerCmsBlock({name:"frinex-category-grid",label:"sw-cms.blocks.frinex.categoryGrid.label",category:"commerce",component:"sw-cms-block-frinex-category-grid",previewComponent:"sw-cms-preview-frinex-category-grid",defaultConfig:{marginBottom:null,marginTop:null,marginLeft:null,marginRight:null,sizingMode:"boxed"},slots:{grid:"frinex-category-grid"}});Shopware.Component.register("sw-cms-block-frinex-product-slider",{template:`
        <div class="sw-cms-block-frinex-product-slider">
            <slot name="products"></slot>
        </div>
    `});Shopware.Component.register("sw-cms-preview-frinex-product-slider",{template:`
        <div style="padding: 10px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; align-items: end;">
            <div v-for="n in 4" :key="n" style="border: 1px solid #e4e7eb; border-radius: 4px; padding: 6px;">
                <div style="aspect-ratio: 1; background: #f4f5f7; border-radius: 3px; margin-bottom: 5px;"></div>
                <div style="width: 90%; height: 4px; background: #e4e7eb; border-radius: 2px; margin-bottom: 4px;"></div>
                <div style="width: 50%; height: 6px; background: #14181e; border-radius: 2px; margin-bottom: 5px;"></div>
                <div style="width: 100%; height: 9px; background: #0f4c81; border-radius: 99px;"></div>
            </div>
        </div>
    `});Shopware.Service("cmsService").registerCmsBlock({name:"frinex-product-slider",label:"sw-cms.blocks.frinex.productSlider.label",category:"commerce",component:"sw-cms-block-frinex-product-slider",previewComponent:"sw-cms-preview-frinex-product-slider",defaultConfig:{marginBottom:null,marginTop:null,marginLeft:null,marginRight:null,sizingMode:"boxed"},slots:{products:"product-slider"}});Shopware.Component.register("sw-cms-block-frinex-banner",{template:`
        <div class="sw-cms-block-frinex-banner">
            <slot name="banner"></slot>
        </div>
    `});Shopware.Component.register("sw-cms-preview-frinex-banner",{template:`
        <div style="padding: 12px; background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;">
            <div style="width: 22%; height: 4px; background: #f2a900; border-radius: 2px; margin-bottom: 5px;"></div>
            <div style="width: 50%; height: 7px; background: rgba(255,255,255,.9); border-radius: 3px; margin-bottom: 8px;"></div>
            <div style="width: 28%; height: 10px; background: #ffffff; border-radius: 99px;"></div>
        </div>
    `});Shopware.Service("cmsService").registerCmsBlock({name:"frinex-banner",label:"sw-cms.blocks.frinex.banner.label",category:"image",component:"sw-cms-block-frinex-banner",previewComponent:"sw-cms-preview-frinex-banner",defaultConfig:{marginBottom:null,marginTop:null,marginLeft:null,marginRight:null,sizingMode:"boxed"},slots:{banner:"frinex-banner"}});Shopware.Component.register("sw-cms-block-frinex-logo-bar",{template:`
        <div class="sw-cms-block-frinex-logo-bar"
             style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; align-items: center;">
            <slot name="logo-one"></slot>
            <slot name="logo-two"></slot>
            <slot name="logo-three"></slot>
            <slot name="logo-four"></slot>
            <slot name="logo-five"></slot>
            <slot name="logo-six"></slot>
        </div>
    `});Shopware.Component.register("sw-cms-preview-frinex-logo-bar",{template:`
        <div style="padding: 14px; display: flex; justify-content: center; gap: 10px; align-items: center;">
            <div v-for="n in 6" :key="n" style="width: 13%; height: 12px; background: #d0d5db; border-radius: 3px; opacity: .7;"></div>
        </div>
    `});const r={type:"image",default:{config:{displayMode:{source:"static",value:"standard"}}}};Shopware.Service("cmsService").registerCmsBlock({name:"frinex-logo-bar",label:"sw-cms.blocks.frinex.logoBar.label",category:"image",component:"sw-cms-block-frinex-logo-bar",previewComponent:"sw-cms-preview-frinex-logo-bar",defaultConfig:{marginBottom:null,marginTop:null,marginLeft:null,marginRight:null,sizingMode:"boxed"},slots:{"logo-one":r,"logo-two":r,"logo-three":r,"logo-four":r,"logo-five":r,"logo-six":r}});Shopware.Component.register("sw-cms-block-frinex-testimonials",{template:`
        <div class="sw-cms-block-frinex-testimonials"
             style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
            <slot name="one"></slot>
            <slot name="two"></slot>
            <slot name="three"></slot>
        </div>
    `});Shopware.Component.register("sw-cms-preview-frinex-testimonials",{template:`
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
    `});Shopware.Service("cmsService").registerCmsBlock({name:"frinex-testimonials",label:"sw-cms.blocks.frinex.testimonials.label",category:"text-image",component:"sw-cms-block-frinex-testimonials",previewComponent:"sw-cms-preview-frinex-testimonials",defaultConfig:{marginBottom:null,marginTop:null,marginLeft:null,marginRight:null,sizingMode:"boxed"},slots:{one:"frinex-testimonial",two:"frinex-testimonial",three:"frinex-testimonial"}});Shopware.Component.register("sw-cms-block-frinex-cta",{template:`
        <div class="sw-cms-block-frinex-cta">
            <slot name="cta"></slot>
        </div>
    `});Shopware.Component.register("sw-cms-preview-frinex-cta",{template:`
        <div style="padding: 12px; background: linear-gradient(135deg, #0f4c81, #0a3b65); border-radius: 4px;
                    display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <div style="flex-grow: 1;">
                <div style="width: 65%; height: 7px; background: rgba(255,255,255,.9); border-radius: 3px; margin-bottom: 5px;"></div>
                <div style="width: 45%; height: 4px; background: rgba(255,255,255,.5); border-radius: 2px; margin-bottom: 4px;"></div>
                <div style="width: 45%; height: 4px; background: rgba(255,255,255,.5); border-radius: 2px;"></div>
            </div>
            <div style="width: 34px; height: 13px; background: #f2a900; border-radius: 99px; flex-shrink: 0;"></div>
        </div>
    `});Shopware.Service("cmsService").registerCmsBlock({name:"frinex-cta",label:"sw-cms.blocks.frinex.cta.label",category:"text-image",component:"sw-cms-block-frinex-cta",previewComponent:"sw-cms-preview-frinex-cta",defaultConfig:{marginBottom:null,marginTop:null,marginLeft:null,marginRight:null,sizingMode:"boxed"},slots:{cta:"frinex-cta"}});const l={"sw-cms":{blocks:{frinex:{hero:{label:"FRINEX Hero (Startseite)"},uspBar:{label:"FRINEX USP-Leiste (4 Spalten)"},categoryGrid:{label:"FRINEX Kategorien-Grid"},productSlider:{label:"FRINEX Produkt-Slider (B2B)"},banner:{label:"FRINEX Kampagnen-Banner"},logoBar:{label:"FRINEX Logo-Leiste (Referenzen)"},testimonials:{label:"FRINEX Testimonials"},cta:{label:"FRINEX CTA-Sektion (Registrierung)"}}},elements:{frinexHero:{label:"FRINEX Hero",placeholder:{headline:"Headline eingeben …",subline:"Subline eingeben …",ctaPrimary:"Geschäftskonto anlegen",ctaSecondary:"Katalog ansehen"},config:{headline:"Headline",subline:"Subline",ctaPrimaryLabel:"Primärer CTA — Beschriftung",ctaPrimaryUrl:"Primärer CTA — Link",ctaPrimaryUrlHelp:"Leer lassen für die Registrierungsseite (/account/register)",ctaSecondaryLabel:"Sekundärer CTA — Beschriftung",ctaSecondaryUrl:"Sekundärer CTA — Link",ctaSecondaryUrlHelp:"Ohne Link wird der sekundäre CTA ausgeblendet",showTrustBar:"Trust-Leiste anzeigen (Nettopreise, Rechnung, 24-h-Versand, Ansprechpartner)",media:"Hintergrundbild"}},frinexUspItem:{label:"FRINEX USP",placeholder:{title:"USP-Titel",text:"Kurztext"},config:{icon:"Icon",title:"Titel",text:"Kurztext"},icons:{truck:"LKW (Versand)",invoice:"Rechnung",headset:"Headset (Beratung)",tag:"Preisschild (Konditionen)",shield:"Schild (Qualität/Sicherheit)",box:"Paket (Lager/Sortiment)"}},frinexCategoryGrid:{label:"FRINEX Kategorien-Grid",placeholder:{headline:"Unsere Kategorien"},config:{headline:"Überschrift (optional)",categories:"Kategorien",categoriesHelp:"6–8 Kategorien empfohlen; die Reihenfolge der Auswahl bestimmt die Anzeige. Bild = Kategorie-Medium."}},frinexBanner:{label:"FRINEX Kampagnen-Banner",placeholder:{headline:"Banner-Headline",cta:"Mehr erfahren"},config:{eyebrow:"Eyebrow (kleine Zeile über der Headline)",headline:"Headline",text:"Text",ctaLabel:"CTA — Beschriftung",ctaUrl:"CTA — Link",ctaUrlHelp:"Ohne Link wird der Button ausgeblendet",contentAlign:"Ausrichtung",media:"Hintergrundbild"},align:{left:"Links",center:"Zentriert"}},frinexTestimonial:{label:"FRINEX Testimonial",placeholder:{quote:"Zitat eingeben …",author:"Name"},config:{quote:"Zitat",authorName:"Name",authorRole:"Position / Firma",media:"Foto oder Firmenlogo (optional)"}},frinexCta:{label:"FRINEX CTA-Sektion",placeholder:{headline:"Jetzt B2B-Konto eröffnen",cta:"Kostenlos registrieren"},config:{headline:"Headline",text:"Text",benefits:"Vorteile",benefitsHelp:"Eine Zeile = ein Vorteil (wird als Checkliste dargestellt)",ctaLabel:"Button — Beschriftung",ctaUrl:"Button — Link",ctaUrlHelp:"Leer lassen für die Registrierungsseite (/account/register)"}}}}},o={"sw-cms":{blocks:{frinex:{hero:{label:"FRINEX hero (home page)"},uspBar:{label:"FRINEX USP bar (4 columns)"},categoryGrid:{label:"FRINEX category grid"},productSlider:{label:"FRINEX product slider (B2B)"},banner:{label:"FRINEX campaign banner"},logoBar:{label:"FRINEX logo bar (references)"},testimonials:{label:"FRINEX testimonials"},cta:{label:"FRINEX CTA section (registration)"}}},elements:{frinexHero:{label:"FRINEX hero",placeholder:{headline:"Enter headline …",subline:"Enter subline …",ctaPrimary:"Create business account",ctaSecondary:"Browse catalogue"},config:{headline:"Headline",subline:"Subline",ctaPrimaryLabel:"Primary CTA — label",ctaPrimaryUrl:"Primary CTA — link",ctaPrimaryUrlHelp:"Leave empty to link to the registration page (/account/register)",ctaSecondaryLabel:"Secondary CTA — label",ctaSecondaryUrl:"Secondary CTA — link",ctaSecondaryUrlHelp:"Without a link the secondary CTA is hidden",showTrustBar:"Show trust bar (net prices, invoice, 24 h dispatch, account manager)",media:"Background image"}},frinexUspItem:{label:"FRINEX USP",placeholder:{title:"USP title",text:"Short text"},config:{icon:"Icon",title:"Title",text:"Short text"},icons:{truck:"Truck (shipping)",invoice:"Invoice",headset:"Headset (support)",tag:"Price tag (conditions)",shield:"Shield (quality/safety)",box:"Package (stock/range)"}},frinexCategoryGrid:{label:"FRINEX category grid",placeholder:{headline:"Our categories"},config:{headline:"Headline (optional)",categories:"Categories",categoriesHelp:"6–8 categories recommended; selection order defines display order. Image = category media."}},frinexBanner:{label:"FRINEX campaign banner",placeholder:{headline:"Banner headline",cta:"Learn more"},config:{eyebrow:"Eyebrow (small line above the headline)",headline:"Headline",text:"Text",ctaLabel:"CTA — label",ctaUrl:"CTA — link",ctaUrlHelp:"Without a link the button is hidden",contentAlign:"Alignment",media:"Background image"},align:{left:"Left",center:"Centred"}},frinexTestimonial:{label:"FRINEX testimonial",placeholder:{quote:"Enter quote …",author:"Name"},config:{quote:"Quote",authorName:"Name",authorRole:"Role / company",media:"Photo or company logo (optional)"}},frinexCta:{label:"FRINEX CTA section",placeholder:{headline:"Open your B2B account now",cta:"Register for free"},config:{headline:"Headline",text:"Text",benefits:"Benefits",benefitsHelp:"One line = one benefit (rendered as a checklist)",ctaLabel:"Button — label",ctaUrl:"Button — link",ctaUrlHelp:"Leave empty to link to the registration page (/account/register)"}}}}};Shopware.Locale.extend("de-DE",l);Shopware.Locale.extend("en-GB",o);
//# sourceMappingURL=frinex-premium-w9wjbumu.js.map
