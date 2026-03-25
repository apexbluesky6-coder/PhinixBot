import { PhinixAutomation } from "./automation";

export interface WorkTask {
    platform: string;
    url: string;
    title: string;
    type: string;
    company: string;
    credentials?: any; // New: Supports login info & cookies
}

export interface WorkResult {
    jobUrl: string;
    platform: string;
    status: "working" | "completed" | "failed";
    details?: any;
    error?: string;
}

/**
 * TroopCommander: Manages a fleet of work troops (Stagehand instances)
 * to perform multiple applications/tasks simultaneously.
 */
export class TroopCommander {
    private maxConcurrent = 2; // Default limit for local execution
    private isStopped = false;

    /**
     * Emergency Halt: Stops further task processing
     */
    stop() {
        console.log("🛑 [Commander] EMERGENCY HALT SIGNAL RECEIVED.");
        this.isStopped = true;
    }

    /**
     * Reset safety flag for new deployments
     */
    reset() {
        this.isStopped = false;
    }

    /**
     * Deploy multiple work troops concurrently
     */
    async deployWorkTroops(tasks: WorkTask[]): Promise<WorkResult[]> {
        this.reset(); // Always reset before a new run
        console.log(`\n🪖 COMMMANDER: Deploying ${tasks.length} Work Troops concurrently...\n`);

        const results: WorkResult[] = [];

        // Split tasks into batches to respect concurrency limits
        for (let i = 0; i < tasks.length; i += this.maxConcurrent) {
            // Check for emergency stop
            if (this.isStopped) {
                console.warn("🛑 [Commander] Stopping Fleet Deployment: Execution Aborted.");
                break;
            }

            const batch = tasks.slice(i, i + this.maxConcurrent);
            console.log(`📦 Working Batch: ${i / this.maxConcurrent + 1}`);

            const batchPromises = batch.map(t => this.executeWork(t));
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }

        return results;
    }

    /**
     * Single work troop execution
     */
    private async executeWork(task: WorkTask): Promise<WorkResult> {
        const automation = new PhinixAutomation();

        try {
            console.log(`🚀 [Troop] Starting work on: ${task.title} (${task.platform})`);

            // Initialize with credentials and cookies if available
            await automation.init({
                cookies: task.credentials?.cookies,
                credentials: task.credentials
            });

            const profileType = task.type === "Microtask" ? "MICROTASK_WORKER_1" : "JOB_SEEKER_1";
            const suggestion = `Perform the application or task for "${task.title}". Use ${profileType} profile data. Focus on submission.`;

            // Higher precision for auto-work to avoid errors
            const result = await automation.executeAndSubmit(task.url, suggestion, 0.96);

            await automation.close();

            return {
                jobUrl: task.url,
                platform: task.platform,
                status: result.success ? "completed" : "failed",
                details: result
            };

        } catch (err: any) {
            console.error(`❌ [Troop] Work failed for ${task.title}:`, err.message);
            await automation.close();
            return {
                jobUrl: task.url,
                platform: task.platform,
                status: "failed",
                error: err.message
            };
        }
    }
}

export const troopCommander = new TroopCommander();
