"use client";

import { useState } from "react";

const initialState = {
  name: "",
  phone: "",
  business: "",
  city: "",
  message: ""
};

export function ContactForm({
  leadType,
  title,
  description
}: {
  leadType: "CONTACT" | "RESELLER";
  title: string;
  description: string;
}) {
  const [form, setForm] = useState(initialState);
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({});
  const [sending, setSending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setFeedback({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, leadType })
      });
      const data = await response.json();

      if (!response.ok) {
        setFeedback({ error: data.message || "No se pudo enviar la consulta." });
        return;
      }

      setForm(initialState);
      setFeedback({ success: data.message });
    } catch {
      setFeedback({ error: "No se pudo enviar la consulta." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white" placeholder="Nombre y apellido" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white" placeholder="Teléfono / WhatsApp" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
        <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white" placeholder="Comercio" value={form.business} onChange={(event) => setForm((current) => ({ ...current, business: event.target.value }))} />
        <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white" placeholder="Localidad" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
        <textarea className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white" placeholder="Contanos qué necesitás" value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} />
        {feedback.error ? <p className="text-sm font-medium text-rose-600">{feedback.error}</p> : null}
        {feedback.success ? <p className="text-sm font-medium text-emerald-600">{feedback.success}</p> : null}
        <button disabled={sending} className="rounded-2xl bg-brand-700 px-5 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800 disabled:opacity-70">
          {sending ? "Enviando..." : "Enviar consulta"}
        </button>
      </form>
    </div>
  );
}
