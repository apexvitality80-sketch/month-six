import { setJSON } from "@/lib/db";
import { newId, PRODUCTS, todayISO, validDate, type Tracker, type Product } from "@/lib/model";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { startDate?: unknown; product?: unknown };
  const startDate = validDate(body.startDate) && body.startDate <= todayISO() ? body.startDate : todayISO();
  const product = (typeof body.product === "string" && body.product in PRODUCTS ? body.product : "other") as Product;
  const t: Tracker = { id: newId(), createdAt: new Date().toISOString(), startDate, product, counts: [], checkins: [] };
  try {
    await setJSON(`tracker:${t.id}`, t);
  } catch {
    return Response.json({ error: "Could not save right now. Try again in a minute." }, { status: 503 });
  }
  return Response.json(t, { status: 201 });
}
