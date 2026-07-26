import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCardDesign, encodeDesignForUrl } from "@/hooks/use-card-design";
import { createShare } from "@/lib/share-store";

const OWNER_WHATSAPP_NUMBER = "919526577999";

export function ExportBar({ svgRef: _svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  const { state, undo, redo, canUndo, canRedo, resetChurchPositions, resetScriptPositions } =
    useCardDesign();
  const [shareUrl, setShareUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const creatingRef = useRef(false);

  useEffect(() => {
    setShareUrl(
      `${window.location.origin}${window.location.pathname}?design=${encodeDesignForUrl(state)}`,
    );
  }, [state]);

  const handleWhatsApp = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (creatingRef.current) return;
      creatingRef.current = true;
      setIsCreating(true);
      try {
        const { key } = await createShare({ data: { state: JSON.stringify(state) } });
        const short = `${window.location.origin}${window.location.pathname}?d=${key}`;
        const msg = `Hi! Here's my wedding card design for ${state.groom} & ${state.bride} — could you take a look? ${short}`;
        window.open(
          `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
          "_blank",
          "noopener",
        );
      } catch {
        const fallback = `${window.location.origin}${window.location.pathname}?design=${encodeDesignForUrl(state)}`;
        const msg = `Hi! Here's my wedding card design for ${state.groom} & ${state.bride} — could you take a look? ${fallback}`;
        window.open(
          `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
          "_blank",
          "noopener",
        );
      } finally {
        creatingRef.current = false;
        setIsCreating(false);
      }
    },
    [state],
  );

  const shareMessage = `Hi! Here's my wedding card design for ${state.groom} & ${state.bride} — could you take a look? ${shareUrl}`;

  const whatsappHref = shareUrl
    ? `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(shareMessage)}`
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
          onClick={handleWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!whatsappHref || isCreating}
          className="flex-1 rounded-full bg-foreground px-5 py-3 text-center text-sm font-semibold text-background transition-transform duration-150 active:scale-[0.97] aria-disabled:pointer-events-none aria-disabled:opacity-60"
        >
          {isCreating ? "Creating share link…" : "Share on WhatsApp"}
        </a>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="underline opacity-70 disabled:opacity-30"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className="underline opacity-70 disabled:opacity-30"
          >
            Redo
          </button>
        </div>
        <button
          type="button"
          onClick={state.textLayoutId === "classic" ? resetChurchPositions : resetScriptPositions}
          className="underline opacity-70"
        >
          Reset current layout
        </button>
      </div>

      <p className="mt-3 min-h-5 text-center text-xs opacity-70" role="status" aria-live="polite">
        Share your design with us and we'll prepare it for print — direct downloads aren't available
        here. Your progress is saved automatically.
      </p>
    </div>
  );
}
