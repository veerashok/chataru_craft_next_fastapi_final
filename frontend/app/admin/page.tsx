"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://chataru-craft-backend-production.up.railway.app";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  async function login() {
    setStatus("Logging in…");
    const res = await fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return setStatus("Wrong password ❌");
    setStatus("Logged in ✔");
    loadProducts();
  }

  async function logout() {
    await fetch(`${API_BASE}/api/admin/logout`, {
      method: "POST",
      credentials: "include",
    });
    setProducts([]);
    setStatus("Logged out");
  }

  async function loadProducts() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/products`, {
      credentials: "include",
    });
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  async function saveProduct(p: Product, form: HTMLFormElement) {
    const fd = new FormData(form);
    const res = await fetch(`${API_BASE}/api/admin/products/${p.id}`, {
      method: "PUT",
      body: fd,
      credentials: "include",
    });
    if (!res.ok) return setStatus("Save failed ❌");
    setStatus("Saved ✔");
    loadProducts();
  }

  async function deleteProduct(id: number) {
    if (!confirm("Delete product?")) return;
    const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) return setStatus("Delete failed ❌");
    setStatus("Deleted ✔");
    loadProducts();
  }

  async function addProduct(form: HTMLFormElement) {
    const fd = new FormData(form);
    const res = await fetch(`${API_BASE}/api/admin/products`, {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    if (!res.ok) return setStatus("Add failed ❌");
    form.reset();
    setStatus("Product added ✔");
    loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-amber-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-700 text-xs font-semibold text-white shadow-sm">
              CC
            </div>
            <div className="text-sm font-semibold text-slate-900">
              Chataru Craft — Admin Panel
            </div>
          </Link>
          <button
            onClick={logout}
            className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-[12px] font-medium text-red-700 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Login panel (only if logged out) */}
      {products.length === 0 && (
        <section className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow">
          <h2 className="text-lg font-semibold mb-3">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ADMIN_PASSWORD"
            className="w-full rounded border px-3 py-2 mb-3 text-sm"
          />
          <button
            onClick={login}
            className="w-full rounded bg-amber-700 py-2 text-sm font-medium text-white hover:bg-amber-800"
          >
            Login
          </button>
          <p className="mt-2 text-xs text-center text-slate-500">{status}</p>
        </section>
      )}

      {/* Products & Add form */}
      {products.length > 0 && (
        <section className="mx-auto max-w-6xl px-3 py-6 space-y-10">
          {/* Add new product */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">Add new product</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addProduct(e.currentTarget);
              }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <input name="name" placeholder="Product name" required className="rounded border px-3 py-2" />
              <input name="price" type="number" min="0" placeholder="Price (₹)" required className="rounded border px-3 py-2" />
              <textarea name="description" rows={3} placeholder="Description" className="col-span-full rounded border px-3 py-2" />
              <input name="image" type="file" accept="image/*" required className="rounded border px-3 py-2" />
              <button className="col-span-full rounded bg-amber-700 py-2 text-sm font-medium text-white hover:bg-amber-800">
                ➕ Add product
              </button>
            </form>
            <p className="text-xs mt-2 text-slate-500">{status}</p>
          </div>

          {/* Product cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <form
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveProduct(p, e.currentTarget);
                }}
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  width={500}
                  height={500}
                  className="h-40 w-full rounded object-cover"
                />
                <input className="w-full rounded border px-3 py-2 text-sm" name="name" defaultValue={p.name} />
                <input className="w-full rounded border px-3 py-2 text-sm" type="number" name="price" defaultValue={p.price} />
                <textarea className="w-full rounded border px-3 py-2 text-sm" rows={3} name="description" defaultValue={p.description || ""} />
                <input className="w-full rounded border px-3 py-2 text-sm" type="file" accept="image/*" name="image" />
                <div className="flex gap-2 pt-1">
                  <button className="flex-1 rounded bg-amber-700 py-2 text-xs font-medium text-white hover:bg-amber-800">
                    💾 Save
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProduct(p.id)}
                    className="flex-1 rounded border border-red-300 bg-red-50 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    ❌ Delete
                  </button>
                </div>
              </form>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-10 border-t bg-white py-6 text-center text-xs text-slate-500">
        Chataru Craft · Boss Enterprises — Admin Panel
      </footer>
    </main>
  );
}
