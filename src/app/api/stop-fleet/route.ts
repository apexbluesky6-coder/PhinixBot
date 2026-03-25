import { NextRequest, NextResponse } from "next/server";
import { troopCommander } from "@/lib/services/troop-commander";

export async function POST(request: NextRequest) {
    try {
        console.log("🚨 [API] Emergency Stop Requested by User.");

        // Signal the commander to halt
        troopCommander.stop();

        return NextResponse.json({
            success: true,
            message: "Emergency Halt Signal Broadcasted. Active batches will terminate after current tasks."
        });

    } catch (error: any) {
        console.error("Stop Fleet Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to broadcast stop signal" },
            { status: 500 }
        );
    }
}
