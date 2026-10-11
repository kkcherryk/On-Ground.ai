# On-Ground.ai · Xeloro Call Centre Frontend

A React and TypeScript frontend prototype based on the supplied Xeloro Figma design. This repository is being implemented in six stages. Stage 1 is complete: application foundation and navigation.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Production compilation: `npm run build`. Preview the production build: `npm run preview`.

## Stage 1 functionality

- Shared Figma header and sidebar, locally bundled Inter and Plus Jakarta Sans fonts, design variables, and reusable UI components.
- Navigation to the queue, selected interaction, customers, cases, follow-ups, knowledge, and supervisor overview.
- Five linked fictional customer records with matching cases and interactions; three follow-ups and four agents.
- Queue summary counts calculated from the sample data, search, priority/status/channel filters, sorting, and customer preview selection.
- Working availability selector, assist toggle, notifications, fullscreen toggle, and demo reset confirmation.
- Availability, assist mode, and selected interaction persist in local storage. Search is kept in the queue URL. Filters are temporary view state.
- Accessible labels, focus styles, skip navigation, native modal focus handling, and initial responsive layouts.

## Stage review

1. Open the queue and select different customer previews.
2. Search for `CAS-8930`, open the interaction, and confirm Amina's customer and case are shown.
3. Change agent availability and check the supervisor overview; refresh and confirm it persists.
4. Toggle assist mode, navigate to a workspace, and confirm sample guidance follows the preference.
5. Open notifications and follow the linked record.
6. Open Reset Demo, cancel it, then confirm it to return to the initial sample state.

## Remaining stages

2. Customer history, verification, expanded queue management and record context.
3. Simulated call controls, chat/email replies, knowledge search, and basic wrap-up.
4. Case editing, ticket creation, transfers, escalation, and follow-up management.
5. Supervisor approvals and reassignment.
6. Full visual alignment, responsive refinement, accessibility review, and submission documentation.

The current interaction, case, follow-up, and supervisor pages are read-only foundation views. Ticket creation, bulk reassignment, and transfer controls are disabled. Stage 1 does not provide telephony, message delivery, authentication, a backend, or real AI services. Sample operational data is labelled in the interface. Each later stage adds the corresponding working workflows.

## Design reference and assets

- [Figma connected screens](https://www.figma.com/design/Ccn1UyiRSCOBpZaRBR1u10/Untitled?node-id=12-23)
- Queue: `8:2`; header: `8:578`; sidebar: `8:532`; metrics: `8:58`; filter toolbar: `8:117`; queue table: `8:206`; customer preview: `8:441`.
- Figma-exported assets live in `public/assets`. `docs/design-assets.json` records their source nodes and intended slots. Temporary Figma URLs are not used by the application.
- Sample counts and record content are kept consistent even where the original static design has differing numbers or customer details.

## Implementation choices

Vite, React, TypeScript, React Router, CSS Modules, React Context with a reducer, and browser local storage. All data is fictional. Shared record types are defined in `src/data/types.ts`; sample records in `src/data/seed.ts`; state actions in `src/state/AppProvider.tsx`.

## AI tools used

OpenAI Codex and the Figma connector were used to inspect the supplied design, generate original application code, and review implementation. Figma-generated design context was adapted to reusable React components and CSS Modules. No live mock website source was copied.

## Git handoff

No commits or pushes are made by the implementation agent. After each stage, the user reviews, commits, and pushes before requesting the next stage.
