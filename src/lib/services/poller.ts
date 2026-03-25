import { phinixBrain } from '../agents/phinix-brain';
import { PhinixAutomation } from './automation';
import pool from '../db';

/**
 * PhinixPoller: Multi-Worker Autonomous Background Service
 * - Creates a separate automation session per worker
 * - Assigns tasks to the best-fit worker based on quality score
 * - Runs continuously, detecting new daily tasks across platforms
 */
export class PhinixPoller {
    private sessions: Map<string, PhinixAutomation> = new Map();
    private isRunning = false;
    private interval: NodeJS.Timeout | null = null;

    async start(intervalMs = 300000) {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log("--- PHINIX FLEET POLLER STARTED ---");

        // Initial run
        await this.runCycle();

        this.interval = setInterval(async () => {
            await this.runCycle();
        }, intervalMs);
    }

    private async getOrCreateSession(workerId: string): Promise<PhinixAutomation> {
        if (!this.sessions.has(workerId)) {
            const session = new PhinixAutomation();
            this.sessions.set(workerId, session);
        }
        return this.sessions.get(workerId)!;
    }

    private async runCycle() {
        console.log(`--- [${new Date().toISOString()}] Fleet Sync Cycle ---`);
        try {
            // 1. Fetch all active workers
            const { rows: workers } = await pool.query(
                "SELECT * FROM workers WHERE status = 'Active' ORDER BY quality_score DESC"
            );

            if (workers.length === 0) {
                console.log("No active workers. Skipping cycle.");
                return;
            }

            // 2. Fetch all online platforms
            const { rows: platforms } = await pool.query(
                "SELECT * FROM platforms WHERE status = 'Online'"
            );

            for (const platform of platforms) {
                // Round-robin: pick the worker with fewest tasks today
                const bestWorker = workers[0]; // Simplified: highest quality first

                const session = await this.getOrCreateSession(bestWorker.id);

                // 3. Scrape tasks from the platform
                const taskData = await session.scrapeTasks(platform.name);

                if (taskData && taskData.tasks) {
                    for (const task of taskData.tasks) {
                        // 4. Dedup: skip if already processed today
                        const { rows: existing } = await pool.query(
                            "SELECT id FROM daily_tasks WHERE title = $1 AND created_at::date = CURRENT_DATE",
                            [task.title]
                        );
                        if (existing.length > 0) continue;

                        // 5. Analyze with Phinix Intelligence
                        const analysis = await phinixBrain.invoke({
                            taskId: task.title,
                            rawData: task.title,
                            confidence: 0,
                            riskTier: 1,
                            isEscalated: false,
                        });

                        // 6. Auto-execute if safe
                        if (analysis.actionTaken === 'AUTO_SUBMITTED') {
                            console.log(`[${bestWorker.name}] Auto-Executing: ${task.title}`);
                            await session.executeAndSubmit(task.url, analysis.suggestion!, analysis.confidence);
                        }

                        // 7. Log to DB with worker assignment
                        await pool.query(
                            `INSERT INTO daily_tasks 
               (platform_id, worker_id, title, pay, time_est, phinix_score, ai_involvement, status) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                            [
                                platform.id,
                                bestWorker.id,
                                task.title,
                                task.pay,
                                task.time,
                                Math.round(analysis.confidence * 100),
                                analysis.actionTaken,
                                analysis.actionTaken === 'AUTO_SUBMITTED' ? 'Completed' : 'New'
                            ]
                        );

                        // 8. Update worker stats
                        if (analysis.actionTaken === 'AUTO_SUBMITTED') {
                            await pool.query(
                                `UPDATE workers SET tasks_completed = tasks_completed + 1, last_active = NOW() WHERE id = $1`,
                                [bestWorker.id]
                            );
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Fleet Poller Cycle Error:", err);
        }
    }

    async stop() {
        if (this.interval) clearInterval(this.interval);
        this.isRunning = false;
        // Close all browser sessions
        for (const [, session] of this.sessions) {
            await session.close();
        }
        this.sessions.clear();
        console.log("--- PHINIX FLEET POLLER STOPPED ---");
    }
}

export const globalPoller = new PhinixPoller();
