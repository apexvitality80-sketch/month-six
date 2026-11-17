import { del, getJSON, hincr, setJSON } from "@/lib/db";
import { DEMO_ID, demoTracker, addDays, validDate, validId, weekOf, todayISO, type Tracker, type Checkin } from "@/lib/model";

type Ctx = { params: Promise<{ id: string }> };

async function load(id: string) {
  if (id === DEMO_ID) return demoTracker();
  if (!validId(id)) return null;
  return getJSON<Tracker>(`tracker:${id}`);
}

export async function GET(_req: Request, { params }: Ctx) {
  const t = await load((await params).id);
  if (!t) return Response.json({ error: "No tracker with that code." }, { status: 404 });
  return Response.json(t);
}

// PATCH actions: addCount, removeCount, addCheckin, setStart
export async function PATCH(req: Request, { params }: Ctx) {
  const id = (await params).id;
  if (id === DEMO_ID) return Response.json({ error: "This is the example tracker. Start your own to log counts." }, { status: 403 });
  const t = await load(id);
  if (!t) return Response.json({ error: "No tracker with that code." }, { status: 404 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const today = todayISO();

  if (b.action === "addCount") {
    const n = Number(b.count);
    if (!validDate(b.date) || b.date > today || b.date < addDays(t.startDate, -30)) return Response.json({ error: "Pick a date between a month before your start date and today." }, { status: 400 });
    if (!Number.isInteger(n) || n < 0 || n > 1000) return Response.json({ error: "Enter the number of hairs, 0 to 1000." }, { status: 400 });
    const date = b.date;
    const existing = t.counts.findIndex((c) => c.date === date);
    if (existing >= 0) t.counts[existing].count = n;
    else {
      t.counts.push({ date, count: n });
      const w = weekOf(t.startDate, date);
      if (w <= 52) {
        await hincr("stats:shed", `w${w}:sum`, n).catch(() => {});
        await hincr("stats:shed", `w${w}:n`, 1).catch(() => {});
      }
    }
    t.counts.sort((a, c) => a.date.localeCompare(c.date));
  } else if (b.action === "removeCount") {
    t.counts = t.counts.filter((c) => c.date !== b.date);
  } else if (b.action === "addCheckin") {
    const c = b.checkin as Partial<Checkin> | undefined;
    const ok =
      c &&
      ["Yes", "Not sure", "No"].includes(String(c.baby)) &&
      ["0", "1-3", "4-7", "8+"].includes(String(c.missed)) &&
      ["None", "Mild", "Bad"].includes(String(c.irritation)) &&
      ["No", "Yes"].includes(String(c.systemic ?? "No"));
    if (!ok) return Response.json({ error: "Answer all the questions." }, { status: 400 });
    const entry: Checkin = { date: today, baby: c.baby!, missed: c.missed!, irritation: c.irritation!, systemic: c.systemic ?? "No" };
    t.checkins = [...t.checkins.filter((x) => x.date !== today), entry];
  } else if (b.action === "setStart" && validDate(b.date) && b.date <= today) {
    t.startDate = b.date;
  } else {
    return Response.json({ error: "Unknown action." }, { status: 400 });
  }
  try {
    await setJSON(`tracker:${t.id}`, t);
  } catch {
    return Response.json({ error: "Could not save right now. Try again in a minute." }, { status: 503 });
  }
  return Response.json(t);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const id = (await params).id;
  if (!validId(id) || id === DEMO_ID) return Response.json({ error: "Bad code." }, { status: 400 });
  await del(`tracker:${id}`);
  return Response.json({ ok: true });
}
