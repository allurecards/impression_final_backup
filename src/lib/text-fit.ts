/**
 * The original `fitText` estimated width as `text.length * fontSize * 0.56`.
 * That ratio only holds for Latin script at roughly-average character width.
 * It undershoots for wide scripts (Devanagari, Tamil, Bengali) and overshoots
 * for narrow ones, so cards in those languages either overflow the card or
 * get needlessly squeezed.
 *
 * This measures real glyph width via an offscreen canvas, which is accurate
 * for any script the loaded font supports. Call `ensureFontLoaded` (see
 * data/fonts.ts) before measuring text in a non-Latin font so the browser
 * has the webfont available; otherwise measurement silently falls back to
 * the system font for that text and results in occasional flicker on first
 * paint but never renders incorrectly for long.
 */

let measureCtx: CanvasRenderingContext2D | null = null;

function getMeasureContext(): CanvasRenderingContext2D | null {
  if (typeof document === "undefined") return null;
  if (!measureCtx) {
    const canvas = document.createElement("canvas");
    measureCtx = canvas.getContext("2d");
  }
  return measureCtx;
}

export function measureTextWidth(
  text: string,
  fontSize: number,
  fontFamily: string,
  italic = false,
  letterSpacing = 0,
): number {
  const ctx = getMeasureContext();
  if (!ctx) {
    // SSR / no-canvas fallback — same heuristic as before, only used when
    // canvas genuinely isn't available (e.g. during server rendering).
    return text.length * fontSize * 0.56 + Math.max(0, text.length - 1) * letterSpacing;
  }
  ctx.font = `${italic ? "italic " : ""}${fontSize}px ${fontFamily}`;
  const base = ctx.measureText(text).width;
  return base + Math.max(0, text.length - 1) * letterSpacing;
}

/**
 * Returns SVG <text> attributes that squeeze text to fit maxWidth via
 * textLength/lengthAdjust, only when it would otherwise overflow.
 */
export function fitText(
  text: string,
  fontSize: number,
  maxWidth: number,
  fontFamily: string,
  italic = false,
  letterSpacing = 0,
) {
  const width = measureTextWidth(text, fontSize, fontFamily, italic, letterSpacing);
  return width > maxWidth
    ? { textLength: maxWidth, lengthAdjust: "spacingAndGlyphs" as const }
    : {};
}

/** True for scripts that read right-to-left, used to flip layout/anchors. */
export function isRtlText(text: string): boolean {
  return /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/.test(text);
}
