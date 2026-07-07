import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Heart, ChevronDown, ShoppingBag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import invitations from "@/assets/invitations.jpg";
import heroVenue from "@/assets/hero-venue.jpg";
import { DATA_URL, IMAGE_BASE, type Catalog } from "@/lib/catalog";

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

  function getQuantityOptions(minOrder: number): number[] {
    const presets = [25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500];
    const idx = presets.findIndex((v) => v >= minOrder);
    return idx === -1 ? [minOrder] : presets.slice(idx);
  }

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(DATA_URL)
        .then((r) => r.json())
        .then((data: Catalog[]) => {
          setItems(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
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
              {page.map((c, idx) => (
                idx === 3 ? (
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
                ) : (
                  <article
                    key={c.id}
                    onClick={() => setActive(c)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#f7f5f0]">
                      {c.images.length > 0 && (
                        <img
                          src={IMAGE_BASE + c.images[0]}
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
                )
              ))}
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
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeModal}
          style={{
            opacity: modalMounted ? 1 : 0,
            backgroundColor: modalMounted ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)',
            backdropFilter: modalMounted ? 'blur(4px)' : 'blur(0px)',
            WebkitBackdropFilter: modalMounted ? 'blur(4px)' : 'blur(0px)',
            transition: 'opacity 200ms cubic-bezier(0.23, 1, 0.32, 1), background-color 200ms cubic-bezier(0.23, 1, 0.32, 1), backdrop-filter 200ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          <div
            className="relative mx-4 max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-zola-cream shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              opacity: modalMounted ? 1 : 0,
              transform: `scale(${modalMounted ? 1 : 0.95}) translateY(${modalMounted ? 0 : 8}px)`,
              transition: 'opacity 250ms cubic-bezier(0.23, 1, 0.32, 1), transform 250ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-zola-ink/50 backdrop-blur transition duration-150 ease-out hover:bg-white hover:text-zola-ink active:scale-[0.92]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="2" y1="2" x2="12" y2="12" />
                <line x1="12" y1="2" x2="2" y2="12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none bg-[#f7f5f0]">
                {active.images.length > 0 && (
                  <img
                    src={IMAGE_BASE + active.images[0]}
                    alt={active.id}
                    className="h-full w-full object-cover"
                    style={{ aspectRatio: '4 / 5' }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col p-6 md:p-8 md:pl-7">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif text-xl tracking-tight text-zola-ink md:text-2xl">
                    {active.id}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(active.id);
                    }}
                    aria-label={favorites.includes(active.id) ? "Remove from favorites" : "Add to favorites"}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zola-ink/5 text-zola-ink/50 transition duration-150 ease-out hover:bg-zola-ink/10 hover:text-zola-ink active:scale-[0.92]"
                  >
                    <Heart className="h-4 w-4" fill={favorites.includes(active.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                {active.description && (
                  <p className="mt-2 text-sm leading-relaxed text-zola-ink/60">
                    {active.description}
                  </p>
                )}

                {/* Options */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zola-ink">Size</span>
                    <Select value={modalSize} onValueChange={setModalSize}>
                      <SelectTrigger className="h-8 w-28 gap-1 rounded-lg border-zola-ink/15 bg-zola-ink/5 px-3 text-xs text-zola-ink shadow-none transition duration-150 ease-out hover:border-zola-ink/30 focus:border-zola-ink/30 focus:ring-1 focus:ring-zola-ink/10 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-zola-ink/30 [&>svg]:opacity-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="min-w-[7rem] rounded-xl border-zola-ink/10 bg-zola-cream shadow-lg">
                        <SelectItem value={active.size} className="cursor-pointer rounded-lg text-xs focus:bg-zola-ink/5 focus:text-zola-ink">
                          {active.size}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zola-ink">Quantity</span>
                    <Select value={String(modalQuantity)} onValueChange={(v) => setModalQuantity(Number(v))}>
                      <SelectTrigger className="h-8 w-28 gap-1 rounded-lg border-zola-ink/15 bg-zola-ink/5 px-3 text-xs text-zola-ink shadow-none transition duration-150 ease-out hover:border-zola-ink/30 focus:border-zola-ink/30 focus:ring-1 focus:ring-zola-ink/10 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-zola-ink/30 [&>svg]:opacity-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="min-w-[7rem] rounded-xl border-zola-ink/10 bg-zola-cream shadow-lg">
                        {getQuantityOptions(active.minOrder).map((q) => (
                          <SelectItem key={q} value={String(q)} className="cursor-pointer rounded-lg text-xs focus:bg-zola-ink/5 focus:text-zola-ink">
                            {q} pieces
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {active.material && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zola-ink">Material</span>
                      <span className="rounded-md bg-zola-ink/5 px-2.5 py-1 text-xs text-zola-ink/70">
                        {active.material}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="mt-auto space-y-3 pt-6">
                  <div className="rounded-xl bg-zola-ink/[0.03] px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zola-ink/50">₹{active.price.toFixed(2)} × {modalQuantity}</span>
                      <span className="font-medium text-zola-ink">₹{(active.price * modalQuantity).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center justify-center gap-2.5 rounded-xl bg-zola-ink px-5 py-3 text-sm font-semibold text-zola-cream transition duration-150 ease-out active:scale-[0.97] hover:opacity-90"
                    >
                      <ShoppingBag className="h-4 w-4" /> Order on WhatsApp
                    </a>
                    <Link
                      to="/customize"
                      className="flex items-center justify-center gap-2 rounded-xl border border-zola-ink/15 px-5 py-3 text-sm font-medium text-zola-ink transition duration-150 ease-out active:scale-[0.97] hover:border-zola-ink/30"
                    >
                      Customize this card
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
