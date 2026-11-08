# Retrace My Steps

A React app that helps you find something you've lost. It asks one small question at a time,
rebuilds the journey you took since you last had the item, and ranks the places to look first.

**Live app:** https://lakshya-aran.github.io/retrace-app/

## How it works

The questions follow how people actually lose things: on autopilot, while distracted,
on the day a habit breaks, or with a memory that is really from another day.

1. **What did you lose, and how do you usually carry it?** Habit decides where things slip out
   or get put down. The item also decides later questions (a phone gets "Is tracking on?").
2. **Quick checks.** Obvious places for that item. Anything unchecked goes on your to-do list.
3. **Last seen, and how sure.** Did you see it, use it, or are you just assuming? If you're assuming,
   it also asks where you were *before*, because it may never have left there.
4. **Journey, stop by stop.** How you travelled, what you did at each place, then a follow-up
   for each thing you did ("Where exactly did you put it down?", "How did you pay?",
   "Did you get it back?", "Did you unplug it?"). After each stop: "Did you still have it when you left?"
   That narrows the window between the last time you surely had it and when you noticed it gone.
5. **About you.** State of mind (rushed, on a call, tired, with kids), what was different from your
   routine (another bag, a 'safe' spot), who could have moved it, and what else is missing.
6. **Plan.** The search window, places ranked by likelihood (a payment record counts as proof
   you still had it), why the moment feels blank, signs it may have been taken, places people miss
   at home, a "Do these now" checklist and a description to copy into lost-and-found forms.

## Run it

```bash
npm install
npm run dev
```

Then open http://127.0.0.1:5173/retrace-app/.

## Project layout

```
src/
  data/knowledge.js        questions, answer options, scores and advice
  engine/nextQuestion.js   picks the next question from the answers so far
  engine/plan.js           ranks places, builds to-dos and the copyable description
  engine/helpers.js
  hooks/useRetrace.js      answers, undo history, saved progress
  components/              QuestionCard, Trail, Plan, MemoryTips
```

To add an item or a question, edit the tables in `src/data/knowledge.js`; the components don't need to change.
