import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Ban,
  BookOpenCheck,
  Boxes,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  FileWarning,
  Fingerprint,
  Gauge,
  GitBranch,
  History,
  Network,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UserCheck,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  entries as initialEntries,
  LedgerEntry,
  monthlyTrend,
  rupees,
  Status,
} from "./data";

type View = "command" | "ledger" | "governance" | "invoice";

const statusLabel: Record<Status, string> = {
  approved: "Allowed",
  review: "Approval required",
  blocked: "Blocked",
};
const GOVERNANCE_WEBHOOK =
  import.meta.env.VITE_N8N_GOVERNANCE_WEBHOOK ||
  "https://vignesh412.app.n8n.cloud/webhook/nowledger-governance-a8f2c1";

function App() {
  const params = new URLSearchParams(window.location.search);
  const requestedView = params.get("view") as View | null;
  const requestedCase = params.get("case");
  const [view, setView] = useState<View>(
    requestedView &&
      ["command", "ledger", "governance", "invoice"].includes(requestedView)
      ? requestedView
      : "command",
  );
  const [entries, setEntries] = useState<LedgerEntry[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("nowledger.entries") || "null") ||
        initialEntries
      );
    } catch {
      return initialEntries;
    }
  });
  const [selected, setSelected] = useState<LedgerEntry>(
    () =>
      initialEntries.find((item) => item.id === requestedCase) ||
      initialEntries[1],
  );
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [operatorTarget, setOperatorTarget] = useState("");

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== "nowledger.entries" || !event.newValue) return;
      const next = JSON.parse(event.newValue) as LedgerEntry[];
      setEntries(next);
      setSelected(
        (current) => next.find((item) => item.id === current.id) || current,
      );
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const totals = useMemo(
    () =>
      entries.reduce(
        (acc, item) => {
          if (item.status !== "blocked") {
            const share = item.supplierShare / 100;
            acc.burden += (item.workCost + item.downtimeCost) * share;
            acc.recoverable += item.recoverable;
          }
          return acc;
        },
        { burden: 0, recoverable: 0 },
      ),
    [entries],
  );

  const decide = async (
    decision: "approved" | "blocked",
    approver: string,
    rationale: string,
  ) => {
    setSubmitting(true);
    setNotice(
      "ClaimGuard is validating the evidence and recording the decision in n8n…",
    );
    try {
      const response = await fetch(GOVERNANCE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({
          case_id: selected.id,
          statement_id: "RINV-2026-008",
          decision: decision === "approved" ? "APPROVE" : "REJECT",
          approver,
          rationale,
          evidence_hash: `SHA256-DEMO-${selected.id}-94F2`,
        }),
      });
      if (!response.ok) throw new Error(`n8n returned ${response.status}`);
      const receipt = await response.json();
      setEntries((current) => {
        const next = current.map((item) =>
          item.id === selected.id ? { ...item, status: decision } : item,
        );
        localStorage.setItem("nowledger.entries", JSON.stringify(next));
        return next;
      });
      setSelected((current) => ({ ...current, status: decision }));
      setNotice(`${receipt.message} Receipt ${receipt.receipt_id}`);
    } catch (error) {
      setNotice(
        `Governance workflow failed: ${error instanceof Error ? error.message : "unknown error"}. No ledger change was made.`,
      );
    } finally {
      setSubmitting(false);
      window.setTimeout(() => setNotice(""), 7000);
    }
  };

  useEffect(() => {
    const operator = params.get("operator");
    if (!operator) return;
    const run = params.get("run") || "default";
    const key = `nowledger.operator.${run}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "started");
    const navigate = (
      target: string,
      nextView: View,
      entry: LedgerEntry,
      message: string,
    ) => {
      setView("command");
      setSelected(entry);
      setOperatorTarget(target);
      window.setTimeout(() => {
        setOperatorTarget("");
        setView(nextView);
        setNotice(message);
      }, 3000);
    };
    if (operator === "open-ledger") {
      navigate(
        "view-ledger",
        "ledger",
        initialEntries[0],
        "Operator opened Work ledger. The source work record and its proof packet are now visible.",
      );
      return;
    }
    if (operator === "inspect-blocked") {
      navigate(
        "inspect-blocked",
        "ledger",
        initialEntries[2],
        "Operator opened the blocked claim. The contradictory internal-change evidence is preserved in its proof packet.",
      );
      return;
    }
    if (operator === "open-invoice") {
      navigate(
        "open-invoice",
        "invoice",
        initialEntries[0],
        "Operator clicked Open reverse invoice. Only governed, posted entries were compiled.",
      );
      return;
    }
    if (operator !== "approve") return;
    setView("governance");
    setSelected(initialEntries[1]);
    setOperatorTarget("approve");
    const timer = window.setTimeout(() => {
      setOperatorTarget("");
      void decide(
        "approved",
        "demo.operator@enterprise.com",
        "Operator autoplay reviewed the evidence packet and approved the governed 60/40 attribution.",
      );
    }, 1800);
    void timer;
  }, []);

  const resetDemo = () => {
    localStorage.removeItem("nowledger.entries");
    setEntries(initialEntries);
    setSelected(initialEntries[1]);
    setNotice("Demo reset. INC-004338 is awaiting governance approval again.");
    window.setTimeout(() => setNotice(""), 3500);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Fingerprint size={21} />
          </div>
          <div>
            <strong>AfterPO</strong>
            <span>Post-purchase cost intelligence</span>
          </div>
        </div>
        <nav>
          <NavButton
            icon={<Gauge />}
            label="Command center"
            active={view === "command"}
            onClick={() => setView("command")}
          />
          <NavButton
            icon={<BookOpenCheck />}
            label="Work ledger"
            active={view === "ledger"}
            count="03"
            onClick={() => setView("ledger")}
          />
          <NavButton
            icon={<ShieldCheck />}
            label="Governance queue"
            active={view === "governance"}
            count="01"
            onClick={() => {
              setSelected(
                entries.find((item) => item.status === "review") ??
                  initialEntries[1],
              );
              setView("governance");
            }}
          />
          <NavButton
            icon={<ReceiptText />}
            label="Reverse invoice"
            active={view === "invoice"}
            onClick={() => setView("invoice")}
          />
        </nav>
        <div className="side-spacer" />
        <div className="trust-card">
          <div className="eyebrow">
            <ShieldCheck size={14} /> CLAIMGUARD ACTIVE
          </div>
          <strong>No proof. No action.</strong>
          <p>Every cost is evidence-bound, policy-checked, and replayable.</p>
          <div className="trust-row">
            <span>Policy</span>
            <b>v1.3</b>
          </div>
          <div className="trust-row">
            <span>Last audit</span>
            <b>2m ago</b>
          </div>
        </div>
        <div className="profile">
          <div className="avatar">VM</div>
          <div>
            <strong>Vikram Mehta</strong>
            <span>Vendor manager</span>
          </div>
          <ChevronRight size={16} />
        </div>
      </aside>

      <main>
        <header>
          <div>
            <div className="crumb">
              SUPPLIER OPERATIONS <ChevronRight size={13} /> AUGUST CLOSE
            </div>
            <h1>{viewTitle(view)}</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <Search size={18} />
            </button>
            <button className="period" onClick={resetDemo}>
              <TimerReset size={14} /> Reset demo
            </button>
            <button className="period">
              <span className="live-dot" />
              Live evidence
            </button>
            <button
              className={`primary ${operatorTarget === "open-invoice" ? "operator-target" : ""}`}
              onClick={() => setView("invoice")}
            >
              <ReceiptText size={17} /> Open reverse invoice
            </button>
          </div>
        </header>
        {notice && (
          <div className="toast">
            <BadgeCheck size={18} />
            {notice}
          </div>
        )}
        {view === "command" && (
          <CommandCenter
            entries={entries}
            totals={totals}
            setView={setView}
            setSelected={setSelected}
            operatorTarget={operatorTarget}
          />
        )}
        {view === "ledger" && (
          <Ledger
            entries={entries}
            selected={selected}
            setSelected={setSelected}
          />
        )}
        {view === "governance" && (
          <Governance
            selected={selected}
            decide={decide}
            submitting={submitting}
            operatorTarget={operatorTarget}
          />
        )}
        {view === "invoice" && (
          <Invoice
            entries={entries}
            totals={totals}
            onSubmit={() =>
              setNotice(
                "Reverse Invoice held for procurement approval. No external message was sent.",
              )
            }
          />
        )}
      </main>
    </div>
  );
}

function CommandCenter({
  entries,
  totals,
  setView,
  setSelected,
  operatorTarget,
}: {
  entries: LedgerEntry[];
  totals: { burden: number; recoverable: number };
  setView: (v: View) => void;
  setSelected: (e: LedgerEntry) => void;
  operatorTarget: string;
}) {
  return (
    <div className="page">
      <section className="hero-panel">
        <div>
          <div className="eyebrow lime">
            <Sparkles size={14} /> AUGUST 2026 · ALPHA AUTOMATION
          </div>
          <h2>
            The invoice says <em>₹8.0L.</em>
            <br />
            The work says <em>₹{(totals.burden / 100000).toFixed(2)}L more.</em>
          </h2>
          <p>
            AfterPO priced 29.4 hours of supplier-created work across
            incidents, engineering, field service, and plant operations.
          </p>
        </div>
        <div className="score-ring">
          <span>TRUE COST</span>
          <strong>{rupees(800000 + totals.burden)}</strong>
          <small>
            +{Math.round((totals.burden / 800000) * 100)}% vs invoice
          </small>
        </div>
      </section>
      <div className="metric-grid">
        <Metric
          icon={<CircleDollarSign />}
          label="Contract invoice"
          value="₹8.00L"
          sub="Monthly base charge"
        />
        <Metric
          icon={<TimerReset />}
          label="Supplier work tax"
          value={rupees(totals.burden)}
          sub="Governed operational burden"
          alert
        />
        <Metric
          icon={<FileCheck2 />}
          label="Recoverable now"
          value={rupees(totals.recoverable)}
          sub="Contract-supported credit"
        />
        <Metric
          icon={<ShieldCheck />}
          label="Evidence coverage"
          value="94%"
          sub="27 of 29 records verified"
        />
      </div>
      <div className="two-col">
        <section className="card chart-card">
          <div className="card-head">
            <div>
              <span className="kicker">COST SIGNAL</span>
              <h3>Contract price vs work burden</h3>
            </div>
            <span className="delta">+37% burden since Mar</span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="burden" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d84f2a" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#d84f2a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ded8ce"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8d877e", fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "#fffdf8",
                    border: "1px solid #d8d1c7",
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="contract"
                  stroke="#8f8a82"
                  fill="transparent"
                  strokeDasharray="5 5"
                />
                <Area
                  type="monotone"
                  dataKey="burden"
                  stroke="#d84f2a"
                  strokeWidth={2.5}
                  fill="url(#burden)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="legend">
            <span>
              <i className="legend-line contract" />
              Contract price
            </span>
            <span>
              <i className="legend-line burden" />
              Supplier-created work
            </span>
          </div>
        </section>
        <section className="card">
          <div className="card-head">
            <div>
              <span className="kicker">LIVE ATTRIBUTION</span>
              <h3>What the supplier caused</h3>
            </div>
            <button
              className={`text-btn ${operatorTarget === "view-ledger" ? "operator-target" : ""}`}
              onClick={() => setView("ledger")}
            >
              Work ledger <ArrowRight size={15} />
            </button>
          </div>
          <div className="entry-list">
            {entries.map((entry) => (
              <button
                key={entry.id}
                className="entry-row"
                onClick={() => {
                  setSelected(entry);
                  setView(entry.status === "review" ? "governance" : "ledger");
                }}
              >
                <StatusIcon status={entry.status} />
                <div className="entry-copy">
                  <strong>{entry.title}</strong>
                  <span>
                    {entry.id} · Supplier share {entry.supplierShare}%
                  </span>
                </div>
                <div className="entry-money">
                  <strong>
                    {entry.status === "blocked"
                      ? "₹0"
                      : rupees(
                          ((entry.workCost + entry.downtimeCost) *
                            entry.supplierShare) /
                            100,
                        )}
                  </strong>
                  <span className={`status ${entry.status}`}>
                    {statusLabel[entry.status]}
                  </span>
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </section>
      </div>
      <section className="governance-strip">
        <div className="shield-large">
          <ShieldCheck />
        </div>
        <div>
          <span className="kicker">GOVERNANCE IN THE MIDDLE</span>
          <h3>
            One false attribution was blocked before it reached the supplier.
          </h3>
          <p>
            ClaimGuard found an unauthorized internal change 14 minutes before the
            sorter failure and removed ₹2.64L from the supplier ledger.
          </p>
        </div>
        <button
          className={`secondary ${operatorTarget === "inspect-blocked" ? "operator-target" : ""}`}
          onClick={() => {
            setSelected(entries[2]);
            setView("ledger");
          }}
        >
          Inspect proof packet
        </button>
      </section>
    </div>
  );
}

function Ledger({
  entries,
  selected,
  setSelected,
}: {
  entries: LedgerEntry[];
  selected: LedgerEntry;
  setSelected: (e: LedgerEntry) => void;
}) {
  return (
    <div className="page ledger-layout">
      <section className="card table-card">
        <div className="card-head">
          <div>
            <span className="kicker">AUGUST 2026</span>
            <h3>Governed work entries</h3>
          </div>
          <span className="record-count">3 records</span>
        </div>
        <div className="table-header">
          <span>Work record</span>
          <span>Attribution</span>
          <span>Burden</span>
          <span>Decision</span>
        </div>
        {entries.map((entry) => (
          <button
            className={`table-row ${selected.id === entry.id ? "selected" : ""}`}
            key={entry.id}
            onClick={() => setSelected(entry)}
          >
            <div>
              <strong>{entry.title}</strong>
              <span>
                {entry.id} · {entry.date}
              </span>
            </div>
            <div>
              <b>{entry.supplierShare}% supplier</b>
              <span>{entry.confidence}% confidence</span>
            </div>
            <div>
              <b>
                {entry.status === "blocked"
                  ? "₹0"
                  : rupees(
                      ((entry.workCost + entry.downtimeCost) *
                        entry.supplierShare) /
                        100,
                    )}
              </b>
              <span>{rupees(entry.recoverable)} recoverable</span>
            </div>
            <span className={`status ${entry.status}`}>
              {statusLabel[entry.status]}
            </span>
          </button>
        ))}
      </section>
      <ProofPanel entry={selected} />
    </div>
  );
}

function Governance({
  selected,
  decide,
  submitting,
  operatorTarget,
}: {
  selected: LedgerEntry;
  decide: (
    d: "approved" | "blocked",
    approver: string,
    rationale: string,
  ) => Promise<void>;
  submitting: boolean;
  operatorTarget: string;
}) {
  const reviewEntry = initialEntries.find((e) => e.status === "review")!;
  const item = selected.status === "review" ? selected : reviewEntry;
  const [approver, setApprover] = useState("vikram.mehta@demo.enterprise.com");
  const [rationale, setRationale] = useState(
    "Evidence and shared attribution reviewed against the proof packet.",
  );
  const ready = Boolean(approver.trim() && rationale.trim());
  return (
    <div className="page governance-grid">
      <section className="card approval-card">
        <div className="approval-head">
          <div className="amber-icon">
            <UserCheck />
          </div>
          <div>
            <span className="kicker amber">
              HUMAN DECISION REQUIRED · LIVE n8n
            </span>
            <h2>Approve shared responsibility?</h2>
            <p>
              {item.id} · {item.title}
            </p>
          </div>
        </div>
        <div className="split-bar">
          <div style={{ width: `${item.supplierShare}%` }}>
            <strong>{item.supplierShare}%</strong>
            <span>Supplier</span>
          </div>
          <div style={{ width: `${item.internalShare}%` }}>
            <strong>{item.internalShare}%</strong>
            <span>Internal</span>
          </div>
        </div>
        <div className="reason-box">
          <span>AGENT FINDING</span>
          <p>{item.cause}</p>
        </div>
        <div className="approval-metrics">
          <div>
            <span>Proposed supplier burden</span>
            <strong>
              {rupees(
                ((item.workCost + item.downtimeCost) * item.supplierShare) /
                  100,
              )}
            </strong>
          </div>
          <div>
            <span>Recoverable</span>
            <strong>{rupees(item.recoverable)}</strong>
          </div>
          <div>
            <span>Confidence</span>
            <strong>{item.confidence}%</strong>
          </div>
        </div>
        <div className="policy-callout">
          <ShieldCheck size={20} />
          <div>
            <strong>Why governance stopped this</strong>
            <p>
              Shared attribution above ₹2L requires an operations owner
              independent from the proposing agent. The decision is sent to n8n,
              validated, and returned with an audit receipt.
            </p>
          </div>
        </div>
        <div className="decision-fields">
          <label>
            Approver email
            <input
              type="email"
              value={approver}
              onChange={(event) => setApprover(event.target.value)}
            />
          </label>
          <label>
            Decision rationale
            <textarea
              value={rationale}
              onChange={(event) => setRationale(event.target.value)}
            />
          </label>
        </div>
        <div className="approval-actions">
          <button
            className="reject"
            disabled={submitting || !ready}
            onClick={() => decide("blocked", approver, rationale)}
          >
            <X size={17} /> Reject attribution
          </button>
          <button
            className={`approve ${operatorTarget === "approve" ? "operator-target" : ""}`}
            disabled={submitting || !ready}
            onClick={() => decide("approved", approver, rationale)}
          >
            <Check size={17} />{" "}
            {submitting ? "Recording in n8n…" : "Approve & post"}
          </button>
        </div>
      </section>
      <ProofPanel entry={item} />
    </div>
  );
}

function Invoice({
  entries,
  totals,
  onSubmit,
}: {
  entries: LedgerEntry[];
  totals: { burden: number; recoverable: number };
  onSubmit: () => void;
}) {
  const allowed = entries.filter((e) => e.status === "approved");
  return (
    <div className="page invoice-page">
      <div className="invoice-top">
        <div>
          <span className="kicker">DRAFT · HUMAN APPROVAL REQUIRED</span>
          <h2>Operational reverse invoice</h2>
          <p>Evidence statement for Alpha Automation · August 2026</p>
        </div>
        <button className="primary" onClick={onSubmit}>
          <UserCheck size={17} /> Route for approval
        </button>
      </div>
      <section className="invoice-paper">
        <div className="invoice-brand">
          <div className="brand-mark dark">
            <Fingerprint />
          </div>
          <div>
            <strong>AFTERPO</strong>
            <span>SUPPLIER WORK STATEMENT</span>
          </div>
          <div className="invoice-id">
            <span>STATEMENT</span>
            <strong>RINV-2026-008</strong>
          </div>
        </div>
        <div className="invoice-parties">
          <div>
            <span>ISSUED TO</span>
            <strong>Alpha Automation Pvt. Ltd.</strong>
            <p>
              Supplier ID SUP-00148
              <br />
              Contract MSA-2025-118
            </p>
          </div>
          <div>
            <span>STATEMENT PERIOD</span>
            <strong>01–31 August 2026</strong>
            <p>
              Generated 27 Aug 2026
              <br />
              Policy version 1.3
            </p>
          </div>
        </div>
        <div className="invoice-table">
          <div className="invoice-row head">
            <span>Evidence-bound work</span>
            <span>Attribution</span>
            <span>Work burden</span>
            <span>Recoverable</span>
          </div>
          {allowed.map((e) => (
            <div className="invoice-row" key={e.id}>
              <span>
                <strong>{e.title}</strong>
                <small>
                  {e.id} · {e.contract}
                </small>
              </span>
              <span>{e.supplierShare}%</span>
              <span>
                {rupees(
                  ((e.workCost + e.downtimeCost) * e.supplierShare) / 100,
                )}
              </span>
              <span>{rupees(e.recoverable)}</span>
            </div>
          ))}
        </div>
        <div className="invoice-summary">
          <div className="invoice-note">
            <ShieldCheck />
            <p>
              <strong>Governance statement</strong>
              <br />
              Every line is traceable to approved source records. Blocked and
              inconclusive attributions are excluded.
            </p>
          </div>
          <div>
            <p>
              <span>Contract invoice</span>
              <b>₹8.00L</b>
            </p>
            <p>
              <span>Operational burden</span>
              <b>{rupees(totals.burden)}</b>
            </p>
            <p>
              <span>Recoverable credit</span>
              <b>{rupees(totals.recoverable)}</b>
            </p>
            <p className="grand">
              <span>True monthly cost</span>
              <b>{rupees(800000 + totals.burden)}</b>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProofPanel({ entry }: { entry: LedgerEntry }) {
  return (
    <aside className="card proof-panel">
      <div className="card-head">
        <div>
          <span className="kicker">PROOF PACKET</span>
          <h3>{entry.id}</h3>
        </div>
        <Fingerprint size={22} />
      </div>
      <div className="proof-score">
        <div>
          <span>Evidence confidence</span>
          <strong>{entry.confidence}%</strong>
        </div>
        <div className="confidence-track">
          <i style={{ width: `${entry.confidence}%` }} />
        </div>
      </div>
      <ProofStep icon={<Network />} title="Causal finding" copy={entry.cause} />
      <ProofStep
        icon={<Boxes />}
        title="Source records"
        copy={entry.evidence.join(" · ")}
      />
      <ProofStep
        icon={<FileCheck2 />}
        title="Contract basis"
        copy={entry.contract}
      />
      <ProofStep
        icon={<ShieldCheck />}
        title="Governance decision"
        copy={entry.governance}
      />
      <div className="replay">
        <History size={16} />
        <span>Fully replayable</span>
        <b>Run 08-27-26-04</b>
      </div>
    </aside>
  );
}
function ProofStep({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="proof-step">
      <div className="proof-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <p>{copy}</p>
      </div>
    </div>
  );
}
function Metric({
  icon,
  label,
  value,
  sub,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div className={`metric ${alert ? "alert" : ""}`}>
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  );
}
function StatusIcon({ status }: { status: Status }) {
  return (
    <div className={`status-icon ${status}`}>
      {status === "approved" ? (
        <Check />
      ) : status === "review" ? (
        <AlertTriangle />
      ) : (
        <Ban />
      )}
    </div>
  );
}
function NavButton({
  icon,
  label,
  active,
  count,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  count?: string;
  onClick: () => void;
}) {
  return (
    <button className={active ? "active" : ""} onClick={onClick}>
      {icon}
      <span>{label}</span>
      {count && <b>{count}</b>}
    </button>
  );
}
function viewTitle(view: View) {
  return {
    command: "Supplier command center",
    ledger: "Supplier work ledger",
    governance: "Governance decision",
    invoice: "Reverse invoice",
  }[view];
}

export default App;
