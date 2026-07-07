export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Unable to read image data."));
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read image data."));
    reader.readAsDataURL(blob);
  });
}

export async function imageUrlToDataUrl(source: string): Promise<string> {
  if (source.startsWith("data:")) return source;
  const response = await fetch(source, { cache: "force-cache", mode: "cors" });
  if (!response.ok) {
    throw new Error(`Unable to load an image used by this design (${response.status}).`);
  }
  return blobToDataUrl(await response.blob());
}

export function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to render the finished design."));
    image.src = source;
  });
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png", quality = 1): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Your browser could not create the image file."))),
      type,
      quality,
    );
  });
}

export function safeFilePart(value: string, fallback: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}
