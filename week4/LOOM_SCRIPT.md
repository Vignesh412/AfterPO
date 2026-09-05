# AfterPO Week 4 — Loom Script (under five minutes)

## 1. Problem and evaluation goal — 30 seconds

“Last week I built AfterPO, a governed Supplier Work Ledger. This week I did not ask whether it could produce a convincing demo. I asked whether it could avoid falsely blaming a supplier when commercial trust and money are at stake. My headline metric is false-blame safety, supported by attribution accuracy, governance-routing accuracy, citation validity, latency, and model cost.”

## 2. Golden dataset — 40 seconds

“I created a LangSmith golden dataset of forty human-authored synthetic operational cases: supplier fault, shared responsibility, internal causes, inconclusive evidence, and adversarial inputs. It also contains five counterfactual pairs. In each pair, the incident looks nearly identical, but one evidence fact changes the correct outcome. This checks whether the system reads evidence rather than following a convenient label.”

Show the LangSmith dataset and open one counterfactual pair.

## 3. Trace design — 30 seconds

“Every case creates one root trace with child runs for evidence retrieval, the OpenAI causal-evidence critic, and ClaimGuard routing. Each trace carries the case ID, scenario, dataset version, agent version, and prompt version, so aggregate scores remain connected to an inspectable execution.”

Open one trace and expand the retrieval, model, and governance children.

## 4. Baseline and failure analysis — 55 seconds

“The baseline gave the critic only a proposed cause, confidence, and evidence identifiers. False-blame safety remained at one hundred percent, but attribution accuracy was only twenty percent and governance accuracy was forty percent. The model usually returned inconclusive because an identifier is not evidence. All supplier cases and all internal-cause cases were missed. The baseline was safe because it escalated uncertainty, not because it understood the incident. That made it too conservative to be useful.”

Show the baseline results and one inconclusive trace.

## 5. Improvements — 55 seconds

“I made four targeted changes. First, exact identifiers now resolve to bounded incident, change, RCA, asset, work-log, and contract records. Second, the model receives the evidence contents rather than only their IDs. Third, it must classify evidence as sufficient, conflicting, or insufficient before attribution. Fourth, retrieved text is treated as untrusted data and ClaimGuard still controls the final route after the model.”

Show the improved prompt or implementation and the adversarial test.

## 6. Measured delta — 55 seconds

“On the same forty cases, attribution accuracy increased from twenty to one hundred percent, and governance routing increased from forty to one hundred percent. False-blame safety and citation validity remained at one hundred percent. The improved version also reduced p95 latency from about twenty-one seconds to about eighteen seconds. It used more input tokens because it received the evidence, but fewer output and reasoning tokens, so observed model cost fell slightly.”

Show the baseline-versus-improved table and the same counterfactual pair in both versions.

## 7. Honest limitations and conclusion — 40 seconds

“A perfect score does not mean production readiness. These cases are synthetic and intentionally structured. The next step is anonymized human-reviewed incidents with missing records, stale contracts, multiple suppliers, and contradictory evidence, followed by a rationale judge calibrated against domain reviewers. The key learning is simple: IDs are not evidence. AfterPO should retrieve first, reason second, calculate deterministically, and govern every commercial effect.”

End on: “No proof. No action.”

## LangSmith evidence to capture

1. Dataset page showing 40 cases and scenario metadata.
2. Baseline root trace `01a070e5-3c5d-7000-8000-0364f07db502` with child runs expanded.
3. Improved root trace `01a070e9-7d9a-7000-8000-035cea7008b3` with child runs expanded.
4. One counterfactual pair from `PAIR-1` to `PAIR-5`.
5. Baseline and improved aggregate results side by side.
