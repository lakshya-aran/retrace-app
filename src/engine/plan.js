import { VEH, DIDW, DIDL, PLACE_ADVICE, WHENL } from '../data/knowledge.js';
import { placeName, itemName, uncheckedChecks } from './helpers.js';

/** Rank every stop and every leg of the journey by how likely the item is there. */
export function rankPlaces(S) {
  const out = [];
  const unchecked = uncheckedChecks(S).length;

  S.stops.forEach((s, i) => {
    const prev = S.stops[i - 1];

    // The leg that led to this stop (walk / cab / bus …)
    if (i > 0 && s.via) {
      const V = VEH[s.via];
      const sc = V.w + ((prev.did || []).includes('rush') ? 1 : 0);
      out.push({
        key: `leg-${i}`,
        title: `${V.short} from ${placeName(prev)} to ${placeName(s)}`,
        why: [
          V.veh ? 'Things often slip out onto seats and floors during a ride.' : 'You were moving and may have dropped it on the way.',
          s.viaNote ? `You noted: "${s.viaNote}"` : '',
        ].filter(Boolean).join(' '),
        todo: V.advice,
        score: sc,
      });
    }

    // The stop itself
    const did = s.did || [];
    let sc = i === 0 ? (S.when === 'unsure' ? 3 : 5) : 0;
    did.forEach((d) => { sc += DIDW[d] || 0; });
    if (s.isNow) sc += unchecked ? 2 : -1;
    if (s.isNow && i > 0 && sc <= 0) return;

    const reasons = [];
    if (i === 0) reasons.push('This is the last place you were sure you had it.');
    const strong = did.filter((d) => DIDW[d] >= 2).map((d) => DIDL[d].toLowerCase());
    if (strong.length) reasons.push(`You ${strong.join(', ')}.`);
    if (s.isNow && unchecked) reasons.push(`You still have ${unchecked} quick check${unchecked > 1 ? 's' : ''} left to do here.`);
    if (s.kind === 'gap') reasons.push('A gap in the timeline. Filling it in may reveal the spot.');

    out.push({
      key: `stop-${i}`,
      title: s.isNow ? `Right here (${placeName(s)})` : placeName(s),
      why: reasons.join(' ') || 'You passed through here.',
      todo: s.isNow
        ? 'Search slowly, one surface at a time. Look in places it "couldn\'t" be: fridge, laundry, under the bed.'
        : PLACE_ADVICE[s.kind] || PLACE_ADVICE.other,
      score: sc,
    });
  });

  return out
    .sort((a, b) => b.score - a.score)
    .map((c) => ({ ...c, level: c.score >= 7 ? 'hi' : c.score >= 4 ? 'mid' : 'lo' }));
}

/** Immediate to-dos. Each is { text, links?: [{ href, label }] } */
export function buildActions(S) {
  const a = [];
  const x = S.extra || {};
  const add = (text, links) => a.push({ text, links });

  uncheckedChecks(S).forEach((c) => add(`Not done yet: ${c.l}`));

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

  add('Start with place #1 while staff, CCTV footage and your memory are fresh.');
  return a;
}

/** Plain-text description to paste into lost & found forms or support chats. */
export function reportText(S) {
  const lines = [`LOST ITEM: ${itemName(S)}`];
  if (S.desc) lines.push(`Description: ${S.desc}`);
  if (S.when) lines.push(`Last had: ${WHENL[S.when]}${S.anchor ? ` (${S.anchor})` : ''}`);
  lines.push('', 'Route:');
  S.stops.forEach((s, i) => {
    if (i > 0 && s.via) lines.push(`   ↓ ${VEH[s.via].l}${s.viaNote ? ` — ${s.viaNote}` : ''}`);
    lines.push(`${i + 1}. ${placeName(s)}${s.isNow ? ' (current location)' : ''}`);
  });
  lines.push('', 'Contact: ____________________');
  return lines.join('\n');
}
