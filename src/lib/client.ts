"use client";
// Browser-only helpers: remembered tracker codes (localStorage) and photos (IndexedDB).
// Photos are stored on this device only and are never sent to the server.

const KEY = "month-six:trackers";
export function rememberTracker(id: string) {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]") as string[];
    localStorage.setItem(KEY, JSON.stringify([id, ...list.filter((x) => x !== id)].slice(0, 5)));
  } catch {}
}
export function savedTrackers(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
export function forgetTracker(id: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify(savedTrackers().filter((x) => x !== id)));
  } catch {}
}

export type PhotoSet = { date: string; photos: Record<string, string> };

function db(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open("month-six", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("photos");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
export async function loadPhotos(trackerId: string): Promise<PhotoSet[]> {
  try {
    const d = await db();
    return await new Promise((res) => {
      const q = d.transaction("photos").objectStore("photos").get(trackerId);
      q.onsuccess = () => res((q.result as PhotoSet[]) || []);
      q.onerror = () => res([]);
    });
  } catch {
    return [];
  }
}
export async function savePhotos(trackerId: string, sets: PhotoSet[]): Promise<boolean> {
  try {
    const d = await db();
    await new Promise<void>((res, rej) => {
      const t = d.transaction("photos", "readwrite");
      t.objectStore("photos").put(sets, trackerId);
      t.oncomplete = () => res();
      t.onerror = () => rej(t.error);
    });
    return true;
  } catch {
    return false;
  }
}
export async function deletePhotos(trackerId: string) {
  try {
    const d = await db();
    d.transaction("photos", "readwrite").objectStore("photos").delete(trackerId);
  } catch {}
}

export function compress(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        const s = Math.min(1, 1000 / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = Math.round(im.width * s);
        c.height = Math.round(im.height * s);
        c.getContext("2d")!.drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", 0.82));
      };
      im.onerror = rej;
      im.src = fr.result as string;
    };
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

/** Drawn illustration for the example tracker. Clearly not a real person. */
export function drawExample(angle: string, density: number, seed: number) {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const c = document.createElement("canvas");
  c.width = 300;
  c.height = 400;
  const g = c.getContext("2d")!;
  const bg = g.createLinearGradient(0, 0, 0, 400);
  bg.addColorStop(0, "#2b3a52");
  bg.addColorStop(1, "#141c28");
  g.fillStyle = bg;
  g.fillRect(0, 0, 300, 400);
  g.fillStyle = "#d7a98a";
  if (angle === "crown") {
    g.beginPath();
    g.ellipse(150, 210, 120, 140, 0, 0, Math.PI * 2);
    g.fill();
  } else {
    g.beginPath();
    g.ellipse(150, 240, 108, 150, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#c99a7c";
    g.fillRect(118, 300, 64, 100);
  }
  g.strokeStyle = "#2a1c14";
  g.lineCap = "round";
  const n = Math.round(2600 * density);
  for (let i = 0; i < n; i++) {
    let x: number, y: number, ok: boolean;
    if (angle === "crown") {
      const a = r() * Math.PI * 2, d = Math.sqrt(r());
      x = 150 + Math.cos(a) * 118 * d;
      y = 210 + Math.sin(a) * 138 * d;
      ok = Math.hypot(x - 150, y - 200) >= 70 * (1.25 - density) || r() < 0.12;
    } else {
      x = 50 + r() * 200;
      y = 88 + r() * 130;
      const line = 150 - 40 * Math.cos(((x - 150) / 100) * 1.4) + (angle === "temples" && x > 150 ? 30 : 0) + (1 - density) * 40;
      ok = y < line || r() < 0.03 * density;
    }
    if (!ok) continue;
    g.globalAlpha = 0.55 + r() * 0.4;
    g.lineWidth = 0.8 + r() * 0.9;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (r() - 0.5) * 7, y + (angle === "crown" ? (r() - 0.5) * 7 : -4 - r() * 6));
    g.stroke();
  }
  g.globalAlpha = 1;
  return c.toDataURL("image/jpeg", 0.82);
}
