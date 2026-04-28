"use client";

import { useState } from "react";

const initialClaim = {
  claimantName: "",
  claimantPhone: "",
  claimantBusiness: "",
  claimantCity: ""
};

type ResultState = {
  status: string;
  message: string;
  prize?: string;
} | null;

export function PromoChecker() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ResultState>(null);
  const [claim, setClaim] = useState(initialClaim);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [validating, setValidating] = useState(false);
  const [claiming, setClaiming] = useState(false);

  async function onValidate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidating(true);
    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      setResult(data);
      setShowClaimForm(data.status === "winner_available");
    } finally {
      setValidating(false);
    }
  }

  async function onClaim(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClaiming(true);
    try {
      const response = await fetch("/api/promo/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, ...claim })
      });
      const data = await response.json();
      setResult(data);
      if (response.ok) {
        setShowClaimForm(false);
        setClaim(initialClaim);
      }
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card sm:p-8">
      <h2 className="text-2xl font-black tracking-tight text-slate-900">Validá tu código</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Ingresá el código impreso en tu etiqueta. Si tiene premio disponible, vas a poder reclamarlo desde acá.
      </p>
      <form onSubmit={onValidate} className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
        <input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="Ej: LH-0004" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        <button className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
          {validating ? "Validando..." : "Validar código"}
        </button>
      </form>
      {result ? (
        <div className={`mt-6 rounded-3xl border px-4 py-4 text-sm ${
          result.status === "winner_available" || result.status === "claimed_success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : result.status === "no_prize"
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
        }`}>
          <p>{result.message}</p>
          {result.prize ? <p className="mt-2 text-base font-bold">{result.prize}</p> : null}
        </div>
      ) : null}
      {showClaimForm ? (
        <form onSubmit={onClaim} className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <input placeholder="Nombre y apellido" value={claim.claimantName} onChange={(event) => setClaim((current) => ({ ...current, claimantName: event.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <input placeholder="Teléfono / WhatsApp" value={claim.claimantPhone} onChange={(event) => setClaim((current) => ({ ...current, claimantPhone: event.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <input placeholder="Comercio (opcional)" value={claim.claimantBusiness} onChange={(event) => setClaim((current) => ({ ...current, claimantBusiness: event.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <input placeholder="Localidad" value={claim.claimantCity} onChange={(event) => setClaim((current) => ({ ...current, claimantCity: event.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
            {claiming ? "Enviando..." : "Enviar reclamo"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
