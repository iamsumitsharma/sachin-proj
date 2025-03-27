// Define enums and types
export enum IssueType {
  PAYMENT_RELATED = "Payment Related",
  MUTUAL_FUND_RELATED = "Mutual Fund Related",
  GOLD_RELATED = "Gold Related",
  INSURANCE_RELATED = "Insurance Related",
}

export enum IssueStatus {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
}

export interface Issue {
  id: string;
  transactionId: string;
  type: IssueType;
  subject: string;
  description: string;
  customerEmail: string;
  status: IssueStatus;
  assignedAgent?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  email: string;
  name: string;
  expertiseTypes: IssueType[];
  currentIssue?: string;
  waitlist: string[];
  issuesWorkedOn: string[];
}

export interface IssueFilter {
  email?: string;
  type?: IssueType;
  status?: IssueStatus;
  agentId?: string;
}
