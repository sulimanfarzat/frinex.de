<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Service;

use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;
use Shopware\Core\Checkout\Customer\CustomerEntity;
use Shopware\Core\Content\Media\File\MediaFile;
use Shopware\Core\Content\Media\MediaService;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\Uuid\Uuid;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Speichert Handelsregisterauszug/Gewerbeschein im Media-System und
 * legt den zugehörigen B2B-Antrag (zero_budget_b2b_request) an.
 * Gemeinsam genutzt von Registrierung (B2bRegistrationSubscriber)
 * und Profil-Wechsel auf Gewerbekonto (B2bProfileUpdateSubscriber).
 */
class B2bDocumentStorage
{
    public const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
    public const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    // Medienordner, in dem alle Nachweise abgelegt werden
    private const MEDIA_FOLDER_NAME = 'Gewerbe Unterlagen';

    private ?string $folderId = null;

    public function __construct(
        private readonly MediaService $mediaService,
        private readonly Connection $connection,
        private readonly LoggerInterface $logger,
        private readonly EntityRepository $mediaRepository,
        private readonly EntityRepository $mediaFolderRepository
    ) {
    }

    /**
     * Dateityp/Größe prüfen — ohne Nebenwirkungen, für Vorab-Validierung.
     */
    public function isAcceptable(UploadedFile $file): bool
    {
        return \in_array((string) $file->getMimeType(), self::ALLOWED_MIME_TYPES, true)
            && (int) $file->getSize() <= self::MAX_FILE_SIZE;
    }

    /**
     * Dokument im Media-System ablegen; gibt die Media-ID zurück oder
     * null (abgelehnt/fehlgeschlagen — geloggt, wirft nie).
     */
    public function storeDocument(UploadedFile $file, CustomerEntity $customer, Context $context): ?string
    {
        if (!$this->isAcceptable($file)) {
            $this->logger->warning('ZeroBudgetB2B: Upload abgelehnt (Dateityp oder Größe)', [
                'customerId' => $customer->getId(),
                'mimeType' => (string) $file->getMimeType(),
                'size' => $file->getSize(),
            ]);

            return null;
        }

        try {
            $mediaFile = new MediaFile(
                $file->getPathname(),
                (string) $file->getMimeType(),
                (string) $file->getClientOriginalExtension(),
                (int) $file->getSize()
            );

            // bewusst random_bytes statt Uuid::randomHex(): UUIDv7 beginnt
            // mit einem Zeitstempel — zwei Uploads kurz nacheinander bekämen
            // denselben Suffix und kollidierten („file already exists")
            $filename = sprintf(
                'handelsregister-%s-%s',
                $customer->getCustomerNumber(),
                bin2hex(random_bytes(4))
            );

            // Media-Eintrag vorab im Ordner „Gewerbe Unterlagen" anlegen —
            // MediaService kennt nur Default-Ordner von Entitäten, keinen
            // frei benannten Ordner, daher mit fester Media-ID arbeiten
            $mediaId = Uuid::randomHex();
            $this->mediaRepository->create([[
                'id' => $mediaId,
                'private' => false,
                'mediaFolderId' => $this->getFolderId($context),
            ]], $context);

            return $this->mediaService->saveMediaFile(
                $mediaFile,
                $filename,
                $context,
                null,
                $mediaId,
                false
            );
        } catch (\Throwable $e) {
            $this->logger->error('ZeroBudgetB2B: Dokument-Upload konnte nicht gespeichert werden', [
                'customerId' => $customer->getId(),
                'exception' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Ordner „Gewerbe Unterlagen" in der Medienverwaltung — einmalig
     * anlegen, danach wiederverwenden (ID wird pro Request gecacht).
     */
    private function getFolderId(Context $context): string
    {
        if ($this->folderId !== null) {
            return $this->folderId;
        }

        $criteria = (new Criteria())
            ->addFilter(new EqualsFilter('name', self::MEDIA_FOLDER_NAME))
            ->setLimit(1);

        $folderId = $this->mediaFolderRepository->searchIds($criteria, $context)->firstId();

        if ($folderId === null) {
            $folderId = Uuid::randomHex();
            $this->mediaFolderRepository->create([[
                'id' => $folderId,
                'name' => self::MEDIA_FOLDER_NAME,
                'useParentConfiguration' => false,
                // Nachweise sind PDFs/Scans — keine Thumbnail-Generierung
                'configuration' => [
                    'createThumbnails' => false,
                ],
            ]], $context);
        }

        return $this->folderId = $folderId;
    }

    /**
     * B2B-Antrag anlegen (status pending). Wirft nie — Fehler werden
     * geloggt, damit Registrierung/Profil-Speichern nie daran scheitern.
     */
    public function createRequest(CustomerEntity $customer, ?string $mediaId): void
    {
        try {
            $this->connection->insert('zero_budget_b2b_request', [
                'id' => Uuid::randomBytes(),
                'customer_id' => Uuid::fromHexToBytes($customer->getId()),
                'status' => 'pending',
                'document_media_id' => $mediaId !== null ? Uuid::fromHexToBytes($mediaId) : null,
                'created_at' => (new \DateTimeImmutable())->format('Y-m-d H:i:s.v'),
            ]);
        } catch (\Throwable $e) {
            $this->logger->error('ZeroBudgetB2B: B2B-Antrag konnte nicht gespeichert werden', [
                'customerId' => $customer->getId(),
                'exception' => $e->getMessage(),
            ]);
        }
    }
}
