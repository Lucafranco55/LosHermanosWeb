import type { Metadata } from "next";
import { WhatsAppFloatingButton } from "@/components/site/whatsapp-floating-button";
import { siteConfig } from "@/lib/site";
import { getBaseUrl } from "@/lib/utils";
import "./globals.css";

const siteTitle = "Los Hermanos | Agua desmineralizada";
const siteDescription =
  "Producción y distribución de agua desmineralizada para talleres, estaciones de servicio y comercios.";
const siteUrl = getBaseUrl();

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
      <body>
        {children}
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
