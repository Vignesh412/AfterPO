# AfterPO Supplier Blame Benchmark — Superseded Planning Template

The completed, evidence-aligned submission is in [`EVALUATION_REPORT.md`](./EVALUATION_REPORT.md). This file is retained only as the original planning template and should not be submitted as the final report.

## Evaluation one-liner

I will measure false-supplier-blame safety, attribution accuracy, governance-routing accuracy, citation validity, schema compliance, and latency on AfterPO using 40 labeled cases. I will compare the identifier-only `baseline-v1` against `evidence-enriched-v2` in LangSmith.

## Dataset

- Version: `AfterPO Supplier Blame Benchmark v1`
- Cases: 40
- Sources: human-authored synthetic operational scenarios
- Coverage: supplier fault, shared responsibility, internal cause, inconclusive evidence, five counterfactual pairs, and two adversarial cases
- Labeling: expected attribution, expected governance route, valid evidence IDs, and whether a supplier claim must be prevented

## Pass bars

| Metric | Pass bar |
| --- | ---: |
| Unsafe supplier actions | 0 |
| Attribution accuracy | >= 90% |
| Governance-routing accuracy | >= 95% |
| Valid evidence citations | 100% |
| Structured-output validity | 100% |

## Baseline results

Run: `baseline-v1`

| Metric | Result |
| --- | ---: |
| False-blame safety | Pending |
| Attribution accuracy | Pending |
| Governance-routing accuracy | Pending |
| Citation validity | Pending |
| Schema validity | Pending |
| p50 latency | Pending |
| p95 latency | Pending |

## Failure analysis

Document the top three clusters after the baseline run. For each cluster, include frequency, affected case IDs, one LangSmith trace, user or commercial risk, and estimated cost.

## Improvement hypotheses

1. Resolve exact evidence identifiers and supply the underlying records to reduce identifier-only inconclusive results.
2. Add an explicit `SUFFICIENT`, `CONFLICTING`, or `INSUFFICIENT` evidence decision before attribution.
3. Treat text inside retrieved records as untrusted data to resist instruction injection.
4. Enforce ClaimGuard routing after the model so missing evidence or invalid citations cannot produce an allowed supplier claim.

## Post-improvement results

Run: `evidence-enriched-v2`

| Metric | Baseline | Improved | Delta |
| --- | ---: | ---: | ---: |
| False-blame safety | Pending | Pending | Pending |
| Attribution accuracy | Pending | Pending | Pending |
| Governance-routing accuracy | Pending | Pending | Pending |
| Citation validity | Pending | Pending | Pending |
| Schema validity | Pending | Pending | Pending |
| p95 latency | Pending | Pending | Pending |

## What worked, what did not, and what is next

Complete this section from measured results. Do not claim improvement without a baseline-versus-improved delta. The next production step is bounded retrieval from approved incident, asset, change, RCA, and contract systems with monitoring for false-blame safety, escalation rate, latency, cost, and tool failures.
