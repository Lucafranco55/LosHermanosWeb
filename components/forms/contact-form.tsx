"use client";

import { useState } from "react";

type LeadType = "CONTACT" | "RESELLER";

type FormState = {
  name: string;
  phone: string;
  email: string;
  business: string;
  businessType: string;
  address: string;
  city: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  business: "",
  businessType: "",
  address: "",
  city: "",
  message: ""
};

function buildMessage(form: FormState, leadType: LeadType) {
  if (leadType === "CONTACT") {
    return [
      form.email ? `Email: ${form.email}` : "",
      form.message ? `Mensaje: ${form.message}` : "Mensaje: Consulta general sin detalle adicional."
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `Tipo de comercio: ${form.businessType}`,
    form.address ? `Direccion: ${form.address}` : "",
    form.message ? `Mensaje adicional: ${form.message}` : "Mensaje adicional: Solicitud comercial sin detalle adicional."
  ]
    .filter(Boolean)
    .join("\n");
}

export function ContactForm({
  leadType,
  title,
  description,
  submitLabel
}: {
  leadType: LeadType;
  title: string;
  description: string;
  submitLabel: string;
}) {
  const [form, setForm] = useState<FormState>(initialState);
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({});
  const [sending, setSending] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    if (!form.name.trim() || !form.phone.trim()) {
      return "Completá nombre y teléfono.";
    }

    if (leadType === "RESELLER" && (!form.business.trim() || !form.businessType.trim())) {
      return "Completá nombre del comercio y tipo de comercio.";
    }

    return "";
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback({});

    const validationError = validate();
    if (validationError) {
      setFeedback({ error: validationError });
      return;
    }

    setSending(true);

    try {
      const payload = {
        leadType,
        name: form.name,
        phone: form.phone,
        business: leadType === "RESELLER" ? form.business : form.email,
        city: leadType === "RESELLER" ? form.city || "No informado" : "No informado",
        message: buildMessage(form, leadType)
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white"
          placeholder="Nombre y apellido"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
        {leadType === "CONTACT" ? (
          <>
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white"
              placeholder="Teléfono"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
            <textarea
              className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white"
              placeholder="Mensaje"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
          </>
        ) : (
          <>
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white"
              placeholder="Nombre del comercio"
              value={form.business}
              onChange={(event) => updateField("business", event.target.value)}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white"
              placeholder="Tipo de comercio"
              value={form.businessType}
              onChange={(event) => updateField("businessType", event.target.value)}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white"
              placeholder="Número telefónico"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white"
              placeholder="Dirección"
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white"
              placeholder="Localidad / zona"
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
            />
            <textarea
              className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white"
              placeholder="Mensaje adicional"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
          </>
        )}
        {feedback.error ? <p className="text-sm font-medium text-rose-600">{feedback.error}</p> : null}
        {feedback.success ? <p className="text-sm font-medium text-emerald-600">{feedback.success}</p> : null}
        <button disabled={sending} className="rounded-2xl bg-brand-700 px-5 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800 disabled:opacity-70">
          {sending ? "Enviando..." : submitLabel}
        </button>
      </form>
    </div>
  );
}
