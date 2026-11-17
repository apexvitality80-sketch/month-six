import { BANDS } from "@/lib/model";

type Pt = { week: number; avg: number };

export default function ShedChart({ data, nowWeek, community }: { data: Pt[]; nowWeek: number; community?: Pt[] }) {
  const W = 640, H = 280, L = 44, R = 16, T = 16, B = 34;
  const maxW = Math.max(20, nowWeek + 2, ...data.map((d) => d.week + 1));
  const top = Math.max(100, Math.ceil((Math.max(0, ...data.map((d) => d.avg)) + 15) / 20) * 20);
  const x = (w: number) => L + (w / maxW) * (W - L - R);
  const y = (v: number) => T + (1 - Math.min(v, top) / top) * (H - T - B);
  const yTicks = Array.from({ length: top / 20 + 1 }, (_, i) => i * 20);
  const step = maxW > 30 ? 8 : 4;
  const xTicks = Array.from({ length: Math.floor(maxW / step) + 1 }, (_, i) => i * step);
  const base = data[0];
  const path = data.map((d, i) => `${i ? "L" : "M"}${x(d.week).toFixed(1)} ${y(d.avg).toFixed(1)}`).join(" ");
  const cpath = (community ?? []).map((d, i) => `${i ? "L" : "M"}${x(d.week).toFixed(1)} ${y(d.avg).toFixed(1)}`).join(" ");
  const last = data[data.length - 1];

  return (
    <div className="scroll-x">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Hairs shed per wash, by week of treatment" style={{ minWidth: 420, display: "block" }}>
        <rect x={L} y={y(top)} width={W - L - R} height={y(BANDS.heavyFrom) - y(top)} fill="var(--band-high)" />
        <rect x={L} y={y(BANDS.heavyFrom)} width={W - L - R} height={y(BANDS.healthyTop) - y(BANDS.heavyFrom)} fill="var(--band-mid)" />
        <rect x={L} y={y(BANDS.healthyTop)} width={W - L - R} height={y(0) - y(BANDS.healthyTop)} fill="var(--band-ok)" />
        <rect x={x(2)} y={T} width={x(12) - x(2)} height={H - T - B} fill="var(--shed)" opacity="0.06" />
        <text x={x(7)} y={T + 14} textAnchor="middle" fontSize="11" fill="var(--shed)" fontWeight="600">shedding window</text>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="1" />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" className="mono">{v}</text>
          </g>
        ))}
        {xTicks.map((w) => (
          <text key={w} x={x(w)} y={H - 12} textAnchor="middle" fontSize="11" fill="var(--muted)" className="mono">wk {w}</text>
        ))}
        <text x={L + 8} y={y(BANDS.healthyTop / 2) + 4} textAnchor="start" fontSize="11" fill="var(--good)" fontWeight="600">healthy range</text>
        <text x={L + 8} y={y((BANDS.healthyTop + BANDS.heavyFrom) / 2) + 4} textAnchor="start" fontSize="11" fill="#9a7a00" fontWeight="600">pattern loss range</text>
        <text x={L + 8} y={y(top) + 30} textAnchor="start" fontSize="11" fill="var(--shed)" fontWeight="600">heavy shedding</text>
        <line x1={x(nowWeek)} x2={x(nowWeek)} y1={T} y2={H - B} stroke="var(--ink)" strokeDasharray="3 4" strokeWidth="1" />
        {base && <line x1={x(base.week)} x2={W - R} y1={y(base.avg)} y2={y(base.avg)} stroke="var(--muted)" strokeDasharray="6 5" strokeWidth="1" />}
        {cpath && <path d={cpath} fill="none" stroke="var(--link)" strokeWidth="1.5" strokeDasharray="2 4" />}
        {path && <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />}
        {data.map((d, i) => (
          <circle key={d.week} cx={x(d.week)} cy={y(d.avg)} r={i === data.length - 1 ? 6 : 4} fill={i === data.length - 1 ? "var(--accent)" : "var(--surface)"} stroke="var(--accent)" strokeWidth="2" />
        ))}
        {last && (
          <text x={Math.min(x(last.week) + 10, W - R - 30)} y={y(last.avg) - 10} fontSize="13" fontWeight="700" fill="var(--ink)" className="mono">{last.avg}</text>
        )}
      </svg>
      <div className="row small muted" style={{ gap: 16, marginTop: 6 }}>
        <span><b style={{ color: "var(--accent)" }}>●</b> your average per wash, by week</span>
        <span>- - - your starting level</span>
        {cpath && <span style={{ color: "var(--link)" }}>· · · other Month Six users</span>}
      </div>
    </div>
  );
}
