import Link from "next/link";
import { PublicShell } from "@/components/site/public-shell";
import { getActiveProducts, getActiveZones, getSiteSettingsMap } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Inicio",
  description: "Sitio institucional de Los Hermanos con catálogo, distribución, puntos de venta y promo QR."
});

export default async function HomePage() {
  const [settings, products, zones] = await Promise.all([
    getSiteSettingsMap(),
    getActiveProducts(),
    getActiveZones()
  ]);

  return (
    <PublicShell>
      <main>
        <section className="relative overflow-hidden border-b border-brand-100 bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-100 via-white to-brand-50" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-700">Los Hermanos</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                {settings["home.heroTitle"] || "Agua desmineralizada y distribución confiable"}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                {settings["home.heroText"] || "Mostramos productos, zonas de cobertura, puntos de venta y una promo QR pensada para campañas activas."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/productos" className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white">Ver productos</Link>
                <Link href="/promo" className="rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-800">Ir a la promo</Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-brand-900 p-6 text-white shadow-card sm:col-span-2">
                <p className="text-sm uppercase tracking-[0.24em] text-brand-100/80">Quiénes somos</p>
                <p className="mt-3 text-2xl font-bold">Producción, distribución y cercanía comercial.</p>
              </div>
              <div className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
                <p className="text-3xl font-black text-brand-800">{products.length}</p>
                <p className="mt-2 text-sm text-slate-600">Productos activos</p>
              </div>
              <div className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
                <p className="text-3xl font-black text-brand-800">{zones.length}</p>
                <p className="mt-2 text-sm text-slate-600">Zonas de distribución</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
