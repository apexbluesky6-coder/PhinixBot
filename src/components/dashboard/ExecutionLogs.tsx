"use client";

import { motion } from "framer-motion";
import { CheckCircle2, User, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const completedTasks = [
    { id: '1', title: 'Sentiment Analysis', platform: 'Appen', outcome: 'AUTO-SUBMITTED', conf: '94%' },
    { id: '2', title: 'Image Tagging', platform: 'Toloka', outcome: 'HUMAN-REQUIRED', conf: '42%' },
];

export default function ExecutionLogs() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" /> Automation Pulse
                </h2>
            </div>

            <div className="space-y-3">
                {completedTasks.map((log) => (
                    <div key={log.id} className="glass-card p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center border",
                                log.outcome === 'AUTO-SUBMITTED' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                            )}>
                                {log.outcome === 'AUTO-SUBMITTED' ? <CheckCircle2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm">{log.title} <span className="text-[10px] text-muted-foreground uppercase opacity-50">via {log.platform}</span></h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{log.outcome}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">{log.conf}</span>
                                </div>
                            </div>
                        </div>

                        <button className="p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
