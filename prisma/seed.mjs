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

async function createSiteSettingIfMissing(setting) {
  const existing = await prisma.siteSetting.findUnique({ where: { key: setting.key } });
  if (existing) return existing;
  return prisma.siteSetting.create({ data: setting });
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
      shortDescription: "Formato ideal para uso domestico, tecnico y comercial.",
      fullDescription:
        "Agua desmineralizada pensada para usos donde se requiere pureza controlada. Recomendada para baterias, planchas, radiadores y mantenimiento general.",
      category: "Agua desmineralizada",
      imageUrl:
        "https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      sortOrder: 1
    },
    {
      name: "Agua desmineralizada 10L",
      slug: "agua-desmineralizada-10l",
      shortDescription: "Mayor volumen para talleres, revendedores y logistica.",
      fullDescription:
        "Presentacion de mayor capacidad para comercios, distribuidores y clientes con reposicion frecuente, manteniendo calidad homogenea.",
      category: "Agua desmineralizada",
      imageUrl:
        "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      sortOrder: 2
    },
    {
      name: "Liquido limpiaparabrisas",
      slug: "liquido-limpiaparabrisas",
      shortDescription: "Limpieza clara y practica para uso automotor.",
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
      description: "Cobertura comercial en Rosario, Funes, Roldan y zona inmediata.",
      isActive: true
    },
    {
      name: "Gran Santa Fe",
      description: "Atencion comercial para distribuidores y revendedores de la region.",
      isActive: true
    },
    {
      name: "Corredor industrial",
      description: "Cobertura orientada a talleres, industrias y puntos logisticos clave.",
      isActive: true
    }
  ]) {
    await upsertZone(zone);
  }

  for (const point of [
    {
      name: "Autoservicio Centro",
      address: "San Martin 1220",
      city: "Rosario",
      phone: "3415550101",
      latitude: -32.9473,
      longitude: -60.6505,
      isActive: true
    },
    {
      name: "Corralon Norte",
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
    { key: "brand.name", value: "Los Hermanos" },
    { key: "brand.slogan", value: "Produccion y distribucion" },
    {
      key: "brand.description",
      value: "Produccion y distribucion de agua desmineralizada y productos automotores."
    },
    { key: "contact.whatsapp", value: "2241562965" },
    { key: "contact.email", value: "ventas@loshermanosagua.com" },
    { key: "contact.instagram", value: "https://www.instagram.com/" },
    { key: "contact.address", value: "General Belgrano y zona de cobertura" },
    { key: "home.heroEyebrow", value: "Los Hermanos" },
    {
      key: "home.heroTitle",
      value: "Agua desmineralizada y soluciones para distribucion inteligente"
    },
    {
      key: "home.heroText",
      value:
        "Fabricamos, distribuimos y acercamos productos confiables para comercios, talleres y clientes finales."
    },
    { key: "home.primaryCtaLabel", value: "Hablar por WhatsApp" },
    { key: "home.secondaryCtaLabel", value: "Ver productos" },
    { key: "home.highlight1", value: "Produccion confiable" },
    { key: "home.highlight2", value: "Distribucion organizada" },
    { key: "home.highlight3", value: "Cobertura comercial" },
    { key: "home.aboutEyebrow", value: "Quienes somos" },
    { key: "home.aboutTitle", value: "Produccion, distribucion y cercania comercial." },
    {
      key: "home.aboutText",
      value:
        "Web institucional enfocada en catalogo, puntos de venta y captacion comercial sin complejidad de e-commerce."
    },
    { key: "home.productsStatLabel", value: "Productos activos" },
    { key: "home.zonesStatLabel", value: "Zonas de distribucion" },
    { key: "home.feature1Title", value: "Catalogo ordenado" },
    {
      key: "home.feature1Text",
      value: "Presentacion clara de linea de productos, categorias y detalles sin ruido comercial."
    },
    { key: "home.feature2Title", value: "Distribucion escalable" },
    {
      key: "home.feature2Text",
      value: "Cobertura territorial, puntos de venta y consultas centralizadas para crecimiento operativo."
    },
    { key: "home.feature3Title", value: "Promo controlada" },
    {
      key: "home.feature3Text",
      value: "Validacion de codigos, reclamos y trazabilidad sin exponer logica sensible al frontend."
    },
    { key: "contact.badge", value: "Contacto" },
    { key: "contact.title", value: "Hablemos de productos y distribucion" },
    {
      key: "contact.subtitle",
      value:
        "Los Hermanos produce y distribuye agua desmineralizada y productos automotores para comercios, talleres y estaciones de servicio."
    },
    { key: "contact.companyTitle", value: "Los Hermanos" },
    {
      key: "contact.companyDescription",
      value: "Produccion y distribucion de agua desmineralizada y productos automotores."
    },
    { key: "contact.phoneLabel", value: "WhatsApp / telefono principal" },
    { key: "contact.emailLabel", value: "Email" },
    { key: "contact.addressLabel", value: "Zona de trabajo" },
    { key: "contact.instagramLabel", value: "Instagram" },
    { key: "contact.instagramText", value: "Ver perfil" },
    { key: "contact.generalFormTitle", value: "Consulta general" },
    { key: "contact.generalFormDescription", value: "Envianos tu consulta y te respondemos a la brevedad." },
    { key: "contact.generalFormSubmit", value: "Enviar consulta" },
    { key: "contact.resellerFormTitle", value: "Quiero ser cliente o distribuidor" },
    {
      key: "contact.resellerFormDescription",
      value:
        "Completa tus datos comerciales para que podamos evaluar la zona, el tipo de comercio y la operatoria."
    },
    { key: "contact.resellerFormSubmit", value: "Enviar datos comerciales" },
    { key: "quality.badge", value: "Calidad" },
    { key: "quality.title", value: "Calidad y analisis" },
    {
      key: "quality.subtitle",
      value:
        "Controlamos la pureza de nuestra agua desmineralizada para garantizar un producto confiable para uso automotor e industrial."
    },
    { key: "quality.pdfLabel", value: "Ver analisis de laboratorio" },
    { key: "quality.pdfUrl", value: "/analisis-laboratorio.pdf" },
    { key: "quality.phLabel", value: "pH" },
    { key: "quality.ph", value: "pH controlado para mantener estabilidad en aplicaciones automotrices e industriales." },
    { key: "quality.tdsLabel", value: "TDS" },
    { key: "quality.tds", value: "TDS reducido, con bajo nivel de solidos disueltos." },
    { key: "quality.conductivityLabel", value: "Conductividad" },
    { key: "quality.conductivity", value: "Conductividad controlada para verificar la desmineralizacion del agua." },
    { key: "quality.processLabel", value: "Proceso por osmosis inversa" },
    { key: "quality.process", value: "Proceso por osmosis inversa para reducir sales, minerales e impurezas." },
    { key: "quality.usageLabel", value: "Uso automotor e industrial" },
    {
      key: "quality.usage",
      value: "Uso recomendado en baterias, radiadores, talleres, estaciones de servicio y procesos industriales."
    },
    { key: "cobertura.badge", value: "Cobertura" },
    { key: "cobertura.title", value: "Zonas de cobertura y distribuidores" },
    {
      key: "cobertura.subtitle",
      value: "Realizamos entregas programadas y distribucion mayorista segun zona y demanda."
    },
    { key: "cobertura.mapTitle", value: "Mapa de cobertura" },
    {
      key: "cobertura.mapText",
      value: "Mapa real de localidades donde organizamos entregas programadas y cobertura comercial."
    },
    { key: "cobertura.distributorsTitle", value: "Distribuidores oficiales" },
    {
      key: "cobertura.distributorsIntro",
      value:
        "Contamos con distribuidores aliados para mejorar la atencion, disponibilidad y cobertura de nuestros productos."
    },
    {
      key: "cobertura.distributors",
      value:
        "Distribuidor Zona Sur\nContamos con distribuidor en Zona Sur para mejorar la atencion y disponibilidad de productos."
    },
    { key: "cobertura.distributorZone", value: "Zona Sur" },
    { key: "cobertura.distributorContact", value: "A definir" },
    { key: "cobertura.distributorWhatsapp", value: "A definir" },
    {
      key: "cobertura.distributorProducts",
      value: "Agua desmineralizada, lavaparabrisas y productos automotores"
    },
    { key: "cobertura.distributorButtonLabel", value: "Contactar distribuidor" },
    { key: "cobertura.zonesTitle", value: "Zonas de cobertura" },
    {
      key: "cobertura.frequencyText",
      value: "Realizamos entregas programadas y distribucion mayorista segun zona y demanda."
    },
    {
      key: "cobertura.zones",
      value: "Zona Oeste\nZona Sur\nRuta 41\nRuta 29\nGeneral Belgrano y alrededores"
    },
    { key: "site.tagline", value: "Produccion, distribucion y cercania comercial." }
  ]) {
    await createSiteSettingIfMissing(setting);
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
