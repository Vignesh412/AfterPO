import "dotenv/config";
import { readFile } from "node:fs/promises";
import { Client } from "langsmith";

if (!process.env.LANGSMITH_API_KEY) throw new Error("Set LANGSMITH_API_KEY first.");
const client = new Client({ apiKey: process.env.LANGSMITH_API_KEY, apiUrl: process.env.LANGSMITH_ENDPOINT });
const cases = JSON.parse(await readFile(new URL("./data/afterpo-golden-v1.json", import.meta.url), "utf8"));
const name = "AfterPO Supplier Blame Benchmark v1";
let dataset;
try {
  dataset = await client.readDataset({ datasetName: name });
} catch {
  dataset = await client.createDataset(name, { description: "40 human-authored synthetic cases testing false supplier blame, attribution, evidence grounding and governance routing." });
}
await client.createExamples({
  datasetId: dataset.id,
  examples: cases.map((test) => ({
    inputs: test.input,
    outputs: test.expected,
    metadata: { ...test.metadata, case_id: test.case_id, scenario_type: test.scenario_type, difficulty: test.difficulty, counterfactual_group: test.counterfactual_group },
  })),
});
console.log(`Synced ${cases.length} cases to ${name} (${dataset.id}).`);
