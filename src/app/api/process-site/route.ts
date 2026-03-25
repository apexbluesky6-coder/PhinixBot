import { NextResponse } from 'next/server';
import { PhinixAutomation } from '@/lib/services/automation';
import { phinixBrain } from '@/lib/agents/phinix-brain';

/**
 * Universal Processor API
 * - Takes ANY URL and Profile
 * - Extracts HTML via Stagehand/Playwright
 * - Analyzes with JobPilot Pro Prompt
 */
export async function POST(req: Request) {
    const automation = new PhinixAutomation();

    try {
        const { url, profileId, mode = "scout" } = await req.json();

        if (!url || !profileId) {
            return NextResponse.json({ success: false, error: 'Missing URL or ProfileID' }, { status: 400 });
        }

        console.log(`--- [API] Processing Universal Site: ${url} ---`);

        // 1. Open Page & Extract Content (Universal Layer)
        await automation.openPage(url);
        const html = await automation.getRawHTML();

        // 2. AI Intelligence Layer
        const result = await phinixBrain.invoke({
            url,
            rawData: html.substring(0, 10000), // AI reads first 10k chars
            mode,
            profileId,
            confidence: 0,
            riskTier: 1,
            matchScore: 0
        });

        return NextResponse.json({
            success: true,
            summary: result.summary,
            matchScore: result.matchScore,
            queue: result.topQueue || []
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    } finally {
        await automation.close();
    }
}
