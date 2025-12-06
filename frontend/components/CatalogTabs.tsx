"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { id: "embroidery", label: "Embroidery & Textile" },
  { id: "dry", label: "Dry Vegetables (Ker & Sangari)" },
  { id: "wood", label: "Wooden Handicraft" },
  { id: "metal", label: "Metal / Stone Art" },
];

export default function CatalogTabs({ products }: { products: any[] }) {
  const [category, setCategory] = useState("embroidery");

  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.category?.toLowerCase().includes(category)
    );
  }, [products, category]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-3 px-2 pb-4 pt-2 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full transition 
              ${category === c.id ? "bg-black text-white shadow-lg" : "bg-gray-200 hover:bg-gray-300"}
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
            className="bg-white rounded-xl shadow hover:shadow-xl p-3 cursor-pointer"
          >
            <img
              src={p.image}
              className="w-full h-40 object-cover rounded-lg"
              alt={p.name}
            />
            <div className="mt-2 text-sm font-semibold">{p.name}</div>
            <div className="text-xs text-gray-500">₹{p.price}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
