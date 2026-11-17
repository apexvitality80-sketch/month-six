import Link from "next/link";
import Timeline from "@/components/Timeline";

export const metadata = { title: "Week by week on minoxidil · Month Six" };

const phases = [
  {
    when: "Weeks 0 to 2",
    name: "Getting started",
    normal: "Nothing visible. Some men notice a slightly oily or itchy scalp from the solution.",
    todo: "Do your baseline shed count and first photos now, before anything changes.",
    worry: "Rash, swelling or strong burning: stop and see a doctor.",
  },
  {
    when: "Weeks 2 to 12",
    name: "Shedding window",
    normal: "Hair fall goes up, sometimes a lot. Minoxidil pushes resting hairs out so new ones can grow in their place. US telehealth service Hims tells its patients this means the treatment is working.",
    todo: "Keep going. Count every 2 weeks. A rising count here is expected.",
    worry: "Mild itching is common. Bad redness, bumps or flaking that won't settle: see a dermatologist about a different formulation.",
  },
  {
    when: "Weeks 12 to 26",
    name: "Settling and early regrowth",
    normal: "Your count should come down from its peak. Fine, light baby hairs may appear at the hairline or crown. Many men still see little change in the mirror.",
    todo: "Compare photos with month zero, not last week. Stable shedding counts as progress.",
    worry: "Shedding still rising after month 4, or over 55 a wash: ask about blood tests for iron, vitamin D, B12 and thyroid.",
  },
  {
    when: "Weeks 26 to 52",
    name: "Time to judge",
    normal: "Baby hairs thicken and darken. Density changes start to show in photos. A 2023 clinical study recommends at least 12 months before judging minoxidil.",
    todo: "At month 6, take your doctor report to a dermatologist. At month 12, decide with them whether to continue, change or add treatment.",
    worry: "No change in count or photos by month 6: worth a review, not a quiet switch to another brand.",
  },
];

const myths = [
  ["It should work in 90 days", "Hair grows in cycles that last months. Most visible change shows between months 4 and 12."],
  ["More hair fall means it's making it worse", "In weeks 2 to 12, more fall is usually old hairs making room. It is the most common point at which people quit."],
  ["Baby hairs don't count", "They are the first visible regrowth. In one study, 89% of people who saw only baby hairs still stopped treatment."],
  ["I'll switch to a stronger brand", "Many switches are to the same molecule, started later, after the shedding has passed. The new brand then gets the credit."],
  ["I can stop once it works", "Gains from minoxidil last only while you use it. Stopping usually brings the shedding back within a few months."],
  ["Onion juice will fix it", "Your mother means well. Your pillow cover disagrees. Herbal oils can support a routine, but they don't replace minoxidil or finasteride for pattern hair loss."],
  ["Helmet pehenne se baal jhadte hain", "Helmets don't cause pattern hair loss. Not wearing one causes other problems. Wear the helmet."],
];

export default function Guide() {
  return (
    <div className="wrap stack" style={{ paddingBlock: 48, gap: 32 }}>
      <div className="stack" style={{ gap: 10, maxWidth: 720 }}>
        <span className="label">Week by week</span>
        <h1 style={{ fontSize: 42 }}>What is normal on minoxidil, and when to worry</h1>
        <p className="muted">
          Hair transplant clinics in Turkey give every patient a day-by-day guide to what is normal after surgery, because the scary phases make people panic. Men on minoxidil go through the same kind of phases and get no guide at all. This is that guide.
        </p>
      </div>
      <div className="card" style={{ paddingTop: 36 }}><Timeline /></div>

      <div className="stack">
        {phases.map((p) => (
          <div key={p.when} className="card grid3" style={{ alignItems: "start" }}>
            <div className="stack" style={{ gap: 4 }}>
              <span className="mono small" style={{ color: "var(--accent)", fontWeight: 600 }}>{p.when}</span>
              <h3>{p.name}</h3>
            </div>
            <div className="stack" style={{ gap: 4 }}>
              <span className="label">What is normal</span>
              <p className="muted small">{p.normal}</p>
              <span className="label" style={{ marginTop: 8 }}>What to do</span>
              <p className="small">{p.todo}</p>
            </div>
            <div className="stack" style={{ gap: 4 }}>
              <span className="label" style={{ color: "var(--shed)" }}>When to see a doctor</span>
              <p className="muted small">{p.worry}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="stack" style={{ gap: 12, maxWidth: 760 }}>
        <h2>Beliefs that make men quit too early</h2>
        <p className="wit">Sharma ji ke bete ke baal bhi isi phase se guzre the.</p>
        <div>
          {myths.map(([q, a]) => (
            <details key={q}>
              <summary>&ldquo;{q}&rdquo;</summary>
              <div>{a}</div>
            </details>
          ))}
        </div>
      </div>

      <div className="card stack" style={{ gap: 6 }}>
        <span className="label">Always see a doctor first if</span>
        <p className="muted small">You are on tablets and feel dizzy, get swollen ankles or a racing heartbeat. Your hair is falling out in patches. You have scalp pain or scarring. You are under 18. This page is general information, not medical advice.</p>
      </div>

      <p className="small muted">
        Sources: <a href="https://doi.org/10.1007/s13555-023-00919-x" target="_blank" rel="noreferrer">Shadi Z., Dermatology and Therapy, 2023</a> (400 patients, minoxidil discontinuation) ·{" "}
        <a href="https://www.hims.com/hair-loss/check-in" target="_blank" rel="noreferrer">Hims hair check-in guidance</a> ·{" "}
        <a href="https://www.dovepress.com/hair-shedding-evaluation-for-alopecia-a-refined-wash-test-peer-reviewed-fulltext-article-CCID" target="_blank" rel="noreferrer">Li X. et al., 2022, refined wash test</a> ·{" "}
        <a href="https://apps.apple.com/us/app/heva-clinic-hair-transplant/id6738750364" target="_blank" rel="noreferrer">Heva Clinic aftercare app</a>
      </p>
      <Link href="/start" className="btn" style={{ alignSelf: "start" }}>Start my tracker</Link>
    </div>
  );
}
