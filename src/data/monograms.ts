import type { MonogramDef } from "@/types/card-design";
import calendar1 from "@/assets/customizable/monograms/calendar1.png";
import calendar2 from "@/assets/customizable/monograms/calendar2.png";
import church from "@/assets/customizable/monograms/church.png";
import ganesh from "@/assets/customizable/monograms/ganesh.png";
import cutlery from "@/assets/customizable/monograms/cutlery.png";

/**
 * Monograms kept as bundled imports for now since they're already in the
 * repo. Once the library grows past a couple dozen, move `src` to Vercel
 * Blob URLs (same pattern as templates.ts) so new monograms can be added
 * without a redeploy, and consider letting users upload their own PNG/SVG —
 * see UploadMonogramButton in ExtrasPanel.tsx for where that plugs in.
 *
 * The new entries below use inline SVG data URIs instead of bundled PNGs —
 * `<image href>` in CardSvg.tsx accepts a data URI exactly like a normal
 * image path, so these plug into the existing render path with zero
 * changes elsewhere. Swap `src` for a Blob URL later if you'd rather ship
 * real artwork for these.
 */

function toDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function radialTicks(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  count: number,
  color: string,
): string {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count;
    const x1 = (cx + rInner * Math.cos(angle)).toFixed(1);
    const y1 = (cy + rInner * Math.sin(angle)).toFixed(1);
    const x2 = (cx + rOuter * Math.cos(angle)).toFixed(1);
    const y2 = (cy + rOuter * Math.sin(angle)).toFixed(1);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.4" />`;
  }).join("");
}

const omSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="46" fill="none" stroke="#b3401f" stroke-width="2" />
  <text x="50" y="68" text-anchor="middle" font-size="56" font-family="'Noto Sans Devanagari','Segoe UI',sans-serif" fill="#b3401f">&#2384;</text>
</svg>`;

const lotusSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g fill="none" stroke="#b23a6a" stroke-width="2">
    <path d="M50 78 C 30 78 18 62 18 46 C 30 46 40 56 50 70 C 60 56 70 46 82 46 C 82 62 70 78 50 78 Z" />
    <path d="M50 78 C 38 66 34 50 34 34 C 44 40 50 52 50 66 C 50 52 56 40 66 34 C 66 50 62 66 50 78 Z" />
    <line x1="50" y1="78" x2="50" y2="92" />
  </g>
</svg>`;

const kalashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g fill="none" stroke="#8a1538" stroke-width="2">
    <path d="M35 55 Q50 40 65 55 L62 82 Q50 90 38 82 Z" />
    <ellipse cx="50" cy="55" rx="15" ry="6" />
    <circle cx="50" cy="34" r="9" />
    <path d="M41 40 Q50 28 59 40" />
    <path d="M30 40 Q40 22 50 40" />
    <path d="M70 40 Q60 22 50 40" />
  </g>
</svg>`;

const diyaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g stroke="#c1440e" stroke-width="2">
    <path d="M20 62 Q50 78 80 62 Q74 50 50 50 Q26 50 20 62 Z" fill="none" />
    <path d="M50 50 C46 38 54 30 50 20 C46 30 54 38 50 50 Z" fill="#c1440e" stroke="none" />
  </g>
</svg>`;

const mandalaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="44" fill="none" stroke="#c9a227" stroke-width="1.2" />
  <circle cx="50" cy="50" r="32" fill="none" stroke="#c9a227" stroke-width="1.2" />
  <circle cx="50" cy="50" r="6" fill="#c9a227" />
  ${radialTicks(50, 50, 32, 44, 16, "#c9a227")}
</svg>`;

export const MONOGRAM_DEFS: MonogramDef[] = [
  { id: "calendar1", label: "Calendar", src: calendar1, categories: ["secular", "classic"] },
  { id: "calendar2", label: "Calendar 2", src: calendar2, categories: ["secular", "classic"] },
  { id: "church", label: "Church", src: church, categories: ["christian"] },
  { id: "ganesh", label: "Ganesh", src: ganesh, categories: ["hindu"] },
  { id: "cutlery", label: "Cutlery", src: cutlery, categories: ["secular", "modern"] },

  // ── New Hindu monograms (appended) ───────────────────────────────────────
  { id: "om", label: "Om", src: toDataUri(omSvg), categories: ["hindu"] },
  {
    id: "lotus-monogram",
    label: "Lotus",
    src: toDataUri(lotusSvg),
    categories: ["hindu", "botanical"],
  },
  { id: "kalash", label: "Kalash", src: toDataUri(kalashSvg), categories: ["hindu"] },
  { id: "diya", label: "Diya Lamp", src: toDataUri(diyaSvg), categories: ["hindu"] },
  {
    id: "mandala-ring",
    label: "Mandala Ring",
    src: toDataUri(mandalaSvg),
    categories: ["hindu", "classic", "modern"],
  },

  // ── Inline church & clock monograms ──────────────────────────────────────
  {
    id: "church-monogram",
    label: "Church",
    src: toDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M18 1.5v5"/><path d="M15.5 4h5"/><path d="m18 7-6 7h12l-6-7Z" fill="currentColor" stroke="none"/><path d="M13 14h10v18H13z" fill="currentColor" stroke="none"/><path d="M5 20h8v12H5zM23 20h8v12h-8z" fill="currentColor" stroke="none"/><path d="M16 23h4v9h-4z" fill="#fff" stroke="none"/><path d="M16 17h4v4h-4z" fill="#fff" stroke="none"/><path d="M3 32h30"/></g></svg>`,
    ),
    categories: ["christian", "classic"],
  },
  {
    id: "clock-monogram",
    label: "Clock",
    src: toDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" transform="translate(0,1)"><circle cx="18" cy="18" r="11.5"/><path d="M18 10v8l5 3"/><path d="m8.5 29-2.5 3M27.5 29l2.5 3"/><path d="M8 7 4 3M28 7l4-4"/><path d="M3.5 6.5a5 5 0 0 1 7-7M32.5 6.5a5 5 0 0 0-7-7"/><path d="M18 4.5V2"/></g></svg>`,
    ),
    categories: ["secular", "classic"],
  },
];

export function getMonogramDef(id: string): MonogramDef | undefined {
  const found = MONOGRAM_DEFS.find((m) => m.id === id);
  if (found) return found;
  const migrated = MONOGRAM_DEFS.find((m) => m.id === id.replace("calender", "calendar"));
  if (migrated) return migrated;
  console.warn(`[monograms] No monogram definition found for id "${id}"`);
  return undefined;
}
