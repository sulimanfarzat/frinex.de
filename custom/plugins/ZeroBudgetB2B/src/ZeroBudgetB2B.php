<?php declare(strict_types=1);

namespace ZeroBudgetB2B;

use Shopware\Core\Framework\Plugin;
use Shopware\Core\Framework\Plugin\Context\UninstallContext; // HINZUGEFÜGT
use Shopware\Storefront\Framework\ThemeInterface; // HINZUGEFÜGT
use Symfony\Component\DependencyInjection\ContainerBuilder; // HINZUGEFÜGT

class ZeroBudgetB2B extends Plugin implements ThemeInterface // HINZUGEFÜGT
{
	/**
     * Setzt den Pfad, damit Services und Views gefunden werden.
     */
    public function buildResources(ContainerBuilder $container): void // HINZUGEFÜGT
    {
        $container->setParameter('zero_budget_b2b.resource_path', $this->getPath() . '/src/Resources/');
        parent::buildResources($container);
    }
    /**
     * Muss UninstallContext verwenden, nicht den Basis-Context
     */
    public function uninstall(UninstallContext $uninstallContext): void // KORRIGIERTE SIGNATUR
    {
        parent::uninstall($uninstallContext);
    }
}
