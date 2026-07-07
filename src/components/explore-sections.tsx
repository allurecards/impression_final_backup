import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import heroVenue from "@/assets/hero-venue.jpg";        // not used now, kept for possible future reference
import guestList from "@/assets/guest-list.jpg";        // not used now
import weddingWebsite from "@/assets/wedding-website.jpg"; // not used now
import registry from "@/assets/registry.jpg";           // still used
import invitations from "@/assets/invitations.jpg";     // still used
import logo from "@/assets/IMP_LOGO_final.png";
import {
  DoodleHeritage,
  DoodleMinimal,
  DoodleFloral,
  DoodleModern,
  DoodleAllure,
  DoodleCustomize,
} from "@/components/doodle-icons";

// ── new assets (external URLs) ─────────────────────────────
const newHeritageImg = "https://raw.githubusercontent.com/allurecards/allurecards.in/main/assets/cards/thumb/al-042-1.jpeg";
const newMinimalImg   = "https://raw.githubusercontent.com/allurecards/allurecards.in/main/assets/cards/thumb/al-041-1.jpeg";
const newFloralImg    = "https://raw.githubusercontent.com/allurecards/allurecards.in/main/assets/cards/thumb/al-040-1.jpeg";

// unused extra images (available for future use)
// "https://raw.githubusercontent.com/allurecards/allurecards.in/main/assets/cards/thumb/al-021-1.jpeg"
// "https://raw.githubusercontent.com/allurecards/allurecards.in/main/assets/cards/thumb/038-1.jpeg"

const instaVideo1 = "https://www.instagram.com/p/DZu0rDAy0-m/embed/";
const instaVideo2 = "https://www.instagram.com/p/DZ-U85TSqab/embed/"; // unused for now, kept for future use

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
    image: newHeritageImg,
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
    image: registry,
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
    primary: "Follow @impressions.in",
    href: "https://www.instagram.com/impressions.in/",
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
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
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
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
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
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
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
    <footer className="bg-[#1a1a1a] px-6 py-20 text-[#f5f0e6] md:px-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
        <div>
          <img src={logo} alt="Impressions" className="h-16 w-auto" />
        </div>
        {[
          { h: "Collections", items: ["Heritage", "Minimal", "Floral", "Modern"] },
          { h: "Customise", items: ["Design your card", "Templates", "Bible verses", "Live preview"] },
          { h: "Company", items: ["Our atelier", "Allure Cards", "Contact", "Directions"] },
        ].map((col) => (
          <div key={col.h}>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] opacity-70">
              {col.h}
            </h4>
            <ul className="space-y-2 text-sm">
              {col.items.map((i) => (
                <li key={i}>
                  <a href="#" className="opacity-90 hover:opacity-60">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-16 max-w-6xl text-xs opacity-50">
        © {new Date().getFullYear()} Impressions Wedding Cards. All rights reserved.
      </p>
    </footer>
  );
}

function BentoSection() {
  const items: {
    title: string;
    desc: string;
    img: string;
    icon: (props: { className?: string }) => React.ReactElement;
    to?: string;
    href?: string;
  }[] = [
    { title: "Heritage Collection", desc: "Rich, traditional luxury on heirloom-inspired paper.", img: newHeritageImg, icon: DoodleHeritage, to: "/shop" },
    { title: "Minimal Collection", desc: "Understated elegance for modern couples.", img: newMinimalImg, icon: DoodleMinimal, to: "/shop" },
    { title: "Floral Collection", desc: "Watercolour-inspired botanical prints.", img: newFloralImg, icon: DoodleFloral, to: "/shop" },
    { title: "Modern Collection", desc: "Contemporary & bold designs.", img: invitations, icon: DoodleModern, to: "/shop" },
    { title: "Allure Cards", desc: "Our premium sub-brand — gold foil & elevated finishes.", img: registry, icon: DoodleAllure, href: "https://www.allurecards.in" },
    { title: "Customise Your Card", desc: "Live preview — design your invitation in minutes.", img: registry, icon: DoodleCustomize, to: "/customize" },
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
