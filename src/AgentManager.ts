import { Agent, IssueType } from "./types";

export class AgentManager {
  private agents: Map<string, Agent> = new Map();
  private agentCounter: number = 0;

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
    console.log(`Agent ${agentId} (${agentName}) added to the team`);
    return agentId;
  }

  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  updateAgent(agentId: string, updates: Partial<Agent>): boolean {
    const agent = this.agents.get(agentId);

    if (!agent) {
      console.log(`Agent ${agentId} not found`);
      return false;
    }

    Object.assign(agent, updates);
    this.agents.set(agentId, agent);
    return true;
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
}
