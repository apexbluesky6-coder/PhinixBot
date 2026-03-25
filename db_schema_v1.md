# PhinixRemo: Unified Database Schema (V1)

This schema combines relational data for management and vector data for long-term memory.

## 1. Relational Layer (PostgreSQL)

### `platforms`
- `id`: UUID (PK)
- `name`: Text
- `tos_summary`: Text (Markdown)
- `risk_profile`: Enum (SAFE, MODERATE, STRICT)
- `ingestion_method`: Enum (FIRE_CRAWL, STAGE_HAND, API)

### `workers`
- `id`: UUID (PK)
- `skills`: JSONB (Languages, platforms, speed)
- `quality_score`: Float (0-100)
- `ehr_moving_avg`: Float (Effective Hourly Rate)

### `tasks_log`
- `id`: UUID (PK)
- `platform_id`: UUID (FK)
- `worker_id`: UUID (FK)
- `task_type`: Text
- `ai_suggestion`: Text
- `human_action`: Enum (ACCEPTED, EDITED, REJECTED, IGNORED)
- `human_correction`: Text (If edited)
- `outcome`: Enum (ACCEPTED, REJECTED, PENDING)
- `confidence`: Float
- `timestamp`: DateTime

### `rubrics`
- `id`: UUID (PK)
- `task_type`: Text (e.g., "Image Classification")
- `guidelines`: Text (Markdown)

---

## 2. Vector Layer (pgvector or Qdrant)

### `knowledge_base` (Memory)
- `id`: UUID
- `type`: Enum (PLATFORM_QUIRK, PROJECT_RULE, PAST_CORRECTION)
- `embedding`: Vector(1536)
- `content`: Text
- `metadata`: JSONB (platform_id, task_type)

### `interaction_patterns`
- Stores successful and failed interaction sequences for **Stagehand** to learn from across platforms.

---

## 3. RAG Pipeline Implementation
- **Source**: Fetch guidelines/ToS via Firecrawl.
- **Chunking**: Use semantic chunking based on header levels.
- **Embedding**: OpenAI `text-embedding-3-small` or local `bge-small-en`.
- **Retrieval**: Hybrid Search (BM25 + Vector) specifically filtered by `platform_id`.
