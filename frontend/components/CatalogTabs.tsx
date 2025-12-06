"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

type Product = {
  id: number | string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string | null;
};

const CATEGORIES = [
  { id: "embroidery", label: "Embroidery & Textile" },
  { id: "dry", label: "Dry Vegetables (Ker & Sangari)" },
  { id: "wood", label: "Wooden Handicraft" },
  { id: "metal", label: "Metal / Stone Art" },
];

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";

/**
 * Build a proper image URL from backend path or full URL.
 */
function getImageUrl(image: string | undefined | null): string {
  if (!image) return "/no-image.png"; // optional placeholder

  // If backend already returns full URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Ensure single slash between base and path
  const base = apiBase.replace(/\/+$/, "");
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${base}${path}`;
}

/**
 * Try to infer category on frontend based on product fields.
 * If your backend later adds a proper `category` field,
 * this will still work (it prefers p.category).
 */
function inferCategory(p: Product): string {
  if (p.category) {
    const cat = p.category.toString().toLowerCase();
    if (cat.includes("dry")) return "dry";
    if (cat.includes("wood")) return "wood";
    if (cat.includes("metal") || cat.includes("stone")) return "metal";
    if (cat.includes("embroider") || cat.includes("textile")) return "embroidery";
  }

  const name = (p.name || "").toLowerCase();
  const desc = (p.description || "").toLowerCase();
  const text = `${name} ${desc}`;

  // Dry vegetables (Ker, Sangari, etc.)
  if (
    text.includes("ker") ||
    text.includes("sangari") ||
    text.includes("sangri") ||
    text.includes("ker sangari") ||
    text.includes("ker-sangari")
  ) {
    return "dry";
  }

  // Wood craft
  if (
    text.includes("wood") ||
    text.includes("sheesham") ||
    text.includes("teak") ||
    text.includes("charpai")
  ) {
    return "wood";
  }

  // Metal / stone items
  if (
    text.includes("brass") ||
    text.includes("metal") ||
    text.includes("stone") ||
    text.includes("marble")
  ) {
    return "metal";
  }

  // Default: embroidery / textile
  return "embroidery";
}

export default function CatalogTabs({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<string>("embroidery");

  const filtered = useMemo(() => {
    return products.filter((p) => inferCategory(p) === category);
  }, [products, category]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-3 px-2 pb-4 pt-2 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full border transition
              ${
                category === c.id
                  ? "bg-primary text-white border-primary shadow-lg"
                  : "bg-white text-dark border-gray-300 hover:bg-secondary/10"
              }
            `}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <motion.div
        key={category}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 py-4"
      >
        {filtered.map((p) => (
          <motion.div
            whileHover={{ scale: 1.03 }}
            key={p.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl p-3 cursor-pointer border border-gray-100"
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={getImageUrl(p.image)}
                className="w-full h-40 object-cover rounded-lg"
                alt={p.name}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition" />
            </div>
            <div className="mt-2 text-sm font-semibold line-clamp-2">
              {p.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">₹{p.price}</div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-gray-500 py-6">
            No products found in this category yet.
          </div>
        )}
      </motion.div>
    </div>
  );
}
