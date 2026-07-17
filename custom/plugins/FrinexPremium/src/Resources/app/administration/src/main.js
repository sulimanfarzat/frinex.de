/**
 * FRINEX Premium — Admin-Einstiegspunkt
 * Registriert die FRINEX-CMS-Elemente und -Blöcke für die
 * Erlebniswelten. Elemente zuerst, da die Blöcke sie referenzieren.
 */

import './module/sw-cms/elements/frinex-hero';
import './module/sw-cms/elements/frinex-usp-item';
import './module/sw-cms/elements/frinex-category-grid';
import './module/sw-cms/elements/frinex-banner';
import './module/sw-cms/elements/frinex-testimonial';
import './module/sw-cms/elements/frinex-cta';

import './module/sw-cms/blocks/frinex-hero';
import './module/sw-cms/blocks/frinex-usp-bar';
import './module/sw-cms/blocks/frinex-category-grid';
import './module/sw-cms/blocks/frinex-product-slider';
import './module/sw-cms/blocks/frinex-banner';
import './module/sw-cms/blocks/frinex-logo-bar';
import './module/sw-cms/blocks/frinex-testimonials';
import './module/sw-cms/blocks/frinex-cta';

import deDE from './module/sw-cms/snippet/de-DE.json';
import enGB from './module/sw-cms/snippet/en-GB.json';

Shopware.Locale.extend('de-DE', deDE);
Shopware.Locale.extend('en-GB', enGB);
