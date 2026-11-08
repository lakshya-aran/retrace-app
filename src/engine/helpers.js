import { ITEMS, PLACES, COMMON_CHECKS } from '../data/knowledge.js';

export const freshState = () => ({ item: null, stops: [], extra: {} });

export const placeName = (p) => {
  if (!p) return '';
  if (p.name) return p.name;
  if (p.kind === 'gap') return "A stop I can't recall";
  return PLACES.find((x) => x.v === p.kind)?.l || 'Somewhere';
};

export const itemName = (S) =>
  S.item === 'other' ? S.itemName || 'Item' : ITEMS[S.item]?.l || 'Item';

// "Wallet / purse" -> "wallet", used inside sentences
export const itemWord = (S) => itemName(S).toLowerCase().split(' /')[0];

export const allChecks = (S) => (S.item ? [...ITEMS[S.item].checks, ...COMMON_CHECKS] : []);

export const uncheckedChecks = (S) =>
  S.checks ? allChecks(S).filter((c) => !S.checks.includes(c.v)) : [];
