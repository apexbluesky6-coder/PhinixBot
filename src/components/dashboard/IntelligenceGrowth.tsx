"use client";

import { motion } from "framer-motion";
import { BrainCircuit, TrendingUp, Cpu, Database, Zap } from "lucide-react";

export default function IntelligenceGrowth() {
    const stats = [
        { label: "Brain Version", value: "V2.1.0 (Advanced)", icon: Cpu, color: "text-blue-500" },
        { label: "Knowledge Nodes", value: "1,284", icon: Database, color: "text-indigo-500" },
        { label: "Correction Log", value: "+12 Today", icon: BrainCircuit, color: "text-amber-500" },
        { label: "Efficacy Increase", value: "+15.4%", icon: TrendingUp, color: "text-emerald-500" },
    ];

    return (
        <div className="glass-card p-6 space-y-6 bg-blue-600/5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-blue-500" /> Intelligence Growth
                </h3>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">LEARNING ACTIVE</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <s.icon className={cn("w-4 h-4", s.color)} />
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{s.label}</p>
                            <p className="text-xs font-bold text-white">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Autonomous Decision Speed</p>
                    <p className="text-xs font-bold text-blue-400">1.2s avg</p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    />
                </div>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
