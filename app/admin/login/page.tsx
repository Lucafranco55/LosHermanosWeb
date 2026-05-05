import { BrandLogo } from "@/components/site/brand-logo";
import { getCurrentAdmin } from "@/lib/auth";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

const messages: Record<string, string> = {
  invalid: "Credenciales inválidas.",
  missing: "Ingresá email y contraseña."
};

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const [admin, params] = await Promise.all([getCurrentAdmin(), searchParams]);

  if (admin) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(145,219,255,0.4),transparent_30%),linear-gradient(180deg,#edf7ff_0%,#f7fafc_100%)] px-4">
      <section className="w-full max-w-md rounded-[2rem] border border-white bg-white/95 p-8 shadow-card backdrop-blur">
        <BrandLogo imageClassName="h-14 w-auto object-contain" />
        <div className="mt-6 inline-flex rounded-2xl bg-brand-50 p-3">
          <ShieldCheck className="h-6 w-6 text-brand-700" />
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Acceso administrador</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Ingresá con tu email y contraseña para administrar catálogo, consultas y promo.
        </p>
        <form action="/admin/session" method="POST" className="mt-6 grid gap-4">
          <input type="hidden" name="next" value={params.next || "/admin"} />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white"
          />
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm transition focus:border-brand-500 focus:bg-white"
            />
          </div>
          {params.error ? <p className="text-sm font-medium text-rose-600">{messages[params.error] || "Error al iniciar sesión."}</p> : null}
          <button className="rounded-2xl bg-brand-700 px-5 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800">
            Ingresar
          </button>
        </form>
      </section>
    </main>
  );
}
