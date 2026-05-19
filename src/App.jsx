import { useState, useRef } from "react";

const STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

const MAX = 30;
const BATCH_SIZE = 10;
const BACKEND = "https://loadsmarter-backend.vercel.app";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&family=Bebas+Neue&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --teal: #1dd1a1; --teal-dim: #17b08a; --teal-glow: rgba(29,209,161,0.1);
    --gold: #f39c12; --gold-dim: #d68910; --gold-glow: rgba(243,156,18,0.1);
    --bg: #0a0d11; --surface: #111418; --surface2: #171b22;
    --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
    --text: #e8eaf0; --muted: #6b7892; --red: #e74c3c;
    --mono: 'Share Tech Mono', monospace;
    --display: 'Bebas Neue', sans-serif;
    --ui: 'Rajdhani', sans-serif;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: var(--ui); }

  /* NAV */
  .nav { display:flex; align-items:center; justify-content:space-between; padding:18px 40px; border-bottom:1px solid var(--border); background:rgba(10,13,17,0.94); backdrop-filter:blur(8px); position:sticky; top:0; z-index:100; }
  .logo { font-family:var(--display); font-size:24px; letter-spacing:0.08em; color:var(--text); }
  .logo em { color:var(--teal); font-style:normal; }
  .nav-right { display:flex; gap:12px; align-items:center; }
  .pill-free { background:var(--teal-glow); color:var(--teal); border:1px solid rgba(29,209,161,0.2); font-family:var(--mono); font-size:10px; padding:4px 12px; border-radius:20px; letter-spacing:0.1em; }

  /* BUTTONS */
  .btn-teal { background:var(--teal); color:#0a0d11; border:none; padding:12px 28px; border-radius:4px; font-family:var(--ui); font-weight:600; font-size:15px; cursor:pointer; transition:all 0.2s; }
  .btn-teal:hover:not(:disabled) { background:var(--teal-dim); transform:translateY(-1px); }
  .btn-teal:disabled { opacity:0.4; cursor:not-allowed; }
  .btn-ghost { background:transparent; color:var(--muted); border:1px solid var(--border2); padding:12px 22px; border-radius:4px; font-family:var(--ui); font-size:14px; cursor:pointer; transition:all 0.2s; }
  .btn-ghost:hover { color:var(--text); border-color:var(--muted); }
  .btn-hero { background:var(--teal); color:#0a0d11; border:none; padding:18px 42px; border-radius:4px; font-family:var(--display); font-size:22px; letter-spacing:0.1em; cursor:pointer; transition:all 0.2s; }
  .btn-hero:hover { background:var(--teal-dim); transform:translateY(-2px); box-shadow:0 12px 32px rgba(29,209,161,0.2); }
  .btn-hero-ghost { background:transparent; color:var(--text); border:1px solid var(--border2); padding:18px 42px; border-radius:4px; font-family:var(--ui); font-size:16px; cursor:pointer; transition:all 0.2s; }
  .btn-hero-ghost:hover { border-color:var(--muted); }

  /* LANDING */
  .hero { max-width:900px; margin:0 auto; padding:100px 40px 80px; text-align:center; background-image:radial-gradient(ellipse 60% 50% at 50% -5%,rgba(29,209,161,0.08) 0%,transparent 70%); }
  .hero-badge { display:inline-block; background:var(--gold-glow); color:var(--gold); border:1px solid rgba(243,156,18,0.25); padding:6px 16px; border-radius:20px; font-family:var(--mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:28px; }
  .hero h1 { font-family:var(--display); font-size:clamp(48px,8vw,80px); letter-spacing:0.06em; line-height:1; margin-bottom:24px; }
  .hero h1 em { font-style:normal; color:var(--teal); }
  .hero p { font-size:18px; color:var(--muted); line-height:1.7; max-width:560px; margin:0 auto 40px; font-weight:400; }
  .hero-cta { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
  .section { max-width:900px; margin:0 auto; padding:80px 40px; }
  .section-label { font-family:var(--mono); font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:var(--teal); margin-bottom:12px; }
  .section h2 { font-family:var(--display); font-size:clamp(32px,5vw,52px); letter-spacing:0.06em; margin-bottom:48px; }
  .steps { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:24px; }
  .step-card { padding:28px; background:var(--surface); border:1px solid var(--border); border-radius:6px; transition:border-color 0.2s; }
  .step-card:hover { border-color:rgba(29,209,161,0.2); }
  .step-n { font-family:var(--display); font-size:48px; color:var(--border2); line-height:1; margin-bottom:14px; }
  .step-card h3 { font-size:16px; font-weight:600; margin-bottom:8px; }
  .step-card p { font-size:14px; color:var(--muted); line-height:1.6; font-weight:400; }
  .why { background:var(--surface); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
  .why-inner { max-width:900px; margin:0 auto; padding:80px 40px; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
  .why-stat { font-family:var(--display); font-size:80px; color:var(--gold); line-height:1; margin-bottom:12px; }
  .why-inner p { font-size:15px; color:var(--muted); line-height:1.7; }
  .why-points { list-style:none; }
  .why-points li { padding:14px 0; border-bottom:1px solid var(--border); font-size:15px; color:var(--muted); display:flex; gap:12px; align-items:flex-start; line-height:1.5; }
  .why-points li::before { content:"→"; color:var(--teal); flex-shrink:0; }

  /* OVERLAY / SIGNUP */
  .overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:200; align-items:center; justify-content:center; padding:20px; overflow-y:auto; }
  .overlay.active { display:flex; }
  .signup-card { background:var(--surface); border:1px solid var(--border2); border-radius:8px; padding:48px 40px; max-width:480px; width:100%; margin:auto; }
  .signup-icon { font-size:36px; margin-bottom:16px; }
  .signup-card h2 { font-family:var(--display); font-size:32px; letter-spacing:0.06em; margin-bottom:8px; }
  .signup-card > p { font-size:15px; color:var(--muted); line-height:1.6; margin-bottom:28px; }
  .signup-legal { font-size:12px; color:var(--muted); text-align:center; margin-top:14px; line-height:1.6; }
  .signup-legal a { color:var(--teal); text-decoration:none; }

  /* FIELDS */
  .field { margin-bottom:16px; }
  .field label { display:block; font-family:var(--mono); font-size:10px; color:var(--muted); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:6px; }
  .field input,.field textarea,.field select { width:100%; background:var(--bg); border:1px solid var(--border2); border-radius:4px; padding:12px 16px; color:var(--text); font-family:var(--ui); font-size:15px; transition:border-color 0.2s; appearance:none; }
  .field input:focus,.field textarea:focus,.field select:focus { outline:none; border-color:var(--teal); }
  .field textarea { resize:vertical; min-height:80px; line-height:1.5; }
  .field select option { background:var(--surface); }
  .field.full { grid-column:1/-1; }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

  /* WIZARD */
  .wizard { display:none; position:fixed; inset:0; background:var(--bg); z-index:200; overflow-y:auto; }
  .wizard.active { display:block; }
  .wizard-nav-bar { display:flex; align-items:center; justify-content:space-between; padding:18px 40px; border-bottom:1px solid var(--border); position:sticky; top:0; background:var(--bg); z-index:10; }
  .progress-track { height:2px; background:var(--border); }
  .progress-fill { height:100%; background:var(--teal); transition:width 0.4s ease; }
  .wizard-body { max-width:640px; margin:0 auto; padding:60px 40px; }
  .step-indicator { font-family:var(--mono); font-size:11px; color:var(--muted); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:12px; }
  .wizard-body h2 { font-family:var(--display); font-size:36px; letter-spacing:0.06em; margin-bottom:8px; }
  .wizard-body > p { font-size:15px; color:var(--muted); line-height:1.6; margin-bottom:36px; }
  .wizard-footer { display:flex; gap:12px; margin-top:40px; }

  /* UPLOAD */
  .upload-zone { border:2px dashed var(--border2); border-radius:6px; padding:40px 24px; text-align:center; cursor:pointer; transition:all 0.2s; position:relative; margin-bottom:16px; }
  .upload-zone:hover { border-color:var(--teal); background:var(--teal-glow); }
  .upload-zone input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
  .upload-zone h3 { font-family:var(--display); font-size:22px; letter-spacing:0.06em; margin-bottom:6px; }
  .upload-zone p { font-family:var(--mono); font-size:11px; color:var(--muted); letter-spacing:0.06em; }
  .upload-zone p span { color:var(--teal); }

  /* BATCH */
  .batch-counter { background:var(--surface2); border:1px solid var(--border); border-radius:6px; padding:14px 18px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; gap:12px; }
  .batch-info { display:flex; flex-direction:column; gap:8px; }
  .batch-text { font-family:var(--mono); font-size:11px; color:var(--muted); letter-spacing:0.08em; }
  .batch-text.on { color:var(--teal); }
  .batch-pips { display:flex; gap:10px; }
  .pip-group { display:flex; flex-direction:column; gap:3px; }
  .pip-group-label { font-family:var(--mono); font-size:8px; color:var(--muted); letter-spacing:0.1em; }
  .pip-group-label.done { color:var(--teal); }
  .pip-group-label.cur { color:var(--gold); }
  .pip-row { display:flex; gap:2px; }
  .pip { width:8px; height:3px; border-radius:2px; background:var(--border2); }
  .pip.on { background:var(--teal); }
  .pip.on.warn { background:var(--gold); }
  .add-more-btn { font-family:var(--mono); font-size:11px; letter-spacing:0.06em; text-transform:uppercase; padding:8px 14px; border-radius:4px; cursor:pointer; background:var(--teal-glow); color:var(--teal); border:1px solid rgba(29,209,161,0.25); transition:all 0.2s; white-space:nowrap; }
  .add-more-btn:hover { background:rgba(29,209,161,0.16); }
  .batch-group { margin-bottom:16px; }
  .batch-label { font-family:var(--mono); font-size:9px; color:var(--muted); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:8px; padding:3px 8px; background:var(--surface2); border:1px solid var(--border); border-radius:3px; display:inline-block; }
  .batch-label.cur { color:var(--gold); border-color:rgba(243,156,18,0.2); background:var(--gold-glow); }
  .thumb-grid { display:flex; flex-wrap:wrap; gap:8px; }
  .thumb { position:relative; border-radius:6px; overflow:hidden; border:1px solid var(--border2); }
  .thumb img { width:80px; height:58px; object-fit:cover; display:block; }
  .thumb-num { position:absolute; bottom:3px; left:4px; font-family:var(--mono); font-size:9px; color:rgba(255,255,255,0.7); background:rgba(0,0,0,0.6); padding:1px 5px; border-radius:2px; }
  .thumb-del { position:absolute; top:3px; right:3px; width:16px; height:16px; background:rgba(0,0,0,0.75); border:none; border-radius:50%; color:#ccc; font-size:9px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .thumb-del:hover { background:var(--red); color:#fff; }

  /* TERMINAL */
  .terminal { background:#040609; border:1px solid rgba(29,209,161,0.1); border-radius:6px; padding:14px 16px; margin-top:14px; font-family:var(--mono); font-size:12px; max-height:140px; overflow-y:auto; line-height:1.8; }
  .log-line { color:var(--teal); display:block; }
  .log-line::before { content:'> '; color:var(--gold); }
  .log-line.dim { color:rgba(29,209,161,0.3); }
  .log-line.warn { color:var(--gold); }
  .log-line.err { color:var(--red); }
  .cursor { display:inline-block; width:7px; height:12px; background:var(--teal); animation:blink 1s step-end infinite; vertical-align:middle; margin-left:4px; }
  @keyframes blink { 50% { opacity:0; } }

  /* ELD PREVIEW */
  .eld-preview { background:var(--surface); border:1px solid var(--border); border-radius:6px; overflow:hidden; margin-top:14px; margin-bottom:24px; }
  .eld-preview-header { padding:10px 16px; background:var(--surface2); border-bottom:1px solid var(--border); font-family:var(--mono); font-size:10px; color:var(--teal); letter-spacing:0.1em; text-transform:uppercase; }
  .totals-strip { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--border); }
  .tc { background:var(--surface2); padding:14px 16px; text-align:center; }
  .tc-label { font-family:var(--mono); font-size:9px; color:var(--muted); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:4px; }
  .tc-val { font-family:var(--display); font-size:24px; color:var(--teal); letter-spacing:0.04em; }
  .tc.hi .tc-val { color:var(--gold); font-size:28px; }
  .note-box { background:var(--gold-glow); border-top:1px solid rgba(243,156,18,0.15); padding:10px 16px; font-family:var(--mono); font-size:11px; color:var(--gold); line-height:1.6; }

  /* LOADING */
  .loading-center { text-align:center; padding:80px 40px; }
  .spinner-teal { width:52px; height:52px; border:3px solid var(--border); border-top-color:var(--teal); border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 28px; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .loading-center h3 { font-family:var(--display); font-size:28px; letter-spacing:0.06em; margin-bottom:8px; }
  .loading-center p { font-size:14px; color:var(--muted); line-height:1.6; }

  /* RESULTS */
  .results-wrap { max-width:700px; margin:0 auto; padding:60px 40px; animation:fadeUp 0.4s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .results-header h2 { font-family:var(--display); font-size:40px; letter-spacing:0.06em; margin-bottom:14px; }
  .verdict-badge { display:inline-flex; align-items:center; gap:8px; padding:8px 20px; border-radius:20px; font-family:var(--mono); font-size:12px; font-weight:600; letter-spacing:0.08em; }
  .v-clear { background:rgba(29,209,161,0.1); color:var(--teal); border:1px solid rgba(29,209,161,0.25); }
  .v-flag  { background:rgba(231,76,60,0.1); color:var(--red); border:1px solid rgba(231,76,60,0.25); }
  .v-over  { background:rgba(243,156,18,0.1); color:var(--gold); border:1px solid rgba(243,156,18,0.25); }
  .owed-banner { border-radius:6px; padding:28px; text-align:center; margin:28px 0; }
  .owed-banner.bad { background:linear-gradient(135deg,rgba(231,76,60,0.1),rgba(231,76,60,0.04)); border:1px solid rgba(231,76,60,0.25); }
  .owed-banner.good { background:linear-gradient(135deg,rgba(29,209,161,0.1),rgba(29,209,161,0.04)); border:1px solid rgba(29,209,161,0.25); }
  .owed-label { font-family:var(--mono); font-size:10px; color:var(--muted); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:10px; }
  .owed-amount { font-family:var(--display); font-size:64px; line-height:1; letter-spacing:0.04em; }
  .owed-amount.red { color:var(--red); }
  .owed-amount.teal { color:var(--teal); }
  .summary-box { background:var(--surface); border-left:3px solid var(--teal); border-radius:0 6px 6px 0; padding:18px 20px; font-size:15px; color:var(--muted); line-height:1.7; margin-bottom:24px; }
  .summary-box strong { color:var(--text); }
  .results-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
  .result-card { background:var(--surface); border:1px solid var(--border); border-radius:6px; padding:22px; }
  .result-card h4 { font-family:var(--mono); font-size:10px; color:var(--muted); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:14px; }
  .result-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border); font-size:14px; }
  .result-row:last-child { border-bottom:none; }
  .result-row span:first-child { color:var(--muted); }
  .result-row span:last-child { font-family:var(--mono); color:var(--text); }
  .result-row.hi span:last-child { color:var(--teal); }
  .result-row.bad span:last-child { color:var(--red); }
  .result-row.warn span:last-child { color:var(--gold); }
  .disclaimer { font-size:12px; color:var(--muted); line-height:1.7; padding:16px 20px; background:var(--surface); border:1px solid var(--border); border-radius:4px; margin-bottom:24px; }
  .results-actions { display:flex; gap:12px; }

  /* MISC */
  .err-box { background:rgba(231,76,60,0.07); border:1px solid rgba(231,76,60,0.2); border-radius:4px; padding:12px 16px; color:#fca5a5; font-size:14px; margin-top:12px; }
  .spin-sm { width:15px; height:15px; border:2px solid rgba(10,13,17,0.3); border-top-color:#0a0d11; border-radius:50%; animation:spin 0.7s linear infinite; display:inline-block; vertical-align:middle; margin-right:6px; }
  footer { border-top:1px solid var(--border); padding:32px 40px; text-align:center; font-size:13px; color:var(--muted); }
  footer span { color:var(--teal); }

  @media (max-width:640px) {
    .nav { padding:14px 20px; }
    .hero { padding:60px 20px 40px; }
    .section { padding:60px 20px; }
    .why-inner { grid-template-columns:1fr; gap:40px; padding:60px 20px; }
    .wizard-body { padding:40px 20px; }
    .wizard-nav-bar { padding:14px 20px; }
    .results-wrap { padding:40px 20px; }
    .results-grid { grid-template-columns:1fr; }
    .signup-card { padding:36px 24px; }
    .form-grid { grid-template-columns:1fr; }
    footer { padding:24px 20px; }
  }
`;

function fh(n) { return typeof n === "number" ? n.toFixed(1) + "h" : "—"; }

function parseJSON(text) {
  try {
    const m = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    return JSON.parse(m ? (m[1] || m[0]) : text);
  } catch { return null; }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function getCookie(name) {
  return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
}
function setCookie(name) {
  const exp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=1; expires=${exp}; path=/; SameSite=Lax`;
}

export default function App() {
  const [view,         setView]         = useState('landing');
  const [showSignup,   setShowSignup]   = useState(false);
  const [wizardStep,   setWizardStep]   = useState(1);
  const [signup,       setSignup]       = useState({ name:'', email:'', phone:'', feedback:'' });
  const [signupLoading,setSignupLoading]= useState(false);
  const [signupError,  setSignupError]  = useState('');
  const [selectedState,setSelectedState]= useState('');
  const [images,       setImages]       = useState([]);
  const [logs,         setLogs]         = useState([]);
  const [analyzing,    setAnalyzing]    = useState(false);
  const [eldData,      setEldData]      = useState(null);
  const [error,        setError]        = useState('');
  const [pay,          setPay]          = useState({ hours:'', type:'hourly', rate:'', gross:'', week:'' });
  const [result,       setResult]       = useState(null);
  const [comparing,    setComparing]    = useState(false);

  const inputRef = useRef();
  const moreRef  = useRef();
  const logRef   = useRef();

  const atMax       = images.length >= MAX;
  const nearMax     = images.length >= 20 && !atMax;
  const batchNum    = Math.min(Math.floor(images.length / BATCH_SIZE) + (images.length % BATCH_SIZE === 0 && images.length > 0 ? 0 : 1), 3);
  const slotsFilled = images.length % BATCH_SIZE;
  const batchFull   = slotsFilled === 0 && images.length > 0;
  const pipClass    = nearMax || atMax ? 'warn' : '';
  const progress    = Math.round((wizardStep / 5) * 100);

  const addLog = (msg, type = '') => {
    setLogs(p => [...p, { msg, type }]);
    setTimeout(() => { if (logRef.current) logRef.current.scrollTop = 9999; }, 50);
  };

  const handleFiles = async (fileList) => {
    const valid = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (!valid.length) return;
    const toAdd = valid.slice(0, MAX - images.length);
    const loaded = await Promise.all(toAdd.map(async f => ({ file: f, dataUrl: await readFile(f) })));
    setImages(p => [...p, ...loaded]);
  };

  const removeImage = i => setImages(p => p.filter((_, idx) => idx !== i));

  const openWizard = () => {
    if (getCookie('ls_member')) {
      setView('wizard'); setWizardStep(1);
    } else {
      setShowSignup(true);
    }
  };

  const submitSignup = async () => {
    const { name, email, phone, feedback } = signup;
    setSignupError('');
    if (!name.trim())                        { setSignupError('Please enter your first name.'); return; }
    if (!email.trim() || !email.includes('@')){ setSignupError('Please enter a valid email.'); return; }
    setSignupLoading(true);
    try {
      const resp = await fetch(BACKEND + '/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), feedback: feedback.trim() }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Something went wrong.');
      setCookie('ls_member');
      setShowSignup(false);
      setView('wizard'); setWizardStep(1);
    } catch (e) {
      setSignupError(e.message);
    } finally {
      setSignupLoading(false);
    }
  };

  const analyzeELD = async () => {
    setAnalyzing(true); setWizardStep(3);
    setLogs([]); setError(''); setEldData(null);
    try {
      addLog('Initializing ELD parser...');
      addLog(`${images.length} screenshot(s) — state: ${selectedState}`, 'dim');
      addLog('Encoding images...', 'dim');
      const imageBlocks = images.map(({ file, dataUrl }) => ({
        type: 'image',
        source: { type: 'base64', media_type: file.type || 'image/jpeg', data: dataUrl.split(',')[1] },
      }));
      addLog('Connecting to AI...');
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          system: 'You are an expert ELD data reader. Extract hours-of-service data from ELD screenshots. Treat multiple screenshots as one continuous log. Return ONLY valid JSON — no prose, no markdown fences.',
          messages: [{ role: 'user', content: [
            ...imageBlocks,
            { type: 'text', text: `Driver is in ${selectedState}. Analyze ALL screenshots as one continuous log. Return ONLY this JSON:\n{"weekOf":"date range or null","driver":"name or null","vehicle":"unit number or null","days":[{"date":"MM/DD","driving":0.0,"onDutyNotDriving":0.0,"offDuty":0.0,"sleeperBerth":0.0,"totalOnDuty":0.0}],"weeklyTotals":{"driving":0.0,"onDutyNotDriving":0.0,"offDuty":0.0,"sleeperBerth":0.0,"totalOnDuty":0.0},"violations":"description or null","confidence":"high|medium|low"}\nRules: decimal hours (1h30m=1.5), totalOnDuty=driving+onDutyNotDriving, combine all screenshots, use 0.0 if not visible.` }
          ]}],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      addLog('Parsing response...');
      const raw    = (data.content || []).map(c => c.text || '').join('\n');
      const parsed = parseJSON(raw);
      if (!parsed) {
        addLog('Parse failed — showing raw output.', 'warn');
        setEldData({ _raw: raw, weeklyTotals: { totalOnDuty: 0 }, days: [] });
      } else {
        addLog(`✓ ${parsed.days?.length || 0} day(s) extracted. Confidence: ${parsed.confidence || 'unknown'}`);
        if (parsed.violations) addLog(`⚠ ${parsed.violations}`, 'warn');
        setEldData(parsed);
      }
      setWizardStep(4);
    } catch (e) {
      addLog('Error: ' + (e.message || 'Unknown'), 'err');
      setError(e.message || 'Failed to analyze screenshots.');
      setWizardStep(2);
    } finally {
      setAnalyzing(false);
    }
  };

  const calcPay = () => {
    setComparing(true);
    const eldHours   = eldData?.weeklyTotals?.totalOnDuty || 0;
    const paidHours  = parseFloat(pay.hours) || 0;
    const rate       = parseFloat(pay.rate)  || 0;
    const grossPay   = parseFloat(pay.gross) || 0;
    const hoursDiff  = paidHours - eldHours;
    const expected   = pay.type === 'hourly' && rate > 0 ? eldHours * rate : grossPay;
    const payDiff    = grossPay - expected;
    const impliedRate= eldHours > 0 ? grossPay / eldHours : 0;
    const verdict    = hoursDiff < -0.5 ? 'UNDERPAID' : hoursDiff > 0.5 ? 'OVERPAID' : 'MATCH';
    const owed       = verdict === 'UNDERPAID' && rate > 0 ? Math.abs(payDiff) : 0;
    setTimeout(() => {
      setResult({ eldHours, paidHours, hoursDiff, rate, grossPay, expected, payDiff, verdict, payType: pay.type, owed, impliedRate, state: selectedState });
      setComparing(false); setWizardStep(5);
    }, 700);
  };

  const reset = () => {
    setView('landing'); setWizardStep(1); setSelectedState('');
    setImages([]); setLogs([]); setEldData(null); setResult(null); setError('');
    setPay({ hours:'', type:'hourly', rate:'', gross:'', week:'' });
  };

  return (
    <>
      <style>{css}</style>

      {/* ── LANDING ── */}
      {view === 'landing' && (
        <div>
          <nav className="nav">
            <div className="logo">LOAD<em>SMARTER</em></div>
            <div className="nav-right">
              <span className="pill-free">Free Tool</span>
              <button className="btn-teal" onClick={openWizard}>Run Free Audit</button>
            </div>
          </nav>

          <section className="hero">
            <div className="hero-badge">Free Pay Audit · No Account Required</div>
            <h1>ARE YOU BEING PAID<br /><em>WHAT YOU'RE OWED?</em></h1>
            <p>Upload your ELD screenshots and enter your check details. Get an instant audit showing exactly what you earned vs. what you were paid — and the amount owed if there's a discrepancy.</p>
            <div className="hero-cta">
              <button className="btn-hero" onClick={openWizard}>Run My Free Audit</button>
              <button className="btn-hero-ghost" onClick={() => document.getElementById('why').scrollIntoView({ behavior:'smooth' })}>Why This Matters</button>
            </div>
          </section>

          <section className="section">
            <div className="section-label">Process</div>
            <h2>FOUR STEPS TO YOUR AUDIT</h2>
            <div className="steps">
              <div className="step-card"><div className="step-n">01</div><h3>Select Your State</h3><p>State wage laws vary. We factor in your specific state's minimum wage on top of the federal $7.25/hr floor.</p></div>
              <div className="step-card"><div className="step-n">02</div><h3>Upload ELD Screenshots</h3><p>Take screenshots from your ELD app. Upload up to 30 across 3 batches of 10 — any ELD brand works.</p></div>
              <div className="step-card"><div className="step-n">03</div><h3>Enter Your Check</h3><p>Enter your gross pay, hours on your check, and hourly rate. We compare it against your actual logged hours.</p></div>
              <div className="step-card"><div className="step-n">04</div><h3>Get Your Results</h3><p>Instant audit. Exact hours, implied hourly rate, and total amount owed if anything is missing from your check.</p></div>
            </div>
          </section>

          <div className="why" id="why">
            <div className="why-inner">
              <div>
                <div className="why-stat">$3.7B</div>
                <p style={{fontSize:18,fontWeight:600,color:'var(--text)',marginBottom:12}}>Stolen from workers every year through wage theft</p>
                <p>Truck drivers are among the most targeted. Per-mile pay structures, excessive deductions, and off-clock work requirements hide the real hourly rate you're actually earning.</p>
              </div>
              <ul className="why-points">
                <li>Per-mile pay that doesn't cover minimum wage when you factor in total hours</li>
                <li>Illegal deductions for equipment, fuel, and "lease" agreements</li>
                <li>Unpaid detention time, loading, and pre-trip inspections</li>
                <li>Misclassification as "independent contractor" to avoid wage protections</li>
              </ul>
            </div>
          </div>

          <section className="section" style={{textAlign:'center'}}>
            <div className="section-label">Get Started</div>
            <h2>KNOW YOUR NUMBERS</h2>
            <p style={{color:'var(--muted)',maxWidth:480,margin:'0 auto 32px',fontSize:16,lineHeight:1.7}}>Free, private, and built by someone who's been in the seat. Your screenshots are processed in your browser and never stored on our servers.</p>
            <button className="btn-hero" onClick={openWizard}>Run My Free Audit</button>
          </section>

          <footer>
            © 2025 LoadSmarter. Not legal advice. Estimates only.<br />
            <span>Your screenshots are processed in your browser and never stored on our servers.</span>
          </footer>
        </div>
      )}

      {/* ── SIGNUP MODAL ── */}
      {showSignup && (
        <div className="overlay active" onClick={e => { if (e.target === e.currentTarget) setShowSignup(false); }}>
          <div className="signup-card">
            <div className="signup-icon">🚛</div>
            <h2>GET YOUR FREE AUDIT</h2>
            <p>Tell us about yourself. We'll run a full audit of your ELD hours vs. your check — completely free.</p>
            <div className="field">
              <label>First Name</label>
              <input type="text" placeholder="John" value={signup.name} autoFocus onChange={e => setSignup(p => ({...p, name: e.target.value}))} />
            </div>
            <div className="field">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={signup.email} onChange={e => setSignup(p => ({...p, email: e.target.value}))} />
            </div>
            <div className="field">
              <label>Phone <span style={{color:'var(--muted)',fontWeight:300}}>(optional)</span></label>
              <input type="tel" placeholder="+1 (555) 000-0000" value={signup.phone} onChange={e => setSignup(p => ({...p, phone: e.target.value}))} />
            </div>
            <div className="field">
              <label>Biggest frustration with how you get paid?</label>
              <textarea placeholder="e.g. My miles never match what I actually drove..." value={signup.feedback} onChange={e => setSignup(p => ({...p, feedback: e.target.value}))} />
            </div>
            {signupError && <div className="err-box">{signupError}</div>}
            <button className="btn-teal" style={{width:'100%',marginTop:8}} disabled={signupLoading} onClick={submitSignup}>
              {signupLoading ? <><span className="spin-sm" />Saving…</> : 'Get My Free Audit →'}
            </button>
            <p className="signup-legal">By continuing you agree to our <a href="legal.html" target="_blank" rel="noreferrer">Terms &amp; Privacy Policy</a>.</p>
          </div>
        </div>
      )}

      {/* ── WIZARD ── */}
      {view === 'wizard' && (
        <div className="wizard active">
          <div className="wizard-nav-bar">
            <div className="logo">LOAD<em style={{color:'var(--teal)'}}>SMARTER</em></div>
            <button className="btn-ghost" onClick={reset}>✕ Exit</button>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{width:`${progress}%`}} />
          </div>

          {/* Step 1 — State */}
          {wizardStep === 1 && (
            <div className="wizard-body">
              <div className="step-indicator">Step 1 of 4</div>
              <h2>WHAT STATE DO YOU DRIVE IN?</h2>
              <p>We use this to check your pay against your state's minimum wage laws — not just the federal $7.25/hr floor.</p>
              <div className="field">
                <label>Your State</label>
                <select value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                  <option value="">— Select your state —</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="wizard-footer">
                <button className="btn-teal" style={{flex:1}} disabled={!selectedState} onClick={() => setWizardStep(2)}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 2 — Upload */}
          {wizardStep === 2 && (
            <div className="wizard-body">
              <div className="step-indicator">Step 2 of 4</div>
              <h2>UPLOAD YOUR ELD SCREENSHOTS</h2>
              <p>Take screenshots from your ELD app showing your hours of service. Upload up to 30 across 3 batches of 10.</p>

              {!atMax && (
                <div className="upload-zone">
                  <input ref={inputRef} type="file" accept="image/*" multiple onChange={e => { handleFiles(e.target.files); e.target.value = ''; }} />
                  <div style={{fontSize:36,marginBottom:12}}>📱</div>
                  <h3>
                    {images.length === 0 ? 'SELECT SCREENSHOTS'
                      : batchFull ? `ADD BATCH ${Math.min(batchNum + 1, 3)}`
                      : `ADD TO BATCH ${batchNum}`}
                  </h3>
                  <p>
                    {images.length === 0
                      ? <><span>Hold Shift or Ctrl to select multiple</span> · PNG · JPG · WEBP</>
                      : batchFull
                        ? <><span>Batch {batchNum} complete</span> · {MAX - images.length} slots remaining</>
                        : <><span>Batch {batchNum}: {slotsFilled}/{BATCH_SIZE}</span> · {MAX - images.length} slots remaining</>
                    }
                  </p>
                </div>
              )}

              {images.length > 0 && (
                <div className="batch-counter">
                  <div className="batch-info">
                    <div className={`batch-text${images.length > 0 ? ' on' : ''}`}>
                      {images.length}/{MAX} LOADED
                      {batchFull && !atMax && ` · BATCH ${batchNum} COMPLETE`}
                      {!batchFull && ` · BATCH ${batchNum}: ${slotsFilled}/${BATCH_SIZE}`}
                      {atMax && ' · ALL BATCHES LOADED'}
                    </div>
                    <div className="batch-pips">
                      {[0,1,2].map(b => {
                        const bImgs = images.slice(b * BATCH_SIZE, (b+1) * BATCH_SIZE);
                        if (bImgs.length === 0 && images.length < b * BATCH_SIZE) return null;
                        const done = bImgs.length === BATCH_SIZE;
                        const cur  = !done && bImgs.length > 0;
                        return (
                          <div key={b} className="pip-group">
                            <div className={`pip-group-label ${done ? 'done' : cur ? 'cur' : ''}`}>B{b+1}</div>
                            <div className="pip-row">
                              {Array.from({length:BATCH_SIZE}).map((_,i) => (
                                <div key={i} className={`pip${i < bImgs.length ? ` on ${pipClass}` : ''}`} />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {!atMax && (
                    <>
                      <input ref={moreRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e => { handleFiles(e.target.files); e.target.value=''; }} />
                      <button className="add-more-btn" onClick={() => moreRef.current?.click()}>
                        {batchFull ? `＋ Batch ${batchNum+1}` : '＋ Add More'}
                      </button>
                    </>
                  )}
                </div>
              )}

              {[0,1,2].map(b => {
                const bImgs = images.slice(b * BATCH_SIZE, (b+1) * BATCH_SIZE);
                if (bImgs.length === 0) return null;
                const done = bImgs.length === BATCH_SIZE;
                return (
                  <div key={b} className="batch-group">
                    <div className={`batch-label${!done ? ' cur' : ''}`}>
                      Batch {b+1} — {bImgs.length} screenshot{bImgs.length !== 1 ? 's' : ''}{done ? ' ✓' : ''}
                    </div>
                    <div className="thumb-grid">
                      {bImgs.map(({dataUrl}, i) => {
                        const gi = b * BATCH_SIZE + i;
                        return (
                          <div key={gi} className="thumb">
                            <img src={dataUrl} alt="" />
                            <span className="thumb-num">#{gi+1}</span>
                            <button className="thumb-del" onClick={() => removeImage(gi)}>✕</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {error && <div className="err-box">⚠ {error}</div>}

              <div className="wizard-footer">
                <button className="btn-ghost" onClick={() => setWizardStep(1)}>← Back</button>
                <button className="btn-teal" style={{flex:1}} disabled={images.length === 0} onClick={analyzeELD}>
                  ⚡ Analyze {images.length > 0 ? `${images.length} Screenshot${images.length !== 1 ? 's' : ''}` : 'Screenshots'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Analyzing */}
          {wizardStep === 3 && (
            <div className="wizard-body">
              <div className="loading-center">
                <div className="spinner-teal" />
                <h3>READING YOUR ELD</h3>
                <p>Analyzing {images.length} screenshot{images.length !== 1 ? 's' : ''} from {selectedState}.<br />This takes 15–30 seconds.</p>
              </div>
              {logs.length > 0 && (
                <div className="terminal" ref={logRef}>
                  {logs.map((l,i) => <span key={i} className={`log-line ${l.type}`}>{l.msg}</span>)}
                  {analyzing && <span className="log-line"><span className="cursor" /></span>}
                </div>
              )}
            </div>
          )}

          {/* Step 4 — Paycheck */}
          {wizardStep === 4 && eldData && !eldData._raw && (
            <div className="wizard-body">
              <div className="step-indicator">Step 3 of 4</div>
              <h2>ENTER YOUR PAYCHECK</h2>
              <p>ELD data extracted for {selectedState}. Now enter what your employer says they paid you.</p>

              <div className="eld-preview">
                <div className="eld-preview-header">✓ ELD Data Extracted — {eldData.weekOf || selectedState}</div>
                <div className="totals-strip">
                  {[
                    ['Driving',      eldData.weeklyTotals?.driving],
                    ['On Duty ND',   eldData.weeklyTotals?.onDutyNotDriving],
                    ['Off / Sleep',  (eldData.weeklyTotals?.offDuty||0)+(eldData.weeklyTotals?.sleeperBerth||0)],
                    ['Total On Duty',eldData.weeklyTotals?.totalOnDuty],
                  ].map(([label,val],i) => (
                    <div key={i} className={`tc${i===3?' hi':''}`}>
                      <div className="tc-label">{label}</div>
                      <div className="tc-val">{fh(val)}</div>
                    </div>
                  ))}
                </div>
                {eldData.violations && <div className="note-box">⚠ {eldData.violations}</div>}
              </div>

              <div className="form-grid">
                <div className="field">
                  <label>Week Of</label>
                  <input type="text" placeholder="e.g. 04/14 – 04/20" value={pay.week} onChange={e => setPay(p=>({...p,week:e.target.value}))} />
                </div>
                <div className="field">
                  <label>Pay Structure</label>
                  <select value={pay.type} onChange={e => setPay(p=>({...p,type:e.target.value}))}>
                    <option value="hourly">Hourly Rate</option>
                    <option value="permile">Per Mile</option>
                    <option value="flat">Flat / Salary</option>
                  </select>
                </div>
                <div className="field">
                  <label>Hours on Paycheck</label>
                  <input type="number" placeholder="e.g. 44.5" value={pay.hours} onChange={e => setPay(p=>({...p,hours:e.target.value}))} />
                </div>
                <div className="field">
                  <label>{pay.type==='permile' ? 'Rate per Mile ($)' : pay.type==='flat' ? 'N/A' : 'Hourly Rate ($)'}</label>
                  <input type="number" placeholder={pay.type==='permile'?'0.55':pay.type==='flat'?'—':'18.50'} value={pay.rate} disabled={pay.type==='flat'} onChange={e => setPay(p=>({...p,rate:e.target.value}))} />
                </div>
                <div className="field full">
                  <label>Gross Pay on Check ($)</label>
                  <input type="number" placeholder="e.g. 920.00" value={pay.gross} onChange={e => setPay(p=>({...p,gross:e.target.value}))} />
                </div>
              </div>

              <div className="wizard-footer">
                <button className="btn-ghost" onClick={() => setWizardStep(2)}>← Back</button>
                <button className="btn-teal" style={{flex:1}} disabled={!pay.hours || !pay.gross || comparing} onClick={calcPay}>
                  {comparing ? <><span className="spin-sm" />Calculating…</> : '🔍 Calculate Discrepancy'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Parse failed */}
          {wizardStep === 4 && eldData?._raw && (
            <div className="wizard-body">
              <h2>PARSE FAILED</h2>
              <p>Couldn't extract structured data. Try again with clearer, brighter screenshots.</p>
              <div className="terminal" style={{maxHeight:200,color:'#cbd5e1'}}>
                <span className="log-line">Raw output:</span>
                <span className="log-line dim">{eldData._raw}</span>
              </div>
              <div className="wizard-footer">
                <button className="btn-ghost" onClick={() => { setEldData(null); setWizardStep(2); }}>← Try Again</button>
              </div>
            </div>
          )}

          {/* Step 5 — Results */}
          {wizardStep === 5 && result && (
            <div className="results-wrap">
              <div className="results-header">
                <h2>YOUR PAY AUDIT</h2>
                <span className={`verdict-badge ${result.verdict==='MATCH'?'v-clear':result.verdict==='UNDERPAID'?'v-flag':'v-over'}`}>
                  {result.verdict==='MATCH'     && '✓ Hours Match'}
                  {result.verdict==='UNDERPAID' && '⚠ Potential Underpayment'}
                  {result.verdict==='OVERPAID'  && '↑ Hours Over on Check'}
                </span>
              </div>

              <div className={`owed-banner ${result.verdict==='UNDERPAID'?'bad':'good'}`}>
                <div className="owed-label">Estimated Amount Owed</div>
                <div className={`owed-amount ${result.verdict==='UNDERPAID'?'red':'teal'}`}>
                  {result.verdict==='UNDERPAID' && result.owed > 0
                    ? `$${result.owed.toFixed(2)}`
                    : result.verdict==='MATCH'
                      ? "You're paid up"
                      : 'Extra on check'
                  }
                </div>
              </div>

              <div className="summary-box">
                {result.verdict==='MATCH'     && <>Your ELD hours and paycheck hours are <strong>within acceptable tolerance</strong> for {result.state}. No discrepancy detected.</>}
                {result.verdict==='UNDERPAID' && <>Your ELD shows <strong>{result.eldHours.toFixed(2)} hours</strong> on duty but your check only reflects <strong>{result.paidHours.toFixed(2)} hours</strong> — a gap of <strong>{Math.abs(result.hoursDiff).toFixed(2)} hours</strong>.{result.payType!=='flat'&&result.rate>0&&<> At ${result.rate}/hr, that's approximately <strong>${Math.abs(result.payDiff).toFixed(2)} missing</strong>.</>} Keep your ELD records and bring this to your dispatcher or payroll.</>}
                {result.verdict==='OVERPAID'  && <>Your check shows <strong>{result.paidHours.toFixed(2)} hours</strong> but your ELD recorded <strong>{result.eldHours.toFixed(2)} hours</strong> — {Math.abs(result.hoursDiff).toFixed(2)} extra hours on your check. Could be a bonus, OT, or an error — worth confirming with payroll.</>}
              </div>

              <div className="results-grid">
                <div className="result-card">
                  <h4>ELD Hours — {result.state}</h4>
                  <div className="result-row hi"><span>Total On Duty</span><span>{result.eldHours.toFixed(2)} hrs</span></div>
                  <div className="result-row"><span>Hours on Check</span><span>{result.paidHours.toFixed(2)} hrs</span></div>
                  <div className={`result-row ${result.verdict==='MATCH'?'hi':result.verdict==='UNDERPAID'?'bad':'warn'}`}>
                    <span>Difference</span>
                    <span>{result.hoursDiff>=0?'+':''}{result.hoursDiff.toFixed(2)} hrs</span>
                  </div>
                </div>
                <div className="result-card">
                  <h4>Pay Analysis</h4>
                  <div className="result-row"><span>Gross Pay</span><span>${result.grossPay.toFixed(2)}</span></div>
                  {result.payType!=='flat'&&result.rate>0&&<div className="result-row"><span>Stated Rate</span><span>${result.rate}/hr</span></div>}
                  <div className={`result-row ${result.impliedRate < 7.25 ? 'bad' : 'hi'}`}>
                    <span>Implied Hourly Rate</span><span>${result.impliedRate.toFixed(2)}/hr</span>
                  </div>
                  <div className={`result-row ${result.impliedRate < 7.25 ? 'bad' : ''}`}>
                    <span>Federal Min Wage</span><span>$7.25/hr</span>
                  </div>
                  {result.payType!=='flat'&&result.rate>0&&(
                    <div className={`result-row ${result.verdict==='UNDERPAID'?'bad':result.verdict==='MATCH'?'hi':''}`}>
                      <span>Expected Pay</span><span>${result.expected.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="disclaimer">
                <strong>Disclaimer:</strong> This audit is an estimate for informational purposes only and does not constitute legal advice. Calculations are based on the information you provided and may not capture all factors affecting your pay. Consult a licensed employment attorney or your state's Department of Labor for official guidance on wage claims.
              </div>

              <div className="results-actions">
                <button className="btn-ghost" onClick={reset}>← Run Another Audit</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
