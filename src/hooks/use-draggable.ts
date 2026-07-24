import { useCallback, useRef, useState, type PointerEvent, type RefObject } from "react";

type DragState = {
  update: (x: number, y: number) => void;
  offsetX: number;
  offsetY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  key: string;
};

/**
 * The original component had near-identical pointer-down/move/up handling
 * written twice: once for icons, once for monograms. This hook is the
 * single implementation both use. viewBoxWidth/Height let it work for any
 * SVG coordinate system, not just the 400x560 card.
 */
export function useDraggableOnSvg(
  svgRef: RefObject<SVGSVGElement | null>,
  viewBoxWidth = 400,
  viewBoxHeight = 560,
) {
  const dragRef = useRef<DragState | null>(null);
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const beginDrag = useCallback(
    (
      e: PointerEvent,
      key: string,
      currentPosition: { x: number; y: number },
      scale: number,
      onMove: (x: number, y: number) => void,
    ) => {
      if (dragRef.current) return;
      e.preventDefault();
      const svg = svgRef.current;
      if (!svg) return;
      svg.setPointerCapture(e.pointerId);
      const rect = svg.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * viewBoxWidth;
      const svgY = ((e.clientY - rect.top) / rect.height) * viewBoxHeight;
      const edge = Math.max(12, Math.round(50 * scale));

      dragRef.current = {
        update: onMove,
        offsetX: svgX - currentPosition.x,
        offsetY: svgY - currentPosition.y,
        minX: edge,
        maxX: viewBoxWidth - edge,
        minY: edge,
        maxY: viewBoxHeight - edge,
        key,
      };
      setDraggedKey(key);
      setIsDragging(true);
    },
    [svgRef, viewBoxWidth, viewBoxHeight],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      e.preventDefault();
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * viewBoxWidth - d.offsetX;
      const y = ((e.clientY - rect.top) / rect.height) * viewBoxHeight - d.offsetY;
      d.update(
        Math.round(Math.max(d.minX, Math.min(d.maxX, x))),
        Math.round(Math.max(d.minY, Math.min(d.maxY, y))),
      );
    },
    [svgRef, viewBoxWidth, viewBoxHeight],
  );

  const onPointerUp = useCallback((e?: PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDraggedKey(null);
    setIsDragging(false);
    if (e?.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  return { beginDrag, onPointerMove, onPointerUp, isDragging, draggedKey };
}
