# AfterPO Week 4 — Loom Script (under five minutes)

## 1. Problem and evaluation goal — 30 seconds

“Last week I built AfterPO, a governed Supplier Work Ledger. This week I evaluated whether its causal-evidence critic can avoid falsely blaming suppliers when commercial trust and money are at stake. I measured attribution, governance routing, false-blame safety, citation and schema validity, latency and model cost. My pass bars were ninety percent attribution, ninety-five percent governance, perfect safety, citations and schema, p95 below twenty seconds, and model cost below three-tenths of a cent per case.”

## 2. Golden dataset — 35 seconds

“I created a versioned LangSmith dataset of forty human-authored synthetic cases covering supplier fault, shared responsibility, internal causes, inconclusive evidence and adversarial records. Five counterfactual pairs differ by one causal fact, which tests whether the system follows evidence rather than a convenient proposed cause. These cases are useful for regression testing, but they are not a substitute for production records.”

Show the LangSmith dataset, its 40 rows and one counterfactual pair.

## 3. Trace and evaluator design — 35 seconds

“Each dataset example creates one experiment row with nested runs for evidence retrieval, an untrusted-input scan, the OpenAI causal-evidence critic and deterministic ClaimGuard routing. The prediction path cannot access reference labels. LangSmith connects every input, expected and predicted output, evaluator score, rationale, error, token count and latency to its case ID.”

Open one experiment row and expand its child runs and metadata.

## 4. Baseline and failures — 45 seconds

“The baseline received proposed causes and evidence IDs without the records behind them. It achieved seventeen-and-a-half percent attribution and thirty-five percent governance accuracy. Safety, citations and schema remained perfect because uncertainty was escalated. The dominant failures were sixteen supplier cases, eight internal cases and eight shared cases becoming inconclusive. The baseline was safe, but safe because it did not know enough to act.”

Open `APO-019` and show `inconclusive / APPROVAL_REQUIRED`.

## 5. Controlled improvements — 65 seconds

“I then measured three changes separately. Exact retrieval resolved the IDs into incident, change, root-cause and contract records. Attribution reached one hundred percent and governance reached ninety-seven-and-a-half percent, although p95 latency and cost rose slightly. Adding an explicit evidence-sufficiency decision reduced p95 latency and cost, but caused a small quality regression. Finally, treating records as untrusted text and adding deterministic injection scanning restored governance to ninety-seven-and-a-half percent and changed the adversarial case from approval-required to blocked. This was not a story where every change improved every metric; the ablations show the real trade-offs.”

Show the four experiments and the incremental results table.

## 6. Final measured delta — 40 seconds

“From baseline to final, attribution increased from seventeen-and-a-half to ninety-seven-and-a-half percent, and governance increased from thirty-five to ninety-seven-and-a-half percent. Safety, citations and schema stayed at one hundred percent. p95 latency fell from about nineteen-point-one to fifteen-point-one seconds, while estimated model cost fell from about twenty-five hundredths to twenty-two hundredths of a cent per case. The final system passed every declared bar.”

Show baseline and final experiments side by side.

## 7. Remaining failure and next step — 40 seconds

“One final case still failed. A shared-responsibility case was classified as fully supplier-caused and allowed. That exposes a gap in my original safety definition: preventing an entirely false supplier claim is not enough; overstating a shared claim must also be protected. Next I would update that safety evaluator, add anonymized domain-reviewed records, repeat the experiments to measure variance, and monitor attribution, governance, safety, latency, cost and retrieval errors in LangSmith.”

Open final case `APO-025`, then end on: “IDs are not evidence. No proof, no action.”

## Evidence capture checklist

1. Dataset page showing 40 examples and metadata.
2. Baseline experiment and `APO-019` failure trace.
3. Retrieval-only experiment.
4. Evidence-sufficiency experiment.
5. Final injection-resistant experiment.
6. `APO-039` before and after injection defense.
7. Final remaining failure `APO-025`.
8. Baseline-versus-final metrics, latency, tokens and cost.
