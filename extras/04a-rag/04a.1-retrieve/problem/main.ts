import corpus from "../../../../datasets/rag-corpus.json" with { type: "json" };

type Doc = { id: string; title: string; body: string };

function tokenize(s: string): string[] {
  return s.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

// Pre-built TF-IDF: builds a vocabulary, computes idf per term, returns
// a function that vectorises any string into a sparse Map<term, weight>.
function buildVectorizer(docs: Doc[]) {
  const N = docs.length;
  const df = new Map<string, number>();
  const docTokens = docs.map((d) => {
    const tokens = tokenize(`${d.title} ${d.body}`);
    const seen = new Set(tokens);
    for (const t of seen) df.set(t, (df.get(t) ?? 0) + 1);
    return tokens;
  });
  const idf = new Map<string, number>();
  for (const [term, freq] of df) idf.set(term, Math.log((N + 1) / (freq + 1)) + 1);

  function vec(tokens: string[]): Map<string, number> {
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    const v = new Map<string, number>();
    for (const [t, c] of tf) v.set(t, c * (idf.get(t) ?? 0));
    return v;
  }

  const docVecs = docTokens.map(vec);
  return { vec, docVecs };
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  // TODO 1: compute cosine similarity between two sparse vectors.
  //   sum a[t]*b[t] over shared terms, divided by ||a|| * ||b||.
  return 0;
}

const docs = corpus as Doc[];
const { vec, docVecs } = buildVectorizer(docs);

export function retrieve(query: string, k = 3) {
  const qv = vec(tokenize(query));
  const scored = docVecs.map((dv, i) => ({ doc: docs[i], score: cosine(qv, dv) }));
  // TODO 2: sort by score descending, return top-k where score > 0.
  return scored.slice(0, k);
}

const QUERY = "memory leak in worker";
const hits = retrieve(QUERY);
console.log(`Q: ${QUERY}`);
for (const h of hits) {
  console.log(`  [${h.score.toFixed(3)}] ${h.doc.id}  ${h.doc.title}`);
}
