import { forwardRef, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { useCardDesign } from "@/hooks/use-card-design";
import { useDraggableOnSvg } from "@/hooks/use-draggable";
import { getTemplate } from "@/data/templates";
import { getFont } from "@/data/fonts";
import { getIconDef } from "@/data/icons";
import { getMonogramDef } from "@/data/monograms";
import { generateQrDataUrl, normalizeMapsUrl } from "@/lib/qr";
import { mergeRefs } from "@/lib/merge-refs";
import {
  SCRIPT_TEXT_ELEMENT_IDS,
  SCRIPT_TEXT_STYLES,
  CANVAS_SIZES,
  DEFAULT_CANVAS_ASPECT,
  DESIGN_SPACE,
  type CardElementId,
  type TextElementId,
  type ScriptTextElementId,
  type CardPoint,
} from "@/types/card-design";

type Selection =
  | { kind: "core"; id: CardElementId }
  | { kind: "script"; id: ScriptTextElementId }
  | { kind: "icon" | "monogram"; key: string }
  | null;

type DragTarget =
  { scope: "core"; id: CardElementId } | { scope: "script"; id: ScriptTextElementId };

export const CardSvg = forwardRef<SVGSVGElement, { className?: string }>(function CardSvg(
  { className },
  forwardedRef,
) {
  const { state, updateDecoration, removeDecoration, updateChurchPosition, updateScriptPosition } =
    useCardDesign();

  const template = getTemplate(state.templateId);
  const bodyFont = getFont(state.bodyFontId);
  const nameFont = getFont(state.nameFontId);
  const ink = state.textColor || template.ink || "#000000";
  const accent = template.accent || ink;
  const border = template.border || "#00000055";

  const isClassicLayout = state.textLayoutId === "classic";
  const church = state.classicChurch;
  const script = state.scriptLayout;

  /* ── QR generation ── */
  const normalizedMapsUrl = useMemo(() => normalizeMapsUrl(state.mapsUrl), [state.mapsUrl]);
  const [qrDataUrl, setQrDataUrl] = useState("");
  useEffect(() => {
    let cancelled = false;
    if (!state.showQr || !normalizedMapsUrl) {
      setQrDataUrl("");
      return;
    }
    generateQrDataUrl(normalizedMapsUrl, { darkColor: ink }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [state.showQr, normalizedMapsUrl, ink]);

  /* ── Canvas sizing ── */
  const canvas = CANVAS_SIZES[template.aspectRatio ?? DEFAULT_CANVAS_ASPECT];
  const { scale, offsetX, offsetY } = useMemo(() => {
    const s = Math.min(canvas.width / DESIGN_SPACE.width, canvas.height / DESIGN_SPACE.height);
    return {
      scale: s,
      offsetX: (canvas.width - DESIGN_SPACE.width * s) / 2,
      offsetY: (canvas.height - DESIGN_SPACE.height * s) / 2,
    };
  }, [canvas.width, canvas.height]);

  /* ── Dragging & selection ── */
  const svgLocalRef = useRef<SVGSVGElement | null>(null);
  const {
    beginDrag,
    onPointerMove: onDecoMove,
    onPointerUp: onDecoUp,
    isDragging,
    draggedKey,
  } = useDraggableOnSvg(svgLocalRef);

  const [drag, setDrag] = useState<{
    target: DragTarget;
    pointerId: number;
    startPointer: CardPoint;
    startPosition: CardPoint;
  } | null>(null);

  const [selected, setSelected] = useState<Selection>(null);

  useEffect(() => {
    setSelected(null);
  }, [state.textLayoutId]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      )
        return;
      setSelected((sel) => {
        if (sel && (sel.kind === "icon" || sel.kind === "monogram")) {
          e.preventDefault();
          removeDecoration(sel.kind === "icon" ? "icons" : "monograms", sel.key);
          return null;
        }
        return sel;
      });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [removeDecoration]);

  /* ── Text drag ── */
  const toSvgPoint = (clientX: number, clientY: number): CardPoint => {
    const svg = svgLocalRef.current;
    if (!svg) return { x: 0, y: 0 };
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const local = pt.matrixTransform(m.inverse());
    return { x: local.x, y: local.y };
  };

  const startTextDrag = (e: PointerEvent<SVGGElement>, target: DragTarget) => {
    e.stopPropagation();
    setSelected(
      target.scope === "core" ? { kind: "core", id: target.id } : { kind: "script", id: target.id },
    );
    const svg = svgLocalRef.current;
    svg?.setPointerCapture(e.pointerId);
    const startPosition =
      target.scope === "core" ? church.positions[target.id] : script.positions[target.id];
    setDrag({
      target,
      pointerId: e.pointerId,
      startPointer: toSvgPoint(e.clientX, e.clientY),
      startPosition,
    });
  };

  const handlePointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const cur = toSvgPoint(e.clientX, e.clientY);
    const deltaDesign = {
      x: (cur.x - drag.startPointer.x) / scale,
      y: (cur.y - drag.startPointer.y) / scale,
    };
    const next = {
      x: drag.startPosition.x + deltaDesign.x,
      y: drag.startPosition.y + deltaDesign.y,
    };
    if (drag.target.scope === "core") updateChurchPosition(drag.target.id, next);
    else updateScriptPosition(drag.target.id, next);
  };

  const stopTextDrag = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (svgLocalRef.current?.hasPointerCapture(e.pointerId)) {
      svgLocalRef.current.releasePointerCapture(e.pointerId);
    }
    setDrag(null);
  };

  const handleSvgMove = (e: PointerEvent<SVGSVGElement>) => {
    handlePointerMove(e);
    onDecoMove(e);
  };

  const handleSvgUp = (e: PointerEvent<SVGSVGElement>) => {
    stopTextDrag(e);
    onDecoUp(e);
  };

  const designYFor = (id: CardElementId) => church.positions[id].y + state.textOffset;
  const designScriptYFor = (id: ScriptTextElementId) => script.positions[id].y + state.textOffset;

  /* ── Classic text rendering ── */
  const classicTextStyles: Record<
    TextElementId,
    { size: number; weight?: number; ls?: number; script?: boolean }
  > = {
    quoteLine1: { size: 9.4, weight: 500 },
    quoteLine2: { size: 9.4, weight: 500 },
    hostNames: { size: 10.5, weight: 500 },
    hostAddressLine1: { size: 9.7, weight: 500 },
    hostAddressLine2: { size: 9.7, weight: 500 },
    inviteLine1: { size: 10.4, weight: 500 },
    inviteLine2: { size: 10.4, weight: 500 },
    inviteLine3: { size: 10.4, weight: 500 },
    groomName: { size: state.nameSize, script: true, weight: 400 },
    ampersand: { size: 22, script: true, weight: 400 },
    brideName: { size: state.nameSize, script: true, weight: 400 },
    brideDetailsLine1: { size: 9.8, weight: 500 },
    brideDetailsLine2: { size: 9.8, weight: 500 },
    solemnisedLine: { size: 10.1, weight: 500 },
    dateNumber: { size: 37, weight: 400, ls: 0.4 },
    dateMonthYear: { size: 8.3, weight: 600, ls: 0.15 },
    dateDay: { size: 8.3, weight: 600, ls: 0.15 },
    venueName: { size: 8.1, weight: 600, ls: 0.1 },
    venueCity: { size: 8.2, weight: 600, ls: 0.15 },
    timeAt: { size: 12, weight: 600, script: true },
    timeValue: { size: 8.8, weight: 600, ls: 0.1 },
    lunchLine1: { size: 10.1, weight: 500 },
    lunchLine2: { size: 10.1, weight: 500 },
    sharingHappiness: { size: 9.5, weight: 500 },
  };

  const renderClassicText = (id: TextElementId) => {
    if (church.hiddenElements.includes(id)) return null;
    const dp = { x: church.positions[id].x, y: designYFor(id) };
    const cp = { x: offsetX + dp.x * scale, y: offsetY + dp.y * scale };
    const st = classicTextStyles[id];
    const ff = st.script ? nameFont.family : bodyFont.family;
    const italic = st.script ? nameFont.italic : bodyFont.italic;
    const sel = selected?.kind === "core" && selected.id === id;
    return (
      <g
        key={id}
        onPointerDown={(e) => startTextDrag(e, { scope: "core", id })}
        style={{ cursor: "move" }}
      >
        {sel && (
          <>
            <line
              x1={cp.x - 60 * scale}
              x2={cp.x + 60 * scale}
              y1={cp.y}
              y2={cp.y}
              stroke={accent}
              strokeDasharray="2 2"
              strokeWidth="0.6"
              pointerEvents="none"
            />
            <circle cx={cp.x} cy={cp.y} fill={accent} r="2.2" pointerEvents="none" />
          </>
        )}
        <text
          x={cp.x}
          y={cp.y}
          fill={ink}
          fontFamily={ff}
          fontStyle={italic ? "italic" : "normal"}
          fontSize={st.size * scale}
          fontWeight={st.weight}
          letterSpacing={(st.ls ?? 0) * scale}
          textAnchor="middle"
          dominantBaseline="middle"
          pointerEvents="visiblePainted"
          style={{ userSelect: "none" }}
        >
          {church.text[id]}
        </text>
      </g>
    );
  };

  const renderScriptText = (id: ScriptTextElementId) => {
    if (script.hiddenElements.includes(id)) return null;
    const dp = { x: script.positions[id].x, y: designScriptYFor(id) };
    const cp = { x: offsetX + dp.x * scale, y: offsetY + dp.y * scale };
    const st = SCRIPT_TEXT_STYLES[id];
    const fontSize = (st.isName ? state.nameSize : st.size) * scale;
    const sel = selected?.kind === "script" && selected.id === id;
    return (
      <g
        key={id}
        onPointerDown={(e) => startTextDrag(e, { scope: "script", id })}
        style={{ cursor: "move" }}
      >
        {sel && (
          <>
            <line
              x1={cp.x - 60 * scale}
              x2={cp.x + 60 * scale}
              y1={cp.y}
              y2={cp.y}
              stroke={accent}
              strokeDasharray="2 2"
              strokeWidth="0.6"
              pointerEvents="none"
            />
            <circle cx={cp.x} cy={cp.y} fill={accent} r="2.2" pointerEvents="none" />
          </>
        )}
        <text
          x={cp.x}
          y={cp.y}
          fill={ink}
          fontFamily={nameFont.family}
          fontStyle={nameFont.italic ? "italic" : "normal"}
          fontSize={fontSize}
          fontWeight={st.weight ?? 400}
          letterSpacing={(st.ls ?? 0) * scale}
          textAnchor="middle"
          dominantBaseline="middle"
          pointerEvents="visiblePainted"
          style={{ userSelect: "none" }}
        >
          {script.text[id]}
        </text>
      </g>
    );
  };

  const renderDivider = (id: "leftDivider" | "rightDivider") => {
    if (church.hiddenElements.includes(id)) return null;
    const cp = { x: offsetX + church.positions[id].x * scale, y: offsetY + designYFor(id) * scale };
    const sel = selected?.kind === "core" && selected.id === id;
    const half = 34 * scale;
    return (
      <g
        key={id}
        onPointerDown={(e) => startTextDrag(e, { scope: "core", id })}
        style={{ cursor: "move" }}
      >
        <line
          x1={cp.x}
          x2={cp.x}
          y1={cp.y - half}
          y2={cp.y + half}
          stroke={ink}
          strokeWidth="0.8"
        />
        {sel && (
          <rect
            x={cp.x - 4}
            y={cp.y - half - 4}
            width="8"
            height={half * 2 + 8}
            fill="none"
            stroke={accent}
            strokeDasharray="2 2"
            strokeWidth="0.7"
            pointerEvents="none"
          />
        )}
      </g>
    );
  };

  /* ── Background ── */
  const renderBackground = () => {
    if (template.type === "image" && template.imageSrc) {
      return (
        <image
          href={template.imageSrc}
          x="0"
          y="0"
          width={canvas.width}
          height={canvas.height}
          preserveAspectRatio="xMidYMid slice"
        />
      );
    }
    return (
      <>
        <rect
          x="0"
          y="0"
          width={canvas.width}
          height={canvas.height}
          fill={template.bg || "#ffffff"}
        />
        <rect
          x="14"
          y="14"
          width={canvas.width - 28}
          height={canvas.height - 28}
          fill={template.panel || "#ffffff"}
        />
        <rect
          x="22"
          y="22"
          width={canvas.width - 44}
          height={canvas.height - 44}
          fill="none"
          stroke={border}
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        <rect
          x="26"
          y="26"
          width={canvas.width - 52}
          height={canvas.height - 52}
          fill="none"
          stroke={border}
          strokeOpacity="0.25"
          strokeWidth="0.5"
        />
      </>
    );
  };

  /* ── QR ── */
  const qrBaseX = canvas.width - 70;
  const qrBaseY2 = canvas.height - 90;

  /* ── Decorations ── */
  const renderDecorations = () => (
    <>
      {state.icons.map((inst) => {
        const def = getIconDef(inst.defId);
        if (!def) return null;
        const isActive = isDragging && draggedKey === inst.key;
        const isSel = selected?.kind === "icon" && selected.key === inst.key;
        return (
          <g key={inst.key} transform={`translate(${inst.position.x} ${inst.position.y})`}>
            <circle
              cx="0"
              cy="0"
              r={Math.max(24, Math.round(50 * inst.scale))}
              fill="transparent"
              stroke="none"
              pointerEvents="all"
              style={{ cursor: "grab", touchAction: "none" }}
              onPointerDown={(e) => {
                setSelected({ kind: "icon", key: inst.key });
                beginDrag(e, inst.key, inst.position, inst.scale, (x, y) =>
                  updateDecoration("icons", inst.key, { position: { x, y } }),
                );
              }}
              onDoubleClick={() => removeDecoration("icons", inst.key)}
            />
            <g
              transform={`scale(${inst.scale}) translate(-50 -50)`}
              fill="none"
              stroke={inst.color || accent}
              strokeOpacity={isActive ? 0.55 : 0.7}
              strokeWidth="1.4"
              opacity={isActive ? 0.85 : undefined}
            >
              <path
                d={def.path}
                fill={def.fillable ? inst.color || accent : "transparent"}
                fillOpacity={def.fillable ? (isActive ? 0.5 : 0.65) : 0}
                pointerEvents="none"
              />
            </g>
            {isSel && (
              <circle
                cx="0"
                cy="0"
                r={Math.max(28, Math.round(56 * inst.scale))}
                fill="none"
                stroke={accent}
                strokeDasharray="2 2"
                strokeWidth="0.7"
                pointerEvents="none"
              />
            )}
          </g>
        );
      })}
      {state.monograms.map((inst) => {
        const def = getMonogramDef(inst.defId);
        if (!def) return null;
        const isActive = isDragging && draggedKey === inst.key;
        const isSel = selected?.kind === "monogram" && selected.key === inst.key;
        return (
          <g key={inst.key} transform={`translate(${inst.position.x} ${inst.position.y})`}>
            <rect
              x="-50"
              y="-50"
              width="100"
              height="100"
              fill="transparent"
              stroke="none"
              pointerEvents="all"
              style={{ cursor: "grab" }}
              onPointerDown={(e) => {
                setSelected({ kind: "monogram", key: inst.key });
                beginDrag(e, inst.key, inst.position, inst.scale, (x, y) =>
                  updateDecoration("monograms", inst.key, { position: { x, y } }),
                );
              }}
              onDoubleClick={() => removeDecoration("monograms", inst.key)}
            />
            <g transform={`scale(${inst.scale})`} color={ink} opacity={isActive ? 0.85 : undefined}>
              <image
                href={def.src}
                x="-50"
                y="-50"
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid meet"
                pointerEvents="none"
              />
            </g>
            {isSel && (
              <rect
                x={-52 * inst.scale}
                y={-52 * inst.scale}
                width={104 * inst.scale}
                height={104 * inst.scale}
                fill="none"
                stroke={accent}
                strokeDasharray="2 2"
                strokeWidth="0.7"
                pointerEvents="none"
              />
            )}
          </g>
        );
      })}
    </>
  );

  return (
    <svg
      ref={mergeRefs(svgLocalRef, forwardedRef)}
      viewBox={`0 0 ${canvas.width} ${canvas.height}`}
      className={className ?? "mx-auto block w-full max-w-sm rounded-md shadow-2xl"}
      style={{
        aspectRatio: `${canvas.width} / ${canvas.height}`,
        backgroundColor: template.type === "image" ? state.imageBg : template.bg || "#ffffff",
        cursor: isDragging ? "grabbing" : undefined,
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Wedding card design for ${state.groom} & ${state.bride}`}
      tabIndex={0}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setSelected(null);
      }}
      onPointerMove={(e) => {
        handlePointerMove(e);
        onDecoMove(e);
      }}
      onPointerUp={(e) => {
        stopTextDrag(e);
        onDecoUp(e);
      }}
      onPointerCancel={(e) => {
        stopTextDrag(e);
        onDecoUp(e);
      }}
      onLostPointerCapture={() => onDecoUp()}
    >
      {renderBackground()}

      {isClassicLayout ? (
        <>
          {renderClassicText("quoteLine1")}
          {renderClassicText("quoteLine2")}
          {renderClassicText("hostNames")}
          {renderClassicText("hostAddressLine1")}
          {renderClassicText("hostAddressLine2")}
          {renderClassicText("inviteLine1")}
          {renderClassicText("inviteLine2")}
          {renderClassicText("inviteLine3")}
          {renderClassicText("groomName")}
          {renderClassicText("ampersand")}
          {renderClassicText("brideName")}
          {renderClassicText("brideDetailsLine1")}
          {renderClassicText("brideDetailsLine2")}
          {renderClassicText("solemnisedLine")}
          {renderClassicText("dateNumber")}
          {renderClassicText("dateMonthYear")}
          {renderClassicText("dateDay")}
          {renderDivider("leftDivider")}
          {renderClassicText("venueName")}
          {renderClassicText("venueCity")}
          {renderDivider("rightDivider")}
          {renderClassicText("timeAt")}
          {renderClassicText("timeValue")}
          {renderClassicText("lunchLine1")}
          {renderClassicText("lunchLine2")}
          {renderClassicText("sharingHappiness")}
        </>
      ) : (
        <>{SCRIPT_TEXT_ELEMENT_IDS.map(renderScriptText)}</>
      )}

      {/* QR */}
      {qrDataUrl && (
        <g transform={`translate(${qrBaseX + state.qrOffsetX} ${qrBaseY2 + state.qrOffsetY})`}>
          <rect x="0" y="0" width="52" height="52" fill="#fff" stroke={border} strokeWidth="0.6" />
          <image href={qrDataUrl} x="4" y="4" width="44" height="44" />
        </g>
      )}

      {renderDecorations()}
    </svg>
  );
});
