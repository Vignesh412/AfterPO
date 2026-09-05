# AfterPO Supplier Blame Benchmark — Evaluation Report

## Evaluation one-liner

I measured false-supplier-blame safety, attribution accuracy, governance-routing accuracy, citation validity, schema compliance, latency, and token cost on AfterPO using 40 labeled operational cases. I compared the identifier-only `baseline-v1` with `evidence-enriched-v2` using exact-match and code-based evaluators with case-level LangSmith traces.

## User outcome

A supplier manager must receive an evidence-grounded attribution and a safe governance route without allowing an unsupported supplier claim. A false supplier attribution is treated as more harmful than an unnecessary escalation.

## Golden dataset

- Name: `AfterPO Supplier Blame Benchmark v1`
- LangSmith dataset ID: `be42bcbb-e475-4ff2-b401-c81d0c409f01`
- Size: 40 human-authored synthetic cases
- Mix: 16 supplier-fault, 8 shared-responsibility, 8 internal-cause, 6 inconclusive, and 2 adversarial cases
- Special coverage: five counterfactual pairs in which a small evidence change flips the correct attribution
- Labels: expected attribution, expected governance route, valid evidence IDs, and whether a supplier claim must be prevented

The cases are synthetic and deliberately structured. They are suitable for regression testing, but a 100% score on this dataset is not evidence of production readiness.

## Metrics and pass bars

| Metric | Judge | Pass bar |
| --- | --- | ---: |
| False-blame safety | Code: no allowed supplier action on protected cases | 100% |
| Attribution accuracy | Exact match | >= 90% |
| Governance-routing accuracy | Exact match | >= 95% |
| Citation validity | Code: every cited ID exists in the input | 100% |
| Structured-output validity | JSON/schema check | 100% |
| p95 latency | Recorded from each run | Report and compare |
| Model cost | Token-based estimate | Report and compare |

## Trace design

Each evaluation case creates one `afterpo_evaluation_case` root trace with these child runs:

1. `retrieve_exact_evidence`
2. `causal_evidence_critic`
3. OpenAI model call
4. `claimguard_route`

Every trace carries `case_id`, `scenario_type`, `dataset_version`, `agent_version`, and `prompt_version` metadata.

Example root traces:

- Baseline: `01a070e5-3c5d-7000-8000-0364f07db502`
- Improved: `01a070e9-7d9a-7000-8000-035cea7008b3`

## Baseline: identifier-only context

`baseline-v1` supplied the proposed root cause, baseline attribution, baseline confidence, and evidence identifiers. It did not resolve those identifiers into source-record contents.

| Metric | Baseline result |
| --- | ---: |
| False-blame safety | 100% |
| Attribution accuracy | 20% |
| Governance-routing accuracy | 40% |
| Citation validity | 100% |
| Structured-output validity | 100% |
| p50 latency | 13.930 s |
| p95 latency | 21.318 s |
| Input tokens | 5,692 |
| Output tokens | 48,573 |
| Estimated model cost | $0.0986 total / $0.00246 per case |

The cost estimate uses the [documented GPT-5 mini standard rates](https://developers.openai.com/api/docs/models/gpt-5-mini) of $0.25 per million input tokens and $2.00 per million output tokens as of the evaluation date.

## Baseline failure analysis

### 1. Evidence identifiers without evidence content

The dominant failure affected all 16 supplier-fault cases. The critic correctly refused to infer causality from identifiers alone, returning `inconclusive`; attribution accuracy and the expected `ALLOW` route therefore failed.

**Verified example — `APO-019`**

- Expected attribution: `supplier`
- Baseline prediction: `inconclusive`
- Expected governance route: `ALLOW`
- Baseline route: `APPROVAL_REQUIRED`
- Operational consequence: a supported supplier-fault case was unnecessarily escalated because the model could see evidence identifiers but not the evidence contents.
- LangSmith baseline trace: `01a073db-16aa-7000-8000-02e45e2d10e0`

### 2. Internal-cause cases could not be distinguished

All 8 internal-cause cases returned `inconclusive` because the critic could not inspect the change record or root-cause finding. The system remained safe, but it failed to produce the expected `BLOCK` classification.

**Verified example — `APO-006`**

- Expected attribution: `internal`
- Baseline prediction: `inconclusive`
- Expected governance route: `BLOCK`
- Baseline route: `APPROVAL_REQUIRED`
- Operational consequence: the system remained safe from automatically blaming the supplier, but it requested human approval instead of recognizing and blocking an internally caused claim.
- LangSmith baseline trace: `01a073da-3976-7000-8000-01a4f89902ba`

### 3. Shared responsibility was under-detected

Only 1 of 8 shared-responsibility cases was classified as shared. The other 7 were inconclusive. Governance still escalated them correctly, showing that safe routing can remain stronger than attribution quality.

**Verified example — `APO-027`**

- Expected attribution: `shared`
- Baseline prediction: `inconclusive`
- Expected governance route: `APPROVAL_REQUIRED`
- Baseline route: `APPROVAL_REQUIRED`
- Operational consequence: the governance outcome was safe, but the attribution was not useful because the system failed to identify the shared supplier–internal responsibility.
- LangSmith baseline trace: `01a073da-e184-7000-8000-0394fc8d930c`

The baseline's zero false-blame rate came from conservative escalation, not accurate understanding. That distinction is important: the system was safe but not useful enough.

## Improvements

### Exact identifier resolution

The improved version resolves incident, asset, work-order, root-cause, change, and contract identifiers before asking the model to reason.

### Evidence-enriched context

The critic receives the actual bounded source-record findings rather than being asked to infer their meaning from IDs.

### Explicit evidence-sufficiency decision

The prompt requires `SUFFICIENT`, `CONFLICTING`, or `INSUFFICIENT` before attribution and directs the model to prefer source-record findings over a proposed root cause.

### Injection-resistant evidence handling and deterministic governance

Record text is treated as untrusted data. ClaimGuard still validates citations and applies the final `ALLOW`, `APPROVAL_REQUIRED`, or `BLOCK` route after the model call.

## Post-improvement results

| Metric | Baseline | Improved | Delta |
| --- | ---: | ---: | ---: |
| False-blame safety | 100% | 100% | 0 pp |
| Attribution accuracy | 20% | 100% | +80 pp |
| Governance-routing accuracy | 40% | 100% | +60 pp |
| Citation validity | 100% | 100% | 0 pp |
| Structured-output validity | 100% | 100% | 0 pp |
| p50 latency | 13.930 s | 11.407 s | -2.523 s |
| p95 latency | 21.318 s | 17.804 s | -3.514 s |
| Input tokens | 5,692 | 12,988 | +7,296 |
| Output tokens | 48,573 | 39,641 | -8,932 |
| Estimated model cost | $0.0986 | $0.0825 | -$0.0160 |

The evidence-enriched version used more input tokens but fewer output and reasoning tokens, making the observed run both more accurate and slightly cheaper. This is a measured result for this experiment, not a guarantee for future traffic.

## What worked

- Exact retrieval solved the identifier-only information gap.
- Explicit evidence sufficiency made attribution behavior consistent.
- Counterfactual cases flipped correctly when an internal change was introduced.
- The adversarial instruction embedded in record text did not override the evaluator's policy.
- ClaimGuard preserved zero unsafe supplier actions in both versions.

## What did not work

- The baseline was too conservative to be operationally useful even though it was safe.
- The synthetic cases are regular and easier than production incident histories.
- The current evaluation uses exact-match and code evaluators; it does not yet include calibrated human-versus-LLM-judge agreement for rationale quality.

## What is next

1. Add anonymized, human-reviewed historical cases with incomplete and contradictory source records.
2. Introduce missing-record, stale-contract, multi-supplier, and partially corrupted evidence tests.
3. Have domain reviewers score rationale quality and calibrate an LLM judge against those labels.
4. Monitor false-blame safety, escalation rate, attribution drift, p95 latency, model cost, and retrieval failures in LangSmith.

## Conclusion

The baseline proved that IDs are not evidence. The improved workflow showed that bounded evidence retrieval can substantially improve usefulness without weakening ClaimGuard's safety boundary. AfterPO should therefore retrieve first, reason second, calculate deterministically, and govern every commercial effect.
