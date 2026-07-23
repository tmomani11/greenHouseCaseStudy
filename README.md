# EasyTax Case Study Prototype

This is a greenfield clickable prototype for the AI Engineer case study. It uses a quick standard-library Python backend with hardcoded sample data and a vanilla HTML/CSS/JavaScript frontend. The frontend is structured like a professional guided tax-prep product: clear next action, progress steps, readable cards, role-aware navigation, and plain-language review screens.

## What is real

- Role switching across all six case-study roles: individual taxpayer, business owner, preparer, reviewer, firm admin, and seasonal staff.
- A firm employee personal-return context is included through Jordan Lee's personal return option.
- Working filters, search, queue ranking, trace panel selection, contextual navigation, onboarding completion, Smart Review correction form, and internal/client-visible thread toggles.
- API endpoints for bootstrap data, source trace lookup, and sample correction submission.
- A "Case coverage" screen that links to working examples for all ten case study requirements.

## What is simulated

- OCR, tax calculations, document parsing, authentication, permissions enforcement, messaging delivery, Smart Review recommendations, and uploads are fabricated from seeded data.
- The document preview is a designed stand-in, not a real PDF viewer.

## Run locally

```bash
cd backend
python server.py
```

Open `http://127.0.0.1:8000`.

If port 8000 is already in use, pass a different port:

```bash
python server.py 8765
```
