import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, TableWrap } from "@/components/admin/AdminShell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";
import type { OrderStatus } from "@/data/admin";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Order Management — Chandok Bag House Admin" },
      { name: "description", content: "Track and update the status of retail and bulk bag orders." },
      { property: "og:title", content: "Order Management — Chandok Bag House Admin" },
      { property: "og:description", content: "Track and update retail and bulk bag order statuses." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

const statuses: OrderStatus[] = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

function OrdersPage() {
  const { adminOrders, setAdminOrders, toast } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const rows = adminOrders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (o.id.toLowerCase().includes(q.toLowerCase()) || o.customer.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <AdminShell title="Orders">
      <div className="mb-4 flex flex-wrap gap-3">
        <input className="field max-w-xs" placeholder="Search order ID or customer…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="field max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value as "all" | OrderStatus)}>
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <TableWrap>
        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Products</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-t border-border">
              <td className="px-4 py-3 font-semibold text-primary">{o.id}</td>
              <td className="px-4 py-3">{o.customer}</td>
              <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
              <td className="px-4 py-3 max-w-[16rem] text-muted-foreground">{o.items}</td>
              <td className="px-4 py-3">{inr(o.amount)}</td>
              <td className="px-4 py-3">{o.payment}</td>
              <td className="px-4 py-3"><span className="chip">{o.status}</span></td>
              <td className="px-4 py-3">
                <select
                  className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                  value={o.status}
                  onChange={(e) => {
                    const status = e.target.value as OrderStatus;
                    setAdminOrders(adminOrders.map((x) => (x.id === o.id ? { ...x, status } : x)));
                    toast(`${o.id} marked ${status}`);
                  }}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No orders match your filters.</td></tr>
          )}
        </tbody>
      </TableWrap>
    </AdminShell>
  );
}
