<?php declare(strict_types=1);

namespace ZeroBudgetB2B\Subscriber;

use Shopware\Core\PlatformRequest;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Routing\RouterInterface;

/**
 * Zugriffsschutz für den internen Einkaufs-Verkaufskanal.
 *
 * Der Kanal „Einkauf intern" (fritz.frinex.de) ist komplett login-pflichtig:
 *  - Nicht eingeloggte Besucher werden auf die Login-Seite umgeleitet.
 *  - Eingeloggte Kunden, die NICHT zur Kundengruppe „Einkauf intern" gehören,
 *    werden auf den Hauptshop umgeleitet.
 *  - Selbst-Registrierung ist blockiert (Register-Routen sind nicht freigegeben);
 *    Konten werden ausschließlich über die Administration angelegt.
 */
class InternalChannelAccessSubscriber implements EventSubscriberInterface
{
    /** Verkaufskanal „Einkauf intern" */
    private const PROTECTED_SALES_CHANNEL_ID = '216e9e38b0656b4b3280e0b3b11270f9';

    /** Kundengruppe „Einkauf intern" */
    private const ALLOWED_CUSTOMER_GROUP_ID = '704ff13a705bd0278c17e434a34ca1de';

    /** Ziel für eingeloggte Kunden ohne Berechtigung */
    private const FALLBACK_URL = 'https://frinex.de';

    /**
     * Routen(-präfixe), die ohne Login erreichbar bleiben müssen,
     * damit Login/Passwort-Wiederherstellung funktionieren.
     */
    private const PUBLIC_ROUTE_PREFIXES = [
        'frontend.account.login',
        'frontend.account.logout',
        'frontend.account.recover',
        'frontend.cookie',
        'frontend.captcha',
        'frontend.error',
        'frontend.maintenance',
        // ESI-Subrequests für Header/Footer — ohne diese Freigabe bricht das
        // Seiten-Rendering mit HTTP 500 ab (EsiDecoration erwartet Status 200).
        'frontend.header',
        'frontend.footer',
        // Warenkorb-Widget im Header (XHR /widgets/checkout/info): eine
        // Umleitung zur Login-SEITE knallt hier mit „can't be requested via
        // XmlHttpRequest" und das JS injiziert die Fehlerseite in den Header
        'frontend.checkout.info',
    ];

    public function __construct(private readonly RouterInterface $router)
    {
    }

    public static function getSubscribedEvents(): array
    {
        // Nach ContextResolverListener (Priorität -10) und Scope-Validierung (-20),
        // damit der SalesChannelContext bereits am Request hängt.
        return [KernelEvents::CONTROLLER => ['onKernelController', -25]];
    }

    public function onKernelController(ControllerEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();

        if ($request->attributes->get(PlatformRequest::ATTRIBUTE_SALES_CHANNEL_ID) !== self::PROTECTED_SALES_CHANNEL_ID) {
            return;
        }

        $context = $request->attributes->get(PlatformRequest::ATTRIBUTE_SALES_CHANNEL_CONTEXT_OBJECT);
        if (!$context instanceof SalesChannelContext) {
            return;
        }

        $route = (string) $request->attributes->get('_route');
        foreach (self::PUBLIC_ROUTE_PREFIXES as $prefix) {
            if (\str_starts_with($route, $prefix)) {
                return;
            }
        }

        $customer = $context->getCustomer();

        if ($customer === null) {
            // XHR nie auf die Login-Seite umleiten — Page-Routen sind per
            // XmlHttpRequest nicht aufrufbar (500); stattdessen leerer 401,
            // damit Widgets still leer bleiben statt Fehlerseiten einzubetten
            if ($request->isXmlHttpRequest()) {
                $event->setController(static fn (): Response => new Response('', Response::HTTP_UNAUTHORIZED));

                return;
            }

            $url = $this->router->generate('frontend.account.login.page', [
                'redirectTo' => 'frontend.home.page',
            ]);
            $event->setController(static fn (): RedirectResponse => new RedirectResponse($url));

            return;
        }

        if ($customer->getGroupId() !== self::ALLOWED_CUSTOMER_GROUP_ID) {
            if ($request->isXmlHttpRequest()) {
                $event->setController(static fn (): Response => new Response('', Response::HTTP_FORBIDDEN));

                return;
            }

            $event->setController(static fn (): RedirectResponse => new RedirectResponse(self::FALLBACK_URL));
        }
    }
}
