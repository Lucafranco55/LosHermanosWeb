import type { Customer, DeliveryZone, WhatsAppTemplate } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatArgentinaDate, formatOrderDeadline } from "./date-utils";

export const defaultWhatsAppTemplateContent = `Hola {{nombre}} 👋

Te informamos que el {{dia_reparto}} estaremos realizando entregas de Los Hermanos en {{localidad}}.

Si necesitás realizar un pedido, podés enviárnoslo por este medio hasta {{limite_pedido}}.

¡Gracias!`;

export async function getOrCreateDefaultWhatsAppTemplate() {
  const existingDefault = await prisma.whatsAppTemplate.findFirst({
    where: { isDefault: true, isActive: true },
    orderBy: { updatedAt: "desc" }
  });

  if (existingDefault) return existingDefault;

  const existingByName = await prisma.whatsAppTemplate.findUnique({
    where: { name: "Aviso de reparto" }
  });

  if (existingByName) {
    return prisma.whatsAppTemplate.update({
      where: { id: existingByName.id },
      data: { isDefault: true, isActive: true }
    });
  }

  return prisma.whatsAppTemplate.create({
    data: {
      name: "Aviso de reparto",
      content: defaultWhatsAppTemplateContent,
      isDefault: true,
      isActive: true
    }
  });
}

export function renderWhatsAppTemplate({
  template,
  customer,
  zone,
  deliveryDate
}: {
  template: Pick<WhatsAppTemplate, "content">;
  customer: Pick<Customer, "commercialName" | "contactName" | "city">;
  zone: Pick<DeliveryZone, "name" | "orderDeadlineWeekday" | "orderDeadlineTime">;
  deliveryDate: Date;
}) {
  const variables: Record<string, string> = {
    nombre: customer.contactName || customer.commercialName,
    dia_reparto: formatArgentinaDate(deliveryDate),
    fecha_reparto: formatArgentinaDate(deliveryDate),
    localidad: customer.city || zone.name,
    limite_pedido: formatOrderDeadline(zone.orderDeadlineWeekday, zone.orderDeadlineTime)
  };

  return template.content.replace(/{{\s*(nombre|dia_reparto|fecha_reparto|localidad|limite_pedido)\s*}}/g, (_, key: string) => {
    return variables[key] || "";
  });
}
