import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/IMP_LOGO_final.png";
import { ExploreSections } from "@/components/explore-sections";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Impressions Wedding Cards — Handcrafted Invitations & Custom Design" },
      {
        name: "description",
        content:
          "Explore our signature invitation collections, design your own card, and discover luxury wedding stationery — all designed in our Thrissur atelier.",
      },
      { property: "og:title", content: "Impressions Wedding Cards — Bespoke Wedding Invitations" },
      {
        property: "og:description",
        content: "Heritage, minimal, floral, modern collections. Customise your card with live preview.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <ExploreSections />;
}

// NOTE: Nav is currently unused (not called anywhere in this file, and not
// exported so nothing else can import it either). Kept as-is since the ask
// was to preserve behavior — safe to delete later if you confirm it's dead.
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: { label: string; to: string }[] = [
    { label: "Portfolio", to: "/shop" },
    { label: "Customise", to: "/customize" },
    { label: "Allure", to: "/explore#allure" },
    { label: "Contact", to: "/#contact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md" : ""
      }`}
      style={{ backgroundColor: scrolled ? "rgba(245,240,230,0.92)" : "transparent" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        {/* Logo */}
        <a href="#" className="h-10">
          <img src={logo} alt="Impressions" className="h-full w-auto" />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: scrolled ? "#1a1a1a" : "#f5f0e6" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/customize"
            className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: scrolled ? "#1a1a1a" : "#f5f0e6",
              color: scrolled ? "#f5f0e6" : "#1a1a1a",
            }}
          >
            Customise
          </Link>
        </div>
      </div>
    </header>
  );
}
