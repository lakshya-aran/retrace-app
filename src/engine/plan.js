import {
  VEH, DIDW, DIDL, PLACE_ADVICE, WHENL, FOLLOWUPS, DISTRACTED, HOME_SPOTS, CARRYL,
} from '../data/knowledge.js';
import { placeName, itemName, uncheckedChecks, noticedIndex, real } from './helpers.js';

const pick = (fid, v) => FOLLOWUPS[fid]?.options.find((o) => o.v === v);

/** A payment record at this stop proves the item was there (phone paid by UPI, wallet card/cash). */
function provenHere(S, s) {
  const pay = s.f?.pay;
  return (S.item === 'phone' && pay === 'upi') || (S.item === 'wallet' && (pay === 'card' || pay === 'cash'));
}

/**
 * The search window: which stops can be ruled out because you definitely
 * still had the item afterwards, and where you noticed it gone.
 */
export function searchWindow(S) {
  let leftWith = -1; // you still had it when leaving this stop
  let proven = -1;   // payment proves you had it at this stop
  S.stops.forEach((s, i) => {
    if (s.still === 'yes') leftWith = i;
    if (provenHere(S, s)) proven = i;
  });
  const noticed = noticedIndex(S);
  const clearedStop = Math.max(leftWith, proven - 1); // stops at or before this index are ruled out
  const clearedLeg = Math.max(leftWith, proven);      // legs into stops at or before this index are ruled out

  let from;
  if (leftWith >= 0 && leftWith >= proven) from = `after you left ${placeName(S.stops[leftWith])}`;
  else if (proven >= 0) from = `after you paid at ${placeName(S.stops[proven])}`;
  else if (S.stops.length) from = `from ${placeName(S.stops[0])}`;
  const to = noticed >= 0 ? `when you noticed at ${placeName(S.stops[noticed])}` : S.now ? `now, at ${placeName(S.now)}` : '';
  const narrowed = leftWith >= 0 || proven >= 0 || noticed >= 0;
  return { clearedStop, clearedLeg, noticed, proven, from, to, narrowed };
}

function factors(S) {
  const mind = real(S.mind);
  return {
    distracted: mind.some((m) => DISTRACTED.includes(m)),
    mind,
    routine: real(S.routine),
    others: real(S.others),
    also: real(S.alsoMissing),
  };
}

/** Rank every stop and every leg of the journey by how likely the item is there. */
export function rankPlaces(S) {
  const out = [];
  const unchecked = uncheckedChecks(S).length;
  const W = searchWindow(S);
  const F = factors(S);
  const careless = ['down', 'seat', 'remove', 'used', 'charge', 'hands', 'call', 'changing'];

  // Only assumed you had it? Then the place before is a real candidate.
  const hadItLater = W.clearedLeg >= 0;
  if (S.before)
    out.push({
      key: 'before', title: `${placeName(S.before)} (before you thought you had it)`,
      why: hadItLater
        ? 'You definitely had it later on, so it did leave here with you.'
        : 'You were only assuming you had it later. It may never have left here.',
      todo: PLACE_ADVICE[S.before.kind] || PLACE_ADVICE.other, score: hadItLater ? 0 : 5,
    });

  S.stops.forEach((s, i) => {
    const prev = S.stops[i - 1];
    const f = s.f || {};

    /* The leg that led to this stop */
    if (i > 0 && s.via) {
      const V = VEH[s.via];
      let sc = V.w;
      const why = [V.veh ? 'Things often slip out onto seats and floors during a ride.' : 'You were moving and may have dropped it on the way.'];
      if ((prev.did || []).includes('rush')) sc += 1;
      if (['pocket', 'jacket'].includes(S.carry) && V.veh && s.via !== 'own') { sc += 1; why.push('Pockets tip out when you sit in a vehicle.'); }
      if (i === W.noticed) { sc += 1; why.push('You noticed it gone right after this ride.'); }
      if (s.viaNote) why.push(`You noted: "${s.viaNote}"`);
      if (i <= W.clearedLeg) { sc = Math.min(sc, 1); why.unshift('You still had it after this, so it is unlikely.'); }
      out.push({ key: `leg-${i}`, title: `${V.short} from ${placeName(prev)} to ${placeName(s)}`, why: why.join(' '), todo: V.advice, score: sc });
    }

    /* The stop itself */
    const did = s.did || [];
    let sc = i === 0 ? (S.sure === 'assumed' ? 3 : 5) : 0;
    const why = [];
    let todo = null;
    if (i === 0) why.push(S.sure === 'assumed' && !hadItLater ? 'You think you had it here, but you are not certain.' : 'This is the last place you were sure you had it.');

    did.forEach((d) => { sc += DIDW[d] || 0; });
    const strong = did.filter((d) => DIDW[d] >= 2).map((d) => DIDL[d][0].toLowerCase() + DIDL[d].slice(1));
    if (strong.length) why.push(`You ${strong.join(', ')}.`);

    // Follow-up answers refine score and give specific advice
    Object.entries(f).forEach(([fid, v]) => {
      const o = pick(fid, v);
      if (!o) return;
      sc += o.w || 0;
      if (o.advice && (o.w || 0) > 0) todo = o.advice;
    });
    if (f.used === 'down') why.push('You think you put it down after using it.');
    if (f.handed === 'no' || f.handed === 'unsure') why.push("You're not sure you got it back from the person you handed it to.");
    if (f.charge === 'no') why.push('It may still be plugged in there.');

    if (F.distracted && did.some((d) => careless.includes(d))) { sc += 1; why.push('You were distracted, which is when things get put down "for a second".'); }
    if (S.carry === 'hand' && did.includes('down')) sc += 1;
    if (['pocket', 'jacket'].includes(S.carry) && did.includes('seat')) { sc += 1; why.push('Things slide out of pockets when you sit.'); }
    if (provenHere(S, s)) { sc += 1; why.push('Your payment here proves you had it at that moment.'); }

    if (s.still === 'unknown') sc += 1;
    if (s.still === 'gone') { sc += 2; why.push('You noticed it missing here, so it went missing here or on the way in.'); }
    if (s.kind === 'gap') why.push('A gap in the timeline. Filling it in may reveal the spot.');

    if (s.isNow) {
      sc += unchecked ? 2 : -1;
      if (unchecked) why.push(`You still have ${unchecked} quick check${unchecked > 1 ? 's' : ''} left to do here.`);
      if (F.routine.includes('safe')) { sc += 2; why.push("You put it somewhere 'safe' on purpose."); }
      if (F.others.some((o) => ['family', 'kids', 'pet'].includes(o))) { sc += 1; why.push('Someone at home may have moved it.'); }
    }

    const cleared = i <= W.clearedStop;
    if (cleared) { sc = Math.min(sc, 1); why.length = 0; why.push('You still had it after leaving, so it is unlikely to be here.'); }
    if (s.isNow && i > 0 && sc <= 0) return;

    out.push({
      key: `stop-${i}`,
      title: s.isNow ? `Right here (${placeName(s)})` : placeName(s),
      why: why.join(' ') || 'You passed through here.',
      todo: todo || (s.isNow
        ? 'Search slowly, one surface at a time. Look in places it "couldn\'t" be: fridge, laundry, under the bed.'
        : PLACE_ADVICE[s.kind] || PLACE_ADVICE.other),
      score: sc,
    });

    // The person it was handed to is a place of its own
    if (f.handed === 'no' || f.handed === 'unsure')
      out.push({
        key: `person-${i}`, title: `The person you handed it to at ${placeName(s)}`,
        why: cleared
          ? 'You still had it when you left, so you did get it back.'
          : 'Handing something over and not getting it back is easy to forget, for both of you.',
        todo: 'Message or call them and ask them to check their bag, pockets and car.',
        score: cleared ? 1 : f.handed === 'no' ? 7 : 4,
      });
  });

  return out
    .sort((a, b) => b.score - a.score)
    .map((c) => ({ ...c, level: c.score >= 7 ? 'hi' : c.score >= 4 ? 'mid' : 'lo' }));
}

/** Plain-language explanations of why the moment is blank and what that means for the search. */
export function insights(S) {
  const F = factors(S);
  const out = [];
  if (F.distracted)
    out.push({ title: 'Your attention was elsewhere', text: 'Rushing, calls, tiredness or stress mean your brain never recorded where your hands put it. That is normal. Search the surfaces you touched, not the places you remember choosing.' });
  if (S.sure === 'assumed' && searchWindow(S).clearedLeg < 0)
    out.push({ title: 'The memory may be from another day', text: 'When we always carry something, we "remember" having it even when we did not. It may have stayed at the place before, or at home.' });
  if (F.routine.includes('bag'))
    out.push({ title: 'You changed bags', text: 'Your hands put it where it usually goes. It may still be in your usual bag, or never made it into today\'s.' });
  if (F.routine.includes('clothes'))
    out.push({ title: 'You wore different clothes', text: 'Check the pockets of what you changed out of and what you wore yesterday.' });
  if (F.routine.includes('safe'))
    out.push({ title: "It's somewhere 'safe'", text: 'Things put away carefully are the hardest to find, because the spot was unusual. Think: a drawer, a top shelf, inside another bag, a box or a book.' });
  if (F.routine.includes('carried'))
    out.push({ title: 'Someone else carried your things', text: 'Ask them to check their bag and pockets. It may have been packed with their things.' });
  if (F.routine.includes('newplace') || F.routine.includes('route'))
    out.push({ title: 'Unfamiliar places break habits', text: 'In a new place you put things in new spots, and those are the ones you forget.' });
  if (F.mind.includes('drink') || F.mind.includes('tired') || F.mind.includes('unwell'))
    out.push({ title: 'Retrace with someone', text: 'Ask whoever was with you to go through the timeline. They may remember what you cannot.' });
  if (F.also.includes('bag') && S.item !== 'bag' && S.carry === 'bag')
    out.push({ title: 'Look for the bag first', text: `Your bag is missing too, and the ${itemName(S).toLowerCase()} was in it. Find the bag and you find both.` });
  return out;
}

/** Signs that the item may have been taken rather than lost. */
export function theftRisk(S) {
  const F = factors(S);
  const crowded = S.stops.some((s) => (s.did || []).includes('rush'));
  const reasons = [];
  if (F.also.length >= 2) reasons.push('several things are missing at once');
  else if (F.also.length === 1 && !(F.also.includes('bag') && S.carry === 'bag')) reasons.push('something else is missing too');
  if (crowded && ['pocket', 'jacket', 'bag'].includes(S.carry)) reasons.push(`it was crowded and you carry it in your ${CARRYL[S.carry].toLowerCase()}`);
  return reasons.length >= 1 && (F.also.length > 0 || reasons.length >= 2) ? reasons : [];
}

/** Places people miss when the item may be at home. */
export function homeSpots(S) {
  const atHome = (S.now?.kind === 'home') || S.stops.some((s) => s.kind === 'home') || S.before?.kind === 'home';
  if (!atHome) return [];
  return [...(HOME_SPOTS[S.item] || []), ...HOME_SPOTS.common];
}

/** Immediate to-dos. Each is { text, links?: [{ href, label }] } */
export function buildActions(S) {
  const a = [];
  const x = S.extra || {};
  const F = factors(S);
  const W = searchWindow(S);
  const add = (text, links) => a.push({ text, links });

  uncheckedChecks(S).forEach((c) => add(`Not done yet: ${c.l}`));

  if (S.stops.some((s) => s.f?.shopping === 'no')) add('Empty every shopping bag and parcel completely, including boxes and receipts.');
  if (W.proven >= 0) add(`Open your payment history: the exact time you paid at ${placeName(S.stops[W.proven])} shows you still had it then.`);

  F.others.forEach((o) => {
    if (o === 'family') add('Ask everyone at home if they moved, borrowed or tidied it away.');
    if (o === 'kids') add("Check kids' rooms, toy boxes and school bags.");
    if (o === 'friend') add('Ask the person you were with to check their bag, car and pockets.');
    if (o === 'colleagues') add('Ask the people who sit near you at work or class.');
    if (o === 'pet') add('Look under furniture and in pet beds.');
  });
  if (F.routine.includes('bag')) add('Check the bag you usually carry, and the one you used today.');

  if (S.item === 'phone') {
    add('Ask someone to keep calling your phone while you search. Someone who finds it will often answer.');
    if (x.track === 'android') add('Ring it, even on silent, from Google Find My Device on another phone or laptop.', [{ href: 'https://www.google.com/android/find', label: 'Find My Device' }]);
    if (x.track === 'iphone') add('Mark it as lost in iCloud Find My so it shows your contact number.', [{ href: 'https://www.icloud.com/find', label: 'iCloud Find My' }]);
    if (x.track === 'unsure') add('Try both tracking services.', [{ href: 'https://www.google.com/android/find', label: 'Find My Device' }, { href: 'https://www.icloud.com/find', label: 'iCloud Find My' }]);
    add('If it is not back in a few hours: block the SIM with your carrier and report the IMEI on CEIR (India).', [{ href: 'https://www.ceir.gov.in', label: 'CEIR' }]);
  }

  if (['wallet', 'bag', 'docs'].includes(S.item)) {
    const c = x.contents || [];
    const w = x.which || [];
    if (c.includes('cards')) add('Freeze or block your cards from your bank app now. You can unfreeze them if it turns up.');
    if (c.includes('aadhaar') || w.includes('aadhaar')) add('Lock your Aadhaar biometrics to prevent misuse.', [{ href: 'https://myaadhaar.uidai.gov.in', label: 'myAadhaar' }]);
    if (c.includes('transit')) add('Ask the metro customer-care counter to block your transit card and move the balance.');
    if (c.includes('laptop')) add('Use Find My or Windows "Find my device" to see if the laptop is online.');
    if (c.includes('keys')) add('Keys were in it: think about whether your locks need changing.');
    if (S.item === 'docs' || ['aadhaar', 'licence', 'pan'].some((k) => c.includes(k)) || w.length)
      add('File a lost-document report with the police (many states allow it online). You will need the report number for duplicates.');
  }

  if (S.item === 'laptop') {
    if (x.track === 'mac') add('Mark the device as lost in iCloud Find My.', [{ href: 'https://www.icloud.com/find', label: 'iCloud Find My' }]);
    if (x.track === 'win') add('Open Microsoft account → Devices → Find my device.', [{ href: 'https://account.microsoft.com/devices', label: 'Microsoft devices' }]);
    add('Change passwords for email and banking if you stay logged in on it.');
  }

  if (S.item === 'earbuds') {
    if (x.kind === 'airpods') add('Open Find My on your iPhone and play a sound on the AirPods.');
    if (x.kind === 'galaxy') add('Use SmartThings Find in the SmartThings app to ring the buds.');
    if (x.kind === 'pixel') add('Use Find My Device on your phone to ring the buds.');
    add('Walk around each place with Bluetooth on. When your phone reconnects, you are within about 10 metres.');
  }

  if (S.item === 'keys') {
    if (x.tag === 'yes') add('Your keys carry your address. Plan to change or rekey the lock if they do not turn up today.');
    if (x.tag === 'vehicle') add('Contact your vehicle dealer for a spare key or to reprogramme the lost one.');
  }

  if (['bottle', 'wear', 'jewel', 'other'].includes(S.item))
    add('Ask cleaning and housekeeping staff. They collect things like this at the end of each shift.');

  if (theftRisk(S).length) add('If you think it was taken, file a police complaint. Many states accept an online e-FIR for lost or stolen items.');

  add('Start with place #1 while staff, CCTV footage and your memory are fresh.');
  return a;
}

/** Plain-text description to paste into lost & found forms or support chats. */
export function reportText(S) {
  const W = searchWindow(S);
  const lines = [`LOST ITEM: ${itemName(S)}`];
  if (S.desc) lines.push(`Description: ${S.desc}`);
  if (S.carry) lines.push(`Usually carried: ${CARRYL[S.carry]}`);
  if (S.when) lines.push(`Last had: ${WHENL[S.when]}${S.anchor ? ` (${S.anchor})` : ''}`);
  if (W.narrowed && W.from) lines.push(`Went missing: ${W.from}, before ${W.to}`);
  lines.push('', 'Route:');
  if (S.before) lines.push(`0. ${placeName(S.before)} (earlier)`);
  S.stops.forEach((s, i) => {
    if (i > 0 && s.via) lines.push(`   ↓ ${VEH[s.via].l}${s.viaNote ? ` — ${s.viaNote}` : ''}`);
    lines.push(`${i + 1}. ${placeName(s)}${s.isNow ? ' (current location)' : ''}${s.still === 'gone' ? ' (noticed missing here)' : ''}`);
  });
  lines.push('', 'Contact: ____________________');
  return lines.join('\n');
}
