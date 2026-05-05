import { PromoChecker } from "@/components/forms/promo-checker";
import { PublicShell } from "@/components/site/public-shell";
import { buildMetadata } from "@/lib/site";
import { Gift } from "lucide-react";

export const metadata = buildMetadata({
  title: "Promo",
  description: "Landing de campaña promocional con QR y validación de códigos."
});

export default function PromoPage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="rounded-[2.5rem] border border-brand-100 bg-gradient-to-br from-brand-100 via-white to-brand-50 p-8 shadow-card sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-700 shadow-sm">
            <Gift className="h-4 w-4" />
            Campaña QR
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Promo oficial Los Hermanos</h1>
          <div className="mt-8">
            <PromoChecker />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
