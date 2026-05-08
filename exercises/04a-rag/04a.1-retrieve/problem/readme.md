# 04a.1 — Retrieval (TF-IDF)

> Block 4a is a facilitator fallback. The default Block 4 is the agent loop (4b).
> If you're here, the room voted RAG.

## Why TF-IDF, not embeddings?

Anthropic doesn't ship an embeddings API. To avoid making you sign up for a third provider just for a 10-document toy corpus, we use **TF-IDF** — pure JavaScript, no API calls, same retrieval shape (vectorize → cosine → top-k).

For a real production RAG, you'd swap this for Voyage AI or OpenAI embeddings. The interface (`retrieve(query, k)`) wouldn't change.

## What you'll do

In `retrieve.ts`, complete the cosine top-k against the TF-IDF vectors of `datasets/rag-corpus.json`.

## Steps

1. Open `retrieve.ts`. The TF-IDF vectorizer is pre-written.
2. Fill in TODO 1 (cosine similarity) and TODO 2 (top-k sort).
3. Run `pnpm exercise 4a.1`. You should see the top-3 KB articles for the query "memory leak in worker".
