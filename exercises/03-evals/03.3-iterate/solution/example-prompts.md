# 03.3: Example prompts (facilitator-prep)

> Berkun: *show one student's solution, not yours.* These are the fallback if the room is quiet during debrief. Facilitator-curated, not "the answer."

Each of the four below was scored against the 35-row gold set (18 deliberately ambiguous `h*` rows) on `claude-haiku-4-5`. Your students' winning prompts will look different and that's fine; what matters is that the discussion connects *what they did* to *why the score moved*.

---

## Example 1: Tightened category definitions (Easy track)

```
You triage GitHub issues into one of: bug, feature, question, docs, perf.

Definitions (use these, in this order, when an issue could fit two):
- bug: existing behavior is wrong, crashes, or regresses from a prior version.
- perf: code is correct but too slow, uses too much memory, or hits a quota.
- feature: a missing capability the user wants added.
- docs: the documentation is missing/wrong but the code itself is fine.
- question: the user is asking how to do something they haven't tried yet.

Tie-breaker: if it could plausibly be both a bug and a feature, prefer bug.
If it could be both docs and question, prefer question.

Reply by calling the classify_issue tool.
```

**Why it worked:**
- Definitions resolve the ambiguous cases the baseline misses (b5, f5).
- The explicit ordering ("when an issue could fit two") is doing the work. Without it, the model picks essentially at random on borderline rows.
- The two tie-breaker rules each fix one specific failing example category.

---

## Example 2: Hard-track few-shot from a failing row

```
You triage GitHub issues into one of: bug, feature, question, docs, perf.

Worked example (this is the *hardest* kind of case to judge correctly):

Title: "Memory grows unbounded when streaming large responses"
Body:  "We see RSS climb 50MB/min during a long stream. Eventually OOMs. Was fine in v1.x."
Category: perf
Why: the *behavior* is correct (it streams); the *resource cost* is the issue. That's the perf signal even when it sounds bug-y.

Reply by calling the classify_issue tool.
```

**Why it worked:**
- Picks one of the rows the baseline gets *wrong*, not one it already gets right. Including an easy example would just teach memorization; including a hard one tests whether the model can generalize the pattern.
- The "Why" line names the *signal* (cost vs. correctness). That's what transfers to other rows, not the surface words.
- One example, not five. Adding more pushes you toward overfitting the gold set.

---

## Example 3: Combined: definitions + tie-breaker + one hard few-shot

```
You triage GitHub issues into one of: bug, feature, question, docs, perf.

Definitions:
- bug: existing behavior is wrong or crashes.
- feature: a missing capability the user wants added.
- question: the user is asking how to do something.
- docs: docs are missing/wrong but code is fine.
- perf: code is correct but too slow or uses too much memory.

Tie-breaker: bug > feature when both fit.

One worked example (note this is a hard case):

Title: "Could we make the loader cache the manifest? It re-reads on every call."
Body:  "Re-reading is slow and the manifest never changes within a process."
Category: perf
Why: the user *frames* it as a feature ("could we make..."), but the underlying signal is "code is correct, just slow". That's perf.

Reply by calling the classify_issue tool.
```

**Why it worked:**
- Definitions + tie-breaker + one hard few-shot. Each addresses a different failure mode in the baseline.
- The few-shot shows that user *framing* and the correct *category* can disagree; this is the lesson the baseline misses most often.
- Resist adding a second few-shot. Overfitting risk shows up fast on a 30-row gold set.

---

## Example 4: Diagnose-then-target across three iterations

This is the prompt we landed on in the dress rehearsal. The point of this example is not the final prompt; it is the iteration arc.

```
You triage GitHub issues into one of: bug, feature, question, docs, perf.

Definitions:
- bug: existing behavior is wrong, crashes, hangs, or leaks resources (including memory leaks).
- feature: a capability the user wants that does not currently exist in the system.
- question: the user is asking for an answer or explanation about how the system works.
- docs: the user is asking for the documentation itself to be improved, corrected, or added.
- perf: code is correct and the capability exists, but it is too slow or too expensive at scale.

Tie-breakers (apply in order):
- If the user has checked the docs or source and confirmed the capability does not exist, it is a feature, even when phrased as "How do I..." or "Is there a way...".
- If the user is asking "how does X work?", "is this expected?", or "what is the value of X?" and would be satisfied by an answer, it is a question, even when they mention the docs are unclear or incomplete.
- A memory leak or unbounded resource growth is a bug, not perf.
- A timeout or failure caused by inefficient code is perf, not a bug.

Reply by calling the classify_issue tool.
```

Final score: ~94-98% `exactLabel` across runs (33-34 of 35), up from ~82-86% baseline. The remaining errors are on genuinely ambiguous rows (p3, h18) that flicker red/green on temperature=1.

**The iteration arc that produced this:**

| Iteration | Move | `exactLabel` | Gain | Cost |
|---|---|---|---|---|
| Baseline | bare two-line prompt | ~82-86% | --- | --- |
| 1 | append generic category definitions | ~82-86% | +0pp | none |
| 2 | targeted tie-breakers from observed failures (bug/perf boundary, "confirmed it doesn't exist" -> feature) | ~92-98% | +10pp | none |
| 3 | refine question/docs definitions by intent (wants answer vs wants docs updated) + tie-breaker | ~94-98% | +2pp | h18 flickers |

**Why it worked:**
- Iteration 1 failed and that is the lesson. Adding definitions the model already knows ("bug = wrong behavior") moves nothing. Without an eval, students would ship this thinking they had improved the prompt.
- Iteration 2 moved 6 specific rows by writing tie-breakers that matched the actual confusion patterns in the dashboard. b4 (memory leak labeled perf) -> "leaks are bugs". h3/h8/h13/h18 (feature dressed up as question) -> "user confirmed it doesn't exist".
- Iteration 3 was a tradeoff. The "leaning into docs/source language" from iteration 2 caused over-classification of q1/q5/h16 as `docs`. Tightening the question/docs boundary fixed those at the cost of one row (h18) becoming unstable.
- We stopped at iteration 3. Pushing further would have invited regression on rows we already fixed; the last error sits on a boundary the dataset itself does not resolve.

**Debrief use:**
- Walk the room through the table column by column. The 0pp gain on iteration 1 is the single most useful number on the slide.
- Ask: "Which row's reasoning made you change your prompt? Show me the dashboard entry." Force students to anchor every prompt edit to a specific observed failure.
- The p3 reasoning ("the model quoted my tie-breaker and overruled it") is the lesson that prompts shape priors, not rules. Models exercise judgment against explicit instructions when the case feels strong enough. You cannot fully constrain this.

---

## Debrief talking points

Use these to draw the lesson out of whatever prompt actually wins:

- "Which prompt change moved the score the most? Was it definitions, tie-breakers, or few-shot?"
- "Did anyone's score go *down* on a previously-passing example after they edited the prompt? That's overfitting; you traded one row for another."
- "If we ran this same prompt on 100 fresh issues, how confident are you the score would hold?"
