"use client";

import { BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const kpis = [
    { label: "Fleet EHR", value: "$0.00", target: "$15.00", trend: "—", status: "Waiting" },
    { label: "AI Accuracy", value: "—", target: "95.0%", trend: "—", status: "Waiting" },
    { label: "Acceptance", value: "—", target: "98.0%", trend: "—", status: "Waiting" },
    { label: "Ban Risk", value: "None", target: "< 1%", trend: "0%", status: "Safe" },
];

interface KPIPulseProps {
    ehr?: number;
    accuracy?: number;
    acceptance?: number;
    banRisk?: string;
}

export default function KPIPulse({
    ehr = 0,
    accuracy = 0,
    acceptance = 0,
    banRisk = "None"
}: KPIPulseProps) {
    const kpiData = [
        {
            label: "Fleet EHR",
            value: `$${ehr.toFixed(2)}`,
            target: "$15.00",
            progress: Math.min((ehr / 15) * 100, 100),
            trend: ehr > 0 ? "+Ready" : "—",
            status: ehr > 0 ? "Active" : "Waiting"
        },
        {
            label: "AI Accuracy",
            value: accuracy > 0 ? `${accuracy.toFixed(1)}%` : "—",
            target: "95.0%",
            progress: accuracy,
            trend: accuracy >= 95 ? "+Peak" : accuracy > 0 ? "Stable" : "—",
            status: accuracy > 0 ? "Refining" : "Waiting"
        },
        {
            label: "Acceptance",
            value: acceptance > 0 ? `${acceptance.toFixed(1)}%` : "—",
            target: "98.0%",
            progress: acceptance,
            trend: acceptance >= 98 ? "+High" : acceptance > 0 ? "Normal" : "—",
            status: acceptance > 0 ? "Success" : "Waiting"
        },
        {
            label: "Ban Risk",
            value: banRisk,
            target: "< 1%",
            progress: banRisk === "None" ? 0 : 5,
            trend: "0%",
            status: "Safe"
        },
    ];

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" /> Fleet KPI Pulse
                </h2>
                <span className={cn(
                    "text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 transition-colors",
                    ehr > 0 ? "text-blue-400" : "text-muted-foreground"
                )}>
                    <Clock className="w-3 h-3" /> {ehr > 0 ? "Live Metrics Active" : "Awaiting First Run"}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {kpiData.map((kpi, i) => (
                    <div key={i} className="glass-card p-4 space-y-3 relative group overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/5 blur-[30px] rounded-full group-hover:scale-150 transition-transform duration-700" />

                        <div className="flex items-center justify-between relative z-10">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{kpi.label}</p>
                            <div className={cn(
                                "px-1.5 py-0.5 rounded text-[8px] font-black uppercase transition-colors",
                                kpi.trend !== "—" ? "bg-blue-500/10 text-blue-400" : "bg-white/10 text-muted-foreground"
                            )}>
                                {kpi.trend}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className={cn("text-xl font-black transition-colors", kpi.value !== "—" ? "text-white" : "text-white/40")}>{kpi.value}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                                        style={{ width: `${kpi.progress}%` }}
                                    />
                                </div>
                                <p className="text-[9px] text-muted-foreground font-bold italic whitespace-nowrap">Goal: {kpi.target}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
