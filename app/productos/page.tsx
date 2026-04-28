import { PublicShell } from "@/components/site/public-shell";
import { getActiveProducts } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";
import Link from "next/link";

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
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-700">Catálogo</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Productos disponibles</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">Catálogo institucional sin carrito, orientado a mostrar oferta y captar consultas comerciales.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-card">
              <div className="h-60 bg-cover bg-center" style={{ backgroundImage: `url(${product.imageUrl})` }} />
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">{product.category}</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{product.name}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
                <Link href={`/productos/${product.slug}`} className="mt-5 inline-flex text-sm font-semibold text-brand-700">Ver detalle</Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
