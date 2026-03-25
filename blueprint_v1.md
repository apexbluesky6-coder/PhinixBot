# PhinixRemo Bot V1: Blueprint

This document defines the high-level architecture and operational rules for the PhinixRemo multi-worker AI assistant.

## System Overview
PhinixRemo acts as a shared intelligence layer for microtask platforms, ensuring human-compliant work while maximizing earnings and consistency.

### 1. Data Models

#### Platform Schema
| Field | Type | Description |
|---|---|---|
| `platform_id` | UUID | Unique identifier |
| `name` | String | e.g., Toloka, Appen, clickworker |
| `base_url` | URL | Platform entry point |
| `region_whitelist` | Array | Allowed countries/regions |
| `payment_gateways` | Array | PayPal, Payoneer, Skrill, etc. |
| `restriction_level` | Enum | `Safe` (Auto-ingest ok), `High` (Manual only) |

#### Worker Profile
| Field | Type | Description |
|---|---|---|
| `worker_id` | UUID | Unique identifier |
| `platforms` | Map | Credentials & accounts (stored securely) |
| `hourly_rate` | Float | Calculated moving average |
| `skills` | Array | Languages, typing, attention, etc. |
| `status` | Enum | `Active`, `Idle`, `OnBreak` |

#### Task Lifecycle
1. **Discovery**: Bot fetches/receives task list.
2. **Scoring**: Task ranked by `(Pay / Time) * Worker Probability`.
3. **Assignment**: Task pushed to appropriate worker queue.
4. **Execution**: Assistant provides side-panel support (plain language rules, trap detection).
5. **Quality Gate**: Bot reviews human answer against platform guidelines.
6. **Submission**: Human clicks final submit button.

---

## 2. Automation Boundaries

### ✅ Permitted (Assistant)
- **Metadata Ingestion**: Scraping task titles, pay, and estimated time (if allowed by ToS).
- **Instruction Summarization**: Converting long PDFs/text to simplified bullet points.
- **Trap Detection**: Highlighting attention checks and trick questions.
- **Drafting Suggestions**: Proposing answers for image labeling, sentiment, etc.
- **Worker Load Balancing**: Distributing tasks to prevent burnout or account bans.

### ❌ Forbidden (Bot)
- **Direct Submission**: AI clicking "Submit" on UHRS or similar platforms.
- **Account Generation**: Automating sign-ups.
- **Multi-account Control**: One worker using multiple accounts on the same site to bypass limits.
- **Captcha Solving**: Automating human-verification steps.

---

## 3. UI/UX Strategy

### Dashboard (Global)
- Unified view of all active platform earnings.
- Real-time "Hot Task" alerts for high-paying microtasks.
- Admin view: Performance of all sub-workers.

### Worker Interface
- **Left Panel**: Central task list ("Queue").
- **Center**: Active platform task window (iframe or dedicated tab).
- **Right Panel (PhinixRemo Side-pilot)**: 
    - Simplified Instructions.
    - AI-generated Answer Drafts.
    - "Trap Warnings" (e.g., "Look for hidden 'None of the above' options").
