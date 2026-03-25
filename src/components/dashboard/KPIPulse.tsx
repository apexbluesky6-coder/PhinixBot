"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp, ShieldCheck, Target, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const kpis = [
    { label: "Fleet EHR", value: "$12.80", target: "$15.00", trend: "+12%", status: "Good" },
    { label: "AI Accuracy", value: "96.2%", target: "95.0%", trend: "+1.4%", status: "Optimal" },
    { label: "Acceptance", value: "94.8%", target: "98.0%", trend: "-0.5%", status: "Warning" },
    { label: "Ban Risk", value: "Low (0.2%)", target: "< 1%", trend: "0%", status: "Safe" },
];

export default function KPIPulse() {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" /> Fleet KPI Pulse
                </h2>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Real-time
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {kpis.map((kpi, i) => (
                    <div key={i} className="glass-card p-4 space-y-3 relative group overflow-hidden">
                        {/* Gradient Pulse */}
                        <div className={cn(
                            "absolute -right-4 -top-4 w-12 h-12 bg-blue-500/10 blur-[30px] rounded-full group-hover:scale-150 transition-transform duration-700",
                            kpi.status === "Warning" ? "bg-amber-500/10" : "bg-blue-500/10"
                        )} />

                        <div className="flex items-center justify-between relative z-10">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{kpi.label}</p>
                            <div className={cn(
                                "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                                kpi.trend.startsWith("+") ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                            )}>
                                {kpi.trend}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className="text-xl font-black text-white">{kpi.value}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", kpi.status === "Warning" ? "bg-amber-500" : "bg-blue-500")}
                                        style={{ width: kpi.status === "Optimal" ? "100%" : "75%" }}
                                    />
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
