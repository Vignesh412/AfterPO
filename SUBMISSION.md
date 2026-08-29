# Week 3 Project Documentation — AfterPO

## Project overview

AfterPO is a governed post-purchase supplier work-accounting system. Procurement systems record what was ordered and invoiced; AfterPO connects the operational work that follows—incidents, assets, changes, work logs, causal evidence, and contract recovery—to the accountable supplier relationship.

The product produces an evidence-backed Supplier Work Ledger and a governed Reverse Invoice. Reasoning stages propose relationships and responsibility, deterministic code calculates financial effects, ClaimGuard applies policy, and consequential actions are handed to an authorized human.

**Product principle:** No proof. No action.

## Agent primer

My agent helps vendor and operations managers investigate supplier-created operational work in a web dashboard, replacing manual reconciliation across incidents, work logs, assets, contracts, and spreadsheets. It resolves supplier relationships, proposes causality, calculates burden, builds proof packets, and compiles a governed Reverse Invoice using five bounded tools; it hands shared attribution and every external or financial action to a human, and succeeds when every seeded case reaches the expected governed outcome with zero unsupported supplier charges.

## User and problem

Vendor managers, procurement owners, and operations leaders can see contract spend and supplier KPIs, but struggle to translate operational history into defensible supplier accountability. Evidence is scattered across operational systems, and manual reconciliation is slow, inconsistent, and vulnerable to unsupported blame.

## Surface and technology

- React, TypeScript, Vite, Recharts, and Lucide React for the web product
- n8n Cloud for triggers, orchestration, branching, webhooks, waits, and approval
- Synthetic JSON operational records and a versioned JSON policy
- Browser local storage for prototype UI state
- n8n execution history and decision receipts for workflow traceability
- npm, TypeScript validation, Git, and GitHub for delivery

## End-to-end control flow

1. Load an enterprise work record.
2. Resolve the asset or service relationship to a supplier.
3. Investigate causal and contradictory evidence.
4. Propose supplier, shared, internal, unrelated, or inconclusive responsibility.
5. Calculate operational burden using deterministic rules.
6. Build a proof packet with source identifiers and policy metadata.
7. Evaluate the claim through ClaimGuard.
8. Allow, hold for independent approval, or block the claim.
9. Require a valid n8n receipt before changing the ledger state.
10. Compile only posted entries into a Reverse Invoice.
11. Require procurement approval before any future supplier-facing action.

## What was built

- Supplier Command Centre and Supplier Work Ledger
- Inspectable proof packets with causal findings and source references
- Governance Queue for shared-responsibility cases
- ClaimGuard outcomes: `ALLOW`, `APPROVAL_REQUIRED`, and `BLOCK`
- Live dashboard-to-n8n webhook integration
- Manual approval and rejection with identity and rationale
- Approval and rejection receipts
- Receipt-gated dashboard mutation
- Governed Reverse Invoice
- Four importable n8n workflows
- Synthetic operational dataset and versioned policy
- Five-case evaluation specification
- Twenty-one-screen guided product story

## Specialized stages

**Relationship stage:** resolves the chain from work record to asset, service, contract, and supplier. It is read-only and stops when a relationship cannot be established.

**Attribution stage:** creates the deterministic baseline, while a genuine OpenAI model call independently critiques the available causal evidence. The critic returns an attribution, confidence, competing cause, cited evidence identifiers, and rationale; it cannot calculate money or authorize action.

**Cost stage:** applies approved rate cards, recorded work, supplier share, and impact rules. Arithmetic is deterministic and replayable.

**Contract stage:** separates contractually recoverable value from wider operational burden. Ambiguity is routed to a human.

**ClaimGuard:** evaluates proof sufficiency, confidence, authority, separation of duties, financial impact, and external effect.

**Reverse Invoice stage:** compiles eligible ledger entries into an evidence statement but cannot send it or create a financial commitment.

## Tools and permissions

| Tool | Permission | Purpose |
|---|---|---|
| Enterprise record lookup | Read | Retrieve incidents, assets, changes, work logs, and evidence |
| Contract and entitlement lookup | Read | Retrieve recovery clauses and supplier terms |
| Rate-card calculator | Deterministic compute | Calculate burden and supplier share |
| Supplier Work Ledger | Governed write | Post only policy-allowed or human-approved entries |
| Supplier case API | Future governed write | Create remediation activity only after approval |

## State and memory

The prototype keeps dashboard state in browser local storage and preserves workflow runs in n8n execution history. Each decision carries the case, actor, rationale, evidence reference, policy version, receipt identifier, and timestamp.

A production implementation would persist relationships, evidence snapshots, attribution outcomes, calculations, policy versions, approvals, rejections, ledger entries, disputes, and workflow versions. A rejected claim must not silently return as approved unless new evidence creates a new governed review.

## Human-in-the-loop

Human review is required for shared or inconclusive attribution, material ledger entries, supplier communication, and every financial or legal action. The proposing stage cannot approve its own output.

The reviewer supplies an accountable identity, an explicit decision, and a rationale. Approval timeout leaves the claim on hold and never defaults to approval.

## ClaimGuard governance

ClaimGuard evaluates required evidence, traceability, confidence, contradictory evidence, financial effect, actor identity, separation of duties, and external impact.

- `ALLOW`: evidence is complete and the state change is within policy.
- `APPROVAL_REQUIRED`: responsibility is shared, judgment is needed, or independent authority is required.
- `BLOCK`: evidence is missing or contradictory, authority is insufficient, or self-approval is attempted.

## Receipt-gated state changes

A dashboard click does not directly alter the governed ledger. The dashboard sends the decision to n8n, waits for validation, and updates only after receiving a valid receipt. A failed request, malformed response, or missing receipt preserves the previous state.

## n8n workflows

### Workflow 01 — Work Intake and Attribution

Loads work records, resolves supplier relationships, creates a deterministic attribution baseline, invokes an OpenAI causal-evidence critic, calculates burden, and builds proof packets. The model is intentionally advisory and cannot authorize a write.

### Workflow 02 — ClaimGuard Governance

Validates proof, applies policy, branches between allow, approval, and block, and records the outcome.

### Workflow 03 — Dashboard Governance API

Receives decisions through a webhook, validates actor and rationale, binds the decision to evidence, and returns an APR or REJ receipt.

### Workflow 04 — Governed Reverse Invoice

Compiles posted entries, pauses for procurement review, branches on approval or rejection, and creates the corresponding receipt. Supplier transmission remains disabled.

## Failure handling

| Failure | Safe behaviour |
|---|---|
| Dashboard webhook or n8n response fails | Preserve the previous ledger state |
| Supplier relationship is missing | Stop attribution and request human mapping |
| Evidence conflicts | Mark inconclusive and require independent review |
| Confidence is below policy threshold | Prevent automatic posting |
| Monetary input is missing | Exclude the amount; never invent it |
| Reasoning model is unavailable | Preserve records, flag the missing critique, and retain the deterministic baseline without allowing the model to authorize action |
| Approval times out | Keep the claim held |
| Supplier-facing integration fails | Preserve the draft and alert its owner |
| Receipt is malformed or missing | Reject the state mutation |

The prototype visibly implements receipt-gated mutation, human approval, blocking, and safe state preservation. Retry queues and enterprise alerts are production-direction controls rather than live external integrations in this prototype.

## Dataset used

The project uses synthetic JSON data modelled on enterprise operational records. No real supplier, employee, customer, or production data is included.

It contains supplier and contract identifiers, assets, incidents, severity, recorded work, root-cause findings, changes, contradictory evidence, operational impact, supplier share, rate-card categories, and contract recovery context.

The dashboard cases represent supported supplier responsibility, shared responsibility, and false supplier attribution caused by an internal change. Two additional evaluation specifications cover a missing supplier relationship and conflicting root-cause evidence.

## Evaluation

| Case | Expected outcome | Prototype status |
|---|---|---|
| Supported supplier defect | `ALLOW` | Implemented and demonstrated |
| Supplier defect with deferred internal mitigation | `APPROVAL_REQUIRED` | Implemented and demonstrated |
| Unauthorized internal change before failure | `BLOCK` | Implemented and demonstrated |
| Missing asset-to-supplier relationship | `BLOCK` and manual mapping | Specified; production-path case |
| Supplier relationship with conflicting root cause | `APPROVAL_REQUIRED` | Specified; production-path case |

Success targets are zero unsupported supplier charges, zero external actions without approval, and complete proof fields for every posted entry. These are prototype targets, not claims of production accuracy.

## Vibe-coding prompts used

1. “Find a narrow, real-world supply-chain opportunity that can differentiate an enterprise workflow platform from procurement orchestration products.”
2. “Design an evidence-first supplier work ledger using operational records rather than procurement spend alone.”
3. “Create a governance middle layer where every proposed action is evidence-bound, risk-tiered, and replayable.”
4. “Separate probabilistic causal attribution from deterministic financial calculations.”
5. “Design a case where the system rejects a financially attractive but incorrect supplier claim.”
6. “Build a live n8n approval flow that captures identity and rationale and returns a receipt before the dashboard changes.”
7. “Build an executive-grade interface that exposes the proof packet, decision, and commercial boundary.”
8. “Turn the product into a concise guided demonstration with visible interactions and n8n execution evidence.”

## How AI coding tools were used

Codex was used as an AI coding partner to research and narrow the concept, structure the architecture, build and iterate on the React interface, create n8n workflow exports, refine ClaimGuard policy, generate synthetic cases, diagnose interaction issues, and validate the TypeScript and production build. Human judgment determined the use case, governance boundaries, product language, interaction sequence, and approval model.

## Iterations tried

1. **Contract analysis and recovery:** rejected as too close to established contract and procurement capabilities.
2. **Supply-chain digital twin:** rejected as broad, common, and difficult to prove within the project scope.
3. **Cross-company orchestration:** differentiated but too large for a credible end-to-end prototype.
4. **Contract Reality Engine:** promising but still broad until narrowed to supplier-created work.
5. **Supplier Work Ledger:** selected as the focused post-purchase operational evidence layer.
6. **Governance refinement:** simplified into ClaimGuard and “No proof. No action.”
7. **Interaction refinement:** duplicate approval experiences were removed; the final flow uses one human-decision path and receipt-gated updates.
8. **Brand refinement:** renamed AfterPO to express the gap the product owns—what happens after procurement completes the purchase.

## Learnings and observations

- The differentiated opportunity is not another purchasing interface; it is the governed operational record after purchase.
- Causal attribution and financial calculation should not be performed by the same probabilistic component.
- Governance is most useful as an active middle layer, not a final compliance report.
- Human approval is meaningful only when identity, rationale, evidence, and policy version travel together.
- A trustworthy system must demonstrate when it refuses to blame a supplier.
- Product state should change only after a valid orchestration receipt.
- Exact identifiers benefit from literal lookup as well as semantic reasoning; production retrieval should be hybrid.
- Synthetic data makes the prototype repeatable, but production confidence requires calibrated models and reviewed historical cases.

## Current implementation boundary

The current n8n prototype implements specialized stages with triggers, Code nodes, a Basic LLM Chain connected to an OpenAI Chat Model, conditional routing, waits, forms, and webhooks. The genuine model call acts as a causal-evidence critic and returns structured JSON. The tested critic correctly challenged a seeded supplier claim when only evidence identifiers—not the underlying RCA detail—were present in its input.

The deterministic baseline continues to drive the repeatable demonstration, while the critic supplies an independent challenge signal. Production integration would enrich the critic with bounded read tools for the cited source records and route its structured result into ClaimGuard. Deterministic calculation and ClaimGuard remain outside the model and control every write or external effect.

## Safety limits

AfterPO never autonomously alters evidence, treats correlation as proven causation, invents missing monetary values, allows self-approval, contacts a supplier, moves money, changes a contract or purchase order, or creates a legal commitment.

## Current limitations

- Synthetic records rather than live enterprise APIs
- One live model-based evidence critic, but no calibrated production attribution model or source-record tools yet
- Browser-local state rather than an enterprise ledger database
- No production identity provider or role-based access control
- No live contract-document retrieval or accounting integration
- No supplier transmission
- Two evaluation cases specified but not exercised in the live dashboard

## Production path

A production version would connect to incident, asset, change, work-order, engineering, contract, procurement, supplier, finance, and enterprise identity services. It would add hybrid retrieval, calibrated causal models, persistent audit records, retry queues, role-based approval, and monitored integrations.

All external writes would remain behind ClaimGuard and the organization’s approval framework.

## Final product statement

AfterPO is the governed economic record of supplier-created work. It connects operational evidence, structured attribution, deterministic economics, policy enforcement, and human authority to answer:

> What work did this supplier cause after the purchase, and what governed commercial action should follow?

**No proof. No action.**
