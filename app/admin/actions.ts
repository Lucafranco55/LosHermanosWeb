"use server";

import { LeadStatus, PromoCodeStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  leadStatusSchema,
  productSchema,
  salePointSchema,
  siteSettingSchema,
  toBoolean,
  toNumber,
  zoneSchema
} from "@/lib/validations";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function upsertProductAction(formData: FormData) {
  const parsed = productSchema.parse({
    id: textValue(formData, "id") || undefined,
    name: textValue(formData, "name"),
    slug: textValue(formData, "slug"),
    shortDescription: textValue(formData, "shortDescription"),
    fullDescription: textValue(formData, "fullDescription"),
    category: textValue(formData, "category"),
    imageUrl: textValue(formData, "imageUrl"),
    isActive: toBoolean(formData.get("isActive")),
    sortOrder: toNumber(formData.get("sortOrder"))
  });

  if (parsed.id) {
    await prisma.product.update({ where: { id: parsed.id }, data: parsed });
  } else {
    await prisma.product.create({ data: parsed });
  }

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
}

export async function deleteProductAction(formData: FormData) {
  const id = textValue(formData, "id");
  if (!id) return;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
}

export async function upsertZoneAction(formData: FormData) {
  const parsed = zoneSchema.parse({
    id: textValue(formData, "id") || undefined,
    name: textValue(formData, "name"),
    description: textValue(formData, "description"),
    isActive: toBoolean(formData.get("isActive"))
  });

  if (parsed.id) {
    await prisma.zone.update({ where: { id: parsed.id }, data: parsed });
  } else {
    await prisma.zone.create({ data: parsed });
  }

  revalidatePath("/distribucion");
  revalidatePath("/admin");
  revalidatePath("/admin/zonas");
}

export async function deleteZoneAction(formData: FormData) {
  const id = textValue(formData, "id");
  if (!id) return;
  await prisma.zone.delete({ where: { id } });
  revalidatePath("/distribucion");
  revalidatePath("/admin");
  revalidatePath("/admin/zonas");
}

export async function upsertSalePointAction(formData: FormData) {
  const parsed = salePointSchema.parse({
    id: textValue(formData, "id") || undefined,
    name: textValue(formData, "name"),
    address: textValue(formData, "address"),
    city: textValue(formData, "city"),
    phone: textValue(formData, "phone"),
    latitude: toNumber(formData.get("latitude")),
    longitude: toNumber(formData.get("longitude")),
    isActive: toBoolean(formData.get("isActive"))
  });

  if (parsed.id) {
    await prisma.salePoint.update({ where: { id: parsed.id }, data: parsed });
  } else {
    await prisma.salePoint.create({ data: parsed });
  }

  revalidatePath("/puntos-de-venta");
  revalidatePath("/admin");
  revalidatePath("/admin/puntos-de-venta");
}

export async function deleteSalePointAction(formData: FormData) {
  const id = textValue(formData, "id");
  if (!id) return;
  await prisma.salePoint.delete({ where: { id } });
  revalidatePath("/puntos-de-venta");
  revalidatePath("/admin");
  revalidatePath("/admin/puntos-de-venta");
}

export async function updateLeadStatusAction(formData: FormData) {
  const id = textValue(formData, "id");
  const status = leadStatusSchema.parse(textValue(formData, "status")) as LeadStatus;
  if (!id) return;
  await prisma.contactLead.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
  revalidatePath("/admin/consultas");
}

export async function upsertPromoCodeAction(formData: FormData) {
  const code = textValue(formData, "code").toUpperCase();
  const prize = textValue(formData, "prize");
  if (!code || !prize) return;

  await prisma.promoCode.upsert({
    where: { code },
    update: {
      prize,
      status: PromoCodeStatus.AVAILABLE,
      claimedAt: null,
      claimantName: null,
      claimantPhone: null,
      claimantBusiness: null,
      claimantCity: null
    },
    create: {
      code,
      prize,
      status: PromoCodeStatus.AVAILABLE
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/promo");
}

export async function upsertSiteSettingAction(formData: FormData) {
  const parsed = siteSettingSchema.parse({
    key: textValue(formData, "key"),
    value: textValue(formData, "value")
  });

  await prisma.siteSetting.upsert({
    where: { key: parsed.key },
    update: { value: parsed.value },
    create: parsed
  });

  revalidatePath("/");
  revalidatePath("/contacto");
  revalidatePath("/admin/contenido");
}
