import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getAllProductCategories } from "@/lib/queries";
import { deleteProductCategoryAction, upsertProductCategoryAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminProductCategoriesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const [categories, params] = await Promise.all([getAllProductCategories(), searchParams]);

  return (
    <AdminShell title="Categorías" description="Organizá los filtros públicos del catálogo y la asignación de productos.">
      <div className="grid gap-6">
        {params.error === "in-use" ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-900">No se puede eliminar una categoría que todavía tiene productos asignados.</div>
        ) : null}
        <CategoryForm title="Nueva categoría" />
        {categories.map((category) => (
          <section key={category.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <CategoryForm title={category.name} category={{ id: category.id, name: category.name, slug: category.slug, isActive: category.isActive, sortOrder: category.sortOrder }} />
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">{category._count.products} producto(s)</p>
              <form action={deleteProductCategoryAction}>
                <input type="hidden" name="id" value={category.id} />
                <button className="text-sm font-semibold text-rose-600 disabled:cursor-not-allowed disabled:text-slate-400" disabled={category._count.products > 0}>Eliminar</button>
              </form>
            </div>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}

type CategoryFormData = { id: string; name: string; slug: string; isActive: boolean; sortOrder: number };

function CategoryForm({ title, category }: { title: string; category?: CategoryFormData }) {
  const isEditing = Boolean(category?.id);
  return (
    <form action={upsertProductCategoryAction} className={isEditing ? "grid gap-4" : "grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6"}>
      {category?.id ? <input type="hidden" name="id" value={category.id} /> : null}
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_140px]">
        <label className="grid gap-2"><span className="text-sm font-semibold text-slate-700">Nombre</span><input name="name" required defaultValue={category?.name || ""} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" /></label>
        <label className="grid gap-2"><span className="text-sm font-semibold text-slate-700">Slug</span><input name="slug" required placeholder="agua-desmineralizada" defaultValue={category?.slug || ""} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" /></label>
        <label className="grid gap-2"><span className="text-sm font-semibold text-slate-700">Orden</span><input name="sortOrder" type="number" min="0" defaultValue={category?.sortOrder ?? 0} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" /></label>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="isActive" defaultChecked={category?.isActive ?? true} className="h-4 w-4" />Visible en el catálogo</label>
      <button className="w-fit rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">{isEditing ? "Actualizar categoría" : "Guardar categoría"}</button>
    </form>
  );
}
