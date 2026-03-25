"use client";

import { motion } from "framer-motion";
import { List, Filter, Search, Briefcase, Zap, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const tasks = [
    { id: 1, type: "Job", title: "Senior React Developer", company: "We Work Remotely", pay: "$45/hr", time: "Remote", score: 92, status: "Ready" },
    { id: 2, type: "Microtask", title: "Image Labeling (Urban)", company: "Toloka", pay: "$0.35", time: "2 min", score: 85, status: "New" },
    { id: 3, type: "Job", title: "Automation Specialist", company: "Upwork", pay: "$25/hr", time: "Fixed", score: 78, status: "Scouting" },
    { id: 4, type: "Microtask", title: "Text Moderation", company: "Appen", pay: "$1.20", time: "5 min", score: 95, status: "Auto-Pilot" },
];

export default function TaskQueue({ onSelectTask }: { onSelectTask: (task: any) => void }) {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <List className="w-5 h-5 text-blue-500" /> Task & Job Queue
                </h2>

                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search queue..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 transition-all w-64"
                        />
                    </div>
                    <button className="glass-card px-4 py-2 flex items-center gap-2 border-white/5 hover:bg-white/10 transition-all text-xs font-bold">
                        <Filter className="w-3 h-3" /> Filter
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {tasks.map((task) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.01, x: 5 }}
                        onClick={() => onSelectTask(task)}
                        className="glass-card p-4 flex items-center justify-between group cursor-pointer border-white/5 hover:border-blue-500/30 transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center border transition-all",
                                task.type === "Job" ? "bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"
                            )}>
                                {task.type === "Job" ? <Briefcase className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-[9px] font-black px-1.5 py-0.5 rounded uppercase",
                                        task.type === "Job" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"
                                    )}>{task.type}</span>
                                    <h3 className="font-bold text-sm">{task.title}</h3>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">{task.company}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-12">
                            <div className="flex gap-8">
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Pay</p>
                                    <p className="text-sm font-black text-white">{task.pay}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Time/Type</p>
                                    <p className="text-sm font-bold text-white/50">{task.time}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 border-l border-white/5 pl-8">
                                <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">PhinixScore</p>
                                    <p className={cn(
                                        "text-lg font-black",
                                        task.score > 90 ? "text-blue-400" : task.score > 80 ? "text-emerald-400" : "text-amber-400"
                                    )}>{task.score}%</p>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                        task.status === "Auto-Pilot" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-white/5 border-white/10 text-muted-foreground"
                                    )}>{task.status}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
