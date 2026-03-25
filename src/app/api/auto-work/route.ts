import { NextRequest, NextResponse } from "next/server";
import { troopCommander } from "@/lib/services/troop-commander";

export const maxDuration = 300; // Allow 5 mins for batch work

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tasks, linkedAccounts } = body;

        if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
            return NextResponse.json({ error: "No tasks provided" }, { status: 400 });
        }

        console.log(`🤖 Commander deploying Batch Work for ${tasks.length} tasks...`);

        // Map credentials to each task if available
        const tasksWithCreds = tasks.map((t: any) => ({
            ...t,
            credentials: linkedAccounts ? linkedAccounts[t.platformUrl || t.url] : null
        }));

        // Trigger batch execution
        const results = await troopCommander.deployWorkTroops(tasksWithCreds);

        const succeeded = results.filter(r => r.status === "completed").length;

        return NextResponse.json({
            success: true,
            summary: {
                totalRequested: tasks.length,
                totalSucceeded: succeeded,
                totalFailed: tasks.length - succeeded,
            },
            results
        });

    } catch (error: any) {
        console.error("Batch Work Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to execute batch work" },
            { status: 500 }
        );
    }
}
