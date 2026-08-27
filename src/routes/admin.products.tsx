import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, TableWrap } from "@/components/admin/AdminShell";
import { Modal, ConfirmDialog } from "@/components/site/Modal";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";
import type { Product } from "@/data/products";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Product Management — Chandok Bag House Admin" },
      { name: "description", content: "Add, edit, price and stock-manage the Chandok Bag House bag catalogue." },
      { property: "og:title", content: "Product Management — Chandok Bag House Admin" },
      { property: "og:description", content: "Manage the bag catalogue, pricing, stock and featured products." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProductsPage,
});

type Draft = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  mrp: string;
  stock: string;
  badge: Product["badge"];
  short: string;
};

const emptyDraft: Draft = { id: "", name: "", category: "school-bags", image: "", price: "", mrp: "", stock: "0", badge: "New", short: "" };

function ProductsPage() {
  const { adminProducts, setAdminProducts, adminCategories, toast } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      adminProducts.filter(
        (p) =>
          (cat === "all" || p.category === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [adminProducts, q, cat],
  );

  const patch = (id: string, next: Partial<Product>) =>
    setAdminProducts(adminProducts.map((p) => (p.id === id ? { ...p, ...next } : p)));

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim()) return toast("Product name is required", "error");
    const price = Number(editing.price) || 0;
    const mrp = Number(editing.mrp) || price;
    const stock = Number(editing.stock) || 0;
    if (editing.id) {
      patch(editing.id, {
        name: editing.name,
        category: editing.category,
        price,
        mrp,
        stock,
        badge: editing.badge,
        short: editing.short,
        ...(editing.image ? { image: editing.image } : {}),
      });
      toast("Product updated");
    } else {
      const base = adminProducts[0];
      const created: Product = {
        id: "p" + (Date.now() % 100000),
        name: editing.name,
        category: editing.category,
        image: editing.image || base?.image || "",
        price,
        mrp,
        rating: 4.5,
        reviews: 0,
        short: editing.short || "Newly added product.",
        description: editing.short || "Newly added product.",
        features: ["Added from the admin panel"],
        specs: [{ label: "Category", value: editing.category }],
        colors: ["Black"],
        stock,
        badge: editing.badge,
        featured: false,
        active: true,
      };
      setAdminProducts([created, ...adminProducts]);
      toast("Product added");
    }
    setEditing(null);
  };

  return (
    <AdminShell title="Products">
      <div className="mb-4 flex flex-wrap gap-3">
        <input className="field max-w-xs" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="field max-w-xs" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">All categories</option>
          {adminCategories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button className="btn-base btn-primary ml-auto" onClick={() => setEditing({ ...emptyDraft })}>
          + Add Product
        </button>
      </div>

      <TableWrap>
        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">MRP</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Featured</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-t border-border align-middle">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover" />
                  <span className="font-medium text-primary">{p.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{p.category.replace(/-/g, " ")}</td>
              <td className="px-4 py-3">
                <input
                  className="w-24 rounded-md border border-border bg-background px-2 py-1 text-sm"
                  type="number"
                  value={p.price}
                  onChange={(e) => patch(p.id, { price: Number(e.target.value) || 0 })}
                />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{inr(p.mrp)}</td>
              <td className="px-4 py-3">
                <input
                  className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm"
                  type="number"
                  value={p.stock}
                  onChange={(e) => patch(p.id, { stock: Number(e.target.value) || 0 })}
                />
              </td>
              <td className="px-4 py-3">
                <button className="chip" onClick={() => patch(p.id, { featured: !p.featured })}>
                  {p.featured ? "Featured" : "Standard"}
                </button>
              </td>
              <td className="px-4 py-3">
                <button
                  className={p.active ? "chip text-success" : "chip text-destructive"}
                  onClick={() => patch(p.id, { active: !p.active })}
                >
                  {p.active ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    className="text-sm font-medium text-secondary hover:underline"
                    onClick={() =>
                      setEditing({
                        id: p.id,
                        name: p.name,
                        category: p.category,
                        image: p.image,
                        price: String(p.price),
                        mrp: String(p.mrp),
                        stock: String(p.stock),
                        badge: p.badge,
                        short: p.short,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button className="text-sm font-medium text-destructive hover:underline" onClick={() => setDeleteId(p.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No products match your filters.</td></tr>
          )}
        </tbody>
      </TableWrap>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit product" : "Add product"}>
        {editing && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label-x">Product name</label>
              <input className="field" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <label className="label-x">Category</label>
              <select className="field" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {adminCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-x">Badge</label>
              <select
                className="field"
                value={editing.badge}
                onChange={(e) => setEditing({ ...editing, badge: e.target.value as Product["badge"] })}
              >
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Premium">Premium</option>
                <option value="Sale">Sale</option>
              </select>
            </div>
            <div>
              <label className="label-x">Price (₹)</label>
              <input className="field" type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
            </div>
            <div>
              <label className="label-x">MRP (₹)</label>
              <input className="field" type="number" value={editing.mrp} onChange={(e) => setEditing({ ...editing, mrp: e.target.value })} />
            </div>
            <div>
              <label className="label-x">Stock</label>
              <input className="field" type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} />
            </div>
            <div>
              <label className="label-x">Image URL</label>
              <input className="field" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label-x">Short description</label>
              <textarea className="field" rows={3} value={editing.short} onChange={(e) => setEditing({ ...editing, short: e.target.value })} />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
              <button className="btn-base btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-base btn-primary" onClick={save}>Save product</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete product"
        confirmLabel="Delete"
        message="This will remove the product from the demo catalogue. Continue?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          setAdminProducts(adminProducts.filter((p) => p.id !== deleteId));
          setDeleteId(null);
          toast("Product deleted", "info");
        }}
      />
    </AdminShell>
  );
}
