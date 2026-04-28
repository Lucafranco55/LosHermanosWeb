import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";

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
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-card">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-700">Los Hermanos</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Acceso administrador</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Ingresá con tu email y contraseña para administrar catálogo, consultas y promo.
        </p>
        <form action="/admin/session" method="POST" className="mt-6 grid gap-4">
          <input type="hidden" name="next" value={params.next || "/admin"} />
          <input name="email" type="email" placeholder="Email" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <input name="password" type="password" placeholder="Contraseña" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          {params.error ? <p className="text-sm font-medium text-rose-600">{messages[params.error] || "Error al iniciar sesión."}</p> : null}
          <button className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">Ingresar</button>
        </form>
      </section>
    </main>
  );
}
