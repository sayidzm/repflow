import { useMemo, useState } from "react";
import { createBrowserRouter } from "react-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Dumbbell,
  Ellipsis,
  Flame,
  Home,
  ListChecks,
  Play,
  Plus,
  Search,
  Settings2,
  Timer,
  X,
} from "lucide-react";

type IconName = "home" | "routines" | "history" | "exercises";

const nav = [
  { icon: "home" as IconName, label: "Home" },
  { icon: "routines" as IconName, label: "Routines" },
  { icon: "history" as IconName, label: "History" },
  { icon: "exercises" as IconName, label: "Exercises" },
];

function NavIcon({ icon, size = 18 }: { icon: IconName; size?: number }) {
  const props = { size, strokeWidth: 1.8 };
  if (icon === "home") return <Home {...props} />;
  if (icon === "routines") return <ListChecks {...props} />;
  if (icon === "history") return <Timer {...props} />;
  return <Dumbbell {...props} />;
}

function Phone({ children, title, kicker, hero = false }: { children: React.ReactNode; title: string; kicker: string; hero?: boolean }) {
  return (
    <article className={`phone ${hero ? "phone--hero" : ""}`}>
      <div className="phone__shine" />
      <div className="phone__speaker" />
      <div className="phone__topline"><span>{kicker}</span><span className="phone__signal">● ● ●</span></div>
      <div className="phone__screen" aria-label={title}>{children}</div>
      <div className="phone__home" />
    </article>
  );
}

function SmallLabel({ children }: { children: React.ReactNode }) {
  return <p className="label">{children}</p>;
}

function BottomNav({ active = "home" }: { active?: IconName }) {
  return <nav className="bottom-nav" aria-label="App navigation">
    {nav.map((item) => <button className={active === item.icon ? "active" : ""} key={item.label}><NavIcon icon={item.icon} /><span>{item.label}</span></button>)}
  </nav>;
}

function HomeScreen() {
  return <Phone title="Home" kicker="01 — DASHBOARD">
    <main className="mobile-page home-page">
      <header className="mobile-header"><div><span className="brand-mark"><Flame size={17} fill="currentColor" /> REP</span><p className="eyebrow">MONDAY, AUG 18</p></div><button className="icon-button"><Settings2 size={18} /></button></header>
      <section className="home-intro"><h2>Ready when<br />you are.</h2><p>Your training log, always on this device.</p></section>
      <button className="start-button"><span><b>Start Workout</b><small>Log a session from scratch</small></span><span className="round-icon"><Play size={16} fill="currentColor" /></span></button>
      <section className="quick-block"><SmallLabel>QUICK START</SmallLabel><div className="quick-actions"><button><Plus size={17} /><span>Empty<br />Workout</span></button><button><ListChecks size={17} /><span>Select<br />Routine</span></button></div></section>
      <section className="routine-preview"><div className="section-heading"><SmallLabel>YOUR ROUTINES</SmallLabel><button>See all</button></div>{[["Push Day", "6 exercises", "3 days ago"], ["Pull Day", "5 exercises", "6 days ago"], ["Leg Day", "6 exercises", "Aug 8"]].map(([name, count, date]) => <button className="routine-row" key={name}><span className="routine-bullet" /><span><b>{name}</b><small>{count} · Last {date}</small></span><ChevronRight size={17} /></button>)}</section>
      <BottomNav />
    </main>
  </Phone>;
}

function ActiveScreen() {
  const [sets, setSets] = useState([true, true, false]);
  const [weight, setWeight] = useState("62.5");
  const [reps, setReps] = useState("8");
  return <Phone title="Active Push Day workout" kicker="02 — ACTIVE WORKOUT" hero>
    <main className="mobile-page workout-page">
      <header className="workout-header"><button className="icon-button"><X size={19} /></button><div><h2>Push Day</h2><p><b>42:18</b><span>· 6 exercises</span></p></div><button className="icon-button"><Ellipsis size={19} /></button></header>
      <section className="exercise-card"><div className="exercise-heading"><div><h3>Bench Press</h3><p>Chest <span>•</span> Barbell</p></div><button><Ellipsis size={19} /></button></div><p className="last-set">Last: <b>60 kg × 8</b></p>
        <div className="set-head"><span>SET</span><span>PREVIOUS</span><span>KG</span><span>REPS</span><span /></div>
        {sets.map((done, index) => <div className={`set-row ${done ? "is-done" : ""}`} key={index}><span className="set-number">{index + 1}</span><span className="previous">60 × {index === 2 ? 7 : 8}</span><input aria-label={`Set ${index + 1} kilograms`} value={index === 2 ? weight : "62.5"} onChange={e => index === 2 && setWeight(e.target.value)} /><input aria-label={`Set ${index + 1} reps`} value={index === 2 ? reps : index === 1 ? "8" : "8"} onChange={e => index === 2 && setReps(e.target.value)} /><button aria-label={`Complete set ${index + 1}`} onClick={() => setSets(current => current.map((value, setIndex) => setIndex === index ? !value : value))}>{done ? <Check size={17} /> : <span />}</button></div>)}
        <button className="add-set" onClick={() => setSets([...sets, false])}><Plus size={16} /> Add set</button>
      </section>
      <section className="exercise-card exercise-card--compact"><div className="exercise-heading"><div><h3>Incline Dumbbell Press</h3><p>Chest <span>•</span> Dumbbell</p></div><button><Ellipsis size={19} /></button></div><p className="last-set">Last: <b>26 kg × 10</b></p><div className="compact-sets"><span>1&nbsp;&nbsp; 24 kg&nbsp; × &nbsp;10</span><button><Check size={16} /></button><span>2&nbsp;&nbsp; 24 kg&nbsp; × &nbsp;10</span><button className="empty" /></div></section>
      <div className="workout-actions"><button><Plus size={17} /> Add Exercise</button><button className="finish">Finish Workout</button></div>
    </main>
  </Phone>;
}

function SelectorScreen() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const exercises = [["Bench Press", "Chest · Barbell"], ["Incline Dumbbell Press", "Chest · Dumbbell"], ["Cable Fly", "Chest · Cable"], ["Lat Pulldown", "Back · Cable"]];
  const visible = useMemo(() => exercises.filter(([name]) => name.toLowerCase().includes(query.toLowerCase())), [query]);
  return <Phone title="Exercise Selector" kicker="03 — EXERCISE SELECTOR">
    <main className="mobile-page selector-page"><header className="mobile-header"><button className="icon-button"><ArrowLeft size={19} /></button><h2>Add Exercise</h2><span className="header-spacer" /></header>
    <label className="search"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search exercises" /></label>
    <div className="filters">{["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"].map(item => <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <SmallLabel>{filter.toUpperCase()} EXERCISES</SmallLabel><div className="exercise-list">{visible.map(([name, kind]) => <button key={name}><span><b>{name}</b><small>{kind}</small></span><Plus size={19} /></button>)}</div><button className="custom-exercise"><Plus size={17} /> Create Custom Exercise</button></main>
  </Phone>;
}

function RoutinesScreen() {
 return <Phone title="Routines" kicker="04 — ROUTINES"><main className="mobile-page routines-page"><header className="title-header"><div><SmallLabel>YOUR LIBRARY</SmallLabel><h2>Routines</h2></div><button className="new-routine"><Plus size={16} /> New</button></header>{[["Push Day", "6 Exercises", ["Bench Press", "Incline Dumbbell Press", "Shoulder Press", "+3 more"], "Last performed 3 days ago"],["Pull Day", "5 Exercises", ["Lat Pulldown", "Seated Row", "Face Pull", "+2 more"], "Last performed 6 days ago"],["Leg Day", "6 Exercises", ["Back Squat", "Romanian Deadlift", "Leg Press", "+3 more"], "Last performed Aug 8"]].map(([name, count, exercises, last]) => <section className="routine-card" key={name as string}><div><h3>{name}</h3><span>{count as string}</span></div><ul>{(exercises as string[]).map(exercise => <li key={exercise}>{exercise}</li>)}</ul><footer><small>{last as string}</small><button>Start <Play size={13} fill="currentColor" /></button></footer></section>)}<BottomNav active="routines" /></main></Phone>;
}

function HistoryScreen() {
 return <Phone title="Workout history" kicker="05 — HISTORY"><main className="mobile-page history-page"><header className="title-header"><div><SmallLabel>TRAINING LOG</SmallLabel><h2>History</h2></div><button className="icon-button"><Settings2 size={18} /></button></header><HistoryGroup date="TODAY" items={[["Push Day", "6 exercises · 18 sets", "54 min"],["Mobility", "4 exercises · 8 sets", "18 min"]]} /><HistoryGroup date="AUG 15" items={[["Pull Day", "5 exercises · 16 sets", "48 min"]]} /><HistoryGroup date="AUG 12" items={[["Leg Day", "6 exercises · 20 sets", "1h 04m"]]} /><BottomNav active="history" /></main></Phone>;
}
function HistoryGroup({ date, items }: { date: string; items: string[][] }) { return <section className="history-group"><SmallLabel>{date}</SmallLabel>{items.map(([name, detail, time]) => <button className="history-row" key={name}><span className="history-icon"><Dumbbell size={18} /></span><span><b>{name}</b><small>{detail}</small></span><strong>{time}</strong><ChevronRight size={16} /></button>)}</section> }

function ProgressScreen() {
 return <Phone title="Bench Press Progress" kicker="06 — EXERCISE PROGRESS"><main className="mobile-page progress-page"><header className="mobile-header"><button className="icon-button"><ArrowLeft size={19} /></button><span className="brand-mark brand-mark--small">REP</span><button className="icon-button"><Ellipsis size={19} /></button></header><section className="progress-title"><SmallLabel>EXERCISE DETAIL</SmallLabel><h2>Bench Press</h2><p>Chest <span>•</span> Barbell</p></section><section className="summary"><div><SmallLabel>LATEST</SmallLabel><strong>62.5 <small>kg × 8</small></strong></div><div><SmallLabel>BEST WEIGHT</SmallLabel><strong>65 <small>kg</small></strong></div></section><section className="progress-history"><SmallLabel>HISTORY</SmallLabel>{[["Aug 18", ["62.5 kg × 8", "62.5 kg × 8", "62.5 kg × 7"]],["Aug 15", ["60 kg × 8", "60 kg × 8", "60 kg × 7"]],["Aug 11", ["57.5 kg × 10", "57.5 kg × 9", "57.5 kg × 8"]]].map(([date, sets]) => <div className="progress-entry" key={date as string}><time>{date as string}</time><div>{(sets as string[]).map((set, setIndex) => <span key={`${date}-${setIndex}`}>{set}</span>)}</div></div>)}</section><BottomNav active="exercises" /></main></Phone>;
}

function Board() {
  return <div className="board">
    <header className="board-header">
      <div className="board-brand"><span>REP</span><i /> <p>TRAINING LOG / PRODUCT STUDY</p></div>
      <div className="board-note">A system for <b>precision under pressure</b></div>
      <div className="board-index">01—06</div>
    </header>
    <section className="board-intro">
      <div className="intro-copy"><p className="eyebrow">MOBILE APP CONCEPT / 2026</p><h1>Log the lift.<br /><em>Keep the flow.</em></h1><p>A dark-first workout tracker designed around the few focused seconds between sets.</p></div>
      <aside className="design-brief"><span className="design-brief__dot" /><div><b>DESIGNED FOR THE FLOOR</b><p>Offline-first · one-hand usable · distraction-free</p></div></aside>
    </section>
    <div className="screen-rail"><span>CORE APP FLOWS</span><div /><span>390 × 844</span></div>
    <section className="phones"><HomeScreen /><ActiveScreen /><SelectorScreen /><RoutinesScreen /><HistoryScreen /><ProgressScreen /></section>
    <footer className="board-footer"><span>REP / GYM LOGGING SYSTEM</span><span>6 CORE SCREENS · OFFLINE FIRST</span><span>V1.0 / 2026</span></footer>
  </div>
}

export const router = createBrowserRouter([{ path: "*", Component: Board }]);
