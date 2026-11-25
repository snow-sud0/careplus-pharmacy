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
import { connectCarePlusBotpress } from "../lib/careplus-botpress";

const BOTPRESS_INJECT_ID = "careplus-botpress-inject";
const BOTPRESS_CONFIG_ID = "careplus-botpress-config";
const BOTPRESS_STYLE_ID = "careplus-botpress-styles";
const BOTPRESS_INJECT_URL = "https://cdn.botpress.cloud/webchat/v5.0/inject.js";
const BOTPRESS_CONFIG_URL =
  "https://files.bpcontent.cloud/2026/11/25/01/20261125011951-VZB74AQP.js";

let botpressScriptsPromise: Promise<void> | undefined;

function styleBotpressShadowRoots() {
  document.querySelectorAll<HTMLElement>(".bpChatContainer *").forEach((element) => {
    const shadowRoot = element.shadowRoot;
    if (!shadowRoot || shadowRoot.getElementById(BOTPRESS_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = BOTPRESS_STYLE_ID;
    style.textContent = `
      .bpFabWrapper {
        right: 20px !important;
        bottom: max(18px, env(safe-area-inset-bottom, 0px)) !important;
      }
      .bpFabContainer {
        background-color: #17623f !important;
        color: #ffffff !important;
      }
      .bpFabIcon {
        background-color: #ffffff !important;
      }
      .bpWebchat {
        right: 20px !important;
        bottom: 92px !important;
        width: min(400px, calc(100vw - 40px)) !important;
        height: min(640px, calc(100dvh - 112px)) !important;
        max-height: calc(100dvh - 112px) !important;
      }
      @media (max-width: 700px) {
        .bpFabWrapper {
          right: 16px !important;
          bottom: max(16px, env(safe-area-inset-bottom, 0px)) !important;
        }
        .bpWebchat {
          right: 20px !important;
          bottom: calc(env(safe-area-inset-bottom, 0px) + 82px) !important;
          width: calc(100vw - 40px) !important;
          height: min(620px, calc(100dvh - 106px)) !important;
          max-height: calc(100dvh - 106px) !important;
          border-radius: 20px !important;
        }
      }
    `;
    shadowRoot.appendChild(style);
  });
}

function loadBotpressScript(id: string, src: string, defer = false) {
  const existingScript = document.getElementById(id) as HTMLScriptElement | null;

  if (existingScript?.dataset["loaded"] === "true") {
    return Promise.resolve();
  }

  if (existingScript) {
    return new Promise<void>((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error(`Could not load Botpress script: ${src}`)),
        { once: true },
      );
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = false;
    script.defer = defer;
    script.addEventListener(
      "load",
      () => {
        script.dataset["loaded"] = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => {
        script.remove();
        reject(new Error(`Could not load Botpress script: ${src}`));
      },
      { once: true },
    );
    document.head.appendChild(script);
  });
}

function BotpressChatbot() {
  useEffect(() => {
    const observer = new MutationObserver(styleBotpressShadowRoots);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    botpressScriptsPromise ??= loadBotpressScript(BOTPRESS_INJECT_ID, BOTPRESS_INJECT_URL)
      .then(() => {
        connectCarePlusBotpress();
        return loadBotpressScript(BOTPRESS_CONFIG_ID, BOTPRESS_CONFIG_URL, true);
      })
      .catch((error: unknown) => {
        botpressScriptsPromise = undefined;
        console.error("CarePlus Pharmacy Assistant could not be loaded.", error);
      });

    void botpressScriptsPromise.then(styleBotpressShadowRoots);
    return () => observer.disconnect();
  }, []);

  return null;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
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
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Each content route, / included, sets its own page-specific metadata.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CarePlus Pharmacy" },
      { name: "description", content: "Your community pharmacy in Benin City, Edo State." },
      { property: "og:title", content: "CarePlus Pharmacy" },
      { property: "og:description", content: "Your community pharmacy in Benin City, Edo State." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
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
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <BotpressChatbot />
    </QueryClientProvider>
  );
}
