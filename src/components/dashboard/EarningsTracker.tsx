"use client";

import { DollarSign, ArrowUp } from "lucide-react";

export default function EarningsTracker() {
    return (
        <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" /> Revenue Stream
                </h3>
                <span className="text-[10px] font-bold text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    No data yet
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Today</p>
                    <p className="text-2xl font-black text-white/30">$0.00</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">This Week</p>
                    <p className="text-2xl font-black text-white/30">$0.00</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Month</p>
                    <p className="text-xl font-bold text-white/30">$0.00</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Avg EHR</p>
                    <p className="text-xl font-bold text-white/30">$0.00</p>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recent Payouts</p>
                <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
                    <p className="text-xs text-muted-foreground italic">No earnings yet. Add platforms and start scanning to begin tracking revenue.</p>
                </div>
            </div>
        </div>
    );
}
