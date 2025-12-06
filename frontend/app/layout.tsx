
import "./globals.css";

export const metadata = {
  title: "Chataru Craft",
  description: "Handcrafted wooden furniture and decor by Chataru Craft (Boss Enterprises)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container nav">
            <div className="logo">
              <div className="logo-mark">CC</div>
              <div>
                <div className="logo-text-small">Boss Enterprises</div>
                <div>Chataru Craft</div>
              </div>
            </div>
            <nav className="nav-links">
              <a href="/">Home</a>
              <a href="/catalog">Catalog</a>
              <a href="/contact">Contact</a>
              <a className="nav-cta" href="/contact">Bulk / B2B</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container footer-row">
            <div>© {new Date().getFullYear()} Chataru Craft · All rights reserved.</div>
            <div>Village Lakhe Ka Tala, Ramjan Ki Gafan, Barmer, Rajasthan</div>
          </div>
        </footer>
        <a href="https://wa.me/6375269136" className="whatsapp-btn" target="_blank">💬 WhatsApp</a>
      </body>
    </html>
  );
}
