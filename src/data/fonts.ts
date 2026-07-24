import type { FontDef } from "@/types/card-design";

export const BODY_FONTS: FontDef[] = [
  {
    id: "signika",
    label: "Signika Light",
    family: '"Signika", sans-serif',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "louis-george-cafe",
    label: "Louis George Cafe Light",
    family: '"Louis George Cafe Light", sans-serif',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "eb-garamond",
    label: "Century751 BT",
    family: '"EB Garamond", serif',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "cinzel",
    label: "TRAJAN PRO",
    family: '"Cinzel", serif',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "alegreya",
    label: "Book Antiqua",
    family: '"Alegreya", serif',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "nunito-sans",
    label: "Trebuchet MS",
    family: '"Nunito Sans", sans-serif',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "zen-kaku",
    label: "Yu Gothic",
    family: '"Zen Kaku Gothic New", sans-serif',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "caveat",
    label: "Pristina",
    family: '"Caveat", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "alex-brush",
    label: "Monotype Corsiva",
    family: '"Alex Brush", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "arizonia",
    label: "ZapfChan Md BT",
    family: '"Arizonia", cursive',
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

export const NAME_FONTS: FontDef[] = [
  {
    id: "playball",
    label: "Playball",
    family: '"Playball", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "als-script",
    label: "ALS Script",
    family: '"ALS Script", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "allura",
    label: "Allura",
    family: '"Allura", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "great-vibes",
    label: "Great Vibes",
    family: '"Great Vibes", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "pinyon-script",
    label: "Pinyon Script",
    family: '"Pinyon Script", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "lovers-quarrel",
    label: "Lovers Quarrel",
    family: '"Lovers Quarrel", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "caveat-name",
    label: "Shining Times",
    family: '"Caveat", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "alex-brush-name",
    label: "Astallya Script",
    family: '"Alex Brush", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "arizonia-name",
    label: "Athum Thin",
    family: '"Arizonia", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "allura-alt",
    label: "Atmelina asley",
    family: '"Allura", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "great-vibes-alt",
    label: "Stellina",
    family: '"Great Vibes", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "pinyon-alt",
    label: "Snell Roundhand",
    family: '"Pinyon Script", cursive',
    italic: false,
    scripts: ["latin"],
  },
  {
    id: "caveat-alt",
    label: "Chalisa Oktavia",
    family: '"Caveat", cursive',
    italic: false,
    scripts: ["latin"],
  },
];

export const FONTS: FontDef[] = [...BODY_FONTS, ...NAME_FONTS];

export function getFont(id: string): FontDef {
  return FONTS.find((f) => f.id === id) ?? BODY_FONTS[0];
}

const loadedFontStylesheets = new Set<string>();
export function ensureFontLoaded(font: FontDef) {
  if (typeof document === "undefined") return;
  if (font.scripts.every((s) => s === "latin")) return;
  if (loadedFontStylesheets.has(font.id)) return;

  const familyParam = font.family.split(",")[0].replace(/['"]/g, "").trim().replace(/\s+/g, "+");
  const italicParam = font.italic ? "1" : "0";
  const href = `https://fonts.googleapis.com/css2?family=${familyParam}:ital,wght@0,400;0,600;${italicParam},400;${italicParam},600&display=swap`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
  loadedFontStylesheets.add(font.id);
}
