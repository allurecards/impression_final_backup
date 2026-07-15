import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import invitations from "@/assets/invitations.jpg";
import logo from "@/assets/IMP_LOGO_final.png";
import weddingCard from "@/assets/wedding-card.jpg";
import heritageImg from "@/assets/bento/heritage.jpeg";
import minimalImg from "@/assets/bento/minimal.jpeg";
import floralImg from "@/assets/bento/floral.jpeg";
import allureImg from "@/assets/bento/allure.jpeg";
import customiseImg from "@/assets/bento/customise.jpeg";
import redCard from "@/assets/red.jpeg";
import greenCard from "@/assets/green.png";
import {
  DoodleHeritage,
  DoodleMinimal,
  DoodleFloral,
  DoodleModern,
  DoodleAllure,
  DoodleCustomize,
} from "@/components/doodle-icons";

const instaVideo1 = "https://www.instagram.com/p/DZu0rDAy0-m/embed/";

type Section = {
  id: string;
  bg: string;
  card: string;
  body: string;
  accent: string;
  eyebrow: string;
  title: ReactNode;
  copy: string;
  primary: string;
  /** internal route for the primary button */
  to?: string;
  /** external link for the primary button — takes priority over `to` */
  href?: string;
  image: string;
  imageAlt: string;
  video?: boolean;
};

// Story after the bento grid: Allure (aspirational, external) → Customise (product) → Impressions (about us + Instagram)
const sections: Section[] = [
  {
    id: "allure",
    bg: "#8a1538",
    card: "#e6d4f0",
    body: "#f0dcf5",
    accent: "#1a1a1a",
    eyebrow: "Introducing Allure",
    title: (
      <>
        A separate,
        <br />
        <em className="not-italic">more luxurious world</em>
      </>
    ),
    copy: "Allure is our premium sub-brand, built for couples who want their invitation suite to feel like a keepsake from the very first touch — richer papers, elevated foiling, and a more considered presentation throughout. It lives on its own address, designed entirely around that feeling.",
    primary: "Visit Allure Cards",
    href: "https://www.allurecards.in",
    image: redCard,
    imageAlt: "Premium gold foil wedding invitation from Allure Cards",
  },
  {
    id: "customise",
    bg: "#2d3f2f",
    card: "#efe7d6",
    body: "#f5edd9",
    accent: "#efe7d6",
    eyebrow: "Design It Yourself",
    title: (
      <>
        Your names,
        <br />
        <em className="not-italic">your invitation</em>
      </>
    ),
    copy: "Pick a design you love, add your names, dates, and wording, and watch it update in real time. Once it looks right, send the final version straight to our team for printing — no back-and-forth, no guesswork.",
    primary: "Start Customising",
    to: "/customize",
    image: greenCard,
    imageAlt: "Live preview of a customised wedding invitation on screen",
  },
  {
    id: "impressions-story",
    bg: "#5a4a42",
    card: "#f7efe5",
    body: "#f5ecd7",
    accent: "#f7efe5",
    eyebrow: "About Impressions",
    title: (
      <>
        Four collections,
        <br />
        <em className="not-italic">one standard</em>
      </>
    ),
    copy: "Every Impressions design starts as one of four collections — Heritage, Minimal, Floral, or Modern — art-directed in-house, then personalised with your details before we print on premium cardstock and finish with foil or texture. Follow along on Instagram to see new collections and real weddings as they happen.",
    primary: "Follow @impressions_wedding_cards",
    href: "https://www.instagram.com/impressions_wedding_cards/",
    image: instaVideo1,
    imageAlt: "Instagram reel showing an Impressions wedding invitation collection",
    video: true,
  },
];

/**
 * Shared content block: the bento grid + the scrolling story sections + footer.
 * Used by both the "/" (Landing) route and the "/explore" route.
 * Neither route file imports the other — they both import this instead.
 */
export function ExploreSections() {
  const [activeBg, setActiveBg] = useState(sections[0].bg);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sectionRefCallback = useCallback((el: HTMLElement | null) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = Number((entry.target as HTMLElement).dataset.idx);
              setActiveBg(sections[idx].bg);
            }
          });
        },
        { threshold: 0.55 },
      );
    }
    if (el) {
      observerRef.current.observe(el);
    }
  }, []);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-700 ease-out"
      style={{ backgroundColor: activeBg }}
    >

      <main>
        <BentoSection />

        {sections.map((s, i) => (
          <section
            key={s.id}
            ref={sectionRefCallback}
            data-idx={i}
            className="relative flex min-h-screen items-center px-6 py-24 md:px-16 lg:px-24"
            style={{ color: s.accent }}
          >
            <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="order-2 lg:order-1">
                <div
                  className="overflow-hidden rounded-[28px] shadow-2xl"
                  style={{ backgroundColor: s.card }}
                >
                  {s.video ? (
                    <iframe
                      src={s.image}
                      className="aspect-[4/5] h-full w-full"
                      allowFullScreen
                      title={s.imageAlt}
                    />
                  ) : (
                    <img
                      src={s.image}
                      alt={s.imageAlt}
                      width={1024}
                      height={1280}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="aspect-[4/5] h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <p
                  className="mb-4 text-xs font-medium uppercase tracking-[0.18em]"
                  style={{ color: s.body, opacity: 0.85 }}
                >
                  {s.eyebrow}
                </p>
                <h2
                  className="font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
                  style={{ color: s.card }}
                >
                  {s.title}
                </h2>
                <p
                  className="mt-6 max-w-md text-lg leading-relaxed"
                  style={{ color: s.body }}
                >
                  {s.copy}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full px-7 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: s.card, color: s.bg }}
                    >
                      {s.primary}
                    </a>
                  ) : (
                    <Link
                      to={s.to ?? "/shop"}
                      className="rounded-full px-7 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: s.card, color: s.bg }}
                    >
                      {s.primary}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-[#1a1a1a] px-6 py-20 text-[#f5f0e6] md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <img src={logo} alt="Impressions" className="h-20 w-auto" />
            <div className="my-4 h-px w-10 bg-[#d9a87c]" />
            <address className="space-y-1 text-sm not-italic leading-relaxed text-[#f5f0e6]/60">
              <p>Paravattani, Opp. Childrens Park,</p>
              <p>East Fort P.O.,</p>
              <p>Thrissur, Kerala — 680005</p>
            </address>
            <p className="mt-4 text-sm text-[#f5f0e6]/60">
              <a href="tel:+919526577999" className="text-[#d9a87c] transition-colors hover:text-[#f5f0e6]">+91 95265 77 999</a>
              <span className="mx-2 text-[#f5f0e6]/30">·</span>
              <a href="tel:+919020077999" className="text-[#d9a87c] transition-colors hover:text-[#f5f0e6]">+91 90200 77 999</a>
              <br />
            </p>
            <div className="mt-6">
              <a
                href="https://www.instagram.com/impressions_wedding_cards"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#f5f0e6]/70 transition-colors hover:text-[#d9a87c]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <div className="w-full overflow-hidden rounded-lg border border-[#d9a87c]/30 opacity-85 transition-opacity hover:opacity-100">
              <iframe
                src="https://maps.google.com/maps?q=Impressions+Castle+Paravattani+Thrissur+Kerala&output=embed"
                width="100%"
                height="220"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Impressions Wedding Cards — Atelier Location"
              />
            </div>
            <a
              href="https://maps.app.goo.gl/ZJTa4s78fDbU1HjF7"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-full border border-[#d9a87c]/40 px-5 py-2 text-xs font-medium uppercase tracking-[0.08em] text-[#d9a87c] transition-all hover:bg-[#d9a87c] hover:text-[#1a1a1a]"
            >
              Get Directions
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-[#f5f0e6]/10 pt-8 text-center">
          <p className="text-xs text-[#f5f0e6]/40">
            © {new Date().getFullYear()} Allure by Impressions Wedding Cards. All rights reserved. Crafted with devotion in Thrissur.
          </p>
        </div>
      </div>
    </footer>
  );
}

function BentoSection() {
  const items: {
    title: string;
    desc: string;
    img: string;
    icon: (props: { className?: string }) => ReactElement;
    to?: string;
    href?: string;
  }[] = [
    { title: "Heritage Collection", desc: "Rich, traditional luxury on heirloom-inspired paper.", img: heritageImg, icon: DoodleHeritage, to: "/shop" },
    { title: "Minimal Collection", desc: "Understated elegance for modern couples.", img: minimalImg, icon: DoodleMinimal, to: "/shop" },
    { title: "Floral Collection", desc: "Watercolour-inspired botanical prints.", img: floralImg, icon: DoodleFloral, to: "/shop" },
    { title: "Modern Collection", desc: "Contemporary & bold designs.", img: invitations, icon: DoodleModern, to: "/shop" },
    { title: "Allure Cards", desc: "Our premium sub-brand — gold foil & elevated finishes.", img: allureImg, icon: DoodleAllure, href: "https://www.allurecards.in" },
    { title: "Customise Your Card", desc: "Live preview — design your invitation in minutes.", img: customiseImg, icon: DoodleCustomize, to: "/customize" },
  ];

  return (
    <section className="bg-[#f5f0e6] px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="font-serif text-5xl leading-[1.05] tracking-tight text-[#1a1a1a] md:text-6xl">
            Everything you <em className="not-italic">need</em> for the perfect invitation
          </h2>
          <p className="mt-8 text-base text-[#1a1a1a]/75">From our Thrissur atelier to your guests’ hands</p>
        </div>
        <div className="grid grid-cols-1 gap-px bg-[#1a1a1a]/10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => {
            const Icon = it.icon;
            const inner = (
              <>
                <p className="font-serif text-2xl tracking-tight text-[#1a1a1a]">{it.title} →</p>
                <p className="text-sm text-[#1a1a1a]/75">{it.desc}</p>
                <div className="relative mt-2 overflow-hidden rounded-2xl">
                  <span
                    className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md"
                    style={{ backgroundColor: "#f5f0e6", color: "#1a1a1a" }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <img
                    src={it.img}
                    alt={it.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </>
            );

            return it.href ? (
              <a
                key={it.title}
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-4 bg-[#f5f0e6] p-6 transition-colors hover:bg-[#efe7d6]"
              >
                {inner}
              </a>
            ) : (
              <Link
                key={it.title}
                to={it.to ?? "/shop"}
                className="group flex flex-col gap-4 bg-[#f5f0e6] p-6 transition-colors hover:bg-[#efe7d6]"
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
