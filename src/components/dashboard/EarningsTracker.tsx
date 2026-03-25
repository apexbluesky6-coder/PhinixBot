"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Users, Clock, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EarningsTracker() {
    const earningsData = {
        today: "$34.60",
        week: "$187.20",
        month: "$812.40",
        hourlyAvg: "$12.80",
    };

    const recentPayouts = [
        { platform: "Toloka", amount: "+$4.20", time: "12 min ago", worker: "Phinix_A01" },
        { platform: "Appen", amount: "+$15.00", time: "1hr ago", worker: "Nathan_Ops" },
        { platform: "Toloka", amount: "+$2.10", time: "2hr ago", worker: "Phinix_A01" },
    ];

    return (
        <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" /> Revenue Stream
                </h3>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" /> +18% vs last week
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Today</p>
                    <p className="text-2xl font-black text-emerald-400">{earningsData.today}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">This Week</p>
                    <p className="text-2xl font-black">{earningsData.week}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Month</p>
                    <p className="text-xl font-bold text-white/70">{earningsData.month}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Avg EHR</p>
                    <p className="text-xl font-bold text-blue-400">{earningsData.hourlyAvg}</p>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recent Payouts</p>
                {recentPayouts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-white">{p.platform}</span>
                            <span className="text-[10px] text-muted-foreground">by {p.worker}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-emerald-400">{p.amount}</span>
                            <span className="text-[10px] text-muted-foreground">{p.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
