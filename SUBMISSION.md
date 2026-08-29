# Week 3 Submission — AfterPO

## Project overview

AfterPO is a multi-agent post-purchase supplier cost intelligence system. It measures the hidden enterprise effort created by suppliers rather than limiting supplier economics to invoices and purchase orders. Its output is a governed Supplier Work Ledger and a monthly Reverse Invoice showing operational burden, recoverable credits, excluded attribution, and supporting evidence.

## User and problem

Vendor managers and operations leaders can see contract spend and supplier KPIs, but they struggle to translate incidents, field work, emergency changes, security remediation, and customer escalations into a defensible supplier cost. The current workflow requires manual spreadsheet reconciliation and often produces unfair or unsupported supplier attribution.

## Agent goal

Convert enterprise operational work into an evidence-backed supplier cost ledger without allowing unsupported, self-approved, or unauthorized external actions.

## Surface

- n8n for orchestration
- Web dashboard for investigation and approval
- enterprise-style APIs/data as the enterprise target

## Workflow

1. Receive a work record.
2. Discover the asset/service-to-supplier relationship.
3. Investigate causal evidence.
4. Allocate supplier and internal responsibility.
5. Calculate recorded work and impact costs deterministically.
6. Build a proof packet.
7. Evaluate the action through ClaimGuard.
8. Post, hold for approval, or block.
9. Compile approved entries into a Reverse Invoice.
10. Require approval before supplier communication.

## Tools

- Operational record lookup — read
- Contract and entitlement lookup — read
- Deterministic cost calculator — read/compute
- Supplier Work Ledger — governed write
- Supplier case/communication — governed external write

## Memory

The production design persists supplier relationships, proof packets, attribution outcomes, cost calculations, policy versions, and human decisions. A previously rejected attribution is not silently regenerated without new evidence.

## Hard limits

The system never:

- alters source evidence,
- treats correlation as causation,
- lets an agent approve its own output,
- estimates missing monetary values without an approved rule,
- contacts a supplier without vendor-manager approval,
- issues a payment, debit, or contractual commitment.

## Human-in-the-loop

Humans review shared or inconclusive attribution, material ledger entries, supplier communication, and every financial or legal action. Approval timeout leaves the action on hold.

## Dataset

Synthetic data modelled on enterprise operations platform records:

- suppliers and contracts,
- configuration items/assets,
- incidents and problems,
- work logs,
- changes,
- field work orders,
- operational impact,
- rate cards,
- contract entitlements.

The demo contains three primary cases: supplier responsibility, shared responsibility, and false supplier attribution caused by an internal change.

## Vibe-coding prompts used

1. “Design an evidence-first supplier work ledger using enterprise operational records rather than procurement spend alone.”
2. “Create a governance layer where every agent action is authorized, evidence-bound, risk-tiered, and replayable.”
3. “Separate probabilistic attribution from deterministic financial calculations.”
4. “Design a demo where the agent rejects a financially attractive but incorrect supplier claim.”
5. “Build an executive-grade interface that makes the proof packet and human decision visible.”

## Iterations and learning

Earlier concepts focused on contract extraction, supplier disruption, and service-credit recovery. Research showed that enterprise operations platform and specialist CLM/recovery vendors already cover much of that territory. The project was narrowed to a operations-native asset: the full lifecycle of enterprise work. The key learning was that differentiation comes from creating a governed economic record from work history, not from summarizing contracts or supplier scores.

## Evaluation

The included evaluation set measures:

- correct supplier attribution,
- correct shared-responsibility allocation,
- false-attribution prevention,
- missing-relationship handling,
- conflicting-evidence escalation,
- deterministic cost correctness,
- unauthorized action count.

Targets:

- 100% correct outcome on five seeded scenarios,
- zero unsupported supplier charges,
- zero external actions without approval,
- 100% ledger entries contain required proof fields.

## Current limitations

- Uses synthetic records rather than a live enterprise operations platform instance.
- Attribution is demonstrated with seeded logic; production deployment requires evaluated models and organization-specific causal policies.
- Reverse Invoice is an evidence statement, not a legally enforceable invoice.
- Cross-platform labour and business-impact rates require Finance ownership.

## Future enterprise operations platform implementation

Use enterprise operations platform Table APIs or native records for Incident, CMDB, Change, Work Order, Vendor, Contract, Supplier Case, and Performance Analytics. Use platform approval and audit features for governance. The prototype deliberately keeps all external actions disabled.
