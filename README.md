# PhinixRemo Bot: AI Operations Co-Pilot

PhinixRemo is a multi-worker, human-in-the-loop AI operations co-pilot designed for crowdsourcing and microtask platforms (Toloka, Appen, Clickworker, etc.). 

It operates as an autonomous fleet command center, utilizing **LangGraph** for logic, **Stagehand** for stealthy browser automation, and a **Glassmorphism Next.js UI** for centralized viewing.

## Features

- **Multi-Worker Fleet**: Run multiple worker accounts simultaneously. The bot assigns tasks based on worker quality scores and tracks per-worker earnings.
- **Stealth Auto-Submit**: Mimics organic human behavior (mouse movements, reading delays) to prevent account bans, autonomously submitting high-confidence tasks.
- **Human-in-the-Loop (HITL)**: Traps and low-confidence tasks are safely escalated to the dashboard for manual human intervention.
- **Progressive Learning**: Every human correction trains the local "Phinix Brain" reinforcement node, making the bot smarter with every interaction.
- **24/7 Background Poller**: A persistent engine that scrapes platforms, deduplicates tasks, and executes them continuously.
- **Premium Dashboard**: Real-time insights into fleet activity, intelligence growth, safety status, and centralized revenue streams.

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend & DB**: Node.js, PostgreSQL (via `pg`).
- **AI Core**: `@langchain/langgraph`, OpenAI (`gpt-4o`).
- **Automation Engine**: `@browserbasehq/stagehand` with Playwright underneath.

## Getting Started

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Configure your environment variables (see `.env.example`).
3. Initialize the database schema:
   ```bash
   npx ts-node src/lib/init-db.ts
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to access the Fleet Command dashboard.

## Deployment

For production deployments, including managing the 24/7 background poller, please refer to the [Deployment Guide](DEPLOYMENT.md).
# PhinixBot
