"use client";

import React from "react";
import Link from "next/link";

export type Product = {
  id: number | string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string | null;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";

// Build final image URL from backend path or absolute URL
function getImageUrl(image?: string | null): string {
  if (!image) return "/no-image.png";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  const base = apiBase.replace(/\/+$/, "");
  const path = image.replace(/^\/+/, "");
  return `${base}/${path}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const imgUrl = getImageUrl(product.image);

  return (
    <Link
      href={`/product/${product.id}`}
      className="block"
      prefetch={false}
    >
      <div
        className="
          flex flex-col
          rounded-2xl border border-gray-200
          bg-white shadow-sm hover:shadow-md
          overflow-hidden transition
        "
      >
        {/* IMAGE CONTAINER – flex decides height, no fixed size */}
        <div className="w-full bg-gray-100 flex items-center justify-center p-3">
          <img
            src={imgUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* TEXT AREA – grows naturally with content */}
        <div className="flex flex-col gap-1 px-3 py-2">
          <div className="text-sm font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </div>
          <div className="text-xs font-bold text-primary">
            ₹ {product.price}
          </div>
        </div>
      </div>
    </Link>
  );
}
