import { AdminShell } from "@/components/admin/admin-shell";
import { updatePersonalizationSettingsAction } from "../actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productBackgroundSettingKeys } from "@/lib/product-catalog-settings";

export const dynamic = "force-dynamic";

const textFields = [
  {
    title: "Marca",
    fields: [
      { key: "brand.name", label: "Nombre de empresa", fallback: "Los Hermanos", type: "text" },
      { key: "brand.slogan", label: "Slogan", fallback: "Producción y distribución", type: "text" },
      {
        key: "brand.description",
        label: "Texto corto institucional",
        fallback: "Producción y distribución de agua desmineralizada y productos automotores.",
        type: "textarea"
      }
    ]
  },
  {
    title: "Contacto",
    fields: [
      { key: "contact.whatsapp", label: "WhatsApp principal", fallback: "2241562965", type: "text" },
      { key: "contact.email", label: "Email", fallback: "", type: "text" },
      { key: "contact.instagram", label: "Instagram", fallback: "https://www.instagram.com/", type: "text" },
      { key: "contact.address", label: "Dirección / zona", fallback: "Buenos Aires", type: "text" }
    ]
  }
];

const colorFields = [
  { key: "theme.primaryColor", label: "Color principal", fallback: "#0B3C5D" },
  { key: "theme.secondaryColor", label: "Color secundario", fallback: "#38A9E0" },
  { key: "theme.buttonColor", label: "Color de botones", fallback: "#0F76A8" },
  { key: "theme.backgroundColor", label: "Color de fondo", fallback: "#F8FCFF" }
];

const allKeys = [
  ...textFields.flatMap((group) => group.fields.map((field) => field.key)),
  ...colorFields.map((field) => field.key),
  ...productBackgroundSettingKeys
];

function valueFor(settings: Record<string, string>, key: string) {
  return settings[key] || "";
}

export default async function AdminPersonalizationPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const settingsList = await prisma.siteSetting.findMany({
    where: { key: { in: allKeys } }
  });
  const settings = Object.fromEntries(settingsList.map((setting) => [setting.key, setting.value]));

  return (
    <AdminShell title="Personalización" description="Configuraciones generales de marca, contacto y colores.">
      <form action={updatePersonalizationSettingsAction} className="grid gap-6">
        {params.saved ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            Cambios guardados correctamente.
          </div>
        ) : null}

        {textFields.map((group) => (
          <section key={group.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-tight text-slate-900">{group.title}</h2>
            <div className="mt-5 grid gap-4">
              {group.fields.map((field) => (
                <label key={field.key} className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.key}
                      defaultValue={valueFor(settings, field.key)}
                      placeholder={field.fallback}
                      className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  ) : (
                    <input
                      name={field.key}
                      defaultValue={valueFor(settings, field.key)}
                      placeholder={field.fallback}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black tracking-tight text-slate-900">Colores</h2>
          <p className="mt-1 text-sm text-slate-500">Se guardan para una próxima etapa. No se aplican globalmente todavía.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {colorFields.map((field) => (
              <label key={field.key} className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                <input
                  type="color"
                  name={field.key}
                  defaultValue={valueFor(settings, field.key) || field.fallback}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-2 py-1"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black tracking-tight text-slate-900">Fondo página Productos</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Personaliza únicamente el fondo del catálogo. Predeterminado conserva el diseño actual.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Tipo de fondo</span>
              <select
                name="products.backgroundMode"
                defaultValue={valueFor(settings, "products.backgroundMode") || "default"}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <option value="default">Predeterminado</option>
                <option value="color">Color sólido</option>
                <option value="gradient">Degradado</option>
                <option value="image">Imagen de fondo</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Color sólido</span>
              <input
                type="color"
                name="products.backgroundColor"
                defaultValue={valueFor(settings, "products.backgroundColor") || "#f8fcff"}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-2 py-1"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Degradado inicio</span>
                <input
                  type="color"
                  name="products.gradientFrom"
                  defaultValue={valueFor(settings, "products.gradientFrom") || "#e7f6ff"}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-2 py-1"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Degradado final</span>
                <input
                  type="color"
                  name="products.gradientTo"
                  defaultValue={valueFor(settings, "products.gradientTo") || "#ffffff"}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-2 py-1"
                />
              </label>
            </div>
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Imagen de fondo</span>
              <input
                name="products.backgroundImage"
                defaultValue={valueFor(settings, "products.backgroundImage")}
                placeholder="/fondos/productos.jpg"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <span className="text-xs leading-5 text-slate-500">
                Usá una ruta de public/ que empiece con / o una URL web. La página aplica un overlay automático para conservar la legibilidad.
              </span>
            </label>
          </div>
        </section>

        <button className="w-fit rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-card">
          Guardar cambios
        </button>
      </form>
    </AdminShell>
  );
}
