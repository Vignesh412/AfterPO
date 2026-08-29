AfterPO — Project Documentation
1. Project Overview
AfterPO is an AI-assisted, governed supplier work-accounting platform.
Procurement systems record what an organization purchases and what suppliers charge. They rarely capture the operational work created after the purchase, such as incidents, engineering intervention, maintenance activity, operational recovery and asset disruption.
AfterPO connects this operational history to the relevant supplier, evaluates responsibility, calculates the resulting burden and records the outcome in a governed Supplier Work Ledger.
Approved entries can subsequently be compiled into a Reverse Invoice for procurement review.
Core principle
No proof. No action.
No supplier-related commercial action should proceed without traceable evidence and an appropriate governance decision.

2. Problem Statement
Supplier performance information is fragmented across the enterprise.
Procurement teams can access purchase orders, contracts and invoices. Operational teams can access incidents, assets, work logs, changes and engineering investigations. These records are rarely connected.
This creates several problems:
Supplier-created operational work remains hidden.
Procurement sees the purchase price but not the broader operational impact.
Engineering and operations repeatedly absorb supplier-related effort.
Contractual recovery opportunities are difficult to identify.
Supplier attribution becomes subjective and difficult to defend.
AI-generated conclusions create risk when used without governance.
Unsupported claims can damage supplier trust.
AfterPO addresses this gap by creating an evidence-backed economic record of supplier-created work.

3. Target Users
Primary user
Vendor or supplier managers responsible for supplier performance, operational accountability and commercial reviews.
Supporting users
Procurement owners
Operations managers
Engineering leaders
Contract managers
Finance and recovery teams
Risk and governance teams
Internal auditors

4. Solution Summary
AfterPO follows this end-to-end process:
Enterprise work records
        ↓
Supplier relationship resolution
        ↓
Deterministic baseline attribution
        ↓
OpenAI causal-evidence critique
        ↓
Deterministic cost calculation
        ↓
Proof-packet generation
        ↓
ClaimGuard governance
        ↓
Human approval when required
        ↓
Decision receipt
        ↓
Governed Supplier Work Ledger
        ↓
Reverse Invoice
AI assists with relationship discovery, causal analysis and evidence critique. The model's structured assessment is carried into the proof packet rather than running as a disconnected advisory branch.
Deterministic rules calculate financial values and apply policy thresholds.
ClaimGuard determines whether a proposed claim may be allowed, held for human review or blocked.

5. What Has Been Built
The working prototype includes:
Supplier Command Centre
Supplier Work Ledger
Evidence-backed proof packets
Governance Queue
ClaimGuard policy evaluation
Manual approval and rejection controls
Live dashboard-to-n8n webhook integration
Governance decision receipts
Governed Reverse Invoice
Four n8n workflow implementations
Synthetic enterprise operational records
Versioned governance policy
Evaluation cases for expected outcomes
Interactive product experience

6. Product Components
6.1 Supplier Command Centre
The Supplier Command Centre provides an aggregated view of operational work connected to a supplier.
It presents:
Contract invoice context
Supplier-attributed operational burden
Potential contract recovery
Evidence coverage
Supplier-related work records
Governance warnings
Access to the Work Ledger and Reverse Invoice
Its purpose is to reveal the operational impact that is not visible in the supplier invoice alone.
6.2 Supplier Work Ledger
The Supplier Work Ledger records operational events connected to a supplier relationship.
Each entry contains:
Work-record identifier
Incident or operational event
Proposed supplier attribution
Attribution confidence
Operational burden
Potential recoverability
Governance decision
Evidence and execution references
Possible states include:
Allowed
Approval required
Blocked
Posted after approval
6.3 Proof Packet
Every proposed supplier attribution is supported by a proof packet.
A proof packet contains:
Source work record
Affected asset or configuration item
Supplier relationship
Causal finding
Source evidence identifiers
Contract basis
Confidence assessment
AI evidence critique, competing cause and rationale
Baseline-versus-model conflict indicator
Proposed financial effect
Governance decision
Policy version
Execution reference
The packet makes every claim inspectable, traceable and replayable.
6.4 Governance Queue
The Governance Queue contains cases that cannot safely be decided automatically.
A case may require human review when:
Responsibility is shared.
Confidence is insufficient for automatic action.
Commercial judgment is required.
Financial impact exceeds a policy threshold.
The proposed action has an external effect.
Separation of duties requires an independent owner.
The reviewer provides:
Approver identity
Approval or rejection decision
Business rationale
6.5 Reverse Invoice
The Reverse Invoice is an evidence statement generated from the governed Supplier Work Ledger.
It includes only entries that have been allowed or explicitly approved.
It excludes:
Blocked claims
Inconclusive claims
Claims awaiting approval
Records with insufficient evidence
The Reverse Invoice is not automatically sent to the supplier. It remains a procurement-controlled commercial artifact.

7. ClaimGuard Governance Model
ClaimGuard is the policy and governance layer positioned between AI-generated proposals and consequential actions.
It does not simply approve or reject an AI agent. It evaluates the evidence, proposed action and authority behind each claim.
Governance inputs
ClaimGuard evaluates:
Evidence completeness
Source traceability
Attribution confidence
Contradictory evidence
Financial impact
External effect
Requesting actor
Approving actor
Separation of duties
Applicable policy version
ALLOW
A claim may be allowed when:
Required evidence is present.
Supplier causality is sufficiently supported.
No material contradictory evidence is found.
The proposed action remains inside the permitted policy boundary.
APPROVAL_REQUIRED
Human approval is required when:
Responsibility is shared.
Commercial judgment is necessary.
The impact exceeds an automatic threshold.
Independent human authority is required.
The action could affect a supplier or financial record.
BLOCK
A claim is blocked when:
Evidence is missing.
Internal causality contradicts supplier responsibility.
The requesting agent attempts to approve its own claim.
The proposed action exceeds permitted authority.
The available evidence cannot support the supplier attribution.
Governance principle
The agent proposes. ClaimGuard constrains. An authorized human decides consequential cases.

8. AI and Deterministic Responsibilities
AfterPO separates AI-assisted reasoning from deterministic financial calculation.
AI-assisted responsibilities
AI may assist with:
Resolving supplier relationships
Interpreting operational descriptions
Proposing causal attribution
Identifying competing causes
Summarizing supporting evidence
Producing a confidence assessment
Challenging whether the cited evidence is sufficient to support the baseline attribution
Deterministic responsibilities
Rules and code control:
Work-hour calculations
Cost-rate application
Supplier-share calculations
Recoverability calculations
Policy thresholds
Governance classification
State transitions
Receipt generation
Inclusion in the Reverse Invoice
This separation prevents generated language from directly becoming a financial claim.
The model cannot calculate money, approve a claim or trigger an external action. If its assessment is inconclusive or conflicts with the baseline attribution, the proof packet records the conflict and recommends human review.

9. n8n Workflows
Workflow 01 — Work Intake and Attribution
Purpose: convert enterprise work records into structured proof packets.
The workflow:
Loads enterprise work records.
Processes each record individually.
Resolves the responsible supplier relationship.
Creates a deterministic supplier-versus-internal baseline attribution.
Passes that baseline and its cited evidence through a live OpenAI causal-evidence critic.
Parses the model's structured attribution, confidence, competing cause, evidence identifiers and rationale.
Flags inconclusive or conflicting assessments for governance review.
Calculates operational burden.
Produces a proof packet containing both the baseline and the model critique.
Output: evidence-backed claims ready for governance.
Workflow 02 — ClaimGuard Governance
Purpose: apply governance policy to each proposed claim.
The workflow:
Receives the proof packet.
Validates required evidence.
Checks confidence and competing causes.
Applies ClaimGuard policy.
Determines whether human approval is required.
Allows, holds or blocks the claim.
Produces a decision receipt.
Output: governed claim status with an audit record.
Workflow 03 — Dashboard Governance API
Purpose: connect the product dashboard to live n8n processing.
The workflow:
Receives a decision through a webhook.
Validates the case and decision value.
Validates the actor and rationale.
Binds the decision to an evidence reference.
Attaches policy metadata.
Creates an approval or rejection receipt.
Returns the receipt to the dashboard.
Output: a validated receipt that authorizes the corresponding dashboard state change.
Workflow 04 — Governed Reverse Invoice
Purpose: compile governed ledger entries into a supplier statement.
The workflow:
Loads the governed ledger.
Selects only eligible posted entries.
Compiles the Reverse Invoice.
Pauses for procurement review.
Captures approval or rejection.
Records reviewer identity and rationale.
Creates the appropriate audit receipt.
Output: an approved or rejected Reverse Invoice record. External transmission remains disabled.

10. Receipt-Gated State Changes
A dashboard click alone cannot alter the governed financial state.
The process is:
The user submits a decision.
The dashboard sends the decision to n8n.
n8n validates the request.
n8n applies the relevant governance policy.
n8n creates a trusted receipt.
The receipt is returned to the product.
The dashboard validates the response.
Only then does the ledger update.
If the workflow fails, times out or returns an invalid response, the previous ledger state is preserved.
This pattern ensures that visible product state is supported by a recorded governance outcome.

11. Technology Stack
Front end
React
TypeScript
Vite
CSS
Lucide React
Recharts
Workflow orchestration
n8n Cloud
Webhook triggers
Manual triggers
Code nodes
Conditional routing
Wait and form-based approval
Workflow execution history
AI model
OpenAI Chat Model through n8n
Structured causal-evidence critique
Prototype data
Synthetic JSON operational records
Synthetic supplier and contract information
Versioned JSON governance policy
JSON evaluation cases
Browser local storage for temporary demonstration state
Development and delivery
Node.js
npm
TypeScript compiler
Vite production build
Git
GitHub

12. Running the Project
Requirements
Node.js
npm
A modern web browser
n8n access for the live workflow components
Installation
git clone https://github.com/Vignesh412/AfterPO.git
cd AfterPO
npm install
Start the application
npm run dev
Open:
http://localhost:4174
Validate the project
npm run typecheck
npm run build

13. Synthetic Prototype Data
The prototype uses synthetic enterprise records so that the experience is safe, repeatable and independent of production credentials.
The test data represents several governance conditions:
A supplier-attributed operational failure
Shared responsibility between a supplier and internal operations
A claim blocked because internal evidence contradicts supplier responsibility
No production customer, employee, supplier or operational information is used.

14. Safety Controls
The prototype intentionally prevents autonomous external action.
It does not:
Contact suppliers
Send financial statements externally
Issue debit notes
Move money
Modify contracts
Change purchase orders
Create legal commitments
Allow an agent to approve its own claim
All consequential commercial actions remain under explicitly authorized human control.


15. Evaluation Approach
The evaluation set checks whether the system:
Resolves the intended supplier relationship
Preserves the relevant source evidence
Identifies internal or competing causes
Applies the expected attribution
Produces the correct governance status
Requires human approval when appropriate
Blocks unsupported supplier claims
Excludes blocked claims from the Reverse Invoice
Primary success criterion
Every seeded work record should receive its expected governed outcome without producing an unsupported supplier claim.
Trust priority
A false supplier attribution is treated as more harmful than failing to automate a potentially valid claim.
When evidence is uncertain, the system should hold or block the claim instead of creating an unsupported commercial effect.

16. Prototype Limitations
The current project is a functional prototype rather than a production deployment.
Current limitations include:
Synthetic rather than live enterprise data
Prototype attribution logic
One live model-based causal-evidence critic without production source-record retrieval or confidence calibration
Browser-local demonstration state
No production identity provider
No enterprise role-based access controls
No production audit database
No live contract-document retrieval
No accounting-system posting
No automated supplier transmission
No legal or finance-system integration
These boundaries are deliberate and are visible within the product experience.

17. Production Integration Path
A production version could connect to:
Incident-management systems
Asset and configuration-management databases
Change-management records
Work-order systems
Field-service platforms
Engineering work logs
Procurement platforms
Contract repositories
Supplier-management systems
Finance and recovery systems
Enterprise identity and approval services
The synthetic data loaders would be replaced by authenticated API connections.
Every external write would remain behind ClaimGuard and the organization’s approval framework.

18. Future Enhancements
Potential enhancements include:
Hybrid retrieval for semantic concepts and exact identifiers
Contract-clause retrieval with source citations
Supplier relationship graph
Time-window and causal-sequence analysis
Multi-supplier responsibility allocation
Confidence calibration using reviewed cases
Policy simulation before deployment
Role-based governance thresholds
Central audit and replay console
Supplier dispute workflow
Human feedback collection
Portfolio-level supplier comparisons
Enterprise procurement and operational integrations

19. Competitive Differentiation
AfterPO does not attempt to replace procurement intake or purchasing orchestration.
Its differentiated opportunity is the post-purchase operational layer.
Procurement platforms understand:
What was requested
What was approved
What was purchased
What was invoiced
Operational systems understand:
What failed
Which assets were affected
What work was performed
What changes occurred
How the business was affected
AfterPO connects these operational records to commercial accountability.
Its key differentiators are:
Supplier work accounting after purchase
Evidence-backed causal attribution
Deterministic cost calculation
Governance before commercial effect
Separation between agent proposal and human authority
Receipt-gated ledger changes
Protection against unsupported supplier blame
Reverse Invoices built only from governed evidence

20. Final Product Statement
AfterPO is the governed economic record of supplier-created work.
It connects operational evidence, AI-assisted attribution, deterministic economics, policy enforcement and human authority to answer:
What work did this supplier cause after the purchase, and what governed commercial action should follow?
AfterPO’s operating principle remains:
No proof. No action.
