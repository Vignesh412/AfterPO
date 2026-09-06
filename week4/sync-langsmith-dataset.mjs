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
  dataset = await client.createDataset(name, { description: "40 manually curated and labelled synthetic cases testing false supplier blame, attribution, evidence grounding and governance routing." });
}
const existing = [];
for await (const example of client.listExamples({ datasetId: dataset.id })) existing.push(example);
if (existing.length === cases.length) {
  console.log(`${name} already contains ${existing.length} cases; nothing to upload.`);
  process.exit(0);
}
if (existing.length !== 0) throw new Error(`${name} contains ${existing.length} cases; expected 0 or ${cases.length}. Refusing to create duplicates.`);
await client.createExamples(cases.map((test) => ({
    dataset_id: dataset.id,
    inputs: test.input,
    outputs: test.expected,
    metadata: { ...test.metadata, case_id: test.case_id, scenario_type: test.scenario_type, difficulty: test.difficulty, counterfactual_group: test.counterfactual_group },
  })));
console.log(`Synced ${cases.length} cases to ${name} (${dataset.id}).`);
