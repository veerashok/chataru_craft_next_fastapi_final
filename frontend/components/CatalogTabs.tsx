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

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const base = apiBase.replace(/\/+$/, "");
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${base}${path}`;
}

/**
 * Try to infer category on frontend based on product fields.
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

  if (
    text.includes("ker") ||
    text.includes("sangari") ||
    text.includes("sangri") ||
    text.includes("ker sangari") ||
    text.includes("ker-sangari")
  ) {
    return "dry";
  }

  if (
    text.includes("wood") ||
    text.includes("sheesham") ||
    text.includes("teak") ||
    text.includes("charpai")
  ) {
    return "wood";
  }

  if (
    text.includes("brass") ||
    text.includes("metal") ||
    text.includes("stone") ||
    text.includes("marble")
  ) {
    return "metal";
  }

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
            className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm sm:text-base transition
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
            whileHover={{ scale: 1.03, translateY: -2 }}
            key={p.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-2xl p-3 cursor-pointer border border-gray-100 flex flex-col"
          >
            {/* Image wrapper: keeps proportion, no distortion */}
            <div className="w-full aspect-[4/5] bg-sand/60 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={getImageUrl(p.image)}
                className="max-h-full max-w-full object-contain"
                alt={p.name}
                loading="lazy"
              />
            </div>

            {/* Text */}
            <div className="mt-3 flex flex-col gap-1">
              <div className="text-xs uppercase tracking-wide text-secondary">
                {inferCategory(p) === "dry" && "Dry Vegetable"}
                {inferCategory(p) === "embroidery" && "Embroidery / Textile"}
                {inferCategory(p) === "wood" && "Wooden Handicraft"}
                {inferCategory(p) === "metal" && "Metal / Stone Art"}
              </div>
              <div className="text-sm font-semibold line-clamp-2">
                {p.name}
              </div>
              <div className="text-xs text-gray-600 mt-1">₹{p.price}</div>
            </div>
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

