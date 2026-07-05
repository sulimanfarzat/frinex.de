<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * Migration 1700000000CreateB2BRequest
 * Erstellt die Tabelle zur Speicherung der B2B-Registrierungsanfragen.
 */
class Migration1700000000CreateB2BRequest extends MigrationStep
{
    // Diese Methode gibt den Timestamp dieser Migration zurück
    public function getCreationTimestamp(): int
    {
        // Dies sollte der tatsächliche Unix-Timestamp der Erstellung sein. 
        // Wir verwenden hier einen Platzhalter.
        return 1700000000;
    }

    // Diese Methode wird beim Installieren oder Updaten des Plugins ausgeführt
    public function update(Connection $connection): void
    {
        $sql = <<<SQL
            CREATE TABLE IF NOT EXISTS `zero_budget_b2b_request` (
                `id` BINARY(16) NOT NULL,
                `customer_id` BINARY(16) NOT NULL,
                `status` VARCHAR(255) NOT NULL, -- pending, approved, denied
                `document_media_id` BINARY(16) NULL,
                `created_at` DATETIME(3) NOT NULL,
                `updated_at` DATETIME(3) NULL,
                PRIMARY KEY (`id`),
                KEY `fk.zero_budget_b2b_request.customer_id` (`customer_id`),
                CONSTRAINT `fk.zero_budget_b2b_request.customer_id` FOREIGN KEY (`customer_id`)
                    REFERENCES `customer` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        SQL;

        $connection->executeStatement($sql);
    }

    // Diese Methode wird bei der Deinstallation des Plugins (mit Datenlöschung) ausgeführt
    public function updateDestructive(Connection $connection): void
    {
        // Wir löschen die Tabelle hier nicht, da dies ein destruktiver Schritt wäre.
        // Das Löschen der Daten erfolgt über die deleteData-Methode im Plugin-Lebenszyklus.
    }
}
