import corpus from "../../../../datasets/rag-corpus.json" with { type: "json" };

type Doc = { id: string; title: string; body: string };

function tokenize(s: string): string[] {
  return s.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

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
  let dot = 0;
  for (const [t, av] of a) {
    const bv = b.get(t);
    if (bv) dot += av * bv;
  }
  let na = 0;
  for (const v of a.values()) na += v * v;
  let nb = 0;
  for (const v of b.values()) nb += v * v;
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

const docs = corpus as Doc[];
const { vec, docVecs } = buildVectorizer(docs);

export function retrieve(query: string, k = 3) {
  const qv = vec(tokenize(query));
  return docVecs
    .map((dv, i) => ({ doc: docs[i], score: cosine(qv, dv) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

const QUERY = "memory leak in worker";
const hits = retrieve(QUERY);
console.log(`Q: ${QUERY}`);
for (const h of hits) {
  console.log(`  [${h.score.toFixed(3)}] ${h.doc.id} — ${h.doc.title}`);
}
