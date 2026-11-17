import Link from "next/link";
import Timeline from "@/components/Timeline";
import HairGrower from "@/components/HairGrower";

const others = [
  {
    who: "Hims (US)",
    does: "Tells patients that shedding in months 1 to 3 means the treatment is working. Asks for photos from week one. Runs a structured check-in at month 3.",
    gap: "Not available in India. Photos are the only measure.",
    href: "https://www.hims.com/hair-loss/check-in",
  },
  {
    who: "Numan (UK)",
    does: "Photos every 30 days from the same five angles. A money-back guarantee that can only be claimed after day 180, which sets the customer's clock to six months.",
    gap: "Photos only, and the guarantee is the main reason to keep them.",
    href: "https://www.numan.com/hair-loss/men/confront-hair-loss-with-confidence-numan-money-back-guarantee",
  },
  {
    who: "Transplant clinics in Turkey (e.g. Heva)",
    does: "An aftercare app with a recovery timeline built from the surgery date, daily guidance on what is normal, and photo uploads reviewed by clinic staff.",
    gap: "Built for surgery patients. Nothing like it exists for men on minoxidil.",
    href: "https://apps.apple.com/us/app/heva-clinic-hair-transplant/id6738750364",
  },
  {
    who: "AI scan apps (e.g. Trichometrics)",
    does: "Scan your hairline and crown and get a 0 to 100 density score.",
    gap: "The scores are proprietary and not clinically validated. The app says it is for information only.",
    href: "https://play.google.com/store/apps/details?id=com.trichometrics.app&hl=en_US",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero-band">
        <div className="wrap hero">
          <div>
            <span className="chip">Aaina jhooth bolta hai. Ginti nahi.</span>
            <h1 style={{ marginTop: 14 }}>
              Is your hair treatment working? <span className="hl">Count it.</span> Don&rsquo;t guess.
            </h1>
            <p className="lead">
              Minoxidil takes 6 to 12 months and usually sheds before it grows. The mirror can&rsquo;t show slow change, so most men quit right before it starts working. Month Six gives you a number to track, tells you what is normal for your week, and builds a report you can show a doctor.
            </p>
            <div className="row" style={{ marginTop: 26 }}>
              <Link href="/start" className="btn yellow">Start my tracker</Link>
              <Link href="/t/DEMO-DEMO" className="btn ghost" style={{ color: "#fff", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.3)" }}>
                See a 5-month example
              </Link>
            </div>
            <p className="small" style={{ marginTop: 14, color: "#a8a8a8" }}>No sign-up. No name or phone number. Photos never leave your phone.</p>
          </div>
          <div className="hero-card"><HairGrower /></div>
        </div>
      </section>

      <section className="section" style={{ paddingBlock: 36, background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap grid3">
          <div className="stack" style={{ gap: 6 }}>
            <div className="stat-num">86%</div>
            <p className="small muted">of 400 patients at one dermatology clinic had stopped minoxidil. Those who could see improvement were far more likely to stay. <a href="https://doi.org/10.1007/s13555-023-00919-x" target="_blank" rel="noreferrer">Study</a></p>
          </div>
          <div className="stack" style={{ gap: 6 }}>
            <div className="stat-num">89%</div>
            <p className="small muted">of people who saw only baby hairs, the first sign it works, still quit. Mubarak ho, baal hue hain. Phir bhi chhod diya.</p>
          </div>
          <div className="stack" style={{ gap: 6 }}>
            <div className="stat-num">28 · 52 · 125</div>
            <p className="small muted">hairs per wash: healthy, pattern hair loss, stress shedding. Your own number tells you which way you are moving. <a href="https://www.dovepress.com/hair-shedding-evaluation-for-alopecia-a-refined-wash-test-peer-reviewed-fulltext-article-CCID" target="_blank" rel="noreferrer">Study</a></p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack" style={{ gap: 28 }}>
          <div className="stack" style={{ gap: 8, maxWidth: 700 }}>
            <span className="label">The problem</span>
            <h2>The treatment runs on a 12-month clock. Most people expect 90 days.</h2>
            <p className="muted">
              Weeks 2 to 12 are the shedding window. Hair fall goes up, which looks exactly like failure. Most men give up there, or switch brands, and never see the regrowth that comes after it.
            </p>
          </div>
          <div className="card" style={{ paddingTop: 34 }}><Timeline /></div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface)", borderBlock: "1px solid var(--line)" }}>
        <div className="wrap stack" style={{ gap: 28 }}>
          <div className="stack" style={{ gap: 8, maxWidth: 700 }}>
            <span className="label">How it works</span>
            <h2>Three measures the mirror can&rsquo;t give you</h2>
          </div>
          <div className="grid3">
            <div className="stack" style={{ gap: 8 }}>
              <span className="step-n">01 · Shed count</span>
              <h3>A number, not a feeling</h3>
              <p className="muted">
                Wash over a light cloth, count the hairs, log the number. A 2022 dermatology study found about 28 hairs a wash on healthy scalps, 52 in pattern hair loss and 125 in stress shedding. A line going down is proof.
              </p>
              <Link href="/how-to-count" className="small">How to count in 5 minutes</Link>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              <span className="step-n">02 · Week-by-week reading</span>
              <h3>Know what is normal right now</h3>
              <p className="muted">
                Your count, your week and four quick answers turn into one plain reading: expected shedding, coming down, stable, early regrowth, too early, or see a doctor.
              </p>
              <Link href="/guide" className="small">Read the week-by-week guide</Link>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              <span className="step-n">03 · Photos and doctor report</span>
              <h3>Same angle, every month</h3>
              <p className="muted">
                Monthly photos from three fixed angles, compared with a slider. One page with your counts, photos and answers to show a dermatologist, so the month-3 consult looks at your actual progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack" style={{ gap: 24 }}>
          <div className="stack" style={{ gap: 8, maxWidth: 760 }}>
            <span className="label">What others already do</span>
            <h2>The best ideas from the US, UK and Turkey, put together for Indian men on minoxidil</h2>
            <p className="muted">
              Every service that keeps hair-loss patients long enough to see results does two things. It sets the right clock, and it makes progress visible. Month Six does both and adds the one thing none of them measure: shedding.
            </p>
          </div>
          <div className="card scroll-x" style={{ padding: 0 }}>
            <table className="compare-table">
              <thead>
                <tr><th>Who</th><th>What they do</th><th>What is missing</th></tr>
              </thead>
              <tbody>
                {others.map((o) => (
                  <tr key={o.who}>
                    <td style={{ fontWeight: 600, minWidth: 150 }}><a href={o.href} target="_blank" rel="noreferrer">{o.who}</a></td>
                    <td>{o.does}</td>
                    <td className="muted">{o.gap}</td>
                  </tr>
                ))}
                <tr style={{ background: "var(--accent-soft)" }}>
                  <td style={{ fontWeight: 700 }}>Month Six</td>
                  <td>The right clock, a shed count you can trust, same-angle photos and a doctor report. Free, no account.</td>
                  <td className="muted">Not a diagnosis. It tells you when to see a doctor.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid2" style={{ alignItems: "center" }}>
          <div className="stack" style={{ gap: 10 }}>
            <span className="label">No judgement zone</span>
            <h2>Bald is a look. Balding is a phase. Dono theek hain.</h2>
            <p className="muted">Half the uncles at every Indian wedding are proof that a shiny head and a full life go together. If you want to keep your hair, we&rsquo;ll help you see whether the treatment is working. If you go full Bala mode later, that&rsquo;s a win too.</p>
          </div>
          <div className="card stack" style={{ gap: 10, background: "var(--pop)", borderColor: "#f0e7a6" }}>
            <span className="label">Honest disclaimer</span>
            <p>Yeh website aapke baal nahi uga sakti. Woh minoxidil ka kaam hai. Hum bas tab tak aapka haath pakad ke rakhenge, jab tak woh apna kaam kar le.</p>
            <p className="small muted">We also can&rsquo;t fix the uncle who asks &ldquo;beta, baal kahan gaye?&rdquo; at every family function. Some problems are beyond technology.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="card row between" style={{ padding: 28, background: "var(--accent)", color: "#fff", border: 0 }}>
            <div className="stack" style={{ gap: 6 }}>
              <h2 style={{ color: "#fff" }}>Started treatment recently?</h2>
              <p style={{ color: "#d0def1" }}>Do your first count before the shedding window. It is the number everything else is measured against.</p>
            </div>
            <Link href="/start" className="btn yellow">Start my tracker</Link>
          </div>
        </div>
      </section>
    </>
  );
}
