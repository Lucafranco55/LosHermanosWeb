import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Los Hermanos | Producción y distribución",
    template: "%s | Los Hermanos"
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
