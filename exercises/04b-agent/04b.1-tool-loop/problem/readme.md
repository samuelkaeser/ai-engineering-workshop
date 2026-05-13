# 04b.1: Debug the agent loop, then catch it with an eval

> *"Tool calls inside a loop: the core primitive of every agent framework."*

## Why this matters

Frameworks like LangChain, AI SDK, Mastra, and Pydantic-AI all wrap the same primitive: a while-loop that handles `tool_use` blocks until the model says it's done.

If you've never *debugged* one from scratch, agents feel like magic. After 15 minutes of pair-reading, they won't.

## Our agent

The System Under Test for this block is `runAgent`. You give it a question; it gives you back an answer. It lives in `problem/agent.ts`. **Read it now, before running anything.** You do not need to follow the syntax word-by-word; follow the *shape* of the loop.

What `runAgent` is supposed to do:

1. Start the conversation with the user's question.
2. Send the conversation so far to Claude, along with the list of tools Claude is allowed to call.
3. Look at Claude's reply:
   - If Claude says "I'm done" (`end_turn`): pull out the text answer and return it.
   - If Claude says "I want to use a tool" (`tool_use`): run the tool, send the result back, and ask Claude again.
4. Repeat up to 6 times, then give up.

The loop in pseudocode:

```
messages = [user_question]
while true:
  response = client.messages.create({ model, tools, messages })
  if stop_reason === "end_turn": return final_text
  if stop_reason === "tool_use":
    for EACH tool_use block in response.content:
      run handler, build a tool_result
    messages.push(assistant: response.content)
    messages.push(user: [all tool_results])
return final_text
```

The tools (`tools.ts`) operate over our gold-set issue corpus:
- `search_issues(query)`: substring match across titles and bodies. Returns `id`, `title`, `label`.
- `get_issue_details(id)`: full body of one issue.

The seeded question:

> *"Find all issues that mention timezones AND all issues that mention CSV. List them."*

This question is engineered to provoke **parallel tool calls** in a single turn (one `search_issues` per subject). Hold onto that fact as you read the code.

## Two files, two jobs

| File | Why you open it |
| --- | --- |
| `agent.ts` | Contains `runAgent`. The bug is in here. |
| `main.ts` | A two-line harness that just calls `runAgent` and prints the answer. You won't edit this. |
| `invariant.eval.ts` | An eval that catches the bug. Has a TODO. |

## Steps

1. **Read `agent.ts` end-to-end with your pair.** Pause at the section where the loop handles tool calls (around lines 25-40). In plain English, trace what the loop does when Claude asks to run *one* tool. Then ask: what would change if Claude asked to run *two* tools at the same time?

2. **Run the demo.**

   ```sh
   pnpm exercise 4b.1
   ```

   You'll see one `↳ search_issues(...)` line, then a 400 from Anthropic.

3. **Read the error message bottom-up.** Anthropic literally tells you what's missing. Quote: *"`tool_use` ids were found without `tool_result` blocks immediately after."*

4. **Pair: name the bug.** Connect the error to the code. Claude asked for *two* tool calls in one reply. The loop only ran *one*. The second one was orphaned. State this in one sentence.

5. **Predict the eval.** Before you fix anything, ask: *"What's the cheapest deterministic eval that would have caught this in CI?"* You don't need to write code yet, just describe it. Hint: the API invariant the bug breaks is "tool_use count equals tool_result count." That same invariant can be detected from the outside as "did the agent finish without throwing?"

6. **Write the eval.** Open `invariant.eval.ts`. There's one TODO: a scorer called `loopCompletes`. The task function (which wraps the agent in a try/catch) is already written. You just write the scorer that returns 1 when the agent finished and 0 when it threw.

   With Evalite running (`pnpm eval:dev`), save the file. The new eval row "Agent: loop invariant" should appear and score **0** (because the agent is still buggy).

7. **Fix the agent.** Prompt your coding agent ("the loop only handles one tool_use per turn, fix it"), or hand-edit `agent.ts`. Re-run; the demo should now print two `↳ search_issues(...)` lines and a clean final answer. The "Agent: loop invariant" eval should flip to **1**.

8. **Bridge to 4b.2.** Your deterministic eval catches *this* bug. It does not catch "the agent ran but gave a vague or wrong answer." That's the gap 4b.2 fills with a judge.

That word **EACH** in the pseudocode is doing a lot of work. Make sure the code agrees with it.
