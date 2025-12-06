
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type Product = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image: string;
  created_at: string;
};

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: "2rem 0" }}>Loading catalog…</div>;
  }

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <h1>Featured wooden furniture & decor</h1>
      <div className="catalog-grid">
        {products.map(p => (
          <article key={p.id} className="product-card">
            <img className="product-thumb" src={p.image} alt={p.name} />
            <div className="product-name">{p.name}</div>
            <p className="product-desc">{p.description}</p>
            <div className="product-price">₹{p.price}</div>
            <button
              className="product-btn"
              onClick={() => window.location.href = `/contact?product=${encodeURIComponent(p.name)}`}
            >
              Enquire
            </button>
          </article>
        ))}
      </div>
      <p style={{ fontSize: "0.8rem", color: "#7a6a5a", marginTop: "0.7rem" }}>
        *Prices indicative; final price depends on size, polish, and platform listing.
      </p>
    </div>
  );
}
