import { Issue, IssueType, IssueStatus } from "./types";

export class IssueManager {
  private issues: Map<string, Issue> = new Map();
  private issueCounter: number = 0;

  createIssue(
    transactionId: string,
    issueType: IssueType,
    subject: string,
    description: string,
    email: string
  ): string {
    const issueId = `I${++this.issueCounter}`;

    const newIssue: Issue = {
      id: issueId,
      transactionId,
      type: issueType,
      subject,
      description,
      customerEmail: email,
      status: IssueStatus.OPEN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.issues.set(issueId, newIssue);
    console.log(`Issue ${issueId} created for transaction "${transactionId}"`);
    return issueId;
  }

  getIssue(issueId: string): Issue | undefined {
    return this.issues.get(issueId);
  }

  updateIssue(issueId: string, updates: Partial<Issue>): boolean {
    const issue = this.issues.get(issueId);

    if (!issue) {
      console.log(`Issue ${issueId} not found`);
      return false;
    }

    Object.assign(issue, updates, { updatedAt: new Date() });
    this.issues.set(issueId, issue);
    return true;
  }

  getAllIssues(): Issue[] {
    return Array.from(this.issues.values());
  }
}
