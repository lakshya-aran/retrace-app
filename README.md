# Retrace My Steps

A React app that helps you find something you've lost. It asks one small question at a time,
rebuilds the journey you took since you last had the item, and ranks the places to look first.

## How it works

1. **What did you lose?** The item decides which follow-up questions come later
   (a phone gets "Is tracking on?", a wallet gets "What was inside?").
2. **Quick checks.** Obvious places to look for that item. Anything unchecked goes on your to-do list.
3. **Last seen.** When and where you last *definitely* had it. If you can't remember, it asks for any
   moment you can picture and shows memory aids (UPI history, Google Maps Timeline, photos).
4. **Journey.** "After X, where did you go next?", repeated stop by stop: how you travelled
   (walk, cab, auto, bus, metro…) and what you did at each place.
5. **Plan.** Places and rides ranked by likelihood, with what to do at each, a "Do these now"
   checklist and a description you can copy into lost-and-found forms.

## Run it

```bash
npm install
npm run dev
```

Then open http://127.0.0.1:5173.

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
