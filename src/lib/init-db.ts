import { query } from './db';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Online',
    risk_level TEXT DEFAULT 'Low'
  );

  CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Idle',
    current_ehr NUMERIC(10,2) DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    quality_score INTEGER DEFAULT 100,
    last_active TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS daily_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_id UUID REFERENCES platforms(id),
    worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    pay TEXT,
    time_est TEXT,
    phinix_score INTEGER,
    ai_involvement TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS feedback_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES daily_tasks(id),
    action TEXT,
    correction TEXT,
    confidence FLOAT,
    timestamp TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS worker_platforms (
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
    credentials JSONB,
    proxy_config JSONB, -- { host, port, username, password }
    PRIMARY KEY (worker_id, platform_id)
  );

  CREATE TABLE IF NOT EXISTS kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES workers(id),
    date DATE DEFAULT CURRENT_DATE,
    earnings_usd NUMERIC(10,2) DEFAULT 0,
    tasks_submitted INTEGER DEFAULT 0,
    tasks_accepted INTEGER DEFAULT 0,
    ai_accuracy_score NUMERIC(5,2) DEFAULT 0,
    ban_risk_score INTEGER DEFAULT 0,
    UNIQUE(worker_id, date)
  );
`;

export async function initDb() {
  try {
    await query(SCHEMA);

    // Seed default data
    const { rows } = await query('SELECT count(*) FROM platforms');
    if (parseInt(rows[0].count) === 0) {
      await query(`
              INSERT INTO platforms (name, status, risk_level) VALUES
              ('Toloka', 'Online', 'Low'),
              ('Appen', 'Online', 'Medium'),
              ('Clickworker', 'Maintenance', 'Low')
            `);
      await query(`
              INSERT INTO workers (name, status, current_ehr, tasks_completed, quality_score) VALUES
              ('Nathan_Ops', 'Active', 14.20, 48, 98),
              ('Phinix_A01', 'Active', 9.45, 124, 100)
            `);
    }

    console.log('✅ Database schema initialized (Multi-Worker Ready)');
  } catch (err) {
    console.error('❌ Database init failed:', err);
  }
}
