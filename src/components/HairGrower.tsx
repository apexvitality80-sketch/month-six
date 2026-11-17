"use client";
import { useMemo, useState } from "react";
import { GROW_LINES } from "@/lib/wit";

// A playful hero toy: every tap grows a few more hairs on a friendly cartoon head.
// After the last tap it delivers the real message: in life there is no button, there are 6 months.

function strands(seed: number) {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: 160 }, () => {
    const a = Math.PI * (1.08 + r() * 0.84);
    const rad = 62 + r() * 10;
    const x = 110 + Math.cos(a) * rad;
    const y = 112 + Math.sin(a) * rad * 0.92;
    const tilt = (x - 110) / 12 + (r() - 0.5) * 6;
    return { x, y, x2: x + tilt, y2: y - 10 - r() * 9, w: 1.4 + r() * 1.4 };
  });
}

export default function HairGrower() {
  const [taps, setTaps] = useState(0);
  const all = useMemo(() => strands(7), []);
  const max = GROW_LINES.length - 1;
  const shown = Math.round((taps / max) * all.length);
  const done = taps >= max;

  return (
    <div className="grower">
      <svg viewBox="0 0 220 220" width="100%" role="img" aria-label="A cartoon head growing hair as you tap">
        <ellipse cx="110" cy="204" rx="58" ry="8" fill="rgba(0,0,0,.25)" />
        <rect x="88" y="168" width="44" height="34" rx="10" fill="#c99a7c" />
        <ellipse cx="110" cy="118" rx="66" ry="72" fill="#d9ab8c" />
        <ellipse cx="44" cy="124" rx="9" ry="14" fill="#cf9f80" />
        <ellipse cx="176" cy="124" rx="9" ry="14" fill="#cf9f80" />
        {taps === 0 && <ellipse cx="88" cy="70" rx="16" ry="7" fill="#fff" opacity=".35" transform="rotate(-20 88 70)" />}
        <circle cx="86" cy="124" r="5" fill="#212121" />
        <circle cx="134" cy="124" r="5" fill="#212121" />
        {done ? (
          <path d="M88 150 Q110 170 132 150" fill="none" stroke="#212121" strokeWidth="4" strokeLinecap="round" />
        ) : (
          <path d="M92 154 Q110 162 128 154" fill="none" stroke="#212121" strokeWidth="4" strokeLinecap="round" />
        )}
        <path d="M74 108 q12 -6 22 0 M124 108 q12 -6 22 0" fill="none" stroke="#3b2a20" strokeWidth="3.5" strokeLinecap="round" />
        <g stroke="#2a1c14" strokeLinecap="round">
          {all.slice(0, shown).map((h, i) => (
            <line key={i} x1={h.x} y1={h.y} x2={h.x2} y2={h.y2} strokeWidth={h.w} className="strand" style={{ animationDelay: `${(i % 18) * 12}ms` }} />
          ))}
        </g>
      </svg>
      <p className="grower-line" aria-live="polite">{GROW_LINES[Math.min(taps, max)]}</p>
      <div className="row" style={{ justifyContent: "center" }}>
        {!done ? (
          <button className="btn yellow" onClick={() => setTaps((t) => t + 1)}>Ugaao 🌱</button>
        ) : (
          <button className="btn ghost" style={{ color: "#fff", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.3)" }} onClick={() => setTaps(0)}>
            Phir se takla karo
          </button>
        )}
      </div>
    </div>
  );
}
