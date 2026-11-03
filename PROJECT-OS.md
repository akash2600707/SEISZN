# SEISZN — Project Control Center

This repository is the source of truth for SEISZN project work.

## Current project map

| Workstream | Scope | Current state |
|---|---|---|
| Business & strategy | Business model, pricing, budget, launch goals | To review |
| Brand & design | Brand identity, packaging, creative assets | To review |
| Products & catalog | Products, variants, sizes, SKUs, descriptions, imagery | To review |
| Storefront & technology | Next.js frontend, backend, database, admin | Frontend prototype described in main README; verify source |
| Inventory & operations | Stock, suppliers, order processing, policies | To review |
| Payments & shipping | Razorpay, COD, Shiprocket, fulfillment | Planned integrations; verify implementation |
| Marketing & sales | Instagram, content, campaigns, customer acquisition | To review |
| Finance & analytics | Expenses, revenue, margins, cash flow | To review |

## How to use this repository

1. Create one GitHub Issue for every actionable task, bug, or decision.
2. Use one workstream label and one priority label on every issue.
3. Keep only one major task in **In Progress** at a time.
4. Put blockers in the issue description and link dependencies.
5. Close an issue only when its acceptance criteria are met.
6. Do not commit secrets, API keys, passwords, customer personal data, or payment credentials.

## Task issue template

Use this format in every task:

### Goal
What outcome is needed?

### Why it matters
What business or customer problem does this solve?

### Scope
What is included, and what is explicitly excluded?

### Acceptance criteria
- [ ] Observable completion condition
- [ ] Tested or reviewed
- [ ] Relevant documentation updated

### Dependencies / blockers
What must happen first?

### Next action
The single next physical action to move this forward.

## Weekly operating rhythm

- Start of week: choose up to 3 outcomes.
- Each work session: pick one issue and work only on its next action.
- End of session: update status, notes, and blocker.
- End of week: review completed work and choose next priorities.

## Branch safety

- `main`: storefront project branch.
- `Coming-soon`: static coming-soon page.
- Do not merge, delete, or rename branches without reviewing their differences and deployment behavior.
