import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true }
  });

  return [
    ...["", "/productos", "/distribucion", "/puntos-de-venta", "/contacto", "/promo"].map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date()
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/productos/${product.slug}`,
      lastModified: product.updatedAt
    }))
  ];
}
