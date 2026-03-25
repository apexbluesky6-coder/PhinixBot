"use client";

import { DollarSign, ArrowUp } from "lucide-react";

interface EarningsTrackerProps {
    today?: number;
    week?: number;
    month?: number;
    avgEhr?: number;
    recentPayouts?: { platform: string; amount: string; date: string }[];
}

export default function EarningsTracker({
    today = 0,
    week = 0,
    month = 0,
    avgEhr = 0,
    recentPayouts = []
}: EarningsTrackerProps) {
    const hasEarnings = today > 0 || week > 0 || month > 0;

    return (
        <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" /> Revenue Stream
                </h3>
                <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded border transition-colors",
                    hasEarnings ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-muted-foreground bg-white/5 border-white/5"
                )}>
                    {hasEarnings ? "Streaming Live" : "No data yet"}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Today</p>
                    <p className={cn("text-2xl font-black", today > 0 ? "text-white" : "text-white/30")}>${today.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">This Week</p>
                    <p className={cn("text-2xl font-black", week > 0 ? "text-white" : "text-white/30")}>${week.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Month</p>
                    <p className={cn("text-xl font-bold", month > 0 ? "text-white" : "text-white/30")}>${month.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Avg EHR</p>
                    <p className={cn("text-xl font-bold", avgEhr > 0 ? "text-blue-400" : "text-white/30")}>${avgEhr.toFixed(2)}</p>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recent Fleet Payouts</p>
                {recentPayouts.length > 0 ? (
                    <div className="space-y-2">
                        {recentPayouts.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                <div className="flex items-center gap-2">
                                    <ArrowUp className="w-3 h-3 text-emerald-500 rotate-45" />
                                    <span className="text-[11px] font-bold">{p.platform}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-bold text-emerald-400">+{p.amount}</p>
                                    <p className="text-[9px] text-muted-foreground">{p.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 gap-2 text-center opacity-50">
                        <p className="text-xs text-muted-foreground italic tracking-tight">Deployment active. Waiting for first mission completion.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
