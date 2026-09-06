# AfterPO Week 4 Project Documentation

This folder documents the evaluation of the AfterPO causal-evidence critic on a fixed 40-case benchmark. It connects aggregate results to case-level LangSmith traces and measures three incremental changes against an identifier-only baseline.

## Documentation artifacts

| Deliverable | File | What it contains |
| --- | --- | --- |
| Google Docs ready documentation | [AfterPO Week 4 Project Documentation for Google Docs](./AfterPO_Week4_Project_Documentation_for_Google_Docs.docx) | Sanitized, fully formatted copy designed for upload to Google Drive and conversion to a native Google Doc |
| Solution document | [AfterPO Week 4 Solution Document](./AfterPO_Week4_Solution_Document.docx) | Project overview, architecture, metrics, dataset, prompts, experiment design, results, failure traces, measured improvements, limitations and next steps |
| Evaluation spreadsheet | [AfterPO Week 4 Evaluation Spreadsheet](./AfterPO_Week4_Evaluation.xlsx) | Summary metrics, all 40 labeled cases, registered experiment references, ticket-level trace evidence and per-improvement contribution |
| Browser-readable report | [Evaluation Report](../EVALUATION_REPORT.md) | The evidence-aligned evaluation report in Markdown |
| Golden dataset source | [AfterPO Golden Dataset v1](../data/afterpo-golden-v1.json) | Versioned inputs, expected outputs and case metadata used for every experiment |
| Formal experiment results | [Formal Experiment Results](../results/formal-experiments.json) | Aggregate metrics and identifiers for the four registered LangSmith experiments |

## Evaluation one-liner

I measured attribution accuracy, governance-routing accuracy, false-supplier-blame safety, citation validity, structured-output validity, p95 latency and estimated model cost on the AfterPO causal-evidence critic using 40 manually curated and labelled synthetic cases covering supplier fault, shared responsibility, internal causes, inconclusive evidence, counterfactuals and adversarial records, with exact-match and code-based evaluators. The declared bars were at least 90% attribution, at least 95% governance, 100% safety, citations and schema validity, p95 below 20 seconds and estimated model cost below $0.003 per case.

## What was evaluated

The OpenAI causal-evidence critic proposes a structured attribution, confidence, competing cause, evidence IDs and rationale. Exact retrieval resolves evidence identifiers into source-record contents. A deterministic ClaimGuard function converts the bounded output into `ALLOW`, `APPROVAL_REQUIRED` or `BLOCK`. The model does not calculate money or authorize a commercial action.

The same dataset and evaluators were used for four registered experiments:

1. Identifier-only baseline
2. Exact evidence retrieval
3. Evidence-sufficiency prompting
4. Injection-resistant final configuration

## LangSmith evidence

- [Golden dataset and examples](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/datasets/be42bcbb-e475-4ff2-b401-c81d0c409f01?tab=1)
- [Identifier-only baseline](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/datasets/be42bcbb-e475-4ff2-b401-c81d0c409f01/compare?selectedSessions=ca6a825e-1baf-439a-80f9-65e71310b553)
- [Exact-retrieval experiment](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/datasets/be42bcbb-e475-4ff2-b401-c81d0c409f01/compare?selectedSessions=d4a4070e-fc59-4ad6-b86a-920e4a01ade2)
- [Evidence-sufficiency experiment](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/datasets/be42bcbb-e475-4ff2-b401-c81d0c409f01/compare?selectedSessions=ce8f6e2d-7a0c-449d-9c6a-05087e561c64)
- [Final injection-resistant experiment](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/datasets/be42bcbb-e475-4ff2-b401-c81d0c409f01/compare?selectedSessions=011dfa27-792f-4074-9d5b-e41bf78701ee)

### Ticket-level traces

- [APO-019 baseline failure](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/projects/p/ca6a825e-1baf-439a-80f9-65e71310b553/trace/01a073db-16aa-7000-8000-02e45e2d10e0/run/01a073db-16aa-7000-8000-02e45e2d10e0?poll=true)
- [APO-006 baseline failure](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/projects/p/ca6a825e-1baf-439a-80f9-65e71310b553/trace/01a073da-3976-7000-8000-01a4f89902ba/run/01a073da-3976-7000-8000-01a4f89902ba?poll=true)
- [APO-027 baseline failure](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/projects/p/ca6a825e-1baf-439a-80f9-65e71310b553/trace/01a073da-e184-7000-8000-0394fc8d930c/run/01a073da-e184-7000-8000-0394fc8d930c?poll=true)
- [APO-019 final correction](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/projects/p/011dfa27-792f-4074-9d5b-e41bf78701ee/trace/01a073dd-d3f4-7000-8000-025a8ee71171/run/01a073dd-d3f4-7000-8000-025a8ee71171?poll=true)
- [APO-039 before injection defense](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/projects/p/ce8f6e2d-7a0c-449d-9c6a-05087e561c64/trace/01a076d9-5f6c-7000-8000-03771aae049f/run/01a076d9-5f6c-7000-8000-03771aae049f?poll=true)
- [APO-039 final correction](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/projects/p/011dfa27-792f-4074-9d5b-e41bf78701ee/trace/01a073dc-b496-7000-8000-004b07dcc399/run/01a073dc-b496-7000-8000-004b07dcc399?poll=true)
- [APO-025 remaining final failure](https://smith.langchain.com/o/d9e3a397-1cd3-49b4-9957-16701c260167/projects/p/011dfa27-792f-4074-9d5b-e41bf78701ee/trace/01a073dc-37fa-7000-8000-00cc7327e739/run/01a073dc-37fa-7000-8000-00cc7327e739?poll=true)

## Measured results

| Stage | Attribution | Governance | Safety | Citations | Schema | p95 latency | Estimated cost per case |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Baseline | 17.5% | 35.0% | 100% | 100% | 100% | 19.130 s | $0.00246 |
| Exact retrieval | 100% | 97.5% | 100% | 100% | 100% | 21.052 s | $0.00269 |
| Evidence sufficiency | 97.5% | 95.0% | 100% | 100% | 100% | 16.063 s | $0.00215 |
| Final injection defense | 97.5% | 97.5% | 100% | 100% | 100% | 15.121 s | $0.00216 |

The measured contribution of each intervention is documented separately in the spreadsheet and solution document. Exact retrieval delivered the dominant quality improvement. Evidence sufficiency produced a small regression despite lower observed latency and cost. Injection defense corrected the tested adversarial governance route.

## Known limitation

The benchmark is synthetic and deliberately structured. It is suitable for controlled regression testing, not evidence of production readiness. Each configuration was run once, so smaller timing, cost and prompt-level differences may contain model variance.

The final system also has one commercially important remaining failure: `APO-025` was labelled `shared / APPROVAL_REQUIRED` but predicted `supplier / ALLOW`. The original safety evaluator did not treat shared-to-supplier overstatement as a protected false-blame outcome. That evaluator must be tightened before any production claim.

## Reproduce the evaluation

Create a local `.env` from `.env.example`, provide your own OpenAI and LangSmith credentials, and run:

```bash
npm install
npm run eval:validate
npm run eval:experiment:baseline
npm run eval:experiment:retrieval
npm run eval:experiment:sufficiency
npm run eval:experiment:improved
npm run eval:experiment:summary
```

Never commit API keys. The scripts, evaluator definitions and generated aggregate results are available in the [Week 4 project folder](../).
