"use client";

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
    <Link href={`/product/${product.id}`} className="block group" prefetch={false}>
      <article className="h-full flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
        {/* IMAGE AREA – layout + max-height control it, image doesn't dictate card */}
        <div className="w-full bg-gray-50 flex items-center justify-center px-3 pt-3 pb-2">
          <img
            src={imgUrl}
            alt={product.name}
            loading="lazy"
            className="
              w-full h-auto
              max-h-56
              object-contain
              transition-transform duration-300
              group-hover:scale-105
            "
          />
        </div>

        {/* TEXT AREA – similar to Woodsala: name + price */}
        <div className="flex-1 flex flex-col gap-1 px-3 pb-3 pt-1">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-primary">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-[11px] text-slate-500 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="mt-1 text-sm font-bold text-primary">
            ₹ {product.price}
          </div>
        </div>
      </article>
    </Link>
  );
}
