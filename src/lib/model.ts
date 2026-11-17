// Shared types and the "is it working?" logic. Runs on both server and client.

export type Product = "topical" | "minoxfin" | "oral" | "other";

export const PRODUCTS: Record<Product, { name: string; oral?: boolean }> = {
  topical: { name: "Minoxidil 5% solution or serum" },
  minoxfin: { name: "Minoxidil + finasteride solution (e.g. Minoxfin)" },
  oral: { name: "Tablets (oral minoxidil or finasteride)", oral: true },
  other: { name: "Something else / not sure" },
};

export type Count = { date: string; count: number };
export type Checkin = {
  date: string;
  baby: "Yes" | "Not sure" | "No";
  missed: "0" | "1-3" | "4-7" | "8+";
  irritation: "None" | "Mild" | "Bad";
  systemic: "No" | "Yes";
};

export type Tracker = {
  id: string;
  createdAt: string;
  startDate: string;
  product: Product;
  counts: Count[];
  checkins: Checkin[];
};

// Reference values from the refined wash test (Li et al., Clin Cosmet Investig Dermatol 2022):
// mean hairs shed per daily wash, 27.9 normal, 52.2 pattern hair loss, 125.5 telogen effluvium;
// above 53.6 separated telogen effluvium from normal with 97% specificity.
export const BANDS = { healthyTop: 40, heavyFrom: 55 };

export const DAY = 864e5;
export const parseISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
export const toISO = (d: Date) => d.toISOString().slice(0, 10);
export const todayISO = () => {
  const d = new Date();
  return toISO(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())));
};
export const addDays = (s: string, n: number) => toISO(new Date(parseISO(s).getTime() + n * DAY));
export const weekOf = (start: string, at: string) =>
  Math.max(0, Math.floor((parseISO(at).getTime() - parseISO(start).getTime()) / (7 * DAY)));
export const monthOf = (w: number) => Math.floor(w / 4.345) + 1;
export const niceDate = (s: string) =>
  parseISO(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export const PHASES = [
  { id: "start", from: 0, to: 2, name: "Getting started", short: "Start" },
  { id: "shed", from: 2, to: 12, name: "Shedding window", short: "Shedding" },
  { id: "settle", from: 12, to: 26, name: "Settling and early regrowth", short: "Settle" },
  { id: "judge", from: 26, to: 52, name: "Time to judge", short: "Judge" },
] as const;
export const phaseOf = (w: number) => PHASES.find((p) => w >= p.from && w < p.to) ?? PHASES[3];

/** Average shed count per treatment week, oldest first. */
export function weekly(t: Tracker) {
  const by = new Map<number, number[]>();
  for (const c of t.counts) {
    const w = weekOf(t.startDate, c.date);
    by.set(w, [...(by.get(w) ?? []), c.count]);
  }
  return [...by.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([week, xs]) => ({ week, avg: Math.round(xs.reduce((s, x) => s + x, 0) / xs.length), n: xs.length }));
}

export type Reading = {
  tone: "good" | "shed" | "warn" | "crit" | "neutral";
  tag: string;
  title: string;
  body: string;
  points: string[];
};

export function summary(t: Tracker, today = todayISO()) {
  const w = weekOf(t.startDate, today);
  const wk = weekly(t);
  const baseline = wk.length ? wk[0] : null;
  const latest = wk.length ? wk[wk.length - 1] : null;
  const peak = wk.reduce<null | { week: number; avg: number }>((m, x) => (!m || x.avg > m.avg ? x : m), null);
  const change = baseline && latest && baseline !== latest ? Math.round(((latest.avg - baseline.avg) / baseline.avg) * 100) : null;
  return { w, wk, baseline, latest, peak, change };
}

export function reading(t: Tracker, today = todayISO()): Reading {
  const { w, wk, baseline, latest, peak } = summary(t, today);
  const ck = t.checkins[t.checkins.length - 1];
  const oral = PRODUCTS[t.product].oral;

  if (ck && (ck.irritation === "Bad" || (oral && ck.systemic === "Yes"))) {
    return {
      tone: "crit",
      tag: "See a doctor",
      title: ck.systemic === "Yes" ? "Speak to a doctor before your next tablet" : "Bad irritation needs a doctor's look",
      body:
        ck.systemic === "Yes"
          ? "Dizziness, swollen ankles or a racing heartbeat on tablets should be checked, not waited out."
          : "Strong itching, redness or bumps can be a reaction to the liquid base rather than to minoxidil itself. A dermatologist can switch you to a formulation that suits your scalp.",
      points: ["Don't switch products on your own.", "Take your doctor report from this page to the appointment."],
    };
  }
  if (!latest) {
    return {
      tone: "neutral",
      tag: w < 2 ? `Week ${w}` : "No baseline yet",
      title: "Do your first count this week",
      body:
        "Your shed count is the number every later week is measured against. Wash over a light cloth or drain catcher, count what falls, and log it. Three days in a row gives a reliable number.",
      points: ["Takes about 5 minutes a day for 3 days.", "Do it before the shedding phase starts if you can."],
    };
  }
  if (ck && ck.missed === "8+") {
    return {
      tone: "warn",
      tag: "Consistency",
      title: "Missed days are hurting you more than the product",
      body: "Minoxidil only works while it is on your scalp. Missing 8 or more days a month brings shedding back and resets the clock.",
      points: ["Attach it to something you already do every day.", "Gains stop when use stops."],
    };
  }
  if (baseline && latest !== baseline && w <= 12 && latest.avg > baseline.avg * 1.15) {
    return {
      tone: "shed",
      tag: "Expected shedding",
      title: `Up from ${baseline.avg} to ${latest.avg} hairs a wash. This is the phase most people quit in.`,
      body:
        "In weeks 2 to 12, minoxidil pushes resting hairs out so new ones can grow. Doctors and telehealth brands abroad warn patients about this exact phase because it looks like failure.",
      points: ["Don't stop. Stopping now gives you the shed without the regrowth.", "Keep counting every two weeks. The line should turn down after week 12."],
    };
  }
  if (peak && baseline && peak.avg > baseline.avg && latest.week > peak.week && w > 10 && latest.avg <= peak.avg * 0.8) {
    return {
      tone: "good",
      tag: "Coming down",
      title: `Shedding is down ${Math.round((1 - latest.avg / peak.avg) * 100)}% from its peak`,
      body: "Your count rose in the shedding window and is now falling. That is the pattern of a treatment that is working.",
      points: ["Keep the same routine. Don't add new products now.", `Your fair verdict date is ${niceDate(addDays(t.startDate, 365))}.`],
    };
  }
  if (w >= 16 && latest.avg >= BANDS.heavyFrom && wk.length >= 2 && latest.avg >= wk[wk.length - 2].avg) {
    return {
      tone: "warn",
      tag: "Worth checking",
      title: "Shedding is still heavy after month 4",
      body: `${latest.avg} hairs a wash is above the range seen in pattern hair loss alone. Iron, vitamin D, thyroid or stress can cause shedding that minoxidil won't fix.`,
      points: ["Ask a dermatologist about blood tests: ferritin, vitamin D, B12, TSH.", "Keep using your treatment until you've spoken to them."],
    };
  }
  if (ck && ck.baby === "Yes") {
    return {
      tone: "good",
      tag: "Early regrowth",
      title: "Fine, light new hairs are the first sign it is working",
      body: "Baby hairs thicken and darken over the next few months. In a study of 400 minoxidil users, 89% of people who saw only baby hairs still quit. Don't be one of them.",
      points: ["Compare this month's photo with month zero, not with last week.", "Next milestone: those hairs getting darker by month 6."],
    };
  }
  if (baseline && latest !== baseline && w >= 8 && latest.avg <= baseline.avg * 1.05) {
    return {
      tone: "good",
      tag: "Stable",
      title: "Shedding is at or below where you started",
      body: "Stopping further loss is the first job of treatment. Regrowth comes after. People who see their shedding stabilise are far more likely to stay on long enough to see it.",
      points: ["Keep going.", `Your fair verdict date is ${niceDate(addDays(t.startDate, 365))}.`],
    };
  }
  if (w >= 26) {
    return {
      tone: "neutral",
      tag: "Review time",
      title: "Six months in: time for a proper review",
      body: "You have given it a fair run. Take your doctor report to a dermatologist. They can change the strength, add a medicine or look for another cause.",
      points: ["Open the doctor report and bring your photos.", "Judge from your numbers and photos, not the mirror."],
    };
  }
  return {
    tone: "neutral",
    tag: "Too early to judge",
    title: "Nothing here says it is failing. It is early.",
    body: `At week ${w}, most change is still under the skin. Results are judged at 6 to 12 months.`,
    points: ["Keep counting every two weeks.", "Look for less hair in the drain and fine new hairs at the edges."],
  };
}

export function newId() {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const s = [...bytes].map((b) => abc[b % abc.length]).join("");
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}
export const validId = (s: string) => /^[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(s);
export const validDate = (s: unknown): s is string =>
  typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(parseISO(s).getTime());

/** Read-only example tracker, 18 weeks in, shown at /t/DEMO-DEMO. Clearly labelled as an example. */
export const DEMO_ID = "DEMO-DEMO";
export function demoTracker(today = todayISO()): Tracker {
  const start = addDays(today, -7 * 18 - 2);
  const at = (w: number, d = 0) => addDays(start, w * 7 + d);
  const pts: [number, number, number][] = [
    [0, 0, 46], [0, 1, 44], [0, 2, 47], [2, 0, 50], [4, 0, 62], [4, 1, 60], [4, 2, 64], [6, 0, 71], [8, 0, 68], [8, 1, 70],
    [10, 0, 63], [12, 0, 55], [12, 1, 57], [14, 0, 50], [16, 0, 44], [16, 1, 42], [16, 2, 45], [18, 0, 39],
  ];
  return {
    id: DEMO_ID,
    createdAt: start,
    startDate: start,
    product: "minoxfin",
    counts: pts.map(([w, d, count]) => ({ date: at(w, d), count })),
    checkins: [
      { date: at(4, 2), baby: "No", missed: "1-3", irritation: "Mild", systemic: "No" },
      { date: at(8, 1), baby: "No", missed: "0", irritation: "None", systemic: "No" },
      { date: at(12, 1), baby: "Not sure", missed: "0", irritation: "None", systemic: "No" },
      { date: at(17, 0), baby: "Yes", missed: "1-3", irritation: "None", systemic: "No" },
    ],
  };
}
