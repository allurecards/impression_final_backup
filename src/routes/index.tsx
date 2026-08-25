import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ExploreSections } from "@/components/explore-sections";
import { useEffect, useRef, useState, useCallback } from "react";
import weddingCard from "@/assets/wedding-card.jpg";
import invitations from "@/assets/invitations.jpg";
import registry from "@/assets/register.jpeg";
import logo from "@/assets/IMP_LOGO_final.png";
import { canonicalLink, seoMeta } from "@/lib/seo";
const luxuryImage = weddingCard;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seoMeta({
      title: "Luxury Wedding Cards in Thrissur Kerala | Impressions Wedding Cards",
      description:
        "Impressions Wedding Cards creates premium wedding invitation cards, customised invitations, and designer wedding stationery in Thrissur, Kerala.",
      path: "/",
    }),
    links: [canonicalLink("/")],
  }),
  component: Landing,
});

const LINES = [
  { t: "For the ones", delay: 900 },
  { t: "who said yes,", delay: 1600 },
  { t: "and everyone", delay: 2400 },
  { t: "who'll say it back.", delay: 3200 },
];

function Landing() {
  const [stage, setStage] = useState(0);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [scrollY, setScrollY] = useState(0);
  const [hovered, setHovered] = useState<"shop" | "custom" | null>(null);
  const [transitionDoor, setTransitionDoor] = useState<"shop" | "custom" | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Stage progression
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 250);
    const t2 = setTimeout(() => setStage(2), 900);
    const t3 = setTimeout(() => setStage(3), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Mouse & scroll
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const px = (mouse.x - 0.5) * 2;
  const py = (mouse.y - 0.5) * 2;

  // Door transition handler
  const handleDoorClick = useCallback(
    (door: "shop" | "custom", target: string, isExternal = false) => {
      setTransitionDoor(door);
      setTimeout(() => {
        if (isExternal) {
          window.location.href = target;
        } else {
          navigate({ to: target });
        }
      }, 800);
    },
    [navigate],
  );

  // Shop door click
  const onShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDoorClick("shop", "/shop");
  };

  // Allure (custom) door click – external
  const onCustomClick = (door: "shop" | "custom", to: string, e: React.MouseEvent) => {
    e.preventDefault();
    handleDoorClick("custom", "https://www.allurecards.in", true);
  };

  return (
    <div
      ref={wrapRef}
      className="relative min-h-[180vh] overflow-hidden"
      style={{ backgroundColor: "#0f0b0a", color: "#f5f0e6" }}
    >
      {/* ========== STATIC NAVBAR ========== */}
      <header className="relative z-30 w-full bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <a href="#">
            <img
              src={logo}
              alt="Impressions"
              className="h-10 w-auto -translate-x-2 translate-y-5 scale-[1.8] origin-left"
            />
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              to="/shop"
              className="text-sm font-medium text-[#f5f0e6] transition-opacity hover:opacity-70"
            >
              Shop
            </Link>
            <Link
              to="/customize"
              className="text-sm font-medium text-[#f5f0e6] transition-opacity hover:opacity-70"
            >
              Customise
            </Link>
            <a
              href="https://www.allurecards.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full border border-[#d9a87c]/30 px-4 py-1.5 text-sm font-medium text-[#d9a87c] transition-all duration-200 ease-out hover:bg-[#d9a87c] hover:text-[#1a1a1a] active:scale-[0.97]"
            >
              <span className="text-xs transition-transform duration-200 ease-out group-hover:scale-110">✦</span>
              <span className="tracking-[0.08em]">Allure</span>
            </a>
            <a
              href="/#contact"
              className="text-sm font-medium text-[#f5f0e6] transition-opacity hover:opacity-70"
            >
              Contact
            </a>
          </nav>
          <Link
            to="/customize"
            className="rounded-full bg-[#f5f0e6] px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-white"
          >
            Customise
          </Link>
        </div>
      </header>

      {/* ========== AMBIENT BACKDROP ========== */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <img
          src={weddingCard}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{
            transform: `scale(1.18) translate3d(${-px * 20}px, ${-py * 20 - scrollY * 0.15}px, 0)`,
            filter: "brightness(0.42) saturate(0.85) contrast(1.05)",
            transition: "transform 900ms cubic-bezier(0.2,0.8,0.2,1)",
          }}
        />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 45% at 30% 40%, rgba(217,168,124,0.35), transparent 60%), radial-gradient(50% 40% at 75% 65%, rgba(138,21,56,0.28), transparent 65%)",
            transform: `translate3d(${px * 30}px, ${py * 30}px, 0)`,
            transition: "transform 1200ms cubic-bezier(0.2,0.8,0.2,1)",
            animation: "drift 22s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-overlay opacity-[0.18]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      </div>

      {/* ========== CURTAIN REVEAL ========== */}
      <div className="pointer-events-none fixed inset-0 z-40">
        <div
          className="absolute inset-x-0 top-0 origin-top bg-[#0f0b0a]"
          style={{
            height: "50%",
            transform: stage >= 1 ? "translateY(-101%)" : "translateY(0)",
            transition: "transform 1400ms cubic-bezier(0.77,0,0.175,1)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 origin-bottom bg-[#0f0b0a]"
          style={{
            height: "50%",
            transform: stage >= 1 ? "translateY(101%)" : "translateY(0)",
            transition: "transform 1400ms cubic-bezier(0.77,0,0.175,1)",
          }}
        />
      </div>

      {/* ========== HERO TEXT ========== */}
      <section
        id="cinematic-hero"
        className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <p
          className="mb-8 text-[11px] font-medium uppercase tracking-[0.5em] text-[#f5f0e6]/70"
          style={{
            opacity: stage >= 2 ? 1 : 0,
            transform: stage >= 2 ? "translateY(0)" : "translateY(10px)",
            transition: "all 900ms cubic-bezier(0.2,0.8,0.2,1)",
          }}
        >
          — a short film about paper —
        </p>

        <h1
          className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl lg:text-[6.5rem]"
          style={{
            transform: `translate3d(${-px * 8}px, ${-py * 8 - scrollY * 0.25}px, 0)`,
            transition: "transform 700ms cubic-bezier(0.2,0.8,0.2,1)",
          }}
        >
          {LINES.map((l, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                className="inline-block"
                style={{
                  transform: stage >= 2 ? "translateY(0)" : "translateY(110%)",
                  opacity: stage >= 2 ? 1 : 0,
                  transition: `transform 1100ms cubic-bezier(0.2,0.8,0.2,1) ${l.delay}ms, opacity 900ms ${l.delay}ms`,
                }}
              >
                {i === 3 ? <em className="not-italic text-[#d9a87c]">{l.t}</em> : l.t}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="mt-10 max-w-md text-base text-[#f5f0e6]/75"
          style={{
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "translateY(0)" : "translateY(14px)",
            transition: "all 900ms 200ms cubic-bezier(0.2,0.8,0.2,1)",
          }}
        >
          Two doors. One evening. Choose how your invitation begins.
        </p>

        <div
          className="mt-4 flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.4em] text-[#f5f0e6]/50"
          style={{
            opacity: stage >= 3 ? 1 : 0,
            transition: "opacity 900ms 900ms",
          }}
        >
          <span>scroll</span>
          <span className="block h-8 w-px animate-pulse bg-[#f5f0e6]/50" />
        </div>
      </section>

      {/* ========== TWO DOORS ========== */}
      <section className="relative z-20 flex min-h-screen items-center justify-center px-6 py-16">
        <div
          className="grid w-full max-w-6xl gap-6 md:grid-cols-2"
          style={{
            transform: `translate3d(0, ${Math.max(-40, 40 - scrollY * 0.08)}px, 0)`,
            transition: "transform 400ms linear",
          }}
        >
          {/* Impressions Door */}
          <Door
            door="shop"
            to="/shop"
            label="Impressions"
            eyebrow="Shop"
            badge="Browse Ready‑to‑Send"
            copy="Step into the gallery. Ready-made invitations, ready to send."
            image={registry}
            hovered={hovered === "shop"}
            otherHovered={hovered === "custom"}
            onEnter={() => setHovered("shop")}
            onLeave={() => setHovered(null)}
            tint="#d9a87c"
            px={px}
            py={py}
            onClick={(door, to, e) => onShopClick(e)}
            transitionActive={transitionDoor === "shop"}
          />

          {/* Allure Door */}
          <Door
            door="custom"
            to="/customize"
            label="Allure"
            eyebrow="Shop"
            badge="Bespoke Gold Foil"
            copy="Limited edition. Gold foil, letterpress, and hand‑finished details."
            image={invitations}
            hovered={hovered === "custom"}
            otherHovered={hovered === "shop"}
            onEnter={() => setHovered("custom")}
            onLeave={() => setHovered(null)}
            tint="#c8a45c"
            px={px}
            py={py}
            onClick={onCustomClick}
            transitionActive={transitionDoor === "custom"}
            titleColor="#c8a45c"
          />
        </div>
      </section>

      {/* ========== FOOTER LINK ========== */}
      <div className="relative z-20 pb-10 text-center text-[11px] uppercase tracking-[0.4em] text-[#f5f0e6]/50">
        <a href="#explore" className="hover:text-[#f5f0e6]">
          or wander the rest of Impressions ↓
        </a>
      </div>

      {/* ========== FULL SITE BELOW ========== */}
      <div id="explore" className="relative z-20">
        <ExploreSections />
      </div>

      {/* ========== CINEMATIC DOOR OPEN TRANSITION ========== */}
      {transitionDoor && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-1/2 h-full bg-[#0f0b0a]"
            style={{ animation: "doorOpenLeft 800ms forwards" }}
          />
          <div
            className="absolute top-0 right-0 w-1/2 h-full bg-[#0f0b0a]"
            style={{ animation: "doorOpenRight 800ms forwards" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, ${
                transitionDoor === "shop" ? "#d9a87c" : "#c8a45c"
              } 0%, transparent 70%)`,
              opacity: 0,
              animation: "lightBurst 800ms ease-out forwards",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes drift {
          0% { transform: translate3d(0,0,0) scale(1); }
          100% { transform: translate3d(-40px, 30px, 0) scale(1.08); }
        }
        @keyframes doorOpenLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes doorOpenRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes lightBurst {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}

// ==================== DOOR COMPONENT ====================
function Door({
  door,
  to,
  label,
  eyebrow,
  badge,
  copy,
  image,
  hovered,
  otherHovered,
  onEnter,
  onLeave,
  tint,
  px,
  py,
  onClick,
  transitionActive,
  titleColor,
}: {
  door: "shop" | "custom";
  to: string;
  label: string;
  eyebrow: string;
  badge: string;
  copy: string;
  image: string;
  hovered: boolean;
  otherHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  tint: string;
  px: number;
  py: number;
  onClick: (door: "shop" | "custom", to: string, e: React.MouseEvent) => void;
  transitionActive: boolean;
  titleColor?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [local, setLocal] = useState({ x: 0.5, y: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setLocal({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };

  const tiltX = (local.y - 0.5) * -8;
  const tiltY = (local.x - 0.5) * 8;

  return (
    <Link
      ref={ref}
      to={to}
      onClick={(e) => onClick(door, to, e)}
      onMouseEnter={onEnter}
      onMouseLeave={() => {
        onLeave();
        setLocal({ x: 0.5, y: 0.5 });
      }}
      onMouseMove={onMove}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[4px] border border-[#f5f0e6]/15 will-change-transform"
      style={{
        transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${
          hovered ? 1.02 : otherHovered ? 0.97 : 1
        })`,
        opacity: otherHovered ? 0.55 : transitionActive ? 0 : 1,
        transition: "transform 500ms cubic-bezier(0.2,0.8,0.2,1), opacity 500ms",
        pointerEvents: transitionActive ? "none" : "auto",
      }}
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          transform: `scale(${hovered ? 1.12 : 1.04}) translate3d(${-px * 12}px, ${-py * 12}px, 0)`,
          filter: `brightness(${hovered ? 0.75 : 0.5}) saturate(1.05)`,
          transition: "transform 900ms cubic-bezier(0.2,0.8,0.2,1), filter 600ms",
        }}
      />

      {/* Door split (hover) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[#0f0b0a]/40 backdrop-blur-[2px]"
        style={{
          transform: hovered ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 900ms cubic-bezier(0.77,0,0.175,1)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[#0f0b0a]/40 backdrop-blur-[2px]"
        style={{
          transform: hovered ? "translateX(100%)" : "translateX(0)",
          transition: "transform 900ms cubic-bezier(0.77,0,0.175,1)",
        }}
      />

      {/* Seam + knock dot */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px">
        <div
          className="h-full w-full"
          style={{
            background: `linear-gradient(to bottom, transparent, ${tint}, transparent)`,
            opacity: hovered ? 0 : 0.9,
            transition: "opacity 500ms",
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{
            backgroundColor: tint,
            boxShadow: `0 0 6px ${tint}, 0 0 12px ${tint}`,
            opacity: hovered ? 0 : 0.6,
            animation: "knock 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Cursor glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(220px circle at ${local.x * 100}% ${local.y * 100}%, ${tint}33, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 400ms",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-8">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#f5f0e6]/70">
            {eyebrow}
          </span>
          <span
            className="h-px bg-[#f5f0e6]/50"
            style={{
              width: hovered ? "80px" : "24px",
              transition: "width 600ms cubic-bezier(0.2,0.8,0.2,1)",
            }}
          />
        </div>

        <div>
          <h2
            className="font-serif text-6xl leading-none tracking-tight md:text-7xl"
            style={{
              color: titleColor || undefined,
              transform: hovered ? "translateY(-6px)" : "translateY(0)",
              transition: "transform 600ms cubic-bezier(0.2,0.8,0.2,1)",
            }}
          >
            {label}
          </h2>

          <span
            className="mt-1 inline-block rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-[0.25em]"
            style={{
              color: tint,
              borderColor: tint,
              opacity: hovered ? 1 : 0.7,
              transition: "opacity 500ms",
            }}
          >
            {badge}
          </span>

          <p
            className="mt-4 max-w-xs text-sm text-[#f5f0e6]/80"
            style={{
              opacity: hovered ? 1 : 0.7,
              transform: hovered ? "translateY(0)" : "translateY(6px)",
              transition: "all 500ms",
            }}
          >
            {copy}
          </p>
          <div
            className="mt-6 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em]"
            style={{ color: tint }}
          >
            <span>{hovered ? "Push to enter" : "Enter"}</span>
            <span
              className="inline-block"
              style={{
                transform: hovered ? "translateX(8px)" : "translateX(0)",
                transition: "transform 500ms cubic-bezier(0.2,0.8,0.2,1)",
              }}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
