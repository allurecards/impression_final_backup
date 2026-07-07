import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { useCardDesign } from "@/hooks/use-card-design";
import { useDraggableOnSvg } from "@/hooks/use-draggable";
import { getTemplate, anchorsFor } from "@/data/templates";
import { getFont } from "@/data/fonts";
import { getIconDef } from "@/data/icons";
import { getMonogramDef } from "@/data/monograms";
import { versesByTradition, VERSES } from "@/data/verses";
import { fitText } from "@/lib/text-fit";
import { generateQrDataUrl, normalizeMapsUrl } from "@/lib/qr";
import { mergeRefs } from "@/lib/merge-refs";
import type { TextAnchors } from "@/types/card-design";

export const CardSvg = forwardRef<SVGSVGElement, { className?: string }>(function CardSvg(
  { className },
  forwardedRef,
) {
  const { state, updateDecoration, setField } = useCardDesign();
  const template = getTemplate(state.templateId);
  const anchors = anchorsFor(template);
  const ink = state.textColor || template.ink || "#000000";

  const bodyFont = getFont(state.bodyFontId);
  const nameFont = getFont(state.nameFontId);

  const a = (key: keyof TextAnchors): number => anchors[key] + state.textOffset;

  const verse = useMemo(() => {
    if (state.customVerse.trim()) return { text: state.customVerse.trim(), ref: "" };
    const v = VERSES.find((v) => v.id === state.verseId);
    return v ? { text: `"${v.text}"`, ref: v.ref } : null;
  }, [state.verseId, state.customVerse]);

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

  const venueY = a("venueBase") + state.nameSize;
  const verseY = venueY + 24;
  const verseRefY = verseY + 14;
  const qrSize = verse ? 50 : 60;
  const qrBaseY = verse ? verseRefY + 8 : venueY + 18;
  const qrX = 200 - qrSize / 2 + state.qrOffsetX;
  const qrY = qrBaseY + state.qrOffsetY;
  const qrCenterX = 200 + state.qrOffsetX;
  const qrCenterY = qrY + qrSize / 2;
  const qrLabelY = qrY + qrSize + 12;
  const footerY = Math.max(
    a("footerBase") + state.nameSize,
    qrDataUrl ? qrY + qrSize + 28 : verse ? verseRefY + 24 : 0,
  );
  const closingY = Math.max(a("closingBase") + state.nameSize, footerY + 13);

  const svgLocalRef = useRef<SVGSVGElement | null>(null);
  const { beginDrag, onPointerMove, onPointerUp, isDragging, draggedKey } = useDraggableOnSvg(svgLocalRef);

  const qrMoveRef = useRef<((x: number, y: number) => void) | null>(null);
  const qrOffsetRef = useRef<{ sx: number; sy: number } | null>(null);
  const [isQrDragging, setIsQrDragging] = useState(false);

  const handleQrPointerDown = useCallback(
    (e: PointerEvent<SVGRectElement>) => {
      const svg = svgLocalRef.current;
      if (!svg) return;
      e.preventDefault();
      svg.setPointerCapture(e.pointerId);
      const rect = svg.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 400;
      const py = ((e.clientY - rect.top) / rect.height) * 560;
      qrOffsetRef.current = { sx: px - qrCenterX, sy: py - qrCenterY };
      qrMoveRef.current = (x, y) => {
        setField("qrOffsetX", Math.round(x - 200));
        setField("qrOffsetY", Math.round(y - qrBaseY - qrSize / 2));
      };
      setIsQrDragging(true);
    },
    [qrCenterX, qrCenterY, qrBaseY, qrSize, setField],
  );

  const handleSvgPointerMove = useCallback(
    (e: PointerEvent<SVGSVGElement>) => {
      const qrMove = qrMoveRef.current;
      if (qrMove) {
        const svg = svgLocalRef.current;
        if (!svg) return;
        e.preventDefault();
        const rect = svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 400 - (qrOffsetRef.current?.sx ?? 0);
        const y = ((e.clientY - rect.top) / rect.height) * 560 - (qrOffsetRef.current?.sy ?? 0);
        qrMove(x, y);
        return;
      }
      onPointerMove(e);
    },
    [onPointerMove],
  );

  const handleSvgPointerUp = useCallback(
    (e?: PointerEvent<SVGSVGElement>) => {
      if (qrMoveRef.current) {
        qrMoveRef.current = null;
        qrOffsetRef.current = null;
        setIsQrDragging(false);
        if (e?.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        return;
      }
      onPointerUp(e);
    },
    [onPointerUp],
  );

  return (
    <svg
      ref={mergeRefs(svgLocalRef, forwardedRef)}
      viewBox="0 0 400 560"
      className={className ?? "mx-auto block aspect-[5/7] w-full max-w-sm rounded-md shadow-2xl"}
      style={{
        backgroundColor: template.type === "image" ? state.imageBg : (template.bg || "#ffffff"),
        cursor: isQrDragging ? "grabbing" : isDragging ? "grabbing" : undefined,
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      xmlns="http://www.w3.org/2000/svg"
      onPointerMove={handleSvgPointerMove}
      onPointerUp={handleSvgPointerUp}
      onPointerCancel={handleSvgPointerUp}
      onLostPointerCapture={() => handleSvgPointerUp()}
    >
      {template.type === "image" && template.imageSrc ? (
        <image href={template.imageSrc} x="0" y="0" width="400" height="560" preserveAspectRatio="xMidYMid meet" />
      ) : (
        <>
          <rect x="14" y="14" width="372" height="532" fill={template.panel || "#ffffff"} />
          <rect x="22" y="22" width="356" height="516" fill="none" stroke={template.border || "#000000"} strokeOpacity="0.45" strokeWidth="1" />
        </>
      )}

      <style>{`
        .icon-hit:hover ~ .icon-body .icon-path { stroke-width: 2.2; stroke-opacity: 1; }
        .mono-hit:hover ~ .mono-body { opacity: 0.75; }
        .mono-hit:hover { stroke: rgba(0,0,0,0.15); stroke-width: 0.5; }
      `}</style>

      {/* Icons */}
      {state.icons.map((instance) => {
        const def = getIconDef(instance.defId);
        if (!def) return null;
        const isActive = isDragging && draggedKey === instance.key;
        return (
          <g key={instance.key} transform={`translate(${instance.position.x} ${instance.position.y})`}>
            <circle
              cx="0" cy="0" r={Math.max(24, Math.round(50 * instance.scale))}
              fill="transparent" stroke="none"
              pointerEvents="all"
              style={{ cursor: "grab", touchAction: "none" }}
              className="icon-hit"
              onPointerDown={(e) =>
                beginDrag(e, instance.key, instance.position, instance.scale, (x, y) =>
                  updateDecoration("icons", instance.key, { position: { x, y } }),
                )
              }
            />
            <g
              className="icon-body"
              transform={`scale(${instance.scale}) translate(-50 -50)`}
              fill="none"
              stroke={instance.color || ink}
              strokeOpacity={isActive ? 0.55 : 0.7}
              strokeWidth="1.4"
              opacity={isActive ? 0.85 : undefined}
            >
              <path
                d={def.path}
                className="icon-path"
                fill={def.fillable ? instance.color || ink : "transparent"}
                fillOpacity={def.fillable ? (isActive ? 0.5 : 0.65) : 0}
                pointerEvents="none"
              />
            </g>
          </g>
        );
      })}

      {/* Monograms */}
      {state.monograms.map((instance) => {
        const def = getMonogramDef(instance.defId);
        if (!def) return null;
        const isActive = isDragging && draggedKey === instance.key;
        return (
          <g key={instance.key} transform={`translate(${instance.position.x} ${instance.position.y})`}>
            <rect
              x="-50" y="-50" width="100" height="100"
              fill="transparent" stroke="none"
              className="mono-hit"
              pointerEvents="all"
              style={{ cursor: "grab", touchAction: "none" }}
              onPointerDown={(e) =>
                beginDrag(e, instance.key, instance.position, instance.scale, (x, y) =>
                  updateDecoration("monograms", instance.key, { position: { x, y } }),
                )
              }
            />
            <g className="mono-body" transform={`scale(${instance.scale})`} opacity={isActive ? 0.85 : undefined}>
              <image href={def.src} x="-50" y="-50" width="100" height="100" preserveAspectRatio="xMidYMid meet" pointerEvents="none" />
            </g>
          </g>
        );
      })}

      <g pointerEvents="none">
        {/* Eyebrow */}
      <text
        x="200"
        y={a("eyebrow")}
        textAnchor="middle"
        fontSize="9"
        letterSpacing="3"
        fill={ink}
        fillOpacity="0.7"
        {...fitText(state.eyebrow.toUpperCase(), 9, 330, bodyFont.family, bodyFont.italic, 3)}
        style={{ fontFamily: bodyFont.family, fontStyle: bodyFont.italic ? "italic" : "normal" }}
      >
        {state.eyebrow.toUpperCase()}
      </text>

      {/* Intro */}
      <text
        x="200"
        y={a("intro")}
        textAnchor="middle"
        fontSize="10"
        fill={ink}
        fillOpacity="0.75"
        {...fitText(state.intro, 10, 340, bodyFont.family, bodyFont.italic)}
        style={{ fontFamily: bodyFont.family, fontStyle: bodyFont.italic ? "italic" : "normal" }}
      >
        {state.intro}
      </text>

      {/* Groom */}
      <text
        x="200"
        y={a("groomBase") + state.nameSize}
        textAnchor="middle"
        fontSize={state.nameSize}
        fill={template.accent}
        {...fitText(state.groom, state.nameSize, 330, nameFont.family, nameFont.italic)}
        style={{ fontFamily: nameFont.family, fontStyle: nameFont.italic ? "italic" : "normal" }}
      >
        {state.groom}
      </text>
      <text
        x="200"
        y={a("ampBase") + state.nameSize}
        textAnchor="middle"
        fontSize="11"
        letterSpacing="4"
        fill={ink}
        fillOpacity="0.7"
        style={{ fontFamily: bodyFont.family }}
      >
        &amp;
      </text>

      {/* Bride */}
      <text
        x="200"
        y={a("brideBase") + state.nameSize}
        textAnchor="middle"
        fontSize={state.nameSize}
        fill={template.accent}
        {...fitText(state.bride, state.nameSize, 330, nameFont.family, nameFont.italic)}
        style={{ fontFamily: nameFont.family, fontStyle: nameFont.italic ? "italic" : "normal" }}
      >
        {state.bride}
      </text>

      {/* Divider */}
      <line x1="170" y1={a("dividerBase") + state.nameSize} x2="230" y2={a("dividerBase") + state.nameSize} stroke={ink} strokeOpacity="0.4" />

      {/* Date & time */}
      <text
        x="200"
        y={a("dateBase") + state.nameSize}
        textAnchor="middle"
        fontSize="11"
        letterSpacing="2"
        fill={ink}
        fillOpacity="0.85"
        {...fitText(state.date, 11, 330, bodyFont.family, bodyFont.italic, 2)}
        style={{ fontFamily: bodyFont.family }}
      >
        {state.date}
      </text>
      <text
        x="200"
        y={a("timeBase") + state.nameSize}
        textAnchor="middle"
        fontSize="9"
        letterSpacing="1.5"
        fill={ink}
        fillOpacity="0.7"
        {...fitText(state.time, 9, 330, bodyFont.family, true, 1.5)}
        style={{ fontFamily: bodyFont.family, fontStyle: "italic" }}
      >
        {state.time}
      </text>

      {/* Venue */}
      <text
        x="200"
        y={venueY}
        textAnchor="middle"
        fontSize="10"
        letterSpacing="2.5"
        fill={ink}
        fillOpacity="0.85"
        {...fitText(state.venue.toUpperCase(), 10, 340, bodyFont.family, bodyFont.italic, 2.5)}
        style={{ fontFamily: bodyFont.family }}
      >
        {state.venue.toUpperCase()}
      </text>

      {/* Verse */}
      {verse && (
        <>
          <text
            x="200"
            y={verseY}
            textAnchor="middle"
            fontSize="10"
            fill={ink}
            fillOpacity="0.8"
            {...fitText(verse.text.length > 70 ? verse.text.slice(0, 68) + "…" : verse.text, 10, 340, bodyFont.family, true)}
            style={{ fontFamily: bodyFont.family, fontStyle: "italic" }}
          >
            {verse.text.length > 70 ? verse.text.slice(0, 68) + "…" : verse.text}
          </text>
          {verse.ref && (
            <text
              x="200"
              y={verseRefY}
              textAnchor="middle"
              fontSize="8"
              letterSpacing="2"
              fill={ink}
              fillOpacity="0.55"
              {...fitText(`— ${verse.ref}`, 8, 330, bodyFont.family, false, 2)}
              style={{ fontFamily: bodyFont.family }}
            >
              — {verse.ref}
            </text>
          )}
        </>
      )}

      {/* QR — draggable, generated client-side */}
      {qrDataUrl && (
        <g>
          <rect
            x={qrX - 6} y={qrY - 6} width={qrSize + 12} height={qrLabelY - qrY + 6}
            fill="transparent" stroke="none"
            pointerEvents="all"
            style={{ cursor: "grab", touchAction: "none" }}
            onPointerDown={handleQrPointerDown}
          />
          <image href={qrDataUrl} x={qrX} y={qrY} height={qrSize} width={qrSize} pointerEvents="none" />
          <text x={qrCenterX} y={qrLabelY} textAnchor="middle" fontSize="7" letterSpacing="2" fill={ink} fillOpacity="0.7" style={{ fontFamily: bodyFont.family }} pointerEvents="none">
            SCAN FOR DIRECTIONS
          </text>
        </g>
      )}

      {/* Bottom */}
      <text
        x="200"
        y={footerY}
        textAnchor="middle"
        fontSize="8"
        letterSpacing="2"
        fill={ink}
        fillOpacity="0.55"
        {...fitText(`${state.reception.toUpperCase()} · ${state.rsvp}`, 8, 340, bodyFont.family, false, 2)}
        style={{ fontFamily: bodyFont.family }}
      >
        {state.reception.toUpperCase()} · {state.rsvp}
      </text>
      <text
        x="200"
        y={closingY}
        textAnchor="middle"
        fontSize="7"
        letterSpacing="2"
        fill={ink}
        fillOpacity="0.45"
        {...fitText(state.closing, 7, 330, bodyFont.family, false, 2)}
        style={{ fontFamily: bodyFont.family }}
      >
        {state.closing}
      </text>
      </g>
    </svg>
  );
});
