import { PrismaClient, LeadType, PromoCodeStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertZone(zone) {
  const existing = await prisma.zone.findFirst({ where: { name: zone.name } });
  if (existing) {
    return prisma.zone.update({ where: { id: existing.id }, data: zone });
  }
  return prisma.zone.create({ data: zone });
}

async function upsertSalePoint(point) {
  const existing = await prisma.salePoint.findFirst({
    where: { name: point.name, address: point.address }
  });
  if (existing) {
    return prisma.salePoint.update({ where: { id: existing.id }, data: point });
  }
  return prisma.salePoint.create({ data: point });
}

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@loshermanos.com";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { name: "Administrador Los Hermanos", passwordHash },
    create: {
      email: adminEmail,
      name: "Administrador Los Hermanos",
      passwordHash
    }
  });

  const products = [
    {
      name: "Agua desmineralizada 5L",
      slug: "agua-desmineralizada-5l",
      shortDescription: "Formato ideal para uso doméstico, técnico y comercial.",
      fullDescription:
        "Agua desmineralizada pensada para usos donde se requiere pureza controlada. Recomendada para baterías, planchas, radiadores y mantenimiento general.",
      category: "Agua desmineralizada",
      imageUrl:
        "https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      sortOrder: 1
    },
    {
      name: "Agua desmineralizada 10L",
      slug: "agua-desmineralizada-10l",
      shortDescription: "Mayor volumen para talleres, revendedores y logística.",
      fullDescription:
        "Presentación de mayor capacidad para comercios, distribuidores y clientes con reposición frecuente, manteniendo calidad homogénea.",
      category: "Agua desmineralizada",
      imageUrl:
        "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      sortOrder: 2
    },
    {
      name: "Líquido limpiaparabrisas",
      slug: "liquido-limpiaparabrisas",
      shortDescription: "Limpieza clara y práctica para uso automotor.",
      fullDescription:
        "Producto formulado para facilitar la limpieza del parabrisas y mejorar la visibilidad en uso diario automotor.",
      category: "Automotor",
      imageUrl:
        "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      sortOrder: 3
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }

  for (const zone of [
    {
      name: "Rosario y alrededores",
      description: "Cobertura comercial en Rosario, Funes, Roldán y zona inmediata.",
      isActive: true
    },
    {
      name: "Gran Santa Fe",
      description: "Atención comercial para distribuidores y revendedores de la región.",
      isActive: true
    },
    {
      name: "Corredor industrial",
      description: "Cobertura orientada a talleres, industrias y puntos logísticos clave.",
      isActive: true
    }
  ]) {
    await upsertZone(zone);
  }

  for (const point of [
    {
      name: "Autoservicio Centro",
      address: "San Martín 1220",
      city: "Rosario",
      phone: "3415550101",
      latitude: -32.9473,
      longitude: -60.6505,
      isActive: true
    },
    {
      name: "Corralón Norte",
      address: "Av. Alberdi 4500",
      city: "Rosario",
      phone: "3415550102",
      latitude: -32.9057,
      longitude: -60.6754,
      isActive: true
    },
    {
      name: "Distribuidora Oeste",
      address: "Ruta 9 km 312",
      city: "Funes",
      phone: "3415550103",
      latitude: -32.9158,
      longitude: -60.8094,
      isActive: true
    }
  ]) {
    await upsertSalePoint(point);
  }

  for (const setting of [
    {
      key: "home.heroTitle",
      value: "Agua desmineralizada y soluciones para distribución inteligente"
    },
    {
      key: "home.heroText",
      value:
        "Fabricamos, distribuimos y acercamos productos confiables para comercios, talleres y clientes finales."
    },
    { key: "site.tagline", value: "Producción, distribución y cercanía comercial." },
    { key: "contact.whatsapp", value: "+54 9 341 555 0000" },
    { key: "contact.email", value: "ventas@loshermanosagua.com" }
  ]) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
  }

  for (const promoCode of [
    { code: "LH-0001", prize: "no_gana" },
    { code: "LH-0002", prize: "kit_lavado" },
    { code: "LH-0003", prize: "no_gana" },
    { code: "LH-0004", prize: "camiseta_argentina" }
  ]) {
    await prisma.promoCode.upsert({
      where: { code: promoCode.code },
      update: { prize: promoCode.prize, status: PromoCodeStatus.AVAILABLE },
      create: { ...promoCode, status: PromoCodeStatus.AVAILABLE }
    });
  }

  const lead = await prisma.contactLead.findFirst();
  if (!lead) {
    await prisma.contactLead.create({
      data: {
        leadType: LeadType.CONTACT,
        name: "Comercio Demo",
        phone: "3415559999",
        business: "Kiosco Centro",
        city: "Rosario",
        message: "Quiero conocer condiciones comerciales."
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
