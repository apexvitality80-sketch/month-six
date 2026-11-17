import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["500"] });

export const metadata: Metadata = {
  title: "Month Six: know if your hair treatment is working",
  description:
    "Minoxidil takes 6 to 12 months and often sheds first. Month Six gives you a number to track, a week-by-week guide to what is normal, and a report for your doctor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable}`}>
      <body>
        <header className="site-head">
          <div className="wrap">
            <Link href="/" className="logo" aria-label="Month Six home">
              <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                <circle cx="13" cy="13" r="11.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13 L13 1.5 A11.5 11.5 0 0 1 13 24.5 Z" fill="var(--accent)" />
              </svg>
              Month Six
            </Link>
            <nav className="nav">
              <Link href="/guide">Week by week</Link>
              <Link href="/how-to-count">How to count</Link>
              <Link href="/start" className="cta">My tracker</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-foot">
          <div className="wrap row between">
            <span><b style={{ color: "var(--ink)" }}>Taklu bhi apne hi hain.</b> Month Six is a tracking aid, not medical advice. No account, no name, no phone number. Photos never leave your device.</span>
            <span>A concept for Man Matters customers, built for the Mosaic Wellness Fellowship challenge. Not an official Man Matters product.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
