import { NextRequest, NextResponse } from "next/server";
import { troopDispatcher } from "@/lib/services/troop-dispatcher";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { platforms } = body;

        if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
            return NextResponse.json(
                { error: "No platforms provided. Send an array of { name, url, type }." },
                { status: 400 }
            );
        }

        // Deploy all troops concurrently
        const results = await troopDispatcher.deployAll(platforms);

        const totalJobs = results.reduce((sum, r) => sum + r.jobs.length, 0);
        const successCount = results.filter(r => r.status !== "error").length;

        return NextResponse.json({
            success: true,
            summary: {
                troopsDeployed: platforms.length,
                troopsSucceeded: successCount,
                totalOpportunities: totalJobs,
                timestamp: new Date().toISOString(),
            },
            results,
        });
    } catch (err: any) {
        console.error("Deploy Troops Error:", err);
        return NextResponse.json(
            { error: err.message || "Troop deployment failed" },
            { status: 500 }
        );
    }
}
