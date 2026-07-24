import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { Search, Heart, ShoppingBag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShareSheet } from "@/components/share-sheet";
import { cn } from "@/lib/utils";
import invitations from "@/assets/invitations.jpg";
import type { Catalog } from "@/lib/catalog";
import cardsData from "@/data/cards.json";

const thumbnailImages = import.meta.glob(
  "@/assets/cards/thumbnails/*.{[jJ][pP][gG],[jJ][pP][eE][gG],[pP][nN][gG]}",
  {
    eager: true,
    query: { url: true },
    import: "default",
  },
) as Record<string, string>;

const displayImages = import.meta.glob(
  "@/assets/cards/display/*.{[jJ][pP][gG],[jJ][pP][eE][gG],[pP][nN][gG]}",
  {
    eager: true,
    query: { url: true },
    import: "default",
  },
) as Record<string, string>;

const thumbnailImageMap = Object.fromEntries(
  Object.entries(thumbnailImages).map(([key, url]) => [key.split("/").pop()!, url]),
);

const displayImageMap = Object.fromEntries(
  Object.entries(displayImages).map(([key, url]) => [key.split("/").pop()!, url]),
);

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' fill='%23f0ece4'%3E%3Crect width='400' height='500'/%3E%3Ctext x='200' y='250' text-anchor='middle' fill='%2390857a' font-size='14' font-family='sans-serif'%3EImage not available%3C/text%3E%3C/svg%3E";

function imgUrl(filepath: string): string {
  const filename = filepath.split("/").pop() || filepath;
  return thumbnailImageMap[filename] || FALLBACK_IMAGE;
}

function displayUrl(filepath: string): string {
  const filename = filepath.split("/").pop() || filepath;
  return displayImageMap[filename] || FALLBACK_IMAGE;
}

const PAGE_SIZE = 11;
const WHATSAPP_NUMBER = "919526577999";

const shopSearchSchema = z.object({
  category: z.string().optional(),
});

const ShopCard = memo(function ShopCard({
  c,
  onSelect,
  onToggleFavorite,
  isFavorite,
}: {
  c: Catalog;
  onSelect: (c: Catalog) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}) {
  return (
    <article
      onClick={() => onSelect(c)}
      className="group cursor-pointer rounded-lg overflow-hidden flex flex-col bg-white border border-[#f0f0f0] p-3"
    >
      <div className="relative w-full overflow-hidden bg-white mb-[18px] aspect-[4/3]">
        {c.images.length > 0 && (
          <img
            src={imgUrl(c.images[0])}
            alt={c.id}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(c.id);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-200"
        >
          <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-zola-ink">{c.id}</h3>
          {c.featured && (
            <span className="rounded-sm bg-[#e8d9b0] px-2 py-0.5 text-xs text-[#5a4a1a] whitespace-nowrap">
              Featured
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-zola-ink/60">
          {c.category === "ODAMBADY"
            ? `₹${(c.price * 2).toFixed(2)} / pair`
            : `₹${c.price.toFixed(2)} each`}
        </p>
        {c.description && (
          <p className="mt-1.5 line-clamp-1 text-sm text-zola-ink/50">{c.description}</p>
        )}
      </div>
    </article>
  );
});

function ShopPage() {
  const navigate = Route.useNavigate();
  const { category: urlCategory } = Route.useSearch();

  const [items, setItems] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = useMemo(() => {
    const cats = new Set(items.map((c) => c.category));
    return ["All", ...Array.from(cats)];
  }, [items]);

  const circles = useMemo(() => {
    const allImg = invitations;
    const result = [{ label: "All Cards", cat: "All", image: allImg }];
    for (const cat of categories) {
      if (cat === "All") continue;
      const first = items.find((c) => c.category === cat);
      result.push({
        label: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
        cat,
        image: first?.images[0] ?? allImg,
      });
    }
    return result;
  }, [categories, items]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(() => {
    const data = Array.isArray(cardsData) ? (cardsData as Catalog[]) : [];
    const cats: string[] = [];
    for (const c of data) {
      if (!cats.includes(c.category)) cats.push(c.category);
    }
    if (urlCategory && cats.includes(urlCategory)) return urlCategory;
    return "All";
  });

  const prevUrlCategory = useRef(urlCategory);
  useEffect(() => {
    if (urlCategory !== prevUrlCategory.current) {
      prevUrlCategory.current = urlCategory;
      const data = Array.isArray(cardsData) ? (cardsData as Catalog[]) : [];
      const cats: string[] = [];
      for (const c of data) {
        if (!cats.includes(c.category)) cats.push(c.category);
      }
      const next = urlCategory && cats.includes(urlCategory) ? urlCategory : "All";
      setCategory(next);
      setVisible(PAGE_SIZE);
      setActive(null);
    }
  }, [urlCategory]);

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
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollPosRef = useRef(0);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (active && !isClosingRef.current) {
      scrollPosRef.current = window.scrollY;
      const raf = requestAnimationFrame(() => setModalMounted(true));
      return () => cancelAnimationFrame(raf);
    }
    if (!active) isClosingRef.current = false;
    setModalMounted(false);
  }, [active]);

  const closeModal = useCallback(() => {
    isClosingRef.current = true;
    setModalMounted(false);
    closeTimerRef.current = setTimeout(() => {
      setActive(null);
      window.scrollTo(0, scrollPosRef.current);
    }, 200);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#card=")) {
      const cardId = decodeURIComponent(hash.replace("#card=", ""));
      const found = Array.isArray(cardsData)
        ? (cardsData as Catalog[]).find((c) => c.id === cardId)
        : undefined;
      if (found) {
        const t = setTimeout(() => setActive(found), 300);
        return () => clearTimeout(t);
      }
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]));
  };

  const toggleFavFilter = () => {
    setShowFavorites((prev) => !prev);
    setVisible(PAGE_SIZE);
  };

  const [modalQuantity, setModalQuantity] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  useEffect(() => {
    if (active) {
      setModalQuantity(active.category === "ODAMBADY" ? 2 : active.minOrder);
      setSelectedVariantIdx(0);
    }
  }, [active?.id]);

  const searchRef = useRef<HTMLInputElement>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (active) {
      setSelectedImageIndex(0);
      setGalleryIndex(0);
      setGalleryOpen(false);
    }
  }, [active?.id]);

  useEffect(() => {
    if (active) {
      window.history.replaceState(null, "", `#card=${encodeURIComponent(active.id)}`);
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

  const isOdambadi = active?.category === "ODAMBADY";
  const activeVar = useMemo(
    () => active?.variants?.[selectedVariantIdx],
    [active, selectedVariantIdx],
  );
  const cardCost = useMemo(
    () => (active ? modalQuantity * (activeVar?.price ?? active.price) : 0),
    [active, activeVar, modalQuantity],
  );
  const minChargeExtra = useMemo(
    () =>
      active && active.minOrder < 200 && modalQuantity < 200
        ? { name: "Extra charge below 200", price: 600 }
        : null,
    [active?.minOrder, modalQuantity],
  );
  const extraTotal = useMemo(
    () =>
      (active?.extraCharges?.reduce((sum, ch) => sum + ch.price, 0) || 0) +
      (minChargeExtra?.price ?? 0),
    [active?.extraCharges, minChargeExtra?.price],
  );
  const discountPct = useMemo(() => {
    if (modalQuantity >= 1000) return 10;
    if (modalQuantity >= 500) return 5;
    return 0;
  }, [modalQuantity]);
  const discountAmt = useMemo(
    () => Math.round((cardCost * discountPct) / 100),
    [cardCost, discountPct],
  );
  const finalTotal = useMemo(
    () => Math.round(cardCost * (1 - discountPct / 100)) + extraTotal,
    [cardCost, discountPct, extraTotal],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setItems(Array.isArray(cardsData) ? (cardsData as Catalog[]) : []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  const setCategoryAndReset = (c: string) => {
    setCategory(c);
    setVisible(PAGE_SIZE);
    setActive(null);
    navigate({ search: { category: c === "All" ? undefined : c }, replace: true });
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let result = items;
    if (category !== "All") {
      result = result.filter((c) => c.category === category);
    }
    if (q) {
      result = result.filter((c) => {
        const searchable = [
          c.id,
          c.description,
          c.category,
          c.size,
          c.material,
          ...(c.variants?.flatMap((v) => [v.name, v.size, v.material]) ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(q);
      });
    }
    if (showFavorites) {
      result = result.filter((c) => favorites.includes(c.id));
    }
    if (sort === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (category === "All") {
      const sorted = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      const featured = sorted.filter((c) => c.featured);
      const notFeatured = sorted.filter((c) => !c.featured);
      result = [...featured, ...notFeatured];
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
            <a
              href="https://www.allurecards.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80"
            >
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
            <button className="flex items-center gap-1 hover:opacity-70">Shop</button>
            <Link to="/customize" className="flex items-center gap-1 hover:opacity-70">
              Customize
            </Link>
            <Link to="/" className="hover:opacity-70">
              Home
            </Link>
          </nav>
          <Link
            to="/"
            className="font-serif text-3xl max-md:text-xl max-md:tracking-[0.08em] tracking-[0.2em] font-medium text-zola-ink"
          >
            IMPRESSIONS
          </Link>
          <div className="flex items-center gap-4 max-md:gap-1">
            <button
              onClick={() => searchRef.current?.focus()}
              className="p-2 hover:opacity-70 active:scale-[0.97]"
              aria-label="Search"
            >
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
            <Link
              to="/customize"
              className="max-sm:hidden rounded-full bg-zola-ink px-5 py-2.5 text-sm font-semibold text-zola-cream transition-transform duration-150 active:scale-[0.97]"
            >
              Design your own
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-6 pt-6 text-sm text-zola-ink/70">
        <Link to="/" className="hover:underline">
          Impressions
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zola-ink">Wedding cards</span>
      </div>

      {/* Page title */}
      <section className="mx-auto max-w-[1400px] px-6 pt-10">
        <h1 className="font-serif text-4xl tracking-tight text-zola-ink">
          Wedding invitation cards
        </h1>
        <p className="mt-2 text-zola-ink/70">Handcrafted designs for your special day.</p>
      </section>

      {/* Category circles */}
      <section className="mx-auto max-w-[1400px] px-6 pb-10 pt-8">
        <div className="flex items-center justify-center gap-10 max-md:justify-start max-md:overflow-x-auto max-md:gap-3 max-md:px-4 max-md:snap-x max-md:[scrollbar-width:none]">
          {circles.map((c) => (
            <button
              key={c.cat}
              onClick={() => setCategoryAndReset(c.cat)}
              className="flex flex-col items-center gap-2 group active:scale-[0.95] max-md:snap-start max-md:shrink-0"
            >
              <div
                className={`h-20 w-20 overflow-hidden rounded-full ring-1 transition-all duration-200 group-hover:ring-2 group-hover:ring-zola-ink ${
                  category === c.cat ? "ring-2 ring-zola-ink" : "ring-zola-ink/15"
                }`}
              >
                <img
                  src={
                    c.image.startsWith("http") || c.image.startsWith("/")
                      ? c.image
                      : imgUrl(c.image)
                  }
                  alt={c.label}
                  className="h-full w-full object-cover"
                />
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
          <button
            onClick={() => {
              setSort("featured");
              setVisible(PAGE_SIZE);
            }}
            className={`rounded-full border px-4 py-2 text-sm transition active:scale-[0.97] ${
              sort === "featured"
                ? "border-zola-ink bg-zola-ink text-zola-cream"
                : "border-zola-ink/20 bg-zola-cream text-zola-ink hover:border-zola-ink"
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => {
              setSort("price-asc");
              setVisible(PAGE_SIZE);
            }}
            className={`rounded-full border px-4 py-2 text-sm transition active:scale-[0.97] ${
              sort === "price-asc"
                ? "border-zola-ink bg-zola-ink text-zola-cream"
                : "border-zola-ink/20 bg-zola-cream text-zola-ink hover:border-zola-ink"
            }`}
          >
            Low to High
          </button>
          <button
            onClick={() => {
              setSort("price-desc");
              setVisible(PAGE_SIZE);
            }}
            className={`rounded-full border px-4 py-2 text-sm transition active:scale-[0.97] ${
              sort === "price-desc"
                ? "border-zola-ink bg-zola-ink text-zola-cream"
                : "border-zola-ink/20 bg-zola-cream text-zola-ink hover:border-zola-ink"
            }`}
          >
            High to Low
          </button>

          <div className="flex items-center gap-1.5 rounded-full border border-zola-ink/20 px-4 py-2 text-sm transition-colors hover:border-zola-ink focus-within:ring-2 focus-within:ring-zola-ink/20">
            <Search className="h-3.5 w-3.5" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search…"
              aria-label="Search cards"
              className="w-24 bg-transparent outline-none placeholder:text-zola-ink/40"
            />
          </div>
          <button
            onClick={toggleFavFilter}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition active:scale-[0.97] ${
              showFavorites
                ? "border-red-500 bg-red-500 text-white"
                : "border-red-500/30 text-red-600 hover:border-red-500"
            }`}
          >
            <Heart className="h-3.5 w-3.5" fill={showFavorites ? "currentColor" : "none"} />
            Favorites ({favorites.length})
          </button>
        </div>
      </section>

      {/* Product grid */}
      <section className="mx-auto max-w-[1600px] px-7 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zola-ink border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 items-start">
              {page.slice(0, 2).map((c, i) => (
                <ShopCard
                  key={c.id + "-" + i}
                  c={c}
                  onSelect={setActive}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(c.id)}
                />
              ))}
              <a
                key="ad-allure"
                href="https://www.allurecards.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative rounded-sm overflow-hidden text-white p-3"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <img
                  src={invitations}
                  alt="Allure Cards premium wedding stationery"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
                />
                <div className="relative z-10 flex flex-col justify-between aspect-[4/3] p-8">
                  <div>
                    <div className="text-xs uppercase tracking-widest font-semibold opacity-90">
                      Sponsored
                    </div>
                    <h3 className="font-serif text-4xl leading-tight font-medium mt-3">
                      <em className="not-italic">Allure</em> Cards
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed max-w-[240px]">
                      <span className="font-semibold">Premium</span> foil,{" "}
                      <span className="font-semibold">letterpress</span>, and{" "}
                      <span className="font-semibold">luxury</span> paper. Elevate your invitation
                      suite.
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 bg-white text-neutral-900 text-sm font-semibold px-4 py-2 rounded-full">
                      Shop Allure Cards &rarr;
                    </span>
                  </div>
                </div>
              </a>
              {page.slice(2).map((c, i) => (
                <ShopCard
                  key={c.id + "-" + (i + 2)}
                  c={c}
                  onSelect={setActive}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(c.id)}
                />
              ))}
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
              <li>
                <Link to="/shop" className="hover:opacity-60">
                  All cards
                </Link>
              </li>
              <li>
                <Link to="/customize" className="hover:opacity-60">
                  Customize
                </Link>
              </li>
              <li>
                <Link to="/customize" className="hover:opacity-60">
                  Design your own
                </Link>
              </li>
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
        <>
          <div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0d0d0d]/70 backdrop-blur-sm md:items-center"
            onClick={closeModal}
            style={{
              opacity: modalMounted ? 1 : 0,
              transition: "opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            <div
              className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-[#f5f0e6] text-[#1a1a1a] md:max-w-5xl md:rounded-3xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                opacity: modalMounted ? 1 : 0,
                transform: `scale(${modalMounted ? 1 : 0.95}) translateY(${modalMounted ? 0 : 8}px)`,
                transition:
                  "opacity 250ms cubic-bezier(0.23, 1, 0.32, 1), transform 250ms cubic-bezier(0.23, 1, 0.32, 1)",
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
                    onClick={() => {
                      setGalleryIndex(selectedImageIndex);
                      setGalleryOpen(true);
                    }}
                    className="block w-full overflow-hidden rounded-2xl bg-[#eee6d5] p-6"
                    aria-label="Open full screen"
                  >
                    <div className="relative flex items-center justify-center">
                      {active.images.length > 0 && (
                        <img
                          src={displayUrl(active.images[selectedImageIndex])}
                          alt={active.id}
                          className="h-full w-full object-contain transition-transform duration-200"
                          style={{ aspectRatio: "4 / 3" }}
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
                          key={src}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`overflow-hidden rounded-lg border-2 ${
                            idx === selectedImageIndex ? "border-[#1a1a1a]" : "border-transparent"
                          }`}
                        >
                          <img
                            src={imgUrl(src)}
                            alt=""
                            className="aspect-[4/3] w-full object-cover"
                          />
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
                    <div>
                      <h2 className="font-serif text-4xl tracking-tight text-[#1a1a1a]">
                        {active.id}
                      </h2>
                      <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a]/10 bg-[#1a1a1a]/5 px-3 py-0.5 text-xs font-medium text-[#1a1a1a]/70">
                        ₹
                        {isOdambadi
                          ? (activeVar?.price ?? active.price) * 2
                          : (activeVar?.price ?? active.price)}{" "}
                        {isOdambadi ? "/ pair" : "/ card"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(active.id);
                      }}
                      aria-label={
                        favorites.includes(active.id) ? "Remove from favorites" : "Add to favorites"
                      }
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a]/5 text-[#1a1a1a]/50 transition hover:bg-[#1a1a1a]/10 hover:text-[#1a1a1a]"
                    >
                      <Heart
                        className="h-5 w-5"
                        fill={favorites.includes(active.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  {active.description && (
                    <p className="mt-3 text-sm opacity-80">{active.description}</p>
                  )}

                  {/* Size & Material */}
                  {((activeVar?.size ?? active.size) ||
                    (activeVar?.material ?? active.material)) && (
                    <p className="mt-3 text-sm opacity-70">
                      {(activeVar?.size ?? active.size) && (
                        <>
                          <strong>Size:</strong> {activeVar?.size ?? active.size}
                        </>
                      )}
                      {(activeVar?.size ?? active.size) &&
                        (activeVar?.material ?? active.material) && <br />}
                      {(activeVar?.material ?? active.material) && (
                        <>
                          <strong>Material:</strong> {activeVar?.material ?? active.material}
                        </>
                      )}
                    </p>
                  )}

                  {/* Variant selector */}
                  {active.variants && active.variants.length > 1 && (
                    <div className="mt-4">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
                        Variant
                      </label>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        {active.variants.map((v, i) => {
                          const isSelected = i === selectedVariantIdx;
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedVariantIdx(i)}
                              className={cn(
                                "group relative rounded-xl border-2 p-3.5 text-left transition-all duration-200 ease-out active:scale-[0.97]",
                                isSelected
                                  ? "border-[#1a1a1a] bg-[#1a1a1a]/5"
                                  : "border-[#1a1a1a]/10 bg-white hover:border-[#1a1a1a]/30",
                              )}
                            >
                              <p className="text-sm font-medium text-[#1a1a1a]">
                                {v.name || v.size}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-[#1a1a1a]">
                                ₹{isOdambadi ? v.price * 2 : v.price}/{isOdambadi ? "pair" : "card"}
                              </p>
                              {isSelected && (
                                <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1a1a1a] text-[10px] text-white">
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Instagram */}
                  {(() => {
                    const instaHref =
                      active.instagram_url || "https://www.instagram.com/impressions_wedding_cards";
                    const label = active.instagram_url
                      ? "Watch on Instagram"
                      : "Follow @impressions_wedding_cards";
                    return (
                      <a
                        href={instaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 group inline-flex items-center gap-2.5 rounded-full border border-[#1a1a1a]/15 px-4 py-2 text-sm font-medium text-[#1a1a1a]/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)] transition-colors duration-200 ease-out hover:border-[#1a1a1a] hover:bg-gradient-to-r hover:from-[#1a1a1a] hover:to-[#2a2a2a] hover:text-[#f5f0e6] active:scale-[0.97]"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 shrink-0 transition-transform duration-200 ease-out group-hover:scale-110"
                          fill="currentColor"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        {label}
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 17l9.2-9.2M17 17V7H7" />
                        </svg>
                      </a>
                    );
                  })()}

                  {/* Price / Calculator */}
                  {isOdambadi ? (
                    <div className="mt-6 rounded-2xl border border-[#1a1a1a]/15 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
                          Price
                        </span>
                        <span className="font-serif text-2xl text-[#1a1a1a]">
                          ₹{((activeVar?.price ?? active.price) * 2).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs opacity-60">1 pair · 2 cards</p>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-[#1a1a1a]/15 bg-white p-5">
                      <label
                        htmlFor="modal-qty"
                        className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70"
                      >
                        Quantity
                      </label>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => setModalQuantity((q) => Math.max(active.minOrder, q - 50))}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1a1a]/20 text-lg text-[#1a1a1a] active:scale-[0.95]"
                        >
                          −
                        </button>
                        <input
                          id="modal-qty"
                          type="number"
                          value={modalQuantity}
                          inputMode="numeric"
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (Number.isFinite(v)) {
                              const snapped = Math.round(v / 50) * 50;
                              setModalQuantity(Math.max(active.minOrder, Math.min(2000, snapped)));
                            }
                          }}
                          className="w-24 rounded-md border border-[#1a1a1a]/20 px-3 py-2 text-center text-sm text-[#1a1a1a]"
                        />
                        <button
                          onClick={() => setModalQuantity((q) => Math.min(2000, q + 50))}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1a1a]/20 text-lg text-[#1a1a1a] active:scale-[0.95]"
                        >
                          +
                        </button>
                        <span className="text-xs opacity-60">pcs</span>
                      </div>
                      <input
                        type="range"
                        min={active.minOrder}
                        max={2000}
                        step={50}
                        value={modalQuantity}
                        onChange={(e) => setModalQuantity(Number(e.target.value))}
                        aria-label="Select quantity"
                        className="mt-4 w-full accent-[#1a1a1a]"
                      />
                      <p className="mt-1 text-xs opacity-50">5% off 500+ · 10% off 1000+</p>

                      <div className="mt-5 space-y-1.5 text-sm">
                        <div className="flex items-baseline justify-between">
                          <span className="opacity-80">
                            Card Cost · {modalQuantity} × ₹{activeVar?.price ?? active.price}
                          </span>
                          <span>₹{cardCost.toLocaleString()}</span>
                        </div>

                        {active.extraCharges?.map((ch) => (
                          <div key={ch.name} className="flex items-baseline justify-between">
                            <span className="opacity-80">{ch.name}</span>
                            <span>₹{ch.price.toLocaleString()}</span>
                          </div>
                        ))}
                        {minChargeExtra && (
                          <div
                            key={minChargeExtra.name}
                            className="flex items-baseline justify-between"
                          >
                            <span className="opacity-80">{minChargeExtra.name}</span>
                            <span>₹{minChargeExtra.price.toLocaleString()}</span>
                          </div>
                        )}
                        {(active.extraCharges?.length ?? 0) + (minChargeExtra ? 1 : 0) >= 2 && (
                          <div className="flex items-baseline justify-between font-medium">
                            <span className="opacity-80">Total Extra Charges</span>
                            <span>₹{extraTotal.toLocaleString()}</span>
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
                          <span className="font-serif text-2xl text-[#1a1a1a]">
                            ₹{finalTotal.toLocaleString()}
                          </span>
                        </div>
                        {discountAmt > 0 && (
                          <p className="text-xs text-[#1a3c2a]">
                            You save ₹{discountAmt.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        isOdambadi
                          ? [
                              `Hi Impressions! I'd like to order:`,
                              ``,
                              `• ${active.id} (${active.category || "Allure"} Collection)`,
                              `• 1 pair (2 cards)`,
                              `• Price: ₹${((activeVar?.price ?? active.price) * 2).toLocaleString()}`,
                              `• Total: ₹${((activeVar?.price ?? active.price) * 2).toLocaleString()}`,
                            ].join("\n")
                          : [
                              `Hi Impressions! I'd like to order:`,
                              ``,
                              `• ${active.id}${activeVar?.name ? ` - ${activeVar.name}` : ""} (${active.category || "Allure"} Collection)`,
                              `• Quantity: ${modalQuantity} pcs`,
                              `• Card Cost: ₹${cardCost.toLocaleString()}`,
                              ...(active.extraCharges?.map((ch) => `• ${ch.name}: ₹${ch.price}`) ||
                                []),
                              ...(minChargeExtra
                                ? [`• ${minChargeExtra.name}: ₹${minChargeExtra.price}`]
                                : []),
                              ...(discountAmt > 0
                                ? [
                                    `• Volume discount (${discountPct}%): −₹${discountAmt.toLocaleString()}`,
                                  ]
                                : []),
                              `• Total: ₹${finalTotal.toLocaleString()}`,
                              ...(discountAmt > 0
                                ? [`• You save: ₹${discountAmt.toLocaleString()}`]
                                : []),
                            ].join("\n"),
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-full bg-[#1a1a1a] px-6 py-3 text-center text-sm font-semibold text-[#efe0b8] transition-colors duration-200 ease-out hover:bg-[#2a2a2a] active:scale-[0.97]"
                    >
                      Order on WhatsApp
                    </a>
                    <button
                      onClick={() => setShareOpen(true)}
                      className="flex-1 rounded-full border border-[#1a1a1a] px-6 py-3 text-sm font-semibold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f5f0e6] active:scale-[0.97]"
                    >
                      Share Card
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <ShareSheet
              open={shareOpen}
              onOpenChange={setShareOpen}
              productUrl={`${window.location.origin}/shop#card=${encodeURIComponent(active?.id ?? "")}`}
              productTitle={active?.id ?? ""}
            />
          </div>

          {/* Gallery lightbox */}
          {galleryOpen && (
            <div
              onClick={() => setGalleryOpen(false)}
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryOpen(false);
                }}
                className="absolute right-6 top-6 rounded-full bg-white/10 px-4 py-2 text-sm text-white"
              >
                Close ✕
              </button>
              <img
                src={displayUrl(active.images[galleryIndex])}
                alt={active.id}
                className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain"
              />
              {active.images.length > 1 && (
                <div className="absolute bottom-8 flex gap-2">
                  {active.images.map((src, i) => (
                    <button
                      key={src}
                      onClick={(e) => {
                        e.stopPropagation();
                        setGalleryIndex(i);
                      }}
                      className={`h-2 w-8 rounded-full ${galleryIndex === i ? "bg-white" : "bg-white/30"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

export const Route = createFileRoute("/shop")({
  validateSearch: shopSearchSchema,
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
