import { VEH, DIDL, WHENL } from '../data/knowledge.js';
import { placeName, itemName } from '../engine/helpers.js';

// Right-hand panel: the lost-property tag plus the journey timeline built so far.
export default function Trail({ state: S, onExample }) {
  if (!S.item)
    return (
      <aside>
        <div className="card trail">
          <h3>Your trail</h3>
          <p className="empty">As you answer, the places you've been will line up here, from the last place you had it to where you are now.</p>
          <button type="button" className="btn" onClick={onExample}>See a worked example</button>
        </div>
      </aside>
    );

  const arrived = S.stops.length && S.stops[S.stops.length - 1].isNow;
  const rows = [];
  S.stops.forEach((s, i) => {
    if (i > 0 && s.via)
      rows.push(<li key={`l${i}`} className="leg">{VEH[s.via].l}{s.viaNote ? ` · ${s.viaNote}` : ''}</li>);
    const did = (s.did || []).filter((d) => d !== 'unsure' && d !== 'pass').map((d) => DIDL[d]).join(' · ');
    rows.push(
      <li key={`s${i}`} className={`${i === 0 ? 'first' : ''} ${s.isNow ? 'now' : ''}`}>
        <span className="pl">{placeName(s)}</span>
        {i === 0 && <span className="sub">Last had it here</span>}
        {s.isNow && <span className="sub">You are here now</span>}
        {did && <span className="sub">{did}</span>}
      </li>,
    );
  });
  if (S.now && !arrived) {
    if (S.stops.length) rows.push(<li key="gap" className="leg">…</li>);
    rows.push(
      <li key="now" className="now"><span className="pl">{placeName(S.now)}</span><span className="sub">You are here now</span></li>,
    );
  }

  return (
    <aside>
      <div className="tag" aria-label="Item tag">
        <div className="k">Lost</div>
        <div className="v">{itemName(S)}</div>
        {S.desc && <div className="d">{S.desc}</div>}
        <div className="meta">
          {S.when && <span>Last had: {WHENL[S.when]}</span>}
          {S.stops.length > 0 && <span>{S.stops.length} stop{S.stops.length > 1 ? 's' : ''}</span>}
        </div>
      </div>
      <div className="card trail">
        <h3>Your trail</h3>
        {rows.length ? <ol className="tl">{rows}</ol> : <p className="empty">Places will appear here as you answer.</p>}
      </div>
    </aside>
  );
}
