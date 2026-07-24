import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import lzString from "lz-string";
import type {
  CardDesignState,
  DecorationInstance,
  CardPoint,
  CardElementId,
  TextElementId,
  ScriptTextElementId,
  TextLayoutId,
} from "@/types/card-design";
import { TEMPLATES } from "@/data/templates";
import { createDefaultClassicChurchState, createDefaultScriptState } from "@/types/card-design";
import { getShare } from "@/lib/share-store";

const STORAGE_KEY = "wedding-card-design:v1";
const HISTORY_LIMIT = 50;

export const DEFAULT_DESIGN: CardDesignState = {
  templateId: "crimson-court",
  imageBg: "#eee6d5",
  textOffset: 0,

  groom: "Benjamin",
  bride: "Harriet",
  date: "Saturday, June 12, 2026",
  time: "Half past four in the afternoon",
  venue: "Presidio Chapel · San Francisco",

  eyebrow: "Together with their families",
  intro: "request the honour of your presence at the marriage of",
  reception: "Reception to follow",
  rsvp: "Kindly reply by May 1, 2026",
  closing: "impressionscards.in/demo",

  bodyFontId: "signika",
  nameFontId: "playball",
  textColor: "",
  nameSize: 46,

  verseId: "",
  customVerse: "",

  icons: [],
  monograms: [
    { key: "mono-church-1", defId: "church-monogram", position: { x: 200, y: 386 }, scale: 0.45 },
    { key: "mono-clock-1", defId: "clock-monogram", position: { x: 335, y: 384 }, scale: 0.45 },
  ],

  mapsUrl: "",
  showQr: false,
  qrOffsetX: 0,
  qrOffsetY: 0,

  textLayoutId: "classic",
  classicChurch: createDefaultClassicChurchState(),
  scriptLayout: createDefaultScriptState(),
};

type Action =
  | {
      type: "SET_FIELD";
      field: keyof CardDesignState;
      value: CardDesignState[keyof CardDesignState];
    }
  | { type: "SET_TEMPLATE"; templateId: string }
  | {
      type: "ADD_DECORATION";
      kind: "icons" | "monograms";
      defId: string;
      position: { x: number; y: number };
    }
  | {
      type: "UPDATE_DECORATION";
      kind: "icons" | "monograms";
      key: string;
      patch: Partial<DecorationInstance>;
    }
  | { type: "REMOVE_DECORATION"; kind: "icons" | "monograms"; key: string }
  | { type: "LOAD"; state: CardDesignState }
  | { type: "RESET" }
  | { type: "SET_TEXT_LAYOUT"; layoutId: TextLayoutId }
  | { type: "SET_CHURCH_TEXT"; elementId: TextElementId; value: string }
  | { type: "UPDATE_CHURCH_POSITION"; elementId: CardElementId; point: CardPoint }
  | { type: "TOGGLE_CHURCH_ELEMENT"; elementId: CardElementId }
  | { type: "RESET_CHURCH_POSITIONS" }
  | { type: "SET_SCRIPT_TEXT"; elementId: ScriptTextElementId; value: string }
  | { type: "UPDATE_SCRIPT_POSITION"; elementId: ScriptTextElementId; point: CardPoint }
  | { type: "TOGGLE_SCRIPT_ELEMENT"; elementId: ScriptTextElementId }
  | { type: "RESET_SCRIPT_POSITIONS" };

function reducer(state: CardDesignState, action: Action): CardDesignState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_TEMPLATE":
      return { ...state, templateId: action.templateId };
    case "ADD_DECORATION": {
      const key = `${action.defId}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
      const instance: DecorationInstance = {
        key,
        defId: action.defId,
        position: action.position,
        scale: 0.45,
      };
      return { ...state, [action.kind]: [...state[action.kind], instance] };
    }
    case "UPDATE_DECORATION": {
      const list = state[action.kind].map((d) =>
        d.key === action.key ? { ...d, ...action.patch } : d,
      );
      return { ...state, [action.kind]: list };
    }
    case "REMOVE_DECORATION": {
      const list = state[action.kind].filter((d) => d.key !== action.key);
      return { ...state, [action.kind]: list };
    }
    case "LOAD":
      return action.state;
    case "RESET":
      return {
        ...DEFAULT_DESIGN,
        classicChurch: createDefaultClassicChurchState(),
        scriptLayout: createDefaultScriptState(),
      };
    case "SET_TEXT_LAYOUT":
      return { ...state, textLayoutId: action.layoutId };
    case "SET_CHURCH_TEXT":
      return {
        ...state,
        classicChurch: {
          ...state.classicChurch,
          text: { ...state.classicChurch.text, [action.elementId]: action.value },
        },
      };
    case "UPDATE_CHURCH_POSITION":
      return {
        ...state,
        classicChurch: {
          ...state.classicChurch,
          positions: { ...state.classicChurch.positions, [action.elementId]: { ...action.point } },
        },
      };
    case "TOGGLE_CHURCH_ELEMENT": {
      const hidden = state.classicChurch.hiddenElements;
      const isHidden = hidden.includes(action.elementId);
      return {
        ...state,
        classicChurch: {
          ...state.classicChurch,
          hiddenElements: isHidden
            ? hidden.filter((id) => id !== action.elementId)
            : [...hidden, action.elementId],
        },
      };
    }
    case "RESET_CHURCH_POSITIONS":
      return {
        ...state,
        classicChurch: {
          ...state.classicChurch,
          positions: { ...DEFAULT_DESIGN.classicChurch.positions },
        },
      };
    case "SET_SCRIPT_TEXT":
      return {
        ...state,
        scriptLayout: {
          ...state.scriptLayout,
          text: { ...state.scriptLayout.text, [action.elementId]: action.value },
        },
      };
    case "UPDATE_SCRIPT_POSITION":
      return {
        ...state,
        scriptLayout: {
          ...state.scriptLayout,
          positions: { ...state.scriptLayout.positions, [action.elementId]: { ...action.point } },
        },
      };
    case "TOGGLE_SCRIPT_ELEMENT": {
      const hidden = state.scriptLayout.hiddenElements;
      const isHidden = hidden.includes(action.elementId);
      return {
        ...state,
        scriptLayout: {
          ...state.scriptLayout,
          hiddenElements: isHidden
            ? hidden.filter((id) => id !== action.elementId)
            : [...hidden, action.elementId],
        },
      };
    }
    case "RESET_SCRIPT_POSITIONS":
      return {
        ...state,
        scriptLayout: {
          ...state.scriptLayout,
          positions: { ...DEFAULT_DESIGN.scriptLayout.positions },
        },
      };
    default:
      return state;
  }
}

const LOADING_SHARE: CardDesignState = {
  ...DEFAULT_DESIGN,
  textLayoutId: "classic" as TextLayoutId,
};

function loadInitialState(): CardDesignState {
  if (typeof window === "undefined") return DEFAULT_DESIGN;
  try {
    const params = new URLSearchParams(window.location.search);
    const designParam = params.get("design");
    if (designParam) {
      const json =
        lzString.decompressFromEncodedURIComponent(designParam) ?? window.atob(designParam);
      const decoded = JSON.parse(json);
      return { ...DEFAULT_DESIGN, ...decoded };
    }
    if (params.has("d")) {
      return LOADING_SHARE;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_DESIGN,
        ...parsed,
        monograms: Array.isArray(parsed.monograms) ? parsed.monograms : DEFAULT_DESIGN.monograms,
        classicChurch: parsed.classicChurch ?? createDefaultClassicChurchState(),
        scriptLayout: parsed.scriptLayout ?? createDefaultScriptState(),
      };
    }
  } catch {
    // Corrupt/unreadable saved state — fall back to defaults rather than crash.
  }
  return DEFAULT_DESIGN;
}

export function encodeDesignForUrl(state: CardDesignState): string {
  return lzString.compressToEncodedURIComponent(JSON.stringify(state));
}

function useCardDesignReducer() {
  const [present, dispatch] = useReducer(reducer, undefined, loadInitialState);
  const past = useRef<CardDesignState[]>([]);
  const future = useRef<CardDesignState[]>([]);
  const skipHistory = useRef(false);
  const shareLoaded = useRef(false);
  const initialShareLoaded = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const key = params.get("d");
    if (!key) return;
    getShare({ data: { key } }).then((result) => {
      if (result) {
        shareLoaded.current = true;
        initialShareLoaded.current = true;
        skipHistory.current = true;
        dispatch({ type: "LOAD", state: { ...DEFAULT_DESIGN, ...result } });
      }
    });
  }, []);

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

  useEffect(() => {
    if (initialShareLoaded.current) {
      initialShareLoaded.current = false;
      return;
    }
    if (shareLoaded.current || !new URLSearchParams(window.location.search).has("d")) {
      const id = window.setTimeout(() => {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(present));
        } catch {
          // Quota exceeded or storage disabled — non-fatal, just skip autosave.
        }
      }, 400);
      return () => window.clearTimeout(id);
    }
  }, [present]);

  const setField = useCallback(
    <K extends keyof CardDesignState>(field: K, value: CardDesignState[K]) =>
      dispatch({ type: "SET_FIELD", field, value }),
    [],
  );

  const setTemplate = useCallback(
    (templateId: string) => dispatch({ type: "SET_TEMPLATE", templateId }),
    [],
  );

  const addDecoration = useCallback(
    (
      kind: "icons" | "monograms",
      defId: string,
      position: { x: number; y: number } = { x: 200, y: 280 },
    ) => dispatch({ type: "ADD_DECORATION", kind, defId, position }),
    [],
  );
  const updateDecoration = useCallback(
    (kind: "icons" | "monograms", key: string, patch: Partial<DecorationInstance>) =>
      dispatch({ type: "UPDATE_DECORATION", kind, key, patch }),
    [],
  );
  const removeDecoration = useCallback(
    (kind: "icons" | "monograms", key: string) =>
      dispatch({ type: "REMOVE_DECORATION", kind, key }),
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

  const setTextLayout = useCallback(
    (layoutId: TextLayoutId) => dispatch({ type: "SET_TEXT_LAYOUT", layoutId }),
    [],
  );

  const setChurchText = useCallback(
    (elementId: TextElementId, value: string) =>
      dispatch({ type: "SET_CHURCH_TEXT", elementId, value }),
    [],
  );
  const updateChurchPosition = useCallback(
    (elementId: CardElementId, point: CardPoint) =>
      dispatch({ type: "UPDATE_CHURCH_POSITION", elementId, point }),
    [],
  );
  const toggleChurchElement = useCallback(
    (elementId: CardElementId) => dispatch({ type: "TOGGLE_CHURCH_ELEMENT", elementId }),
    [],
  );
  const resetChurchPositions = useCallback(() => dispatch({ type: "RESET_CHURCH_POSITIONS" }), []);

  const setScriptText = useCallback(
    (elementId: ScriptTextElementId, value: string) =>
      dispatch({ type: "SET_SCRIPT_TEXT", elementId, value }),
    [],
  );
  const updateScriptPosition = useCallback(
    (elementId: ScriptTextElementId, point: CardPoint) =>
      dispatch({ type: "UPDATE_SCRIPT_POSITION", elementId, point }),
    [],
  );
  const toggleScriptElement = useCallback(
    (elementId: ScriptTextElementId) => dispatch({ type: "TOGGLE_SCRIPT_ELEMENT", elementId }),
    [],
  );
  const resetScriptPositions = useCallback(() => dispatch({ type: "RESET_SCRIPT_POSITIONS" }), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      )
        return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  const stateValue = useMemo(
    () => ({
      state: present,
      canUndo: past.current.length > 0,
      canRedo: future.current.length > 0,
    }),
    [present],
  );

  const dispatchValue = useMemo(
    () => ({
      setField,
      setTemplate,
      addDecoration,
      updateDecoration,
      removeDecoration,
      undo,
      redo,
      reset,
      setTextLayout,
      setChurchText,
      updateChurchPosition,
      toggleChurchElement,
      resetChurchPositions,
      setScriptText,
      updateScriptPosition,
      toggleScriptElement,
      resetScriptPositions,
    }),
    [
      setField,
      setTemplate,
      addDecoration,
      updateDecoration,
      removeDecoration,
      undo,
      redo,
      reset,
      setTextLayout,
      setChurchText,
      updateChurchPosition,
      toggleChurchElement,
      resetChurchPositions,
      setScriptText,
      updateScriptPosition,
      toggleScriptElement,
      resetScriptPositions,
    ],
  );

  return { stateValue, dispatchValue };
}

type CardDesignStateValue = {
  state: CardDesignState;
  canUndo: boolean;
  canRedo: boolean;
};

const CardDesignStateContext = createContext<CardDesignStateValue | null>(null);

const CardDesignDispatchContext = createContext<{
  setField: <K extends keyof CardDesignState>(field: K, value: CardDesignState[K]) => void;
  setTemplate: (templateId: string) => void;
  addDecoration: (
    kind: "icons" | "monograms",
    defId: string,
    position?: { x: number; y: number },
  ) => void;
  updateDecoration: (
    kind: "icons" | "monograms",
    key: string,
    patch: Partial<DecorationInstance>,
  ) => void;
  removeDecoration: (kind: "icons" | "monograms", key: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  setTextLayout: (layoutId: TextLayoutId) => void;
  setChurchText: (elementId: TextElementId, value: string) => void;
  updateChurchPosition: (elementId: CardElementId, point: CardPoint) => void;
  toggleChurchElement: (elementId: CardElementId) => void;
  resetChurchPositions: () => void;
  setScriptText: (elementId: ScriptTextElementId, value: string) => void;
  updateScriptPosition: (elementId: ScriptTextElementId, point: CardPoint) => void;
  toggleScriptElement: (elementId: ScriptTextElementId) => void;
  resetScriptPositions: () => void;
} | null>(null);

export function CardDesignProvider({ children }: { children: React.ReactNode }) {
  const { stateValue, dispatchValue } = useCardDesignReducer();
  return (
    <CardDesignDispatchContext.Provider value={dispatchValue}>
      <CardDesignStateContext.Provider value={stateValue}>
        {children}
      </CardDesignStateContext.Provider>
    </CardDesignDispatchContext.Provider>
  );
}

export function useCardDesignState() {
  const ctx = useContext(CardDesignStateContext);
  if (!ctx) throw new Error("useCardDesignState must be used within a CardDesignProvider");
  return ctx;
}

export function useCardDesignDispatch() {
  const ctx = useContext(CardDesignDispatchContext);
  if (!ctx) throw new Error("useCardDesignDispatch must be used within a CardDesignProvider");
  return ctx;
}

export function useCardDesign() {
  const { state, canUndo, canRedo } = useCardDesignState();
  const dispatch = useCardDesignDispatch();
  return { state, ...dispatch, canUndo, canRedo };
}
