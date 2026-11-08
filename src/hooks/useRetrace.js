import { useEffect, useMemo, useState } from 'react';
import { nextQuestion } from '../engine/nextQuestion.js';
import { freshState } from '../engine/helpers.js';
import { EXAMPLE } from '../data/knowledge.js';

const KEY = 'retrace-v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      return { state: d.state || freshState(), history: d.history || [] };
    }
  } catch { /* storage blocked or corrupt: start fresh */ }
  return { state: freshState(), history: [] };
}

/** Holds the answers, an undo history, and the current question. */
export function useRetrace() {
  const [{ state, history }, setStore] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ state, history: history.slice(-60) })); } catch { /* ignore */ }
  }, [state, history]);

  const question = useMemo(() => nextQuestion(state), [state]);

  // Apply a mutation to a deep copy so React sees a new object
  const commit = (mutate) =>
    setStore(({ state: s, history: h }) => {
      const draft = structuredClone(s);
      mutate(draft);
      return { state: draft, history: [...h, s] };
    });

  return {
    state,
    question,
    canGoBack: history.length > 0,
    answer: (value) => commit((d) => question.set(d, value)),
    pickExtra: (extra) => commit((d) => extra.set(d)),
    back: () => setStore(({ state: s, history: h }) => (h.length ? { state: h[h.length - 1], history: h.slice(0, -1) } : { state: s, history: h })),
    reset: () => setStore({ state: freshState(), history: [] }),
    loadExample: () => setStore(({ state: s, history: h }) => ({ state: structuredClone(EXAMPLE), history: [...h, s] })),
  };
}
