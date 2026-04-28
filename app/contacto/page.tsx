import { ContactForm } from "@/components/forms/contact-form";
import { PublicShell } from "@/components/site/public-shell";
import { getSiteSettingsMap } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Contacto",
  description: "Formularios de consulta y alta de revendedores."
});

export default async function ContactPage() {
  const settings = await getSiteSettingsMap();

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-700">Contacto</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Consultas y desarrollo comercial</h1>
            <div className="mt-8 grid gap-4 rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
              <div>
                <p className="text-sm font-semibold text-slate-500">WhatsApp</p>
                <p className="text-lg font-bold text-slate-900">{settings["contact.whatsapp"] || "A definir"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Email</p>
                <p className="text-lg font-bold text-slate-900">{settings["contact.email"] || "A definir"}</p>
              </div>
            </div>
          </section>
          <section className="grid gap-6">
            <ContactForm leadType="CONTACT" title="Pedido / consulta" description="Para consultas generales, disponibilidad y coordinación comercial." />
            <ContactForm leadType="RESELLER" title="Ser cliente / revendedor" description="Pensado para comercios, distribuidores y nuevos puntos de venta." />
          </section>
        </div>
      </main>
    </PublicShell>
  );
}
