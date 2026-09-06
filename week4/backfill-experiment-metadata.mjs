import "dotenv/config";
import { Client } from "langsmith";

const datasetId = "be42bcbb-e475-4ff2-b401-c81d0c409f01";
const projects = [
  { name: "afterpo-baseline-v1-ce33625a", id: "ca6a825e-1baf-439a-80f9-65e71310b553" },
  { name: "afterpo-retrieval-only-v2-5281a46d", id: "d4a4070e-fc59-4ad6-b86a-920e4a01ade2" },
  { name: "afterpo-sufficiency-gate-v3-db161d02", id: "ce8f6e2d-7a0c-449d-9c6a-05087e561c64" },
  { name: "afterpo-evidence-enriched-v2-bbcf9c53", id: "011dfa27-792f-4074-9d5b-e41bf78701ee" },
];
const client = new Client();
const examples = new Map();
for await (const example of client.listExamples({ datasetId })) examples.set(example.id, example);

for (const project of projects) {
  let updated = 0;
  let alreadyCompliant = 0;
  for await (const run of client.runs.query({
    project_ids: [project.id],
    is_root: true,
    selects: ["ID", "START_TIME", "END_TIME", "ERROR", "EXTRA", "METADATA", "OUTPUTS", "REFERENCE_EXAMPLE_ID", "FEEDBACK_STATS"],
  })) {
    if (!run.reference_example_id) continue;
    if (run.metadata?.case_id || run.metadata?.ls_example_case_id) {
      alreadyCompliant += 1;
      continue;
    }
    const example = examples.get(run.reference_example_id);
    if (!example) continue;
    const metadata = {
      ...(run.metadata ?? {}),
      case_id: example.metadata?.case_id,
      scenario_type: example.metadata?.scenario_type,
      difficulty: example.metadata?.difficulty,
      dataset_version: example.metadata?.dataset_version ?? "v1",
      expected_attribution: example.outputs?.attribution,
      expected_governance_route: example.outputs?.governance_route,
      predicted_attribution: run.outputs?.attribution,
      predicted_governance_route: run.outputs?.governance_route,
      attribution_correct: Number(run.feedback_stats?.attribution_correct?.avg ?? 0),
      governance_correct: Number(run.feedback_stats?.governance_correct?.avg ?? 0),
      reasoning: run.outputs?.rationale ?? null,
      execution_error: run.error ?? null,
      latency_ms: new Date(run.end_time).getTime() - new Date(run.start_time).getTime(),
    };
    await client.updateRun(run.id, { extra: { ...(run.extra ?? {}), metadata } });
    updated += 1;
  }
  console.log(`${project.name}: updated ${updated}; already compliant ${alreadyCompliant}`);
}
