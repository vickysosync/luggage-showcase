import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, TableWrap } from "@/components/admin/AdminShell";
import { Modal, ConfirmDialog } from "@/components/site/Modal";
import { useStore } from "@/lib/store";
import type { Category } from "@/data/site";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [
      { title: "Category Management — Chandok Bag House Admin" },
      { name: "description", content: "Create, rename and toggle the bag categories shown across the storefront." },
      { property: "og:title", content: "Category Management — Chandok Bag House Admin" },
      { property: "og:description", content: "Manage storefront bag categories and their visibility." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CategoriesPage,
});

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function CategoriesPage() {
  const { adminCategories, setAdminCategories, adminProducts, toast } = useStore();
  const [editing, setEditing] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim()) return toast("Category name is required", "error");
    const next = { ...editing, slug: editing.slug || slugify(editing.name) };
    setAdminCategories(isNew ? [...adminCategories, next] : adminCategories.map((c) => (c.id === next.id ? next : c)));
    toast(isNew ? "Category added" : "Category updated");
    setEditing(null);
  };

  return (
    <AdminShell title="Categories">
      <div className="mb-4 flex justify-end">
        <button
          className="btn-base btn-primary"
          onClick={() => {
            setIsNew(true);
            setEditing({ id: "c" + (Date.now() % 100000), slug: "", name: "", image: adminCategories[0]?.image ?? "", blurb: "", active: true });
          }}
        >
          + Add Category
        </button>
      </div>

      <TableWrap>
        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Slug</th>
            <th className="px-4 py-3">Products</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminCategories.map((c) => (
            <tr key={c.id} className="border-t border-border">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={c.image} alt={c.name} className="h-10 w-10 rounded-md object-cover" />
                  <div>
                    <p className="font-medium text-primary">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.blurb}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
              <td className="px-4 py-3">{adminProducts.filter((p) => p.category === c.slug).length}</td>
              <td className="px-4 py-3">
                <button
                  className={c.active ? "chip text-success" : "chip text-destructive"}
                  onClick={() => setAdminCategories(adminCategories.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)))}
                >
                  {c.active ? "Enabled" : "Disabled"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    className="text-sm font-medium text-secondary hover:underline"
                    onClick={() => {
                      setIsNew(false);
                      setEditing(c);
                    }}
                  >
                    Edit
                  </button>
                  <button className="text-sm font-medium text-destructive hover:underline" onClick={() => setDeleteId(c.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add category" : "Edit category"}>
        {editing && (
          <div className="grid gap-3">
            <div>
              <label className="label-x">Name</label>
              <input className="field" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <label className="label-x">Slug</label>
              <input className="field" value={editing.slug} placeholder={slugify(editing.name)} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </div>
            <div>
              <label className="label-x">Blurb</label>
              <input className="field" value={editing.blurb} onChange={(e) => setEditing({ ...editing, blurb: e.target.value })} />
            </div>
            <div>
              <label className="label-x">Image URL</label>
              <input className="field" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button className="btn-base btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-base btn-primary" onClick={save}>Save category</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete category"
        confirmLabel="Delete"
        message="Products in this category will remain but the category will no longer be listed."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          setAdminCategories(adminCategories.filter((c) => c.id !== deleteId));
          setDeleteId(null);
          toast("Category deleted", "info");
        }}
      />
    </AdminShell>
  );
}
