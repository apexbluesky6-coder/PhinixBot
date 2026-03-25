# PhinixRemo V1: Backend & Frontend Specifications

This document provides technical details for the engine and interface of the PhinixRemo Bot.

## 1. Backend Engine (Process Mapping)

### Ingestion & Normalization
1. **URL Listener**: Monitors a shared "Submit Link" field in the dashboard.
2. **Scraper Service**: Uses headless browser (Puppeteer/Playwright) or API keys (if available) to fetch task metadata.
3. **Data Normalizer**: Maps site-specific fields (e.g., Toloka's `reward` vs Appen's `rate`) to the common `Task` schema.

### Prioritization Logic (The Score)
Each task is assigned a `PhinixScore` calculated as follows:
`Score = (Pay / Estimated_Time) * Worker_Efficiency_Bonus * Quality_Risk_Penalty`

- **Worker_Efficiency_Bonus**: A multiplier based on the worker's historical performance on similar tasks.
- **Quality_Risk_Penalty**: Reduced score for tasks with high historical rejection rates or complex instructions.

### Learning Loop
- **Suggestion Feedback**: If a worker edits an AI-suggested answer before submitting, the AI weights the correction for the next task in the batch.
- **Outcome Sync**: After 24-48 hours, the bot queries the platform for task status (Accepted/Rejected) and updates the worker's quality score.

---

## 2. Frontend Specification (UI/UX)

### Global Dashboard (Admin/Owner)
- **Financial Pulse**: Real-time graph showing cumulative earnings across all platforms today.
- **Worker Heatmap**: Shows which workers are active and who is "stuck" on a task for too long.
- **Platform Health**: Status indicators for Toloka, Appen, and UHRS connectors.

### Worker Workspace
- **Dynamic Task Queue**: A card-based list sorted by `PhinixScore`. Each card shows `EHR` (Effective Hourly Rate) clearly.
- **Instruction Side-Car**:
    - **Tab 1: Simplify**: The AI's 3-point summary of the rules.
    - **Tab 2: Drafts**: Auto-generated answer keys for visual/text classification tasks.
    - **Tab 3: Pitfalls**: Red-boxed warnings about known "trap" questions.
- **Consistency Tracker**: A "Glossary" button that shows the specific tagging rules the worker must follow for the current project.

### Technical Stack Recommendation
- **Frontend**: React/Next.js with Tailwind CSS (Glassmorphism theme).
- **Backend**: Node.js/Python (FastAPI) for processing.
- **Database**: PostgreSQL for relational data; Redis for real-time task queues.
