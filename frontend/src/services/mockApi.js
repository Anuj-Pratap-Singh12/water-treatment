// src/services/mockApi.js
// Simple in-memory store for demo purposes

// ---- Telemetry / Alerts ----
export function getMockTimeseries(n = 60) {
  const now = Date.now();
  return Array.from({ length: n }).map((_, i) => ({
    t: new Date(now - (n - i) * 60000).toISOString(),
    flow: 800 + Math.random() * 400,
    pH: 6.5 + Math.random() * 1.5,
    turb: 1 + Math.random() * 8,
    do: 0.5 + Math.random() * 1.5,
    tds: 600 + Math.random() * 400,
    orp: 150 + Math.random() * 150,
  }));
}

export function getMockAlerts() {
  return [
    { id: 1, type: "DO Low", severity: "high", at: new Date().toISOString() },
    { id: 2, type: "Pump Vibration", severity: "med", at: new Date().toISOString() },
  ];
}

// NEW: simple sensor inventory with live-ish values
export function getMockSensors() {
  const mk = (id, name, unit, min, max, status = "ok") => ({
    id,
    name,
    unit,
    value: +(min + Math.random() * (max - min)).toFixed(2),
    status,                               // "ok" | "warn" | "error"
    updatedAt: new Date().toISOString(),
    location: ["Primary", "Secondary", "Tertiary"][Math.floor(Math.random() * 3)],
  });
  return [
    mk("S1", "Flow Rate", "m³/hr", 8, 24),
    mk("S2", "pH", "", 6.8, 7.6),
    mk("S3", "Dissolved Oxygen", "mg/L", 0.6, 3.2, "warn"),
    mk("S4", "Turbidity", "NTU", 1, 6),
    mk("S5", "TDS", "ppm", 600, 900),
    mk("S6", "ORP", "mV", 200, 350),
  ];
}

// ---- CSV export helper ----
export function exportCsv(rows, filename) {
  const keys = Object.keys(rows[0] || {});
  const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Marketplace + Ledger (tamper-style) ----
let _listings = [];
let _ledger = []; // {time, type, actor, note, hash, prevHash}

function shaSimple(str) {
  // very lightweight hash substitute (NOT cryptographically strong)
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return ("00000000" + (h >>> 0).toString(16)).slice(-8) + Math.random().toString(16).slice(2, 10);
}

function appendLedger({ actor, type, note }) {
  const prevHash = _ledger.length ? _ledger[_ledger.length - 1].hash : null;
  const raw = JSON.stringify({ actor, type, note, prevHash, time: Date.now() });
  const hash = shaSimple(raw);
  _ledger.push({ time: new Date().toISOString(), actor, type, note, prevHash, hash });
}

export function listListings() {
  return _listings.slice();
}
export function createListing(item) {
  _listings.push({ ...item, sold: false });
  appendLedger({ actor: item.seller || "seller", type: "listing", note: `Listed ${item.qty}L @${item.price}` });
}
export function buyListing({ buyer, id }) {
  const it = _listings.find((x) => x.id === id);
  if (!it) return;
  it.sold = true;
  it.buyer = buyer;
  it.soldTime = new Date().toISOString();
  appendLedger({ actor: buyer, type: "purchase", note: `Bought ${it.qty}L from ${it.seller || "seller"}` });
}
export function getLedger() {
  return _ledger.slice();
}

// ---- Simulator persistence (to ledger) ----
export function saveSimulation(sim) {
  appendLedger({ actor: "engineer", type: "simulation", note: `Saved sim for ${sim.reuse}` });
}

// ---- eDNA / Microbial Scheduler ----
let _bio = []; // {id, time, target, result?}
export function scheduleBioCheck({ inDays = 7, target = "Secondary" }) {
  const d = new Date(Date.now() + inDays * 24 * 3600 * 1000);
  const obj = { id: "bio-" + Date.now(), target, time: d.toISOString() };
  _bio.push(obj);
  appendLedger({ actor: "scheduler", type: "bio_schedule", note: `Scheduled ${target} in ${inDays}d` });
  return obj;
}
export function listBioSnapshots() {
  return _bio.slice();
}
export function uploadBioResult(id, result) {
  const it = _bio.find((x) => x.id === id);
  if (!it) return;
  it.result = result;
  appendLedger({ actor: "lab", type: "bio_result", note: `Uploaded result for ${it.target}` });
}
// ---- Mock AI Model Insights for Analytics Dashboard ----
export function getMockModelInsights() {
  const models = [
    "ResNet50",
    "EfficientNetB6",
    "VGG16",
    "MobileNetV2",
    "InceptionV3",
    "DenseNet201",
  ];
  return models.map((m) => ({
    model: m,
    trainAccuracy: +(80 + Math.random() * 15).toFixed(2),
    valAccuracy: +(70 + Math.random() * 25).toFixed(2),
    testAccuracy: +(65 + Math.random() * 30).toFixed(2),
    inferenceTime: +(0.1 + Math.random() * 0.4).toFixed(3), // seconds per image
    parameters: Math.floor(Math.random() * 40 + 20) + "M",
  }));
}
