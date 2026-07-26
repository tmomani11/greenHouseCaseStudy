# EasyTax

EasyTax is a clickable case-study prototype for a guided tax-prep platform. It is designed to feel familiar to clients, like a step-by-step filing product, while still giving CPAs the traceability, review controls, collaboration, and prioritization they need for professional tax work.

The project is intentionally frontend-first. The goal is not production tax infrastructure; it is a working product experience that demonstrates how the platform could feel and behave.

## Live prototype

Render URL:

```text
Add your deployed GitHub Pages link here
```

This app is Render-ready. The included `render.yaml` starts a small Python server that serves both the frontend and the mock API routes.

## What EasyTax demonstrates

- A first-time client dashboard with a clear next action, progress, urgency, and return status.
- Source traceability from return values to submitted PDF names, page numbers, source text, and calculations.
- Contextual client/CPA messaging tied to documents and tax issues.
- Chat-style replies with sender, role label, visibility, timestamp, and left/right message alignment.
- Role-aware navigation for all six required roles: individual taxpayer, business owner, tax preparer, reviewer, firm administrator, and seasonal staff.
- A firm employee personal-return context through Jordan Lee's `Personal return` option.
- Shared status language that shows what happened, what is next, who owns it, and what is blocking completion.
- A CPA-facing work queue ranked by urgency, due date, warning count, open items, and owner.
- Clear affordance states for editable, auto-entered, verified, needs approval, and locked fields.
- Search and filtering across a large sample dataset.
- Smart Review recommendations with confidence, proof, uncertainty, confirmation status, and correction workflows.
- A `Case coverage` screen that links every case-study requirement to a working area of the prototype.

## What is real

- The frontend is fully clickable and uses real UI state.
- Role switching changes navigation, copy, permissions, and workflow emphasis.
- Messages can be sent and appear immediately in the active thread.
- Smart Review corrections update the recommendation card, detail panel, corrected amount, reason, confidence, and action state.
- Search, filtering, queue ranking, source selection, document trace panels, and contextual navigation are wired up.
- The Python server serves the frontend and mock API routes from one process.

## What is simulated

- OCR and document parsing are mocked with seeded data.
- Tax calculations are plausible demo values, not real tax logic.
- The PDF viewer is a designed preview, not a real PDF renderer.
- Authentication and permissions are simulated through the role switcher.
- Messages and Smart Review corrections persist only during the current browser session.
- Uploads and correction submissions update the interface but do not store data in a database.
- The backend is intentionally lightweight and uses in-memory/sample data only.

## Run locally

```bash
cd backend
python server.py
```

Open:

```text
http://127.0.0.1:8000
```

If port `8000` is already in use:

```bash
python server.py 8765
```

## Deploy to Render

This repository includes `render.yaml`, so Render can deploy it as a Blueprint.

Recommended steps:

1. Push this project to GitHub.
2. In Render, choose `New -> Blueprint`.
3. Select the GitHub repository.
4. Render will read `render.yaml`.
5. Deploy the `easytax-prototype` web service.

Manual Render settings also work:

```text
Runtime: Python
Build command: leave blank
Start command: python backend/server.py
```

The server reads Render's `PORT` environment variable automatically and binds to `0.0.0.0`.

## Suggested walkthrough

1. Start as `Maya Chen - Individual taxpayer`.
2. Show the checklist, progress, estimated refund, and next actions.
3. Open `Questions` and send a reply to show contextual collaboration.
4. Switch to `Jordan Lee - Tax preparer`.
5. Open `Review return` and click a return value to show source traceability.
6. Open `Smart Review`, explain why an item needs confirmation, then submit a correction.
7. Open the role switcher and show all six role types plus Jordan's personal return.
8. Open `Case coverage` to show how the prototype maps to the case-study requirements.

## Project structure

```text
backend/
  data.py          sample data and mock domain objects
  server.py        optional standard-library Python server

frontend/
  index.html       static app shell
  css/styles.css   visual design and responsive layout
  js/app.js        frontend state, routing, and interactions
  data/bootstrap.json
                   static fallback data for frontend-only hosting

render.yaml        Render deployment configuration
```

## Notes for reviewers

EasyTax prioritizes a polished, understandable frontend over backend completeness. The design decisions are focused on trust, orientation, and action: clients always see the next step, CPAs can defend the numbers they review, collaboration stays attached to the work, and Smart Review explains both its recommendation and its uncertainty.
