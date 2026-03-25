# PhinixRemo: 7-Day Implementation Roadmap (MVP)

This roadmap outlines the path from blueprint to a living, learning assistant.

## Day 1-2: Core Infrastructure
- **Setup**: Next.js (Dashboard) + FastAPI (Agent Backend).
- **Database**: Spin up Postgres with `pgvector`.
- **RAG Baseline**: Ingest 3 major platform ToS/Guidelines (Toloka, Appen, Clickworker) into the vector store.

## Day 3: Browser & Ingestion
- **Stagehand Integration**: Build a "Browser Worker" that can log in and extract task lists using natural language commands.
- **Firecrawl**: Set up the `/scrape` endpoint to convert complicated task instruction pages into clean Markdown.

## Day 4: The Intelligence Core
- **Agent Orchestration**: Implement **LangGraph** workflow for the "Planner -> Explainer -> Judge" sequence.
- **Prompt V2**: Integrate `master_prompt_v2.md` into the Explainer and Judge agents.

## Day 5: Worker Interface (Frontend)
- **Side-Panel**: Build the dynamic AI assistance panel in the dashboard.
- **Feedback UI**: Add the "Accept / Edit / Reject" buttons and ensure they log back to the `tasks_log` table.

## Day 6: Real-World Test (Human-in-the-Loop)
- **Pilot Run**: One worker performs 50 microtasks using the assistant.
- **Observability**: Monitor confidence scores and manual escalation triggers.

## Day 7: The Learning Loop
- **Correction Analysis**: Run a script to compare "AI Suggestions" vs "Human Corrections".
- **Prompt Tuning**: Adjust the system prompt based on pilot feedback.
- **Refinement**: Finalize the "EHR Ticker" to show real earnings impact.
