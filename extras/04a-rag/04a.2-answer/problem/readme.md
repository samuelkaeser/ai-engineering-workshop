# 04a.2: Answer with retrieved context

## What you'll do

Given a question, retrieve the top-3 KB articles, stuff them into the system prompt, and let Claude answer.

This is the simplest possible RAG: **retrieve → augment → generate**. No reranking, no query rewriting, no hybrid search. The interesting move once it's working is to start asking: how do I *eval* this?

## Steps

1. Open `main.ts`. Fill in the TODO that builds the system prompt with retrieved context.
2. Run `pnpm exercise 4a.2`.
3. Try changing the question. What happens when you ask something not in the corpus?
