import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ExploreSections } from "@/components/explore-sections";
import { useEffect, useRef, useState, useCallback } from "react";
import weddingCard from "@/assets/wedding-card.jpg";
import invitations from "@/assets/invitations.jpg";
import registry from "@/assets/register.jpeg";
import logo from "@/assets/IMP_LOGO_final.png";
const luxuryImage = weddingCard;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Impressions Wedding Cards — Where your love story begins" },
      {
        name: "description",
        content:
          "Step into Impressions — a cinematic front door to wedding invitations you can shop or design from scratch.",
      },
      {
        property: "og:title",
        content: "Impressions Wedding Cards — Where your love story begins",
      },
      {
        property: "og:description",
        content: "Shop timeless invitations or customise one from scratch.",
      },
    ],
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
  const [transitionDoor, setTransitionDoor] = useState<
    "shop" | "custom" | "standard" | "luxury" | null
  >(null);
  const [tierChoice, setTierChoice] = useState(false);
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
    (door: "shop" | "custom" | "standard" | "luxury", target: string, isExternal = false) => {
      setTransitionDoor(door);
      setTimeout(() => {
        if (isExternal) {
          window.location.href = target;
        } else {
          navigate({ to: target });
        }
      }, 800);
    },
    [navigate]
  );

  // When Shop is clicked, show tier choice
  const onShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setTierChoice(true);
  };

  // Custom door click
  const onCustomClick = (door: "shop" | "custom", to: string, e: React.MouseEvent) => {
    e.preventDefault();
    handleDoorClick(door, to);
  };

  return (
    <div
      ref={wrapRef}
      className="relative min-h-[180vh] overflow-hidden"
      style={{ backgroundColor: "#0f0b0a", color: "#f5f0e6" }}
    >
      {/* ========== STATIC NAVBAR (non‑sticky, only on homepage) ========== */}
      <header className="relative z-30 w-full bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          {/* Logo */}
          <a href="#">
            <img src={logo} alt="Impressions" className="h-10 w-auto -translate-x-2 translate-y-5 scale-[1.8] origin-left" />
          </a>

          {/* Links */}
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

          {/* CTA button */}
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
                {i === 3 ? (
                  <em className="not-italic text-[#d9a87c]">{l.t}</em>
                ) : (
                  l.t
                )}
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
          <Door
            door="shop"
            to="/shop"
            label="Shop"
            eyebrow="Door I"
            badge="Browse Ready‑to‑Send"
            copy="Step into the gallery. Ready-made invitations, ready to send."
            image={invitations}
            hovered={hovered === "shop"}
            otherHovered={hovered === "custom"}
            onEnter={() => setHovered("shop")}
            onLeave={() => setHovered(null)}
            tint="#d9a87c"
            px={px}
            py={py}
            onClick={(door, to, e) => onShopClick(e)}
            transitionActive={
              transitionDoor === "shop" ||
              transitionDoor === "standard" ||
              transitionDoor === "luxury"
            }
          />
          <Door
            door="custom"
            to="/customize"
            label="Customise"
            eyebrow="Door II"
            badge="Create From Scratch"
            copy="Start with a blank page. Shape every word, every stroke, your own."
            image={registry}
            hovered={hovered === "custom"}
            otherHovered={hovered === "shop"}
            onEnter={() => setHovered("custom")}
            onLeave={() => setHovered(null)}
            tint="#e6d4f0"
            px={px}
            py={py}
            onClick={onCustomClick}
            transitionActive={transitionDoor === "custom"}
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
                transitionDoor === "shop" || transitionDoor === "standard"
                  ? "#d9a87c"
                  : transitionDoor === "luxury"
                  ? "#b48b5a"
                  : "#e6d4f0"
              } 0%, transparent 70%)`,
              opacity: 0,
              animation: "lightBurst 800ms ease-out forwards",
            }}
          />
        </div>
      )}

      {/* ========== TIER CHOICE OVERLAY (Standard vs. Luxury) ========== */}
      {tierChoice && (
        <TierChoiceOverlay
          onStandard={() => {
            setTierChoice(false);
            handleDoorClick("standard", "/shop");
          }}
          onLuxury={() => {
            setTierChoice(false);
            handleDoorClick("luxury", "https://www.allurecards.in", true);
          }}
          onClose={() => setTierChoice(false)}
          tintStandard="#d9a87c"
          tintLuxury="#b48b5a"
          imageStandard={invitations}
          imageLuxury={luxuryImage}
        />
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
      className="group relative block aspect-[3/4] overflow-hidden rounded-[4px] border border-[#f5f0e6]/15 will-change-transform"
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

function TierChoiceOverlay({
  onStandard,
  onLuxury,
  onClose,
  tintStandard = "#d9a87c",
  tintLuxury = "#c8a45c",
  imageStandard,
  imageLuxury,
}: {
  onStandard: () => void;
  onLuxury: () => void;
  onClose: () => void;
  tintStandard?: string;
  tintLuxury?: string;
  imageStandard: string;
  imageLuxury: string;
}) {
  // Sequence stages: 0 = big door closed (waiting), 1 = big door splitting,
  // 2 = small doors revealed and interactive
  const [seqStage, setSeqStage] = useState<0 | 1 | 2>(0);
  const [hoveredSmall, setHoveredSmall] = useState<"standard" | "luxury" | null>(null);

  // Auto-advance: knock briefly, then split, then reveal
  useEffect(() => {
    const splitTimer = setTimeout(() => setSeqStage(1), 750);
    const revealTimer = setTimeout(() => setSeqStage(2), 750 + 900);
    return () => {
      clearTimeout(splitTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  const triggerOpen = () => {
    if (seqStage === 0) setSeqStage(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0b0a]/90 backdrop-blur-md flex items-center justify-center">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 text-[#f5f0e6]/60 hover:text-[#f5f0e6] text-[10px] uppercase tracking-[0.4em]"
      >
        ← Return
      </button>

      <div className="relative w-full max-w-2xl aspect-[3/4] flex items-center justify-center">
        {/* ====== TWO SMALL DOORS (sit behind the big door, revealed through the gap) ====== */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-6 px-6"
          style={{
            opacity: seqStage >= 1 ? 1 : 0,
            transition: "opacity 300ms ease-out",
          }}
        >
          {/* Standard small door */}
          <button
            onClick={onStandard}
            onMouseEnter={() => setHoveredSmall("standard")}
            onMouseLeave={() => setHoveredSmall(null)}
            disabled={seqStage < 2}
            className="group relative flex-1 aspect-[3/4] max-w-[42%] overflow-hidden rounded-[4px] border border-[#f5f0e6]/15 focus:outline-none"
            style={{
              backgroundColor: "#0f0b0a",
              transform:
                seqStage >= 2
                  ? "translateY(0) scale(1)"
                  : "translateY(18px) scale(0.86)",
              opacity: seqStage >= 2 ? 1 : 0,
              transition:
                "transform 700ms cubic-bezier(0.16,1,0.3,1) 80ms, opacity 600ms ease-out 80ms",
              pointerEvents: seqStage >= 2 ? "auto" : "none",
            }}
          >
            <img
              src={imageStandard}
              alt="Standard Cards"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                filter: `brightness(${hoveredSmall === "standard" ? 0.75 : 0.5})`,
                transform: `scale(${hoveredSmall === "standard" ? 1.1 : 1})`,
                transition: "transform 900ms cubic-bezier(0.2,0.8,0.2,1), filter 600ms",
              }}
            />
            <div
              className="absolute inset-y-0 left-0 w-1/2 bg-[#0f0b0a]/40 backdrop-blur-[2px]"
              style={{
                transform: hoveredSmall === "standard" ? "translateX(-100%)" : "translateX(0)",
                transition: "transform 900ms cubic-bezier(0.77,0,0.175,1)",
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/2 bg-[#0f0b0a]/40 backdrop-blur-[2px]"
              style={{
                transform: hoveredSmall === "standard" ? "translateX(100%)" : "translateX(0)",
                transition: "transform 900ms cubic-bezier(0.77,0,0.175,1)",
              }}
            />
            {/* Seam + knock dot, matching the main Door component's language */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px">
              <div
                className="h-full w-full"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${tintStandard}, transparent)`,
                  opacity: hoveredSmall === "standard" ? 0 : 0.9,
                  transition: "opacity 500ms",
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: tintStandard,
                  boxShadow: `0 0 6px ${tintStandard}, 0 0 12px ${tintStandard}`,
                  opacity: hoveredSmall === "standard" ? 0 : 0.6,
                  animation: "knock 2s ease-in-out infinite",
                }}
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-4 text-left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#f5f0e6]/70">Standard</span>
              <h3 className="font-serif text-3xl leading-none mt-1">Shop</h3>
              <p className="text-xs text-[#f5f0e6]/70 mt-1">Curated collection.</p>
              <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: tintStandard }}>
                Enter
                <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
              </div>
            </div>
          </button>

          {/* ===== ALLURE DOOR – staged half a beat later, more ornamented ===== */}
          <button
            onClick={onLuxury}
            onMouseEnter={() => setHoveredSmall("luxury")}
            onMouseLeave={() => setHoveredSmall(null)}
            disabled={seqStage < 2}
            className="group relative flex-1 aspect-[3/4] max-w-[42%] overflow-hidden rounded-[4px] border-2 focus:outline-none"
            style={{
              borderColor: `${tintLuxury}cc`,
              boxShadow:
                seqStage >= 2
                  ? `0 0 25px ${tintLuxury}60, 0 0 50px ${tintLuxury}30`
                  : "none",
              backgroundColor: "#0f0b0a",
              transform:
                seqStage >= 2
                  ? "translateY(0) scale(1)"
                  : "translateY(18px) scale(0.86)",
              opacity: seqStage >= 2 ? 1 : 0,
              transition:
                "transform 700ms cubic-bezier(0.16,1,0.3,1) 260ms, opacity 600ms ease-out 260ms, box-shadow 900ms ease-out 900ms",
              animation: seqStage >= 2 ? "pulseGlow 2.8s ease-in-out infinite alternate 900ms" : "none",
              pointerEvents: seqStage >= 2 ? "auto" : "none",
            }}
          >
            {/* Golden shine sweep (diagonal) – only on hover */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-700"
              style={{
                background: `linear-gradient(135deg, transparent 0%, ${tintLuxury}80 45%, ${tintLuxury}40 55%, transparent 100%)`,
                backgroundSize: "200% 200%",
                animation: "shineSweep 1.8s ease-in-out infinite",
              }}
            />

            {/* Pulsing inner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 40px ${tintLuxury}50`,
                opacity: seqStage >= 2 ? 0.7 : 0,
                transition: "opacity 700ms ease-out 900ms",
                animation: seqStage >= 2 ? "pulseInner 2.2s ease-in-out infinite alternate 900ms" : "none",
              }}
            />

            {/* Background image */}
            <img
              src={imageLuxury}
              alt="Luxury Allure"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                filter: `brightness(${hoveredSmall === "luxury" ? 0.8 : 0.5}) saturate(1.2)`,
                transform: `scale(${hoveredSmall === "luxury" ? 1.1 : 1})`,
                transition: "transform 900ms cubic-bezier(0.2,0.8,0.2,1), filter 600ms",
              }}
            />

            {/* Animated diamond icon */}
            <svg
              viewBox="0 0 24 24"
              className="absolute top-3 right-3 w-7 h-7 text-[#c8a45c] drop-shadow-[0_0_6px_rgba(200,164,92,0.9)] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
              fill="currentColor"
              style={{
                opacity: seqStage >= 2 ? 1 : 0,
                transform: seqStage >= 2 ? "scale(1) rotate(0deg)" : "scale(0.4) rotate(-30deg)",
                transition: "opacity 500ms ease-out 1000ms, transform 600ms cubic-bezier(0.34,1.56,0.64,1) 1000ms",
              }}
            >
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
            </svg>

            {/* Split overlay panels */}
            <div
              className="absolute inset-y-0 left-0 w-1/2 bg-[#0f0b0a]/40 backdrop-blur-[2px]"
              style={{
                transform: hoveredSmall === "luxury" ? "translateX(-100%)" : "translateX(0)",
                transition: "transform 900ms cubic-bezier(0.77,0,0.175,1)",
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/2 bg-[#0f0b0a]/40 backdrop-blur-[2px]"
              style={{
                transform: hoveredSmall === "luxury" ? "translateX(100%)" : "translateX(0)",
                transition: "transform 900ms cubic-bezier(0.77,0,0.175,1)",
              }}
            />

            {/* Elegant knock-dot (only Allure) – visible until hover */}
            <div className="absolute inset-y-0 left-1/2 w-px">
              <div
                className="h-full w-full"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${tintLuxury}, transparent)`,
                  opacity: hoveredSmall === "luxury" ? 0 : 0.9,
                  transition: "opacity 500ms",
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: tintLuxury,
                  boxShadow: `0 0 10px ${tintLuxury}, 0 0 20px ${tintLuxury}`,
                  opacity: hoveredSmall === "luxury" ? 0 : 0.9,
                  animation: "knockAllure 1.8s ease-in-out infinite",
                }}
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 text-left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#f5f0e6]/70">Luxury</span>
              <h3 className="font-serif text-3xl leading-none mt-1" style={{ color: tintLuxury }}>
                Allure
              </h3>
              {/* Badge with sparkle */}
              <span
                className="mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] uppercase tracking-[0.25em]"
                style={{ color: tintLuxury, borderColor: tintLuxury }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                Limited
              </span>
              <p className="text-xs text-[#f5f0e6]/70 mt-1">Bespoke gold foil.</p>
              <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: tintLuxury }}>
                Enter
                <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
              </div>
            </div>
          </button>
        </div>

        {/* ====== BIG DOOR (phase 0) — sits on top, closed, waiting for a knock ====== */}
        {seqStage === 0 && (
          <div
            className="absolute inset-0 rounded-[4px] border border-[#f5f0e6]/15 cursor-pointer overflow-hidden z-10"
            onClick={triggerOpen}
          >
            <img
              src={imageStandard}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "brightness(0.55) saturate(1.05)", transform: "scale(1.04)" }}
            />
            <div className="absolute inset-y-0 left-0 w-1/2 bg-[#0f0b0a]/60 backdrop-blur-[2px]" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[#0f0b0a]/60 backdrop-blur-[2px]" />
            <div className="absolute inset-y-0 left-1/2 w-px">
              <div
                className="h-full w-full"
                style={{ background: `linear-gradient(to bottom, transparent, ${tintStandard}, transparent)`, opacity: 0.9 }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: tintStandard,
                  boxShadow: `0 0 8px ${tintStandard}, 0 0 16px ${tintStandard}`,
                  animation: "knock 2s ease-in-out infinite",
                }}
              />
            </div>
            <div className="absolute inset-x-0 bottom-8 text-center">
              <span className="text-[11px] uppercase tracking-[0.4em] text-[#f5f0e6]/70">
                Choose your path
              </span>
            </div>
          </div>
        )}

        {/* ====== BIG DOOR SPLIT ANIMATION (phase 1→2) — halves slide off to reveal the small doors underneath ====== */}
        {seqStage >= 1 && (
          <>
            <div
              className="absolute inset-y-0 left-0 w-1/2 rounded-l-[4px] overflow-hidden z-10 pointer-events-none"
              style={{ animation: "bigDoorLeft 900ms cubic-bezier(0.77,0,0.175,1) forwards" }}
            >
              <img
                src={imageStandard}
                alt=""
                className="absolute inset-0 h-full object-cover"
                style={{ width: "200%", filter: "brightness(0.55) saturate(1.05)" }}
              />
              <div className="absolute inset-0 bg-[#0f0b0a]/60" />
            </div>
            <div
              className="absolute inset-y-0 right-0 w-1/2 rounded-r-[4px] overflow-hidden z-10 pointer-events-none"
              style={{ animation: "bigDoorRight 900ms cubic-bezier(0.77,0,0.175,1) forwards" }}
            >
              <img
                src={imageStandard}
                alt=""
                className="absolute inset-0 right-0 h-full object-cover"
                style={{ width: "200%", filter: "brightness(0.55) saturate(1.05)" }}
              />
              <div className="absolute inset-0 bg-[#0f0b0a]/60" />
            </div>
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background: `radial-gradient(circle at center, ${tintStandard} 0%, transparent 70%)`,
                opacity: 0,
                animation: "lightBurst 900ms ease-out forwards",
              }}
            />
          </>
        )}
      </div>

      <style>{`
        @keyframes bigDoorLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes bigDoorRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes lightBurst {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes knock {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
        }
        @keyframes knockAllure {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 10px ${tintLuxury}, 0 0 20px ${tintLuxury}; }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.4); box-shadow: 0 0 18px ${tintLuxury}, 0 0 35px ${tintLuxury}; }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 20px ${tintLuxury}50, 0 0 40px ${tintLuxury}20; }
          100% { box-shadow: 0 0 35px ${tintLuxury}80, 0 0 70px ${tintLuxury}35; }
        }
        @keyframes pulseInner {
          0% { opacity: 0.4; }
          100% { opacity: 0.9; }
        }
        @keyframes shineSweep {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }
      `}</style>
    </div>
  );
}
