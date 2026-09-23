"use client";

import { useState } from "react";
import { Copy, Eye, MessageSquare, Send, X } from "lucide-react";
import type { UpcomingReminderPlan } from "@/lib/whatsapp/reminders";

type ModalMode = "customers" | "message" | "test" | null;

export function WhatsAppSimulationModal({ plan }: { plan: UpcomingReminderPlan }) {
  const [mode, setMode] = useState<ModalMode>(null);
  const [copied, setCopied] = useState(false);

  const combinedMessages = plan.customers
    .map((customer) => `${customer.name} (${customer.whatsapp})\n${customer.message}`)
    .join("\n\n---\n\n");

  async function copyMessages() {
    await navigator.clipboard.writeText(combinedMessages);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("customers")}
          className="inline-flex items-center gap-2 rounded-full border border-brand-100 px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
        >
          <Eye className="h-4 w-4" />
          Ver clientes
        </button>
        <button
          type="button"
          onClick={() => setMode("message")}
          className="inline-flex items-center gap-2 rounded-full border border-brand-100 px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
        >
          <MessageSquare className="h-4 w-4" />
          Ver mensaje
        </button>
        <button
          type="button"
          onClick={() => setMode("test")}
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          <Send className="h-4 w-4" />
          Enviar prueba
        </button>
      </div>

      {mode ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
          <section className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Modo simulacion</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">{modalTitle(mode, plan.zoneName)}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  No se envia ningun mensaje real. Esta vista muestra exactamente el texto generado.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMode(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[62vh] overflow-y-auto p-5">
              {mode === "customers" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {plan.customers.map((customer) => (
                    <article key={customer.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <h3 className="font-bold text-slate-900">{customer.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">Contacto: {customer.contactName || "A definir"}</p>
                      <p className="text-sm text-slate-600">WhatsApp: {customer.whatsapp}</p>
                      <p className="text-sm text-slate-600">Localidad: {customer.city}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4">
                  {plan.customers.map((customer) => (
                    <article key={customer.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-slate-900">{customer.name}</h3>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                          {customer.whatsapp}
                        </span>
                      </div>
                      <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700">
                        {customer.message}
                      </pre>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {mode !== "customers" ? (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5">
                <p className="text-sm text-slate-500">{plan.customers.length} mensajes generados.</p>
                <button
                  type="button"
                  onClick={copyMessages}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copiado" : "Copiar mensajes"}
                </button>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}

function modalTitle(mode: Exclude<ModalMode, null>, zoneName: string) {
  if (mode === "customers") return `Clientes de ${zoneName}`;
  if (mode === "message") return `Mensaje para ${zoneName}`;
  return `Prueba simulada para ${zoneName}`;
}
