import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getAllProductCategories, getAllProducts } from "@/lib/queries";
import { deleteProductAction, upsertProductAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const [products, categories] = await Promise.all([getAllProducts(), getAllProductCategories()]);

  return (
    <AdminShell title="Productos" description="Administrá la información comercial, las imágenes y la visibilidad del catálogo.">
      <section className="grid gap-6">
        {categories.length ? (
          <ProductForm title="Nuevo producto" categories={categories} />
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            Primero creá al menos una categoría desde <a href="/admin/categorias" className="font-bold underline">Categorías</a>.
          </div>
        )}

        {products.map((product) => (
          <div key={product.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <ProductForm
              title={product.name}
              categories={categories}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                categoryId: product.categoryId,
                shortDescription: product.shortDescription,
                fullDescription: product.fullDescription,
                recommendedUses: product.recommendedUses,
                presentation: product.presentation,
                imageUrl: product.imageUrl,
                badgeText: product.badgeText || "",
                sortOrder: product.sortOrder,
                isActive: product.isActive
              }}
            />
            <form action={deleteProductAction} className="mt-3">
              <input type="hidden" name="id" value={product.id} />
              <button className="text-sm font-semibold text-rose-600">Eliminar</button>
            </form>
          </div>
        ))}
      </section>
    </AdminShell>
  );
}

type ProductCategoryOption = {
  id: string;
  name: string;
  isActive: boolean;
};

type ProductFormData = {
  id?: string;
  name?: string;
  slug?: string;
  categoryId?: string;
  shortDescription?: string;
  fullDescription?: string;
  recommendedUses?: string;
  presentation?: string;
  imageUrl?: string;
  badgeText?: string;
  sortOrder?: number;
  isActive?: boolean;
};

function ProductForm({
  title,
  product,
  categories
}: {
  title: string;
  product?: ProductFormData;
  categories: ProductCategoryOption[];
}) {
  const isEditing = Boolean(product?.id);

  return (
    <form action={upsertProductAction} className={isEditing ? "grid gap-4" : "grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6"}>
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}

      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">La información se utiliza en la grilla y en el detalle público del producto.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Nombre del producto</span>
          <input name="name" required defaultValue={product?.name || ""} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Slug</span>
          <input name="slug" required placeholder="agua-desmineralizada-5l" defaultValue={product?.slug || ""} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Categoría</span>
          <select name="categoryId" required defaultValue={product?.categoryId || categories[0]?.id || ""} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}{category.isActive ? "" : " (inactiva)"}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Orden</span>
          <input name="sortOrder" type="number" min="0" defaultValue={product?.sortOrder ?? 0} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Estado / Novedad</span>
          <input name="badgeText" maxLength={60} placeholder="Nuevo" defaultValue={product?.badgeText || ""} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <span className="text-xs text-slate-500">Opcional. Ej.: Nuevo, Destacado, Más vendido.</span>
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Imagen principal</span>
          <input name="imageUrl" placeholder="/productos/agua-desmineralizada-5l.jpg" defaultValue={product?.imageUrl || ""} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <span className="text-xs text-slate-500">Ruta de una imagen guardada en public/ o URL permitida por el sitio.</span>
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Descripción corta</span>
          <textarea name="shortDescription" defaultValue={product?.shortDescription || ""} className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Descripción ampliada</span>
          <textarea name="fullDescription" defaultValue={product?.fullDescription || ""} className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Usos recomendados</span>
          <textarea name="recommendedUses" defaultValue={product?.recommendedUses || ""} className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Presentación / formato</span>
          <textarea name="presentation" defaultValue={product?.presentation || ""} className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} className="h-4 w-4" />
        Activo
      </label>

      <button className={isEditing ? "w-fit rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" : "w-fit rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white"}>
        {isEditing ? "Actualizar" : "Guardar producto"}
      </button>
    </form>
  );
}
