import { createFileRoute } from "@tanstack/react-router";
import { business, faqs } from "@/data/site";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import storeImg from "@/assets/store.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Store Location — Chandok Bag House, Old Sangvi" },
      {
        name: "description",
        content:
          "Visit Chandok Bag House at Old Sangvi, Pimpri-Chinchwad, or call +91 93711 11448 for retail, custom branding and bulk bag enquiries.",
      },
      { property: "og:title", content: "Contact Chandok Bag House" },
      { property: "og:description", content: "Store address, phone, email, business hours and enquiry form." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main>
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container-page">
          <p className="eyebrow text-accent">Get in touch</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Contact Chandok Bag House</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            Walk into our Old Sangvi store, call us, or send an enquiry — we reply within one working day.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-8 py-14 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="surface p-6">
            <h2 className="font-display text-xl text-primary">{business.name}</h2>
            <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-secondary">{business.brand}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{business.address}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="btn-base btn-gold">Call Now</a>
              <a href={`mailto:${business.email}`} className="btn-base btn-outline">Email Us</a>
            </div>
          </div>

          <div className="surface p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Reach us</h3>
            <p className="mt-3 text-sm text-foreground">{business.phone}</p>
            <p className="text-sm text-foreground">{business.email}</p>
            <p className="mt-3 text-sm text-muted-foreground">Owner: {business.owner}</p>
          </div>

          <div className="surface p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Business hours</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {business.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{h.day}</span>
                  <span className="font-medium text-foreground">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface overflow-hidden">
            <img src={storeImg} alt="Chandok Bag House storefront in Old Sangvi" className="h-44 w-full object-cover" />
            <div className="p-5">
              <p className="font-semibold text-foreground">Old Sangvi, Pimpri-Chinchwad</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Near Union Bank ATM, Shivaprasad Building, Sainath Colony — 411027.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="surface p-6 md:p-8">
            <h2 className="font-display text-2xl text-primary">Send us a message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Retail, custom branding, after-sales or bulk — tell us what you need.
            </p>
            <div className="mt-6">
              <EnquiryForm />
            </div>
          </div>

          <div id="shipping" className="surface mt-8 p-6 md:p-8">
            <h2 className="font-display text-2xl text-primary">Shipping, Returns & FAQ</h2>
            <div className="mt-5 space-y-4">
              {faqs.map((f) => (
                <details key={f.q} className="rounded-lg border border-border bg-muted/40 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">{f.q}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
