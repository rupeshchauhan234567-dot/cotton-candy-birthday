import { useEffect, useRef, useState } from "react";
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ArrowLeft, ArrowRight, Heart, Sparkles, MailOpen, Star, Camera, Music2, VolumeX, RefreshCw, LockKeyhole, Cloud } from "lucide-react";
import Confetti from "./Confetti";
import "./fairyland.css";
import "./countdown-spatial.css";
import { birthdayName, yourName, birthdayDate, birthdayPassword, letter, reasons, memories } from "./data";

const PROGRESS_KEY = "birthday-world-progress-v2";
const COUNTDOWN_UNLOCK_KEY = "birthday-countdown-unlocked-v1";

const chapters = [
  ["invitation", "/", "Invitation"], ["welcome", "/welcome", "Welcome"],
  ["countdown", "/countdown", "Countdown"], ["garden", "/garden", "Garden"],
  ["memories", "/memories", "Memories"], ["reasons", "/reasons", "Reasons"],
  ["letter", "/letter", "Letter"], ["game", "/game", "Heart game"],
  ["memory-game", "/memory-game", "Memory game"], ["task-game", "/task-game", "Task quest"],
  ["wish", "/wish", "Birthday wish"], ["stars", "/stars", "Stars"],
  ["gift", "/gift", "Gift"], ["finale", "/finale", "Finale"],
];

function getProgress() {
  try { return JSON.parse(sessionStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}
function completeChapter(key) {
  sessionStorage.setItem(PROGRESS_KEY, JSON.stringify({ ...getProgress(), [key]: true }));
}
function hasCountdownUnlock() {
  return sessionStorage.getItem(COUNTDOWN_UNLOCK_KEY) === "true";
}
function birthdayReached() {
  const target = new Date(birthdayDate).getTime();
  return Number.isFinite(target) && target <= Date.now();
}

function ChapterGuard({ required, children }) {
  const progress = getProgress();
  const allowed = required === "countdown"
    ? progress.countdown === true || hasCountdownUnlock() || birthdayReached()
    : progress[required] === true;

  const fallback = {
    welcome: "/", countdown: "/welcome", garden: "/countdown",
    memories: "/garden", reasons: "/memories", letter: "/reasons",
    game: "/letter", "memory-game": "/game", "task-game": "/memory-game",
    wish: "/task-game", stars: "/wish", gift: "/stars", finale: "/gift",
  };
  return allowed ? children : <Navigate to={fallback[required] || "/"} replace />;
}

function Shell({ index, children }) {
  const ref = useRef(null);
  const chapter = chapters[index] || chapters[0];
  const previous = chapters[index - 1];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".enter", { y: 30, opacity: 0, scale: .98, filter: "blur(7px)" },
        { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: .85, stagger: .08, ease: "power3.out" });
      gsap.to(".floaty", { y: -14, rotate: 7, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: .2 });
      gsap.fromTo(".flower-card, .polaroid, .reason, .chapter-card, .task-card, .memory-tile",
        { y: 22, opacity: 0, scale: .95 },
        { y: 0, opacity: 1, scale: 1, duration: .65, stagger: .06, ease: "back.out(1.4)" });
    }, ref);
    return () => ctx.revert();
  }, [index]);

  return <main ref={ref} className={`page fairy-page theme-${chapter[0]}`}>
    <div className="fairy-background">
      <div className="fairy-orb orb-one" /><div className="fairy-orb orb-two" /><div className="fairy-orb orb-three" />
      <div className="fairy-stars">{Array.from({ length: 35 }, (_, i) =>
        <span key={i} style={{ left: `${(i * 37 + 11) % 98}%`, top: `${(i * 53 + 7) % 95}%`, animationDelay: `${(i % 9) * .4}s` }}>
          {i % 3 === 0 ? "✦" : i % 3 === 1 ? "✧" : "·"}
        </span>)}</div>
      <div className="floating-petals">{Array.from({ length: 16 }, (_, i) =>
        <span key={i} style={{ left: `${(i * 23 + 4) % 100}%`, animationDelay: `${i * -1.2}s`, animationDuration: `${9 + (i % 5) * 2}s` }}>
          {i % 2 === 0 ? "🌸" : "✿"}
        </span>)}</div>
    </div>
    <div className="decor decor-a floaty">✦</div><div className="decor decor-b floaty">♡</div><div className="decor decor-c floaty">✿</div>
    <header className="topbar enter">
      <Link to="/" className="brand"><span className="brand-mark"><Heart size={15} fill="currentColor" /></span>little birthday world</Link>
      <span className="chapter">chapter {index + 1} / {chapters.length}</span>
    </header>
    <section className="content"><p className="kicker enter">{chapter[2]}</p>{children}</section>
    <footer className="footer enter">
      {previous ? <Link className="text-link" to={previous[1]}><ArrowLeft size={16} /> Previous</Link> : <span />}
      <div className="dots">{chapters.map((item, i) => <span key={item[0]} className={i === index ? "dot active" : "dot"} />)}</div>
      <span className="chapter-locked"><LockKeyhole size={14} /> {index === chapters.length - 1 ? "Birthday finale" : "Complete this chapter to continue"}</span>
    </footer>
  </main>;
}

function Button({ to, children, onClick, secondary = false }) {
  const cls = secondary ? "button button-secondary" : "button";
  return to ? <Link className={cls} to={to} onClick={onClick}>{children}</Link>
    : <button className={cls} type="button" onClick={onClick}>{children}</button>;
}

function Invitation() {
  const [open, setOpen] = useState(false);
  return <Shell index={0}><div className="center">
    <button className={`envelope enter ${open ? "opened" : ""}`} onClick={() => setOpen(true)} aria-label="Open invitation" type="button">
      <span className="envelope-paper"><Heart fill="#e9a9c5" color="#e9a9c5" size={30} /></span><span className="envelope-flap" /><span className="wax">♡</span>
    </button>
    <p className="script enter">You've got a little invitation</p>
    <h1 className="hero enter">For you, <em>{birthdayName}</em> ♡</h1>
    <p className="copy enter">{open ? "A tiny world of smiles, memories and birthday magic is waiting for you." : "There is a little something waiting inside. Tap the envelope to open it."}</p>
    {open ? <Button to="/welcome" onClick={() => completeChapter("invitation")}>Accept the invitation <Sparkles size={17} /></Button>
      : <Button onClick={() => setOpen(true)}>Open your invitation <MailOpen size={17} /></Button>}
    <p className="tiny enter">made with a little extra love</p>
  </div></Shell>;
}


function Welcome() {
  // Welcome page open hote hi chapter complete mark hoga
  useEffect(() => {
    completeChapter("welcome");
  }, []);

  return (
    <Shell index={1}>
      <div className="center">
        <div className="orbit enter">
          <div className="orbit-photo">
            <img src="/images/birthday-girl.jpeg" alt="Birthday girl" />
          </div>
          <span className="orbit-heart">♡</span>
          <b className="orbit-star star-one">✦</b>
          <i className="orbit-star star-two">✧</i>
          <small className="orbit-star star-three">✦</small>
          <span className="orbit-star star-four">✧</span>
          <span className="orbit-star star-five">✦</span>
          <span className="orbit-star star-six">⋆</span>
          <span className="orbit-star star-seven">✧</span>
          <span className="orbit-star star-eight">✦</span>
        </div>

        <p className="script enter">
          Welcome to your own little wonderland
        </p>

        <h1 className="hero enter">
          <span>To My Sweetest</span>{" "}
          <em>{birthdayName}</em> ♡
        </h1>

        <p className="copy enter">
          Take a deep breath, make yourself comfy,
          and let the birthday magic begin.
        </p>

        <div className="chips enter">
          <Link to="/clouds">
            <Cloud size={15} /> Soft Clouds <ArrowRight size={13} />
          </Link>

          <Link to="/wishes">
            <Star size={15} /> Tiny Wishes <ArrowRight size={13} />
          </Link>

          <Link to="/moments">
            <Sparkles size={15} /> Happy Moments <ArrowRight size={13} />
          </Link>
        </div>

        <Button
          to="/countdown"
          onClick={() => completeChapter("welcome")}
        >
          Let's begin <Sparkles size={17} />
        </Button>
      </div>
    </Shell>
  );
}


function Countdown() {
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now());
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(hasCountdownUnlock());
  const [error, setError] = useState("");
  const target = new Date(birthdayDate).getTime();
  const validDate = Number.isFinite(target);
  const diff = validDate ? Math.max(0, target - now) : 0;
  const canEnter = unlocked || (validDate && diff === 0);
  const values = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60];

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!canEnter) return undefined;
    completeChapter("countdown");
    const id = window.setTimeout(() => navigate("/garden", { replace: true }), 1400);
    return () => window.clearTimeout(id);
  }, [canEnter, navigate]);

  function checkPassword(event) {
    event.preventDefault();
    if (password.trim() === String(birthdayPassword).trim()) {
      sessionStorage.setItem(COUNTDOWN_UNLOCK_KEY, "true");
      setUnlocked(true); setError(""); completeChapter("countdown");
    } else {
      setError("That password is not correct. Try again, birthday star ♡");
      setPassword("");
    }
  }

  return <Shell index={2}><div className="center countdown-layout">
    <p className="script enter">Your little secret stays right here until the big day</p>
    <h1 className="hero enter">The magic is getting closer!</h1>
    <div className="timer enter">{["Days", "Hours", "Minutes", "Seconds"].map((label, i) =>
      <div className="timebox" key={label}><strong>{String(values[i]).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>
    <p className="copy enter">{!validDate
      ? "The birthday date in src/data.js is invalid. Please correct it before continuing."
      : diff === 0
        ? "It's your birthday! The magical next chapter is opening..."
        : "The next chapter is locked until the birthday countdown ends. You can unlock it early only with the correct password."}</p>
    <form className="password-card enter" onSubmit={checkPassword}>
      <div className="lock-orbit"><LockKeyhole size={25} /></div>
      <h3>{unlocked ? "Secret accepted ♡" : "A little password keeps the surprise safe"}</h3>
      <p>{unlocked ? "Your password is correct. Opening your garden..." : "Enter the correct birthday password to unlock the next chapter early."}</p>
      {!unlocked && validDate && diff > 0 && <>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter birthday password" autoComplete="off" aria-label="Birthday password" required />
        <button className="button" type="submit">Unlock with password <Sparkles size={16} /></button>
      </>}
      {error && validDate && diff > 0 && <small className="password-error" role="alert">{error}</small>}
      {canEnter && <div className="waiting-pill"><Sparkles size={15} /> Access granted · Opening your garden</div>}
      <small className="tiny">The password can be changed in src/data.js</small>
    </form>
    <p className="tiny enter">No next button or direct route can bypass this lock. ♡</p>
  </div></Shell>;
}

function Garden() {
  const [opened, setOpened] = useState([]);
  const flowers = ["🌷", "🌼", "🌸", "🌻", "🪻", "🌺"];
  const notes = ["You make the world brighter.", "Keep growing at your own pace.", "You deserve gentle, happy days.", "Your smile is sunshine.", "You are one of a kind.", "May lovely things find you."];
  function bloom(i) { setOpened(old => { const next = old.includes(i) ? old : [...old, i]; if (next.length === 6) completeChapter("garden"); return next; }); }
  return <Shell index={3}><div className="center wide">
    <p className="script enter">A little flower garden for you</p><h1 className="hero enter">Tap a flower to make it bloom</h1>
    <div className="flower-grid enter">{flowers.map((f, i) => <button type="button" key={i} className={`flower-card ${opened.includes(i) ? "bloomed" : ""}`} onClick={() => bloom(i)}><span>{f}</span><small>{opened.includes(i) ? notes[i] : "tap to bloom"}</small></button>)}</div>
    <p className="copy enter">{opened.length === 6 ? "Every flower has a wish for you. 🌸" : `${opened.length} of 6 flowers have bloomed`}</p>
    {opened.length === 6 ? <Button to="/memories">See your memory garden ♡</Button> : <p className="tiny">Bloom all six flowers to unlock the memories.</p>}
  </div></Shell>;
}

function Memories() {
  const [visited, setVisited] = useState([]);
  function visit(i) { setVisited(old => { const next = old.includes(i) ? old : [...old, i]; if (next.length === memories.length) completeChapter("memories"); return next; }); }
  return <Shell index={4}><div className="center wide">
    <p className="script enter">A scrapbook of sweet moments</p><h1 className="hero enter">Beautiful memories ♡</h1>
    <p className="copy enter">Tap every photograph to open its little memory. Add your own photos before sharing.</p>
    <div className="memory-grid enter">{memories.map((m, i) => <button type="button" className={`polaroid p${i % 3} ${visited.includes(i) ? "photo-visited" : ""}`} key={m.caption || i} onClick={() => visit(i)}>
      <div className="photo">{m.image ? <img src={m.image} alt={m.caption || "Birthday memory"} onError={e => { e.currentTarget.style.display = "none"; if (e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.style.display = "grid"; }} /> : null}
        <span className="photo-fallback"><Camera size={25} />Add your photo</span><span className="photo-stamp">{visited.includes(i) ? "♡ opened" : "tap to open"}</span></div><p>{m.caption}</p>
    </button>)}</div>
    <p className="tiny">{visited.length} / {memories.length} memories explored</p>
    {visited.length === memories.length ? <Button to="/reasons">A few things to celebrate 💗</Button> : <p className="tiny">Explore every memory to continue.</p>}
  </div></Shell>;
}

function Reasons() {
  const [shown, setShown] = useState([]);
  function reveal(i) { setShown(old => { const next = old.includes(i) ? old : [...old, i]; if (next.length === reasons.length) completeChapter("reasons"); return next; }); }
  return <Shell index={5}><div className="center wide">
    <p className="script enter">A little collection of compliments</p><h1 className="hero enter">Reasons you're special</h1>
    <div className="reason-grid enter">{reasons.map((r, i) => <button type="button" key={i} className={`reason ${shown.includes(i) ? "shown" : ""}`} onClick={() => reveal(i)}>
      <span>{String(i + 1).padStart(2, "0")}</span>{shown.includes(i) ? <p>{r}</p> : <><Heart size={24} fill="#f3c5d8" color="#d99bb8" /><small>tap to reveal</small></>}</button>)}</div>
    <p className="copy enter">{shown.length} of {reasons.length} lovely reminders revealed</p>
    <div className="progress-track"><span style={{ width: `${reasons.length ? shown.length / reasons.length * 100 : 0}%` }} /></div>
    {shown.length === reasons.length ? <Button to="/letter">Read a little letter 💌</Button> : <p className="tiny">Reveal all {reasons.length} reasons to unlock your letter.</p>}
  </div></Shell>;
}

function Letter() {
  const [opened, setOpened] = useState(false); const letterRef = useRef(null);
  useEffect(() => {
    if (!opened || !letterRef.current) return;
    gsap.fromTo(letterRef.current, { y: 22, rotateX: -12, scale: .96, opacity: .65 }, { y: 0, rotateX: 0, scale: 1, opacity: 1, duration: 1.05, ease: "elastic.out(1,0.65)" });
    const p = letterRef.current.querySelector("p");
    if (p) gsap.fromTo(p, { opacity: 0, y: 18, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .8, delay: .25, ease: "power3.out" });
  }, [opened]);
  return <Shell index={6}><div className="center">
    <p className="script enter">A few words, straight from the heart</p><h1 className="hero enter">A letter for you 💌</h1>
    <button ref={letterRef} type="button" className={`letter-card enter ${opened ? "letter-open" : ""}`} onClick={() => setOpened(v => { if (!v) completeChapter("letter"); return !v; })}>
      <span className="letter-top">♡ a little note ♡</span><p>{opened ? letter : "Tap this letter to unfold a little message written just for you..."}</p><span className="letter-sign">{opened ? "with love ♡" : "tap to open"}</span>
    </button>
    {opened ? <Button to="/game">A little game next? 🎀</Button> : <p className="tiny">Open the letter to reveal what comes next.</p>}
  </div></Shell>;
}

function Game() {
  const [score, setScore] = useState(0);
  function catchHeart() { setScore(s => { const n = Math.min(s + 1, 10); if (n === 10) completeChapter("game"); return n; }); }
  return <Shell index={7}><div className="center">
    <p className="script enter">A tiny game, just for fun</p><h1 className="hero enter">Catch the happy hearts!</h1>
    <p className="copy enter">Tap the heart 10 times to collect a little birthday surprise.</p>
    <div className="game-box enter"><div className="score">Hearts collected <b>{score}/10</b></div><button type="button" className="catch-heart" onClick={catchHeart} disabled={score >= 10}>💗</button><p>{score >= 10 ? "You did it! You're a star! ✨" : "Tap the floating heart!"}</p></div>
    {score >= 10 ? <Button to="/memory-game">Unlock a new mini-game ✨</Button> : <Button secondary onClick={() => setScore(0)}>Start over</Button>}
  </div></Shell>;
}

function MemoryGame() {
  const symbols = ["🌸", "🎀", "🧁", "💗", "🌙", "🦋"];
  const makeCards = () => [...symbols, ...symbols].sort(() => Math.random() - .5).map((value, id) => ({ id, value, flipped: false, matched: false }));
  const [cards, setCards] = useState(makeCards); const [picked, setPicked] = useState([]); const [moves, setMoves] = useState(0);
  function flip(id) {
    if (picked.length === 2) return;
    const card = cards.find(c => c.id === id); if (!card || card.flipped || card.matched) return;
    const next = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(next); const pair = [...picked, id]; setPicked(pair);
    if (pair.length === 2) {
      setMoves(n => n + 1);
      const a = next.find(c => c.id === pair[0]); const b = next.find(c => c.id === pair[1]);
      if (a.value === b.value) { setCards(next.map(c => pair.includes(c.id) ? { ...c, matched: true } : c)); setPicked([]); }
      else window.setTimeout(() => { setCards(old => old.map(c => pair.includes(c.id) ? { ...c, flipped: false } : c)); setPicked([]); }, 750);
    }
  }
  const won = cards.every(c => c.matched);
  useEffect(() => { if (won) completeChapter("memory-game"); }, [won]);
  return <Shell index={8}><div className="center wide">
    <p className="script enter">A little brain-teaser break</p><h1 className="hero enter">Find the matching pairs</h1>
    <p className="copy enter">Match all six pairs with as few moves as you can. Take your time!</p>
    <div className="memory-game enter">{cards.map(c => <button type="button" key={c.id} className={`memory-tile ${c.flipped || c.matched ? "face-up" : ""} ${c.matched ? "matched" : ""}`} onClick={() => flip(c.id)} disabled={c.matched || picked.length === 2} aria-label={c.flipped || c.matched ? c.value : "Hidden card"}>{c.flipped || c.matched ? c.value : "?"}</button>)}</div>
    <p className="copy">Moves: {moves} · Pairs: {cards.filter(c => c.matched).length}/6</p>
    {won ? <><p className="success-note">You did it! Your memory is sparkling ✨</p><Button to="/task-game">Continue to the four-task quest</Button></> :
      <Button secondary onClick={() => { setCards(makeCards()); setPicked([]); setMoves(0); }}>Shuffle and restart</Button>}
  </div></Shell>;
}

function TaskGame() {
  const tasks = ["Find the pink heart", "Tap the moon", "Choose the flower", "Send a star wish"];
  const choices = [["🌙", "💗", "🌸"], ["🌸", "☁", "🌙"], ["🎀", "🌷", "🌼"], ["✦", "♡", "☀"]];
  const answers = [1, 2, 1, 0]; const [step, setStep] = useState(0);
  useEffect(() => { if (step === 4) completeChapter("task-game"); }, [step]);
  return <Shell index={9}><div className="center">
    <p className="script enter">A tiny birthday quest</p><h1 className="hero enter">Four little tasks</h1>
    <p className="copy enter">Complete each simple mission to earn your sparkle badge.</p>
    <div className="task-card enter"><span className="task-count">TASK {Math.min(step + 1, 4)} / 4</span><h2>{step === 4 ? "Quest complete!" : tasks[step]}</h2>
      {step < 4 ? <div className="task-choices">{choices[step].map((v, i) => <button type="button" key={i} onClick={() => { if (i === answers[step]) setStep(s => s + 1); }}>{v}</button>)}</div> : <div className="quest-complete">🏆 ✨ 💗</div>}
      <p>{step === 4 ? "You earned the sweetest little badge." : "Choose the right symbol to continue."}</p>
    </div>
    {step === 4 ? <Button to="/wish">Continue your birthday story</Button> : <small className="tiny">No timer, no pressure — just a little fun.</small>}
  </div></Shell>;
}

function Wish() {
  const [wished, setWished] = useState(false);
  return <Shell index={10}><div className="center">
    <p className="script enter">Close your eyes and make a wish</p><h1 className="hero enter">Your birthday cake is ready!</h1>
    <div className={`cake-scene enter ${wished ? "wished" : ""}`}><div className="candles"><i /><i /><i /></div><div className="cake-top" /><div className="cake-mid" /><div className="cake-base" /><div className="cake-plate" /></div>
    <p className="copy enter">{wished ? "May your wish find its way to you. ✨" : "Take a moment, make a wish, then blow out the candles."}</p>
    <Button onClick={() => { setWished(true); completeChapter("wish"); }}>{wished ? "Wish sent with love ♡" : "Blow out the candles ✨"}</Button>
    {wished && <div className="enter"><Confetti /><Button to="/stars">Send your wish to the stars 🌙</Button></div>}
  </div></Shell>;
}

function Stars() {
  const [message, setMessage] = useState(""); const [collected, setCollected] = useState([]);
  const wishes = ["May you always find reasons to smile.", "May your dreams grow bigger every day.", "May kindness always find you.", "May this year be your brightest yet."];
  function collect(i) { setMessage(wishes[i % wishes.length]); setCollected(old => { const next = old.includes(i) ? old : [...old, i]; if (next.length >= 8) completeChapter("stars"); return next; }); }
  return <Shell index={11}><div className="center">
    <p className="script enter">A little universe of wishes</p><h1 className="hero enter">A sky full of stars</h1>
    <div className="star-sky enter">{Array.from({ length: 24 }, (_, i) => <button type="button" key={i} style={{ left: `${(i * 37 + 11) % 94}%`, top: `${(i * 53 + 7) % 82}%`, animationDelay: `${i * .13}s` }} onClick={() => collect(i)}>✦</button>)}<span className="moon">☾</span></div>
    <p className="copy enter">{message || "Tap at least 8 different stars to collect your wishes."}</p><p className="tiny">{collected.length} / 8 wishes collected</p>
    {collected.length >= 8 && <Button to="/gift">Follow the shooting star 🎁</Button>}
  </div></Shell>;
}

function GiftPage() {
  const [unlocked, setUnlocked] = useState(false);
  function openGift() { setUnlocked(true); completeChapter("gift"); }
  return <Shell index={12}><div className="center">
    <p className="script enter">One last little secret</p><h1 className="hero enter">A mystery gift for you</h1>
    <button type="button" className={`gift-box enter ${unlocked ? "gift-open" : ""}`} onClick={openGift} aria-label="Open mystery gift">
      <span className="gift-lid" /><span className="gift-body" /><span className="gift-ribbon-v" /><span className="gift-bow">♡</span><span className="gift-spark">✦</span>
    </button>
    <p className="copy enter">{unlocked ? "Surprise! The best gift is knowing you are celebrated. 💗" : "Tap the gift to unlock your final surprise."}</p>
    {unlocked ? <Button to="/finale">One last thing... ♡</Button> : <Button onClick={openGift}>Open your gift 🎀</Button>}
  </div></Shell>;
}

function Finale() {
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => { const id = window.setTimeout(() => setShowMessage(true), 6000); return () => window.clearTimeout(id); }, []);
  return <Shell index={13}><div className="finale-world">
    <div className="finale-glow" /><div className="finale-intro"><span className="finale-eyebrow">A little flower, just for you</span><h1 className="finale-heading">Something beautiful is growing...</h1></div>
    <div className="rose-stage"><div className="rose-aura" /><div className="rose-plant">
      <div className="rose-flower">{Array.from({ length: 8 }, (_, i) => <span key={i} className="rose-petal" style={{ "--petal": i }} />)}<span className="rose-center" /></div>
      <div className="rose-stem" /><div className="rose-leaf rose-leaf-left" /><div className="rose-leaf rose-leaf-right" />
    </div><div className="rose-ground-glow" /></div>
    <div className={`final-message ${showMessage ? "message-visible" : ""}`}>
      <div className="message-sparkle">✦ ♡ ✧</div><p className="script">Just like this little rose...</p>
      <h1>Happy Birthday,<br /><em>{birthdayName}</em>!</h1>
      <p className="final-message-text">May your life bloom with happiness, your heart stay filled with love, and every new day bring you something beautiful.<br /><br />
        May your dreams grow bigger, your smile shine brighter, and may you always find a reason to feel special.<br /><br />
        You deserve all the beautiful things this world has to offer. ♡</p>
      <div className="final-divider"><span>✦</span><i /><span>♡</span><i /><span>✦</span></div>
      <div className="final-signature">Made with endless love,<strong>{yourName}</strong></div>
      <div className="final-heart-rain">{Array.from({ length: 18 }, (_, i) => <span key={i} style={{ "--i": i, left: `${(i * 31 + 8) % 100}%` }}>{i % 2 === 0 ? "♡" : "✦"}</span>)}</div>
      <Confetti />
      <Button to="/" onClick={() => { sessionStorage.removeItem(PROGRESS_KEY); sessionStorage.removeItem(COUNTDOWN_UNLOCK_KEY); }}>Relive this beautiful day <RefreshCw size={16} /></Button>
      <p className="final-footnote">The end of a little story, the beginning of beautiful memories ✨</p>
    </div>
  </div></Shell>;
}

function MiniChapter({ type }) {
  const content = {
    clouds: { title: "Soft clouds", script: "Float somewhere peaceful", copy: "Pick a cloud and uncover a tiny reminder to be gentle with yourself.", items: ["You deserve slow, soft mornings.", "You don't have to be perfect to be wonderful.", "Let the little things make you happy.", "Your pace is the right pace."] },
    wishes: { title: "Tiny wishes", script: "A pocketful of stardust", copy: "Tap a star to collect a wish for your new year.", items: ["A year full of firsts and happy surprises.", "Courage for every dream you chase.", "People who make you feel safe and seen.", "More laughter than worries."] },
    moments: {
      title: "Happy moments", script: "Little memories, endless magic", copy: "Every picture holds a beautiful little memory.", items: [
        { image: "/images/moment1.jpeg", title: "Cutest Soul 🦋" }, { image: "/images/moment2.jpeg", title: "Little Sunshine ☀️" },
        { image: "/images/moment3.jpeg", title: "Beautiful Smile 🌸" }, { image: "/images/moment4.jpeg", title: "Dreamy Beauty 🌷 " },
      ]
    },
  };
  const data = content[type]; const [revealed, setRevealed] = useState([]);
  return <Shell index={1}><div className="center wide">
    <p className="script enter">{data.script}</p><h1 className="hero enter">{data.title} <em>♡</em></h1><p className="copy enter">{data.copy}</p>
    {type === "moments" ? <div className="moment-cards enter">{data.items.map((item, i) => <div className="moment-card" key={item.image}>
      <div className="moment-image"><img src={item.image} alt={item.title} /><span className="moment-number">0{i + 1}</span></div><h3>{item.title}</h3><span className="moment-heart">♡</span>
    </div>)}</div> : <div className="chapter-card-grid enter">{data.items.map((item, i) => <button type="button" key={item} className={`chapter-card ${revealed.includes(i) ? "revealed" : ""}`} onClick={() => setRevealed(old => old.includes(i) ? old.filter(x => x !== i) : [...old, i])}>
      <span>{type === "clouds" ? "☁" : "✦"}</span><p>{revealed.includes(i) ? item : "Tap to reveal"}</p>
    </button>)}</div>}
    <p className="tiny">{type === "moments" ? "A collection of little happiness ♡" : `${revealed.length} of 4 discovered`}</p>
    <Button to="/welcome">
      <ArrowLeft size={16} />
      Back to Wonderland
    </Button>
  </div></Shell>;
}

function MusicControl() {
  const audio = useRef(null); const [playing, setPlaying] = useState(false);
  async function toggle() {
    if (!audio.current) return;
    try { if (playing) { audio.current.pause(); setPlaying(false); } else { await audio.current.play(); setPlaying(true); } }
    catch { window.alert("Add birthday-song.mp3 inside the public/music folder."); }
  }
  return <div className="music"><audio ref={audio} src="/music/birthday-song.mp3" loop />
    <button type="button" onClick={toggle}>{playing ? <Music2 size={16} /> : <VolumeX size={16} />}{playing ? "Music on" : "Music off"}</button>
  </div>;
}

export default function App() {
  const location = useLocation();
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true }); let raf;
    const tick = time => { lenis.raf(time); raf = window.requestAnimationFrame(tick); };
    raf = window.requestAnimationFrame(tick);
    return () => { window.cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [location.pathname]);

  return <>
    <Routes>
      <Route path="/" element={<Invitation />} />
      <Route path="/welcome" element={<ChapterGuard required="invitation"><Welcome /></ChapterGuard>} />
      <Route path="/countdown" element={<ChapterGuard required="welcome"><Countdown /></ChapterGuard>} />
      <Route path="/clouds" element={<ChapterGuard required="welcome"><MiniChapter type="clouds" /></ChapterGuard>} />
      <Route path="/wishes" element={<ChapterGuard required="welcome"><MiniChapter type="wishes" /></ChapterGuard>} />
      <Route path="/moments" element={<ChapterGuard required="welcome"><MiniChapter type="moments" /></ChapterGuard>} />
      <Route path="/garden" element={<ChapterGuard required="countdown"><Garden /></ChapterGuard>} />
      <Route path="/memories" element={<ChapterGuard required="garden"><Memories /></ChapterGuard>} />
      <Route path="/reasons" element={<ChapterGuard required="memories"><Reasons /></ChapterGuard>} />
      <Route path="/letter" element={<ChapterGuard required="reasons"><Letter /></ChapterGuard>} />
      <Route path="/game" element={<ChapterGuard required="letter"><Game /></ChapterGuard>} />
      <Route path="/memory-game" element={<ChapterGuard required="game"><MemoryGame /></ChapterGuard>} />
      <Route path="/task-game" element={<ChapterGuard required="memory-game"><TaskGame /></ChapterGuard>} />
      <Route path="/wish" element={<ChapterGuard required="task-game"><Wish /></ChapterGuard>} />
      <Route path="/stars" element={<ChapterGuard required="wish"><Stars /></ChapterGuard>} />
      <Route path="/gift" element={<ChapterGuard required="stars"><GiftPage /></ChapterGuard>} />
      <Route path="/finale" element={<ChapterGuard required="gift"><Finale /></ChapterGuard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <MusicControl />
  </>;
}
