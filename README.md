# EasyTax

EasyTax is a clickable case-study prototype for a guided tax-prep platform. It is designed to feel familiar to clients, like a step-by-step filing product, while still giving CPAs the traceability, review controls, collaboration, and prioritization they need for professional tax work.

The project is intentionally frontend-first. The goal is not production tax infrastructure; it is a working product experience that demonstrates how the platform could feel and behave.

## Live prototype

GitHub Pages URL:

```text
Add your deployed GitHub Pages link here
```

This app is GitHub Pages-ready. It runs as static HTML, CSS, and JavaScript with sample data loaded from `frontend/data/bootstrap.json`.

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
- The GitHub Pages build works without a backend by loading static JSON data.

## What is simulated

- OCR and document parsing are mocked with seeded data.
- Tax calculations are plausible demo values, not real tax logic.
- The PDF viewer is a designed preview, not a real PDF renderer.
- Authentication and permissions are simulated through the role switcher.
- Messages and Smart Review corrections persist only during the current browser session.
- Uploads and correction submissions update the interface but do not store data in a database.
- The optional Python server is included only for local API-style testing.

## Run locally as a static app

This is the same mode GitHub Pages uses.

```bash
cd frontend
python -m http.server 8080
```

Open:

```text
http://127.0.0.1:8080
```

## Deploy to GitHub Pages

GitHub Pages cannot run the Python backend, so publish the contents of the `frontend` folder.

The published site should contain:

```text
index.html
css/styles.css
js/app.js
data/bootstrap.json
```

Recommended steps:

1. Copy the contents of `frontend/` into the root of your GitHub Pages repository or Pages branch.
2. Commit and push the files.
3. In GitHub, open `Settings -> Pages`.
4. Select the branch and folder that contain `index.html`.
5. Wait for Pages to deploy, then open the generated URL.

## Optional Python server

The project also includes a dependency-free Python server for local API-style testing.

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
                   static data used by GitHub Pages
```

## Notes for reviewers

EasyTax prioritizes a polished, understandable frontend over backend completeness. The design decisions are focused on trust, orientation, and action: clients always see the next step, CPAs can defend the numbers they review, collaboration stays attached to the work, and Smart Review explains both its recommendation and its uncertainty.
