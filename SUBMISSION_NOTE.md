# EasyTax Submission Note

EasyTax is a clickable prototype for a guided tax-preparation platform that serves both taxpayers and tax professionals. The prototype is intentionally built to feel familiar to a taxpayer, similar to a modern step-by-step filing product, while still supporting professional CPA workflows like source traceability, reviewer queues, issue resolution, and audit-ready explanations.

The goal of this build is not to create production tax software. The goal is to show the product experience clearly enough that a reviewer can click through the major workflows, understand how each role would use the system, and see how the case-study challenges are addressed in one cohesive product.

## What is genuinely wired up

The app is a working browser prototype served by a small Python backend. The backend serves the frontend and exposes mock API routes for bootstrap data, trace lookup, and Smart Review correction submission. The UI is not just a set of static screenshots: navigation, role switching, message sending, source selection, queue filtering, and Smart Review correction flows all update the interface while the app is running.

Role-aware experiences are wired through the role switcher. A client, business owner, preparer, reviewer, firm administrator, and seasonal staff member each sees navigation and page emphasis that fits their job. For example, a client sees checklist progress and next actions, while a preparer sees a work queue, source review, Smart Review, and issue threads. The prototype also includes a firm employee personal-return context to show how someone who works at the firm could still use the same platform as a taxpayer without creating a separate product.

The client checklist is interactive enough to demonstrate the intended onboarding model. The primary `Continue` button moves the user through the next logical task instead of sitting as a decorative call to action. This supports the case-study requirement that a first-time user should know what to do within about 10 seconds.

The CPA work queue is wired with sorting, filters, search, priority signals, due dates, warning counts, open issues, and owner/status information. It is designed to answer the practical question: "What should I work on right now?"

Source traceability is wired in the return review screen. When a user clicks a return number, the detail panel explains where the number came from, including a made-up submitted PDF name, form and line reference, page number, extracted source text, confidence, and calculation notes. This demonstrates the intended traceability model: every number on the return should be defensible and connected back to a client-provided source.

The collaboration area is wired as a chat-style thread. Messages show who sent them, the person's role, whether the message is client-visible or internal, and the time. Messages sent by the current user appear on the right side of the thread; replies from other people appear on the left. Sending a message updates the current thread immediately during the session.

Smart Review is wired as an explainable AI review surface. Each recommendation shows what the AI is saying, why it is saying it, what evidence it used, what uncertainty remains, and whether human confirmation is needed. When a user applies a correction, the recommendation changes state in the UI and the corrected amount, reason, confidence, and next action update so the correction visibly affects the review flow.

The case coverage page is wired to the product screens. Each requirement links back to the part of the prototype where that requirement is demonstrated, so reviewers do not have to guess where a challenge was addressed.

## What is simulated behind the scenes

The tax documents, PDFs, OCR results, extracted source text, confidence scores, calculations, user accounts, and return data are sample data created for the demo. The PDF preview is a designed interface that represents a submitted client document; it is not rendering or parsing a real PDF file.

The tax calculations are plausible demo values only. They should not be interpreted as real tax advice, real return preparation logic, or validated IRS calculations. The prototype focuses on workflow, trust, collaboration, and information architecture rather than tax computation accuracy.

Authentication and permissions are simulated with the role switcher. In a production version, each user would sign in, belong to a firm or client account, and receive permissions from a real authorization system. For the prototype, switching roles makes the experience easy to evaluate quickly.

Messages, corrections, and UI changes persist only in the current browser session. They are intentionally lightweight so the demo can be clicked through without setting up a database. A production version would store messages, audit trails, document links, and correction history in persistent backend services.

The Smart Review area is not connected to a live AI model. Its recommendations are seeded examples that demonstrate how AI output should be presented: with evidence, uncertainty, confidence, and human confirmation points instead of opaque answers.

File upload, document intake, OCR, entity matching, tax-form generation, e-signature, payment, firm billing, and production deployment controls are outside the scope of this prototype. The UI hints at some of those workflows only where needed to make the core case-study experience understandable.

## Design decisions worth explaining

EasyTax is designed around orientation first. The client dashboard avoids a generic analytics view and instead shows the next step, what is blocking progress, and what has already been completed. This is meant to reduce the "where do I start?" problem for taxpayers who may only use the product once a year.

The professional side is designed around action, traceability, and confidence. Preparers and reviewers should not have to hunt through disconnected documents, messages, and return fields. The prototype keeps related objects connected: a return number can point to a source document, a source document can connect to a message thread, and a message can remain tied to the issue it is resolving.

The role system is intentionally one platform instead of six separate products. The same shell, return context, and underlying objects remain consistent, but the navigation and emphasis change by role. That lets a client, business owner, preparer, reviewer, admin, and seasonal staff member each feel like the product was made for their work without fragmenting the overall experience.

AI is treated as a reviewer assistant, not an unquestioned authority. The Smart Review screen makes the AI's claim, proof, uncertainty, and requested confirmation visible. This is important because tax work requires trust, explainability, and human accountability.

The visual design was moved away from an "AI dashboard" look and toward a professional guided tax product. The intent is to feel approachable for clients but still serious enough for a CPA firm. The layout favors readable cards, clear status language, obvious next actions, and practical navigation over decorative or overly futuristic UI.

## What I would build next

If this moved beyond prototype stage, the next priorities would be persistent accounts and permissions, real document upload and OCR, a true PDF viewer with highlights, durable message storage, audit logs for every correction, and integration with tax calculation or return-preparation systems. After that, I would expand the admin experience with firm-level reporting, workload balancing, staff assignment, and client-level visibility controls.
