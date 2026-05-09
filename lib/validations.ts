import { LeadStatus, LeadType } from "@prisma/client";
import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(6).max(120)
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140),
  shortDescription: z.string().trim().min(10).max(220),
  fullDescription: z.string().trim().min(20).max(2000),
  category: z.string().trim().min(2).max(80),
  imageUrl: z.string().trim().url(),
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
