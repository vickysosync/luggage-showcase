import { createFileRoute, Link } from "@tanstack/react-router";
import { business, storeImage, bulkImage, trustPoints } from "@/data/site";
import workshop from "@/assets/workshop.jpg";
import { TrustSection } from "@/components/site/TrustSection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — 20+ Years of Bag Craft | Chandok Bag House" },
      {
        name: "description",
        content:
          "Chandok Bag House has manufactured and retailed premium bags in Pimpri-Chinchwad for over two decades, with custom branding and B2B production under the PS Creation brand.",
      },
      { property: "og:title", content: "About Chandok Bag House — Two Decades of Bag Craft" },
      { property: "og:description", content: "Retail expertise, B2B manufacturing and custom logo branding from Old Sangvi, Pimpri-Chinchwad." },
    ],
  }),
  component: AboutPage,
});

const timeline = [
  { year: "2003", title: "The first shop", text: "Chandok Bag House opens in Old Sangvi with a small retail counter of school bags and travel luggage." },
  { year: "2009", title: "PS Creation launches", text: "Our in-house manufacturing brand begins producing school and college backpacks locally." },
  { year: "2014", title: "Corporate B2B division", text: "Bulk manufacturing starts for offices, hospitals and IT companies across Pune district." },
  { year: "2019", title: "Custom logo branding", text: "Screen printing, embroidery and woven-label branding added for institutional clients." },
  { year: "2026", title: "20+ years on", text: "Thousands of retail customers and hundreds of bulk institutional orders delivered." },
];

function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <img src={storeImage} alt="Chandok Bag House retail store interior" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="container-page relative py-20">
          <p className="eyebrow text-accent">About Us</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
            Two decades of building bags that last the journey.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/85">{business.description}</p>
        </div>
      </section>

      <section className="container-page grid items-center gap-10 py-16 lg:grid-cols-2">
        <img src={workshop} alt="Bag manufacturing workshop with stitching machines" className="h-80 w-full rounded-xl object-cover shadow-lg" />
        <div>
          <p className="eyebrow text-secondary">Our craft</p>
          <h2 className="mt-2 font-display text-3xl text-primary">Manufacturing and retail under one roof</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Run by {business.owner}, Chandok Bag House combines a busy retail counter in Old Sangvi with a working
            production line under the {business.brand} label. That means the same team that advises a parent on a
            school bag also engineers 600-piece institutional orders.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-foreground">
            {[
              "Fabric, zip and stitch quality checked at every batch",
              "Custom logo branding — screen print, embroidery and woven labels",
              "Bulk manufacturing with committed delivery timelines",
              "After-sales repairs for products bought from us",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 text-secondary">◆</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container-page">
          <p className="eyebrow text-secondary">20+ Years of Experience</p>
          <h2 className="mt-2 font-display text-3xl text-primary">Our journey</h2>
          <ol className="mt-10 space-y-6 border-l-2 border-secondary/30 pl-6">
            {timeline.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[1.9rem] top-1 grid h-4 w-4 place-items-center rounded-full bg-secondary" />
                <p className="font-display text-lg text-secondary">{t.year}</p>
                <p className="font-semibold text-foreground">{t.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <TrustSection />

      <section className="container-page grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-secondary">B2B & Institutional</p>
          <h2 className="mt-2 font-display text-3xl text-primary">Built for businesses and schools</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            From 50-piece employee kits to 1,200-piece event backpacks, we handle design, sampling, branding,
            production and delivery. {trustPoints.length} core promises guide every order we accept.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/bulk-orders" className="btn-base btn-gold">Bulk & Corporate Enquiry</Link>
            <Link to="/contact" className="btn-base btn-outline">Visit the store</Link>
          </div>
        </div>
        <img src={bulkImage} alt="Bulk corporate bag order stacked for dispatch" className="h-80 w-full rounded-xl object-cover shadow-lg" />
      </section>
    </main>
  );
}
