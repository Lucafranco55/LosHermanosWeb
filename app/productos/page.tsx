import type { Metadata } from "next";
import { ProductCatalog } from "@/components/site/product-catalog";
import { PublicShell } from "@/components/site/public-shell";
import { settingValue } from "@/lib/content-settings";
import { getProductBackgroundPresentation } from "@/lib/product-catalog-settings";
import {
  getActiveProductCategories,
  getActiveProducts,
  getProductCategoryBySlug,
  getSiteSettingsMap
} from "@/lib/queries";
import { buildMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

type ProductsSearchParams = Promise<{ categoria?: string | string[] }>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: { searchParams: ProductsSearchParams }): Promise<Metadata> {
  const categorySlug = firstParam((await searchParams).categoria);
  const category = categorySlug ? await getProductCategoryBySlug(categorySlug) : null;
  const title = category?.isActive ? `Productos: ${category.name}` : "Productos";
  const description = category?.isActive
    ? `Catálogo de ${category.name} de Los Hermanos para comercios, talleres y distribuidores.`
    : "Conocé la línea de productos Los Hermanos para comercios, talleres y distribuidores.";

  return buildMetadata({
    title,
    description,
    path: category?.isActive ? `/productos?categoria=${encodeURIComponent(category.slug)}` : "/productos"
  });
}

export default async function ProductsPage({ searchParams }: { searchParams: ProductsSearchParams }) {
  const requestedCategory = firstParam((await searchParams).categoria);
  const [settings, categories] = await Promise.all([getSiteSettingsMap(), getActiveProductCategories()]);
  const selectedCategory = categories.find((category) => category.slug === requestedCategory);
  const products = await getActiveProducts(selectedCategory?.slug);

  return (
    <PublicShell>
      <ProductCatalog
        categories={categories}
        products={products}
        selectedCategoryId={selectedCategory?.id}
        background={getProductBackgroundPresentation(settings)}
        content={{
          eyebrow: settingValue(settings, "products.eyebrow", "Productos"),
          title: settingValue(settings, "products.title", "Soluciones para cada necesidad"),
          description: settingValue(
            settings,
            "products.description",
            "Explorá nuestra línea para talleres, comercios y distribuidores. Consultanos por disponibilidad y condiciones mayoristas."
          )
        }}
      />
    </PublicShell>
  );
}
