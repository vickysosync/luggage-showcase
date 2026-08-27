import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { adminCredentials } from "@/data/admin";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Chandok Bag House" },
      { name: "description", content: "Secure demo admin sign-in for the Chandok Bag House store dashboard." },
      { property: "og:title", content: "Admin Login — Chandok Bag House" },
      { property: "og:description", content: "Sign in to manage products, orders, enquiries and coupons." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { adminLogin } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <main className="grid min-h-screen place-items-center bg-primary px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl">
        <p className="eyebrow text-secondary">Chandok Bag House</p>
        <h1 className="mt-2 font-display text-2xl text-primary">Admin Sign In</h1>
        <p className="mt-1 text-sm text-muted-foreground">Frontend demo authentication only.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim() || !password) {
              setError("Please enter both email and password.");
              return;
            }
            if (adminLogin(email, password)) {
              setError("");
              navigate({ to: "/admin/dashboard" });
            } else {
              setError("Invalid admin credentials.");
            }
          }}
        >
          <div>
            <label className="label-x" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chandokbaghouse.com"
            />
          </div>
          <div>
            <label className="label-x" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" className="btn-base btn-primary w-full">Sign In</button>
        </form>

        <div className="mt-6 rounded-lg bg-muted p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Demo credentials</p>
          <p className="mt-1">{adminCredentials.email}</p>
          <p>{adminCredentials.password}</p>
        </div>

        <Link to="/" className="mt-6 inline-block text-sm text-secondary hover:underline">
          ← Back to website
        </Link>
      </div>
    </main>
  );
}
