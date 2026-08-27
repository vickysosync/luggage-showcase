import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { demoAccount, demoAccountOrders } from "@/data/admin";
import { useActiveProducts, useStore } from "@/lib/store";
import { inr } from "@/lib/format";
import { ConfirmDialog } from "@/components/site/Modal";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Chandok Bag House" },
      { name: "description", content: "View your Chandok Bag House demo profile, orders, wishlist and saved address." },
      { property: "og:title", content: "My Account — Chandok Bag House" },
      { property: "og:description", content: "Demo customer account with order history and saved address." },
    ],
  }),
  component: AccountPage,
});

const tabs = ["Profile", "My Orders", "Wishlist", "Saved Address"] as const;

function AccountPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Profile");
  const [confirm, setConfirm] = useState(false);
  const { wishlist, toggleWishlist, addToCart, toast } = useStore();
  const products = useActiveProducts();
  const navigate = useNavigate();
  const saved = products.filter((p) => wishlist.includes(p.id));

  return (
    <main className="container-page py-12">
      <p className="eyebrow text-secondary">Customer account</p>
      <h1 className="mt-2 font-display text-3xl text-primary md:text-4xl">Hello, {demoAccount.name.split(" ")[0]}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Customer since {demoAccount.since} · Demo account</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[14rem_1fr]">
        <nav className="surface h-fit p-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setConfirm(true)}
            className="mt-1 block w-full rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
          >
            Logout
          </button>
        </nav>

        <section>
          {tab === "Profile" && (
            <div className="surface p-6">
              <h2 className="font-display text-xl text-primary">Profile</h2>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ["Full name", demoAccount.name],
                  ["Email", demoAccount.email],
                  ["Phone", demoAccount.phone],
                  ["Customer since", demoAccount.since],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-sm text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {tab === "My Orders" && (
            <div className="surface overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-muted text-[0.68rem] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="p-4">Order</th><th className="p-4">Date</th><th className="p-4">Items</th><th className="p-4">Amount</th><th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {demoAccountOrders.map((o) => (
                    <tr key={o.id} className="border-t border-border">
                      <td className="p-4 font-medium text-primary">{o.id}</td>
                      <td className="p-4 text-muted-foreground">{o.date}</td>
                      <td className="p-4">{o.items}</td>
                      <td className="p-4 font-semibold">{inr(o.amount)}</td>
                      <td className="p-4"><span className="chip bg-success/12 text-success">{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "Wishlist" && (
            saved.length === 0 ? (
              <div className="surface p-10 text-center">
                <p className="font-display text-xl text-primary">Nothing saved yet</p>
                <Link to="/shop" className="btn-base btn-gold mt-5">Browse products</Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {saved.map((p) => (
                  <div key={p.id} className="surface flex gap-4 p-4">
                    <img src={p.image} alt={p.name} className="h-20 w-20 rounded-md object-cover" />
                    <div className="flex-1">
                      <Link to="/product/$id" params={{ id: p.id }} className="font-medium text-foreground hover:text-secondary">{p.name}</Link>
                      <p className="mt-1 font-semibold text-primary">{inr(p.price)}</p>
                      <div className="mt-2 flex gap-2">
                        <button className="btn-base btn-primary px-3 py-1 text-xs" onClick={() => addToCart(p)}>Move to cart</button>
                        <button className="btn-base btn-outline px-3 py-1 text-xs" onClick={() => toggleWishlist(p.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === "Saved Address" && (
            <div className="surface p-6">
              <h2 className="font-display text-xl text-primary">Saved address</h2>
              <div className="mt-4 rounded-lg border border-border bg-muted/40 p-5">
                <p className="font-semibold text-foreground">{demoAccount.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{demoAccount.address}</p>
                <p className="mt-1 text-sm text-muted-foreground">{demoAccount.phone}</p>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Demo data — address editing is not enabled in this preview.</p>
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={confirm}
        title="Log out of your account?"
        message="This is a demo account, you can sign back in at any time."
        confirmLabel="Logout"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          toast("Signed out of demo account", "info");
          navigate({ to: "/" });
        }}
      />
    </main>
  );
}
