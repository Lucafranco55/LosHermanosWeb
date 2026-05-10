import { ContactForm } from "@/components/forms/contact-form";
import { PublicShell } from "@/components/site/public-shell";
import { getSiteSettingsMap } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone, Store } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Contacto",
  description: "Formularios de consulta y alta de clientes o distribuidores."
});

const instagramUrl = "https://www.instagram.com/";
const whatsappPhone = "2241562965";

export default async function ContactPage() {
  const settings = await getSiteSettingsMap();
  const email = settings["contact.email"] || "A definir";

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-700 shadow-sm">
              <MessageCircle className="h-4 w-4" />
              Contacto
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Hablemos de productos y distribución</h1>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Los Hermanos produce y distribuye agua desmineralizada y productos automotores para comercios, talleres y estaciones de servicio.
            </p>

            <div className="mt-8 rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
              <h2 className="text-2xl font-bold text-slate-900">Los Hermanos</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Producción y distribución de agua desmineralizada y productos automotores.
              </p>
              <div className="mt-6 grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-brand-50 p-3">
                    <Phone className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">WhatsApp / teléfono principal</p>
                    <p className="text-lg font-bold text-slate-900">{whatsappPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-brand-50 p-3">
                    <Mail className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Email</p>
                    <p className="text-lg font-bold text-slate-900">{email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-brand-50 p-3">
                    <MapPin className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Zona de trabajo</p>
                    <p className="text-lg font-bold text-slate-900">Buenos Aires</p>
                  </div>
                </div>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-2xl transition hover:bg-slate-50">
                  <div className="rounded-2xl bg-brand-50 p-3">
                    <ExternalLink className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Instagram</p>
                    <p className="text-lg font-bold text-slate-900">Ver perfil</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <section className="grid gap-6 xl:grid-cols-2">
            <ContactForm
              leadType="CONTACT"
              title="Consulta general"
              description="Envianos tu consulta y te respondemos a la brevedad."
              submitLabel="Enviar consulta"
            />
            <div className="relative">
              <div className="pointer-events-none absolute right-5 top-5 rounded-2xl bg-brand-50 p-3">
                <Store className="h-5 w-5 text-brand-700" />
              </div>
              <ContactForm
                leadType="RESELLER"
                title="Quiero ser cliente o distribuidor"
                description="Completá tus datos comerciales para que podamos evaluar la zona, el tipo de comercio y la operatoria."
                submitLabel="Enviar datos comerciales"
              />
            </div>
          </section>
        </section>
      </main>
    </PublicShell>
  );
}
