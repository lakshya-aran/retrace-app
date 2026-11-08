import { ITEMS, VEH, DID, WHEN, ITEM_QS } from '../data/knowledge.js';
import { placeName, itemWord, allChecks } from './helpers.js';

/**
 * The question engine.
 * Looks at everything answered so far and returns the single most relevant
 * next question, or null when there is enough to build a plan.
 *
 * A question is: { id, phase, type: 'choice'|'multi'|'text'|'place', title, hint,
 *   options?, extras?, skip?, allowNone?, tips?, set(draft, value) }
 * `set` writes the answer into a draft copy of state (see useRetrace).
 */
export function nextQuestion(S) {
  const it = itemWord(S);

  if (!S.item)
    return {
      id: 'item', phase: 'item', type: 'choice', title: 'What did you lose?',
      hint: "Start simple. We'll work out the rest together, one step at a time.",
      options: Object.entries(ITEMS).map(([v, o]) => ({ v, l: o.l })),
      set: (d, v) => { d.item = v; },
    };

  if (S.item === 'other' && S.itemName === undefined)
    return {
      id: 'itemName', phase: 'item', type: 'text', title: 'What is it?',
      placeholder: 'e.g. tiffin box, spectacles, charger',
      set: (d, v) => { d.itemName = v || 'Item'; },
    };

  if (S.desc === undefined)
    return {
      id: 'desc', phase: 'item', type: 'text', skip: true, title: `Describe the ${it} in a few words`,
      hint: 'Colour, brand, cover, stickers, anything that makes it yours. Staff will ask for this.',
      placeholder: 'e.g. black Samsung, cracked corner, blue cover',
      set: (d, v) => { d.desc = v; },
    };

  if (!S.checks)
    return {
      id: 'checks', phase: 'checks', type: 'multi', allowNone: true, title: 'First, the quick checks',
      hint: "Most lost things turn up close by. Tick the ones you've already done properly. We'll add the rest to your to-do list.",
      options: allChecks(S),
      set: (d, v) => { d.checks = v; },
    };

  if (!S.now)
    return {
      id: 'now', phase: 'last', type: 'place', title: 'Where are you right now?',
      hint: 'This is the end point of your trail.',
      set: (d, v) => { d.now = v; },
    };

  if (!S.when)
    return {
      id: 'when', phase: 'last', type: 'choice', title: `When are you sure you last had the ${it}?`,
      hint: 'Not when you think you lost it. The last moment you know it was with you.',
      options: WHEN,
      set: (d, v) => { d.when = v; },
    };

  // Can't remember the time -> ask for a mental picture instead, and show memory aids
  if (S.when === 'unsure' && S.anchor === undefined)
    return {
      id: 'anchor', phase: 'last', type: 'text', skip: true, tips: true,
      title: `What's the last moment you can picture the ${it}?`,
      hint: 'Any picture in your head is fine: paying at a counter, on the table at lunch, in your hand at the bus stop.',
      placeholder: 'e.g. I was holding it while paying for chai',
      set: (d, v) => { d.anchor = v; },
    };

  if (!S.stops.length)
    return {
      id: 'firstPlace', phase: 'last', type: 'place', title: 'Where were you at that moment?',
      hint: 'Pick the type of place, then add its name or a landmark if you know it.',
      extras: [{ l: 'Right here, where I am now', set: (d) => d.stops.push({ ...d.now, isNow: true }) }],
      set: (d, v) => { d.stops.push(v); },
    };

  // Walk the trail; ask for whatever is missing at each stop
  for (let i = 0; i < S.stops.length; i++) {
    const s = S.stops[i];
    const prev = S.stops[i - 1];

    if (i > 0 && s.via === undefined)
      return {
        id: `via-${i}`, phase: 'journey', type: 'choice',
        title: `How did you get from ${placeName(prev)} to ${placeName(s)}?`,
        hint: 'Vehicles are one of the most common places things get left behind.',
        options: Object.entries(VEH).map(([v, o]) => ({ v, l: o.l })),
        set: (d, v) => { d.stops[i].via = v; },
      };

    // Only public/hired vehicles get a "details" follow-up
    if (i > 0 && VEH[s.via].note && s.viaNote === undefined)
      return {
        id: `viaNote-${i}`, phase: 'journey', type: 'text', skip: true,
        title: `Anything you remember about that ${VEH[s.via].l.split(' (')[0].toLowerCase()} ride?`,
        hint: "Even a partial detail helps: the time, the app, the route number, the colour, part of the number plate, the driver's name.",
        placeholder: 'e.g. Uber around 2:15, white Dzire, plate ending 4821',
        set: (d, v) => { d.stops[i].viaNote = v; },
      };

    if ((!s.isNow || i === 0) && !s.did)
      return {
        id: `did-${i}`, phase: i === 0 ? 'last' : 'journey', type: 'multi',
        title: s.isNow ? 'Here, what have you done since you last had it?' : `At ${placeName(s)}, what happened?`,
        hint: 'Picture yourself walking in. Tick everything that comes back, even small things.',
        options: DID,
        set: (d, v) => { d.stops[i].did = v; },
      };
  }

  // Keep going forward in time until the user reaches where they are now
  const last = S.stops[S.stops.length - 1];
  if (!last.isNow)
    return {
      id: `next-${S.stops.length}`, phase: 'journey', type: 'place', tips: true,
      title: S.stops.length >= 10
        ? `That's a long trail. Where did you go after ${placeName(last)}?`
        : `After ${placeName(last)}, where did you go next?`,
      hint: 'Go forward in time, one stop at a time. Short stops count too: a shop, an ATM, a washroom.',
      extras: [
        { l: `I came straight here (${placeName(S.now)})`, primary: true, set: (d) => d.stops.push({ ...d.now, isNow: true }) },
        { l: "I can't remember this part", set: (d) => d.stops.push({ kind: 'gap', name: "A stop I can't recall" }) },
      ],
      set: (d, v) => { d.stops.push(v); },
    };

  // Item-specific follow-ups
  for (const q of ITEM_QS[S.item] || []) {
    if (S.extra[q.id] === undefined)
      return { ...q, phase: 'details', set: (d, v) => { d.extra[q.id] = v; } };
  }

  return null;
}
