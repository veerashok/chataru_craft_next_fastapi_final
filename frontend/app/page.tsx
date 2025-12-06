
"use client";

export default function HomePage() {
  return (
    <div className="container hero">
      <div className="hero-grid">
        <div>
          <h1>Handcrafted wooden furniture & decor from Barmer, Rajasthan</h1>
          <p>
            Chataru Craft (a brand of Boss Enterprises) brings you traditional desert craftsmanship with
            modern utility — sanduks, temples, bedside units, wall décor and more.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
            <a href="/catalog" className="btn btn-primary">View catalog</a>
            <a href="/contact" className="btn btn-outline">Custom / bulk enquiry</a>
          </div>
        </div>
        <div>
          <div className="product-card">
            <div className="product-name">Why buyers choose Chataru Craft</div>
            <ul style={{ paddingLeft: "1.2rem", fontSize: "0.9rem", color: "#6b5b4b" }}>
              <li>Solid Sheesham / Mango wood – no flimsy board</li>
              <li>Hand-finished by artisans from Barmer</li>
              <li>Custom sizes & finishes for bulk / B2B</li>
              <li>Listing-friendly designs for Amazon, Flipkart, etc.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
