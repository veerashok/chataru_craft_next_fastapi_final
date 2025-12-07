import ProductCard, { Product } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE as string;
  const res = await fetch(`${apiBase}/api/products`, { cache: "no-store" });
  const products: Product[] = await res.json();

  return (
    <main className="min-h-screen bg-sand pt-8 pb-20">
      <div className="container mx-auto px-3 max-w-6xl">
        {/* Top heading like your HTML catalog page */}
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Catalog
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-primary">
            Featured wooden furniture & decor
          </h1>
          <p className="mt-3 text-sm sm:text-base text-dark/80 max-w-2xl mx-auto">
            Handcrafted wooden pieces, Barmer embroidery, and traditional desert
            products like Ker &amp; Sangari — curated by Chataru Craft.
          </p>
        </div>

        {/* Filters bar (visual only, like woodsala + your HTML) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-gray-700 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">All categories</span>
            <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
              Embroidery
            </span>
            <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
              Dry Vegetables
            </span>
            <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
              Wooden Furniture
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">Sort:</span>
            <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
              Newest
            </span>
            <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
              Price: Low → High
            </span>
            <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
              Price: High → Low
            </span>
          </div>
        </div>

        <p className="mb-4 text-[11px] text-gray-500">
          *Prices indicative; final price depends on size, polish, and platform listing.
        </p>

        {/* Product grid – this controls how big the cards feel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
  {products.map((p) => (
    <ProductCard key={p.id} product={p} />
  ))}
</div>

        {/* Footer address like your HTML */}
        <div className="mt-10 text-center text-xs text-gray-600">
          © Chataru Craft · Boss Enterprises · Village Lakhe Ka Tala, Ramjan Ki
          Gafan, Barmer, Rajasthan
        </div>
      </div>
    </main>
  );
}
