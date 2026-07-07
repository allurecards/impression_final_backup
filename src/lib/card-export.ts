import { canvasToBlob, imageUrlToDataUrl, loadImage, safeFilePart } from "./canvas-utils";

export type ExportResolution = "share" | "print";

/** 5:7 card ratio at web-share size vs. 300dpi print size. */
const RESOLUTIONS: Record<ExportResolution, { width: number; height: number }> = {
  share: { width: 1200, height: 1680 },
  print: { width: 1500, height: 2100 }, // 5in x 7in @ 300dpi
};

async function svgElementToDataUrl(svg: SVGSVGElement, width: number, height: number): Promise<string> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));

  const embeddedImages = Array.from(clone.querySelectorAll("image"));
  await Promise.all(
    embeddedImages.map(async (image) => {
      const source = image.getAttribute("href");
      if (!source) return;
      // data: URLs (e.g. client-generated QR codes) pass through untouched;
      // everything else is resolved relative to the page and inlined.
      const absoluteSource = source.startsWith("data:")
        ? source
        : new URL(source, window.location.href).href;
      image.setAttribute("href", await imageUrlToDataUrl(absoluteSource));
      image.removeAttribute("crossorigin");
    }),
  );

  const xml = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  return URL.createObjectURL(svgBlob);
}

async function renderSvgToCanvas(
  svg: SVGSVGElement,
  resolution: ExportResolution,
): Promise<HTMLCanvasElement> {
  const { width, height } = RESOLUTIONS[resolution];
  await document.fonts?.ready;

  const svgObjectUrl = await svgElementToDataUrl(svg, width, height);
  try {
    const renderedImage = await loadImage(svgObjectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare the design.");
    ctx.drawImage(renderedImage, 0, 0, width, height);
    return canvas;
  } finally {
    URL.revokeObjectURL(svgObjectUrl);
  }
}

function triggerDownload(objectUrl: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
}

export async function exportCardAsPng(
  svg: SVGSVGElement,
  names: { bride: string; groom: string },
  resolution: ExportResolution = "share",
) {
  const canvas = await renderSvgToCanvas(svg, resolution);
  const blob = await canvasToBlob(canvas, "image/png", 1);
  const url = URL.createObjectURL(blob);
  const suffix = resolution === "print" ? "invitation-print" : "invitation";
  triggerDownload(url, `${safeFilePart(names.bride, "bride")}-${safeFilePart(names.groom, "groom")}-${suffix}.png`);
}

/**
 * PDF export for couples sending files to a print shop. Uses jsPDF, kept as
 * a dynamic import so the ~150kb dependency only loads when someone actually
 * exports a PDF, not on every page load.
 *
 * npm install jspdf
 */
export async function exportCardAsPdf(svg: SVGSVGElement, names: { bride: string; groom: string }) {
  const canvas = await renderSvgToCanvas(svg, "print");
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: [5, 7] });
  const dataUrl = canvas.toDataURL("image/png", 1);
  pdf.addImage(dataUrl, "PNG", 0, 0, 5, 7);
  pdf.save(`${safeFilePart(names.bride, "bride")}-${safeFilePart(names.groom, "groom")}-invitation.pdf`);
}
