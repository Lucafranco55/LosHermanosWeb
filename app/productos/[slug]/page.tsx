import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/site/public-shell";
import { getProductBySlug } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";
import { MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const productWhatsappUrl = "https://wa.me/5492241562965?text=Hola,%20quiero%20información%20sobre%20sus%20productos";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return buildMetadata({
    title: product?.name || "Producto",
    description: product?.shortDescription || "Detalle de producto Los Hermanos.",
    path: `/productos/${slug}`
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) notFound();

  return (
    <PublicShell>
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <Link href="/productos" className="text-sm font-semibold text-brand-700">
          Volver al catálogo
        </Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-card">
            <div className="h-[420px] bg-cover bg-center" style={{ backgroundImage: `url(${product.imageUrl})` }} />
          </div>
          <div className="rounded-[2rem] border border-brand-100 bg-white p-8 shadow-card">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-700">{product.category}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">{product.name}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">{product.shortDescription}</p>
            <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              {product.fullDescription}
            </div>
            <a
              href={productWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              Cotizar este producto
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
