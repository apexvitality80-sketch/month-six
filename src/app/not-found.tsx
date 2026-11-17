import Link from "next/link";

export default function NotFound() {
  return (
    <div className="narrow stack" style={{ paddingBlock: 96, gap: 14, textAlign: "center", alignItems: "center" }}>
      <div className="stat-num" style={{ fontSize: 72 }}>404</div>
      <h2>Yeh page bhi jhad gaya.</h2>
      <p className="muted">It was here once. Like the hairline in your school ID card photo.</p>
      <Link href="/" className="btn">Back to home</Link>
    </div>
  );
}
