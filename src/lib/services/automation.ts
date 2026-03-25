import { Stagehand } from "@browserbasehq/stagehand";

export class PhinixAutomation {
    private stagehand: Stagehand | null = null;

    async init() {
        this.stagehand = new Stagehand({
            env: "LOCAL",
            apiKey: process.env.BROWSERBASE_API_KEY,
            projectId: process.env.BROWSERBASE_PROJECT_ID,
            debugConfig: {
                debug: true,
                showBrowser: true,
            },
            modelName: "gpt-4o",
        });
        await this.stagehand.init();
    }

    // Stealth Delay helper: Simulates human variation
    private async humanWait(min = 1000, max = 3000) {
        const delay = Math.floor(Math.random() * (max - min + 1) + min);
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    async login(platform: string, credentials: any) {
        if (!this.stagehand) await this.init();
        const page = this.stagehand!.page;

        console.log(`--- Logging into ${platform} (Stealth Mode) ---`);
        await page.goto(platform === 'Toloka' ? 'https://toloka.ai/tasker/' : 'https://connect.appen.com/');

        await this.humanWait(3000, 6000); // Wait for page load naturally

        // Natural language automation with Stagehand 'act'
        await page.act(`Click on the login button and enter credentials: ${credentials.email}`);
        await this.humanWait(1500, 3500);
        await page.act(`Enter password and click Submit`);

        return page;
    }

    async scrapeTasks(platform: string) {
        if (!this.stagehand) await this.init();
        const page = this.stagehand!.page;

        console.log(`--- Scraping tasks for ${platform} ---`);
        await this.humanWait(2000, 4000);

        const tasks = await page.extract({
            instruction: "Extract all available tasks from the dashboard, including their titles, payment amount, and estimated time.",
            schema: {
                type: "object",
                properties: {
                    tasks: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                pay: { type: "string" },
                                time: { type: "string" },
                                url: { type: "string" }
                            }
                        }
                    }
                }
            }
        });

        return tasks;
    }

    /**
     * CORE SERVICE: Autonomous Execution with Stealth Guardrails
     * 1. Simulates reading time (7-15s)
     * 2. Performs the action
     * 3. Only submits if confidence is ultra-high (>95%)
     */
    async executeAndSubmit(taskUrl: string, suggestion: string, confidence: number) {
        if (!this.stagehand) await this.init();
        const page = this.stagehand!.page;

        console.log(`--- Executing Task: ${taskUrl} ---`);
        await page.goto(taskUrl);

        // SAFETY MANDATE: Simulation of 'Human Focus' patterns
        console.log("Stealth: Simulating 'Organic Reading' delay (7-15s)...");
        await this.humanWait(7000, 15000);

        // Natural execution
        await page.act(`Select the option that matches '${suggestion}'`);

        // Thinking delay before submission
        await this.humanWait(3000, 5000);

        // Final Submission Check: Human-in-the-Loop Safeguard
        if (confidence >= 0.95) {
            console.log("Stealth: Safe auto-submission authorized.");
            await page.act("Find and click the 'Submit' or 'Finish' button");
            return { success: true, method: 'AUTO-SUBMITTED' };
        } else {
            console.log("Stealth: Low confidence / High complexity. Escalating to human.");
            return { success: false, method: 'ESCALATED_TO_HUMAN' };
        }
    }

    async close() {
        if (this.stagehand) await this.stagehand.close();
    }
}
