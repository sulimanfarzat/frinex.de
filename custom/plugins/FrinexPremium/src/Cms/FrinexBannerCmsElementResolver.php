<?php declare(strict_types=1);

namespace FrinexPremium\Cms;

class FrinexBannerCmsElementResolver extends AbstractFrinexMediaCmsElementResolver
{
    public function getType(): string
    {
        return 'frinex-banner';
    }
}
