import FirecrawlApp from "@mendable/firecrawl-js";

export interface TroopResult {
    troopId: string;
    platform: string;
    url: string;
    status: "scouting" | "found" | "error";
    jobs: {
        title: string;
        company: string;
        pay: string;
        url: string;
        type: string;
    }[];
    scannedAt: string;
    error?: string;
}

/**
 * TroopDispatcher: Sends AI troops to multiple websites concurrently.
 * Each troop uses Firecrawl to extract real job listings from target URLs.
 */
export class TroopDispatcher {
    private firecrawl: FirecrawlApp;

    constructor() {
        this.firecrawl = new FirecrawlApp({
            apiKey: process.env.FIRECRAWL_API_KEY || "",
        });
    }

    /**
     * Deploy a single troop to a URL to extract job/task data
     */
    async deployTroop(platform: string, url: string): Promise<TroopResult> {
        const troopId = `TROOP-${platform.replace(/\s+/g, "_").toUpperCase()}-${Date.now().toString(36)}`;
        console.log(`🪖 [${troopId}] Deploying to ${url}...`);

        try {
            // Scrape the page using Firecrawl
            const scrapeResult = await this.firecrawl.v1.scrapeUrl(url, {
                formats: ["markdown"],
            }) as any;

            if (!scrapeResult.success || !scrapeResult.markdown) {
                return {
                    troopId,
                    platform,
                    url,
                    status: "error",
                    jobs: [],
                    scannedAt: new Date().toISOString(),
                    error: "Failed to scrape page content",
                };
            }

            // Extract job listings from the markdown content using pattern matching
            const jobs = this.extractJobsFromMarkdown(scrapeResult.markdown, platform, url);

            console.log(`✅ [${troopId}] Found ${jobs.length} opportunities on ${platform}`);

            return {
                troopId,
                platform,
                url,
                status: jobs.length > 0 ? "found" : "scouting",
                jobs,
                scannedAt: new Date().toISOString(),
            };
        } catch (err: any) {
            console.error(`❌ [${troopId}] Error:`, err.message);
            return {
                troopId,
                platform,
                url,
                status: "error",
                jobs: [],
                scannedAt: new Date().toISOString(),
                error: err.message,
            };
        }
    }

    /**
     * Deploy all troops concurrently to multiple platforms
     */
    async deployAll(
        platforms: { name: string; url: string; type: string }[]
    ): Promise<TroopResult[]> {
        console.log(`\n🚀 DEPLOYING ${platforms.length} TROOPS SIMULTANEOUSLY...\n`);

        const troopPromises = platforms.map((p) =>
            this.deployTroop(p.name, p.url)
        );

        // All troops go out at the same time
        const results = await Promise.allSettled(troopPromises);

        const troopResults: TroopResult[] = results.map((r, i) => {
            if (r.status === "fulfilled") return r.value;
            return {
                troopId: `TROOP-ERROR-${i}`,
                platform: platforms[i].name,
                url: platforms[i].url,
                status: "error" as const,
                jobs: [],
                scannedAt: new Date().toISOString(),
                error: r.reason?.message || "Unknown error",
            };
        });

        const totalJobs = troopResults.reduce((sum, t) => sum + t.jobs.length, 0);
        console.log(`\n📊 TROOPS REPORT: ${totalJobs} total opportunities found across ${platforms.length} platforms.\n`);

        return troopResults;
    }

    /**
     * Parse scraped markdown to extract job listings
     */
    private extractJobsFromMarkdown(
        markdown: string,
        platform: string,
        baseUrl: string
    ): TroopResult["jobs"] {
        const jobs: TroopResult["jobs"] = [];
        const lines = markdown.split("\n");

        // Strategy: Look for patterns that indicate job listings
        // Job boards typically have titles as links/headers, company names, and pay info
        let currentTitle = "";
        let currentCompany = "";
        let currentPay = "";
        let currentUrl = "";

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Match markdown links: [Title](url)
            const linkMatch = trimmed.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) {
                // Save previous job if exists
                if (currentTitle && currentTitle.length > 5) {
                    jobs.push({
                        title: currentTitle,
                        company: currentCompany || platform,
                        pay: currentPay || "See listing",
                        url: currentUrl.startsWith("http") ? currentUrl : `${baseUrl}${currentUrl}`,
                        type: this.detectType(currentTitle),
                    });
                }
                currentTitle = linkMatch[1];
                currentUrl = linkMatch[2];
                currentCompany = "";
                currentPay = "";
                continue;
            }

            // Match headers: ## Title or ### Title
            const headerMatch = trimmed.match(/^#{1,4}\s+(.+)/);
            if (headerMatch && headerMatch[1].length > 5 && !headerMatch[1].toLowerCase().includes("menu") && !headerMatch[1].toLowerCase().includes("footer")) {
                if (currentTitle && currentTitle.length > 5) {
                    jobs.push({
                        title: currentTitle,
                        company: currentCompany || platform,
                        pay: currentPay || "See listing",
                        url: currentUrl || baseUrl,
                        type: this.detectType(currentTitle),
                    });
                }
                currentTitle = headerMatch[1];
                currentUrl = baseUrl;
                currentCompany = "";
                currentPay = "";
                continue;
            }

            // Detect pay/salary patterns
            const payMatch = trimmed.match(/\$[\d,]+(?:\.?\d*)(?:\s*[-\/]\s*\$?[\d,]+(?:\.?\d*))?\s*(?:\/?\s*(?:hr|hour|year|yr|month|mo|day|task))?/i);
            if (payMatch) {
                currentPay = payMatch[0];
            }

            // Detect company names (often follow job titles)
            if (currentTitle && !currentCompany && trimmed.length < 60 && !trimmed.startsWith("#") && !trimmed.startsWith("-") && !trimmed.includes("$")) {
                currentCompany = trimmed.replace(/[*_]/g, "").trim();
            }
        }

        // Don't forget the last one
        if (currentTitle && currentTitle.length > 5) {
            jobs.push({
                title: currentTitle,
                company: currentCompany || platform,
                pay: currentPay || "See listing",
                url: currentUrl.startsWith("http") ? currentUrl : `${baseUrl}${currentUrl}`,
                type: this.detectType(currentTitle),
            });
        }

        // Filter noise (navigation items, etc.)
        return jobs
            .filter(j => j.title.length > 8 && j.title.length < 120)
            .filter(j => !j.title.toLowerCase().includes("sign in") && !j.title.toLowerCase().includes("log in") && !j.title.toLowerCase().includes("cookie"))
            .slice(0, 25); // Cap at 25 per platform
    }

    private detectType(title: string): string {
        const lower = title.toLowerCase();
        if (lower.includes("survey") || lower.includes("label") || lower.includes("moderate")) return "Microtask";
        if (lower.includes("freelance") || lower.includes("contract")) return "Freelance";
        return "Job";
    }
}

export const troopDispatcher = new TroopDispatcher();
