import { AdminShell } from "@/components/admin/admin-shell";
import { deleteProductAction, upsertProductAction } from "../actions";
import { getAllProducts } from "@/lib/queries";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAllProducts();

  return (
    <AdminShell title="Productos" description="CRUD basico para el catalogo institucional.">
      <section className="grid gap-6">
        <ProductForm title="Nuevo producto" />

        {products.map((product) => (
          <div key={product.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <ProductForm
              title={product.name}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                category: product.category,
                shortDescription: product.shortDescription,
                fullDescription: product.fullDescription,
                recommendedUses: product.recommendedUses,
                presentation: product.presentation,
                imageUrl: product.imageUrl,
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

type ProductFormData = {
  id?: string;
  name?: string;
  slug?: string;
  category?: string;
  shortDescription?: string;
  fullDescription?: string;
  recommendedUses?: string;
  presentation?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
};

function ProductForm({ title, product }: { title: string; product?: ProductFormData }) {
  const isEditing = Boolean(product?.id);

  return (
    <form action={upsertProductAction} className={isEditing ? "grid gap-4" : "grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6"}>
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}

      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Carga la informacion que se muestra en el catalogo y en el detalle publico del producto.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="name"
          required
          placeholder="Nombre del producto"
          aria-label="Nombre del producto"
          defaultValue={product?.name || ""}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
        <input
          name="slug"
          required
          placeholder="Slug para URL, ej: agua-desmineralizada-5l"
          aria-label="Slug"
          defaultValue={product?.slug || ""}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
        <input
          name="category"
          placeholder="Categoria"
          aria-label="Categoria"
          defaultValue={product?.category || ""}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
        <input
          name="sortOrder"
          type="number"
          placeholder="Orden"
          aria-label="Orden"
          defaultValue={product?.sortOrder ?? 0}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
        <input
          name="imageUrl"
          placeholder="/productos/agua-desmineralizada-5l.jpg"
          aria-label="Imagen principal"
          defaultValue={product?.imageUrl || ""}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2"
        />
        <textarea
          name="shortDescription"
          placeholder="Descripcion corta"
          aria-label="Descripcion corta"
          defaultValue={product?.shortDescription || ""}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2"
        />
        <textarea
          name="fullDescription"
          placeholder="Descripcion ampliada"
          aria-label="Descripcion ampliada"
          defaultValue={product?.fullDescription || ""}
          className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2"
        />
        <textarea
          name="recommendedUses"
          placeholder="Usos recomendados"
          aria-label="Usos recomendados"
          defaultValue={product?.recommendedUses || ""}
          className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
        <textarea
          name="presentation"
          placeholder="Presentacion / formato"
          aria-label="Presentacion / formato"
          defaultValue={product?.presentation || ""}
          className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} />
        Activo
      </label>

      <button className={isEditing ? "w-fit rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" : "w-fit rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white"}>
        {isEditing ? "Actualizar" : "Guardar producto"}
      </button>
    </form>
  );
}
