import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/order-success")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Chandok Bag House" },
      { name: "description", content: "Your Chandok Bag House demo order has been placed successfully." },
      { property: "og:title", content: "Order Confirmed — Chandok Bag House" },
      { property: "og:description", content: "Thank you for shopping with Chandok Bag House, Pimpri-Chinchwad." },
    ],
  }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const { lastOrder, ready } = useStore();

  if (!ready) return <main className="container-page py-20"><div className="skeleton h-64 rounded-xl" /></main>;

  if (!lastOrder)
    return (
      <main className="container-page py-24 text-center">
        <h1 className="font-display text-3xl text-primary">No recent order</h1>
        <p className="mt-3 text-muted-foreground">Place an order to see your confirmation here.</p>
        <Link to="/shop" className="btn-base btn-gold mt-6">Continue Shopping</Link>
      </main>
    );

  return (
    <main className="container-page py-14">
      <div className="fade-up mx-auto max-w-3xl">
        <div className="surface p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 text-2xl text-success">✓</div>
          <h1 className="mt-4 font-display text-3xl text-primary">Order Confirmed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you, {lastOrder.name}. Your order has been received and is being processed.
          </p>
          <p className="mt-4 inline-block rounded-md bg-muted px-4 py-2 font-mono text-sm font-semibold text-primary">
            Order No. {lastOrder.id}
          </p>
        </div>

        <div className="surface mt-6 p-6">
          <h2 className="font-display text-xl text-primary">Items</h2>
          <ul className="mt-4 space-y-4">
            {lastOrder.items.map((i) => (
              <li key={i.key} className="flex items-center gap-4">
                <img src={i.image} alt={i.name} className="h-16 w-16 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.color} · {i.size} · Qty {i.qty}</p>
                </div>
                <p className="font-semibold">{inr(i.price * i.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-border pt-4 font-display text-lg text-primary">
            <span>Total Paid</span>
            <span>{inr(lastOrder.total)}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="surface p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Delivery Address</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{lastOrder.address}</p>
          </div>
          <div className="surface p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Delivery Details</h3>
            <p className="mt-3 text-sm text-foreground">{lastOrder.delivery}</p>
            <p className="mt-1 text-sm text-muted-foreground">Payment: {lastOrder.payment}</p>
            <p className="mt-1 text-sm text-muted-foreground">Estimated delivery: {lastOrder.eta}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-base btn-gold">Continue Shopping</Link>
          <Link to="/account" className="btn-base btn-outline">View Account</Link>
        </div>
      </div>
    </main>
  );
}
