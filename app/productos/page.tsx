import { PublicShell } from "@/components/site/public-shell";
import { buildWhatsappUrl } from "@/lib/contact-links";
import { getActiveProducts } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";
import Link from "next/link";
import { ArrowRight, MessageCircle, PackageSearch } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Productos",
  description: "Catálogo general de productos Los Hermanos."
});

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-700 shadow-sm">
            <PackageSearch className="h-4 w-4" />
            Catálogo
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Productos disponibles</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Catálogo institucional sin carrito, orientado a mostrar oferta y captar consultas comerciales.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const productWhatsappUrl = buildWhatsappUrl(
              "2241562965",
              `Hola, quiero cotizar ${product.name}`
            );

            return (
              <article
                key={product.id}
                className="group relative overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/productos/${product.slug}`} className="absolute inset-0 z-10" aria-label={`Ver detalle de ${product.name}`} />
                <div className="relative z-0 overflow-hidden">
                  <div
                    className="h-60 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url(${product.imageUrl})` }}
                  />
                  <div className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-brand-700 shadow-sm backdrop-blur">
                    Ver detalle
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="pointer-events-none relative z-20 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">{product.category}</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">{product.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
                  <a
                    href={productWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto relative z-30 mt-5 inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
                  >
                    Cotizar este producto
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </PublicShell>
  );
}
