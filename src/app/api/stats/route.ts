import { hgetall } from "@/lib/db";

// Anonymous averages by treatment week. Only weeks with at least 10 logs are returned.
export async function GET() {
  const raw = await hgetall("stats:shed").catch(() => ({}) as Record<string, number>);
  const weeks: { week: number; avg: number; n: number }[] = [];
  for (let w = 0; w <= 52; w++) {
    const n = raw[`w${w}:n`] ?? 0;
    if (n >= 10) weeks.push({ week: w, avg: Math.round((raw[`w${w}:sum`] ?? 0) / n), n });
  }
  return Response.json({ weeks });
}
