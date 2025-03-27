import { Issue, Agent, IssueType, IssueStatus, IssueFilter } from "./types";
import { IssueManager } from "./IssueManager";
import { AgentManager } from "./AgentManager";

export class CustomerIssueResolutionSystem {
  private issueManager: IssueManager;
  private agentManager: AgentManager;

  constructor() {
    this.issueManager = new IssueManager();
    this.agentManager = new AgentManager();
  }

  createIssue(
    transactionId: string,
    issueType: IssueType,
    subject: string,
    description: string,
    email: string
  ): string {
    return this.issueManager.createIssue(
      transactionId,
      issueType,
      subject,
      description,
      email
    );
  }

  addAgent(
    agentEmail: string,
    agentName: string,
    expertiseTypes: IssueType[]
  ): string {
    return this.agentManager.addAgent(agentEmail, agentName, expertiseTypes);
  }

  assignIssue(issueId: string): void {
    const issue = this.issueManager.getIssue(issueId);

    if (!issue) {
      console.log(`Issue ${issueId} not found`);
      return;
    }

    if (issue.assignedAgent) {
      console.log(`Issue ${issueId} is already with  ${issue.assignedAgent}`);
      return;
    }

    const allAgents = this.agentManager.getAllAgents();
    const availableAgents = allAgents.filter(
      (agent) =>
        agent.expertiseTypes.includes(issue.type) && !agent.currentIssue
    );

    if (availableAgents.length > 0) {
      const agent = availableAgents[0];

      this.issueManager.updateIssue(issueId, {
        assignedAgent: agent.id,
        status: IssueStatus.IN_PROGRESS,
      });

      this.agentManager.updateAgent(agent.id, {
        currentIssue: issueId,
        issuesWorkedOn: [...agent.issuesWorkedOn, issueId],
      });

      console.log(`Assigned ${issueId} to ${agent.id}`);
    } else {
      const expertAgents = allAgents.filter((agent) =>
        agent.expertiseTypes.includes(issue.type)
      );

      if (expertAgents.length > 0) {
        const agent = expertAgents[0];

        this.agentManager.updateAgent(agent.id, {
          waitlist: [...agent.waitlist, issueId],
        });

        console.log(`Added issue ${issueId} to ${agent.id} waitlist`);
      } else {
        console.log(`Suitable agents not found,${issue.id}`);
      }
    }
  }

  getIssues(filter: IssueFilter): Issue[] {
    const allIssues = this.issueManager.getAllIssues();
    return allIssues.filter((issue) => {
      if (filter.email && issue.customerEmail !== filter.email) return false;
      if (filter.type && issue.type !== filter.type) return false;
      if (filter.status && issue.status !== filter.status) return false;
      if (filter.agentId && issue.assignedAgent !== filter.agentId)
        return false;
      return true;
    });
  }

  updateIssue(issueId: string, status: IssueStatus, resolution?: string): void {
    const updated = this.issueManager.updateIssue(issueId, {
      status,
      resolution,
    });

    if (updated) {
      console.log(`Updated issue ${issueId} to ${status}`);
    }
  }

  resolveIssue(issueId: string, resolution: string): void {
    const issue = this.issueManager.getIssue(issueId);

    if (!issue) {
      console.log(`Issue ${issueId} not found`);
      return;
    }

    if (!issue.assignedAgent) {
      console.log(`Issue ${issueId} is not assigned!`);
      return;
    }

    const agent = this.agentManager.getAgent(issue.assignedAgent);

    if (!agent) {
      console.log(`Agent ${issue.assignedAgent} not found`);
      return;
    }

    this.issueManager.updateIssue(issueId, {
      status: IssueStatus.RESOLVED,
      resolution,
    });

    const agentUpdates: Partial<Agent> = {
      currentIssue: undefined,
    };

    if (agent.waitlist.length > 0) {
      const nextIssueId = agent.waitlist[0];
      const nextIssue = this.issueManager.getIssue(nextIssueId);

      if (nextIssue) {
        this.issueManager.updateIssue(nextIssueId, {
          assignedAgent: agent.id,
          status: IssueStatus.IN_PROGRESS,
        });

        agentUpdates.currentIssue = nextIssueId;
        agentUpdates.waitlist = agent.waitlist.slice(1);
        agentUpdates.issuesWorkedOn = [...agent.issuesWorkedOn, nextIssueId];
      }
    }

    this.agentManager.updateAgent(agent.id, agentUpdates);
  }

  viewAgentsWorkHistory(): Record<string, string[]> {
    const workHistory: Record<string, string[]> = {};
    const allAgents = this.agentManager.getAllAgents();

    for (const agent of allAgents) {
      workHistory[agent.id] = agent.issuesWorkedOn;
    }

    return workHistory;
  }
}
