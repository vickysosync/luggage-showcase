import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, TableWrap, StatsCard } from "@/components/admin/AdminShell";
import { Modal } from "@/components/site/Modal";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";
import type { AdminCustomer } from "@/data/admin";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customer Management — Chandok Bag House Admin" },
      { name: "description", content: "Browse retail and institutional customers, their orders and lifetime spend." },
      { property: "og:title", content: "Customer Management — Chandok Bag House Admin" },
      { property: "og:description", content: "Retail and institutional customer records for the demo storefront." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { customers, adminOrders } = useStore();
  const [q, setQ] = useState("");
  const [view, setView] = useState<AdminCustomer | null>(null);

  const rows = customers.filter(
    (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q),
  );
  const totalSpend = customers.reduce((s, c) => s + c.spend, 0);

  return (
    <AdminShell title="Customers">
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatsCard label="Total Customers" value={String(customers.length)} />
        <StatsCard label="Active" value={String(customers.filter((c) => c.status === "Active").length)} />
        <StatsCard label="Lifetime Spend" value={inr(totalSpend)} />
      </div>

      <input className="field mb-4 max-w-xs" placeholder="Search name, email or phone…" value={q} onChange={(e) => setQ(e.target.value)} />

      <TableWrap>
        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Orders</th>
            <th className="px-4 py-3">Total Spend</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-t border-border">
              <td className="px-4 py-3 font-medium text-primary">{c.name}</td>
              <td className="px-4 py-3 text-muted-foreground">
                <p>{c.phone}</p>
                <p className="text-xs">{c.email}</p>
              </td>
              <td className="px-4 py-3">{c.city}</td>
              <td className="px-4 py-3">{c.orders}</td>
              <td className="px-4 py-3">{inr(c.spend)}</td>
              <td className="px-4 py-3">
                <span className={c.status === "Active" ? "chip text-success" : "chip text-destructive"}>{c.status}</span>
              </td>
              <td className="px-4 py-3">
                <button className="text-sm font-medium text-secondary hover:underline" onClick={() => setView(c)}>
                  View profile
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No customers found.</td></tr>
          )}
        </tbody>
      </TableWrap>

      <Modal open={!!view} onClose={() => setView(null)} title={view?.name ?? "Customer"}>
        {view && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><p className="label-x">Phone</p><p>{view.phone}</p></div>
              <div><p className="label-x">Email</p><p>{view.email}</p></div>
              <div><p className="label-x">City</p><p>{view.city}</p></div>
              <div><p className="label-x">Status</p><p>{view.status}</p></div>
              <div><p className="label-x">Total Orders</p><p>{view.orders}</p></div>
              <div><p className="label-x">Total Spend</p><p>{inr(view.spend)}</p></div>
            </div>
            <div>
              <p className="label-x">Recent orders</p>
              <ul className="mt-2 space-y-2">
                {adminOrders.filter((o) => o.customer === view.name).map((o) => (
                  <li key={o.id} className="flex justify-between rounded-md bg-muted px-3 py-2">
                    <span>{o.id} · {o.date}</span>
                    <span className="font-medium">{inr(o.amount)} · {o.status}</span>
                  </li>
                ))}
                {adminOrders.filter((o) => o.customer === view.name).length === 0 && (
                  <li className="text-muted-foreground">No orders in the current demo session.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}
