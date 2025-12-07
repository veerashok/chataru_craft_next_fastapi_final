"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export type Product = {
  id: number | string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string | null;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

function getImageUrl(image?: string | null): string {
  if (!image) return "/no-image.png";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const base = apiBase.replace(/\/+$/, "");
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${base}${path}`;
}

function inferCategoryLabel(p: Product): string {
  const raw = (p.category || "").toString().toLowerCase();
  const text = `${p.name || ""} ${p.description || ""}`.toLowerCase();

  const src = raw || text;

  if (
    src.includes("ker") ||
    src.includes("sangari") ||
    src.includes("sangri") ||
    src.includes("ker-sangari")
  ) {
    return "Dry Vegetable";
  }
  if (src.includes("wood") || src.includes("sheesham") || src.includes("teak")) {
    return "Wooden Handicraft";
  }
  if (src.includes("metal") || src.includes("stone") || src.includes("brass")) {
    return "Metal / Stone Art";
  }
  return "Embroidery / Textile";
}

function getBadge(p: Product): string | null {
  const text = `${p.name || ""} ${p.description || ""}`.toLowerCase();
  if (text.includes("new")) return "New";
  if (text.includes("best")) return "Best Seller";
  if (text.includes("popular") || text.includes("famous")) return "Popular";
  return null;
}

function getWhatsAppLink(p: Product): string | null {
  if (!whatsappNumber) return null;
  const cleaned = whatsappNumber.replace(/[^0-9]/g, "");
  if (!cleaned) return null;

  const message = `Hi, I'm interested in "${p.name}" (₹${p.price}). Please share details.`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imgUrl = getImageUrl(product.image);
  const categoryLabel = inferCategoryLabel(product);
  const badge = getBadge(product);
  const waLink = getWhatsAppLink(product);

  return (
    <Link
      href={`/product/${product.id}`}
      className="block h-full"
      prefetch={false}
    >
      <motion.div
        whileHover={{ scale: 1.03, translateY: -3 }}
        transition={{ duration: 0.18 }}
        className="group h-full flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* IMAGE AREA – fixed aspect, nice crop, aligned rows */}
        <div className="relative w-full bg-sand/70">
          {/* square-ish aspect so all cards align */}
          <div className="relative w-full aspect-[4/5] overflow-hidden">
            <img
              src={imgUrl}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </div>

          {/* badge */}
          {badge && (
            <span className="absolute top-2 left-2 z-10 text-[10px] font-semibold px-2 py-1 rounded-full bg-secondary text-dark shadow-sm">
              {badge}
            </span>
          )}
        </div>

        {/* TEXT AREA */}
        <div className="flex-1 flex flex-col p-3">
          <div className="text-[11px] uppercase tracking-wide text-secondary">
            {categoryLabel}
          </div>

          <div className="mt-1 text-sm font-semibold line-clamp-2 flex-1">
            {product.name}
          </div>

          <div className="mt-1 text-xs text-gray-700">₹{product.price}</div>

          {/* WhatsApp button (small) */}
          {waLink && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(waLink, "_blank");
              }}
              className="mt-2 inline-flex items-center justify-center text-[11px] px-3 py-1 rounded-full bg-accent text-white font-medium hover:bg-primary transition-colors"
            >
              Order on WhatsApp
            </button>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
