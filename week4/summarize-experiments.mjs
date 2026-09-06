import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { Client } from "langsmith";

const datasetId = "be42bcbb-e475-4ff2-b401-c81d0c409f01";
const organizationId = "d9e3a397-1cd3-49b4-9957-16701c260167";
const experiments = [
  { stage: "Baseline", name: "afterpo-baseline-v1-ce33625a", id: "ca6a825e-1baf-439a-80f9-65e71310b553" },
  { stage: "Exact retrieval", name: "afterpo-retrieval-only-v2-5281a46d", id: "d4a4070e-fc59-4ad6-b86a-920e4a01ade2" },
  { stage: "Evidence sufficiency", name: "afterpo-sufficiency-gate-v3-db161d02", id: "ce8f6e2d-7a0c-449d-9c6a-05087e561c64" },
  { stage: "Injection-resistant final", name: "afterpo-evidence-enriched-v2-bbcf9c53", id: "011dfa27-792f-4074-9d5b-e41bf78701ee" },
];
const client = new Client();
const examples = new Map();
for await (const example of client.listExamples({ datasetId })) examples.set(example.id, example);

const percentile = (values, p) => {
  const sorted = values.toSorted((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] ?? null;
};

async function summarize(experiment) {
  const runs = [];
  for await (const run of client.runs.query({
    project_ids: [experiment.id],
    selects: ["ID", "NAME", "START_TIME", "END_TIME", "REFERENCE_EXAMPLE_ID", "TRACE_ID", "PROMPT_TOKENS", "COMPLETION_TOKENS", "FEEDBACK_STATS"],
  })) runs.push(run);
  const roots = runs.filter((run) => run.reference_example_id);
  const rootsByTrace = new Map(roots.map((root) => [root.trace_id, root]));
  const tokenByRoot = new Map();
  for (const run of runs.filter((candidate) => candidate.name === "ChatOpenAI")) {
    const root = rootsByTrace.get(run.trace_id);
    if (!root) continue;
    const current = tokenByRoot.get(root.id) ?? { input: 0, output: 0 };
    current.input += Number(run.prompt_tokens ?? 0);
    current.output += Number(run.completion_tokens ?? 0);
    tokenByRoot.set(root.id, current);
  }

  const scoreSums = {};
  const latencies = [];
  const failures = {};
  let inputTokens = 0;
  let outputTokens = 0;
  for (const root of roots) {
    for (const [key, value] of Object.entries(root.feedback_stats ?? {})) scoreSums[key] = (scoreSums[key] ?? 0) + Number(value.avg ?? 0);
    latencies.push(new Date(root.end_time).getTime() - new Date(root.start_time).getTime());
    const usage = tokenByRoot.get(root.id) ?? { input: 0, output: 0 };
    inputTokens += usage.input;
    outputTokens += usage.output;
    const example = examples.get(root.reference_example_id);
    const attributionCorrect = Number(root.feedback_stats?.attribution_correct?.avg ?? 0);
    const governanceCorrect = Number(root.feedback_stats?.governance_correct?.avg ?? 0);
    if (!attributionCorrect || !governanceCorrect) {
      const scenario = example?.metadata?.scenario_type ?? "unknown";
      const cluster = failures[scenario] ?? { cases: 0, model_cost_usd: 0, case_ids: [] };
      cluster.cases += 1;
      cluster.model_cost_usd += usage.input * 0.25 / 1_000_000 + usage.output * 2 / 1_000_000;
      cluster.case_ids.push(example?.metadata?.case_id ?? root.reference_example_id);
      failures[scenario] = cluster;
    }
  }
  const totalCost = inputTokens * 0.25 / 1_000_000 + outputTokens * 2 / 1_000_000;
  return {
    ...experiment,
    url: `https://smith.langchain.com/o/${organizationId}/datasets/${datasetId}/compare?selectedSessions=${experiment.id}`,
    cases: roots.length,
    metrics: Object.fromEntries(Object.entries(scoreSums).map(([key, value]) => [key, value / roots.length])),
    latency_ms: { p50: percentile(latencies, 0.5), p95: percentile(latencies, 0.95) },
    tokens: { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens },
    estimated_model_cost_usd: totalCost,
    estimated_model_cost_per_case_usd: totalCost / roots.length,
    failure_clusters: failures,
  };
}

const summaries = [];
for (const experiment of experiments) summaries.push(await summarize(experiment));
await mkdir(new URL("./results/", import.meta.url), { recursive: true });
await writeFile(new URL("./results/formal-experiments.json", import.meta.url), `${JSON.stringify(summaries, null, 2)}\n`);
console.log(JSON.stringify(summaries, null, 2));
