<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Subscriber;

use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;
use Shopware\Core\Checkout\Customer\CustomerEntity;
use Shopware\Core\Checkout\Customer\Event\CustomerDoubleOptInRegistrationEvent;
use Shopware\Core\Checkout\Customer\Event\CustomerRegisterEvent;
use Shopware\Core\Content\Media\File\MediaFile;
use Shopware\Core\Content\Media\MediaService;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\Uuid\Uuid;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Legt bei einer Geschäftskunden-Registrierung einen Eintrag in
 * zero_budget_b2b_request an und speichert den hochgeladenen
 * Handelsregisterauszug im Media-System.
 *
 * Der Upload darf die Registrierung nie zum Scheitern bringen:
 * Fehler werden geloggt, der Antrag wird trotzdem (ohne Dokument) angelegt.
 */
class B2bRegistrationSubscriber implements EventSubscriberInterface
{
    private const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
    private const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private const UPLOAD_FIELD = 'b2b_document_upload';

    public function __construct(
        private readonly MediaService $mediaService,
        private readonly Connection $connection,
        private readonly RequestStack $requestStack,
        private readonly LoggerInterface $logger
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        // Bei aktiviertem Double-Opt-In feuert Shopware statt CustomerRegisterEvent
        // das DoubleOptIn-Event - beide abdecken.
        return [
            CustomerRegisterEvent::class => 'onCustomerRegister',
            CustomerDoubleOptInRegistrationEvent::class => 'onCustomerDoubleOptInRegister',
        ];
    }

    public function onCustomerRegister(CustomerRegisterEvent $event): void
    {
        $this->handleRegistration($event->getCustomer(), $event->getContext());
    }

    public function onCustomerDoubleOptInRegister(CustomerDoubleOptInRegistrationEvent $event): void
    {
        $this->handleRegistration($event->getCustomer(), $event->getContext());
    }

    private function handleRegistration(CustomerEntity $customer, Context $context): void
    {
        $request = $this->requestStack->getMainRequest();

        if ($request === null
            || $request->request->get('accountType') !== CustomerEntity::ACCOUNT_TYPE_BUSINESS
        ) {
            return;
        }

        $mediaId = null;
        $file = $request->files->get(self::UPLOAD_FIELD);

        if ($file instanceof UploadedFile && $file->isValid()) {
            $mediaId = $this->saveDocument($file, $customer, $context);
        }

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

    private function saveDocument(UploadedFile $file, CustomerEntity $customer, Context $context): ?string
    {
        $mimeType = (string) $file->getMimeType();

        if (!\in_array($mimeType, self::ALLOWED_MIME_TYPES, true)) {
            $this->logger->warning('ZeroBudgetB2B: Upload mit unzulässigem Dateityp abgelehnt', [
                'customerId' => $customer->getId(),
                'mimeType' => $mimeType,
            ]);

            return null;
        }

        if ((int) $file->getSize() > self::MAX_FILE_SIZE) {
            $this->logger->warning('ZeroBudgetB2B: Upload größer als 5 MB abgelehnt', [
                'customerId' => $customer->getId(),
                'size' => $file->getSize(),
            ]);

            return null;
        }

        try {
            $mediaFile = new MediaFile(
                $file->getPathname(),
                $mimeType,
                (string) $file->getClientOriginalExtension(),
                (int) $file->getSize()
            );

            $filename = sprintf(
                'handelsregister-%s-%s',
                $customer->getCustomerNumber(),
                substr(Uuid::randomHex(), 0, 8)
            );

            return $this->mediaService->saveMediaFile(
                $mediaFile,
                $filename,
                $context,
                'customer',
                null,
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
}
