import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const ADSENSE_ID = "ca-pub-2189538164956745";
const GTM_ID = "GTM-K2ZHS7DB";

type ConsentWindow = Window & {
  dataLayer?: unknown[];
  googlefc?: {
    callbackQueue?: Record<string, () => void>[];
    getGoogleConsentModeValues?: () => {
      analyticsStoragePurposeConsentStatus: number;
    };
  };
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "BusinessCalc",
      },
      {
        name: "description",
        content: "Calculadoras empresariales gratuitas",
      },
      {
        property: "og:title",
        content: "BusinessCalc",
      },
      {
        property: "og:description",
        content: "Calculadoras empresariales gratuitas",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
      },
      {
        rel: "icon",
        href: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const w = window as ConsentWindow;

    if (document.getElementById("google-adsense-script")) {
      return;
    }

    // Preparar la plataforma de consentimiento de Google.
    w.dataLayer = w.dataLayer || [];
    w.googlefc = w.googlefc || {};
    w.googlefc.callbackQueue =
      w.googlefc.callbackQueue || [];

    // Cargar Tag Manager únicamente con consentimiento analítico.
    const loadTagManager = () => {
      if (document.getElementById("google-tag-manager")) {
        return;
      }

      w.dataLayer?.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });

      const gtmScript = document.createElement("script");

      gtmScript.id = "google-tag-manager";
      gtmScript.async = true;
      gtmScript.src =
        "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;

      document.head.appendChild(gtmScript);
    };

    // Esperar a que Google proporcione las señales de consentimiento.
    w.googlefc.callbackQueue.push({
      CONSENT_MODE_DATA_READY: () => {
        const consent =
          w.googlefc?.getGoogleConsentModeValues?.();

        // GRANTED = 1.
        // No cargar Analytics si el consentimiento es
        // desconocido, denegado o no está configurado.
        if (consent?.analyticsStoragePurposeConsentStatus === 1) {
          loadTagManager();
        }
      },
    });

    // Cargar AdSense y su plataforma de consentimiento
    // después de la hidratación de React.
    const adsenseScript = document.createElement("script");

    adsenseScript.id = "google-adsense-script";
    adsenseScript.async = true;
    adsenseScript.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
      ADSENSE_ID;

    adsenseScript.crossOrigin = "anonymous";

    document.head.appendChild(adsenseScript);
  }, []);

  return (
    <html lang="es">
      <head>
        {/* Google Consent Mode v2 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];

              function gtag() {
                window.dataLayer.push(arguments);
              }

              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
              });

              gtag('set', 'ads_data_redaction', true);
            `,
          }}
        />

        <HeadContent />
      </head>

      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
