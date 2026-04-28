import { AdminShell } from "@/components/admin/admin-shell";
import { deleteProductAction, upsertProductAction } from "../actions";
import { getAllProducts } from "@/lib/queries";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAllProducts();

  return (
    <AdminShell title="Productos" description="CRUD básico para el catálogo institucional.">
      <section className="grid gap-6">
        <form action={upsertProductAction} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">Nuevo producto</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input name="name" placeholder="Nombre" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input name="slug" placeholder="Slug" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input name="category" placeholder="Categoría" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input name="sortOrder" type="number" placeholder="Orden" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input name="imageUrl" placeholder="URL imagen" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
            <textarea name="shortDescription" placeholder="Descripción corta" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
            <textarea name="fullDescription" placeholder="Descripción completa" className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isActive" defaultChecked />
            Activo
          </label>
          <button className="w-fit rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">Guardar producto</button>
        </form>
        {products.map((product) => (
          <div key={product.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <form action={upsertProductAction} className="grid gap-4">
              <input type="hidden" name="id" value={product.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <input name="name" defaultValue={product.name} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                <input name="slug" defaultValue={product.slug} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                <input name="category" defaultValue={product.category} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                <input name="sortOrder" type="number" defaultValue={product.sortOrder} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                <input name="imageUrl" defaultValue={product.imageUrl} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
                <textarea name="shortDescription" defaultValue={product.shortDescription} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
                <textarea name="fullDescription" defaultValue={product.fullDescription} className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="isActive" defaultChecked={product.isActive} />
                Activo
              </label>
              <div className="flex gap-3">
                <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Actualizar</button>
              </div>
            </form>
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
