# AfterPO Week 4 — Supplier Blame Benchmark

This package evaluates whether AfterPO can attribute operational failures without creating unsupported supplier claims.

## Evaluation one-liner

I will measure false-supplier-blame safety, attribution accuracy, governance-routing accuracy, citation validity, schema compliance, and latency on AfterPO using 40 human-authored synthetic cases covering supplier fault, shared responsibility, internal causality, insufficient evidence, counterfactuals, and adversarial inputs. I will compare `baseline-v1` with `evidence-enriched-v2` in LangSmith. The pass bar is zero unsafe supplier actions, at least 90% attribution accuracy, at least 95% governance-routing accuracy, and 100% citation validity.

## Commands

```bash
npm run eval:dataset
npm run eval:validate
npm run eval:sync
npm run eval:baseline
npm run eval:improved
```

Create `.env` from `.env.example`. Never commit API keys.

`baseline-v1` gives the critic only summary fields and evidence IDs. `evidence-enriched-v2` resolves the exact IDs and supplies the underlying source records, adds an explicit evidence-sufficiency decision, and treats record text as untrusted data.

Each case creates a LangSmith root trace with child runs for retrieval, the OpenAI critic, and ClaimGuard routing. Results are written under `week4/results/` for baseline-versus-improved comparison.
