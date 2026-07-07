import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCardDesign, encodeDesignForUrl } from "@/hooks/use-card-design";

/**
 * Customers can only *share* their finished design (link / WhatsApp / email)
 * — direct file downloads (PNG/PDF) are intentionally not exposed here.
 * The design reaches the studio via the share link, which reopens this page
 * with the exact same design pre-loaded (see `loadInitialState` in
 * use-card-design.tsx, which reads the `?design=` query param).
 *
 * TODO: replace with the studio's real WhatsApp number / email.
 */
const OWNER_WHATSAPP_NUMBER = ""; // e.g. "911234567890" — country code, digits only, no + or spaces
const OWNER_EMAIL = "hello@impressionscards.in";

export function ExportBar({ svgRef: _svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  const { state, undo, redo, canUndo, canRedo } = useCardDesign();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Computed client-side only (window isn't available during SSR).
  useEffect(() => {
    setShareUrl(`${window.location.origin}${window.location.pathname}?design=${encodeDesignForUrl(state)}`);
  }, [state]);

  const shareMessage = `Hi! Here's my wedding card design for ${state.groom} & ${state.bride} — could you take a look? ${shareUrl}`;

  const copyShareLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently no-op; the link is still valid to copy manually.
    }
  };

  const whatsappHref = shareUrl
    ? `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(shareMessage)}`
    : undefined;
  const emailHref = shareUrl
    ? `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(
        `Wedding card design — ${state.groom} & ${state.bride}`,
      )}&body=${encodeURIComponent(shareMessage)}`
    : undefined;

  return (
    <div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/shop"
          className="flex-1 rounded-full border border-foreground px-5 py-3 text-center text-sm font-semibold transition-transform duration-150 active:scale-[0.97]"
        >
          Browse ready-made
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!whatsappHref}
          className="flex-1 rounded-full bg-foreground px-5 py-3 text-center text-sm font-semibold text-background transition-transform duration-150 active:scale-[0.97] aria-disabled:pointer-events-none aria-disabled:opacity-60"
        >
          Share on WhatsApp
        </a>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex gap-3">
          <a
            href={emailHref}
            aria-disabled={!emailHref}
            className="underline opacity-70 aria-disabled:pointer-events-none aria-disabled:opacity-40"
          >
            Share by email
          </a>
          <button type="button" onClick={copyShareLink} disabled={!shareUrl} className="underline opacity-70 disabled:opacity-40">
            {copied ? "Link copied!" : "Copy share link"}
          </button>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={undo} disabled={!canUndo} className="underline opacity-70 disabled:opacity-30">
            Undo
          </button>
          <button type="button" onClick={redo} disabled={!canRedo} className="underline opacity-70 disabled:opacity-30">
            Redo
          </button>
        </div>
      </div>

      <p className="mt-3 min-h-5 text-center text-xs opacity-70" role="status" aria-live="polite">
        Share your design with us and we'll prepare it for print — direct downloads aren't available here. Your
        progress is saved automatically.
      </p>
    </div>
  );
}