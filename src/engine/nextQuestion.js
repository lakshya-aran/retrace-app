import {
  ITEMS, VEH, DID, WHEN, ITEM_QS, CARRY, SURE, STILL, FOLLOWUPS, MIND, ROUTINE, OTHERS, ALSO_MISSING,
} from '../data/knowledge.js';
import { placeName, itemWord, allChecks, noticedIndex } from './helpers.js';

/**
 * The question engine.
 * Looks at everything answered so far and returns the single most relevant
 * next question, or null when there is enough to build a plan.
 *
 * A question is: { id, phase, type: 'choice'|'multi'|'text'|'place', title, hint,
 *   options?, extras?, skip?, allowNone?, tips?, set(draft, value) }
 * `set` writes the answer into a draft copy of state (see useRetrace).
 *
 * The order follows how memory works: what it is and how you carry it (habit),
 * the last moment you're sure of (and how sure), then forward in time stop by stop,
 * digging into each thing you did, and checking after each stop whether you still had it.
 */
export function nextQuestion(S) {
  const it = itemWord(S);

  /* ---- The item ---- */
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

  if (!S.carry)
    return {
      id: 'carry', phase: 'item', type: 'choice', title: `Where do you usually keep the ${it} when you're out?`,
      hint: "When we're not paying attention, our hands follow habit. This tells us where it was most likely to slip out or be put down.",
      options: CARRY,
      set: (d, v) => { d.carry = v; },
    };

  if (!S.checks)
    return {
      id: 'checks', phase: 'checks', type: 'multi', allowNone: true, title: 'First, the quick checks',
      hint: "Most lost things turn up close by. Tick the ones you've already done properly. We'll add the rest to your to-do list.",
      options: allChecks(S),
      set: (d, v) => { d.checks = v; },
    };

  /* ---- The last moment you're sure of ---- */
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

  if (S.when !== 'unsure' && !S.sure)
    return {
      id: 'sure', phase: 'last', type: 'choice', title: 'How do you know you had it then?',
      hint: 'We often "remember" having something just because we usually carry it. Be honest; it changes where we look.',
      options: SURE,
      set: (d, v) => { d.sure = v; },
    };

  // Can't remember the time -> ask for a mental picture instead, and show memory aids
  if (S.when === 'unsure' && S.anchor === undefined)
    return {
      id: 'anchor', phase: 'last', type: 'text', skip: true, tips: true,
      title: `What's the last moment you can picture the ${it}?`,
      hint: 'Any picture in your head is fine: paying at a counter, on the table at lunch, in your hand at the bus stop.',
      placeholder: 'e.g. I was holding it while paying for chai',
      set: (d, v) => { d.anchor = v; d.sure = 'assumed'; },
    };

  if (!S.stops.length)
    return {
      id: 'firstPlace', phase: 'last', type: 'place', title: 'Where were you at that moment?',
      hint: 'Pick the type of place, then add its name or a landmark if you know it.',
      extras: [{ l: 'Right here, where I am now', set: (d) => d.stops.push({ ...d.now, isNow: true, f: {} }) }],
      set: (d, v) => { d.stops.push({ ...v, f: {} }); },
    };

  // Only assuming? It may never have left the place before.
  if (S.sure === 'assumed' && S.before === undefined)
    return {
      id: 'before', phase: 'last', type: 'place',
      title: `Before ${placeName(S.stops[0])}, where were you?`,
      hint: "Since you're not certain you had it there, it may have stayed at the place before. Often that's home.",
      extras: [{ l: 'Skip this', set: (d) => { d.before = null; } }],
      set: (d, v) => { d.before = v; },
    };

  /* ---- The journey: walk the trail, ask whatever is missing at each stop ---- */
  for (let i = 0; i < S.stops.length; i++) {
    const s = S.stops[i];
    const prev = S.stops[i - 1];
    const p = placeName(s);

    if (i > 0 && s.via === undefined)
      return {
        id: `via-${i}`, phase: 'journey', type: 'choice',
        title: `How did you get from ${placeName(prev)} to ${p}?`,
        hint: 'Getting in and out of vehicles is one of the most common moments things get left behind.',
        options: Object.entries(VEH).map(([v, o]) => ({ v, l: o.l })),
        set: (d, v) => { d.stops[i].via = v; },
      };

    // Only public or hired vehicles get a "details" follow-up
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
        title: s.isNow ? 'Here, what have you done since you last had it?' : `At ${p}, what happened?`,
        hint: 'Picture yourself walking in: who was there, what you heard, what you were thinking about. Tick everything that comes back, even small things.',
        options: DID,
        set: (d, v) => { d.stops[i].did = v; },
      };

    // Dig into each thing they did there
    const f = s.f || {};
    for (const d of DID) {
      const fu = FOLLOWUPS[d.v];
      if (fu && (s.did || []).includes(d.v) && f[d.v] === undefined)
        return {
          id: `f-${d.v}-${i}`, phase: i === 0 ? 'last' : 'journey', type: 'choice',
          title: fu.title(p), hint: fu.hint, options: fu.options,
          set: (dr, v) => { dr.stops[i].f = { ...(dr.stops[i].f || {}), [d.v]: v }; },
        };
    }

    // Narrow the window: did it leave with you?
    if (!s.isNow && s.still === undefined)
      return {
        id: `still-${i}`, phase: i === 0 ? 'last' : 'journey', type: 'choice',
        title: `When you left ${p}, did you still have the ${it}?`,
        hint: 'Think of the next time you would have touched, used or felt it: checking the time, paying, feeling its weight in your pocket.',
        options: STILL,
        set: (dr, v) => { dr.stops[i].still = v; },
      };
  }

  // Keep going forward in time until where they are now, or until they noticed it missing
  const last = S.stops[S.stops.length - 1];
  if (!last.isNow && noticedIndex(S) < 0)
    return {
      id: `next-${S.stops.length}`, phase: 'journey', type: 'place', tips: true,
      title: S.stops.length >= 10
        ? `That's a long trail. Where did you go after ${placeName(last)}?`
        : `After ${placeName(last)}, where did you go next?`,
      hint: 'Go forward in time, one stop at a time. Short stops count too: a shop, an ATM, a washroom, waiting at a signal.',
      extras: [
        { l: `I came straight here (${placeName(S.now)})`, primary: true, set: (d) => d.stops.push({ ...d.now, isNow: true, f: {} }) },
        { l: "I can't remember this part", set: (d) => d.stops.push({ kind: 'gap', name: "A stop I can't recall", f: {} }) },
      ],
      set: (d, v) => { d.stops.push({ ...v, f: {} }); },
    };

  /* ---- About you: the reasons a moment goes blank ---- */
  if (!S.mind)
    return {
      id: 'mind', phase: 'you', type: 'multi', title: 'How were you feeling during that time?',
      hint: 'When attention is elsewhere, the brain does not record where your hands put things. That is why the moment feels blank.',
      options: MIND,
      set: (d, v) => { d.mind = v; },
    };

  if (!S.routine)
    return {
      id: 'routine', phase: 'you', type: 'multi', title: 'Was anything different from your usual routine?',
      hint: 'Habits keep things safe. Most things go missing on the day a habit is broken.',
      options: ROUTINE,
      set: (d, v) => { d.routine = v; },
    };

  if (!S.others)
    return {
      id: 'others', phase: 'you', type: 'multi', title: 'Who else could have picked it up or moved it?',
      hint: 'Someone tidying up, borrowing it or keeping it safe for you is very common.',
      options: OTHERS,
      set: (d, v) => { d.others = v; },
    };

  if (!S.alsoMissing)
    return {
      id: 'alsoMissing', phase: 'you', type: 'multi', title: 'Is anything else missing too?',
      hint: 'If several things are gone, they may be together in one bag, or they may have been taken.',
      options: ALSO_MISSING.filter((o) => o.v !== S.item),
      set: (d, v) => { d.alsoMissing = v; },
    };

  /* ---- Item-specific follow-ups ---- */
  for (const q of ITEM_QS[S.item] || []) {
    if (S.extra[q.id] === undefined)
      return { ...q, phase: 'details', set: (d, v) => { d.extra[q.id] = v; } };
  }

  return null;
}
