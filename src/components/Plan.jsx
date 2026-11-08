import { useMemo, useRef, useState } from 'react';
import { rankPlaces, buildActions, reportText } from '../engine/plan.js';
import { itemWord } from '../engine/helpers.js';

const LEVEL = { hi: 'Most likely', mid: 'Possible', lo: 'Less likely' };

export default function Plan({ state }) {
  const places = useMemo(() => rankPlaces(state), [state]);
  const actions = useMemo(() => buildActions(state), [state]);
  const report = useMemo(() => reportText(state), [state]);
  const [done, setDone] = useState({});
  const [copyMsg, setCopyMsg] = useState('');
  const box = useRef(null);

  const copy = () => {
    const fallback = () => { box.current.select(); setCopyMsg('Selected. Press Ctrl+C (or long-press) to copy.'); };
    try { navigator.clipboard.writeText(report).then(() => setCopyMsg('Copied.'), fallback); } catch { fallback(); }
  };

  return (
    <section className="card rise">
      <p className="eyebrow">Your plan</p>
      <h2>Where to look for your {itemWord(state)}</h2>
      <p className="lead">Based on your answers, here are the places in the order to check them. The ones where you took it out, put it down or got into a vehicle come first.</p>

      <ol className="cands">
        {places.map((p, i) => (
          <li key={p.key} className="cand">
            <span className="rank">{i + 1}</span>
            <div className="t">{p.title}<span className={`pill ${p.level}`}>{LEVEL[p.level]}</span></div>
            <div className="why">{p.why}</div>
            <div className="do">{p.todo}</div>
          </li>
        ))}
      </ol>

      <h3 className="sec">Do these now</h3>
      <ul className="todo">
        {actions.map((a, i) => (
          <li key={i}>
            <label>
              <input type="checkbox" checked={!!done[i]} onChange={() => setDone((d) => ({ ...d, [i]: !d[i] }))} />
              <span>
                {a.text}
                {a.links?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"> {l.label} ↗</a>
                ))}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <h3 className="sec">Ready-to-send description</h3>
      <p className="note">Paste this into a lost-and-found form, a message to a café or a cab support chat.</p>
      <textarea ref={box} readOnly value={report} />
      <div className="row">
        <button type="button" className="btn primary" onClick={copy}>Copy description</button>
        <span className="note" aria-live="polite">{copyMsg}</span>
      </div>
    </section>
  );
}
