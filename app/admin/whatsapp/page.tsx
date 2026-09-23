import { WhatsAppNotificationStatus } from "@prisma/client";
import {
  canUseMetaWhatsAppProvider,
  getWhatsAppProviderConfig,
  isMetaWhatsAppConfigured
} from "@/lib/whatsapp/provider";

import { AdminShell } from "@/components/admin/admin-shell";
import { WhatsAppSimulationModal } from "@/components/admin/whatsapp-simulation-modal";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatArgentinaDate,
  formatOrderDeadline,
  weekdayOptions
} from "@/lib/whatsapp/date-utils";
import {
  getUpcomingWhatsAppReminderPlans,
  getWhatsAppDashboardSummary
} from "@/lib/whatsapp/reminders";
import { getOrCreateDefaultWhatsAppTemplate } from "@/lib/whatsapp/templates";

import {
  sendDeliveryReminderTemplateTestAction,
  simulateWhatsAppReminderPlanAction,
  sendWhatsAppTestMessageAction,
  skipWhatsAppReminderPlanAction,
  upsertCustomerAction,
  upsertDeliveryZoneAction,
  upsertWhatsAppTemplateAction
} from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstParam(
  params: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

function inputClassName() {
  return "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100";
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="rounded-full bg-brand-700 px-5 py-3 text-sm font-black text-white transition hover:bg-brand-800"
      type="submit"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-bold text-brand-800 transition hover:bg-brand-50"
      type="submit"
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    [WhatsAppNotificationStatus.SIMULATED]:
      "bg-emerald-100 text-emerald-800",
    [WhatsAppNotificationStatus.SENT]: "bg-sky-100 text-sky-800",
    [WhatsAppNotificationStatus.FAILED]: "bg-rose-100 text-rose-800",
    [WhatsAppNotificationStatus.SKIPPED]: "bg-amber-100 text-amber-800",
    [WhatsAppNotificationStatus.PENDING]: "bg-slate-100 text-slate-700"
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${
        styles[status] || styles[WhatsAppNotificationStatus.PENDING]
      }`}
    >
      {status}
    </span>
  );
}

export default async function AdminWhatsAppPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  await requireAdmin();

  const params = searchParams ? await searchParams : {};
  const selectedZoneId = firstParam(params, "zone") || "";
  const search = (firstParam(params, "q") || "").trim().toLowerCase();

  await getOrCreateDefaultWhatsAppTemplate();

  const [summary, plans, zones, customers, templates, notifications] =
    await Promise.all([
      getWhatsAppDashboardSummary(),
      getUpcomingWhatsAppReminderPlans(12),
      prisma.deliveryZone.findMany({
        orderBy: [{ isActive: "desc" }, { name: "asc" }]
      }),
      prisma.customer.findMany({
        include: { deliveryZone: true },
        orderBy: [{ isActive: "desc" }, { city: "asc" }, { commercialName: "asc" }]
      }),
      prisma.whatsAppTemplate.findMany({
        orderBy: [{ isDefault: "desc" }, { isActive: "desc" }, { name: "asc" }]
      }),
      prisma.whatsAppNotification.findMany({
        include: { customer: true, zone: true, template: true },
        orderBy: [{ createdAt: "desc" }],
        take: 60
      })
    ]);

  const filteredCustomers = customers.filter((customer) => {
    const matchesZone = !selectedZoneId || customer.deliveryZoneId === selectedZoneId;
    const text = [
      customer.commercialName,
      customer.contactName,
      customer.city,
      customer.whatsapp,
      customer.phone,
      customer.deliveryZone?.name
    ]
      .join(" ")
      .toLowerCase();

    return matchesZone && (!search || text.includes(search));
  });
  const whatsappConfig = getWhatsAppProviderConfig();
  const metaConfigured = isMetaWhatsAppConfigured();
  const metaReadyForManualTest = canUseMetaWhatsAppProvider();
  const metaTestStatus = firstParam(params, "metaTest");
  const metaTestMessage = firstParam(params, "metaMessage");
  const deliveryTemplateTestStatus = firstParam(params, "deliveryTemplateTest");
  const deliveryTemplateMessage = firstParam(params, "deliveryTemplateMessage");
  const deliveryTemplatePlanKey =
    firstParam(params, "deliveryTemplatePlan") ||
    (plans[0] ? `${plans[0].zoneId}|${plans[0].deliveryDateKey}` : "");
  const [deliveryTemplateZoneId, deliveryTemplateDeliveryDateKey] =
    deliveryTemplatePlanKey.split("|");
  const deliveryTemplatePlan =
    plans.find(
      (plan) =>
        plan.zoneId === deliveryTemplateZoneId &&
        plan.deliveryDateKey === deliveryTemplateDeliveryDateKey
    ) ||
    plans[0] ||
    null;
  const deliveryTemplateZone = deliveryTemplatePlan
    ? zones.find((zone) => zone.id === deliveryTemplatePlan.zoneId)
    : null;
  const deliveryTemplateCustomer = deliveryTemplatePlan?.customers[0] || null;
  const deliveryTemplatePreview = deliveryTemplatePlan
    ? {
        customerName:
          deliveryTemplateCustomer?.contactName ||
          deliveryTemplateCustomer?.name ||
          "Cliente de referencia",
        deliveryDateLabel: deliveryTemplatePlan.deliveryDateLabel,
        zoneName:
          deliveryTemplateCustomer?.city ||
          deliveryTemplatePlan.zoneName,
        orderDeadlineLabel: deliveryTemplateZone
          ? formatOrderDeadline(
              deliveryTemplateZone.orderDeadlineWeekday,
              deliveryTemplateZone.orderDeadlineTime
            )
          : "A definir"
      }
    : null;

  return (
    <AdminShell
      title="WhatsApp"
      description="Modulo interno para organizar rutas, clientes, plantillas y pruebas controladas de WhatsApp. El envio automatico real permanece desactivado."
    >
      <section className="grid gap-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Avisos de hoy", summary.noticesToday],
            ["Proximos repartos", summary.upcomingDeliveries],
            ["Clientes con WhatsApp", summary.customersWithWhatsapp],
            ["Errores", summary.errors]
          ].map(([label, value]) => (
            <article
              className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5"
              key={label}
            >
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
            </article>
          ))}
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-black text-slate-900">
            Configuracion de envio
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Los envios automaticos masivos siguen desactivados. El modo Meta
            solo queda habilitado para prueba si la configuracion lo permite.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {[
              {
                label: "Modo simulacion",
                value: whatsappConfig.provider === "simulation" ? "Activo" : "Inactivo"
              },
              {
                label: "Envios reales",
                value: metaReadyForManualTest ? "Prueba manual" : "Bloqueados"
              },
              {
                label: "Envios automaticos",
                value: whatsappConfig.automaticSendEnabled
                  ? "Habilitados"
                  : "Bloqueados"
              },
              {
                label: "Credenciales Meta",
                value: metaConfigured ? "Configuradas" : "Pendientes"
              },
              {
                label: "Numero de prueba",
                value: "Carga manual"
              }
            ].map((item) => (
              <div
                className="rounded-2xl border border-white bg-white p-4"
                key={item.label}
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 font-black text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">
            Estado Meta para prueba:{" "}
            <span className={metaReadyForManualTest ? "text-emerald-700" : "text-amber-700"}>
              {metaReadyForManualTest
                ? "listo para enviar solo al numero de prueba"
                : "bloqueado de forma segura"}
            </span>
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700">
                Prueba de Meta WhatsApp
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Enviar template hello_world
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Esta prueba de diagnostico envia el template oficial de Meta{" "}
                <strong>hello_world</strong> con idioma <strong>en_US</strong>.
                No usa las plantillas comerciales guardadas en la base.
              </p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-800">
              Modo actual:{" "}
              <span className={whatsappConfig.provider === "meta" ? "text-emerald-700" : "text-amber-700"}>
                {whatsappConfig.provider === "meta" ? "META" : "SIMULATION"}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Credenciales Meta
              </p>
              <p className="mt-2 font-black text-slate-900">
                {metaConfigured ? "Configuradas" : "Pendientes"}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Envio automatico
              </p>
              <p className="mt-2 font-black text-slate-900">
                {whatsappConfig.automaticSendEnabled ? "Habilitado" : "Desactivado"}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 md:col-span-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Seguridad
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                El cron no envia real mientras WHATSAPP_AUTOMATIC_SEND_ENABLED=false.
              </p>
            </div>
          </div>

          {metaTestMessage ? (
            <div
              className={`mt-5 rounded-2xl p-4 text-sm font-semibold ${
                metaTestStatus === "sent"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {metaTestMessage}
            </div>
          ) : null}

          <form action={sendWhatsAppTestMessageAction} className="mt-5 grid gap-4 rounded-[1.5rem] bg-white p-5">
            {whatsappConfig.provider === "meta" ? (
              <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">
                Confirmacion: al enviar este formulario se intentara realizar un envio real mediante Meta Cloud API al numero indicado.
              </p>
            ) : (
              <p className="rounded-2xl bg-sky-50 p-4 text-sm font-bold text-sky-800">
                El proveedor esta en SIMULATION. No se realizara ningun envio real.
              </p>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Plan de referencia">
                <select className={inputClassName()} name="planKey" required>
                  {plans.map((plan) => (
                    <option
                      key={`${plan.zoneId}-${plan.deliveryDateKey}`}
                      value={`${plan.zoneId}|${plan.deliveryDateKey}`}
                    >
                      {plan.zoneName} · {plan.deliveryDateLabel}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Numero destinatario autorizado">
                <input
                  className={inputClassName()}
                  name="recipientPhone"
                  placeholder="549..."
                  required
                />
              </Field>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SubmitButton>Enviar mensaje de prueba</SubmitButton>
              <p className="text-xs text-slate-500">
                Estado tecnico: {metaReadyForManualTest ? "Meta listo" : "Meta bloqueado o incompleto"}.
              </p>
            </div>
          </form>
        </section>

        <section className="rounded-[2rem] border border-emerald-100 bg-emerald-50/70 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                Plantilla real de reparto
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Probar aviso_reparto_zona
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Esta prueba envia la plantilla aprobada/configurada en Meta{" "}
                <strong>aviso_reparto_zona</strong> con idioma{" "}
                <strong>es_AR</strong>. Esta preparada para prueba manual; no esta integrada al cron ni a envios masivos.
              </p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-emerald-800">
              Prueba manual controlada
            </div>
          </div>

          {deliveryTemplateMessage ? (
            <div
              className={`mt-5 rounded-2xl p-4 text-sm font-semibold ${
                deliveryTemplateTestStatus === "sent"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {deliveryTemplateMessage}
            </div>
          ) : null}

          <form className="mt-5 grid gap-4 rounded-[1.5rem] bg-white p-5" method="get">
            <Field label="Plan para previsualizar variables">
              <select
                className={inputClassName()}
                defaultValue={deliveryTemplatePlanKey}
                name="deliveryTemplatePlan"
                required
              >
                {plans.map((plan) => (
                  <option
                    key={`${plan.zoneId}-${plan.deliveryDateKey}`}
                    value={`${plan.zoneId}|${plan.deliveryDateKey}`}
                  >
                    {plan.zoneName} · {plan.deliveryDateLabel}
                  </option>
                ))}
              </select>
            </Field>
            <button className="w-fit rounded-full border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-800" type="submit">
              Ver variables
            </button>
          </form>

          {deliveryTemplatePreview ? (
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {[
                ["{{1}} Nombre", deliveryTemplatePreview.customerName],
                ["{{2}} Reparto", deliveryTemplatePreview.deliveryDateLabel],
                ["{{3}} Zona", deliveryTemplatePreview.zoneName],
                ["{{4}} Limite", deliveryTemplatePreview.orderDeadlineLabel]
              ].map(([label, value]) => (
                <div className="rounded-2xl bg-white p-4" key={label}>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          ) : null}

          <form action={sendDeliveryReminderTemplateTestAction} className="mt-5 grid gap-4 rounded-[1.5rem] bg-white p-5">
            <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">
              Confirmacion: este boton intenta un envio REAL de prueba mediante Meta Cloud API
              usando la plantilla aviso_reparto_zona. No envia a toda la zona, no activa el cron y no habilita automatizaciones.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Plan/reparto">
                <select
                  className={inputClassName()}
                  defaultValue={deliveryTemplatePlanKey}
                  name="planKey"
                  required
                >
                  {plans.map((plan) => (
                    <option
                      key={`${plan.zoneId}-${plan.deliveryDateKey}`}
                      value={`${plan.zoneId}|${plan.deliveryDateKey}`}
                    >
                      {plan.zoneName} · {plan.deliveryDateLabel}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Numero destinatario autorizado">
                <input
                  className={inputClassName()}
                  name="recipientPhone"
                  placeholder="549..."
                  required
                />
              </Field>
            </div>
            <SubmitButton>Enviar aviso de reparto de prueba</SubmitButton>
          </form>
        </section>

        <section className="rounded-[2rem] border border-brand-100 bg-brand-50/60 p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-slate-900">
              Proximos avisos
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Calculo automatico con zona horaria America/Argentina/Buenos_Aires.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {plans.length ? (
              plans.map((plan) => (
                <article
                  className="rounded-[1.75rem] border border-white bg-white p-5 shadow-sm"
                  key={`${plan.zoneId}-${plan.deliveryDateKey}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700">
                        {plan.zoneName}
                      </p>
                      <h3 className="mt-2 text-xl font-black text-slate-900">
                        Reparto: {plan.deliveryDateLabel}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Aviso: {plan.scheduledDateLabel}
                      </p>
                      <p className="text-sm text-slate-600">
                        Clientes con avisos activos: {plan.customersCount}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                      {plan.status}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <WhatsAppSimulationModal plan={plan} />
                    <form action={simulateWhatsAppReminderPlanAction}>
                      <input name="zoneId" type="hidden" value={plan.zoneId} />
                      <input
                        name="deliveryDateKey"
                        type="hidden"
                        value={plan.deliveryDateKey}
                      />
                      <SecondaryButton>Simular</SecondaryButton>
                    </form>
                    <form action={skipWhatsAppReminderPlanAction}>
                      <input name="zoneId" type="hidden" value={plan.zoneId} />
                      <input
                        name="deliveryDateKey"
                        type="hidden"
                        value={plan.deliveryDateKey}
                      />
                      <SecondaryButton>Omitir</SecondaryButton>
                    </form>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                No hay zonas activas con avisos calculables.
              </p>
            )}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Zonas</h2>
            <div className="mt-5 grid gap-3">
              {zones.map((zone) => (
                <div
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  key={zone.id}
                >
                  <p className="font-black text-slate-900">{zone.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Reparto:{" "}
                    {weekdayOptions.find((item) => item.value === zone.deliveryWeekday)
                      ?.label || zone.deliveryWeekday}
                  </p>
                  <p className="text-sm text-slate-600">
                    Avisar {zone.noticeAdvanceDays} dias antes. Limite:{" "}
                    {formatOrderDeadline(
                      zone.orderDeadlineWeekday,
                      zone.orderDeadlineTime
                    )}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    {zone.isActive ? "Activa" : "Inactiva"}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-black text-slate-900">Nueva zona</h2>
            <form action={upsertDeliveryZoneAction} className="mt-5 grid gap-4">
              <Field label="Nombre">
                <input className={inputClassName()} name="name" required placeholder="Mercedes" />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Dia de reparto">
                  <select className={inputClassName()} name="deliveryWeekday" defaultValue="WEDNESDAY">
                    {weekdayOptions.map((weekday) => (
                      <option key={weekday.value} value={weekday.value}>
                        {weekday.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Dias de anticipacion">
                  <input className={inputClassName()} name="noticeAdvanceDays" defaultValue={2} type="number" />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Dia limite">
                  <select className={inputClassName()} name="orderDeadlineWeekday" defaultValue="TUESDAY">
                    <option value="">A definir</option>
                    {weekdayOptions.map((weekday) => (
                      <option key={weekday.value} value={weekday.value}>
                        {weekday.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Hora limite">
                  <input className={inputClassName()} name="orderDeadlineTime" defaultValue="13:00" />
                </Field>
              </div>
              <Field label="Observaciones">
                <textarea className={inputClassName()} name="notes" rows={3} />
              </Field>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input defaultChecked name="isActive" type="checkbox" />
                Zona activa
              </label>
              <SubmitButton>Guardar zona</SubmitButton>
            </form>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Clientes</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Filtrado por zona y busqueda simple.
                </p>
              </div>
              <form className="flex flex-wrap gap-2" method="get">
                <input className={inputClassName()} defaultValue={search} name="q" placeholder="Buscar" />
                <select className={inputClassName()} defaultValue={selectedZoneId} name="zone">
                  <option value="">Todas</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
                <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white" type="submit">
                  Filtrar
                </button>
              </form>
            </div>

            <div className="mt-5 grid gap-3">
              {filteredCustomers.map((customer) => (
                <div
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  key={customer.id}
                >
                  <p className="font-black text-slate-900">{customer.commercialName}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {customer.contactName || "Sin contacto"} · {customer.city}
                  </p>
                  <p className="text-sm text-slate-600">
                    WhatsApp: {customer.whatsapp || "A definir"} · Tel:{" "}
                    {customer.phone || "A definir"}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    {customer.deliveryZone?.name || "Sin zona"} ·{" "}
                    {customer.isActive ? "Activo" : "Inactivo"} ·{" "}
                    {customer.receivesWhatsappReminders ? "Avisos ON" : "Avisos OFF"}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-black text-slate-900">Nuevo cliente</h2>
            <form action={upsertCustomerAction} className="mt-5 grid gap-4">
              <Field label="Nombre/comercio">
                <input className={inputClassName()} name="commercialName" required />
              </Field>
              <Field label="Contacto">
                <input className={inputClassName()} name="contactName" />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="WhatsApp">
                  <input className={inputClassName()} name="whatsapp" />
                </Field>
                <Field label="Telefono">
                  <input className={inputClassName()} name="phone" />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Localidad">
                  <input className={inputClassName()} name="city" required placeholder="Mercedes" />
                </Field>
                <Field label="Zona">
                  <select className={inputClassName()} name="deliveryZoneId">
                    <option value="">Sin zona</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input defaultChecked name="isActive" type="checkbox" />
                Cliente activo
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input defaultChecked name="receivesWhatsappReminders" type="checkbox" />
                Recibe avisos automaticos
              </label>
              <SubmitButton>Guardar cliente</SubmitButton>
            </form>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Plantillas</h2>
            <div className="mt-5 grid gap-3">
              {templates.map((template) => (
                <div
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  key={template.id}
                >
                  <p className="font-black text-slate-900">{template.name}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    {template.isDefault ? "Default" : "Personalizada"} ·{" "}
                    {template.isActive ? "Activa" : "Inactiva"}
                  </p>
                  <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-white p-3 text-xs leading-5 text-slate-600">
                    {template.content}
                  </pre>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-black text-slate-900">Nueva plantilla</h2>
            <form action={upsertWhatsAppTemplateAction} className="mt-5 grid gap-4">
              <Field label="Nombre">
                <input className={inputClassName()} name="name" defaultValue="Aviso de reparto" required />
              </Field>
              <Field label="Mensaje">
                <textarea
                  className={inputClassName()}
                  defaultValue={`Hola {{nombre}} 👋\n\nTe informamos que el {{dia_reparto}} estaremos realizando entregas de Los Hermanos en {{localidad}}.\n\nSi necesitás realizar un pedido, podés enviárnoslo por este medio hasta {{limite_pedido}}.\n\n¡Gracias!`}
                  name="content"
                  required
                  rows={8}
                />
              </Field>
              <p className="text-xs text-slate-500">
                Variables: {"{{nombre}}"}, {"{{localidad}}"}, {"{{dia_reparto}}"},{" "}
                {"{{fecha_reparto}}"}, {"{{limite_pedido}}"}.
              </p>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input defaultChecked name="isActive" type="checkbox" />
                Plantilla activa
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input defaultChecked name="isDefault" type="checkbox" />
                Usar como predeterminada
              </label>
              <input name="metaTemplateName" type="hidden" value="" />
              <input name="metaLanguage" type="hidden" value="" />
              <SubmitButton>Guardar plantilla</SubmitButton>
            </form>
          </article>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">Historial</h2>
          <div className="mt-5 grid gap-3">
            {notifications.length ? (
              notifications.map((notification) => (
                <article
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  key={notification.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">
                        {notification.customer.commercialName}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Zona: {notification.zone.name} · Reparto:{" "}
                        {formatArgentinaDate(notification.deliveryDate)}
                      </p>
                      <p className="text-sm text-slate-600">
                        Aviso: {formatArgentinaDate(notification.scheduledFor)} ·{" "}
                        Intento:{" "}
                        {notification.attemptedAt
                          ? formatArgentinaDate(notification.attemptedAt)
                          : "A definir"}
                      </p>
                      <p className="text-sm text-slate-600">
                        ID proveedor: {notification.providerMessageId || "A definir"}
                      </p>
                      {notification.errorMessage ? (
                        <p className="mt-1 text-sm font-semibold text-rose-700">
                          Error: {notification.errorMessage}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge status={notification.status} />
                  </div>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-bold text-brand-800">
                      Ver mensaje
                    </summary>
                    <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-white p-3 text-xs leading-5 text-slate-700">
                      {notification.generatedMessage}
                    </pre>
                  </details>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                Todavia no hay avisos registrados.
              </p>
            )}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
