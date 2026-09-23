"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  customerSchema,
  deliveryZoneSchema,
  toBoolean,
  toNumber,
  whatsappTemplateSchema
} from "@/lib/validations";
import {
  markReminderPlanAsSkipped,
  sendDeliveryReminderTemplateTest,
  sendWhatsAppTestMessage,
  simulateReminderPlan
} from "@/lib/whatsapp/reminders";
import { isValidWhatsAppPhone, normalizeWhatsAppPhone } from "@/lib/whatsapp/provider";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableTextValue(formData: FormData, key: string) {
  const value = textValue(formData, key);
  return value || null;
}

function revalidateWhatsAppAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/whatsapp");
}

export async function upsertDeliveryZoneAction(formData: FormData) {
  const parsed = deliveryZoneSchema.parse({
    id: textValue(formData, "id") || undefined,
    name: textValue(formData, "name"),
    deliveryWeekday: textValue(formData, "deliveryWeekday"),
    noticeAdvanceDays: toNumber(formData.get("noticeAdvanceDays"), 2),
    orderDeadlineWeekday: nullableTextValue(formData, "orderDeadlineWeekday"),
    orderDeadlineTime: textValue(formData, "orderDeadlineTime") || "13:00",
    isActive: toBoolean(formData.get("isActive")),
    notes: textValue(formData, "notes")
  });

  if (parsed.id) {
    await prisma.deliveryZone.update({ where: { id: parsed.id }, data: parsed });
  } else {
    await prisma.deliveryZone.create({ data: parsed });
  }

  revalidateWhatsAppAdmin();
}

export async function upsertCustomerAction(formData: FormData) {
  const parsed = customerSchema.parse({
    id: textValue(formData, "id") || undefined,
    commercialName: textValue(formData, "commercialName"),
    contactName: textValue(formData, "contactName"),
    phone: textValue(formData, "phone"),
    whatsapp: textValue(formData, "whatsapp"),
    city: textValue(formData, "city"),
    deliveryZoneId: textValue(formData, "deliveryZoneId"),
    isActive: toBoolean(formData.get("isActive")),
    receivesWhatsappReminders: toBoolean(formData.get("receivesWhatsappReminders"))
  });

  const data = {
    commercialName: parsed.commercialName,
    contactName: parsed.contactName,
    phone: parsed.phone,
    whatsapp: parsed.whatsapp,
    city: parsed.city,
    deliveryZoneId: parsed.deliveryZoneId || null,
    isActive: parsed.isActive,
    receivesWhatsappReminders: parsed.receivesWhatsappReminders
  };

  if (parsed.id) {
    await prisma.customer.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.customer.create({ data });
  }

  revalidateWhatsAppAdmin();
}

export async function upsertWhatsAppTemplateAction(formData: FormData) {
  const parsed = whatsappTemplateSchema.parse({
    id: textValue(formData, "id") || undefined,
    name: textValue(formData, "name"),
    content: textValue(formData, "content"),
    isActive: toBoolean(formData.get("isActive")),
    isDefault: toBoolean(formData.get("isDefault")),
    metaTemplateName: textValue(formData, "metaTemplateName"),
    metaLanguage: textValue(formData, "metaLanguage")
  });

  if (parsed.isDefault) {
    await prisma.whatsAppTemplate.updateMany({
      where: parsed.id ? { id: { not: parsed.id } } : undefined,
      data: { isDefault: false }
    });
  }

  const data = {
    name: parsed.name,
    content: parsed.content,
    isActive: parsed.isActive,
    isDefault: parsed.isDefault,
    metaTemplateName: parsed.metaTemplateName || null,
    metaLanguage: parsed.metaLanguage || null
  };

  if (parsed.id) {
    await prisma.whatsAppTemplate.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.whatsAppTemplate.create({ data });
  }

  revalidateWhatsAppAdmin();
}

export async function skipWhatsAppReminderPlanAction(formData: FormData) {
  const zoneId = textValue(formData, "zoneId");
  const deliveryDateKey = textValue(formData, "deliveryDateKey");
  if (!zoneId || !deliveryDateKey) return;

  await markReminderPlanAsSkipped(zoneId, deliveryDateKey);
  revalidateWhatsAppAdmin();
}

export async function simulateWhatsAppReminderPlanAction(formData: FormData) {
  const zoneId = textValue(formData, "zoneId");
  const deliveryDateKey = textValue(formData, "deliveryDateKey");
  if (!zoneId || !deliveryDateKey) return;

  await simulateReminderPlan(zoneId, deliveryDateKey);
  revalidateWhatsAppAdmin();
}

export async function sendWhatsAppTestMessageAction(formData: FormData) {
  await requireAdmin();

  const planKey = textValue(formData, "planKey");
  let zoneId = textValue(formData, "zoneId");
  let deliveryDateKey = textValue(formData, "deliveryDateKey");
  const recipientPhone = normalizeWhatsAppPhone(textValue(formData, "recipientPhone"));

  if (planKey.includes("|")) {
    const [parsedZoneId, parsedDeliveryDateKey] = planKey.split("|");
    zoneId = parsedZoneId;
    deliveryDateKey = parsedDeliveryDateKey;
  }

  if (!zoneId || !deliveryDateKey || !isValidWhatsAppPhone(recipientPhone)) {
    redirect(
      "/admin/whatsapp?metaTest=failed&metaMessage=Telefono%20invalido"
    );
  }

  const result = await sendWhatsAppTestMessage(
    zoneId,
    deliveryDateKey,
    recipientPhone
  );
  revalidateWhatsAppAdmin();

  const status = result.status === "SENT" ? "sent" : "failed";
  const safeResultDetails = result as {
    httpStatus?: number | null;
    metaErrorCode?: string | number | null;
  };
  const technicalDetails =
    process.env.NODE_ENV === "development" && result.status !== "SENT"
      ? ` HTTP: ${safeResultDetails.httpStatus || "N/A"} Meta code: ${
          safeResultDetails.metaErrorCode || "N/A"
        }`
      : "";
  const message =
    result.status === "SENT"
      ? "Mensaje enviado correctamente mediante Meta WhatsApp."
      : `${result.errorMessage || "No se pudo enviar el mensaje de prueba."}${technicalDetails}`;

  redirect(
    `/admin/whatsapp?metaTest=${status}&metaMessage=${encodeURIComponent(
      message
    )}`
  );
}

export async function sendDeliveryReminderTemplateTestAction(formData: FormData) {
  await requireAdmin();

  const planKey = textValue(formData, "planKey");
  let zoneId = textValue(formData, "zoneId");
  let deliveryDateKey = textValue(formData, "deliveryDateKey");
  const recipientPhone = normalizeWhatsAppPhone(textValue(formData, "recipientPhone"));

  if (planKey.includes("|")) {
    const [parsedZoneId, parsedDeliveryDateKey] = planKey.split("|");
    zoneId = parsedZoneId;
    deliveryDateKey = parsedDeliveryDateKey;
  }

  if (!zoneId || !deliveryDateKey || !isValidWhatsAppPhone(recipientPhone)) {
    redirect(
      "/admin/whatsapp?deliveryTemplateTest=failed&deliveryTemplateMessage=Telefono%20invalido"
    );
  }

  const result = await sendDeliveryReminderTemplateTest(
    zoneId,
    deliveryDateKey,
    recipientPhone
  );
  revalidateWhatsAppAdmin();

  const safeResultDetails = result as {
    httpStatus?: number | null;
    metaErrorCode?: string | number | null;
  };
  const technicalDetails =
    process.env.NODE_ENV === "development" && result.status !== "SENT"
      ? ` HTTP: ${safeResultDetails.httpStatus || "N/A"} Meta code: ${
          safeResultDetails.metaErrorCode || "N/A"
        }`
      : "";
  const status = result.status === "SENT" ? "sent" : "failed";
  const message =
    result.status === "SENT"
      ? "Aviso de reparto enviado correctamente mediante Meta WhatsApp."
      : `${result.errorMessage || "No se pudo enviar la plantilla aviso_reparto_zona."}${technicalDetails}`;

  redirect(
    `/admin/whatsapp?deliveryTemplateTest=${status}&deliveryTemplateMessage=${encodeURIComponent(
      message
    )}`
  );
}
