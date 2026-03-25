import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

export class PhinixAutomation {
    private stagehand: Stagehand | null = null;

    async init(options?: { cookies?: any; credentials?: any }) {
        this.stagehand = new Stagehand({
            env: "LOCAL",
            apiKey: process.env.BROWSERBASE_API_KEY,
            projectId: process.env.BROWSERBASE_PROJECT_ID,
        });

        await this.stagehand.init();

        if (options?.cookies && this.stagehand) {
            try {
                // @ts-ignore - Accessing underlying Playwright Page from Stagehand
                const page = (this.stagehand as any).page;
                const cookieArray = typeof options.cookies === 'string' ? JSON.parse(options.cookies) : options.cookies;
                if (Array.isArray(cookieArray)) {
                    console.log(`--- [Stealth] Injecting ${cookieArray.length} session cookies ---`);
                    await page.context().addCookies(cookieArray);
                }
            } catch (e) {
                console.warn("Failed to parse or inject cookies:", e);
            }
        }
    }

    // Stealth Delay helper: Simulates human variation
    private async humanWait(min = 1000, max = 3000) {
        const delay = Math.floor(Math.random() * (max - min + 1) + min);
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Universal Scraper Layer: Opens any URL
     */
    async openPage(url: string) {
        if (!this.stagehand) await this.init();
        const page = await this.stagehand!.context.awaitActivePage();
        console.log(`--- [Universal] Discovery: ${url} ---`);
        await page.goto(url);
        await this.humanWait(2000, 4000);
    }

    async getRawHTML() {
        if (!this.stagehand) return "";
        const page = await this.stagehand.context.awaitActivePage();
        return (await page.evaluate("document.documentElement.outerHTML")) as string;
    }

    async login(platform: string, credentials: any) {
        if (!this.stagehand) await this.init({ credentials });
        const page = await this.stagehand!.context.awaitActivePage();

        console.log(`--- Logging into ${platform} (Stealth Mode) ---`);
        const loginUrl = platform === 'Toloka' ? 'https://toloka.ai/tasker/' :
            platform === 'Upwork' ? 'https://www.upwork.com/ab/account-security/login' :
                'https://connect.appen.com/';

        await page.goto(loginUrl);
        await this.humanWait(3000, 6000);

        // Natural language automation with Stagehand 'act'
        if (credentials.username || credentials.email) {
            await this.stagehand!.act(`Enter username/email: ${credentials.username || credentials.email}`);
            await this.humanWait(1500, 3000);
            if (credentials.password) {
                await this.stagehand!.act(`Enter password and click the primary login/submit button`);
                await this.humanWait(3000, 5000);
            }
        }

        return page;
    }

    async scrapeTasks(platform: string) {
        if (!this.stagehand) await this.init();

        console.log(`--- Scraping tasks for ${platform} ---`);
        await this.humanWait(2000, 4000);

        const tasks = await this.stagehand!.extract(
            "Extract all available tasks from the dashboard, including their titles, payment amount, and estimated time.",
            z.object({
                tasks: z.array(z.object({
                    title: z.string(),
                    pay: z.string(),
                    time: z.string(),
                    url: z.string()
                }))
            })
        );

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
        const page = await this.stagehand!.context.awaitActivePage();

        console.log(`--- Executing Task: ${taskUrl} ---`);
        await page.goto(taskUrl);

        // SAFETY MANDATE: Simulation of 'Human Focus' patterns
        console.log("Stealth: Simulating 'Organic Reading' delay (7-15s)...");
        await this.humanWait(7000, 15000);

        // Natural execution
        await this.stagehand!.act(`Select the option that matches '${suggestion}'`);

        // Thinking delay before submission
        await this.humanWait(3000, 5000);

        // Final Submission Check: Human-in-the-Loop Safeguard
        if (confidence >= 0.95) {
            console.log("Stealth: Safe auto-submission authorized.");
            await this.stagehand!.act("Find and click the 'Submit' or 'Finish' button");
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
