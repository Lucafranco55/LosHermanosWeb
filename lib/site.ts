import type { Metadata } from "next";
import { getBaseUrl } from "./utils";

export const siteConfig = {
  name: "Los Hermanos",
  description:
    "Producción y distribución de agua desmineralizada para talleres, estaciones de servicio y comercios.",
  keywords: [
    "agua desmineralizada",
    "agua desmineralizada 5L",
    "distribución agua",
    "Los Hermanos",
    "puntos de venta"
  ]
};

export function buildMetadata({
  title,
  description,
  path = "/"
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const baseUrl = getBaseUrl();

  return {
    title,
    description,
    keywords: siteConfig.keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      siteName: siteConfig.name,
      url: `${baseUrl}${path}`,
      locale: "es_AR",
      type: "website",
      images: [
        {
          url: "/icon.png",
          alt: siteConfig.name
        }
      ]
    }
  };
}
