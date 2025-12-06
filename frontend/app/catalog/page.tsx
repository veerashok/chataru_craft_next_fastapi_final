import CatalogTabs from "../../components/CatalogTabs";

export const dynamic = "force-dynamic"; // always fetch fresh products

export default async function CatalogPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE as string;
  const res = await fetch(`${apiBase}/api/products`, {
    cache: "no-store",
  });
  const products = await res.json();

  return (
    <main className="min-h-screen pt-8 pb-20 px-3 max-w-7xl mx-auto bg-sand">
      {/* Page Title */}
      <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-primary">
        Barmer Bazaar – Embroidery & Desert Flavours
      </h1>

      {/* Tagline */}
      <p className="text-center text-dark/80 max-w-2xl mx-auto mb-8 mt-3 text-sm sm:text-base">
        Handpicked Barmer hand embroidery, traditional dry vegetables like Ker &
        Sangari, and authentic handicrafts — curated from the heart of Thar.
      </p>

      {/* Catalog Tabs + Grid */}
      <CatalogTabs products={products} />

      {/* Footer / CTA */}
      <div className="text-center text-gray-600 mt-10 text-sm">
        Can’t find a specific product?{" "}
        <a
          href="/contact"
          className="underline underline-offset-2 font-medium hover:text-primary"
        >
          Contact us on WhatsApp or email
        </a>
        .
      </div>
    </main>
  );
}
