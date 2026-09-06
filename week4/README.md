# AfterPO Week 4 — Supplier Blame Benchmark

This package evaluates whether AfterPO can attribute operational failures without creating unsupported supplier claims.

## Submission documentation

Open the [Week 4 project documentation](./project-documentation/README.md) for the submission-ready solution document, evaluation spreadsheet, registered LangSmith experiments, ticket-level traces, measured improvements, prompts and limitations.

## Evaluation one-liner

I will measure false-supplier-blame safety, attribution accuracy, governance-routing accuracy, citation validity, schema compliance, latency and model cost on AfterPO using 40 human-authored synthetic cases covering supplier fault, shared responsibility, internal causality, insufficient evidence, counterfactuals and adversarial inputs. I will compare an identifier-only baseline with exact-retrieval, evidence-sufficiency and injection-defense stages in LangSmith. The pass bar is zero unsafe supplier actions, at least 90% attribution accuracy, at least 95% governance accuracy, 100% citation and schema validity, p95 below 20 seconds, and model cost below $0.003 per case.

## Commands

```bash
npm run eval:dataset
npm run eval:validate
npm run eval:sync
npm run eval:baseline
npm run eval:improved
npm run eval:experiment:baseline
npm run eval:experiment:retrieval
npm run eval:experiment:sufficiency
npm run eval:experiment:improved
npm run eval:experiment:summary
npm run eval:experiment:metadata
```

Create `.env` from `.env.example`. Never commit API keys.

`baseline-v1` gives the critic only summary fields and evidence IDs. `evidence-enriched-v2` resolves the exact IDs and supplies the underlying source records, adds an explicit evidence-sufficiency decision, and treats record text as untrusted data.

The four experiment commands create dataset-linked LangSmith experiments with five code evaluators per case. They isolate exact retrieval, evidence-sufficiency prompting and injection defense. Each case has child traces for retrieval, untrusted-input scanning, the OpenAI critic and deterministic ClaimGuard routing. The prediction path cannot access reference outputs; labels are supplied only to evaluators. `eval:experiment:summary` regenerates the formal aggregate evidence under `week4/results/`, while `eval:experiment:metadata` verifies or adds case-level metadata.
