export type Status = "approved" | "review" | "blocked";

export type LedgerEntry = {
  id: string;
  title: string;
  source: string;
  date: string;
  supplierShare: number;
  internalShare: number;
  workCost: number;
  downtimeCost: number;
  recoverable: number;
  confidence: number;
  status: Status;
  cause: string;
  evidence: string[];
  contract: string;
  governance: string;
};

export const entries: LedgerEntry[] = [
  {
    id: "INC-004291",
    title: "Conveyor motor thermal failure",
    source: "Major Incident · Plant 04",
    date: "Aug 03, 2026",
    supplierShare: 100,
    internalShare: 0,
    workCost: 126000,
    downtimeCost: 640000,
    recoverable: 250000,
    confidence: 96,
    status: "approved",
    cause: "Bearing assembly from lot MTR-24A failed below contracted duty cycle. Maintenance was current and no internal change preceded failure.",
    evidence: ["INC-004291", "WO-00881", "RCA-00042", "CI-CONV-14", "LOG-THERM-08"],
    contract: "MSA §8.4 · Warranty and response-time credit",
    governance: "Evidence complete · Independent RCA confirmed · Finance rule v1.3 passed"
  },
  {
    id: "INC-004338",
    title: "PLC firmware restart loop",
    source: "Incident · Warehouse 02",
    date: "Aug 11, 2026",
    supplierShare: 60,
    internalShare: 40,
    workCost: 92000,
    downtimeCost: 148000,
    recoverable: 72000,
    confidence: 87,
    status: "review",
    cause: "Supplier firmware defect initiated the loop; internal operations deferred the published mitigation for nine days.",
    evidence: ["INC-004338", "KB-991", "CHG-00171", "PRB-00018"],
    contract: "Support Schedule §4.2 · Defect remediation",
    governance: "Shared attribution exceeds ₹2L review threshold · Operations owner approval required"
  },
  {
    id: "INC-004402",
    title: "Sorter routing table corruption",
    source: "Incident · Distribution Centre",
    date: "Aug 19, 2026",
    supplierShare: 0,
    internalShare: 100,
    workCost: 54000,
    downtimeCost: 210000,
    recoverable: 0,
    confidence: 98,
    status: "blocked",
    cause: "An unauthorized internal configuration change occurred 14 minutes before failure. Supplier software operated as specified.",
    evidence: ["INC-004402", "AUDIT-771", "CHG-UNAUTH-19", "SYSLOG-442"],
    contract: "No supplier entitlement applies",
    governance: "Supplier charge blocked · False attribution prevented · Internal problem record recommended"
  }
];

export const monthlyTrend = [
  { month: "Mar", contract: 800, burden: 420 },
  { month: "Apr", contract: 800, burden: 510 },
  { month: "May", contract: 800, burden: 470 },
  { month: "Jun", contract: 800, burden: 720 },
  { month: "Jul", contract: 800, burden: 610 },
  { month: "Aug", contract: 800, burden: 985 }
];

export const rupees = (value: number) => `₹${(value / 100000).toFixed(value % 100000 === 0 ? 1 : 2)}L`;
