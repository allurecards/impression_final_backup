/**
 * Core types for the wedding card customizer.
 *
 * Design decisions worth knowing about:
 * - Templates/monograms/icons are DATA, not code. New designs are added by
 *   appending to a JSON/DB record + uploading an asset — never by editing
 *   a component. See src/data/*.ts for the (swappable) in-repo source.
 * - Icons & monograms are stored as arrays of `DecorationInstance`, not
 *   fixed record<key, ...> shapes. That means a user can place the SAME
 *   icon twice, delete one, add a third — the old version hard-coded one
 *   instance per icon type.
 */

export type TextAnchors = {
  eyebrow: number;
  intro: number;
  groomBase: number;
  ampBase: number;
  brideBase: number;
  dividerBase: number;
  dateBase: number;
  timeBase: number;
  venueBase: number;
  verseBase: number;
  verseRefBase: number;
  qrBase: number;
  qrLabelBase: number;
  footerBase: number;
  closingBase: number;
};

export type TemplateCategory =
  | "classic"
  | "botanical"
  | "romantic"
  | "modern"
  | "coastal"
  | "christian"
  | "hindu"
  | "muslim"
  | "sikh"
  | "jewish"
  | "secular";

export type Template = {
  id: string;
  label: string;
  type: "image" | "svg";
  /** Categories used for the filter UI. A template can belong to more than one. */
  categories: TemplateCategory[];
  /**
   * URL to the background artwork (Vercel Blob / CDN URL in production).
   * Left undefined for "svg" type templates, which are drawn from bg/panel/etc.
   */
  imageSrc?: string;
  /** Small thumbnail for the picker grid — falls back to imageSrc if omitted. */
  thumbSrc?: string;
  bg?: string;
  panel?: string;
  accent?: string;
  ink?: string;
  border?: string;
  textAnchors?: TextAnchors;
  /** Text direction the template's script family favors. Drives RTL layout. */
  direction?: "ltr" | "rtl";
};

export type FontDef = {
  id: string;
  label: string;
  family: string;
  italic: boolean;
  /** Scripts this font renders well. Used to filter font choices per language. */
  scripts: Array<"latin" | "devanagari" | "arabic" | "tamil" | "hebrew" | "gurmukhi">;
};

export type IconDef = {
  id: string;
  label: string;
  /** SVG path data, drawn in a 100x100 viewBox centered at (50,50). */
  path: string;
  /** Whether the shape is normally filled (e.g. a heart) vs stroked only. */
  fillable: boolean;
};

export type MonogramDef = {
  id: string;
  label: string;
  src: string;
  categories: TemplateCategory[];
};

export type VerseTradition =
  | "christian"
  | "hindu"
  | "muslim"
  | "jewish"
  | "sikh"
  | "secular";

export type Verse = {
  id: string;
  tradition: VerseTradition;
  ref: string;
  text: string;
};

export type Placement = { x: number; y: number };

export type DecorationInstance = {
  /** Unique instance id — NOT the same as defId, since one icon can appear twice. */
  key: string;
  defId: string;
  position: Placement;
  scale: number;
  color?: string;
};

export type ExportStatus = "idle" | "exporting" | "success" | "error";

export type CardDesignState = {
  templateId: string;
  imageBg: string;
  textOffset: number;

  groom: string;
  bride: string;
  date: string;
  time: string;
  venue: string;

  showAllLines: boolean;
  eyebrow: string;
  intro: string;
  reception: string;
  rsvp: string;
  closing: string;

  bodyFontId: string;
  nameFontId: string;
  textColor: string;
  nameSize: number;

  verseId: string;
  customVerse: string;

  icons: DecorationInstance[];
  monograms: DecorationInstance[];

  mapsUrl: string;
  showQr: boolean;
  qrOffsetX: number;
  qrOffsetY: number;
};

export const DEFAULT_ANCHORS: TextAnchors = {
  eyebrow: 116,
  intro: 140,
  groomBase: 142,
  ampBase: 175,
  brideBase: 220,
  dividerBase: 250,
  dateBase: 272,
  timeBase: 290,
  venueBase: 316,
  verseBase: 356,
  verseRefBase: 372,
  qrBase: 384,
  qrLabelBase: 458,
  footerBase: 476,
  closingBase: 488,
};

export const IMAGE_ANCHORS: TextAnchors = {
  eyebrow: 146,
  intro: 170,
  groomBase: 172,
  ampBase: 205,
  brideBase: 250,
  dividerBase: 280,
  dateBase: 302,
  timeBase: 320,
  venueBase: 346,
  verseBase: 386,
  verseRefBase: 402,
  qrBase: 414,
  qrLabelBase: 488,
  footerBase: 506,
  closingBase: 518,
};
