"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import ShedChart from "@/components/ShedChart";
import { DEMO_ID, PRODUCTS, addDays, monthOf, niceDate, reading, summary, todayISO, weekOf, type Tracker } from "@/lib/model";
import { drawExample, loadPhotos, type PhotoSet } from "@/lib/client";

export default function Report({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [t, setT] = useState<Tracker | null>(null);
  const [photos, setPhotos] = useState<PhotoSet[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`/api/trackers/${id}`).then(async (r) => {
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setT(j);
      if (id === DEMO_ID) {
        setPhotos([[0, 0.5], [17, 0.6]].map(([w, d], i) => ({ date: addDays(j.startDate, w * 7), photos: { hairline: drawExample("hairline", d, 11 + i), crown: drawExample("crown", d, 18 + i) } })));
      } else loadPhotos(id).then(setPhotos);
    }).catch((e) => setErr(e.message));
  }, [id]);

  if (err) return <div className="narrow" style={{ paddingBlock: 64 }}><p className="error">{err}</p></div>;
  if (!t) return <div className="narrow" style={{ paddingBlock: 64 }}><p className="muted">Loading...</p></div>;

  const s = summary(t), r = reading(t);
  const first = photos[0], last = photos[photos.length - 1];
  const ck = t.checkins;

  return (
    <div className="narrow stack" style={{ paddingBlock: 32, gap: 20, maxWidth: 820 }}>
      <div className="row between no-print">
        <Link href={`/t/${id}`}>Back to tracker</Link>
        <button className="btn small" onClick={() => window.print()}>Print or save as PDF</button>
      </div>
      <div className="stack" style={{ gap: 6 }}>
        <span className="label">Hair treatment progress report · generated {niceDate(todayISO())}</span>
        <h2>{PRODUCTS[t.product].name}</h2>
        <p className="muted">Started {niceDate(t.startDate)}. Now week {s.w} (month {monthOf(s.w)}). Self-reported by the patient using Month Six.</p>
      </div>

      <div className="grid3">
        <div className="card"><span className="label">Starting shed count</span><h2 className="mono">{s.baseline?.avg ?? "n/a"}</h2><span className="small muted">hairs per wash, week {s.baseline?.week ?? "n/a"}</span></div>
        <div className="card"><span className="label">Peak</span><h2 className="mono">{s.peak?.avg ?? "n/a"}</h2><span className="small muted">week {s.peak?.week ?? "n/a"}</span></div>
        <div className="card"><span className="label">Latest</span><h2 className="mono">{s.latest?.avg ?? "n/a"}</h2><span className="small muted">week {s.latest?.week ?? "n/a"}{s.change != null ? ` · ${s.change > 0 ? "+" : ""}${s.change}% vs start` : ""}</span></div>
      </div>

      {s.wk.length > 0 && <div className="card"><span className="label">Shed count by week</span><ShedChart data={s.wk} nowWeek={s.w} /></div>}

      <div className="card stack" style={{ gap: 8 }}>
        <span className="label">Month Six reading</span>
        <b>{r.title}</b>
        <p className="small muted">{r.body}</p>
      </div>

      {ck.length > 0 && (
        <div className="card scroll-x" style={{ padding: 0 }}>
          <table className="compare-table">
            <thead><tr><th>Check-in</th><th>Week</th><th>Baby hairs</th><th>Days missed</th><th>Irritation</th>{PRODUCTS[t.product].oral && <th>Systemic symptoms</th>}</tr></thead>
            <tbody>
              {ck.map((c) => (
                <tr key={c.date}><td>{niceDate(c.date)}</td><td className="mono">{weekOf(t.startDate, c.date)}</td><td>{c.baby}</td><td>{c.missed}</td><td>{c.irritation}</td>{PRODUCTS[t.product].oral && <td>{c.systemic}</td>}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {first && last && first !== last && (
        <div className="card stack" style={{ gap: 10 }}>
          <span className="label">Photos: week {weekOf(t.startDate, first.date)} and week {weekOf(t.startDate, last.date)}</span>
          {Object.keys(last.photos).filter((k) => first.photos[k]).map((k) => (
            <div key={k} className="grid2">
              <figure style={{ margin: 0 }}><img src={first.photos[k]} alt={`${k} week ${weekOf(t.startDate, first.date)}`} style={{ width: "100%", borderRadius: 8 }} /><figcaption className="small muted">{k}, {niceDate(first.date)}</figcaption></figure>
              <figure style={{ margin: 0 }}><img src={last.photos[k]} alt={`${k} week ${weekOf(t.startDate, last.date)}`} style={{ width: "100%", borderRadius: 8 }} /><figcaption className="small muted">{k}, {niceDate(last.date)}</figcaption></figure>
            </div>
          ))}
        </div>
      )}

      <p className="small muted">
        Method: shed count follows the refined wash test (Li et al., Clin Cosmet Investig Dermatol 2022): hairs collected from one daily wash over a light cloth plus towel-drying, averaged per treatment week. Reference means in that study: 27.9 normal, 52.2 androgenetic alopecia, 125.5 telogen effluvium. Patient-collected data, not a diagnosis.
      </p>
      {id === DEMO_ID && <p className="banner">This is the example report with made-up data and drawn photos.</p>}
    </div>
  );
}
