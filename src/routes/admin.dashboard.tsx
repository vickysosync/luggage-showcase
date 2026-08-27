import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, StatsCard, TableWrap } from "@/components/admin/AdminShell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Chandok Bag House" },
      { name: "description", content: "Store performance overview: orders, revenue, enquiries and stock alerts." },
      { property: "og:title", content: "Admin Dashboard — Chandok Bag House" },
      { property: "og:description", content: "Store performance overview for the Chandok Bag House demo storefront." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { adminOrders, adminProducts, customers, adminEnquiries, adminBulk } = useStore();

  const revenue = adminOrders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.amount, 0);
  const pendingEnq = adminEnquiries.filter((e) => e.status === "New" || e.status === "Contacted").length;
  const lowStock = adminProducts.filter((p) => p.stock > 0 && p.stock <= 12);

  const statusOrder = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"] as const;
  const statusCounts = statusOrder.map((s) => ({ s, n: adminOrders.filter((o) => o.status === s).length }));
  const maxStatus = Math.max(1, ...statusCounts.map((x) => x.n));

  const byCategory = adminProducts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  const catRows = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(1, ...catRows.map((r) => r[1]));

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Orders" value={String(adminOrders.length)} hint="Across all statuses" />
        <StatsCard label="Total Revenue" value={inr(revenue)} hint="Excludes cancelled orders" />
        <StatsCard label="Total Products" value={String(adminProducts.length)} hint={`${adminProducts.filter((p) => p.active).length} active`} />
        <StatsCard label="Total Customers" value={String(customers.length)} hint="Retail & institutional" />
        <StatsCard label="Pending Enquiries" value={String(pendingEnq)} hint="Awaiting follow-up" />
        <StatsCard label="Bulk Enquiries" value={String(adminBulk.length)} hint="B2B pipeline" />
        <StatsCard label="Low Stock Products" value={String(lowStock.length)} hint="12 units or fewer" />
        <StatsCard label="Avg. Order Value" value={inr(adminOrders.length ? revenue / adminOrders.length : 0)} hint="All-time" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface p-5">
          <h2 className="font-display text-lg text-primary">Orders by status</h2>
          <div className="mt-4 space-y-3">
            {statusCounts.map(({ s, n }) => (
              <div key={s}>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{s}</span>
                  <span>{n}</span>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-muted">
                  <div className="h-2.5 rounded-full bg-secondary" style={{ width: `${(n / maxStatus) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="font-display text-lg text-primary">Catalogue by category</h2>
          <div className="mt-4 flex h-48 items-end gap-2">
            {catRows.map(([slug, n]) => (
              <div key={slug} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-md bg-primary/85" style={{ height: `${(n / maxCat) * 100}%` }} />
                <span className="text-[0.55rem] uppercase tracking-wide text-muted-foreground">{slug.replace(/-/g, " ")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-lg text-primary">Recent orders</h2>
        <TableWrap>
          <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {adminOrders.slice(0, 6).map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold text-primary">{o.id}</td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3">{inr(o.amount)}</td>
                <td className="px-4 py-3"><span className="chip">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      {lowStock.length > 0 && (
        <div className="mt-6 surface p-5">
          <h2 className="font-display text-lg text-primary">Low stock alerts</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {lowStock.map((p) => (
              <li key={p.id} className="flex justify-between rounded-md bg-muted px-3 py-2 text-sm">
                <span>{p.name}</span>
                <span className="font-semibold text-destructive">{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminShell>
  );
}
