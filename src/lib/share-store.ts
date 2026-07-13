import { createServerFn } from "@tanstack/react-start";

const store = new Map<string, string>();

export const createShare = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { state: string })
  .handler(async ({ data }) => {
    const { nanoid } = await import("nanoid");
    const key = nanoid(8);
    store.set(key, data.state);
    return { key };
  });

export const getShare = createServerFn({ method: "GET" })
  .validator((d: unknown) => d as { key: string })
  .handler(async ({ data }) => {
    const raw = store.get(data.key);
    if (!raw) return null;
    return JSON.parse(raw);
  });
