import { ContactForm } from "@/components/forms/contact-form";
import { PublicShell } from "@/components/site/public-shell";
import { settingValue } from "@/lib/content-settings";
import { getSiteSettingsMap } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone, Store } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Contacto",
  description: "Formularios de consulta y alta de clientes o distribuidores."
});

export default async function ContactPage() {
  const settings = await getSiteSettingsMap();
  const brandName = settingValue(settings, "brand.name", "Los Hermanos");
  const email = settingValue(settings, "contact.email", "No informado");
  const whatsapp = settingValue(settings, "contact.whatsapp", "2241562965");
  const instagramUrl = settingValue(settings, "contact.instagram", "https://www.instagram.com/");
  const address = settingValue(settings, "contact.address", "No informado");
  const contactContent = {
    badge: settingValue(settings, "contact.badge", "Contacto"),
    title: settingValue(settings, "contact.title", "Contacto"),
    subtitle: settingValue(settings, "contact.subtitle", settingValue(settings, "brand.description")),
    companyTitle: settingValue(settings, "contact.companyTitle", brandName),
    companyDescription: settingValue(settings, "contact.companyDescription", settingValue(settings, "brand.description")),
    phoneLabel: settingValue(settings, "contact.phoneLabel", "WhatsApp"),
    emailLabel: settingValue(settings, "contact.emailLabel", "Email"),
    addressLabel: settingValue(settings, "contact.addressLabel", "Zona"),
    instagramLabel: settingValue(settings, "contact.instagramLabel", "Instagram"),
    instagramText: settingValue(settings, "contact.instagramText", "Ver perfil"),
    generalFormTitle: settingValue(settings, "contact.generalFormTitle", "Consulta"),
    generalFormDescription: settingValue(settings, "contact.generalFormDescription"),
    generalFormSubmit: settingValue(settings, "contact.generalFormSubmit", "Enviar"),
    resellerFormTitle: settingValue(settings, "contact.resellerFormTitle", "Cliente / distribuidor"),
    resellerFormDescription: settingValue(settings, "contact.resellerFormDescription"),
    resellerFormSubmit: settingValue(settings, "contact.resellerFormSubmit", "Enviar")
  };

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-700 shadow-sm">
              <MessageCircle className="h-4 w-4" />
              {contactContent.badge}
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              {contactContent.title}
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600">
              {contactContent.subtitle}
            </p>

            <div className="mt-8 rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
              <h2 className="text-2xl font-bold text-slate-900">{contactContent.companyTitle}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {contactContent.companyDescription}
              </p>
              <div className="mt-6 grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-brand-50 p-3">
                    <Phone className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{contactContent.phoneLabel}</p>
                    <p className="text-lg font-bold text-slate-900">{whatsapp}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-brand-50 p-3">
                    <Mail className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{contactContent.emailLabel}</p>
                    <p className="text-lg font-bold text-slate-900">{email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-brand-50 p-3">
                    <MapPin className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{contactContent.addressLabel}</p>
                    <p className="text-lg font-bold text-slate-900">{address}</p>
                  </div>
                </div>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-2xl transition hover:bg-slate-50">
                  <div className="rounded-2xl bg-brand-50 p-3">
                    <ExternalLink className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{contactContent.instagramLabel}</p>
                    <p className="text-lg font-bold text-slate-900">{contactContent.instagramText}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <section className="grid gap-6 xl:grid-cols-2">
            <ContactForm
              leadType="CONTACT"
              title={contactContent.generalFormTitle}
              description={contactContent.generalFormDescription}
              submitLabel={contactContent.generalFormSubmit}
            />
            <div className="relative">
              <div className="pointer-events-none absolute right-5 top-5 rounded-2xl bg-brand-50 p-3">
                <Store className="h-5 w-5 text-brand-700" />
              </div>
              <ContactForm
                leadType="RESELLER"
                title={contactContent.resellerFormTitle}
                description={contactContent.resellerFormDescription}
                submitLabel={contactContent.resellerFormSubmit}
              />
            </div>
          </section>
        </section>
      </main>
    </PublicShell>
  );
}
