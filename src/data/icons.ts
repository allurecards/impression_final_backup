import type { IconDef } from "@/types/card-design";

export const ICON_DEFS: IconDef[] = [
  {
    id: "heart",
    label: "Heart",
    path: "M50 78 C 20 58, 20 30, 40 30 C 50 30, 50 42, 50 42 C 50 42, 50 30, 60 30 C 80 30, 80 58, 50 78 Z",
    fillable: true,
  },
  {
    id: "ring",
    label: "Ring",
    path: "M50 60 a14 14 0 1 1 0.01 0 M50 36 l-6 -10 h12 z",
    fillable: false,
  },
  {
    id: "bell",
    label: "Bell",
    path: "M50 25 C 62 25 68 40 68 55 L74 65 L26 65 L32 55 C 32 40 38 25 50 25 Z M42 70 a8 8 0 0 0 16 0",
    fillable: false,
  },
];

export function getIconDef(id: string): IconDef | undefined {
  const found = ICON_DEFS.find((i) => i.id === id);
  if (!found) console.warn(`[icons] No icon definition found for id "${id}"`);
  return found;
}
