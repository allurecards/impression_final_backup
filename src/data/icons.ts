import type { IconDef } from "@/types/card-design";

export const ICON_DEFS: IconDef[] = [
  {
    id: "cross",
    label: "Cross",
    path: "M50 18 L50 82 M30 36 L70 36",
    fillable: false,
  },
  {
    id: "flower",
    label: "Flower",
    path: "M50 30 a10 10 0 1 1 0 0.1 M50 50 a10 10 0 1 1 0 0.1 M40 40 a10 10 0 1 1 0 0.1 M60 40 a10 10 0 1 1 0 0.1",
    fillable: false,
  },
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
    id: "leaf",
    label: "Leaf",
    path: "M50 20 C 70 30, 70 60, 50 82 C 30 60, 30 30, 50 20 Z M50 20 L50 82",
    fillable: true,
  },
  {
    id: "star",
    label: "Star",
    path: "M50 20 L58 42 L82 42 L62 56 L70 78 L50 64 L30 78 L38 56 L18 42 L42 42 Z",
    fillable: true,
  },

  // ── New icons (appended) ──────────────────────────────────────────────
  {
    id: "lotus-icon",
    label: "Lotus",
    path: "M50 75 C 35 75 25 62 25 48 C 35 48 45 58 50 70 C 55 58 65 48 75 48 C 75 62 65 75 50 75 Z M50 75 C 42 65 39 52 39 40 C 46 45 50 55 50 65 C 50 55 54 45 61 40 C 61 52 58 65 50 75 Z",
    fillable: true,
  },
  {
    id: "diya-icon",
    label: "Diya Lamp",
    path: "M20 58 Q50 72 80 58 Q72 48 50 48 Q28 48 20 58 Z M50 48 C 46 38 53 32 50 24 C 47 32 54 38 50 48 Z",
    fillable: true,
  },
  {
    id: "peacock-feather",
    label: "Peacock Feather",
    path: "M50 20 C 60 30 62 45 50 55 C 38 45 40 30 50 20 Z M50 55 L50 82 M42 60 L40 70 M58 60 L60 70",
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
  return ICON_DEFS.find((i) => i.id === id);
}