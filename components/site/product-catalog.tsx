import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Package, PackageSearch } from "lucide-react";

const fallbackProductText = "Producto elaborado para uso automotor, técnico y comercial.";
const fallbackProductImage = "/fondo-los-hermanos.jpg";

type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
};

type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  presentation: string;
  imageUrl: string;
  badgeText: string | null;
  category: { name: string };
};

type CatalogBackground = {
  style?: CSSProperties;
  overlayClassName?: string;
};

export function ProductCatalog({
  categories,
  products,
  selectedCategoryId,
  background,
  content
}: {
  categories: CatalogCategory[];
  products: CatalogProduct[];
  selectedCategoryId?: string;
  background: CatalogBackground;
  content: { eyebrow: string; title: string; description: string };
}) {
  return (
    <main className="relative isolate min-h-[70vh] overflow-x-clip" style={background.style}>
      {background.overlayClassName ? <div className={`pointer-events-none absolute inset-0 -z-10 ${background.overlayClassName}`} /> : null}

      <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/95 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 shadow-sm backdrop-blur sm:px-4 sm:text-sm">
            <PackageSearch className="h-4 w-4" />
            {content.eyebrow}
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{content.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">{content.description}</p>
        </header>

        <nav aria-label="Filtrar productos por categoría" className="catalog-filter-scroll -mx-4 mt-7 max-w-[calc(100vw)] overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <div className="flex w-max min-w-full gap-2.5">
            <Link
              href="/productos"
              aria-current={!selectedCategoryId ? "page" : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                !selectedCategoryId
                  ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                  : "border-slate-200 bg-white/95 text-slate-700 hover:border-brand-300 hover:text-brand-800"
              }`}
            >
              Todos
            </Link>
            {categories.map((category) => {
              const isActive = category.id === selectedCategoryId;
              return (
                <Link
                  key={category.id}
                  href={`/productos?categoria=${encodeURIComponent(category.slug)}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                      : "border-slate-200 bg-white/95 text-slate-700 hover:border-brand-300 hover:text-brand-800"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {products.length ? (
          <section aria-label="Catálogo de productos" className="mt-7 grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {products.map((product, index) => (
              <article key={product.id} className="catalog-product-card group min-w-0 overflow-hidden rounded-[1.5rem] border border-white/80 bg-white shadow-[0_12px_38px_rgba(13,56,89,0.10)]">
                <Link href={`/productos/${product.slug}`} className="flex h-full min-h-full flex-col focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300" aria-label={`Ver ${product.name}`}>
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-slate-100 bg-[linear-gradient(145deg,#f8fcff_0%,#eef7fc_100%)] p-3 sm:p-4">
                    <img
                      src={product.imageUrl || fallbackProductImage}
                      alt={product.name}
                      loading={index < 4 ? "eager" : "lazy"}
                      className="catalog-product-image h-full w-full object-contain object-center"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    {product.badgeText ? (
                      <span className="mb-2 inline-flex max-w-full self-start rounded-full bg-slate-950 px-2.5 py-1 text-[0.6rem] font-black uppercase leading-tight tracking-[0.1em] text-white">
                        {product.badgeText}
                      </span>
                    ) : null}
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-brand-700">{product.category.name}</p>
                    <h2 className="mt-1.5 text-lg font-black leading-snug tracking-tight text-slate-950 sm:text-xl">{product.name}</h2>
                    {product.presentation ? (
                      <p className="mt-2 flex items-start gap-1.5 text-xs font-semibold leading-5 text-slate-500">
                        <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                        <span>{product.presentation}</span>
                      </p>
                    ) : null}
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{product.shortDescription || fallbackProductText}</p>
                    <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-sm font-bold text-brand-700 transition-colors group-hover:text-brand-900">
                      Ver producto
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </section>
        ) : (
          <div className="mt-8 rounded-[1.5rem] border border-brand-100 bg-white/95 p-6 text-sm leading-6 text-slate-600 shadow-sm">No hay productos disponibles en esta categoría por el momento.</div>
        )}
      </div>
    </main>
  );
}
