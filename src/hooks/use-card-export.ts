import { useCallback, useState } from "react";
import type { ExportStatus } from "@/types/card-design";
import { exportCardAsPdf, exportCardAsPng, type ExportResolution } from "@/lib/card-export";

export function useCardExport(svgRef: React.RefObject<SVGSVGElement | null>) {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [error, setError] = useState("");

  const run = useCallback(
    async (task: () => Promise<void>) => {
      if (status === "exporting") return;
      setStatus("exporting");
      setError("");
      try {
        await task();
        setStatus("success");
      } catch (e) {
        setError(e instanceof Error ? e.message : "The design could not be exported. Please try again.");
        setStatus("error");
      }
    },
    [status],
  );

  const downloadPng = useCallback(
    (names: { bride: string; groom: string }, resolution: ExportResolution = "share") =>
      run(async () => {
        const svg = svgRef.current;
        if (!svg) throw new Error("Nothing to export yet.");
        await exportCardAsPng(svg, names, resolution);
      }),
    [run, svgRef],
  );

  const downloadPdf = useCallback(
    (names: { bride: string; groom: string }) =>
      run(async () => {
        const svg = svgRef.current;
        if (!svg) throw new Error("Nothing to export yet.");
        await exportCardAsPdf(svg, names);
      }),
    [run, svgRef],
  );

  return { status, error, downloadPng, downloadPdf };
}
