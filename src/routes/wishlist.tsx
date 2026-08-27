import { createFileRoute, Link } from "@tanstack/react-router";
import { useActiveProducts, useStore } from "@/lib/store";
import { inr, discountPct } from "@/lib/format";
import { Stars } from "@/components/site/Stars";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — Chandok Bag House" },
      { name: "description", content: "Bags and luggage you have saved for later at Chandok Bag House." },
      { property: "og:title", content: "My Wishlist — Chandok Bag House" },
      { property: "og:description", content: "Your saved premium bags, backpacks and suitcases." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const products = useActiveProducts();
  const { wishlist, toggleWishlist, addToCart, ready } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <main className="container-page py-12">
      <p className="eyebrow text-secondary">Saved for later</p>
      <h1 className="mt-2 font-display text-3xl text-primary md:text-4xl">My Wishlist</h1>
      <p className="mt-2 text-sm text-muted-foreground">{items.length} item{items.length === 1 ? "" : "s"} saved</p>

      {!ready ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-72 rounded-xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="surface mt-8 p-12 text-center">
          <p className="font-display text-2xl text-primary">Your wishlist is empty</p>
          <p className="mt-2 text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
          <Link to="/shop" className="btn-base btn-gold mt-6">Browse the collection</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <article key={p.id} className="surface card-hover overflow-hidden">
              <Link to="/product/$id" params={{ id: p.id }}>
                <img src={p.image} alt={p.name} className="h-52 w-full object-cover" />
              </Link>
              <div className="p-5">
                <Link to="/product/$id" params={{ id: p.id }} className="font-semibold text-foreground hover:text-secondary">
                  {p.name}
                </Link>
                <div className="mt-2"><Stars rating={p.rating} /></div>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-xl text-primary">{inr(p.price)}</span>
                  <span className="text-sm text-muted-foreground line-through">{inr(p.mrp)}</span>
                  <span className="text-xs font-bold text-destructive">{discountPct(p.price, p.mrp)}% off</span>
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="btn-base btn-primary flex-1" onClick={() => addToCart(p)}>Move to Cart</button>
                  <button className="btn-base btn-outline" onClick={() => toggleWishlist(p.id)} aria-label="Remove from wishlist">✕</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
