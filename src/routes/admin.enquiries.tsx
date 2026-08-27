import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, TableWrap } from "@/components/admin/AdminShell";
import { Modal } from "@/components/site/Modal";
import { useStore } from "@/lib/store";
import type { Enquiry, EnquiryStatus } from "@/data/admin";

export const Route = createFileRoute("/admin/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiry Management — Chandok Bag House Admin" },
      { name: "description", content: "Review and progress customer product, branding and after-sales enquiries." },
      { property: "og:title", content: "Enquiry Management — Chandok Bag House Admin" },
      { property: "og:description", content: "Review and progress incoming customer enquiries." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EnquiriesPage,
});

const statuses: EnquiryStatus[] = ["New", "Contacted", "In Progress", "Converted", "Closed"];

function EnquiriesPage() {
  const { adminEnquiries, setAdminEnquiries, toast } = useStore();
  const [filter, setFilter] = useState<"all" | EnquiryStatus>("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState<Enquiry | null>(null);

  const rows = adminEnquiries.filter(
    (e) => (filter === "all" || e.status === filter) && (e.name.toLowerCase().includes(q.toLowerCase()) || e.product.toLowerCase().includes(q.toLowerCase())),
  );

  const setStatus = (id: string, status: EnquiryStatus) => {
    setAdminEnquiries(adminEnquiries.map((e) => (e.id === id ? { ...e, status } : e)));
    toast(`Enquiry ${id} marked ${status}`);
  };

  return (
    <AdminShell title="Enquiries">
      <div className="mb-4 flex flex-wrap gap-3">
        <input className="field max-w-xs" placeholder="Search name or product…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="field max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value as "all" | EnquiryStatus)}>
          <option value="all">All statuses</option>
          {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      <TableWrap>
        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Qty</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id} className="border-t border-border">
              <td className="px-4 py-3 font-semibold text-primary">{e.id}</td>
              <td className="px-4 py-3">
                <p className="font-medium">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.phone}</p>
              </td>
              <td className="px-4 py-3">{e.type}</td>
              <td className="px-4 py-3 text-muted-foreground">{e.product || "—"}</td>
              <td className="px-4 py-3">{e.quantity || "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
              <td className="px-4 py-3">
                <select
                  className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                  value={e.status}
                  onChange={(ev) => setStatus(e.id, ev.target.value as EnquiryStatus)}
                >
                  {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </td>
              <td className="px-4 py-3">
                <button className="text-sm font-medium text-secondary hover:underline" onClick={() => setView(e)}>View</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No enquiries match your filters.</td></tr>
          )}
        </tbody>
      </TableWrap>

      <Modal open={!!view} onClose={() => setView(null)} title={`Enquiry ${view?.id ?? ""}`}>
        {view && (
          <div className="space-y-3 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><p className="label-x">Name</p><p>{view.name}</p></div>
              <div><p className="label-x">Phone</p><p>{view.phone}</p></div>
              <div><p className="label-x">Email</p><p>{view.email}</p></div>
              <div><p className="label-x">Type</p><p>{view.type}</p></div>
              <div><p className="label-x">Product</p><p>{view.product || "—"}</p></div>
              <div><p className="label-x">Quantity</p><p>{view.quantity || "—"}</p></div>
            </div>
            <div>
              <p className="label-x">Message</p>
              <p className="mt-1 rounded-md bg-muted p-3 text-muted-foreground">{view.message}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <a className="btn-base btn-outline" href={`tel:${view.phone.replace(/\s/g, "")}`}>Call</a>
              <a className="btn-base btn-outline" href={`mailto:${view.email}`}>Email</a>
              <button className="btn-base btn-primary" onClick={() => { setStatus(view.id, "Contacted"); setView(null); }}>
                Mark contacted
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}
