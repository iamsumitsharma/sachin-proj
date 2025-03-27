import { CustomerIssueResolutionSystem } from "./CustomerIssueResolutionSystem";
import { IssueType, IssueStatus } from "./types";

// Demo the functionality
function main() {
  const system = new CustomerIssueResolutionSystem();

  // Create issues
  system.createIssue(
    "T1",
    IssueType.PAYMENT_RELATED,
    "Payment Failed",
    "My payment failed but money is debited",
    "testUser1@test.com"
  );

  system.createIssue(
    "T2",
    IssueType.MUTUAL_FUND_RELATED,
    "Purchase Failed",
    "Unable to purchase Mutual Fund",
    "testUser2@test.com"
  );

  system.createIssue(
    "T3",
    IssueType.PAYMENT_RELATED,
    "Payment Failed",
    "My payment failed but money is debited",
    "testUser2@test.com"
  );

  // Add agents
  system.addAgent("agent1@test.com", "Agent 1", [
    IssueType.PAYMENT_RELATED,
    IssueType.GOLD_RELATED,
  ]);

  system.addAgent("agent2@test.com", "Agent 2", [
    IssueType.MUTUAL_FUND_RELATED,
  ]);

  // Assign issues
  system.assignIssue("I1");
  system.assignIssue("I2");
  system.assignIssue("I3");

  // Get issues by filter
  console.log("\nIssues for testUser2@test.com:");
  const userIssues = system.getIssues({ email: "testUser2@test.com" });
  userIssues.forEach((issue) => {
    console.log(
      `${issue.id} {${issue.transactionId}, ${issue.type}, ${issue.subject}, ${issue.description}, ${issue.customerEmail}, ${issue.status}}`
    );
  });

  console.log("\nPayment Related issues:");
  const paymentIssues = system.getIssues({ type: IssueType.PAYMENT_RELATED });
  paymentIssues.forEach((issue) => {
    console.log(
      `${issue.id} {${issue.transactionId}, ${issue.type}, ${issue.subject}, ${issue.description}, ${issue.customerEmail}, ${issue.status}}`
    );
  });

  // Update issue
  system.updateIssue(
    "I3",
    IssueStatus.IN_PROGRESS,
    "Waiting for payment confirmation"
  );

  // Resolve issue
  system.resolveIssue("I3", "PaymentFailed debited amount will get reversed");

  // View agents work history
  console.log("\nAgents Work History:");
  const workHistory = system.viewAgentsWorkHistory();
  for (const [agentId, issues] of Object.entries(workHistory)) {
    console.log(`${agentId} -> {${issues.join(", ")}}`);
  }
}

main();
