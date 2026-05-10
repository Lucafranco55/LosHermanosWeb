import type { Metadata } from "next";
import { WhatsAppFloatingButton } from "@/components/site/whatsapp-floating-button";
import { siteConfig } from "@/lib/site";
import { getBaseUrl } from "@/lib/utils";
import "./globals.css";

const siteTitle = "Los Hermanos | Agua desmineralizada";
const siteDescription =
  "Producción y distribución de agua desmineralizada para talleres, estaciones de servicio y comercios.";
const siteUrl = getBaseUrl();
const googleTagManagerId = "GTM-PHPVLZ9B";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Los Hermanos"
  },
  description: siteDescription,
  keywords: siteConfig.keywords,
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png"
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Los Hermanos",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/icon.png",
        alt: "Los Hermanos"
      }
    ]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${googleTagManagerId}');
            `
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
