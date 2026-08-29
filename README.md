# AfterPO — Post-Purchase Supplier Cost Intelligence

**Week 3: Build Your AI Agent — submission-ready prototype**

AfterPO creates a governed economic ledger of the work suppliers cause across an enterprise. It connects enterprise-style incidents, assets, changes, work orders, and contracts; attributes responsibility; prices the resulting internal effort; and generates a Reverse Invoice that contains only evidence-backed, approved entries.

> Procurement records what suppliers charge. AfterPO records the work suppliers cause.

## The one-liner

My agent helps vendor and operations managers calculate the hidden operational cost of critical suppliers in a web dashboard, replacing weeks of manual reconciliation across incidents, work logs, contracts, and spreadsheets. It discovers supplier relationships, investigates causality, prices internal work, and compiles a governed Reverse Invoice using five tools; it hands shared attribution and every external or financial action to a human, and succeeds when all seeded costs are attributed correctly with zero unsupported supplier charges.

## What is included

- Interactive React/Vite product demonstration
- Four importable n8n workflows
- Synthetic enterprise work operational records
- Versioned governance policy
- Five-case evaluation set
- Architecture and product documentation
- Week 3 submission write-up

## Run the dashboard

From the repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:4174`.

Production checks:

```bash
npm run typecheck
npm run build
```

## Import the n8n workflows

In n8n, choose **Workflows → Import from File** and import in this order:

1. `workflows/01-work-intake-and-attribution.json`
2. `workflows/02-afterpo-governance.json`
3. `workflows/03-reverse-invoice.json`
4. `workflows/04-dashboard-governance-api.json`

The provided exports run without credentials using deterministic synthetic data. Replace Code nodes with operational-system HTTP Request nodes and an LLM node when credentials are available. Secrets must remain in n8n Credentials.

## Governance model

Every proposed ledger entry must carry a proof packet:

- source work record,
- supplier relationship,
- causal finding,
- source evidence identifiers,
- deterministic cost calculation,
- confidence,
- policy version,
- requesting agent.

ClaimGuard returns one of three decisions:

- `ALLOW`
- `APPROVAL_REQUIRED`
- `BLOCK`

No agent can approve its own finding. Supplier communication and financial commitments are always human-controlled.

## Project structure

```text
afterpo/
├── data/             Synthetic operational records and policy
├── evals/            Seeded evaluation cases
├── src/              Interactive dashboard
├── workflows/        Importable n8n workflow exports
├── ARCHITECTURE.md    System design and failure handling
└── SUBMISSION.md      Week 3 documentation
```

## Production path

The prototype uses synthetic records to ensure a reliable demo. A production implementation would replace those records with enterprise record API reads from Incident, CMDB/Asset, Change, Work Order, Vendor, Contract, and Supplier Case tables. External writes would remain behind ClaimGuard and enterprise approval controls.

## Safety

This prototype does not contact suppliers, issue debit notes, change contracts, or move money. The Reverse Invoice is an evidence statement and requires explicit procurement approval.
