import { useEffect, useRef, useState } from 'react';
import { PHASES, PLACES } from '../data/knowledge.js';
import MemoryTips from './MemoryTips.jsx';

// Renders whatever question the engine picked. Remounted per question (key=id) so local state resets.
export default function QuestionCard({ question: q, onAnswer, onExtra }) {
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  const phase = PHASES.find((p) => p[0] === q.phase)?.[1];

  return (
    <section className="card rise">
      <p className="eyebrow">{phase}</p>
      <h2 ref={heading} tabIndex={-1}>{q.title}</h2>
      {q.hint && <p className="hint">{q.hint}</p>}

      {q.type === 'choice' && <Choice q={q} onAnswer={onAnswer} />}
      {q.type === 'multi' && <Multi q={q} onAnswer={onAnswer} />}
      {q.type === 'text' && <TextAnswer q={q} onAnswer={onAnswer} />}
      {q.type === 'place' && <PlaceAnswer q={q} onAnswer={onAnswer} onExtra={onExtra} />}

      {q.tips && <MemoryTips />}
    </section>
  );
}

function Choice({ q, onAnswer }) {
  return (
    <div className="opts">
      {q.options.map((o) => (
        <button key={o.v} type="button" className="opt" onClick={() => onAnswer(o.v)}>{o.l}</button>
      ))}
    </div>
  );
}

function Multi({ q, onAnswer }) {
  const [picked, setPicked] = useState([]);
  const toggle = (v) => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  return (
    <>
      <div className="opts">
        {q.options.map((o) => (
          <button key={o.v} type="button" className="opt" aria-pressed={picked.includes(o.v)} onClick={() => toggle(o.v)}>{o.l}</button>
        ))}
      </div>
      <div className="row">
        <button type="button" className="btn primary" disabled={!q.allowNone && !picked.length} onClick={() => onAnswer(picked)}>Continue</button>
        {q.allowNone && <span className="note">Nothing ticked? That's fine, just continue.</span>}
      </div>
    </>
  );
}

function TextAnswer({ q, onAnswer }) {
  const [text, setText] = useState('');
  const submit = () => onAnswer(text.trim());
  return (
    <>
      <div className="field">
        <input id="ans-text" type="text" autoComplete="off" value={text} placeholder={q.placeholder || ''}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      </div>
      <div className="row">
        <button type="button" className="btn primary" onClick={submit}>Continue</button>
        {q.skip && <button type="button" className="btn ghost" onClick={() => onAnswer('')}>Skip</button>}
      </div>
    </>
  );
}

function PlaceAnswer({ q, onAnswer, onExtra }) {
  const [kind, setKind] = useState(null);
  const [name, setName] = useState('');
  const ready = kind || name.trim();
  const submit = () => ready && onAnswer({ kind: kind || 'other', name: name.trim() });
  return (
    <>
      <div className="opts">
        {PLACES.map((p) => (
          <button key={p.v} type="button" className="opt" aria-pressed={kind === p.v} onClick={() => setKind(p.v)}>{p.l}</button>
        ))}
      </div>
      <div className="field">
        <label htmlFor="ans-name">Name or landmark (optional)</label>
        <input id="ans-name" type="text" autoComplete="off" value={name} placeholder="e.g. Chai Point near Sector 18 metro"
          onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      </div>
      <div className="row">
        <button type="button" className="btn primary" disabled={!ready} onClick={submit}>Add this place</button>
      </div>
      {q.extras && (
        <div className="extras">
          {q.extras.map((x) => (
            <button key={x.l} type="button" className={`btn ${x.primary ? '' : 'ghost'}`} onClick={() => onExtra(x)}>{x.l}</button>
          ))}
        </div>
      )}
    </>
  );
}
