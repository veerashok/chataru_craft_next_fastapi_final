import CatalogTabs from "../../components/CatalogTabs";
export const dynamic = "force-dynamic"; // prevents caching for fresh product fetch

export default async function CatalogPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products`, {
    cache: "no-store",
  });
  const products = await res.json();

  return (
    <main className="min-h-screen pt-8 pb-20 px-3 max-w-7xl mx-auto">
      {/* Page Title */}
      <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
        Explore Barmer’s Heritage & Flavours
      </h1>

      {/* Tagline */}
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
        Authentic Barmer hand embroidery & traditional Rajasthani dry vegetables like Ker & Sangari — delivered across India.
      </p>

      {/* New Modern Catalogue (Tabs + Grid) */}
      <CatalogTabs products={products} />

      {/* Footer Message / CTA */}
      <div className="text-center text-gray-500 mt-10 text-sm">
        Can’t find a product?{" "}
        <a
          href="/contact"
          className="underline underline-offset-2 font-medium hover:text-black"
        >
          Contact us on WhatsApp
        </a>
      </div>
    </main>
  );
}
