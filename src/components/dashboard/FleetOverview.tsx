"use client";

import { motion } from "framer-motion";
import { Users, Activity, TrendingUp, MoreVertical, ShieldCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const workers = [
    { id: 1, name: "Nathan_Ops", ehr: "$14.20", tasks: 48, quality: 98, status: "Active" },
    { id: 2, name: "Phinix_A01", ehr: "$9.45", tasks: 124, quality: 100, status: "Active" },
    { id: 3, name: "Sarah_R", ehr: "$12.80", tasks: 22, quality: 94, status: "Idle" },
    { id: 4, name: "Alpha_Node", ehr: "$0.00", tasks: 0, quality: 100, status: "Offline" },
];

export default function FleetOverview() {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" /> Fleet Overview
                </h2>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Active</p>
                        <p className="text-sm font-bold">2 Workers / 1 Agent</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workers.map((worker) => (
                    <div key={worker.id} className="glass-card p-5 group hover:border-blue-500/30 transition-all border border-white/5 relative overflow-hidden">
                        {/* Status Indicator */}
                        <div className={cn(
                            "absolute top-0 right-0 w-12 h-12 bg-blue-500/10 blur-[20px] rounded-full",
                            worker.status === "Active" ? "opacity-100" : "opacity-0"
                        )} />

                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                    {worker.name.includes("Phinix") ? <ShieldCheck className="w-5 h-5 text-blue-400" /> : <Users className="w-5 h-5 text-white/50" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{worker.name}</h4>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                        <span className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            worker.status === "Active" ? "bg-emerald-500" : "bg-white/20"
                                        )} /> {worker.status}
                                    </p>
                                </div>
                            </div>
                            <button className="p-1 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-6 border-t border-white/5 pt-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground font-bold tracking-tight">EHR</p>
                                <p className="text-sm font-black text-white">{worker.ehr}<span className="text-[9px] text-emerald-500 ml-1 font-bold">+2%</span></p>
                            </div>
                            <div className="space-y-1 border-x border-white/5 px-2">
                                <p className="text-[10px] text-muted-foreground font-bold tracking-tight">TASKS</p>
                                <p className="text-sm font-black text-white">{worker.tasks}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] text-muted-foreground font-bold tracking-tight">QUALITY</p>
                                <p className="text-sm font-black text-blue-400">{worker.quality}%</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full py-3 rounded-xl border border-dashed border-white/10 hover:border-blue-500/30 hover:bg-blue-600/5 transition-all group flex items-center justify-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-blue-500 transition-colors">
                    +
                </div>
                <span className="text-xs font-bold text-muted-foreground group-hover:text-white transition-colors uppercase tracking-widest">Connect New Worker Profile</span>
            </button>
        </section>
    );
}
