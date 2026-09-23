import { WhatsAppNotificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  formatArgentinaDate,
  formatOrderDeadline,
  getArgentinaDateKey,
  getDueReminderPlanForZone,
  getNextReminderPlanForZone
} from "./date-utils";
import {
  canUseMetaForAutomaticSends,
  getMetaWhatsAppProviderForManualTest,
  getWhatsAppProvider,
  sendDeliveryReminderTemplate,
  isWhatsAppSimulationMode
} from "./provider";
import { getOrCreateDefaultWhatsAppTemplate, renderWhatsAppTemplate } from "./templates";

type ReminderCustomerPreview = {
  id: string;
  name: string;
  contactName: string;
  whatsapp: string;
  city: string;
  message: string;
};

export type UpcomingReminderPlan = {
  zoneId: string;
  zoneName: string;
  deliveryDateKey: string;
  scheduledDateKey: string;
  deliveryDateLabel: string;
  scheduledDateLabel: string;
  customersCount: number;
  status: string;
  customers: ReminderCustomerPreview[];
};

function notificationStatusLabel(statuses: WhatsAppNotificationStatus[], scheduledDateKey: string, todayKey: string) {
  if (!statuses.length) return scheduledDateKey === todayKey ? "Pendiente" : "Programado";
  if (statuses.every((status) => status === WhatsAppNotificationStatus.SKIPPED)) return "Omitido";
  if (statuses.some((status) => status === WhatsAppNotificationStatus.FAILED)) return "Con errores";
  if (statuses.some((status) => status === WhatsAppNotificationStatus.SENT)) return "Enviado";
  if (statuses.some((status) => status === WhatsAppNotificationStatus.SIMULATED)) return "Simulado";
  return "Pendiente";
}

export async function getWhatsAppDashboardSummary() {
  const today = new Date();
  const zones = await prisma.deliveryZone.findMany({ where: { isActive: true } });
  let noticesToday = 0;
  let upcomingDeliveries = 0;

  for (const zone of zones) {
    const duePlan = getDueReminderPlanForZone(zone, today);
    if (duePlan) noticesToday += 1;

    const nextPlan = getNextReminderPlanForZone(zone, today);
    if (nextPlan) upcomingDeliveries += 1;
  }

  const [customersWithWhatsapp, errors] = await Promise.all([
    prisma.customer.count({
      where: {
        isActive: true,
        receivesWhatsappReminders: true,
        whatsapp: { not: "" }
      }
    }),
    prisma.whatsAppNotification.count({
      where: { status: WhatsAppNotificationStatus.FAILED }
    })
  ]);

  return { noticesToday, upcomingDeliveries, customersWithWhatsapp, errors };
}

export async function getUpcomingWhatsAppReminderPlans(limit = 8) {
  const template = await getOrCreateDefaultWhatsAppTemplate();
  const todayKey = getArgentinaDateKey();

  const zones = await prisma.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });

  const plans: UpcomingReminderPlan[] = [];

  for (const zone of zones) {
    const plan = getNextReminderPlanForZone(zone);
    if (!plan) continue;

    const customers = await prisma.customer.findMany({
      where: {
        deliveryZoneId: zone.id,
        isActive: true,
        receivesWhatsappReminders: true,
        whatsapp: { not: "" }
      },
      orderBy: [{ city: "asc" }, { commercialName: "asc" }]
    });

    const notifications = await prisma.whatsAppNotification.findMany({
      where: {
        zoneId: zone.id,
        deliveryDate: plan.deliveryDate
      },
      select: { status: true }
    });

    plans.push({
      zoneId: zone.id,
      zoneName: zone.name,
      deliveryDateKey: plan.deliveryDateKey,
      scheduledDateKey: plan.scheduledDateKey,
      deliveryDateLabel: formatArgentinaDate(plan.deliveryDate),
      scheduledDateLabel: formatArgentinaDate(plan.scheduledFor),
      customersCount: customers.length,
      status: notificationStatusLabel(
        notifications.map((notification) => notification.status),
        plan.scheduledDateKey,
        todayKey
      ),
      customers: customers.map((customer) => ({
        id: customer.id,
        name: customer.commercialName,
        contactName: customer.contactName,
        whatsapp: customer.whatsapp,
        city: customer.city,
        message: renderWhatsAppTemplate({
          template,
          customer,
          zone,
          deliveryDate: plan.deliveryDate
        })
      }))
    });
  }

  return plans
    .sort((left, right) => left.scheduledDateKey.localeCompare(right.scheduledDateKey))
    .slice(0, limit);
}

export async function processDueWhatsAppReminders(now = new Date()) {
  const template = await getOrCreateDefaultWhatsAppTemplate();
  const provider = getWhatsAppProvider();
  const simulationMode = isWhatsAppSimulationMode();
  const zones = await prisma.deliveryZone.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });

  const result = {
    simulationMode,
    automaticSendsDisabled: !simulationMode && !canUseMetaForAutomaticSends(),
    zonesChecked: zones.length,
    zonesDue: 0,
    created: 0,
    skippedExisting: 0,
    failed: 0
  };

  // Seguridad operativa: aunque el provider sea Meta, el cron no envia real hasta habilitar explicitamente WHATSAPP_AUTOMATIC_SEND_ENABLED.
  if (result.automaticSendsDisabled) {
    return result;
  }

  for (const zone of zones) {
    const plan = getDueReminderPlanForZone(zone, now);
    if (!plan) continue;

    result.zonesDue += 1;

    const customers = await prisma.customer.findMany({
      where: {
        deliveryZoneId: zone.id,
        isActive: true,
        receivesWhatsappReminders: true,
        whatsapp: { not: "" }
      },
      orderBy: { commercialName: "asc" }
    });

    for (const customer of customers) {
      const generatedMessage = renderWhatsAppTemplate({
        template,
        customer,
        zone,
        deliveryDate: plan.deliveryDate
      });

      const existing = await prisma.whatsAppNotification.findUnique({
        where: {
          customerId_zoneId_deliveryDate: {
            customerId: customer.id,
            zoneId: zone.id,
            deliveryDate: plan.deliveryDate
          }
        }
      });

      if (existing) {
        result.skippedExisting += 1;
        continue;
      }

      try {
        const providerResult =
          simulationMode || canUseMetaForAutomaticSends()
          ? await provider.sendMessage({
              to: customer.whatsapp,
              message: generatedMessage,
              customerId: customer.id,
              zoneId: zone.id
            })
          : {
              status: "FAILED" as const,
              errorMessage:
                "Envio automatico real deshabilitado. Requiere WHATSAPP_ENABLE_AUTOMATED_SENDS=true ademas de Meta configurado."
            };

        await prisma.whatsAppNotification.create({
          data: {
            customerId: customer.id,
            zoneId: zone.id,
            templateId: template.id,
            deliveryDate: plan.deliveryDate,
            scheduledFor: plan.scheduledFor,
            attemptedAt: new Date(),
            generatedMessage,
            status:
              providerResult.status === "SIMULATED"
                ? WhatsAppNotificationStatus.SIMULATED
                : providerResult.status === "SENT"
                  ? WhatsAppNotificationStatus.SENT
                  : WhatsAppNotificationStatus.FAILED,
            providerMessageId: providerResult.providerMessageId,
            errorMessage: providerResult.errorMessage
          }
        });

        if (providerResult.status === "FAILED") result.failed += 1;
        else result.created += 1;
      } catch (error) {
        result.failed += 1;
        await prisma.whatsAppNotification.create({
          data: {
            customerId: customer.id,
            zoneId: zone.id,
            templateId: template.id,
            deliveryDate: plan.deliveryDate,
            scheduledFor: plan.scheduledFor,
            attemptedAt: new Date(),
            generatedMessage,
            status: WhatsAppNotificationStatus.FAILED,
            errorMessage: error instanceof Error ? error.message : "Error desconocido"
          }
        });
      }
    }
  }

  return result;
}

export async function markReminderPlanAsSkipped(zoneId: string, deliveryDateKey: string) {
  const template = await getOrCreateDefaultWhatsAppTemplate();
  const zone = await prisma.deliveryZone.findUnique({ where: { id: zoneId } });
  if (!zone) return { skipped: 0 };

  const plan = getNextReminderPlanForZone(zone);
  if (!plan || plan.deliveryDateKey !== deliveryDateKey) return { skipped: 0 };

  const customers = await prisma.customer.findMany({
    where: {
      deliveryZoneId: zone.id,
      isActive: true,
      receivesWhatsappReminders: true,
      whatsapp: { not: "" }
    }
  });

  let skipped = 0;

  for (const customer of customers) {
    const generatedMessage = renderWhatsAppTemplate({
      template,
      customer,
      zone,
      deliveryDate: plan.deliveryDate
    });

    await prisma.whatsAppNotification.upsert({
      where: {
        customerId_zoneId_deliveryDate: {
          customerId: customer.id,
          zoneId: zone.id,
          deliveryDate: plan.deliveryDate
        }
      },
      update: {
        status: WhatsAppNotificationStatus.SKIPPED,
        generatedMessage,
        scheduledFor: plan.scheduledFor,
        templateId: template.id,
        attemptedAt: new Date()
      },
      create: {
        customerId: customer.id,
        zoneId: zone.id,
        templateId: template.id,
        deliveryDate: plan.deliveryDate,
        scheduledFor: plan.scheduledFor,
        attemptedAt: new Date(),
        generatedMessage,
        status: WhatsAppNotificationStatus.SKIPPED
      }
    });

    skipped += 1;
  }

  return { skipped };
}

export async function simulateReminderPlan(zoneId: string, deliveryDateKey: string) {
  const template = await getOrCreateDefaultWhatsAppTemplate();
  const zone = await prisma.deliveryZone.findUnique({ where: { id: zoneId } });
  if (!zone) return { simulated: 0 };

  const plan = getNextReminderPlanForZone(zone);
  if (!plan || plan.deliveryDateKey !== deliveryDateKey) return { simulated: 0 };

  const customers = await prisma.customer.findMany({
    where: {
      deliveryZoneId: zone.id,
      isActive: true,
      receivesWhatsappReminders: true,
      whatsapp: { not: "" }
    },
    orderBy: [{ city: "asc" }, { commercialName: "asc" }]
  });

  let simulated = 0;

  for (const customer of customers) {
    const generatedMessage = renderWhatsAppTemplate({
      template,
      customer,
      zone,
      deliveryDate: plan.deliveryDate
    });

    await prisma.whatsAppNotification.upsert({
      where: {
        customerId_zoneId_deliveryDate: {
          customerId: customer.id,
          zoneId: zone.id,
          deliveryDate: plan.deliveryDate
        }
      },
      update: {
        status: WhatsAppNotificationStatus.SIMULATED,
        generatedMessage,
        scheduledFor: plan.scheduledFor,
        templateId: template.id,
        attemptedAt: new Date(),
        providerMessageId: null,
        errorMessage: null
      },
      create: {
        customerId: customer.id,
        zoneId: zone.id,
        templateId: template.id,
        deliveryDate: plan.deliveryDate,
        scheduledFor: plan.scheduledFor,
        attemptedAt: new Date(),
        generatedMessage,
        status: WhatsAppNotificationStatus.SIMULATED,
        providerMessageId: null,
        errorMessage: null
      }
    });

    simulated += 1;
  }

  return { simulated };
}

export async function sendWhatsAppTestMessage(
  zoneId: string,
  deliveryDateKey: string,
  recipientPhone: string
) {
  const zone = await prisma.deliveryZone.findUnique({ where: { id: zoneId } });
  if (!zone) return { status: "FAILED" as const, errorMessage: "Zona no encontrada." };

  const plan = getNextReminderPlanForZone(zone);
  if (!plan || plan.deliveryDateKey !== deliveryDateKey) {
    return {
      status: "FAILED" as const,
      errorMessage: "No se encontro el plan de reparto solicitado."
    };
  }

  const customer = await prisma.customer.findFirst({
    where: {
      deliveryZoneId: zone.id,
      isActive: true,
      receivesWhatsappReminders: true,
      whatsapp: { not: "" }
    },
    orderBy: [{ city: "asc" }, { commercialName: "asc" }]
  });

  if (!customer) {
    return {
      status: "FAILED" as const,
      errorMessage: "No hay clientes activos con WhatsApp en esta zona."
    };
  }

  const generatedMessage =
    "Prueba manual Meta WhatsApp Cloud API: template hello_world (en_US). " +
    `Destinatario: ${recipientPhone}. Zona de referencia: ${zone.name}. ` +
    `Cliente de referencia: ${customer.commercialName}.`;

  const providerResult = await getMetaWhatsAppProviderForManualTest().sendTemplate({
    to: recipientPhone,
    templateName: "hello_world",
    languageCode: "en_US"
  });

  const notificationStatus =
    providerResult.status === "SENT"
      ? WhatsAppNotificationStatus.SENT
      : providerResult.status === "SIMULATED"
        ? WhatsAppNotificationStatus.SIMULATED
        : WhatsAppNotificationStatus.FAILED;

  await prisma.whatsAppNotification.upsert({
    where: {
      customerId_zoneId_deliveryDate: {
        customerId: customer.id,
        zoneId: zone.id,
        deliveryDate: plan.deliveryDate
      }
    },
    update: {
      status: notificationStatus,
      generatedMessage,
      scheduledFor: plan.scheduledFor,
      templateId: null,
      attemptedAt: new Date(),
      providerMessageId: providerResult.providerMessageId || null,
      errorMessage: providerResult.errorMessage || null
    },
    create: {
      customerId: customer.id,
      zoneId: zone.id,
      templateId: null,
      deliveryDate: plan.deliveryDate,
      scheduledFor: plan.scheduledFor,
      attemptedAt: new Date(),
      generatedMessage,
      status: notificationStatus,
      providerMessageId: providerResult.providerMessageId || null,
      errorMessage: providerResult.errorMessage || null
    }
  });

  return providerResult;
}

export async function sendDeliveryReminderTemplateTest(
  zoneId: string,
  deliveryDateKey: string,
  recipientPhone: string
) {
  const zone = await prisma.deliveryZone.findUnique({ where: { id: zoneId } });
  if (!zone) return { status: "FAILED" as const, errorMessage: "Zona no encontrada." };

  const plan = getNextReminderPlanForZone(zone);
  if (!plan || plan.deliveryDateKey !== deliveryDateKey) {
    return {
      status: "FAILED" as const,
      errorMessage: "No se encontro el plan de reparto solicitado."
    };
  }

  const customer = await prisma.customer.findFirst({
    where: {
      deliveryZoneId: zone.id,
      isActive: true,
      receivesWhatsappReminders: true,
      whatsapp: { not: "" }
    },
    orderBy: [{ city: "asc" }, { commercialName: "asc" }]
  });

  if (!customer) {
    return {
      status: "FAILED" as const,
      errorMessage: "No hay clientes activos con WhatsApp en esta zona."
    };
  }

  const templateValues = {
    customerName: customer.contactName || customer.commercialName,
    deliveryDateLabel: formatArgentinaDate(plan.deliveryDate),
    zoneName: customer.city || zone.name,
    orderDeadlineLabel: formatOrderDeadline(
      zone.orderDeadlineWeekday,
      zone.orderDeadlineTime
    )
  };
  const providerResult = await sendDeliveryReminderTemplate({
    to: recipientPhone,
    ...templateValues
  });
  const notificationStatus =
    providerResult.status === "SENT"
      ? WhatsAppNotificationStatus.SENT
      : providerResult.status === "SIMULATED"
        ? WhatsAppNotificationStatus.SIMULATED
        : WhatsAppNotificationStatus.FAILED;
  const generatedMessage =
    "Prueba manual Meta WhatsApp Cloud API: template aviso_reparto_zona (es_AR).\n\n" +
    `{{1}} nombre del cliente: ${templateValues.customerName}\n` +
    `{{2}} dia/fecha del reparto: ${templateValues.deliveryDateLabel}\n` +
    `{{3}} zona/localidad: ${templateValues.zoneName}\n` +
    `{{4}} limite de pedido: ${templateValues.orderDeadlineLabel}`;

  await prisma.whatsAppNotification.upsert({
    where: {
      customerId_zoneId_deliveryDate: {
        customerId: customer.id,
        zoneId: zone.id,
        deliveryDate: plan.deliveryDate
      }
    },
    update: {
      status: notificationStatus,
      generatedMessage,
      scheduledFor: plan.scheduledFor,
      templateId: null,
      attemptedAt: new Date(),
      providerMessageId: providerResult.providerMessageId || null,
      errorMessage: providerResult.errorMessage || null
    },
    create: {
      customerId: customer.id,
      zoneId: zone.id,
      templateId: null,
      deliveryDate: plan.deliveryDate,
      scheduledFor: plan.scheduledFor,
      attemptedAt: new Date(),
      generatedMessage,
      status: notificationStatus,
      providerMessageId: providerResult.providerMessageId || null,
      errorMessage: providerResult.errorMessage || null
    }
  });

  return {
    ...providerResult,
    templateValues
  };
}
