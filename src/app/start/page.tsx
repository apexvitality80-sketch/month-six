"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, todayISO, validId, type Product } from "@/lib/model";
import { rememberTracker, savedTrackers } from "@/lib/client";

export default function Start() {
  const router = useRouter();
  const [startDate, setStartDate] = useState(todayISO());
  const [product, setProduct] = useState<Product>("minoxfin");
  const [code, setCode] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSaved(savedTrackers());
  }, []);

  async function create() {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/trackers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ startDate, product }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Could not create your tracker.");
      rememberTracker(j.id);
      router.push(`/t/${j.id}?new=1`);
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  }

  function open() {
    const c = code.trim().toUpperCase().replace(/\s+/g, "");
    const norm = c.length === 8 ? `${c.slice(0, 4)}-${c.slice(4)}` : c;
    if (!validId(norm)) return setErr("A tracker code looks like K7QM-29XD.");
    router.push(`/t/${norm}`);
  }

  return (
    <div className="narrow stack" style={{ paddingBlock: 48, gap: 24 }}>
      <div className="stack" style={{ gap: 8 }}>
        <span className="label">Start tracking</span>
        <h1 style={{ fontSize: 38 }}>Two questions. No sign-up.</h1>
        <p className="muted">You get a private tracker code. Save it, and you can open your tracker from any phone or laptop. We never ask for your name, email or phone number.</p>
      </div>

      {saved.length > 0 && (
        <div className="card stack" style={{ gap: 10 }}>
          <span className="label">Your trackers on this device</span>
          <div className="row">
            {saved.map((id) => (
              <Link key={id} href={`/t/${id}`} className="btn ghost small mono">{id}</Link>
            ))}
          </div>
        </div>
      )}

      <div className="card stack">
        <label className="field">
          <span className="label">When did you start treatment?</span>
          <input type="date" id="startDate" value={startDate} max={todayISO()} onChange={(e) => setStartDate(e.target.value)} />
          <span className="small muted">Not started yet? Leave today. Your first count becomes the baseline.</span>
        </label>
        <label className="field">
          <span className="label">What are you using?</span>
          <select id="product" value={product} onChange={(e) => setProduct(e.target.value as Product)}>
            {Object.entries(PRODUCTS).map(([k, p]) => (
              <option key={k} value={k}>{p.name}</option>
            ))}
          </select>
        </label>
        <button className="btn" onClick={create} disabled={busy}>{busy ? "Creating..." : "Create my tracker"}</button>
        {err && <p className="error">{err}</p>}
      </div>

      <div className="card stack" style={{ gap: 10 }}>
        <span className="label">Already have a code?</span>
        <div className="row" style={{ flexWrap: "nowrap" }}>
          <input type="text" id="code" placeholder="K7QM-29XD" value={code} onChange={(e) => setCode(e.target.value)} className="mono" />
          <button className="btn ghost" onClick={open}>Open</button>
        </div>
      </div>
    </div>
  );
}
