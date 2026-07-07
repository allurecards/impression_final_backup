import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import type { CardDesignState, DecorationInstance } from "@/types/card-design";
import { TEMPLATES } from "@/data/templates";

const STORAGE_KEY = "wedding-card-design:v1";
const HISTORY_LIMIT = 50;

export const DEFAULT_DESIGN: CardDesignState = {
  templateId: TEMPLATES[0].id,
  imageBg: "#eee6d5",
  textOffset: 0,

  groom: "Benjamin",
  bride: "Harriet",
  date: "Saturday, June 12, 2026",
  time: "Half past four in the afternoon",
  venue: "Presidio Chapel · San Francisco",

  showAllLines: false,
  eyebrow: "Together with their families",
  intro: "request the honour of your presence at the marriage of",
  reception: "Reception to follow",
  rsvp: "Kindly reply by May 1, 2026",
  closing: "impressionscards.in/demo",

  bodyFontId: "sans",
  nameFontId: "serif",
  textColor: "",
  nameSize: 46,

  verseId: "",
  customVerse: "",

  icons: [
    { key: "icon-flower-1", defId: "flower", position: { x: 200, y: 42 }, scale: 0.45 },
  ],
  monograms: [],

  mapsUrl: "",
  showQr: false,
  qrOffsetX: 0,
  qrOffsetY: 0,
};

type Action =
  | { type: "SET_FIELD"; field: keyof CardDesignState; value: CardDesignState[keyof CardDesignState] }
  | { type: "SET_TEMPLATE"; templateId: string }
  | { type: "ADD_DECORATION"; kind: "icons" | "monograms"; defId: string; position: { x: number; y: number } }
  | { type: "UPDATE_DECORATION"; kind: "icons" | "monograms"; key: string; patch: Partial<DecorationInstance> }
  | { type: "REMOVE_DECORATION"; kind: "icons" | "monograms"; key: string }
  | { type: "LOAD"; state: CardDesignState }
  | { type: "RESET" };

function reducer(state: CardDesignState, action: Action): CardDesignState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_TEMPLATE":
      return { ...state, templateId: action.templateId };
    case "ADD_DECORATION": {
      const key = `${action.defId}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
      const instance: DecorationInstance = { key, defId: action.defId, position: action.position, scale: 0.45 };
      return { ...state, [action.kind]: [...state[action.kind], instance] };
    }
    case "UPDATE_DECORATION": {
      const list = state[action.kind].map((d) => (d.key === action.key ? { ...d, ...action.patch } : d));
      return { ...state, [action.kind]: list };
    }
    case "REMOVE_DECORATION": {
      const list = state[action.kind].filter((d) => d.key !== action.key);
      return { ...state, [action.kind]: list };
    }
    case "LOAD":
      return action.state;
    case "RESET":
      return DEFAULT_DESIGN;
    default:
      return state;
  }
}

function loadInitialState(): CardDesignState {
  if (typeof window === "undefined") return DEFAULT_DESIGN;
  try {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("design");
    if (shared) {
      const binary = window.atob(shared);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      const decoded = JSON.parse(new TextDecoder().decode(bytes));
      return { ...DEFAULT_DESIGN, ...decoded };
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_DESIGN, ...JSON.parse(saved) };
  } catch {
    // Corrupt/unreadable saved state — fall back to defaults rather than crash.
  }
  return DEFAULT_DESIGN;
}

/**
 * Encodes the design as a URL-safe base64 string for shareable links, e.g.
 *   `${location.origin}/customize?design=${encodeDesignForUrl(state)}`
 * For very large designs (many decorations), swap this for storing the JSON
 * server-side (Vercel KV/Postgres) keyed by a short id instead of inlining
 * it in the URL.
 */
export function encodeDesignForUrl(state: CardDesignState): string {
  const bytes = new TextEncoder().encode(JSON.stringify(state));
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return window.btoa(binary);
}

export function useCardDesignState() {
  const [present, dispatch] = useReducer(reducer, undefined, loadInitialState);
  const past = useRef<CardDesignState[]>([]);
  const future = useRef<CardDesignState[]>([]);
  const skipHistory = useRef(false);

  // Push to undo history on every change except undo/redo/load themselves.
  const prevRef = useRef(present);
  useEffect(() => {
    if (skipHistory.current) {
      skipHistory.current = false;
    } else if (prevRef.current !== present) {
      past.current = [...past.current.slice(-HISTORY_LIMIT + 1), prevRef.current];
      future.current = [];
    }
    prevRef.current = present;
  }, [present]);

  // Debounced autosave to localStorage.
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(present));
      } catch {
        // Quota exceeded or storage disabled — non-fatal, just skip autosave.
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [present]);

  const setField = useCallback(
    <K extends keyof CardDesignState>(field: K, value: CardDesignState[K]) =>
      dispatch({ type: "SET_FIELD", field, value }),
    [],
  );

  const setTemplate = useCallback((templateId: string) => dispatch({ type: "SET_TEMPLATE", templateId }), []);

  const addDecoration = useCallback(
    (kind: "icons" | "monograms", defId: string, position: { x: number; y: number } = { x: 200, y: 280 }) =>
      dispatch({ type: "ADD_DECORATION", kind, defId, position }),
    [],
  );
  const updateDecoration = useCallback(
    (kind: "icons" | "monograms", key: string, patch: Partial<DecorationInstance>) =>
      dispatch({ type: "UPDATE_DECORATION", kind, key, patch }),
    [],
  );
  const removeDecoration = useCallback(
    (kind: "icons" | "monograms", key: string) => dispatch({ type: "REMOVE_DECORATION", kind, key }),
    [],
  );

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(present);
    skipHistory.current = true;
    dispatch({ type: "LOAD", state: prev });
  }, [present]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(present);
    skipHistory.current = true;
    dispatch({ type: "LOAD", state: next });
  }, [present]);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return useMemo(
    () => ({
      state: present,
      setField,
      setTemplate,
      addDecoration,
      updateDecoration,
      removeDecoration,
      undo,
      redo,
      reset,
      canUndo: past.current.length > 0,
      canRedo: future.current.length > 0,
    }),
    [present, setField, setTemplate, addDecoration, updateDecoration, removeDecoration, undo, redo, reset],
  );
}

type CardDesignContextValue = ReturnType<typeof useCardDesignState>;
const CardDesignContext = createContext<CardDesignContextValue | null>(null);

export function CardDesignProvider({ children }: { children: React.ReactNode }) {
  const value = useCardDesignState();
  return <CardDesignContext.Provider value={value}>{children}</CardDesignContext.Provider>;
}

export function useCardDesign() {
  const ctx = useContext(CardDesignContext);
  if (!ctx) throw new Error("useCardDesign must be used within a CardDesignProvider");
  return ctx;
}
