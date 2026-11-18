"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Timeline from "@/components/Timeline";
import ShedChart from "@/components/ShedChart";
import {
  DEMO_ID, PRODUCTS, addDays, monthOf, niceDate, phaseOf, reading, summary, todayISO, weekOf,
  type Checkin, type Tracker,
} from "@/lib/model";
import { READING_WIT, SAVED_LINES, LOADING_LINES } from "@/lib/wit";
import { compress, deletePhotos, drawExample, forgetTracker, loadPhotos, rememberTracker, savePhotos, type PhotoSet } from "@/lib/client";

const ANGLES = [
  { id: "hairline", name: "Hairline", how: "Hair pulled back, face the camera, eyes level with the lens." },
  { id: "crown", name: "Crown", how: "Phone held above and behind your head, or ask someone. Hair dry." },
  { id: "temples", name: "Temples", how: "Head turned 45 degrees left. Same spot, same light as last time." },
];

export default function TrackerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const demo = id === DEMO_ID;
  const [t, setT] = useState<Tracker | null>(null);
  const [err, setErr] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [photos, setPhotos] = useState<PhotoSet[]>([]);
  const [community, setCommunity] = useState<{ week: number; avg: number }[]>([]);

  useEffect(() => {
    setIsNew(new URLSearchParams(window.location.search).get("new") === "1");
    fetch(`/api/trackers/${id}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        setT(j);
        if (!demo) rememberTracker(id);
      })
      .catch((e) => setErr(e.message || "Could not load this tracker."));
    fetch("/api/stats").then((r) => r.json()).then((j) => setCommunity(j.weeks || [])).catch(() => {});
  }, [id, demo]);

  useEffect(() => {
    if (!t) return;
    if (demo) {
      const plan = [[0, 0.5], [8, 0.47], [17, 0.6]] as const;
      setPhotos(plan.map(([w, d], i) => ({
        date: addDays(t.startDate, w * 7),
        photos: Object.fromEntries(ANGLES.map((a, j) => [a.id, drawExample(a.id, d, 11 + j * 7 + i)])),
      })));
    } else loadPhotos(id).then(setPhotos);
  }, [t, demo, id]);

  const patch = useCallback(async (body: object) => {
    // iPhone Safari and in-app browsers (WhatsApp, Instagram) often drop the first
    // request after the camera has been open, throwing "Load failed". Retry a few times.
    let r: Response | null = null;
    for (let attempt = 0; attempt < 3 && !r; attempt++) {
      try {
        r = await fetch(`/api/trackers/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
      } catch {
        await new Promise((ok) => setTimeout(ok, 600 * (attempt + 1)));
      }
    }
    if (!r) throw new Error("Couldn't reach Month Six. Check your internet and tap Save again. Nothing you entered is lost.");
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "Could not save. Try again in a minute.");
    setT(j);
  }, [id]);

  if (err) {
    return (
      <div className="narrow stack" style={{ paddingBlock: 64 }}>
        <h2>We couldn&rsquo;t open that tracker</h2>
        <p className="muted">{err} Check the code, or start a new tracker.</p>
        <Link href="/start" className="btn" style={{ alignSelf: "start" }}>Go to start</Link>
      </div>
    );
  }
  if (!t) return <div className="narrow" style={{ paddingBlock: 64 }}><p className="muted">{LOADING_LINES[0]}</p></div>;

  const s = summary(t);
  const r = reading(t);
  const ph = phaseOf(s.w);

  return (
    <div className="wrap stack" style={{ paddingBlock: 28, gap: 20 }}>
      {demo && (
        <div className="banner row between">
          <span><b>Example tracker.</b> 18 weeks of made-up data and drawn photos, to show how Month Six works. Nothing here is a real person.</span>
          <Link href="/start" className="btn small">Start my own</Link>
        </div>
      )}
      {isNew && !demo && <SaveCode id={id} />}

      <div className="row between">
        <div className="stack" style={{ gap: 4 }}>
          <span className="label">{PRODUCTS[t.product].name}</span>
          <h2>Week {s.w} · Month {monthOf(s.w)}</h2>
        </div>
        <div className="row">
          <Link href={`/t/${id}/report`} className="btn ghost small">Doctor report</Link>
          {!demo && <span className="pill">{id}</span>}
        </div>
      </div>

      <div className="dash">
        <div className="stack">
          <div className={`verdict tone-${r.tone}`}>
            <span className="vtag">{r.tag}</span>
            <h3>{r.title}</h3>
            {READING_WIT[r.tag] && <p className="wit">{READING_WIT[r.tag]}</p>}
            <p>{r.body}</p>
            {r.points.length > 0 && <ul>{r.points.map((p) => <li key={p}>{p}</li>)}</ul>}
          </div>

          <div className="card stack" style={{ gap: 10 }}>
            <div className="row between">
              <span className="label">Hairs shed per wash</span>
              {s.change != null && (
                <span className="mono small" style={{ color: s.change <= 0 ? "var(--good)" : "var(--shed)", fontWeight: 600 }}>
                  {s.change > 0 ? "+" : ""}{s.change}% vs your start
                </span>
              )}
            </div>
            {s.wk.length ? (
              <ShedChart data={s.wk} nowWeek={s.w} community={community} />
            ) : (
              <p className="muted"><b>Abhi graph bhi takla hai.</b> Your chart appears after your first count. Bands show the healthy range (about 28 a wash), the range seen in pattern hair loss (about 52) and heavy shedding (over 55).</p>
            )}
          </div>

          <div className="card">
            <div className="row between"><span className="label">Where you are</span><span className="small muted">{ph.name}</span></div>
            <div style={{ paddingTop: 16 }}><Timeline week={s.w} /></div>
            <p className="small muted" style={{ marginTop: 12 }}>Fair verdict date: <b>{niceDate(addDays(t.startDate, 182))}</b> for a first review, <b>{niceDate(addDays(t.startDate, 365))}</b> for a final one.</p>
          </div>

          <Compare sets={photos} start={t.startDate} />
        </div>

        <div className="stack">
          <CountForm t={t} demo={demo} patch={patch} />
          <CheckinForm t={t} demo={demo} patch={patch} photos={photos} setPhotos={async (p) => { setPhotos(p); if (!demo) await savePhotos(id, p); }} />
          <Plan t={t} />
          {!demo && <Danger id={id} />}
        </div>
      </div>
    </div>
  );
}

function SaveCode({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="card stack" style={{ gap: 10, borderColor: "var(--highlight)", background: "var(--pop)" }}>
      <span className="label">Save your tracker code</span>
      <div className="row between">
        <span className="code-box">{id}</span>
        <button className="btn small" onClick={() => navigator.clipboard?.writeText(`${location.origin}/t/${id}`).then(() => setCopied(true)).catch(() => {})}>
          {copied ? "Link copied" : "Copy my tracker link"}
        </button>
      </div>
      <p className="small muted">This code is the only key to your tracker. There is no account, so if you lose it we can&rsquo;t recover it. Bookmark this page or send the link to yourself.</p>
    </div>
  );
}

function CountForm({ t, demo, patch }: { t: Tracker; demo: boolean; patch: (b: object) => Promise<void> }) {
  const [date, setDate] = useState(todayISO());
  const [count, setCount] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const recent = [...t.counts].reverse().slice(0, 6);
  const lastDate = t.counts.length ? t.counts[t.counts.length - 1].date : null;
  const due = !lastDate || lastDate <= addDays(todayISO(), weekOf(t.startDate, todayISO()) < 12 ? -14 : -28);

  async function add() {
    setBusy(true);
    setMsg("");
    try {
      await patch({ action: "addCount", date, count: Number(count) });
      setCount("");
      setMsg(SAVED_LINES[Math.floor(Math.random() * SAVED_LINES.length)]);
    } catch (e) {
      setMsg((e as Error).message);
    }
    setBusy(false);
  }

  return (
    <div className="card stack" style={{ gap: 12 }}>
      <div className="row between">
        <span className="label">Log a shed count</span>
        <span className="small" style={{ color: due ? "var(--shed)" : "var(--good)", fontWeight: 600 }}>{due ? "Count week due" : `Next: ${niceDate(addDays(lastDate!, weekOf(t.startDate, todayISO()) < 12 ? 14 : 28))}`}</span>
      </div>
      <p className="small muted">Wash over a light cloth, count every hair from the cloth and towel. Do 3 days in a row. <Link href="/how-to-count">How to count</Link></p>
      <div className="count-input">
        <label className="field"><span className="small muted">Date</span><input type="date" id="countDate" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} disabled={demo} /></label>
        <label className="field"><span className="small muted">Hairs counted</span><input type="number" id="countVal" inputMode="numeric" min={0} max={1000} value={count} placeholder="e.g. 48" onChange={(e) => setCount(e.target.value)} disabled={demo} /></label>
        <button className="btn" onClick={add} disabled={demo || busy || count === ""}>Save</button>
      </div>
      {msg && <p className={msg.startsWith("Saved") ? "small" : "error"} style={msg.startsWith("Saved") ? { color: "var(--good)", fontWeight: 600 } : {}}>{msg}</p>}
      {recent.length > 0 && (
        <ul className="log">
          {recent.map((c) => (
            <li key={c.date}>
              <span>{niceDate(c.date)} <span className="muted">· wk {weekOf(t.startDate, c.date)}</span></span>
              <span className="row" style={{ gap: 6 }}>
                <b className="mono">{c.count}</b>
                {!demo && <button className="x" aria-label={`Remove count for ${c.date}`} onClick={() => patch({ action: "removeCount", date: c.date })}>remove</button>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Opts<T extends string>({ label, hint, value, options, onPick }: { label: string; hint?: string; value?: T; options: readonly T[]; onPick: (v: T) => void }) {
  return (
    <div className="field">
      <span className="label">{label}</span>
      {hint && <span className="small muted">{hint}</span>}
      <div className="opts">
        {options.map((o) => (
          <button key={o} type="button" className="opt" aria-pressed={value === o} onClick={() => onPick(o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function CheckinForm({ t, demo, patch, photos, setPhotos }: { t: Tracker; demo: boolean; patch: (b: object) => Promise<void>; photos: PhotoSet[]; setPhotos: (p: PhotoSet[]) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [a, setA] = useState<Partial<Checkin>>({ systemic: "No" });
  const [shots, setShots] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const last = t.checkins[t.checkins.length - 1];
  const nextDue = last ? addDays(last.date, 30) : todayISO();
  const oral = PRODUCTS[t.product].oral;
  const ready = a.baby && a.missed && a.irritation;

  async function submit() {
    setMsg("");
    try {
      // Photos go to this phone first, so they are kept even if the network save fails.
      if (Object.keys(shots).length) {
        const today = todayISO();
        await setPhotos([...photos.filter((p) => p.date !== today), { date: today, photos: shots }].sort((x, y) => x.date.localeCompare(y.date)));
      }
      await patch({ action: "addCheckin", checkin: a });
      setOpen(false);
      setShots({});
      setA({ systemic: "No" });
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  if (!open) {
    return (
      <div className="card stack" style={{ gap: 10 }}>
        <div className="row between">
          <span className="label">Monthly check-in</span>
          <span className="small muted">{last ? `Last: ${niceDate(last.date)}` : "Not done yet"}</span>
        </div>
        <p className="small muted">Three photos from fixed angles and four questions. About 4 minutes. {nextDue <= todayISO() ? "Due now." : `Next due ${niceDate(nextDue)}.`}</p>
        <button className="btn ghost" onClick={() => setOpen(true)} disabled={demo}>{demo ? "Check-in (disabled in example)" : "Start this month's check-in"}</button>
      </div>
    );
  }

  return (
    <div className="card stack">
      <span className="label">Photos, same as last time</span>
      <p className="small muted">Same room, same light, hair dry and not styled. No filters, no &ldquo;good side&rdquo;. Photos stay on this device.</p>
      {ANGLES.map((ang) => (
        <label key={ang.id} className="shot" htmlFor={`ph-${ang.id}`}>
          <div className="thumb">
            {shots[ang.id] ? <img src={shots[ang.id]} alt={`${ang.name} today`} /> : <span className="small muted">+</span>}
          </div>
          <div className="stack" style={{ gap: 2, minWidth: 0 }}>
            <b>{ang.name} {shots[ang.id] && <span style={{ color: "var(--good)" }}>✓</span>}</b>
            <span className="small muted">{ang.how}</span>
          </div>
          <input className="sr" type="file" accept="image/*" capture="environment" id={`ph-${ang.id}`}
            onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const d = await compress(f); setShots((s) => ({ ...s, [ang.id]: d })); } }} />
        </label>
      ))}
      <Opts label="Fine, light new hairs?" hint="Short, soft, lighter hairs at the hairline or crown." value={a.baby} options={["Yes", "Not sure", "No"] as const} onPick={(v) => setA({ ...a, baby: v })} />
      <Opts label="Days missed this month" value={a.missed} options={["0", "1-3", "4-7", "8+"] as const} onPick={(v) => setA({ ...a, missed: v })} />
      <Opts label="Scalp itching, redness or bumps" value={a.irritation} options={["None", "Mild", "Bad"] as const} onPick={(v) => setA({ ...a, irritation: v })} />
      {oral && <Opts label="Dizziness, swollen ankles or racing heartbeat?" value={a.systemic} options={["No", "Yes"] as const} onPick={(v) => setA({ ...a, systemic: v })} />}
      <div className="row">
        <button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button>
        <button className="btn" style={{ flex: 1 }} disabled={!ready} onClick={submit}>Save check-in</button>
      </div>
      {msg && <p className="error">{msg}</p>}
    </div>
  );
}

function Compare({ sets, start }: { sets: PhotoSet[]; start: string }) {
  const [angle, setAngle] = useState("hairline");
  const [cut, setCut] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const usable = sets.filter((s) => s.photos[angle]);
  if (sets.length < 2 || usable.length < 2) {
    return (
      <div className="card stack" style={{ gap: 8 }}>
        <span className="label">Photo compare</span>
        <p className="small muted">{sets.length ? "Your first photos are saved. After next month's check-in you can compare them here." : "Take photos at your first check-in. Next month you'll compare them side by side."}</p>
      </div>
    );
  }
  const A = usable[0], B = usable[usable.length - 1];
  const set = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setCut(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div className="card stack" style={{ gap: 12 }}>
      <div className="row between">
        <span className="label">Photo compare · drag across</span>
        <div className="opts" style={{ flex: "none" }}>
          {ANGLES.map((a) => <button key={a.id} className="opt" style={{ minWidth: 0, padding: "6px 10px" }} aria-pressed={a.id === angle} onClick={() => setAngle(a.id)}>{a.name}</button>)}
        </div>
      </div>
      <div ref={box} className="cmp" style={{ ["--cut" as string]: `${cut}%` }}
        onPointerDown={(e) => { drag.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); set(e.clientX); }}
        onPointerMove={(e) => drag.current && set(e.clientX)}
        onPointerUp={() => (drag.current = false)}>
        <img src={A.photos[angle]} alt={`Week ${weekOf(start, A.date)}`} />
        <img className="after" src={B.photos[angle]} alt={`Week ${weekOf(start, B.date)}`} />
        <div className="handle" />
        <span className="tag" style={{ left: 10 }}>wk {weekOf(start, A.date)}</span>
        <span className="tag" style={{ right: 10 }}>wk {weekOf(start, B.date)}</span>
      </div>
    </div>
  );
}

function Plan({ t }: { t: Tracker }) {
  const w = weekOf(t.startDate, todayISO());
  const steps = [
    { wk: 0, what: "Baseline: 3-day count and first photos" },
    { wk: 4, what: "Count week. Expect counts to rise." },
    { wk: 8, what: "Count week and check-in" },
    { wk: 13, what: "Month 3 review: is shedding past its peak?" },
    { wk: 26, what: "Month 6: take the doctor report to a dermatologist" },
    { wk: 52, what: "Month 12: final verdict on this treatment" },
  ];
  const next = steps.find((s) => s.wk >= w) ?? steps[steps.length - 1];
  const d = addDays(t.startDate, next.wk * 7).replace(/-/g, "");
  const cal = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: "Month Six: shed count (3 days) + check-in",
    dates: `${d}/${d}`,
    details: `Open your tracker: ${typeof window !== "undefined" ? location.href : ""}`,
    recur: "RRULE:FREQ=WEEKLY;INTERVAL=4;COUNT=13",
  })}`;
  return (
    <div className="card stack" style={{ gap: 10 }}>
      <span className="label">Your 12-month plan</span>
      <ul className="log">
        {steps.map((s) => (
          <li key={s.wk} style={{ opacity: s.wk < w && s !== next ? 0.55 : 1, fontWeight: s === next ? 600 : 400 }}>
            <span>{s.what}</span>
            <span className="mono muted" style={{ whiteSpace: "nowrap" }}>{niceDate(addDays(t.startDate, s.wk * 7))}</span>
          </li>
        ))}
      </ul>
      <a className="btn ghost small" href={cal} target="_blank" rel="noreferrer">Add reminders to Google Calendar</a>
    </div>
  );
}

function Danger({ id }: { id: string }) {
  const [ask, setAsk] = useState(false);
  if (!ask) return <button className="x" style={{ alignSelf: "start" }} onClick={() => setAsk(true)}>Delete this tracker</button>;
  return (
    <div className="banner stack" style={{ gap: 8 }}>
      <span>Delete all counts, answers and photos for {id}? This can&rsquo;t be undone.</span>
      <div className="row">
        <button className="btn small" style={{ background: "var(--crit)" }} onClick={async () => { await fetch(`/api/trackers/${id}`, { method: "DELETE" }); await deletePhotos(id); forgetTracker(id); location.href = "/"; }}>Delete</button>
        <button className="btn ghost small" onClick={() => setAsk(false)}>Keep it</button>
      </div>
    </div>
  );
}
