import { PublicShell } from "@/components/site/public-shell";
import { getActiveProducts, getActiveZones, getSiteSettingsMap } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";
import { ArrowRight, Boxes, MapPinned, MessageCircle, PackageSearch, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Inicio",
  description: "Sitio institucional de Los Hermanos con catálogo, distribución, puntos de venta y promo QR."
});

const whatsappUrl = "https://wa.me/5492241526965?text=Hola,%20quiero%20información%20sobre%20sus%20productos";

export default async function HomePage() {
  const [settings, products, zones] = await Promise.all([
    getSiteSettingsMap(),
    getActiveProducts(),
    getActiveZones()
  ]);

  return (
    <PublicShell>
      <main>
        <section className="relative overflow-hidden border-b border-brand-100 bg-slate-950">
          <Image
            src="/fondo-los-hermanos.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(3,10,18,0.9),rgba(8,31,48,0.82))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,203,255,0.22),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-28">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-200">Los Hermanos</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {settings["home.heroTitle"] || "Agua desmineralizada y distribución confiable"}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                {settings["home.heroText"] ||
                  "Mostramos productos, zonas de cobertura, puntos de venta y una promo QR pensada para campañas activas."}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-card transition hover:scale-[1.02] hover:bg-[#20bd5a]"
                >
                  Hablar por WhatsApp
                  <MessageCircle className="h-4 w-4" />
                </a>
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Ver productos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, label: "Producción confiable" },
                  { icon: Boxes, label: "Distribución organizada" },
                  { icon: MapPinned, label: "Cobertura comercial" }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
                    <item.icon className="h-5 w-5 text-brand-200" />
                    <p className="mt-3 text-sm font-semibold text-white">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-7 text-white shadow-card backdrop-blur sm:col-span-2">
                <p className="text-sm uppercase tracking-[0.24em] text-brand-100/80">Quiénes somos</p>
                <p className="mt-3 text-2xl font-bold">Producción, distribución y cercanía comercial.</p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  Web institucional enfocada en catálogo, puntos de venta y captación comercial sin complejidad de e-commerce.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-card">
                <PackageSearch className="h-6 w-6 text-brand-700" />
                <p className="mt-4 text-3xl font-black text-brand-800">{products.length}</p>
                <p className="mt-2 text-sm text-slate-600">Productos activos</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-card">
                <MapPinned className="h-6 w-6 text-brand-700" />
                <p className="mt-4 text-3xl font-black text-brand-800">{zones.length}</p>
                <p className="mt-2 text-sm text-slate-600">Zonas de distribución</p>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: PackageSearch,
                title: "Catálogo ordenado",
                text: "Presentación clara de línea de productos, categorías y detalles sin ruido comercial."
              },
              {
                icon: Boxes,
                title: "Distribución escalable",
                text: "Cobertura territorial, puntos de venta y consultas centralizadas para crecimiento operativo."
              },
              {
                icon: ShieldCheck,
                title: "Promo controlada",
                text: "Validación de códigos, reclamos y trazabilidad sin exponer lógica sensible al frontend."
              }
            ].map((item) => (
              <article key={item.title} className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
                <item.icon className="h-8 w-8 text-brand-700" />
                <h2 className="mt-5 text-xl font-bold text-slate-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
