import { createServerFn } from "@tanstack/react-start";

const store = new Map<string, string>();
const SHARE_KEY_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function createShareKey(length = 8) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => SHARE_KEY_ALPHABET[byte % SHARE_KEY_ALPHABET.length]).join("");
}

export const createShare = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { state: string })
  .handler(async ({ data }) => {
    const key = createShareKey();
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
