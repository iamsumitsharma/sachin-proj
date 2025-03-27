# Customer Issue Resolution System

A TypeScript implementation of a system for resolving customer issues related to failed transactions. This system allows customers to log complaints against unsuccessful transactions and assigns them to appropriate customer service agents based on their expertise.

## Features

- Customers can log complaints against unsuccessful transactions
- Customer Service Agents can search for issues by ID or customer details
- Agents can view and update their assigned issues
- System assigns issues to agents based on expertise and availability
- Admin can onboard new agents
- Admin can view agents' work history

## Project Structure

- `src/`: Source code for the system
- `types.ts`: TypeScript type definitions
- `CustomerIssueResolutionSystem.ts`: Main implementation of the system
- `index.ts`: Entry point for the system
- `package.json`: Project configuration and dependencies
- `tsconfig.json`: TypeScript configuration

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the system: `npm start`

## Usage

The system can be run using the following command:

```bash
npm start
```

## Testing Instructions

### Manual Testing

You can manually test the system by modifying the `src/index.ts` file to include different test scenarios. The current implementation includes a demo that showcases all the main functionalities.

To run the demo:

```bash
npm run dev
```

### Test Scenarios

The demo in `index.ts` includes the following test scenarios:

1. **Creating Issues**:

   - Creating a payment-related issue for testUser1
   - Creating a mutual fund-related issue for testUser2
   - Creating another payment-related issue for testUser2

2. **Adding Agents**:

   - Adding Agent 1 with expertise in payment and gold-related issues
   - Adding Agent 2 with expertise in mutual fund-related issues

3. **Assigning Issues**:

   - Assigning issues to available agents
   - Adding issues to waitlist when agents are busy

4. **Filtering Issues**:

   - Getting issues by customer email
   - Getting issues by issue type

5. **Updating and Resolving Issues**:

   - Updating an issue's status and resolution
   - Resolving an issue and freeing up the agent

6. **Viewing Agent Work History**:

   - Displaying which issues each agent has worked on

   ### Custom Testing

To create your own test scenarios, modify the `main()` function in `src/index.ts`. You can:

1. Create more issues with different types
2. Add more agents with various expertise
3. Test edge cases like:
   - Assigning issues when no agents are available
   - Resolving issues that aren't assigned
   - Filtering issues with multiple criteria

## API Reference

### `createIssue(transactionId, issueType, subject, description, email)`

Creates a new customer issue and returns the issue ID.

### `addAgent(agentEmail, agentName, expertiseTypes)`

Adds a new agent with specified expertise and returns the agent ID.

### `assignIssue(issueId)`

Assigns an issue to an available agent with matching expertise or adds it to a waitlist.

### `getIssues(filter)`

Returns issues matching the specified filter criteria.

### `updateIssue(issueId, status, resolution)`

Updates an issue's status and resolution.

### `resolveIssue(issueId, resolution)`

Marks an issue as resolved and frees up the assigned agent.

### `viewAgentsWorkHistory()`

Returns a record of which issues each agent has worked on.
