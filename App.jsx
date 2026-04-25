import { useState, useRef, useCallback } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&family=Bebas+Neue&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080B0F;
    --surface: #0E1318;
    --surface2: #141B22;
    --border: #1C2530;
    --border2: #243040;
    --amber: #F59E0B;
    --orange: #EA580C;
    --green: #22C55E;
    --red: #EF4444;
    --blue: #3B82F6;
    --text: #E2EAF4;
    --muted: #5A7090;
    --mono: 'Share Tech Mono', monospace;
    --display: 'Bebas Neue', sans-serif;
    --ui: 'Rajdhani', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--ui); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 40% at 50% -10%, rgba(234,88,12,0.08) 0%, transparent 60%),
      repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(28,37,48,0.4) 40px),
      repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(28,37,48,0.4) 40px);
  }

  /* ─── HEADER ─── */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    background: rgba(8,11,15,0.9);
    backdrop-filter: blur(8px);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-mark {
    width: 38px;
    height: 38px;
    background: linear-gradient(135deg, var(--orange), var(--amber));
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .logo-text {
    line-height: 1;
  }

  .logo-text .name {
    font-family: var(--display);
    font-size: 22px;
    letter-spacing: 0.08em;
    color: var(--text);
  }

  .logo-text .tagline {
    font-family: var(--mono);
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-top: 1px;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pill {
    font-family: var(--mono);
    font-size: 10px;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .pill-free {
    background: rgba(34,197,94,0.1);
    color: var(--green);
    border: 1px solid rgba(34,197,94,0.2);
  }

  .pill-powered {
    background: rgba(245,158,11,0.08);
    color: var(--amber);
    border: 1px solid rgba(245,158,11,0.15);
  }

  /* ─── MAIN LAYOUT ─── */
  .main {
    max-width: 900px;
    margin: 0 auto;
    padding: 32px 20px 80px;
  }

  /* ─── STEP PANELS ─── */
  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 16px;
    overflow: hidden;
    transition: border-color 0.2s;
  }

  .panel.active { border-color: var(--border2); }
  .panel.done { border-color: rgba(34,197,94,0.2); }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    cursor: default;
    border-bottom: 1px solid var(--border);
  }

  .step-num {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--display);
    font-size: 16px;
    flex-shrink: 0;
    border: 1px solid var(--border2);
    color: var(--muted);
    transition: all 0.3s;
  }

  .panel.active .step-num {
    background: linear-gradient(135deg, var(--orange), var(--amber));
    color: #000;
    border-color: transparent;
  }

  .panel.done .step-num {
    background: rgba(34,197,94,0.15);
    color: var(--green);
    border-color: rgba(34,197,94,0.3);
    font-size: 14px;
  }

  .panel-title {
    font-family: var(--display);
    font-size: 20px;
    letter-spacing: 0.06em;
    color: var(--text);
  }

  .panel-sub {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 1px;
  }

  .panel-body {
    padding: 22px;
  }

  /* ─── UPLOAD ─── */
  .drop-zone {
    border: 2px dashed var(--border2);
    border-radius: 10px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
    background: rgba(255,255,255,0.01);
  }

  .drop-zone:hover, .drop-zone.over {
    border-color: var(--amber);
    background: rgba(245,158,11,0.03);
  }

  .drop-zone input[type=file] {
    position: absolute; inset: 0;
    opacity: 0; cursor: pointer;
    width: 100%; height: 100%;
  }

  .drop-icon { font-size: 40px; margin-bottom: 12px; display: block; }

  .drop-title {
    font-family: var(--display);
    font-size: 22px;
    letter-spacing: 0.06em;
    color: var(--text);
    margin-bottom: 6px;
  }

  .drop-sub {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.08em;
  }

  .thumb-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
  }

  .thumb {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border2);
    flex-shrink: 0;
  }

  .thumb img {
    width: 90px;
    height: 64px;
    object-fit: cover;
    display: block;
  }

  .thumb .del {
    position: absolute;
    top: 3px; right: 3px;
    width: 18px; height: 18px;
    background: rgba(0,0,0,0.75);
    border: none;
    border-radius: 50%;
    color: #ccc;
    font-size: 9px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thumb .del:hover { background: var(--red); color: #fff; }

  /* ─── TERMINAL LOG ─── */
  .terminal {
    background: #050709;
    border: 1px solid #0F1820;
    border-radius: 8px;
    padding: 14px 16px;
    margin-top: 14px;
    font-family: var(--mono);
    font-size: 12px;
    max-height: 160px;
    overflow-y: auto;
    line-height: 1.8;
  }

  .log-line::before { content: '> '; color: var(--amber); }
  .log-line { color: #4ADE80; display: block; }
  .log-line.dim { color: #1E4A30; }
  .log-line.warn { color: var(--amber); }
  .log-line.err { color: var(--red); }

  .cursor {
    display: inline-block;
    width: 8px; height: 13px;
    background: #4ADE80;
    animation: blink 1s step-end infinite;
    vertical-align: middle;
    margin-left: 4px;
  }

  @keyframes blink { 50% { opacity: 0; } }

  /* ─── ERROR ─── */
  .err-box {
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px;
    padding: 12px 16px;
    color: #FCA5A5;
    font-size: 14px;
    margin-top: 12px;
    font-family: var(--mono);
  }

  /* ─── BUTTON ─── */
  .btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 8px;
    font-family: var(--display);
    font-size: 20px;
    letter-spacing: 0.12em;
    cursor: pointer;
    margin-top: 16px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--orange), var(--amber));
    color: #000;
  }

  .btn-primary:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(234,88,12,0.25);
  }

  .btn-primary:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
  }

  .btn-secondary {
    background: rgba(245,158,11,0.1);
    color: var(--amber);
    border: 1px solid rgba(245,158,11,0.2);
    font-size: 17px;
  }

  .btn-secondary:hover:not(:disabled) {
    background: rgba(245,158,11,0.15);
  }

  .btn-secondary:disabled { opacity: 0.3; cursor: not-allowed; }

  /* ─── SPINNER ─── */
  .spin {
    width: 18px; height: 18px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ─── ELD DATA TABLE ─── */
  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--mono);
    font-size: 12px;
  }

  .data-table th {
    text-align: left;
    padding: 8px 12px;
    color: var(--muted);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
    font-weight: 400;
  }

  .data-table td {
    padding: 10px 12px;
    border-bottom: 1px solid rgba(28,37,48,0.5);
    color: #B0C4D8;
  }

  .data-table tr:last-child td { border-bottom: none; }

  .tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
  }

  .tag-drive { background: rgba(234,88,12,0.12); color: #FB923C; border: 1px solid rgba(234,88,12,0.2); }
  .tag-duty  { background: rgba(245,158,11,0.1); color: var(--amber); border: 1px solid rgba(245,158,11,0.2); }
  .tag-off   { background: rgba(90,112,144,0.1); color: var(--muted); border: 1px solid rgba(90,112,144,0.15); }
  .tag-sleep { background: rgba(99,102,241,0.1); color: #A5B4FC; border: 1px solid rgba(99,102,241,0.2); }

  /* ─── TOTALS STRIP ─── */
  .totals-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 14px;
  }

  .total-cell {
    background: var(--surface2);
    padding: 14px 16px;
    text-align: center;
  }

  .total-cell .tc-label {
    font-family: var(--mono);
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .total-cell .tc-val {
    font-family: var(--display);
    font-size: 26px;
    letter-spacing: 0.04em;
    color: var(--amber);
  }

  .total-cell.highlight .tc-val { color: var(--text); font-size: 30px; }

  /* ─── FORM ─── */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  @media (max-width: 520px) { .form-grid { grid-template-columns: 1fr; } }

  .field label {
    display: block;
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .field input, .field select {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border2);
    border-radius: 6px;
    padding: 11px 14px;
    color: var(--text);
    font-family: var(--mono);
    font-size: 14px;
    transition: border-color 0.2s;
    appearance: none;
  }

  .field input:focus, .field select:focus {
    outline: none;
    border-color: var(--amber);
  }

  .field select option { background: #0E1318; }

  .field.full { grid-column: 1 / -1; }

  /* ─── RESULTS ─── */
  .results-wrap {
    background: var(--surface);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border);
    margin-bottom: 16px;
    animation: fadeUp 0.4s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .results-header {
    padding: 18px 22px;
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  .results-title {
    font-family: var(--display);
    font-size: 22px;
    letter-spacing: 0.08em;
    color: var(--text);
  }

  .verdict {
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 700;
    padding: 5px 14px;
    border-radius: 20px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .v-match   { background: rgba(34,197,94,0.1);  color: var(--green); border: 1px solid rgba(34,197,94,0.25); }
  .v-under   { background: rgba(239,68,68,0.1);   color: var(--red);   border: 1px solid rgba(239,68,68,0.25); }
  .v-over    { background: rgba(245,158,11,0.1);  color: var(--amber); border: 1px solid rgba(245,158,11,0.25); }

  .compare-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-bottom: 1px solid var(--border);
  }

  @media (max-width: 520px) { .compare-grid { grid-template-columns: 1fr; } }

  .cg-cell {
    padding: 22px 22px;
    border-right: 1px solid var(--border);
  }

  .cg-cell:last-child { border-right: none; }

  .cg-label {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .cg-val {
    font-family: var(--display);
    font-size: 38px;
    letter-spacing: 0.04em;
    line-height: 1;
    color: var(--text);
  }

  .cg-val.pos { color: var(--green); }
  .cg-val.neg { color: var(--red); }
  .cg-val.warn { color: var(--amber); }

  .cg-sub {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    margin-top: 5px;
  }

  /* Pay row */
  .pay-compare {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-bottom: 1px solid var(--border);
  }

  @media (max-width: 520px) { .pay-compare { grid-template-columns: 1fr; } }

  .pc-cell {
    padding: 18px 22px;
    border-right: 1px solid var(--border);
  }

  .pc-cell:last-child { border-right: none; }

  .pc-label {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .pc-val {
    font-family: var(--display);
    font-size: 28px;
    letter-spacing: 0.04em;
    color: var(--text);
  }

  .pc-val.pos { color: var(--green); }
  .pc-val.neg { color: var(--red); }

  /* Analysis */
  .analysis {
    padding: 18px 22px;
    font-size: 15px;
    color: #8AA0BC;
    line-height: 1.7;
    border-bottom: 1px solid var(--border);
  }

  .analysis strong { color: var(--text); }
  .analysis .highlight-text { color: var(--amber); font-weight: 600; }
  .analysis .danger-text { color: var(--red); font-weight: 600; }
  .analysis .good-text { color: var(--green); font-weight: 600; }

  /* Footer note */
  .results-footer {
    padding: 12px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .results-footer span {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.08em;
  }

  .reset-btn {
    background: none;
    border: 1px solid var(--border2);
    border-radius: 6px;
    color: var(--muted);
    font-family: var(--mono);
    font-size: 10px;
    padding: 4px 12px;
    cursor: pointer;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: all 0.2s;
  }

  .reset-btn:hover { border-color: var(--amber); color: var(--amber); }

  /* ─── NOTE BOX ─── */
  .note-box {
    background: rgba(245,158,11,0.05);
    border: 1px solid rgba(245,158,11,0.15);
    border-radius: 8px;
    padding: 12px 16px;
    font-family: var(--mono);
    font-size: 12px;
    color: #D97706;
    margin-top: 12px;
    line-height: 1.6;
  }

  /* ─── HERO ─── */
  .hero {
    text-align: center;
    padding: 32px 20px 28px;
  }

  .hero-title {
    font-family: var(--display);
    font-size: clamp(38px, 8vw, 64px);
    letter-spacing: 0.06em;
    line-height: 1;
    background: linear-gradient(135deg, #F59E0B, #EA580C, #F59E0B);
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
    margin-bottom: 10px;
  }

  @keyframes shimmer { to { background-position: 200% center; } }

  .hero-sub {
    font-family: var(--mono);
    font-size: 13px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .divider-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border2), transparent);
    margin: 4px 0 24px;
  }
`;

// ─── HELPERS ───────────────────────────────────────────

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function parseJSON(text) {
  try {
    const m = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    return JSON.parse(m ? (m[1] || m[0]) : text);
  } catch { return null; }
}

function fh(n, d = 1) {
  return typeof n === "number" ? n.toFixed(d) + "h" : "—";
}

function fd(n) {
  if (typeof n !== "number") return "—";
  return (n >= 0 ? "+" : "") + "$" + Math.abs(n).toFixed(2);
}

// ─── MAIN COMPONENT ──────────────────────────────────

export default function ELDPayChecker() {
  // Step 1 state
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [over, setOver] = useState(false);
  const [logs, setLogs] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [eldData, setEldData] = useState(null);

  // Step 2 state
  const [pay, setPay] = useState({ hours: "", type: "hourly", rate: "", gross: "", week: "" });
  const [comparing, setComparing] = useState(false);

  // Results
  const [result, setResult] = useState(null);

  const fileRef = useRef();
  const logRef = useRef();

  const log = (msg, type = "") => {
    setLogs(p => [...p, { msg, type }]);
    setTimeout(() => { if (logRef.current) logRef.current.scrollTop = 9999; }, 50);
  };

  const addFiles = useCallback((incoming) => {
    const valid = Array.from(incoming).filter(f => f.type.startsWith("image/"));
    if (!valid.length) return;
    setFiles(p => [...p, ...valid]);
    valid.forEach(f => {
      const url = URL.createObjectURL(f);
      setPreviews(p => [...p, url]);
    });
  }, []);

  const removeFile = (i) => {
    setFiles(p => p.filter((_, idx) => idx !== i));
    setPreviews(p => p.filter((_, idx) => idx !== i));
  };

  const analyzeELD = async () => {
    setAnalyzing(true);
    setLogs([]);
    setError("");
    setEldData(null);
    setResult(null);

    try {
      log("Initializing ELD parser...");
      log(`${files.length} screenshot(s) queued`, "dim");
      log("Encoding images to base64...", "dim");

      const encoded = await Promise.all(files.map(toBase64));

      log("Images encoded. Connecting to AI...");

      const imageBlocks = encoded.map((b64, i) => ({
        type: "image",
        source: { type: "base64", media_type: files[i].type || "image/jpeg", data: b64 },
      }));

      const systemPrompt = `You are an expert ELD (Electronic Logging Device) data reader. Your job is to extract hours-of-service data from ELD screenshots taken by truck drivers. Return ONLY valid JSON — no prose, no markdown fences, no explanation.`;

      const userPrompt = `Analyze these ELD screenshots and extract all hours-of-service data.

Return ONLY this JSON structure:
{
  "weekOf": "date range string or null",
  "driver": "name or null",
  "vehicle": "unit/truck number or null",
  "days": [
    {
      "date": "MM/DD or label",
      "driving": 0.0,
      "onDutyNotDriving": 0.0,
      "offDuty": 0.0,
      "sleeperBerth": 0.0,
      "totalOnDuty": 0.0
    }
  ],
  "weeklyTotals": {
    "driving": 0.0,
    "onDutyNotDriving": 0.0,
    "offDuty": 0.0,
    "sleeperBerth": 0.0,
    "totalOnDuty": 0.0
  },
  "violations": "string describing any HOS violations or null",
  "confidence": "high | medium | low"
}

Rules:
- All times in decimal hours (1h 30m = 1.5)
- totalOnDuty = driving + onDutyNotDriving
- Use 0.0 for anything not visible
- If data is unclear, still give best estimate and set confidence to low`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: systemPrompt,
          messages: [{
            role: "user",
            content: [...imageBlocks, { type: "text", text: userPrompt }],
          }],
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      log("Response received. Parsing data...");

      const raw = (data.content || []).map(c => c.text || "").join("\n");
      const parsed = parseJSON(raw);

      if (!parsed) {
        log("Could not auto-parse. Showing raw output.", "warn");
        setEldData({ _raw: raw, weeklyTotals: { totalOnDuty: 0 }, days: [] });
      } else {
        log(`✓ ELD data extracted. Confidence: ${parsed.confidence || "unknown"}`);
        if (parsed.violations) log(`⚠ Violations detected: ${parsed.violations}`, "warn");
        setEldData(parsed);
      }
    } catch (e) {
      log("Error: " + (e.message || "Unknown error"), "err");
      setError(e.message || "Failed to analyze screenshots.");
    } finally {
      setAnalyzing(false);
    }
  };

  const calcComparison = () => {
    setComparing(true);
    const eldHours = eldData?.weeklyTotals?.totalOnDuty || 0;
    const paidHours = parseFloat(pay.hours) || 0;
    const rate = parseFloat(pay.rate) || 0;
    const grossPay = parseFloat(pay.gross) || 0;

    const hoursDiff = paidHours - eldHours;

    let expectedPay = 0;
    if (pay.type === "hourly" && rate > 0) {
      expectedPay = eldHours * rate;
    } else {
      expectedPay = grossPay; // flat/salary - just compare hours
    }

    const payDiff = grossPay - expectedPay;

    let verdict = "MATCH";
    if (hoursDiff < -0.5) verdict = "UNDERPAID";
    else if (hoursDiff > 0.5) verdict = "OVERPAID";

    setTimeout(() => {
      setResult({ eldHours, paidHours, hoursDiff, rate, grossPay, expectedPay, payDiff, verdict, payType: pay.type });
      setComparing(false);
    }, 600);
  };

  const reset = () => {
    setFiles([]); setPreviews([]); setLogs([]);
    setEldData(null); setResult(null);
    setPay({ hours: "", type: "hourly", rate: "", gross: "", week: "" });
    setError("");
  };

  const step1Done = !!eldData;
  const step2Active = step1Done && !result;
  const canCompare = step1Done && pay.hours && pay.gross;

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* TOP BAR */}
        <div className="topbar">
          <div className="logo">
            <div className="logo-mark">⚡</div>
            <div className="logo-text">
              <div className="name">LOADSMARTER</div>
              <div className="tagline">ELD Pay Verification</div>
            </div>
          </div>
          <div className="topbar-right">
            <span className="pill pill-free">Free Tool</span>
            <span className="pill pill-powered">AI-Powered</span>
          </div>
        </div>

        <div className="main">

          {/* HERO */}
          <div className="hero">
            <div className="hero-title">DID YOU GET PAID RIGHT?</div>
            <div className="hero-sub">Upload your ELD screenshots · Enter your check · Get the truth</div>
          </div>
          <div className="divider-line" />

          {/* ─── STEP 1: UPLOAD ─── */}
          <div className={`panel ${step1Done ? "done" : "active"}`}>
            <div className="panel-header">
              <div className="step-num">{step1Done ? "✓" : "1"}</div>
              <div>
                <div className="panel-title">UPLOAD ELD SCREENSHOTS</div>
                <div className="panel-sub">Any ELD brand · Multiple files supported</div>
              </div>
            </div>
            <div className="panel-body">
              {!step1Done && (
                <>
                  <div
                    className={`drop-zone ${over ? "over" : ""}`}
                    onDragOver={e => { e.preventDefault(); setOver(true); }}
                    onDragLeave={() => setOver(false)}
                    onDrop={e => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files); }}
                  >
                    <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => addFiles(e.target.files)} />
                    <span className="drop-icon">📱</span>
                    <div className="drop-title">DROP SCREENSHOTS HERE</div>
                    <div className="drop-sub">or tap to browse · PNG, JPG, WEBP</div>
                  </div>

                  {previews.length > 0 && (
                    <div className="thumb-row">
                      {previews.map((src, i) => (
                        <div key={i} className="thumb">
                          <img src={src} alt={`ELD ${i + 1}`} />
                          <button className="del" onClick={() => removeFile(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {logs.length > 0 && (
                    <div className="terminal" ref={logRef}>
                      {logs.map((l, i) => (
                        <span key={i} className={`log-line ${l.type}`}>{l.msg}</span>
                      ))}
                      {analyzing && <span className="log-line"><span className="cursor" /></span>}
                    </div>
                  )}

                  {error && <div className="err-box">⚠ {error}</div>}

                  <button
                    className="btn btn-primary"
                    disabled={!files.length || analyzing}
                    onClick={analyzeELD}
                  >
                    {analyzing
                      ? <><div className="spin" />&nbsp;READING YOUR ELD...</>
                      : "⚡ ANALYZE ELD SCREENSHOTS"
                    }
                  </button>
                </>
              )}

              {/* Show extracted data */}
              {step1Done && !eldData?._raw && (
                <>
                  {eldData?.days?.length > 0 && (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Driving</th>
                          <th>On Duty ND</th>
                          <th>Off Duty</th>
                          <th>Sleeper</th>
                          <th>Total On Duty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eldData.days.map((d, i) => (
                          <tr key={i}>
                            <td style={{ color: "var(--text)", fontWeight: 600 }}>{d.date}</td>
                            <td><span className="tag tag-drive">{fh(d.driving)}</span></td>
                            <td><span className="tag tag-duty">{fh(d.onDutyNotDriving)}</span></td>
                            <td><span className="tag tag-off">{fh(d.offDuty)}</span></td>
                            <td><span className="tag tag-sleep">{fh(d.sleeperBerth)}</span></td>
                            <td style={{ color: "var(--amber)", fontWeight: 600 }}>{fh(d.totalOnDuty)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <div className="totals-strip">
                    <div className="total-cell">
                      <div className="tc-label">Driving</div>
                      <div className="tc-val">{fh(eldData?.weeklyTotals?.driving)}</div>
                    </div>
                    <div className="total-cell">
                      <div className="tc-label">On Duty (ND)</div>
                      <div className="tc-val">{fh(eldData?.weeklyTotals?.onDutyNotDriving)}</div>
                    </div>
                    <div className="total-cell">
                      <div className="tc-label">Off / Sleeper</div>
                      <div className="tc-val" style={{ color: "var(--muted)" }}>
                        {fh((eldData?.weeklyTotals?.offDuty || 0) + (eldData?.weeklyTotals?.sleeperBerth || 0))}
                      </div>
                    </div>
                    <div className="total-cell highlight">
                      <div className="tc-label">Total On Duty</div>
                      <div className="tc-val">{fh(eldData?.weeklyTotals?.totalOnDuty)}</div>
                    </div>
                  </div>

                  {eldData?.violations && (
                    <div className="note-box">⚠ {eldData.violations}</div>
                  )}

                  <button className="btn btn-secondary" style={{ marginTop: 14 }} onClick={reset}>
                    ↺ Start Over
                  </button>
                </>
              )}

              {step1Done && eldData?._raw && (
                <>
                  <div className="terminal" style={{ maxHeight: 240, color: "#CBD5E1" }}>
                    <span className="log-line">Raw AI output (auto-parse failed):</span>
                    <span className="log-line dim">{eldData._raw}</span>
                  </div>
                  <button className="btn btn-secondary" style={{ marginTop: 14 }} onClick={reset}>
                    ↺ Try Again
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ─── STEP 2: PAYCHECK ─── */}
          {step1Done && !eldData?._raw && (
            <div className={`panel ${result ? "done" : "active"}`}>
              <div className="panel-header">
                <div className="step-num">{result ? "✓" : "2"}</div>
                <div>
                  <div className="panel-title">ENTER PAYCHECK DETAILS</div>
                  <div className="panel-sub">What your employer says they paid you</div>
                </div>
              </div>
              <div className="panel-body">
                <div className="form-grid">
                  <div className="field">
                    <label>Week Of</label>
                    <input
                      type="text"
                      placeholder="e.g. 04/14 – 04/20"
                      value={pay.week}
                      onChange={e => setPay(p => ({ ...p, week: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <label>Pay Structure</label>
                    <select value={pay.type} onChange={e => setPay(p => ({ ...p, type: e.target.value }))}>
                      <option value="hourly">Hourly Rate</option>
                      <option value="permile">Per Mile</option>
                      <option value="flat">Flat / Salary</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Hours Listed on Paycheck</label>
                    <input
                      type="number"
                      placeholder="e.g. 44.5"
                      value={pay.hours}
                      onChange={e => setPay(p => ({ ...p, hours: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <label>{pay.type === "permile" ? "Rate per Mile ($)" : pay.type === "flat" ? "N/A" : "Hourly Rate ($)"}</label>
                    <input
                      type="number"
                      placeholder={pay.type === "permile" ? "0.55" : pay.type === "flat" ? "—" : "18.50"}
                      value={pay.rate}
                      disabled={pay.type === "flat"}
                      onChange={e => setPay(p => ({ ...p, rate: e.target.value }))}
                    />
                  </div>
                  <div className="field full">
                    <label>Gross Pay on Check ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 920.00"
                      value={pay.gross}
                      onChange={e => setPay(p => ({ ...p, gross: e.target.value }))}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  disabled={!canCompare || comparing}
                  onClick={calcComparison}
                >
                  {comparing
                    ? <><div className="spin" />&nbsp;CALCULATING...</>
                    : "🔍 CALCULATE PAY DISCREPANCY"
                  }
                </button>
              </div>
            </div>
          )}

          {/* ─── RESULTS ─── */}
          {result && (
            <div className="results-wrap">
              <div className="results-header">
                <div className="results-title">PAY VERIFICATION REPORT</div>
                <span className={`verdict ${result.verdict === "MATCH" ? "v-match" : result.verdict === "UNDERPAID" ? "v-under" : "v-over"}`}>
                  {result.verdict === "MATCH" && "✓ HOURS MATCH"}
                  {result.verdict === "UNDERPAID" && "⚠ HOURS SHORT"}
                  {result.verdict === "OVERPAID" && "↑ HOURS OVER"}
                </span>
              </div>

              {/* Hours comparison */}
              <div className="compare-grid">
                <div className="cg-cell">
                  <div className="cg-label">ELD On-Duty Hours</div>
                  <div className="cg-val">{result.eldHours.toFixed(2)}h</div>
                  <div className="cg-sub">From your screenshots</div>
                </div>
                <div className="cg-cell">
                  <div className="cg-label">Paid Hours on Check</div>
                  <div className="cg-val">{result.paidHours.toFixed(2)}h</div>
                  <div className="cg-sub">As listed by employer</div>
                </div>
                <div className="cg-cell">
                  <div className="cg-label">Hour Difference</div>
                  <div className={`cg-val ${result.hoursDiff > 0.5 ? "pos" : result.hoursDiff < -0.5 ? "neg" : "warn"}`}>
                    {result.hoursDiff >= 0 ? "+" : ""}{result.hoursDiff.toFixed(2)}h
                  </div>
                  <div className="cg-sub">{result.hoursDiff < -0.5 ? "Missing from check" : result.hoursDiff > 0.5 ? "Extra on check" : "Within tolerance"}</div>
                </div>
              </div>

              {/* Pay comparison */}
              {result.payType !== "flat" && result.rate > 0 && (
                <div className="pay-compare">
                  <div className="pc-cell">
                    <div className="pc-label">Expected Pay</div>
                    <div className="pc-val">${result.expectedPay.toFixed(2)}</div>
                  </div>
                  <div className="pc-cell">
                    <div className="pc-label">Actual Gross Pay</div>
                    <div className="pc-val">${result.grossPay.toFixed(2)}</div>
                  </div>
                  <div className="pc-cell">
                    <div className="pc-label">Pay Difference</div>
                    <div className={`pc-val ${result.payDiff < -0.5 ? "neg" : result.payDiff > 0.5 ? "pos" : ""}`}>
                      {fd(result.payDiff)}
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis */}
              <div className="analysis">
                {result.verdict === "MATCH" && (
                  <>Your ELD hours and paycheck hours are <span className="good-text">within acceptable tolerance</span>. Your employer's reported hours align with what your ELD recorded. <strong>No discrepancy detected.</strong></>
                )}
                {result.verdict === "UNDERPAID" && (
                  <>Your ELD shows <strong>{result.eldHours.toFixed(2)} hours</strong> on duty, but your check only reflects <strong>{result.paidHours.toFixed(2)} hours</strong> — a <span className="danger-text">gap of {Math.abs(result.hoursDiff).toFixed(2)} hours</span>.{result.payType !== "flat" && result.rate > 0 && <> At ${result.rate}/hr, that's approximately <span className="danger-text">${Math.abs(result.payDiff).toFixed(2)} missing from your check.</span></>} Keep your ELD records as documentation and consider discussing this with your dispatcher or payroll department.</>
                )}
                {result.verdict === "OVERPAID" && (
                  <>Your paycheck shows <strong>{result.paidHours.toFixed(2)} hours</strong> but your ELD recorded <strong>{result.eldHours.toFixed(2)} hours</strong> on duty — <span className="highlight-text">{Math.abs(result.hoursDiff).toFixed(2)} extra hours on your check</span>. This could be intentional (bonus, adjustment) or a data entry error. Worth confirming with your employer.</>
                )}
              </div>

              <div className="results-footer">
                <span>Generated {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })} · LoadSmarter ELD Checker</span>
                <button className="reset-btn" onClick={reset}>Run Another Check</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
