import { useState } from 'react';
import { useRetrace } from './hooks/useRetrace.js';
import { PHASES, ITEM_QS } from './data/knowledge.js';
import QuestionCard from './components/QuestionCard.jsx';
import Trail from './components/Trail.jsx';
import Plan from './components/Plan.jsx';

export default function App() {
  const r = useRetrace();
  const { state, question } = r;
  const current = question ? question.phase : 'plan';
  const curIdx = PHASES.findIndex((p) => p[0] === current);
  const [confirmReset, setConfirmReset] = useState(false);

  const onReset = () => {
    if (!confirmReset) { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 3000); return; }
    setConfirmReset(false);
    r.reset();
  };

  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">
          <h1>Retrace My Steps</h1>
          <p>Lost something and your mind's gone blank? Answer one small question at a time. We'll rebuild where you've been and tell you where to look first.</p>
        </div>
        <div className="tools">
          <button type="button" className="btn ghost" disabled={!r.canGoBack} onClick={r.back}>← Back</button>
          <button type="button" className={`btn ghost ${confirmReset ? 'warn' : ''}`} onClick={onReset}>
            {confirmReset ? 'Tap again to clear' : 'Start over'}
          </button>
        </div>
      </header>

      <ol className="phases">
        {PHASES.map((p, i) => {
          if (p[0] === 'details' && !ITEM_QS[state.item]) return null;
          return <li key={p[0]} className={i < curIdx ? 'done' : i === curIdx ? 'on' : ''}>{p[1]}</li>;
        })}
      </ol>

      <div className="grid">
        <main>
          {question
            ? <QuestionCard key={question.id} question={question} onAnswer={r.answer} onExtra={r.pickExtra} />
            : <Plan state={state} />}
        </main>
        <Trail state={state} onExample={r.loadExample} />
      </div>
    </div>
  );
}
