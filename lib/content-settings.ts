export type EditableSetting = {
  key: string;
  label: string;
  hint?: string;
};

export type EditableSettingGroup = {
  title: string;
  settings: EditableSetting[];
};

export const contentSettingGroups: EditableSettingGroup[] = [
  {
    title: "Home",
    settings: [
      { key: "home.heroEyebrow", label: "Home - etiqueta superior" },
      { key: "home.heroTitle", label: "Home - titulo principal" },
      { key: "home.heroText", label: "Home - texto principal" },
      { key: "home.primaryCtaLabel", label: "Home - boton principal" },
      { key: "home.secondaryCtaLabel", label: "Home - boton secundario" },
      { key: "home.highlight1", label: "Home - destacado 1" },
      { key: "home.highlight2", label: "Home - destacado 2" },
      { key: "home.highlight3", label: "Home - destacado 3" },
      { key: "home.aboutEyebrow", label: "Home - etiqueta institucional" },
      { key: "home.aboutTitle", label: "Home - titulo institucional" },
      { key: "home.aboutText", label: "Home - texto institucional" },
      { key: "home.productsStatLabel", label: "Home - etiqueta productos activos" },
      { key: "home.zonesStatLabel", label: "Home - etiqueta zonas" },
      { key: "home.feature1Title", label: "Home - card 1 titulo" },
      { key: "home.feature1Text", label: "Home - card 1 texto" },
      { key: "home.feature2Title", label: "Home - card 2 titulo" },
      { key: "home.feature2Text", label: "Home - card 2 texto" },
      { key: "home.feature3Title", label: "Home - card 3 titulo" },
      { key: "home.feature3Text", label: "Home - card 3 texto" }
    ]
  },
  {
    title: "Contacto",
    settings: [
      { key: "contact.badge", label: "Contacto - etiqueta superior" },
      { key: "contact.title", label: "Contacto - titulo principal" },
      { key: "contact.subtitle", label: "Contacto - texto principal" },
      { key: "contact.companyTitle", label: "Contacto - titulo empresa" },
      { key: "contact.companyDescription", label: "Contacto - descripcion empresa" },
      { key: "contact.phoneLabel", label: "Contacto - etiqueta telefono" },
      { key: "contact.emailLabel", label: "Contacto - etiqueta email" },
      { key: "contact.addressLabel", label: "Contacto - etiqueta direccion" },
      { key: "contact.instagramLabel", label: "Contacto - etiqueta Instagram" },
      { key: "contact.instagramText", label: "Contacto - texto Instagram" },
      { key: "contact.generalFormTitle", label: "Contacto - consulta general titulo" },
      { key: "contact.generalFormDescription", label: "Contacto - consulta general texto" },
      { key: "contact.generalFormSubmit", label: "Contacto - consulta general boton" },
      { key: "contact.resellerFormTitle", label: "Contacto - cliente/distribuidor titulo" },
      { key: "contact.resellerFormDescription", label: "Contacto - cliente/distribuidor texto" },
      { key: "contact.resellerFormSubmit", label: "Contacto - cliente/distribuidor boton" }
    ]
  },
  {
    title: "Productos",
    settings: [
      { key: "products.eyebrow", label: "Productos - etiqueta superior" },
      { key: "products.title", label: "Productos - titulo principal" },
      { key: "products.description", label: "Productos - descripcion" }
    ]
  },
  {
    title: "Calidad",
    settings: [
      { key: "quality.badge", label: "Calidad - etiqueta superior" },
      { key: "quality.title", label: "Calidad - titulo" },
      { key: "quality.subtitle", label: "Calidad - subtitulo" },
      { key: "quality.pdfLabel", label: "Calidad - texto boton PDF" },
      { key: "quality.pdfUrl", label: "Calidad - link del PDF" },
      { key: "quality.phLabel", label: "Calidad - pH etiqueta" },
      { key: "quality.ph", label: "Calidad - pH texto" },
      { key: "quality.tdsLabel", label: "Calidad - TDS etiqueta" },
      { key: "quality.tds", label: "Calidad - TDS texto" },
      { key: "quality.conductivityLabel", label: "Calidad - conductividad etiqueta" },
      { key: "quality.conductivity", label: "Calidad - conductividad texto" },
      { key: "quality.processLabel", label: "Calidad - proceso etiqueta" },
      { key: "quality.process", label: "Calidad - proceso texto" },
      { key: "quality.usageLabel", label: "Calidad - uso etiqueta" },
      { key: "quality.usage", label: "Calidad - uso texto" }
    ]
  },
  {
    title: "Cobertura",
    settings: [
      { key: "cobertura.badge", label: "Cobertura - etiqueta superior" },
      { key: "cobertura.title", label: "Cobertura - titulo principal" },
      { key: "cobertura.subtitle", label: "Cobertura - subtitulo" },
      { key: "cobertura.mapTitle", label: "Cobertura - titulo del mapa" },
      { key: "cobertura.mapText", label: "Cobertura - texto del mapa" },
      { key: "cobertura.distributorsTitle", label: "Cobertura - titulo distribuidores" },
      { key: "cobertura.distributorsIntro", label: "Cobertura - texto distribuidores" },
      {
        key: "cobertura.distributors",
        label: "Cobertura - distribuidor",
        hint: "Primera linea: nombre. Lineas siguientes: texto descriptivo."
      },
      { key: "cobertura.distributorZone", label: "Cobertura - zona del distribuidor" },
      { key: "cobertura.distributorContact", label: "Cobertura - contacto del distribuidor" },
      { key: "cobertura.distributorWhatsapp", label: "Cobertura - WhatsApp distribuidor" },
      { key: "cobertura.distributorProducts", label: "Cobertura - productos del distribuidor" },
      { key: "cobertura.distributorButtonLabel", label: "Cobertura - boton distribuidor" },
      { key: "cobertura.zonesTitle", label: "Cobertura - titulo zonas" },
      { key: "cobertura.frequencyText", label: "Cobertura - frecuencia de entregas" },
      { key: "cobertura.zones", label: "Cobertura - zonas principales", hint: "Una zona por linea." }
    ]
  }
];

export const contentSettingKeys = contentSettingGroups.flatMap((group) =>
  group.settings.map((setting) => setting.key)
);

export function settingValue(settings: Record<string, string>, key: string, fallback = "") {
  const value = settings[key]?.trim();
  return value || fallback;
}

export function settingLines(settings: Record<string, string>, key: string, fallback: string[] = []) {
  const value = settings[key]?.trim();
  if (!value) return fallback;

  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length ? lines : fallback;
}

export function safeContentUrl(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("/") || trimmed.startsWith("https://") || trimmed.startsWith("http://")) return trimmed;
  return fallback;
}
