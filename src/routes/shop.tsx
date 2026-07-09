import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Heart, ChevronDown, ShoppingBag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import invitations from "@/assets/invitations.jpg";
import heroVenue from "@/assets/hero-venue.jpg";
import type { Catalog } from "@/lib/catalog";
import cardsData from "@/data/cards.json";

const displayImages = import.meta.glob('@/assets/cards/display/*.{jpeg,jpg,png}', {
  eager: true,
  query: { url: true },
  import: 'default',
}) as Record<string, string>;

function imgUrl(filename: string): string {
  return displayImages[`/src/assets/cards/display/${filename}`] || filename;
}

const CATEGORIES = ["All", "MINIMAL", "MODERN", "PASTEL"];
const PAGE_SIZE = 10;
const WHATSAPP_NUMBER = "9199999999";

const categoryCircles = [
  {
    label: "Minimal",
    cat: "MINIMAL",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=150&h=150&fit=crop&crop=face",
  },
  {
    label: "Modern",
    cat: "MODERN",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=150&h=150&fit=crop&crop=face",
  },
  {
    label: "Pastel",
    cat: "PASTEL",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=150&h=150&fit=crop&crop=face",
  },
];

function ShopPage() {
  const [items, setItems] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [active, setActive] = useState<Catalog | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const [showFavorites, setShowFavorites] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);

  useEffect(() => {
    if (active) {
      const raf = requestAnimationFrame(() => setModalMounted(true));
      return () => cancelAnimationFrame(raf);
    }
    setModalMounted(false);
  }, [active]);

  const closeModal = useCallback(() => {
    setModalMounted(false);
    setTimeout(() => setActive(null), 200);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]);
  };

  const toggleFavFilter = () => {
    setShowFavorites((prev) => !prev);
    setVisible(PAGE_SIZE);
  };

  const [modalQuantity, setModalQuantity] = useState(0);
  const [modalSize, setModalSize] = useState("");

  useEffect(() => {
    if (active) {
      setModalQuantity(active.minOrder);
      setModalSize(active.size);
    }
  }, [active?.id]);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (active) {
      setSelectedImageIndex(0);
      setGalleryIndex(0);
      setGalleryOpen(false);
    }
  }, [active?.id]);

  useEffect(() => {
    if (active) {
      window.history.replaceState(null, "", `#card=${active.id}`);
    } else if (window.location.hash.startsWith("#card=")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [active]);

  useEffect(() => {
    if (!galleryOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGalleryOpen(false);
      if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && active && active.images.length > 1) {
        setGalleryIndex((prev) => {
          const len = active.images.length;
          return e.key === "ArrowLeft" ? (prev - 1 + len) % len : (prev + 1) % len;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [galleryOpen, active]);

  const qty = modalQuantity;
  const cardCost = active ? qty * active.price : 0;
  const extraTotal = active?.extraCharges?.reduce((sum, ch) => sum + ch.price, 0) || 0;
  const showPrinting = active?.minOrder === 100;
  const printingFee = showPrinting && qty < 200 ? 600 : 0;
  const printingWaived = showPrinting && printingFee === 0 ? 600 : 0;
  let discountPct = 0;
  if (qty >= 1000) discountPct = 10;
  else if (qty >= 500) discountPct = 5;
  const discountAmt = Math.round(cardCost * discountPct / 100);
  const finalTotal = Math.round(cardCost * (1 - discountPct / 100)) + printingFee + extraTotal;
  const totalSavings = printingWaived + discountAmt;

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/shop#card=${active?.id}`
    : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {}
  };

  function getQuantityOptions(minOrder: number): number[] {
    const options: number[] = [];
    for (let qty = minOrder; qty <= 1500; qty += 50) {
      options.push(qty);
    }
    return options;
  }

  useEffect(() => {
    const t = setTimeout(() => {
      setItems(cardsData as Catalog[]);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  const setCategoryAndReset = (c: string) => {
    setCategory(c);
    setVisible(PAGE_SIZE);
    setActive(null);
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let result = items;
    if (category !== "All") {
      result = result.filter((c) => c.category === category);
    }
    if (q) {
      result = result.filter((c) => c.id.toLowerCase().includes(q));
    }
    if (showFavorites) {
      result = result.filter((c) => favorites.includes(c.id));
    }
    if (sort === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [items, category, query, sort, showFavorites, favorites]);

  const page = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-zola-ink text-zola-cream text-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-3">
            <span className="rounded bg-zola-cream px-2 py-0.5 text-xs font-semibold text-zola-ink">
              Premium
            </span>
            <span className="hidden sm:inline">
              Discover our premium letterpress & foil atelier line
            </span>
            <a href="https://www.allurecards.in" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
              Visit Allure&trade; →
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="hover:opacity-80">
              Impressions Home
            </Link>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-zola-ink/10 bg-zola-cream">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <button className="flex items-center gap-1 hover:opacity-70">
              Shop <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <Link to="/customize" className="flex items-center gap-1 hover:opacity-70">
              Customize <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <Link to="/" className="hover:opacity-70">
              Home
            </Link>
          </nav>
          <Link to="/" className="font-serif text-3xl tracking-[0.2em] font-medium text-zola-ink">
            IMPRESSIONS
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:opacity-70" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={toggleFavFilter}
              aria-label={`Favorites (${favorites.length})`}
              className={`relative p-2 transition hover:opacity-70 ${showFavorites ? "text-zola-ink" : "text-zola-ink/60"}`}
            >
              <Heart className="h-5 w-5" fill={showFavorites ? "currentColor" : "none"} />
              {favorites.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zola-ink px-1 text-[10px] font-semibold text-zola-cream leading-none">
                  {favorites.length}
                </span>
              )}
            </button>
            <Link to="/customize" className="rounded-full bg-zola-ink px-5 py-2.5 text-sm font-semibold text-zola-cream transition-transform duration-150 active:scale-[0.97]">
              Design your own
            </Link>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="border-t border-zola-ink/10">
          <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-8 overflow-x-auto px-6 py-4 text-sm">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryAndReset(c)}
                className={`flex items-center gap-1 whitespace-nowrap transition ${
                  category === c ? "border-b-2 border-zola-ink pb-1 font-semibold" : "hover:opacity-70"
                }`}
              >
                {c === "All" ? "All cards" : c} <ChevronDown className="h-3.5 w-3.5" />
              </button>
            ))}
            <Link to="/customize" className="flex items-center gap-1 whitespace-nowrap hover:opacity-70">
              Customize <ChevronDown className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-6 pt-6 text-sm text-zola-ink/70">
        <Link to="/" className="hover:underline">
          Allure Cards
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zola-ink">Wedding cards</span>
      </div>

      {/* Page title */}
      <section className="mx-auto max-w-[1400px] px-6 pt-10">
        <h1 className="font-serif text-4xl tracking-tight text-zola-ink">
          Wedding invitation cards
        </h1>
        <p className="mt-2 text-zola-ink/70">
          Handcrafted designs for your special day.
        </p>
      </section>

      {/* Category circles */}
      <section className="mx-auto max-w-[1400px] px-6 pb-10 pt-8">
        <div className="flex items-center justify-center gap-10">
          {categoryCircles.map((c) => (
            <button
              key={c.cat}
              onClick={() => setCategoryAndReset(c.cat)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`h-20 w-20 overflow-hidden rounded-full ring-1 transition-all duration-200 group-hover:ring-2 group-hover:ring-zola-ink ${
                  category === c.cat ? "ring-2 ring-zola-ink" : "ring-zola-ink/15"
                }`}
              >
                <img src={c.image} alt={c.label} className="h-full w-full object-cover" />
              </div>
              <span className="text-sm font-medium text-zola-ink">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Filter bar */}
      <section className="mx-auto max-w-[1400px] border-t border-zola-ink/10 px-6 pb-6 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-zola-ink/70">
            {loading ? "Loading catalogue…" : `${filtered.length} results`}
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 rounded-full bg-zola-ink px-4 py-2.5 text-sm text-zola-cream transition active:scale-[0.97] hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" /> Order on WhatsApp
          </a>
        </div>

        {/* Filter pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Select
            value={sort}
            onValueChange={(value) => {
              setSort(value as "featured" | "price-asc" | "price-desc");
              setVisible(PAGE_SIZE);
            }}
          >
            <SelectTrigger className="w-auto gap-1.5 rounded-full border border-zola-ink/20 bg-zola-cream px-4 py-2 text-sm text-zola-ink shadow-none transition duration-150 ease-out hover:border-zola-ink focus:border-zola-ink focus:ring-1 focus:ring-zola-ink/20 [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-zola-ink/40 [&>svg]:opacity-100">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zola-ink/10 bg-zola-cream shadow-lg">
              <SelectItem value="featured" className="cursor-pointer rounded-lg text-sm focus:bg-zola-ink/5 focus:text-zola-ink">Featured</SelectItem>
              <SelectItem value="price-asc" className="cursor-pointer rounded-lg text-sm focus:bg-zola-ink/5 focus:text-zola-ink">Price: Low to High</SelectItem>
              <SelectItem value="price-desc" className="cursor-pointer rounded-lg text-sm focus:bg-zola-ink/5 focus:text-zola-ink">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={(value) => setCategoryAndReset(value)}>
            <SelectTrigger className="w-auto gap-1.5 rounded-full border border-zola-ink/20 bg-zola-cream px-4 py-2 text-sm text-zola-ink shadow-none transition duration-150 ease-out hover:border-zola-ink focus:border-zola-ink focus:ring-1 focus:ring-zola-ink/20 [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-zola-ink/40 [&>svg]:opacity-100">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zola-ink/10 bg-zola-cream shadow-lg">
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="cursor-pointer rounded-lg text-sm capitalize focus:bg-zola-ink/5 focus:text-zola-ink">
                  {c === "All" ? "All Styles" : c.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1.5 rounded-full border border-zola-ink/20 px-4 py-2 text-sm transition hover:border-zola-ink">
            <Search className="h-3.5 w-3.5" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search…"
              className="w-24 bg-transparent outline-none placeholder:text-zola-ink/40"
            />
          </div>
          <button
            onClick={toggleFavFilter}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition active:scale-[0.97] ${
              showFavorites
                ? "border-zola-ink bg-zola-ink text-zola-cream"
                : "border-zola-ink/20 hover:border-zola-ink"
            }`}
          >
            <Heart className="h-3.5 w-3.5" fill={showFavorites ? "currentColor" : "none"} />
            Favorites ({favorites.length})
          </button>
        </div>
      </section>

      {/* Product grid */}
      <section className="mx-auto max-w-[1400px] px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zola-ink border-t-transparent" />
          </div>
        ) : page.length === 0 ? (
          <p className="py-20 text-center text-zola-ink/70">
            No cards found. Try a different search or filter.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {page.map((c) => (
                <article
                  key={c.id}
                  onClick={() => setActive(c)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#f7f5f0]">
                    {c.images.length > 0 && (
                      <img
                        src={imgUrl(c.images[0])}
                        alt={c.id}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(c.id);
                      }}
                      aria-label={favorites.includes(c.id) ? "Remove from favorites" : "Add to favorites"}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur hover:bg-white"
                    >
                      <Heart className="h-4 w-4" fill={favorites.includes(c.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium">{c.id}</h3>
                      {c.featured && (
                        <span className="rounded-sm bg-[#e8d9b0] px-2 py-0.5 text-xs text-[#5a4a1a] whitespace-nowrap">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm">₹{c.price.toFixed(2)} each</p>
                    {c.description && (
                      <p className="mt-1 line-clamp-1 text-sm text-zola-ink/70">{c.description}</p>
                    )}
                  </div>
                </article>
              ))}
              <a
                key="ad-allure"
                href="https://www.allurecards.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative rounded-sm overflow-hidden text-white"
                style={{ backgroundColor: "#0f2740" }}
              >
                <img
                  src={heroVenue}
                  alt="Allure Cards premium wedding stationery"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
                />
                <div className="relative z-10 flex flex-col justify-between p-6 aspect-[4/5]">
                  <div>
                    <div className="text-xs uppercase tracking-widest font-semibold opacity-90">Sponsored</div>
                    <h3 className="font-serif text-4xl leading-tight font-medium mt-3">
                      <em className="not-italic">Allure</em> Cards
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed max-w-[240px]">
                      <span className="font-semibold">Premium</span> foil,{' '}
                      <span className="font-semibold">letterpress</span>, and{' '}
                      <span className="font-semibold">luxury</span> paper.
                      Elevate your invitation suite.
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 bg-white text-neutral-900 text-sm font-semibold px-4 py-2 rounded-full">
                      Shop Allure Cards &rarr;
                    </span>
                  </div>
                </div>
              </a>
              <Link
                to="/customize"
                className="group block relative rounded-sm overflow-hidden text-white"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <img src={invitations} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-200" />
                <div className="relative z-10 flex flex-col justify-between p-6 aspect-[4/5]">
                  <div>
                    <div className="text-xs uppercase tracking-widest font-semibold opacity-90">Custom</div>
                    <h3 className="font-serif text-4xl leading-tight font-medium mt-3">
                      Design <em className="not-italic">Your Own</em>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed max-w-[240px]">
                      Start from scratch with our interactive designer. Pick templates, fonts, colors, verses and more.
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 bg-white text-neutral-900 text-sm font-semibold px-4 py-2 rounded-full transition-transform duration-150 active:scale-[0.97]">
                      Start Designing &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-full border border-zola-ink/20 px-8 py-3 text-sm font-medium transition active:scale-[0.97] hover:border-zola-ink"
                >
                  Load more ({filtered.length - visible} left)
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-zola-ink text-zola-cream">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-6 py-12 text-sm md:grid-cols-4">
          <div>
            <h4 className="font-serif text-xl mb-4">Impressions</h4>
            <p className="opacity-70">Wedding cards, made for you.</p>
          </div>
          <div>
            <h5 className="mb-3 font-semibold">Shop</h5>
            <ul className="space-y-2 opacity-70">
              <li><Link to="/shop" className="hover:opacity-60">All cards</Link></li>
              <li><Link to="/customize" className="hover:opacity-60">Customize</Link></li>
              <li><Link to="/customize" className="hover:opacity-60">Design your own</Link></li>
            </ul>
          </div>

        </div>
        <div className="border-t border-zola-cream/10">
          <p className="mx-auto max-w-[1400px] px-6 py-6 text-xs opacity-50">
            &copy; {new Date().getFullYear()} Impressions Cards. All rights reserved.
          </p>
        </div>
      </footer>

      {/* QuickView modal */}
      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0d0d0d]/70 backdrop-blur-sm md:items-center"
          onClick={closeModal}
          style={{
            opacity: modalMounted ? 1 : 0,
            transition: 'opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          <div
            className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-[#f5f0e6] text-[#1a1a1a] md:max-w-5xl md:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              opacity: modalMounted ? 1 : 0,
              transform: `scale(${modalMounted ? 1 : 0.95}) translateY(${modalMounted ? 0 : 8}px)`,
              transition: 'opacity 250ms cubic-bezier(0.23, 1, 0.32, 1), transform 250ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 rounded-full bg-[#1a1a1a] px-3 py-1.5 text-xs font-semibold text-[#f5f0e6]"
              aria-label="Close"
            >
              Close ✕
            </button>

            <div className="grid gap-10 p-6 md:grid-cols-2 md:p-10">
              {/* Gallery */}
              <div>
                <button
                  onClick={() => { setGalleryIndex(selectedImageIndex); setGalleryOpen(true); }}
                  className="block w-full overflow-hidden rounded-2xl bg-[#eee6d5] p-6"
                  aria-label="Open full screen"
                >
                  <div className="relative">
                    {active.images.length > 0 && (
                      <img
                        src={imgUrl(active.images[selectedImageIndex])}
                        alt={active.id}
                        className="w-full object-cover"
                        style={{ aspectRatio: '4 / 5' }}
                      />
                    )}
                    <span className="absolute bottom-2 right-2 rounded-full bg-[#1a1a1a]/80 px-3 py-1 text-[10px] uppercase tracking-wider text-[#f5f0e6]">
                      Tap to enlarge
                    </span>
                  </div>
                </button>
                {active.images.length > 1 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {active.images.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`overflow-hidden rounded-lg border-2 ${
                          idx === selectedImageIndex ? "border-[#1a1a1a]" : "border-transparent"
                        }`}
                      >
                        <img src={imgUrl(src)} alt="" className="aspect-square w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] opacity-60">
                  {active.id} · {active.category || "Allure"}
                </p>
                <div className="mt-1 flex items-start justify-between gap-3">
                  <h2 className="font-serif text-4xl tracking-tight text-[#1a1a1a]">
                    {active.id}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(active.id);
                    }}
                    aria-label={favorites.includes(active.id) ? "Remove from favorites" : "Add to favorites"}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a]/5 text-[#1a1a1a]/50 transition hover:bg-[#1a1a1a]/10 hover:text-[#1a1a1a]"
                  >
                    <Heart className="h-5 w-5" fill={favorites.includes(active.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                {active.description && (
                  <p className="mt-3 text-sm opacity-80">{active.description}</p>
                )}

                {/* Size & Material */}
                {(active.size || active.material) && (
                  <p className="mt-3 text-sm opacity-70">
                    {active.size && <><strong>Size:</strong> {active.size}</>}
                    {active.size && active.material && <br />}
                    {active.material && <><strong>Material:</strong> {active.material}</>}
                  </p>
                )}

                {/* Instagram */}
                <a
                  href={active.instagram_url || "https://www.instagram.com/impressions_wedding_cards"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center gap-2 text-sm opacity-60 transition hover:opacity-100"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  @impressions.in
                </a>

                {/* Calculator */}
                <div className="mt-6 rounded-2xl border border-[#1a1a1a]/15 bg-white p-5">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">Quantity</label>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => setModalQuantity((q) => Math.max(active.minOrder, q - 50))}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1a1a]/20 text-lg text-[#1a1a1a]"
                    >−</button>
                    <input
                      type="number"
                      value={modalQuantity}
                      min={active.minOrder}
                      max={1500}
                      step={50}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (Number.isFinite(v)) setModalQuantity(Math.min(1500, Math.max(active.minOrder, v)));
                      }}
                      className="w-24 rounded-md border border-[#1a1a1a]/20 px-3 py-2 text-center text-sm text-[#1a1a1a]"
                    />
                    <button
                      onClick={() => setModalQuantity((q) => Math.min(1500, q + 50))}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1a1a]/20 text-lg text-[#1a1a1a]"
                    >+</button>
                    <span className="text-xs opacity-60">pcs</span>
                  </div>
                  <input
                    type="range"
                    min={active.minOrder}
                    max={1500}
                    step={50}
                    value={modalQuantity}
                    onChange={(e) => setModalQuantity(Number(e.target.value))}
                    className="mt-4 w-full accent-[#1a1a1a]"
                  />
                  <p className="mt-1 text-xs opacity-50">
                    Min {active.minOrder} · Step 50 · Max 1500 &nbsp;·&nbsp; 5% off 500+ · 10% off 1000+
                  </p>

                  <div className="mt-5 space-y-1.5 text-sm">
                    <div className="flex items-baseline justify-between">
                      <span className="opacity-80">Card Cost · {qty} × ₹{active.price}</span>
                      <span>₹{cardCost.toLocaleString()}</span>
                    </div>

                    {active.extraCharges?.map((ch, i) => (
                      <div key={i} className="flex items-baseline justify-between">
                        <span className="opacity-80">{ch.name}</span>
                        <span>₹{ch.price.toLocaleString()}</span>
                      </div>
                    ))}
                    {active.extraCharges && active.extraCharges.length > 1 && (
                      <div className="flex items-baseline justify-between font-medium">
                        <span className="opacity-80">Total Extra Charges</span>
                        <span>₹{extraTotal.toLocaleString()}</span>
                      </div>
                    )}

                    {showPrinting && (
                      <div className="flex items-baseline justify-between">
                        <span className="opacity-80">Extra charge below 200</span>
                        {printingFee > 0 ? (
                          <span>₹600</span>
                        ) : (
                          <span className="text-green-700">
                            <span className="opacity-40 line-through">₹600</span> FREE
                          </span>
                        )}
                      </div>
                    )}

                    {discountPct > 0 && (
                      <div className="flex items-baseline justify-between text-[#1a3c2a]">
                        <span className="opacity-80">Volume discount ({discountPct}%)</span>
                        <span>−₹{discountAmt.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="mt-3 flex items-baseline justify-between border-t border-[#1a1a1a]/10 pt-3">
                      <span className="font-serif text-xl text-[#1a1a1a]">Total</span>
                      <span className="font-serif text-2xl text-[#1a1a1a]">₹{finalTotal.toLocaleString()}</span>
                    </div>
                    {totalSavings > 0 && (
                      <p className="text-xs text-[#1a3c2a]">You save ₹{totalSavings.toLocaleString()}</p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      [
                        `Hi Allure Cards! I'd like to order:`,
                        ``,
                        `• ${active.id} (${active.category || "Allure"} Collection)`,
                        `• Quantity: ${qty} pcs`,
                        `• Card Cost: ₹${cardCost.toLocaleString()}`,
                        ...(active.extraCharges?.map((ch) => `• ${ch.name}: ₹${ch.price}`) || []),
                        ...(showPrinting
                          ? printingFee > 0
                            ? [`• Extra charge below 200: ₹600`]
                            : [`• Extra charge below 200: FREE`]
                          : []),
                        ...(discountAmt > 0
                          ? [`• Volume discount (${discountPct}%): −₹${discountAmt.toLocaleString()}`]
                          : []),
                        `• Total: ₹${finalTotal.toLocaleString()}`,
                        ...(totalSavings > 0 ? [`• You save: ₹${totalSavings.toLocaleString()}`] : []),
                        ``,
                        `Link: ${shareUrl}`,
                      ].join("\n")
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full bg-[#1a3c2a] px-6 py-3 text-center text-sm font-semibold text-[#f5f0e6] hover:bg-[#2d5a3d]"
                  >
                    Order on WhatsApp
                  </a>
                  <button
                    onClick={copyLink}
                    className="flex-1 rounded-full border border-[#1a1a1a] px-6 py-3 text-sm font-semibold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f5f0e6]"
                  >
                    {shareCopied ? "Link copied ✓" : "Copy product link"}
                  </button>
                </div>
                <p className="mt-4 break-all text-xs opacity-60">{shareUrl}</p>


              </div>
            </div>
          </div>

          {/* Gallery lightbox */}
          {galleryOpen && (
            <div
              onClick={() => setGalleryOpen(false)}
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4"
            >
              <button
                onClick={(e) => { e.stopPropagation(); setGalleryOpen(false); }}
                className="absolute right-6 top-6 rounded-full bg-white/10 px-4 py-2 text-sm text-white"
              >
                Close ✕
              </button>
              <img
                src={imgUrl(active.images[galleryIndex])}
                alt={active.id}
                className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain"
              />
              {active.images.length > 1 && (
                <div className="absolute bottom-8 flex gap-2">
                  {active.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setGalleryIndex(i); }}
                      className={`h-2 w-8 rounded-full ${galleryIndex === i ? "bg-white" : "bg-white/30"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      {
        title: "Shop Wedding Cards",
        description: "Browse our curated collection of wedding invitation cards by Impressions.",
      },
    ],
  }),
  component: ShopPage,
});
