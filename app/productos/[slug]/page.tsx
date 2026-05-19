import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ProductImageViewer } from "@/components/site/product-image-viewer";
import { PublicShell } from "@/components/site/public-shell";
import { buildWhatsappUrl } from "@/lib/contact-links";
import { getProductBySlug } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";
import { ArrowLeft, CheckCircle2, MessageCircle, Package, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

const fallbackDescription = "Producto elaborado para uso automotor, tecnico y comercial.";
const fallbackPresentation = "Consultar disponibilidad y precio mayorista.";

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

  const productWhatsappUrl = buildWhatsappUrl("2241562965", `Hola, quiero cotizar ${product.name}`);

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Link href="/productos" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900">
          <ArrowLeft className="h-4 w-4" />
          Volver al catalogo
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ProductImageViewer src={product.imageUrl} alt={product.name} />

          <div className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card sm:p-8">
            <p className="inline-flex rounded-full bg-brand-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
              {product.category || "Producto"}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">{product.shortDescription || fallbackDescription}</p>

            <div className="mt-7 space-y-4">
              <InfoCard icon={<CheckCircle2 className="h-5 w-5" />} title="Descripcion ampliada">
                {product.fullDescription || fallbackDescription}
              </InfoCard>
              <InfoCard icon={<Wrench className="h-5 w-5" />} title="Usos recomendados">
                {product.recommendedUses || fallbackDescription}
              </InfoCard>
              <InfoCard icon={<Package className="h-5 w-5" />} title="Presentacion / formato">
                {product.presentation || fallbackPresentation}
              </InfoCard>
            </div>

            <a
              href={productWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800 sm:w-auto"
            >
              Cotizar este producto
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

function InfoCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
      <div className="flex items-center gap-3 text-brand-700">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">{icon}</span>
        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">{title}</h2>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-700">{children}</p>
    </div>
  );
}
