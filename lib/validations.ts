import { DeliveryWeekday, LeadStatus, LeadType } from "@prisma/client";
import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(6).max(120)
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140),
  shortDescription: z.string().trim().max(220),
  fullDescription: z.string().trim().max(2000),
  recommendedUses: z.string().trim().max(1200),
  presentation: z.string().trim().max(500),
  categoryId: z.string().trim().min(1),
  badgeText: z.string().trim().max(60).optional().or(z.literal("")),
  imageUrl: z
    .string()
    .trim()
    .max(500)
    .refine((value) => !value || value.startsWith("/") || z.string().url().safeParse(value).success, {
      message: "Usá una URL completa o una ruta local que empiece con /"
    }),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999)
});

export const productCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usá minúsculas, números y guiones"),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999)
});

export const zoneSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(500),
  isActive: z.boolean()
});

export const salePointSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  address: z.string().trim().min(5).max(180),
  city: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  isActive: z.boolean()
});

export const contactLeadSchema = z.object({
  leadType: z.nativeEnum(LeadType),
  name: z.string().trim().min(3).max(120),
  phone: z.string().trim().min(6).max(30),
  business: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(100),
  message: z.string().trim().min(10).max(1000)
});

export const promoValidateSchema = z.object({
  code: z.string().trim().min(4).max(20)
});

export const promoClaimSchema = z.object({
  code: z.string().trim().min(4).max(20),
  claimantName: z.string().trim().min(3).max(120),
  claimantPhone: z.string().trim().min(6).max(30),
  claimantBusiness: z.string().trim().max(120).optional().or(z.literal("")),
  claimantCity: z.string().trim().min(2).max(100)
});

export const siteSettingSchema = z.object({
  key: z.string().trim().min(2).max(100),
  value: z.string().trim().max(5000)
});

export const deliveryZoneSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  deliveryWeekday: z.nativeEnum(DeliveryWeekday),
  noticeAdvanceDays: z.number().int().min(0).max(14),
  orderDeadlineWeekday: z.nativeEnum(DeliveryWeekday).optional().nullable(),
  orderDeadlineTime: z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Usá formato HH:mm"),
  isActive: z.boolean(),
  notes: z.string().trim().max(1000)
});

export const customerSchema = z.object({
  id: z.string().optional(),
  commercialName: z.string().trim().min(2).max(160),
  contactName: z.string().trim().max(120),
  phone: z.string().trim().max(40),
  whatsapp: z.string().trim().max(40),
  city: z.string().trim().min(2).max(120),
  deliveryZoneId: z.string().trim().optional().or(z.literal("")),
  isActive: z.boolean(),
  receivesWhatsappReminders: z.boolean()
});

export const whatsappTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  content: z.string().trim().min(10).max(4000),
  isActive: z.boolean(),
  isDefault: z.boolean(),
  metaTemplateName: z.string().trim().max(160).optional().or(z.literal("")),
  metaLanguage: z.string().trim().max(20).optional().or(z.literal(""))
});

export const leadStatusSchema = z.nativeEnum(LeadStatus);

export function toBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

export function toNumber(value: FormDataEntryValue | null, fallback = 0) {
  if (typeof value !== "string") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizePromoCode(code: string) {
  return code.replace(/[^a-zA-Z0-9-]/g, "").toUpperCase().trim();
}
