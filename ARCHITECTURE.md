# Architecture

## Control flow

```text
Enterprise work record
        │
        ▼
Relationship Agent ── missing link ──► retry once ──► human mapping queue
        │
        ▼
Attribution Agent ── conflicting proof ──► Evidence Investigator
        │
        ▼
Deterministic Cost Engine
        │
        ▼
Proof Packet Builder
        │
        ▼
┌───────────────────────────────────┐
│ CLAIMGUARD               │
│ identity · authority · evidence   │
│ confidence · SoD · risk tier      │
└───────────────────────────────────┘
       │             │          │
     ALLOW       APPROVAL      BLOCK
       │             │          │
       ▼             ▼          ▼
 Supplier Work    Wait node   Audit only
    Ledger        + human
       │
       ▼
Reverse Invoice ──► procurement approval ──► supplier portal (future)
```

## Agents

### Relationship Agent

Resolves the chain from a work record to the affected asset, service, product, contract, and supplier. Read-only.

### Attribution Agent

Classifies supplier, shared, internal, unrelated, or inconclusive responsibility. It must expose contradictory evidence rather than averaging it away.

### Cost Agent

Applies approved rate cards to recorded work time and impact. All arithmetic is deterministic and replayable.

### Contract Agent

Separates contractually recoverable value from wider operational burden. Contract ambiguity is routed to a human; it is never silently interpreted into a financial claim.

### Governance Agent (ClaimGuard)

Evaluates proof sufficiency, authorization, confidence, separation of duties, risk, and approval requirements. It cannot modify source evidence.

### Reverse Invoice Agent

Compiles approved ledger entries into a monthly evidence statement. It cannot send the statement or issue a debit without approval.

## State

Persistent production state:

- supplier and asset relationships,
- evidence snapshots,
- attribution results,
- cost calculations,
- governance decisions,
- human approvals and rejections,
- monthly ledger entries,
- supplier disputes,
- workflow and policy versions.

The prototype keeps UI state in memory and provides JSON fixtures representing the persistent records. n8n execution history preserves workflow runs.

## Tool boundaries

| Tool | Access | Purpose |
|---|---|---|
| Enterprise record API | Read | Operational evidence |
| Contract repository | Read | Entitlements and exclusions |
| Rate-card calculator | Deterministic | Cost computation |
| Ledger store | Write after governance | Approved work entries |
| Supplier case API | Write after approval | Future remediation/dispute workflow |

## Failure handling

| Failure | Behaviour |
|---|---|
| Operational record lookup fails | Retry twice with backoff, then mark source unavailable |
| Supplier relationship missing | Stop attribution and create human mapping request |
| Evidence conflicts | Set `inconclusive` and route to independent review |
| Confidence below 0.75 | Block ledger posting |
| Cost field missing | Exclude financial amount; never estimate silently |
| LLM unavailable | Preserve records and run deterministic cases only |
| Approval times out | Keep action held; never default to approval |
| Supplier-facing API fails | Retry once, preserve draft, alert vendor manager |

## Separation of duties

```text
Relationship Agent → discovers links
Attribution Agent  → proposes responsibility
Cost Agent         → computes amount
ClaimGuard           → evaluates policy
Operations Owner   → approves shared attribution
Vendor Manager     → approves supplier communication
Finance/Legal      → approves financial or legal commitment
```

## Production platform migration

The proof of concept uses n8n as the required no-code orchestrator. In a production operations product, the same concepts map to AI Agent Orchestrator, Flow Designer, Vendor Management Workspace, Supplier Lifecycle Operations, Contract Management Pro, Performance Analytics, and approval records.
