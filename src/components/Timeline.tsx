import { PHASES } from "@/lib/model";

const cls: Record<string, string> = { start: "seg-start", shed: "seg-shed", settle: "seg-settle", judge: "seg-judge" };

export default function Timeline({ week }: { week?: number }) {
  const pct = (x: number) => `${((x / 52) * 100).toFixed(2)}%`;
  return (
    <div className="tl" aria-label={week != null ? `Treatment timeline, week ${week} of 52` : "Treatment timeline"}>
      <div className="tl-bar">
        {PHASES.map((p) => (
          <div key={p.id} className={`tl-seg ${cls[p.id]}`} style={{ width: pct(p.to - p.from) }}>
            {p.to - p.from > 3 ? p.short : ""}
          </div>
        ))}
      </div>
      <div className="tl-90" style={{ left: pct(13) }}>
        <span>&ldquo;90 days&rdquo;</span>
      </div>
      {week != null && <div className="tl-marker" style={{ left: pct(Math.min(52, week)) }} />}
      <div className="tl-ticks">
        <span>wk 0</span>
        <span>3 mo</span>
        <span>6 mo</span>
        <span>12 mo</span>
      </div>
    </div>
  );
}
