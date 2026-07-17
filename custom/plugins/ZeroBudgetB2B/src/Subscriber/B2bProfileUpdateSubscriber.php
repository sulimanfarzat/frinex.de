<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Subscriber;

use Shopware\Core\Checkout\Customer\CustomerEntity;
use Shopware\Core\PlatformRequest;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use ZeroBudgetB2B\Service\B2bDocumentStorage;

/**
 * Wechsel auf „Gewerblich" im Kundenprofil: ohne gültigen
 * Handelsregisterauszug/Gewerbeschein (PDF/JPG/PNG, max. 5 MB) wird
 * das Speichern abgebrochen und zurück zum Profil geleitet. Mit
 * gültigem Upload wird das Dokument abgelegt und ein B2B-Antrag
 * (pending) erzeugt — gleiche Mechanik wie bei der Registrierung.
 *
 * Läuft als kernel.controller-Hook vor dem Core-Controller, weil der
 * Profil-Speicherweg des Cores keine Datei-Uploads kennt.
 */
class B2bProfileUpdateSubscriber implements EventSubscriberInterface
{
    private const UPLOAD_FIELD = 'b2b_document_upload';

    public function __construct(
        private readonly B2bDocumentStorage $documentStorage,
        private readonly UrlGeneratorInterface $router
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        // Priorität -15: Shopwares ContextResolverListener (Priorität -10)
        // muss vorher gelaufen sein, sonst liegt der SalesChannel-Kontext
        // noch nicht als Request-Attribut vor
        return [KernelEvents::CONTROLLER => ['onController', -15]];
    }

    public function onController(ControllerEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();

        if ($request->attributes->get('_route') !== 'frontend.account.profile.save') {
            return;
        }

        $context = $request->attributes->get(PlatformRequest::ATTRIBUTE_SALES_CHANNEL_CONTEXT_OBJECT);
        if (!$context instanceof SalesChannelContext) {
            return;
        }

        $customer = $context->getCustomer();
        if ($customer === null) {
            return;
        }

        // nur der Wechsel Privat → Gewerblich braucht einen Nachweis
        if ($request->request->get('accountType') !== CustomerEntity::ACCOUNT_TYPE_BUSINESS
            || $customer->getAccountType() === CustomerEntity::ACCOUNT_TYPE_BUSINESS
        ) {
            return;
        }

        $file = $request->files->get(self::UPLOAD_FIELD);

        if (!$file instanceof UploadedFile
            || !$file->isValid()
            || !$this->documentStorage->isAcceptable($file)
        ) {
            $session = $request->getSession();
            if ($session instanceof Session) {
                $session->getFlashBag()->add(
                    'danger',
                    'Für den Wechsel zu einem Gewerbekonto laden Sie bitte einen Handelsregisterauszug oder Gewerbeschein hoch (PDF, JPG oder PNG, max. 5 MB).'
                );
            }

            $url = $this->router->generate('frontend.account.profile.page');
            $event->setController(static fn (): RedirectResponse => new RedirectResponse($url));

            return;
        }

        $mediaId = $this->documentStorage->storeDocument($file, $customer, $context->getContext());
        $this->documentStorage->createRequest($customer, $mediaId);
    }
}
