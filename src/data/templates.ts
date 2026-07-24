import { DEFAULT_ANCHORS, IMAGE_ANCHORS, type Template } from "@/types/card-design";
import paisleyPoppy from "@/assets/customizable/templates/paisley-poppy.png";
import goldenMandala from "@/assets/customizable/templates/golden-mandala.png";
import rosewoodBlossom from "@/assets/customizable/templates/rosewood-blossom.png";
import saffronSilk from "@/assets/customizable/templates/saffron-silk.png";
import velvetRose from "@/assets/customizable/templates/velvet-rose.png";
import marigoldTrail from "@/assets/customizable/templates/marigold-trail.png";
import crimsonCourt from "@/assets/customizable/templates/crimson-court.png";
import jasmineNight from "@/assets/customizable/templates/jasmine-night.png";
import amberGlow from "@/assets/customizable/templates/amber-glow.png";
import peacockPlume from "@/assets/customizable/templates/peacock-plume.png";
import gildedArch from "@/assets/customizable/templates/gilded-arch.png";

/**
 * Template registry.
 *
 * In this file templates are a static array so the app works out of the box.
 * To scale past ~20 templates, swap this for a fetch from an API route
 * backed by a database (Vercel Postgres / Supabase) so that:
 *   - non-engineers can add templates through an admin UI
 *   - `imageSrc` points at Vercel Blob instead of bundled imports
 *   - the picker can paginate/filter server-side instead of shipping every
 *     template's metadata in the client bundle
 *
 * Example swap:
 *   export async function fetchTemplates(): Promise<Template[]> {
 *     const res = await fetch("/api/templates");
 *     return res.json();
 *   }
 * and in the picker component, use it via a data-fetching hook (e.g. SWR/
 * TanStack Query) instead of importing TEMPLATES directly.
 */
export const TEMPLATES: Template[] = [
  {
    id: "saffron",
    label: "Saffron & Marigold",
    type: "svg",
    categories: ["hindu", "modern"],
    bg: "#fdf1dd",
    panel: "#fff9f0",
    accent: "#b3401f",
    ink: "#7a2a10",
    border: "#e08a1e",
  },
  {
    id: "paisley-poppy",
    label: "Paisley Poppy",
    type: "image",
    categories: ["classic"],
    imageSrc: paisleyPoppy,
    thumbSrc: paisleyPoppy,
    accent: "#1a1a1a",
    ink: "#1a1a1a",
    textAnchors: IMAGE_ANCHORS,
  },
  {
    id: "golden-mandala",
    label: "Golden Mandala",
    type: "image",
    categories: ["classic"],
    imageSrc: goldenMandala,
    thumbSrc: goldenMandala,
    accent: "#1a1a1a",
    ink: "#1a1a1a",
    textAnchors: IMAGE_ANCHORS,
  },
  {
    id: "rosewood-blossom",
    label: "Rosewood Blossom",
    type: "image",
    categories: ["classic"],
    imageSrc: rosewoodBlossom,
    thumbSrc: rosewoodBlossom,
    accent: "#1a1a1a",
    ink: "#1a1a1a",
    textAnchors: IMAGE_ANCHORS,
  },
  {
    id: "saffron-silk",
    label: "Saffron Silk",
    type: "image",
    categories: ["classic"],
    imageSrc: saffronSilk,
    thumbSrc: saffronSilk,
    accent: "#1a1a1a",
    ink: "#1a1a1a",
    textAnchors: IMAGE_ANCHORS,
  },
  {
    id: "velvet-rose",
    label: "Velvet Rose",
    type: "image",
    categories: ["classic"],
    imageSrc: velvetRose,
    thumbSrc: velvetRose,
    accent: "#1a1a1a",
    ink: "#1a1a1a",
    textAnchors: IMAGE_ANCHORS,
  },
  {
    id: "marigold-trail",
    label: "Marigold Trail",
    type: "image",
    categories: ["classic"],
    imageSrc: marigoldTrail,
    thumbSrc: marigoldTrail,
    accent: "#1a1a1a",
    ink: "#1a1a1a",
    textAnchors: IMAGE_ANCHORS,
  },
  {
    id: "crimson-court",
    label: "Crimson Court",
    type: "image",
    categories: ["classic"],
    imageSrc: crimsonCourt,
    thumbSrc: crimsonCourt,
    accent: "#1a1a1a",
    ink: "#1a1a1a",
    textAnchors: IMAGE_ANCHORS,
  },
  {
    id: "jasmine-night",
    label: "Jasmine Night",
    type: "image",
    categories: ["classic"],
    imageSrc: jasmineNight,
    thumbSrc: jasmineNight,
    accent: "#1a1a1a",
    ink: "#1a1a1a",
    textAnchors: IMAGE_ANCHORS,
  },
  {
    id: "amber-glow",
    label: "Amber Glow",
    type: "image",
    categories: ["classic"],
    imageSrc: amberGlow,
    thumbSrc: amberGlow,
    accent: "#1a1a1a",
    ink: "#1a1a1a",
    textAnchors: IMAGE_ANCHORS,
  },
  {
    id: "peacock-plume",
    label: "Peacock Plume",
    type: "image",
    categories: ["classic"],
    imageSrc: peacockPlume,
    thumbSrc: peacockPlume,
    accent: "#1a1a1a",
    ink: "#1a1a1a",
    textAnchors: IMAGE_ANCHORS,
  },
  {
    id: "gilded-arch",
    label: "Gilded Arch",
    type: "image",
    categories: ["classic"],
    imageSrc: gildedArch,
    thumbSrc: gildedArch,
    accent: "#1a1a1a",
    ink: "#1a1a1a",
    textAnchors: IMAGE_ANCHORS,
  },

  // ── New designs (appended — nothing above was changed) ──────────────────

  {
    id: "kumkum-gold",
    label: "Kumkum & Gold",
    type: "svg",
    categories: ["hindu", "classic"],
    bg: "#3b0f0f",
    panel: "#fdece1",
    accent: "#8a1538",
    ink: "#4a0d0d",
    border: "#caa25a",
  },
  {
    id: "peacock-royal",
    label: "Peacock Royal",
    type: "svg",
    categories: ["hindu", "modern"],
    bg: "#0b3d3a",
    panel: "#f4efe1",
    accent: "#0f6b5c",
    ink: "#123a34",
    border: "#c9a227",
  },
  {
    id: "marigold-court",
    label: "Marigold Court",
    type: "svg",
    categories: ["hindu", "romantic"],
    bg: "#fff3d6",
    panel: "#fffaf0",
    accent: "#c1440e",
    ink: "#7a3b00",
    border: "#e8a33d",
  },
  {
    id: "lotus-bloom",
    label: "Lotus Bloom",
    type: "svg",
    categories: ["hindu", "botanical"],
    bg: "#fdf2f6",
    panel: "#fffdfd",
    accent: "#b23a6a",
    ink: "#5e1f3a",
    border: "#d98fae",
  },
  {
    id: "ivory-mint",
    label: "Ivory & Mint",
    type: "svg",
    categories: ["modern", "secular"],
    bg: "#f2f7f4",
    panel: "#ffffff",
    accent: "#2f6f5e",
    ink: "#20342d",
    border: "#9dc4b6",
  },
  {
    id: "onyx-gold",
    label: "Onyx & Gold",
    type: "svg",
    categories: ["modern", "classic"],
    bg: "#111111",
    panel: "#1c1c1c",
    accent: "#d4af37",
    ink: "#f2e9d8",
    border: "#d4af37",
  },
];

export function getTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export function anchorsFor(template: Template) {
  return template.textAnchors ?? (template.type === "image" ? IMAGE_ANCHORS : DEFAULT_ANCHORS);
}

export const TEMPLATE_CATEGORY_LABELS: Record<string, string> = {
  classic: "Classic",
  botanical: "Botanical",
  romantic: "Romantic",
  modern: "Modern",
  coastal: "Coastal",
  christian: "Christian",
  hindu: "Hindu",
  muslim: "Muslim",
  sikh: "Sikh",
  jewish: "Jewish",
  secular: "Secular",
};
