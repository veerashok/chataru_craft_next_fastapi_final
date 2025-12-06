
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

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
    setStatus("Logging in...");
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setStatus("Wrong password");
        return;
      }
      setStatus("Logged in");
      await loadProducts();
    } catch (err) {
      console.error(err);
      setStatus("Login failed");
    }
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
      setProducts([]);
      setStatus("Logged out");
    } catch (err) {
      console.error(err);
      setStatus("Logout failed");
    }
  }

  async function loadProducts() {
    setLoading(true);
    setStatus("Loading products...");
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data);
      setStatus(`Loaded ${data.length} product(s).`);
    } catch (err) {
      console.error(err);
      setStatus("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      if (res.status === 401) {
        setStatus("Please login first.");
        return;
      }
      if (!res.ok) throw new Error();
      setStatus("Product added.");
      form.reset();
      await loadProducts();
    } catch (err) {
      console.error(err);
      setStatus("Failed to add product.");
    }
  }

  async function handleRowAction(
    id: number,
    action: "save" | "delete",
    rowEl: HTMLTableRowElement
  ) {
    if (action === "delete") {
      if (!confirm("Delete this product?")) return;
      try {
        const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.status === 401) {
          setStatus("Please login first.");
          return;
        }
        if (!res.ok) throw new Error();
        setStatus("Product deleted.");
        await loadProducts();
      } catch (err) {
        console.error(err);
        setStatus("Failed to delete product.");
      }
      return;
    }

    const nameInput = rowEl.querySelector<HTMLInputElement>('input[data-field="name"]');
    const priceInput = rowEl.querySelector<HTMLInputElement>('input[data-field="price"]');
    const descInput = rowEl.querySelector<HTMLTextAreaElement>('textarea[data-field="description"]');
    const imageInput = rowEl.querySelector<HTMLInputElement>('input[data-field="image"]');

    if (!nameInput || !priceInput || !descInput || !imageInput) return;

    const fd = new FormData();
    fd.append("name", nameInput.value);
    fd.append("price", priceInput.value);
    fd.append("description", descInput.value);
    if (imageInput.files && imageInput.files[0]) {
      fd.append("image", imageInput.files[0]);
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: "PUT",
        body: fd,
        credentials: "include",
      });
      if (res.status === 401) {
        setStatus("Please login first.");
        return;
      }
      if (!res.ok) throw new Error();
      setStatus("Product updated.");
      await loadProducts();
    } catch (err) {
      console.error(err);
      setStatus("Failed to update product.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <h1>Admin – Product catalogue</h1>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <label>
          Admin password:&nbsp;
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="ADMIN_PASSWORD"
          />
        </label>
        <button className="btn btn-primary" onClick={login}>Login</button>
        <button className="btn btn-outline" onClick={logout}>Logout</button>
        <span style={{ fontSize: "0.8rem", color: "#6b5b4b" }}>{status}</span>
      </div>

      <section>
        <h2>Add new product</h2>
        <form onSubmit={handleAdd}>
          <table>
            <tbody>
              <tr>
                <td>Name</td>
                <td><input name="name" required /></td>
              </tr>
              <tr>
                <td>Price (₹)</td>
                <td><input name="price" type="number" min={0} required /></td>
              </tr>
              <tr>
                <td>Description</td>
                <td><textarea name="description" rows={3} /></td>
              </tr>
              <tr>
                <td>Image</td>
                <td>
                  <input name="image" type="file" accept="image/*" required />
                  <div className="note">Image will be uploaded to backend /uploads.</div>
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
            Add product
          </button>
        </form>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Existing products</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Preview</th>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Description</th>
                <th>Change image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody
              id="productRows"
              onClick={e => {
                const target = e.target as HTMLElement;
                const btn = target.closest("button");
                if (!btn) return;
                const action = btn.getAttribute("data-action") as "save" | "delete" | null;
                const idAttr = btn.getAttribute("data-id");
                if (!action || !idAttr) return;
                const id = parseInt(idAttr, 10);
                const rowEl = btn.closest("tr") as HTMLTableRowElement | null;
                if (!rowEl) return;
                void handleRowAction(id, action, rowEl);
              }}
            >
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.image && <img src={p.image} alt={p.name} style={{ maxWidth: 80 }} />}</td>
                  <td><input defaultValue={p.name} data-field="name" /></td>
                  <td><input type="number" defaultValue={String(p.price)} data-field="price" /></td>
                  <td><textarea rows={3} defaultValue={p.description || ""} data-field="description" /></td>
                  <td>
                    <input type="file" accept="image/*" data-field="image" />
                    <div className="note">Leave empty to keep current image</div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-action="save"
                      data-id={p.id}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      data-action="delete"
                      data-id={p.id}
                      style={{ marginLeft: 4 }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
