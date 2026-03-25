"use client";

import { BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const kpis = [
    { label: "Fleet EHR", value: "$0.00", target: "$15.00", trend: "—", status: "Waiting" },
    { label: "AI Accuracy", value: "—", target: "95.0%", trend: "—", status: "Waiting" },
    { label: "Acceptance", value: "—", target: "98.0%", trend: "—", status: "Waiting" },
    { label: "Ban Risk", value: "None", target: "< 1%", trend: "0%", status: "Safe" },
];

export default function KPIPulse() {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" /> Fleet KPI Pulse
                </h2>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Awaiting First Run
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {kpis.map((kpi, i) => (
                    <div key={i} className="glass-card p-4 space-y-3 relative group overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/5 blur-[30px] rounded-full group-hover:scale-150 transition-transform duration-700" />

                        <div className="flex items-center justify-between relative z-10">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{kpi.label}</p>
                            <div className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-white/10 text-muted-foreground">
                                {kpi.trend}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className="text-xl font-black text-white/40">{kpi.value}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-white/10 transition-all duration-1000" style={{ width: "0%" }} />
                                </div>
                                <p className="text-[9px] text-muted-foreground font-bold italic">Goal: {kpi.target}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
