import { phinixBrain } from '../agents/phinix-brain';
import { PhinixAutomation } from './automation';
import pool from '../db';

/**
 * PhinixFleetManager: Orchestrates the "Morning Routine" and Universal Scaling
 * - Discovers new opportunities across all platforms for all workers
 * - Aggregates KPIs and performance metrics
 * - Manages residential proxy rotation
 */
export class PhinixFleetManager {
    private automation = new PhinixAutomation();

    /**
     * Universal Morning Routine:
     * Scans all Job Boards & Microtask Platforms for every active worker
     */
    async runMorningRoutine() {
        console.log("☀️ PHINIX MORNING ROUTINE: Scouting ALL Opportunities...");

        const { rows: workers } = await pool.query("SELECT * FROM workers WHERE status = 'Active'") as { rows: any[] };
        const { rows: platforms } = await pool.query("SELECT * FROM platforms WHERE status = 'Online'") as { rows: any[] };

        for (const worker of workers) {
            for (const platform of platforms) {
                console.log(`[Fleet] Scouting ${platform.name} for ${worker.name}...`);

                // 1. Discovery (Universal Scouting)
                const analysis = await phinixBrain.invoke({
                    url: platform.url,
                    mode: "scout",
                    profileId: worker.name.includes("Phinix") ? "MICROTASK_WORKER_1" : "JOB_SEEKER_1",
                    confidence: 0,
                    riskTier: 1,
                    matchScore: 0
                });

                if (analysis.topQueue && analysis.topQueue.length > 0) {
                    console.log(`[Fleet] Found ${analysis.topQueue.length} match(es) for ${worker.name}`);
                    // Tasks are automatically saved to daily_tasks by the Poller cycle.
                }
            }
        }

        console.log("✅ Morning Routine Complete. Queues updated.");
    }

    /**
     * KPI Pulse Update:
     * Recalculates EHR and AI Accuracy across the fleet
     */
    async updateKPIs() {
        const { rows: stats } = await pool.query(`
      SELECT 
        worker_id,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as accepted,
        COUNT(*) as total,
        AVG(phinix_score) as avg_accuracy
      FROM daily_tasks
      WHERE created_at::date = CURRENT_DATE
      GROUP BY worker_id
    `);

        for (const s of stats) {
            await pool.query(`
        INSERT INTO kpis (worker_id, tasks_submitted, tasks_accepted, ai_accuracy_score)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (worker_id, date) DO UPDATE SET
          tasks_submitted = EXCLUDED.tasks_submitted,
          tasks_accepted = EXCLUDED.tasks_accepted,
          ai_accuracy_score = EXCLUDED.ai_accuracy_score
      `, [s.worker_id, s.total, s.accepted, s.avg_accuracy]);
        }
    }
}

export const fleetManager = new PhinixFleetManager();
