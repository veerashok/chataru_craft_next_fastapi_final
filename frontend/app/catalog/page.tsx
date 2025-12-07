import CatalogGrid from "@/components/CatalogGrid";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE as string;
  const res = await fetch(`${apiBase}/api/products`, {
    cache: "no-store",
  });

  const products = await res.json();

  return (
    <main className="min-h-screen pt-8 pb-20 px-3 max-w-7xl mx-auto bg-sand">
      <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-primary">
        Barmer Bazaar – Embroidery & Desert Flavours
      </h1>

      <p className="text-center text-dark/80 max-w-2xl mx-auto mb-8 mt-3 text-sm sm:text-base">
        Handpicked Barmer hand embroidery and traditional dry vegetables like
        Ker &amp; Sangari, along with authentic wooden and metal handicrafts.
      </p>

      <CatalogGrid products={products} />

      <div className="text-center text-gray-600 mt-10 text-sm">
        Can’t find something?{" "}
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
