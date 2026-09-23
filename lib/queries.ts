import { prisma } from "./prisma";

export async function getSiteSettingsMap() {
  try {
    const settings = await prisma.siteSetting.findMany();
    return Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
  } catch {
    return {};
  }
}

export async function getActiveProducts(categorySlug?: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        isActive: true,
        ...(categorySlug ? { slug: categorySlug } : {})
      }
    },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug }, include: { category: true } });
}

export async function getActiveProductCategories() {
  return prisma.productCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });
}

export async function getAllProductCategories() {
  return prisma.productCategory.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });
}

export async function getProductCategoryBySlug(slug: string) {
  return prisma.productCategory.findUnique({ where: { slug } });
}

export async function getActiveZones() {
  return prisma.zone.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });
}

export async function getAllZones() {
  return prisma.zone.findMany({
    orderBy: { name: "asc" }
  });
}

export async function getActiveSalePoints() {
  return prisma.salePoint.findMany({
    where: { isActive: true },
    orderBy: [{ city: "asc" }, { name: "asc" }]
  });
}

export async function getAllSalePoints() {
  return prisma.salePoint.findMany({
    orderBy: [{ city: "asc" }, { name: "asc" }]
  });
}

export async function getDashboardSummary() {
  const [products, zones, salePoints, leads, promoCodes] = await Promise.all([
    prisma.product.count(),
    prisma.zone.count(),
    prisma.salePoint.count(),
    prisma.contactLead.count(),
    prisma.promoCode.count()
  ]);

  return { products, zones, salePoints, leads, promoCodes };
}

export async function getPromoDashboardSummary() {
  const [total, winners, claimed, pending] = await Promise.all([
    prisma.promoCode.count(),
    prisma.promoCode.count({ where: { prize: { not: "no_gana" } } }),
    prisma.promoCode.count({ where: { status: "CLAIMED" } }),
    prisma.promoCode.count({ where: { prize: { not: "no_gana" }, status: "AVAILABLE" } })
  ]);

  return { total, winners, claimed, pending };
}

export async function getPromoCodes(q?: string) {
  return prisma.promoCode.findMany({
    where: q
      ? {
          OR: [
            { code: { contains: q, mode: "insensitive" } },
            { claimantName: { contains: q, mode: "insensitive" } },
            { claimantCity: { contains: q, mode: "insensitive" } }
          ]
        }
      : undefined,
    orderBy: [{ claimedAt: "desc" }, { code: "asc" }],
    take: 150
  });
}
