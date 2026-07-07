import type { FontDef } from "@/types/card-design";

/**
 * Fonts are tagged with the scripts they cover so the UI can hide fonts
 * that will silently fall back to a system font (e.g. offering "Romantic
 * Script" — a Latin display face — for Tamil or Arabic text produces a
 * broken-looking card). Add a Noto Sans/Serif family per script as you
 * bring on more languages; they're free, comprehensive, and pair well.
 */
export const FONTS: FontDef[] = [
  {
    id: "serif",
    label: "Display Serif",
    family: '"DM Serif Display", serif',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "script",
    label: "Romantic Script",
    family: '"Dancing Script", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "sans",
    label: "Modern Sans",
    family: '"Inter", sans-serif',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "mono",
    label: "Editorial Mono",
    family: 'ui-monospace, "Menlo", monospace',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "noto-devanagari",
    label: "Noto Serif Devanagari",
    family: '"Noto Serif Devanagari", serif',
    italic: false,
    scripts: ["devanagari", "latin"],
  },
  {
    id: "noto-arabic",
    label: "Noto Naskh Arabic",
    family: '"Noto Naskh Arabic", serif',
    italic: false,
    scripts: ["arabic", "latin"],
  },
  {
    id: "noto-tamil",
    label: "Noto Serif Tamil",
    family: '"Noto Serif Tamil", serif',
    italic: false,
    scripts: ["tamil", "latin"],
  },
  {
    id: "noto-hebrew",
    label: "Noto Serif Hebrew",
    family: '"Noto Serif Hebrew", serif',
    italic: false,
    scripts: ["hebrew", "latin"],
  },
  {
    id: "noto-gurmukhi",
    label: "Noto Serif Gurmukhi",
    family: '"Noto Serif Gurmukhi", serif',
    italic: false,
    scripts: ["gurmukhi", "latin"],
  },
];

export function getFont(id: string): FontDef {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}

/**
 * Load the corresponding Noto family from Google Fonts on demand, so the
 * base bundle isn't paying for every script up front. Call this when a user
 * picks a font whose scripts include something other than "latin".
 */
const loadedFontStylesheets = new Set<string>();
export function ensureFontLoaded(font: FontDef) {
  if (typeof document === "undefined") return;
  if (font.scripts.every((s) => s === "latin")) return;
  if (loadedFontStylesheets.has(font.id)) return;

  const familyParam = font.family
    .split(",")[0]
    .replace(/['"]/g, "")
    .trim()
    .replace(/\s+/g, "+");
  const italicParam = font.italic ? "1" : "0";
  const href = `https://fonts.googleapis.com/css2?family=${familyParam}:ital,wght@0,400;0,600;${italicParam},400;${italicParam},600&display=swap`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
  loadedFontStylesheets.add(font.id);
}
