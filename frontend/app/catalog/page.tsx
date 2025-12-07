import ProductCard, { Product } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE as string;
  const res = await fetch(`${apiBase}/api/products`, { cache: "no-store" });
  const products: Product[] = await res.json();

  return (
    <main className="min-h-screen pt-8 pb-20 px-3 bg-sand">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-primary">
          Barmer Bazaar – Catalog
        </h1>

        <p className="text-center text-dark/80 max-w-2xl mx-auto mb-8 mt-3 text-sm sm:text-base">
          Hand embroidery, dry vegetables like Ker &amp; Sangari, and authentic
          handicrafts from Barmer.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </main>
  );
}
