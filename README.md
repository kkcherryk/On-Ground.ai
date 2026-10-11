# Xeloro · Call Centre Workspace

### One workspace for customer support, from first contact to follow-up.

A working **frontend prototype** for On-Ground.ai, built from the supplied brief and Xeloro Figma reference. Agents can manage voice, chat, and email interactions, review customer history, handle tickets, and coordinate with supervisors.

**React 19 · TypeScript · Vite · Responsive UI · Local persistence**


All six implementation stages are complete. The app uses fictional records and simulated operations; no backend is required.

## Features at a glance

| Workspace           | What you can do                                                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Work Queue**      | Search customers and cases; filter by channel, priority, status, and assignment; sort by wait time; preview customer context; bulk reassign waiting work.   |
| **Live Workspace**  | Accept an interaction, use simulated call controls, draft chat/email replies, consult guidance, and record a wrap-up outcome.                               |
| **Customer CRM**    | View contact and account details, verification status, related cases, previous calls/emails/chats, customer questions, agent answers, and staff-only notes. |
| **Cases & Tickets** | Create and edit tickets, review conversations and audit trails, transfer or escalate cases, filter records, paginate results, and export CSV.               |
| **Follow-ups**      | Schedule and assign reminders, reschedule or postpone, mark complete, cancel/restore, and open a linked interaction.                                        |
| **Supervisor View** | Review agent availability and workload, approve or decline requests, reassign cases, and move pending follow-ups with their cases.                          |
| **Knowledge Base**  | Search articles and saved replies, filter by category, expand guidance, and insert replies from the live workspace.                                         |

### Built around the customer conversation

- **Context stays connected.** Customers, cases, interactions, history, and reminders share linked records.
- **Three wrap-up outcomes.** Resolve the issue, schedule a follow-up, or escalate for review. Required summaries keep the next step clear.
- **Safe handoffs.** Transfers require a reason and preserve conversation context. Bulk reassignment excludes active, held, wrap-up, and resolved cases.
- **Refresh without losing work.** Replies, drafts, call state, outcomes, assignments, approvals, and preferences persist in browser storage. Queue filters stay in the URL.
- **Clear customer/staff boundaries.** Internal notes are labelled staff only; approval decisions are recorded separately from case resolution.
- **Desktop to mobile.** Responsive layouts, keyboard navigation, labelled controls, focus restoration, bounded dialogs, and a scrollable queue table.

## Quick start

**Requirements:** Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

| Command                | Purpose                                                         |
| ---------------------- | --------------------------------------------------------------- |
| `npm run dev`          | Start the local development server                              |
| `npm run build`        | Compile TypeScript and generate the production build in `dist/` |
| `npm run preview`      | Preview the production build locally                            |
| `npm run format:check` | Check code formatting                                           |

## Try the complete workflow

1. **Find work:** Open the queue, filter by channel or assignment, and select a customer preview.
2. **Understand the issue:** Open the interaction and review the customer’s profile, previous questions, answers, and notes.
3. **Respond:** Accept the work, try the simulated controls, or insert a saved reply into a chat/email draft.
4. **Choose the next step:** End the interaction and save a resolution, follow-up, or escalation with a summary.
5. **Coordinate:** Review the case audit trail, manage its reminder, or use Supervisor View for approval and reassignment.

Use **Reset demo data** in the sidebar to restore the original records. The starting dataset contains five customers with linked cases/interactions, four agents, three reminders, and one pending approval. Times are displayed in **Asia/Kolkata**.

## Project structure

```text
src/
├── components/   Shared UI, navigation, dialogs, history, and handoff forms
├── pages/        Queue, workspace, CRM, cases, follow-ups, and supervisor screens
├── data/         Record types, fictional seed data, and CSV export
├── state/        React Context, reducer actions, and local storage persistence
└── styles/       Global styles and design foundations
public/assets/    Locally bundled design assets
docs/             Review record, asset manifest, and submission guide
```

**Implementation:** React Router handles navigation; CSS Modules style the screens; React Context with a reducer manages shared state. Fonts and design assets are bundled locally.

## Design & review

- **Design reference:** [Supplied Xeloro Figma screens](https://www.figma.com/design/Ccn1UyiRSCOBpZaRBR1u10/Untitled?node-id=12-23).
- **Assets:** [Design asset manifest](docs/design-assets.json) records source nodes and intended UI slots. The application does not rely on temporary Figma asset URLs.
- **Verification:** Main workflows, refresh persistence, responsive layouts, and CSV export received a manual browser regression. A queue filter race was fixed and retested. Production compilation and formatting checks passed.
- **Detailed coverage:** [Review record](docs/REVIEW.md).
- **Demo & hosting:** [Submission guide](docs/SUBMISSION.md) includes a short demo script, static hosting notes, and the submission checklist.

## Prototype scope

Calls, recording controls, messages, verification, copilot guidance, credits, and supervisor roles are simulations. No audio is captured, no real messages or credits are sent, and there is no authentication, backend, or live AI integration. Data is stored locally in the browser and is not shared between users.

Testing covered the local frontend. No automated test suite, cross-browser matrix, formal accessibility certification, or deployed-host verification is claimed.

## AI tools & authorship

**OpenAI Codex** and the **Figma connector** were used to inspect the supplied design, generate original application code, and review the implementation. Design context was adapted into reusable React components and CSS Modules. No live mock website source was copied.

Repository commits and pushes are handled by the user.
