<?php declare(strict_types=1);

namespace FrinexPremium\Cms;

class FrinexHeroCmsElementResolver extends AbstractFrinexMediaCmsElementResolver
{
    public function getType(): string
    {
        return 'frinex-hero';
    }
}
