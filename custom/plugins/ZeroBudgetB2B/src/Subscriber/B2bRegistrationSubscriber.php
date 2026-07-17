<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Subscriber;

use Shopware\Core\Checkout\Customer\CustomerEntity;
use Shopware\Core\Checkout\Customer\Event\CustomerDoubleOptInRegistrationEvent;
use Shopware\Core\Checkout\Customer\Event\CustomerRegisterEvent;
use Shopware\Core\Framework\Context;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RequestStack;
use ZeroBudgetB2B\Service\B2bDocumentStorage;

/**
 * Legt bei einer Geschäftskunden-Registrierung einen Eintrag in
 * zero_budget_b2b_request an und speichert den hochgeladenen
 * Handelsregisterauszug im Media-System (via B2bDocumentStorage —
 * gleiche Mechanik wie der Wechsel auf Gewerbekonto im Profil).
 *
 * Der Upload darf die Registrierung nie zum Scheitern bringen:
 * Fehler werden geloggt, der Antrag wird trotzdem (ohne Dokument) angelegt.
 */
class B2bRegistrationSubscriber implements EventSubscriberInterface
{
    private const UPLOAD_FIELD = 'b2b_document_upload';

    public function __construct(
        private readonly B2bDocumentStorage $documentStorage,
        private readonly RequestStack $requestStack
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
            $mediaId = $this->documentStorage->storeDocument($file, $customer, $context);
        }

        $this->documentStorage->createRequest($customer, $mediaId);
    }
}
