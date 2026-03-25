import { NextRequest, NextResponse } from "next/server";
import { PhinixAutomation } from "@/lib/services/automation";

export const maxDuration = 300; // Allow up to 5 minutes for Stagehand execution

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { platform, url, title, profileId, credentials } = body;

        console.log(`🤖 Deploying AI Worker to execute task on ${platform}: ${title}`);

        // Construct the intent based on the platform and task
        const suggestion = `Look for the job titled "${title}" or the application form for this job. For microtasks, look for "Start Task" or "Accept". Follow the application or execution flow using the profile data for ${profileId}.`;

        // This is a simulation score, in a real app this would come from the match engine
        const confidence = 0.96;

        // Initialize Stagehand
        const automation = new PhinixAutomation();
        await automation.init({
            cookies: credentials?.cookies,
            credentials
        });

        try {
            // Execute the task
            const result = await automation.executeAndSubmit(url, suggestion, confidence);

            await automation.close();

            return NextResponse.json({
                success: true,
                message: `Successfully executed task on ${platform}`,
                details: result
            });
        } catch (error: any) {
            await automation.close();
            throw error;
        }

    } catch (error: any) {
        console.error("Troop Work Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to execute task" },
            { status: 500 }
        );
    }
}
