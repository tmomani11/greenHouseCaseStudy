from __future__ import annotations

from datetime import date, timedelta
from random import Random


TODAY = date.today()

USERS = [
    {
        "id": "u_client",
        "name": "Maya Chen",
        "email": "maya@example.com",
        "roles": ["client"],
        "activeRole": "client",
        "avatar": "MC",
    },
    {
        "id": "u_business",
        "name": "Sam Rivera",
        "email": "sam@riverastudio.com",
        "roles": ["business_owner"],
        "activeRole": "business_owner",
        "avatar": "SR",
    },
    {
        "id": "u_preparer",
        "name": "Jordan Lee",
        "email": "jordan@northstar.tax",
        "roles": ["preparer", "client"],
        "activeRole": "preparer",
        "avatar": "JL",
    },
    {
        "id": "u_admin",
        "name": "Priya Shah",
        "email": "priya@northstar.tax",
        "roles": ["reviewer", "firm_admin"],
        "activeRole": "reviewer",
        "avatar": "PS",
    },
    {
        "id": "u_seasonal",
        "name": "Casey Nguyen",
        "email": "casey@northstar.tax",
        "roles": ["seasonal_staff"],
        "activeRole": "seasonal_staff",
        "avatar": "CN",
    },
]

RETURNS = [
    {
        "id": "ret_chen_2025",
        "client": "Maya Chen",
        "entity": "Chen Design Studio LLC",
        "year": 2025,
        "stage": "Open items",
        "progress": 64,
        "owner": "Client",
        "nextAction": "Upload brokerage 1099-B and answer home office question.",
        "blocking": True,
        "dueDate": str(TODAY + timedelta(days=5)),
        "complexity": "High",
        "warnings": 4,
    },
    {
        "id": "ret_orbit_2025",
        "client": "Orbit Coffee",
        "entity": "Orbit Coffee Inc.",
        "year": 2025,
        "stage": "Pending review",
        "progress": 82,
        "owner": "Reviewer",
        "nextAction": "Review Smart Review adjustment for meals limitation.",
        "blocking": False,
        "dueDate": str(TODAY + timedelta(days=11)),
        "complexity": "Medium",
        "warnings": 2,
    },
    {
        "id": "ret_moss_2025",
        "client": "Eli Moss",
        "entity": "Individual return",
        "year": 2025,
        "stage": "Ready to file",
        "progress": 96,
        "owner": "CPA",
        "nextAction": "Send final e-signature packet.",
        "blocking": False,
        "dueDate": str(TODAY + timedelta(days=2)),
        "complexity": "Low",
        "warnings": 0,
    },
]

STATUS_TIMELINE = [
    {"label": "Intake started", "done": True, "owner": "Client", "date": "Feb 3"},
    {"label": "Documents received", "done": True, "owner": "Client", "date": "Feb 9"},
    {"label": "Document review complete", "done": True, "owner": "EasyTax", "date": "Feb 10"},
    {"label": "Open items", "done": False, "owner": "Client", "date": "Now"},
    {"label": "Preparation", "done": False, "owner": "Preparer", "date": "Next"},
    {"label": "Review and file", "done": False, "owner": "Reviewer", "date": "Later"},
]

DOCUMENTS = [
    {
        "id": "doc_w2",
        "title": "2025 W-2 - Acme Systems",
        "fileName": "Maya_Chen_2025_W2_Acme_Systems.pdf",
        "type": "W-2",
        "pages": 2,
        "status": "Verified",
        "uploadedBy": "Client",
        "submittedAt": "Feb 9, 2026 at 8:42 AM",
        "section": "Box 1, wages",
    },
    {
        "id": "doc_1099",
        "title": "1099-INT - First Harbor Bank",
        "fileName": "Maya_Chen_1099_INT_First_Harbor_Bank.pdf",
        "type": "1099-INT",
        "pages": 1,
        "status": "Auto-entered",
        "uploadedBy": "Client",
        "submittedAt": "Feb 9, 2026 at 8:46 AM",
        "section": "Interest income",
    },
    {
        "id": "doc_k1",
        "title": "Schedule K-1 - Bluebird Partners",
        "fileName": "Bluebird_Partners_2025_Schedule_K1.pdf",
        "type": "K-1",
        "pages": 8,
        "status": "Needs approval",
        "uploadedBy": "Client",
        "submittedAt": "Feb 10, 2026 at 2:18 PM",
        "section": "Ordinary business income",
    },
    {
        "id": "doc_receipts",
        "title": "Home office receipts bundle",
        "fileName": "Maya_Chen_Home_Office_Receipts_Bundle.pdf",
        "type": "Receipts",
        "pages": 31,
        "status": "Question open",
        "uploadedBy": "Client",
        "submittedAt": "Feb 10, 2026 at 2:31 PM",
        "section": "Utilities and rent",
    },
]

FIELDS = [
    {
        "id": "f_wages",
        "form": "1040",
        "line": "1a",
        "label": "Wages, salaries, tips",
        "value": 142850,
        "format": "currency",
        "state": "verified",
        "editable": False,
        "documentId": "doc_w2",
        "page": 1,
        "sourceText": "Box 1 wages, tips, other compensation: 142,850.00",
        "calculation": "Direct extraction from W-2 Box 1.",
        "confidence": 0.99,
    },
    {
        "id": "f_interest",
        "form": "1040",
        "line": "2b",
        "label": "Taxable interest",
        "value": 1284,
        "format": "currency",
        "state": "ai",
        "editable": True,
        "documentId": "doc_1099",
        "page": 1,
        "sourceText": "Box 1 interest income: 1,284.17",
        "calculation": "Rounded to whole dollars for Form 1040.",
        "confidence": 0.91,
    },
    {
        "id": "f_business",
        "form": "Schedule E",
        "line": "28",
        "label": "K-1 ordinary business income",
        "value": 38420,
        "format": "currency",
        "state": "approval",
        "editable": False,
        "documentId": "doc_k1",
        "page": 4,
        "sourceText": "Box 1 ordinary business income: 38,420",
        "calculation": "Mapped from K-1 Box 1 to Schedule E passive income section.",
        "confidence": 0.77,
    },
    {
        "id": "f_home_office",
        "form": "8829",
        "line": "36",
        "label": "Home office expense",
        "value": 3612,
        "format": "currency",
        "state": "locked",
        "editable": False,
        "documentId": "doc_receipts",
        "page": 12,
        "sourceText": "Rent + utilities allocated to 11.6% business use.",
        "calculation": "(Rent 26,400 + utilities 4,738) x 11.6%; locked until client answers square footage question.",
        "confidence": 0.68,
    },
]

THREADS = [
    {
        "id": "thread_home_office",
        "title": "Confirm dedicated home office square footage",
        "linkedTo": {"type": "Document", "id": "doc_receipts", "label": "Home office receipts bundle"},
        "visibility": "Client visible",
        "owner": "Client",
        "requestStatus": "Waiting on client",
        "messages": [
            {
                "author": "Jordan Lee",
                "role": "CPA",
                "visibility": "Client visible",
                "body": "Can you confirm the room is used only for business and provide its square footage?",
                "time": "Today 9:12 AM",
            },
            {
                "author": "Priya Shah",
                "role": "Reviewer",
                "visibility": "Internal",
                "body": "Do not approve Form 8829 until the exclusivity answer is explicit.",
                "time": "Today 9:18 AM",
            },
        ],
    },
    {
        "id": "thread_k1",
        "title": "K-1 passive activity treatment",
        "linkedTo": {"type": "Return field", "id": "f_business", "label": "Schedule E line 28"},
        "visibility": "Internal",
        "owner": "Reviewer",
        "requestStatus": "Needs firm decision",
        "messages": [
            {
                "author": "Jordan Lee",
                "role": "CPA",
                "visibility": "Internal",
                "body": "EasyTax mapped this as passive. Prior-year note says Maya materially participated.",
                "time": "Yesterday 4:44 PM",
            }
        ],
    },
]

TASKS = [
    {
        "id": "task_upload_1099b",
        "title": "Upload brokerage 1099-B",
        "owner": "Client",
        "urgency": "Critical",
        "due": str(TODAY + timedelta(days=1)),
        "linked": ["Documents", "Messages"],
        "done": False,
    },
    {
        "id": "task_home_office",
        "title": "Answer home office follow-up",
        "owner": "Client",
        "urgency": "High",
        "due": str(TODAY + timedelta(days=2)),
        "linked": ["Questionnaire", "Form 8829", "Messages"],
        "done": False,
    },
    {
        "id": "task_review_meals",
        "title": "Approve meals limitation adjustment",
        "owner": "Reviewer",
        "urgency": "Medium",
        "due": str(TODAY + timedelta(days=4)),
        "linked": ["Smart Review", "Schedule C"],
        "done": False,
    },
]

ONBOARDING = {
    "clientName": "Maya",
    "headline": "Two items are blocking your return.",
    "percent": 42,
    "steps": [
        {"label": "Create account", "done": True},
        {"label": "Connect document sources", "done": True},
        {"label": "Upload missing forms", "done": False},
        {"label": "Answer CPA questions", "done": False},
        {"label": "Review and sign", "done": False},
    ],
}

AI_RECOMMENDATIONS = [
    {
        "id": "ai_meals",
        "title": "Limit business meals to 50%",
        "impact": -1840,
        "confidence": 0.88,
        "status": "Ready to approve",
        "needsConfirmation": False,
        "recommendation": "Approve the 50% meals limitation adjustment.",
        "why": "Receipts categorized as client meals and no exception evidence was found.",
        "confirmationReason": "No confirmation is needed because the receipts, ledger category, and return treatment all agree.",
        "evidence": ["Expense ledger rows 44-59", "Receipt bundle pages 8-10", "IRS meals rule check"],
        "proof": [
            "All 16 ledger entries are categorized as client meals.",
            "Receipts on pages 8-10 show restaurant names and attendee notes.",
            "No receipt is marked as a firm event, staff event, or reimbursed expense.",
        ],
        "uncertainty": "Two receipts are handwritten and may be staff events instead.",
        "action": "Approve adjustment",
    },
    {
        "id": "ai_k1",
        "title": "Review passive activity classification",
        "impact": 38420,
        "confidence": 0.62,
        "status": "Needs confirmation",
        "needsConfirmation": True,
        "recommendation": "Ask the CPA to confirm whether Maya materially participated before approving Schedule E treatment.",
        "why": "Current-year K-1 lacks participation detail and conflicts with last year's workpaper note.",
        "confirmationReason": "Confirmation is needed because the submitted K-1 does not state participation, and prior-year notes say Maya materially participated.",
        "evidence": ["K-1 page 4", "Prior-year note: materially participated", "No questionnaire answer yet"],
        "proof": [
            "K-1 page 4 shows ordinary business income but no participation statement.",
            "Prior-year workpaper says Maya materially participated.",
            "The client questionnaire has not answered the participation question.",
        ],
        "uncertainty": "Needs CPA judgment before the return can be finalized.",
        "action": "Request clarification",
    },
]


def generate_work_queue(count: int = 180) -> list[dict]:
    rng = Random(42)
    stages = ["Intake", "Open items", "Preparation", "Pending review", "Ready to file"]
    owners = ["Client", "Preparer", "Reviewer", "CPA"]
    clients = [
        "Avery Stone",
        "North Pier LLC",
        "Maya Chen",
        "Orbit Coffee",
        "Juniper Labs",
        "Eli Moss",
        "Cedar Homes",
        "Luna Patel",
    ]
    rows = []
    for i in range(count):
        stage = rng.choice(stages)
        warnings = rng.randint(0, 7)
        due_days = rng.randint(-3, 28)
        owner = rng.choice(owners)
        urgency_score = (30 - due_days) + warnings * 4 + (10 if stage == "Open items" else 0)
        rows.append(
            {
                "id": f"queue_{i + 1}",
                "client": rng.choice(clients),
                "return": f"2025 {rng.choice(['1040', '1120-S', '1065', '1041'])}",
                "stage": stage,
                "owner": owner,
                "dueDate": str(TODAY + timedelta(days=due_days)),
                "warnings": warnings,
                "openItems": rng.randint(0, 9),
                "urgencyScore": urgency_score,
            }
        )
    return sorted(rows, key=lambda row: row["urgencyScore"], reverse=True)


WORK_QUEUE = generate_work_queue()


def dataset() -> dict:
    return {
        "users": USERS,
        "returns": RETURNS,
        "statusTimeline": STATUS_TIMELINE,
        "documents": DOCUMENTS,
        "fields": FIELDS,
        "threads": THREADS,
        "tasks": TASKS,
        "onboarding": ONBOARDING,
        "aiRecommendations": AI_RECOMMENDATIONS,
        "workQueue": WORK_QUEUE,
    }
