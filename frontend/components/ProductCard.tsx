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

// Build final image URL
function getImageUrl(image?: string | null): string {
  if (!image) return "/no-image.png";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const base = apiBase.replace(/\/+$/, "");
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${base}${path}`;
}

// Category label
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

// WhatsApp link
function getWhatsAppLink(p: Product): string | null {
  if (!whatsappNumber) return null;
  const cleaned = whatsappNumber.replace(/[^0-9]/g, "");
  if (!cleaned) return null;

  const message = `Hi, I'm interested in "${p.name}" (₹${p.price}). Please share details.`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

type Props = {
  product: Product;
};

const ProductCard: React.FC<Props> = ({ product }) => {
  const imgUrl = getImageUrl(product.image);
  const category = inferCategoryLabel(product);
  const waLink = getWhatsAppLink(product);

  return (
    <Link href={`/product/${product.id}`} className="block h-full" prefetch={false}>
      <motion.div
        whileHover={{ scale: 1.02, translateY: -3 }}
        transition={{ duration: 0.16 }}
        className="
          h-full flex flex-col
          rounded-2xl border border-orange-100
          bg-white/95
          shadow-sm hover:shadow-lg
          overflow-hidden
        "
      >
        {/* IMAGE AREA – smaller & consistent */}
        <div className="relative w-full bg-sand/70">
          {/* use 3:4 aspect so cards aren’t too tall */}
          <div className="relative w-full pt-[75%] overflow-hidden">
            <img
              src={imgUrl}
              alt={product.name}
              loading="lazy"
              className="
                absolute inset-0 w-full h-full
                object-cover
                transition-transform duration-300 ease-out
                hover:scale-105
              "
            />
          </div>

          {/* small gradient at bottom for nicer look */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/15 to-transparent" />
        </div>

        {/* TEXT AREA */}
        <div className="flex-1 flex flex-col gap-1.5 p-3">
          {/* colorful category chip */}
          <div className="inline-flex w-fit items-center gap-1 rounded-full bg-secondary/15 px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-secondary">
              {category}
            </span>
          </div>

          {/* name */}
          <div className="text-sm font-semibold text-dark line-clamp-2 flex-1">
            {product.name}
          </div>

          {/* price */}
          <div className="text-xs font-bold text-primary">
            ₹{product.price}
          </div>

          {/* WhatsApp button */}
          {waLink && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(waLink, "_blank");
              }}
              className="
                mt-2 inline-flex items-center justify-center
                text-[11px] px-3 py-1 rounded-full
                bg-accent text-white font-medium
                hover:bg-primary
                transition-colors
              "
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
