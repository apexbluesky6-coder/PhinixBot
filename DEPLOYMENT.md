# PhinixRemo Deployment Guide

This guide outlines how to deploy the PhinixRemo multi-worker autonomous fleet to production.

## 1. Prerequisites

Before deploying, ensure you have the following:
- **Node.js**: v18 or newer.
- **PostgreSQL**: A running instance (e.g., Supabase, Neon, AWS RDS, or local).
- **Accounts**: 
  - [Browserbase](https://browserbase.com) for Stagehand automation.
  - [OpenAI](https://openai.com) for LangGraph intelligence.
  - Optional: [Firecrawl](https://firecrawl.dev) for alternative scraping.

## 2. Environment Setup

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Populate the `.env.local` file with your production API keys and database URL.

## 3. Database Initialization

PhinixRemo requires a specific schema for fleet management and intelligence.

1. Connect to your PostgreSQL database.
2. Run the initialization script to create the necessary tables, relations, and seed data:
   ```bash
   npx ts-node src/lib/init-db.ts
   ```
   *(Note: Ensure you have compiled or are running this in a TS environment. Alternatively, build the project and run the JS output.)*

## 4. Building for Production

Build the Next.js application:
```bash
npm run build
# or
yarn build
```

## 5. Starting the Server

Start the production server:
```bash
npm start
# or
yarn start
```

## 6. Managing the Background Fleet Poller

The Phinix Fleet Poller is a continuous background service that manages multi-worker browser sessions via Stagehand. 

In a serverless deployment (like Vercel), long-running background tasks are restricted. Therefore, for production, it is highly recommended to deploy PhinixRemo to a **VPS (Virtual Private Server)** like DigitalOcean, AWS EC2, or Render (Background Worker).

### Using the API Controls
You can start or stop the autonomous fleet via the API endpoints:
- **Start**: `POST /api/poller` with body `{ "action": "start" }`
- **Stop**: `POST /api/poller` with body `{ "action": "stop" }`

### Using PM2 (Recommended for VPS)
To keep the Next.js server and the background poller running continuously:
```bash
npm install -g pm2
pm2 start npm --name "phinix-remo" -- start
pm2 save
pm2 startup
```

## 7. Security Considerations

- **IP Masking / Proxies**: Stagehand allows you to utilize Browserbase's proxy infrastructure. Ensure this is configured if your microtask platforms are IP-sensitive.
- **Credentials**: Multi-worker credentials are encrypted and stored in the `worker_platforms` table. Ensure your `DATABASE_URL` is highly secured.
