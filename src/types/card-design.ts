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
 * - Three text layouts are supported: "simple" (existing flat fields),
 *   "classic" (structured church card with full detail), and "script"
 *   (flowing calligraphy-style layout). All three can render on any
 *   template/background, and decorations (icons/monograms) + QR are
 *   layout-independent.
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
  categories: TemplateCategory[];
  imageSrc?: string;
  thumbSrc?: string;
  bg?: string;
  panel?: string;
  accent?: string;
  ink?: string;
  border?: string;
  textAnchors?: TextAnchors;
  direction?: "ltr" | "rtl";
  aspectRatio?: CanvasAspectId;
};

export type FontDef = {
  id: string;
  label: string;
  family: string;
  italic: boolean;
  scripts: Array<"latin" | "devanagari" | "arabic" | "tamil" | "hebrew" | "gurmukhi">;
};

export type IconDef = {
  id: string;
  label: string;
  path: string;
  fillable: boolean;
};

export type MonogramDef = {
  id: string;
  label: string;
  src: string;
  categories: TemplateCategory[];
};

export type VerseTradition = "christian" | "hindu" | "muslim" | "jewish" | "sikh" | "secular";

export type Verse = {
  id: string;
  tradition: VerseTradition;
  ref: string;
  text: string;
};

export type Placement = { x: number; y: number };
export type CardPoint = Placement;

export type DecorationInstance = {
  key: string;
  defId: string;
  position: Placement;
  scale: number;
  color?: string;
};

export type ExportStatus = "idle" | "exporting" | "success" | "error";

/* ------------------------------------------------------------------ */
/* Layout One — detailed church card (31 text fields + graphics)      */
/* ------------------------------------------------------------------ */

export type TextElementId =
  | "quoteLine1"
  | "quoteLine2"
  | "hostNames"
  | "hostAddressLine1"
  | "hostAddressLine2"
  | "inviteLine1"
  | "inviteLine2"
  | "inviteLine3"
  | "groomName"
  | "ampersand"
  | "brideName"
  | "brideDetailsLine1"
  | "brideDetailsLine2"
  | "solemnisedLine"
  | "dateNumber"
  | "dateMonthYear"
  | "dateDay"
  | "venueName"
  | "venueCity"
  | "timeAt"
  | "timeValue"
  | "lunchLine1"
  | "lunchLine2"
  | "sharingHappiness";

export type GraphicElementId = "leftDivider" | "rightDivider";

export type CardElementId = TextElementId | GraphicElementId;

export type CardPositions = Record<CardElementId, CardPoint>;
export type CardText = Record<TextElementId, string>;

export interface ClassicChurchCardState {
  text: CardText;
  positions: CardPositions;
  hiddenElements: CardElementId[];
}

export const DEFAULT_POSITIONS: CardPositions = {
  quoteLine1: { x: 200, y: 40 },
  quoteLine2: { x: 200, y: 56 },
  hostNames: { x: 200, y: 91 },
  hostAddressLine1: { x: 200, y: 108 },
  hostAddressLine2: { x: 200, y: 124 },
  inviteLine1: { x: 200, y: 158 },
  inviteLine2: { x: 200, y: 176 },
  inviteLine3: { x: 200, y: 194 },
  groomName: { x: 200, y: 221 },
  ampersand: { x: 200, y: 247 },
  brideName: { x: 200, y: 273 },
  brideDetailsLine1: { x: 200, y: 298 },
  brideDetailsLine2: { x: 200, y: 315 },
  solemnisedLine: { x: 200, y: 348 },
  dateNumber: { x: 65, y: 389 },
  dateMonthYear: { x: 65, y: 421 },
  dateDay: { x: 65, y: 436 },
  leftDivider: { x: 132, y: 405 },
  venueName: { x: 200, y: 421 },
  venueCity: { x: 200, y: 436 },
  rightDivider: { x: 268, y: 405 },
  timeAt: { x: 335, y: 414 },
  timeValue: { x: 335, y: 436 },
  lunchLine1: { x: 200, y: 478 },
  lunchLine2: { x: 200, y: 496 },
  sharingHappiness: { x: 200, y: 532 },
};

export const DEFAULT_TEXT: CardText = {
  quoteLine1: "'I hold you in my heart for we have shared together",
  quoteLine2: "God's blessings' (Philippians 1:7)",
  hostNames: "Mr. C.P. Varunny & Mrs. Rosy Varunny",
  hostAddressLine1: "Thattil Chettupuzhakkaran House",
  hostAddressLine2: "Mannuthy, Thrissur",
  inviteLine1: "We cordially invite your esteemed presence",
  inviteLine2: "with family on the auspicious occasion of",
  inviteLine3: "the marriage of our son",
  groomName: "Varghese",
  ampersand: "&",
  brideName: "Lisha",
  brideDetailsLine1: "D/o Mr. Mathew A.V & Mrs. Lucy Mathew",
  brideDetailsLine2: "Anthikatt House, Kuriachira, Thrissur",
  solemnisedLine: "which will Deo Volente be solemnised on",
  dateNumber: "14",
  dateMonthYear: "FEBRUARY 2026",
  dateDay: "SATURDAY",
  venueName: "ST. ANTONY'S CHURCH",
  venueCity: "MANNUTHY",
  timeAt: "@",
  timeValue: "11.30 AM",
  lunchLine1: "and thereafter for lunch at",
  lunchLine2: "St. Antony's Parish Hall, Mannuthy",
  sharingHappiness: "Sharing the happiness:  William",
};

export const TEXT_ELEMENT_IDS: TextElementId[] = Object.keys(DEFAULT_TEXT) as TextElementId[];
export const GRAPHIC_ELEMENT_IDS: GraphicElementId[] = ["leftDivider", "rightDivider"];
export const ALL_ELEMENT_IDS: CardElementId[] = [...TEXT_ELEMENT_IDS, ...GRAPHIC_ELEMENT_IDS];

export const createDefaultClassicChurchState = (): ClassicChurchCardState => ({
  text: { ...DEFAULT_TEXT },
  positions: { ...DEFAULT_POSITIONS },
  hiddenElements: [],
});

export interface ChurchSection {
  id: string;
  label: string;
  fields: TextElementId[];
}

export const CHURCH_SECTIONS: ChurchSection[] = [
  { id: "bible-verse", label: "Bible Verse", fields: ["quoteLine1", "quoteLine2"] },
  { id: "host", label: "Host", fields: ["hostNames", "hostAddressLine1", "hostAddressLine2"] },
  { id: "invitation", label: "Invitation", fields: ["inviteLine1", "inviteLine2", "inviteLine3"] },
  {
    id: "bride-details",
    label: "Bride Details",
    fields: ["brideDetailsLine1", "brideDetailsLine2"],
  },
  { id: "solemnised", label: "Solemnised", fields: ["solemnisedLine"] },
  {
    id: "date-venue",
    label: "Date & Venue",
    fields: ["dateNumber", "dateMonthYear", "dateDay", "venueName", "venueCity"],
  },
  { id: "time", label: "Time", fields: ["timeAt", "timeValue"] },
  { id: "lunch", label: "Lunch", fields: ["lunchLine1", "lunchLine2"] },
  { id: "sharing", label: "Sharing Happiness", fields: ["sharingHappiness"] },
];

export const FIELD_LABELS: Record<TextElementId, string> = {
  quoteLine1: "Verse line 1",
  quoteLine2: "Verse line 2",
  hostNames: "Host names",
  hostAddressLine1: "Address line 1",
  hostAddressLine2: "Address line 2",
  inviteLine1: "Invitation line 1",
  inviteLine2: "Invitation line 2",
  inviteLine3: "Invitation line 3",
  groomName: "Groom",
  ampersand: "Ampersand",
  brideName: "Bride",
  brideDetailsLine1: "Bride details 1",
  brideDetailsLine2: "Bride details 2",
  solemnisedLine: "Solemnised on",
  dateNumber: "Date",
  dateMonthYear: "Month & year",
  dateDay: "Day",
  venueName: "Venue name",
  venueCity: "Venue city",
  timeAt: "At",
  timeValue: "Time",
  lunchLine1: "Lunch line 1",
  lunchLine2: "Lunch line 2",
  sharingHappiness: "Sharing the happiness",
};

/* ------------------------------------------------------------------ */
/* Layout Two — flowing script-style layout (text only, no graphics)   */
/* ------------------------------------------------------------------ */

export type ScriptTextElementId =
  | "quoteLine1"
  | "quoteLine2"
  | "hostNames"
  | "hostAddress"
  | "inviteLine1"
  | "inviteLine2"
  | "groomName"
  | "brideName"
  | "brideDetailsLine1"
  | "brideDetailsLine2"
  | "solemnisedLine"
  | "dateTimeLine"
  | "churchName"
  | "churchDetails"
  | "receptionLine"
  | "receptionVenue"
  | "sharingHappiness";

export type ScriptPositions = Record<ScriptTextElementId, CardPoint>;
export type ScriptText = Record<ScriptTextElementId, string>;

export interface ScriptCardState {
  text: ScriptText;
  positions: ScriptPositions;
  hiddenElements: ScriptTextElementId[];
}

export const DEFAULT_SCRIPT_POSITIONS: ScriptPositions = {
  quoteLine1: { x: 200, y: 37 },
  quoteLine2: { x: 200, y: 57 },
  hostNames: { x: 200, y: 104 },
  hostAddress: { x: 200, y: 126 },
  inviteLine1: { x: 200, y: 165 },
  inviteLine2: { x: 200, y: 187 },
  groomName: { x: 200, y: 231 },
  brideName: { x: 200, y: 265 },
  brideDetailsLine1: { x: 200, y: 313 },
  brideDetailsLine2: { x: 200, y: 335 },
  solemnisedLine: { x: 200, y: 375 },
  dateTimeLine: { x: 200, y: 397 },
  churchName: { x: 200, y: 417 },
  churchDetails: { x: 200, y: 438 },
  receptionLine: { x: 200, y: 459 },
  receptionVenue: { x: 200, y: 481 },
  sharingHappiness: { x: 200, y: 521 },
};

export const DEFAULT_SCRIPT_TEXT: ScriptText = {
  quoteLine1: "I have found the one whom my soul loves",
  quoteLine2: "Song of Solomon 3:4",
  hostNames: "Mrs. Sheely Davis & Mr. Davis C H",
  hostAddress: "Chalissery House, Valakkavu, Thrissur",
  inviteLine1: "Cordially request the honour of your presence with family",
  inviteLine2: "on the auspicious occasion of the marriage of our son",
  groomName: "George",
  brideName: "Smitha",
  brideDetailsLine1: "D/o. Mrs. Deena Savio & Mr. Savio M H",
  brideDetailsLine2: "Maliyekkal House, Puthur, Thrissur",
  solemnisedLine: "which will Deo Volente be solemnized",
  dateTimeLine: "on Monday 21st September 2026 at 10.30 am",
  churchName: "at Our Lady of Lourdes Metropolitan Cathedral,",
  churchDetails: "East Fort, Thrissur at 12.00pm",
  receptionLine: "followed by reception",
  receptionVenue: "at Lourdes Centenary Hall, Thrissur",
  sharingHappiness: "Sharing the happiness: Arun",
};

export const SCRIPT_TEXT_ELEMENT_IDS: ScriptTextElementId[] = Object.keys(
  DEFAULT_SCRIPT_TEXT,
) as ScriptTextElementId[];

export const createDefaultScriptState = (): ScriptCardState => ({
  text: { ...DEFAULT_SCRIPT_TEXT },
  positions: { ...DEFAULT_SCRIPT_POSITIONS },
  hiddenElements: [],
});

export interface ScriptSection {
  id: string;
  label: string;
  fields: ScriptTextElementId[];
}

export const SCRIPT_SECTIONS: ScriptSection[] = [
  { id: "script-quote", label: "Bible Verse", fields: ["quoteLine1", "quoteLine2"] },
  { id: "script-host", label: "Host", fields: ["hostNames", "hostAddress"] },
  { id: "script-invitation", label: "Invitation", fields: ["inviteLine1", "inviteLine2"] },
  {
    id: "script-bride-details",
    label: "Bride Details",
    fields: ["brideDetailsLine1", "brideDetailsLine2"],
  },
  {
    id: "script-ceremony",
    label: "Ceremony",
    fields: ["solemnisedLine", "dateTimeLine", "churchName", "churchDetails"],
  },
  { id: "script-reception", label: "Reception", fields: ["receptionLine", "receptionVenue"] },
  { id: "script-sharing", label: "Sharing Happiness", fields: ["sharingHappiness"] },
];

export const SCRIPT_FIELD_LABELS: Record<ScriptTextElementId, string> = {
  quoteLine1: "Verse line 1",
  quoteLine2: "Verse line 2 (reference)",
  hostNames: "Host names",
  hostAddress: "Host address",
  inviteLine1: "Invitation line 1",
  inviteLine2: "Invitation line 2",
  groomName: "Groom",
  brideName: "Bride",
  brideDetailsLine1: "Bride details 1",
  brideDetailsLine2: "Bride details 2",
  solemnisedLine: "Solemnised line",
  dateTimeLine: "Date & time",
  churchName: "Church name",
  churchDetails: "Church details",
  receptionLine: "Reception line",
  receptionVenue: "Reception venue",
  sharingHappiness: "Sharing the happiness",
};

export const SCRIPT_TEXT_STYLES: Record<
  ScriptTextElementId,
  { size: number; weight?: number; ls?: number; isName?: boolean }
> = {
  quoteLine1: { size: 10.2 },
  quoteLine2: { size: 10.5 },
  hostNames: { size: 12.2 },
  hostAddress: { size: 10.9 },
  inviteLine1: { size: 10.5 },
  inviteLine2: { size: 10.4 },
  groomName: { size: 35, ls: 1.5, isName: true },
  brideName: { size: 35, ls: 1.5, isName: true },
  brideDetailsLine1: { size: 10.7 },
  brideDetailsLine2: { size: 10.6 },
  solemnisedLine: { size: 10.5 },
  dateTimeLine: { size: 10.5 },
  churchName: { size: 10.3 },
  churchDetails: { size: 10.5 },
  receptionLine: { size: 10.2 },
  receptionVenue: { size: 10.4 },
  sharingHappiness: { size: 10.7 },
};

export type TextLayoutId = "classic" | "script";

export const TEXT_LAYOUTS: { id: TextLayoutId; label: string; description: string }[] = [
  {
    id: "classic",
    label: "Layout One",
    description: "Structured layout with date box, venue block and icons.",
  },
  { id: "script", label: "Layout Two", description: "Flowing script-style invitation, text only." },
];

/* ------------------------------------------------------------------ */
/* Template canvas sizing                                              */
/* ------------------------------------------------------------------ */

export type CanvasAspectId = "portrait-5-7" | "square-1-1" | "portrait-4-5" | "story-9-16";

export const CANVAS_SIZES: Record<CanvasAspectId, { width: number; height: number }> = {
  "portrait-5-7": { width: 400, height: 560 },
  "square-1-1": { width: 480, height: 480 },
  "portrait-4-5": { width: 400, height: 500 },
  "story-9-16": { width: 400, height: 711 },
};

export const DEFAULT_CANVAS_ASPECT: CanvasAspectId = "portrait-5-7";

export const DESIGN_SPACE = { width: 400, height: 560 } as const;

/* ------------------------------------------------------------------ */
/* Top-level state                                                     */
/* ------------------------------------------------------------------ */

export type CardDesignState = {
  templateId: string;
  imageBg: string;
  textOffset: number;

  groom: string;
  bride: string;
  date: string;
  time: string;
  venue: string;

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

  textLayoutId: TextLayoutId;
  classicChurch: ClassicChurchCardState;
  scriptLayout: ScriptCardState;
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
