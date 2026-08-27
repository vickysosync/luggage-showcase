import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { bulkServices, bulkImage } from "@/data/site";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/bulk-orders")({
  head: () => ({
    meta: [
      { title: "Bulk & Corporate Bag Orders — Chandok Bag House" },
      {
        name: "description",
        content:
          "Custom bag manufacturing and logo branding for corporates, schools, events and institutions. Request a bulk quote from Chandok Bag House, Pimpri-Chinchwad.",
      },
      { property: "og:title", content: "Custom Bags for Your Business, Institution & Events" },
      { property: "og:description", content: "Bulk manufacturing, employee kits, promotional bags and custom logo branding." },
    ],
  }),
  component: BulkPage,
});

type BulkErrors = Partial<Record<"name" | "company" | "phone" | "email" | "quantity" | "message", string>>;

function BulkPage() {
  const { submitBulk, toast } = useStore();
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    bagType: bulkServices[0]!,
    quantity: "",
    deliveryDate: "",
    branding: "",
    budget: "₹1,00,000 – ₹2,00,000",
    message: "",
  });
  const [errors, setErrors] = useState<BulkErrors>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: BulkErrors = {};
    if (form.name.trim().length < 2) err["name"] = "Enter the contact person's name";
    if (form.company.trim().length < 2) err["company"] = "Enter your company or institution";
    if (!/^[0-9+\s-]{10,15}$/.test(form.phone.trim())) err["phone"] = "Enter a valid mobile number";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) err["email"] = "Enter a valid email";
    if (!/^[0-9]{2,6}$/.test(form.quantity.trim())) err["quantity"] = "Enter the quantity required";
    if (form.message.trim().length < 5) err["message"] = "Tell us a little more";
    setErrors(err);
    if (Object.keys(err).length) return toast("Please correct the highlighted fields", "error");

    setBusy(true);
    setTimeout(() => {
      submitBulk({
        company: form.company,
        contact: form.name,
        phone: form.phone,
        email: form.email,
        bagType: form.bagType,
        quantity: form.quantity,
        branding: form.branding || "To be confirmed",
        deliveryDate: form.deliveryDate || "Flexible",
        budget: form.budget,
      });
      setBusy(false);
      setSent(true);
      toast("Bulk enquiry received — our B2B team will call you");
    }, 600);
  };

  const budgets = ["Under ₹50,000", "₹50,000 – ₹1,00,000", "₹1,00,000 – ₹2,00,000", "₹2,00,000 – ₹5,00,000", "₹5,00,000+"];

  return (
    <main>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <img src={bulkImage} alt="Bulk custom branded bags ready for corporate dispatch" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="container-page relative py-20">
          <p className="eyebrow text-accent">Bulk & Corporate Orders</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
            Custom Bags for Your Business, Institution & Events
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/85">
            Chandok Bag House provides customised bag manufacturing and logo branding for corporate, institutional and
            bulk requirements — designed, produced and delivered under one roof.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <p className="eyebrow text-secondary">What we produce</p>
        <h2 className="mt-2 font-display text-3xl text-primary">Bulk services</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bulkServices.map((s, i) => (
            <div key={s} className="surface card-hover p-5">
              <span className="font-display text-2xl text-secondary">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 font-semibold text-foreground">{s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted py-14">
        <div className="container-page grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="eyebrow text-secondary">Request a quote</p>
            <h2 className="mt-2 font-display text-3xl text-primary">Tell us about your requirement</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Share your quantity, branding requirement and timeline. We will revert with a sample plan, pricing slab
              and a committed delivery date.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-foreground">
              {["Minimum 50 pieces for stock designs", "100 pieces for fully custom manufacturing", "Screen print, embroidery or woven-label branding", "Delivery across Maharashtra and major Indian cities"].map((t) => (
                <li key={t} className="flex gap-3"><span className="mt-1 text-secondary">◆</span><span>{t}</span></li>
              ))}
            </ul>
          </div>

          <div className="surface p-6 md:p-8 lg:col-span-3">
            {sent ? (
              <div className="fade-up rounded-lg border border-success/40 bg-success/10 p-8 text-center">
                <p className="font-display text-2xl text-success">Enquiry received</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Thank you, {form.name.split(" ")[0]}. Our B2B team will contact {form.company} on {form.phone} within
                  one working day with a quotation and sample plan.
                </p>
                <button className="btn-base btn-outline mt-5" onClick={() => setSent(false)}>Submit another enquiry</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-x" htmlFor="b-name">Full name</label>
                    <input id="b-name" className="field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Contact person" />
                    {errors["name"] && <p className="mt-1 text-xs text-destructive">{errors["name"]}</p>}
                  </div>
                  <div>
                    <label className="label-x" htmlFor="b-company">Company / Institution</label>
                    <input id="b-company" className="field" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Organisation name" />
                    {errors["company"] && <p className="mt-1 text-xs text-destructive">{errors["company"]}</p>}
                  </div>
                  <div>
                    <label className="label-x" htmlFor="b-phone">Mobile number</label>
                    <input id="b-phone" className="field" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 90000 00000" />
                    {errors["phone"] && <p className="mt-1 text-xs text-destructive">{errors["phone"]}</p>}
                  </div>
                  <div>
                    <label className="label-x" htmlFor="b-email">Email</label>
                    <input id="b-email" className="field" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" />
                    {errors["email"] && <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>}
                  </div>
                  <div>
                    <label className="label-x" htmlFor="b-type">Bag type</label>
                    <select id="b-type" className="field" value={form.bagType} onChange={(e) => set("bagType", e.target.value)}>
                      {bulkServices.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-x" htmlFor="b-qty">Quantity required</label>
                    <input id="b-qty" className="field" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="e.g. 250" />
                    {errors["quantity"] && <p className="mt-1 text-xs text-destructive">{errors["quantity"]}</p>}
                  </div>
                  <div>
                    <label className="label-x" htmlFor="b-date">Required delivery date</label>
                    <input id="b-date" type="date" className="field" value={form.deliveryDate} onChange={(e) => set("deliveryDate", e.target.value)} />
                  </div>
                  <div>
                    <label className="label-x" htmlFor="b-budget">Budget range</label>
                    <select id="b-budget" className="field" value={form.budget} onChange={(e) => set("budget", e.target.value)}>
                      {budgets.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label-x" htmlFor="b-brand">Logo / branding requirement</label>
                  <input id="b-brand" className="field" value={form.branding} onChange={(e) => set("branding", e.target.value)} placeholder="Screen print / embroidery / woven label" />
                </div>
                <div>
                  <label className="label-x" htmlFor="b-msg">Message</label>
                  <textarea id="b-msg" rows={4} className="field" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Colours, materials, packaging, delivery location…" />
                  {errors["message"] && <p className="mt-1 text-xs text-destructive">{errors["message"]}</p>}
                </div>
                <button type="submit" className="btn-base btn-gold w-full" disabled={busy}>
                  {busy ? "Submitting…" : "Submit Bulk Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
