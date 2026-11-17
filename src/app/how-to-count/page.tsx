import Link from "next/link";

export const metadata = { title: "How to count your hair fall · Month Six" };

const steps = [
  ["The day before", "Wash your hair as usual. This clears out hairs that were already loose, so day 1 starts clean."],
  ["Set up", "Put a light-coloured cloth, an old handkerchief or a drain catcher over the drain. Dark hair shows up clearly on it."],
  ["Wash once", "Shampoo and rinse as normal. One wash only. Don't comb your hair in the hour before."],
  ["Collect", "Pick up every hair from the cloth. Add the ones on your towel after drying. Skip the ones on your pillow; those vary too much."],
  ["Count", "Line them up on a sheet of paper in groups of 10. It takes 2 to 3 minutes. Log the number on your tracker."],
  ["Repeat for 3 days", "Three days in a row gives one reliable number. Your tracker averages them by week."],
];

export default function HowToCount() {
  return (
    <div className="narrow stack" style={{ paddingBlock: 48, gap: 28 }}>
      <div className="stack" style={{ gap: 10 }}>
        <span className="label">The shed count</span>
        <h1 style={{ fontSize: 40 }}>Count your hair fall in 5 minutes a day</h1>
        <p className="wit">Haan, sach mein ek ek baal ginna hai. YouTube ka ek unskippable ad bhi itna hi lamba hota hai.</p>
        <p className="muted">
          This is a home version of the wash test dermatologists use to measure shedding. A 2022 study of 176 adults found an average of <b>28 hairs per wash</b> on healthy scalps, <b>52</b> in pattern hair loss and <b>125</b> in stress-related shedding (telogen effluvium). One number, tracked over months, shows you what the mirror can&rsquo;t.
        </p>
      </div>

      <ol className="stack" style={{ paddingLeft: 0, listStyle: "none", gap: 14, margin: 0 }}>
        {steps.map(([h, b], i) => (
          <li key={h} className="card row" style={{ alignItems: "flex-start", flexWrap: "nowrap", gap: 16 }}>
            <span className="mono" style={{ fontSize: 20, color: "var(--accent)", fontWeight: 700, minWidth: 28 }}>{i + 1}</span>
            <div className="stack" style={{ gap: 4 }}><b>{h}</b><span className="muted">{b}</span></div>
          </li>
        ))}
      </ol>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>How often</h3>
        <p className="muted">Once before you start treatment, or as early as you can. Then every 2 weeks for the first 3 months, when shedding moves fastest. After that, once a month.</p>
        <h3 style={{ marginTop: 8 }}>Reading the number</h3>
        <ul className="muted" style={{ margin: 0, paddingLeft: 18 }}>
          <li><b style={{ color: "var(--good)" }}>Under 40:</b> within the healthy range.</li>
          <li><b style={{ color: "#9a7a00" }}>40 to 55:</b> the range seen in pattern hair loss.</li>
          <li><b style={{ color: "var(--shed)" }}>Over 55:</b> heavy shedding. In weeks 2 to 12 of minoxidil this is expected. If it stays this high after month 4, see a dermatologist.</li>
        </ul>
        <p className="small muted">What matters most is your own trend, not one day. Washing every second day roughly doubles the count, so keep your routine the same on count days.</p>
      </div>

      <p className="small muted">
        Source: Li X. et al., <a href="https://www.dovepress.com/hair-shedding-evaluation-for-alopecia-a-refined-wash-test-peer-reviewed-fulltext-article-CCID" target="_blank" rel="noreferrer">Hair Shedding Evaluation for Alopecia: A Refined Wash Test</a>, Clinical, Cosmetic and Investigational Dermatology, 2022. A self-count at home is less precise than the clinic version. Use it to track your trend, not to diagnose yourself.
      </p>
      <Link href="/start" className="btn" style={{ alignSelf: "start" }}>Start my tracker</Link>
    </div>
  );
}
