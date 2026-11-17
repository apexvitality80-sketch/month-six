// Storage: Upstash Redis over its REST API when configured (Vercel Marketplace sets
// KV_REST_API_URL / KV_REST_API_TOKEN), otherwise an in-memory map for local dev.
// Nothing personal is stored: a tracker is a random code, a start date, a product
// type, shed counts and check-in answers. Photos never reach the server.

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

type G = typeof globalThis & { __ms_mem?: Map<string, string> };
const mem: Map<string, string> = ((globalThis as G).__ms_mem ??= new Map());

export const hasDatabase = Boolean(URL_ && TOKEN);

async function cmd(...args: (string | number)[]): Promise<unknown> {
  const res = await fetch(URL_!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Database error ${res.status}`);
  const j = (await res.json()) as { result?: unknown; error?: string };
  if (j.error) throw new Error(j.error);
  return j.result;
}

export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = hasDatabase ? ((await cmd("GET", key)) as string | null) : mem.get(key) ?? null;
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function setJSON(key: string, value: unknown): Promise<void> {
  const raw = JSON.stringify(value);
  if (hasDatabase) await cmd("SET", key, raw);
  else mem.set(key, raw);
}

export async function del(key: string): Promise<void> {
  if (hasDatabase) await cmd("DEL", key);
  else mem.delete(key);
}

export async function hincr(key: string, field: string, by: number): Promise<void> {
  if (hasDatabase) {
    await cmd("HINCRBY", key, field, Math.round(by));
    return;
  }
  const cur = JSON.parse(mem.get(key) ?? "{}") as Record<string, number>;
  cur[field] = (cur[field] ?? 0) + Math.round(by);
  mem.set(key, JSON.stringify(cur));
}

export async function hgetall(key: string): Promise<Record<string, number>> {
  if (hasDatabase) {
    const arr = ((await cmd("HGETALL", key)) as string[] | null) ?? [];
    const out: Record<string, number> = {};
    for (let i = 0; i < arr.length; i += 2) out[arr[i]] = Number(arr[i + 1]);
    return out;
  }
  return JSON.parse(mem.get(key) ?? "{}") as Record<string, number>;
}
