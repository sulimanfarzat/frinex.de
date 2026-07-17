<?php declare(strict_types=1);

namespace FrinexPremium\Cms;

class FrinexTestimonialCmsElementResolver extends AbstractFrinexMediaCmsElementResolver
{
    public function getType(): string
    {
        return 'frinex-testimonial';
    }
}
