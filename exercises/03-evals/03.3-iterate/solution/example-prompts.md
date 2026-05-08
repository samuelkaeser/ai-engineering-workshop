# 03.3 — Example prompts (facilitator-prep)

> Berkun: *show one student's solution, not yours.* These are the fallback if the room is quiet during debrief — facilitator-curated, not "the answer."

Each of the three below scored ~0.90 on `exactLabel` against the default 30-row gold set on `claude-haiku-4-5`. Your students' winning prompts will look different and that's fine; what matters is that the discussion connects *what they did* to *why the score moved*.

---

## Example 1 — Tightened category definitions (Easy track)

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
- The explicit ordering ("when an issue could fit two") is doing the work — without it, the model picks essentially at random on borderline rows.
- The two tie-breaker rules each fix one specific failing example category.

---

## Example 2 — Hard-track few-shot from a failing row

```
You triage GitHub issues into one of: bug, feature, question, docs, perf.

Worked example (this is the *hardest* kind of case to judge correctly):

Title: "Memory grows unbounded when streaming large responses"
Body:  "We see RSS climb 50MB/min during a long stream. Eventually OOMs. Was fine in v1.x."
Category: perf
Why: the *behavior* is correct (it streams) — the *resource cost* is the issue. That's the perf signal even when it sounds bug-y.

Reply by calling the classify_issue tool.
```

**Why it worked:**
- Picks one of the rows the baseline gets *wrong*, not one it already gets right. Including an easy example would just teach memorization; including a hard one tests whether the model can generalize the pattern.
- The "Why" line names the *signal* (cost vs. correctness) — that's what transfers to other rows, not the surface words.
- One example, not five. Adding more pushes you toward overfitting the gold set.

---

## Example 3 — Combined: definitions + tie-breaker + one hard few-shot

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
Why: the user *frames* it as a feature ("could we make..."), but the underlying signal is "code is correct, just slow" — that's perf.

Reply by calling the classify_issue tool.
```

**Why it worked:**
- Definitions + tie-breaker + one hard few-shot. Each addresses a different failure mode in the baseline.
- The few-shot shows that user *framing* and the correct *category* can disagree; this is the lesson the baseline misses most often.
- Resist adding a second few-shot — overfitting risk shows up fast on a 30-row gold set.

---

## Debrief talking points

Use these to draw the lesson out of whatever prompt actually wins:

- "Which prompt change moved the score the most? Was it definitions, tie-breakers, or few-shot?"
- "Did anyone's score go *down* on a previously-passing example after they edited the prompt? That's overfitting — you traded one row for another."
- "If we ran this same prompt on 100 fresh issues, how confident are you the score would hold?"
