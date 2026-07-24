import QRCode from "qrcode";

/**
 * The previous implementation fetched QR images from api.qrserver.com at
 * render time. That's a third-party runtime dependency with no SLA, it
 * requires `crossOrigin="anonymous"` + CORS cooperation to export cleanly,
 * and it silently breaks if that service ever goes down or rate-limits you.
 *
 * `qrcode` (npm) generates the QR entirely client-side as an SVG string,
 * which we inline as a data: URL. No network call, no CORS handling needed
 * for export, works offline, and is effectively instant.
 *
 * npm install qrcode
 * npm install -D @types/qrcode
 */
export async function generateQrDataUrl(
  data: string,
  opts?: { margin?: number; darkColor?: string; lightColor?: string },
): Promise<string> {
  const svgString = await QRCode.toString(data, {
    type: "svg",
    margin: opts?.margin ?? 0,
    color: {
      dark: opts?.darkColor || "#000000",
      light: opts?.lightColor || "#00000000",
    },
  });
  const encoded =
    typeof window !== "undefined"
      ? btoa(
          Array.from(new TextEncoder().encode(svgString), (b) => String.fromCharCode(b)).join(""),
        )
      : Buffer.from(svgString).toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
}

export function normalizeMapsUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/\s/.test(trimmed)) return "";

  try {
    const withProtocol = /^[a-z][a-z\d+\-.]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    const hasWebProtocol = parsed.protocol === "http:" || parsed.protocol === "https:";
    const hasValidHost = parsed.hostname === "localhost" || parsed.hostname.includes(".");
    return hasWebProtocol && hasValidHost ? parsed.href : "";
  } catch {
    return "";
  }
}
