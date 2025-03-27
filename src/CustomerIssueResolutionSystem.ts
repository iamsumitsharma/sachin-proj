import { Issue, Agent, IssueType, IssueStatus, IssueFilter } from "./types";

export class CustomerIssueResolutionSystem {
  private issues: Map<string, Issue> = new Map();
  private agents: Map<string, Agent> = new Map();
  private issueCounter: number = 0;
  private agentCounter: number = 0;

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
    console.log(
      `Issue ${issueId} created against transaction "${transactionId}"`
    );
    return issueId;
  }

  addAgent(
    agentEmail: string,
    agentName: string,
    expertiseTypes: IssueType[]
  ): string {
    const agentId = `A${++this.agentCounter}`;

    const newAgent: Agent = {
      id: agentId,
      email: agentEmail,
      name: agentName,
      expertiseTypes,
      waitlist: [],
      issuesWorkedOn: [],
    };

    this.agents.set(agentId, newAgent);
    console.log(`Agent ${agentId} created`);
    return agentId;
  }

  assignIssue(issueId: string): void {
    const issue = this.issues.get(issueId);

    if (!issue) {
      console.log(`Issue ${issueId} not found`);
      return;
    }

    if (issue.assignedAgent) {
      console.log(
        `Issue ${issueId} is already assigned to agent ${issue.assignedAgent}`
      );
      return;
    }

    const availableAgents = Array.from(this.agents.values()).filter(
      (agent) =>
        agent.expertiseTypes.includes(issue.type) && !agent.currentIssue
    );

    if (availableAgents.length > 0) {
      const agent = availableAgents[0];
      issue.assignedAgent = agent.id;
      issue.status = IssueStatus.IN_PROGRESS;
      issue.updatedAt = new Date();
      agent.currentIssue = issueId;
      agent.issuesWorkedOn.push(issueId);

      this.issues.set(issueId, issue);
      this.agents.set(agent.id, agent);

      console.log(`Issue ${issueId} assigned to agent ${agent.id}`);
    } else {
      const expertAgents = Array.from(this.agents.values()).filter((agent) =>
        agent.expertiseTypes.includes(issue.type)
      );

      if (expertAgents.length > 0) {
        const agent = expertAgents[0];
        agent.waitlist.push(issueId);
        this.agents.set(agent.id, agent);
        console.log(`Issue ${issueId} added to waitlist of Agent ${agent.id}`);
      } else {
        console.log(`No agent with expertise in ${issue.type} found`);
      }
    }
  }

  getIssues(filter: IssueFilter): Issue[] {
    const result: Issue[] = [];

    for (const issue of this.issues.values()) {
      let matches = true;

      if (filter.email && issue.customerEmail !== filter.email) {
        matches = false;
      }

      if (filter.type && issue.type !== filter.type) {
        matches = false;
      }

      if (filter.status && issue.status !== filter.status) {
        matches = false;
      }

      if (filter.agentId && issue.assignedAgent !== filter.agentId) {
        matches = false;
      }

      if (matches) {
        result.push(issue);
      }
    }

    return result;
  }

  updateIssue(issueId: string, status: IssueStatus, resolution?: string): void {
    const issue = this.issues.get(issueId);

    if (!issue) {
      console.log(`Issue ${issueId} not found`);
      return;
    }

    issue.status = status;
    if (resolution) {
      issue.resolution = resolution;
    }
    issue.updatedAt = new Date();

    this.issues.set(issueId, issue);
    console.log(`Issue ${issueId} status updated to ${status}`);
  }

  // Resolve an issue
  resolveIssue(issueId: string, resolution: string): void {
    const issue = this.issues.get(issueId);

    if (!issue) {
      console.log(`Issue ${issueId} not found`);
      return;
    }

    if (!issue.assignedAgent) {
      console.log(`Issue ${issueId} is not assigned to any agent`);
      return;
    }

    const agent = this.agents.get(issue.assignedAgent);

    if (!agent) {
      console.log(`Agent ${issue.assignedAgent} not found`);
      return;
    }

    issue.status = IssueStatus.RESOLVED;
    issue.resolution = resolution;
    issue.updatedAt = new Date();
    this.issues.set(issueId, issue);

    agent.currentIssue = undefined;

    if (agent.waitlist.length > 0) {
      const nextIssueId = agent.waitlist.shift()!;
      const nextIssue = this.issues.get(nextIssueId);

      if (nextIssue) {
        nextIssue.assignedAgent = agent.id;
        nextIssue.status = IssueStatus.IN_PROGRESS;
        nextIssue.updatedAt = new Date();
        this.issues.set(nextIssueId, nextIssue);

        agent.currentIssue = nextIssueId;
        agent.issuesWorkedOn.push(nextIssueId);
        console.log(
          `Agent ${agent.id} assigned to next issue ${nextIssueId} from waitlist`
        );
      }
    }

    this.agents.set(agent.id, agent);
    console.log(`Issue ${issueId} marked resolved`);
  }

  viewAgentsWorkHistory(): Record<string, string[]> {
    const workHistory: Record<string, string[]> = {};

    for (const agent of this.agents.values()) {
      workHistory[agent.id] = agent.issuesWorkedOn;
    }

    return workHistory;
  }
}
