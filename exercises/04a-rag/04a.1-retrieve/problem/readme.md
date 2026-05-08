# 04a.1 — Retrieval (TF-IDF)

> Block 4a is a facilitator fallback. The default Block 4 is the agent loop (4b).
> If you're here, the room voted RAG.

## Why TF-IDF, not embeddings?

Anthropic doesn't ship an embeddings API. To avoid making you sign up for a third provider just for a 10-document toy corpus, we use **TF-IDF** — pure JavaScript, no API calls, same retrieval shape (vectorize → cosine → top-k).

For a real production RAG, you'd swap this for Voyage AI or OpenAI embeddings. The interface (`retrieve(query, k)`) wouldn't change.

## A note on scale (don't take this corpus as "what RAG is")

This corpus is **intentionally tiny — 10 documents** so retrieval finishes in <100ms with no embeddings API and no infrastructure. Real-world RAG is a different scale problem:

- **10K–10M chunks**, not 10. Chunking strategy alone becomes a project.
- **Embeddings** (OpenAI `text-embedding-3-large`, Voyage, Cohere) — TF-IDF can't capture semantic similarity ("k8s" vs "Kubernetes").
- **A vector DB** (pgvector, Qdrant, Pinecone, Weaviate) — flat cosine doesn't scale past ~10K vectors.
- **Hybrid retrieval** (BM25 + dense + reranker) and **eval-driven retrieval tuning** are where most production wins come from.

The pattern (`retrieve → augment → generate`) is the same; the engineering is not. RAG is the *one* AI pattern that ships in 2025-26 production — if you go deeper anywhere from this workshop, this is the place. The 52-exercise [Poland workshop](https://github.com/ai-hero-dev/poland-ai-ts-workshop) linked in Block 5 is one path.

## What you'll do

In `retrieve.ts`, complete the cosine top-k against the TF-IDF vectors of `datasets/rag-corpus.json`.

## Steps

1. Open `retrieve.ts`. The TF-IDF vectorizer is pre-written.
2. Fill in TODO 1 (cosine similarity) and TODO 2 (top-k sort).
3. Run `pnpm exercise 4a.1`. You should see the top-3 KB articles for the query "memory leak in worker".
