<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * Migration 1755648000CustomerRequisitionFields
 *
 * Legt ein Custom-Field-Set „B2B / Einkauf" am Kunden an, mit den
 * Stammdaten-Feldern Abteilung (zb_b2b_department) und Kostenstelle
 * (zb_b2b_cost_center). Durch die Relation zur Entität „customer"
 * rendert die Administration die Felder automatisch auf der
 * Kunden-Detailseite — dort werden sie gepflegt. Die Bedarfsanforderung
 * (frontend.requisition.page) liest sie und belegt das Formular vor.
 */
class Migration1755648000CustomerRequisitionFields extends MigrationStep
{
    private const SET_ID = 'a1b2c3d4e5f647589a0b1c2d3e4f5061';
    private const RELATION_ID = 'b1c2d3e4f5061728394a5b6c7d8e9f01';
    private const FIELD_DEPARTMENT_ID = 'c1d2e3f405162738495a6b7c8d9e0f11';
    private const FIELD_COST_CENTER_ID = 'd1e2f30415263748596a7b8c9d0e1f21';

    public function getCreationTimestamp(): int
    {
        return 1755648000;
    }

    public function update(Connection $connection): void
    {
        // Idempotent: bereits angelegt → nichts tun
        $exists = $connection->fetchOne(
            'SELECT 1 FROM `custom_field_set` WHERE `name` = :name',
            ['name' => 'zb_b2b_customer']
        );

        if ($exists) {
            return;
        }

        $now = (new \DateTime())->format('Y-m-d H:i:s.v');

        $connection->insert('custom_field_set', [
            'id' => hex2bin(self::SET_ID),
            'name' => 'zb_b2b_customer',
            'config' => json_encode([
                'label' => [
                    'de-DE' => 'B2B / Einkauf',
                    'en-GB' => 'B2B / Purchasing',
                ],
                'translated' => true,
            ], JSON_THROW_ON_ERROR),
            'active' => 1,
            'position' => 1,
            'created_at' => $now,
        ]);

        $connection->insert('custom_field_set_relation', [
            'id' => hex2bin(self::RELATION_ID),
            'set_id' => hex2bin(self::SET_ID),
            'entity_name' => 'customer',
            'created_at' => $now,
        ]);

        $connection->insert('custom_field', [
            'id' => hex2bin(self::FIELD_DEPARTMENT_ID),
            'name' => 'zb_b2b_department',
            'type' => 'text',
            'config' => json_encode([
                'label' => [
                    'de-DE' => 'Abteilung',
                    'en-GB' => 'Department',
                ],
                'helpText' => [
                    'de-DE' => 'Standard-Abteilung für die interne Bedarfsanforderung.',
                    'en-GB' => 'Default department for the internal requisition form.',
                ],
                'componentName' => 'sw-field',
                'customFieldType' => 'text',
                'customFieldPosition' => 1,
                'type' => 'text',
            ], JSON_THROW_ON_ERROR),
            'active' => 1,
            'set_id' => hex2bin(self::SET_ID),
            'created_at' => $now,
        ]);

        $connection->insert('custom_field', [
            'id' => hex2bin(self::FIELD_COST_CENTER_ID),
            'name' => 'zb_b2b_cost_center',
            'type' => 'text',
            'config' => json_encode([
                'label' => [
                    'de-DE' => 'Kostenstelle',
                    'en-GB' => 'Cost center',
                ],
                'helpText' => [
                    'de-DE' => 'Standard-Kostenstelle für die interne Bedarfsanforderung.',
                    'en-GB' => 'Default cost center for the internal requisition form.',
                ],
                'componentName' => 'sw-field',
                'customFieldType' => 'text',
                'customFieldPosition' => 2,
                'type' => 'text',
            ], JSON_THROW_ON_ERROR),
            'active' => 1,
            'set_id' => hex2bin(self::SET_ID),
            'created_at' => $now,
        ]);
    }

    public function updateDestructive(Connection $connection): void
    {
        // Kundendaten bleiben erhalten — nichts löschen.
    }
}
