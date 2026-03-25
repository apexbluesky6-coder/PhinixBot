"use client";

import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, AlertCircle, Clock, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SafetyStatus() {
    const safetyMetrics = [
        { label: "IP Masking", value: "Verified Active", icon: ShieldCheck, color: "text-emerald-500" },
        { label: "Mimicry Level", value: "Human-Grade", icon: UserCheck, color: "text-blue-500" },
        { label: "Safety Wait", value: "7-15s Required", icon: Clock, color: "text-amber-500" },
        { label: "Honey-Pot Checks", value: "100% Pass", icon: Target, color: "text-indigo-500" },
    ];

    return (
        <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Ban-Prevention Guard
                </h3>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">STEALTH: ON</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {safetyMetrics.map((m) => (
                    <div key={m.label} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                        <m.icon className={cn("w-5 h-5", m.color)} />
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{m.label}</p>
                            <p className="text-xs font-bold">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 space-y-2">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3" /> Operations Note
                </p>
                <p className="text-[11px] text-blue-200/70 leading-relaxed italic">
                    "The Phinix Stealth engine mimics organic mouse movement and human focus-time patterns. Auto-submission is capped at 3 tasks/minute per IP to maintain account safety."
                </p>
            </div>
        </div>
    );
}
