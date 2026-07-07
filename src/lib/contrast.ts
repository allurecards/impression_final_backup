function hexToRgb(hex: string): [number, number, number] | null {
  const s = hex.trim();
  const match = /^#?([a-f\d]{3}|[a-f\d]{6})(?:[a-f\d]{2})?$/i.exec(s);
  if (!match) return null;
  let h = match[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG-style contrast ratio between two hex colors, 1 (none) to 21 (max). Returns null if either color can't be parsed. */
export function contrastRatio(hexA: string, hexB: string): number | null {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return null;
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Below this ratio, text starts to become genuinely hard to read at small sizes. */
export const MIN_LEGIBLE_CONTRAST = 2.2;
