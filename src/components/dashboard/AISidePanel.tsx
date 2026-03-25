"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BrainCircuit, ShieldAlert, Sparkles, CheckCircle, ChevronRight, Briefcase, FileText, Globe, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface AISidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    taskData: any;
}

export default function AISidePanel({ isOpen, onClose, taskData }: AISidePanelProps) {
    if (!taskData) return null;

    const isJob = taskData.type === "Job";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed right-0 top-0 h-full w-[450px] glass-card border-l border-white/10 z-50 p-8 shadow-2xl overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <BrainCircuit className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold premium-gradient-text">JobPilot Pro</h2>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Universal Intelligence</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Task Header */}
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className={cn(
                                        "text-[10px] font-black px-2 py-1 rounded-full uppercase",
                                        isJob ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"
                                    )}>{taskData.type}</span>
                                    <span className="text-xs font-bold text-white/40">ID: PHX-{taskData.id}</span>
                                </div>
                                <h3 className="text-lg font-bold leading-tight">{taskData.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {taskData.company}</div>
                                    <div className="flex items-center gap-1.5 font-bold text-white"><DollarSign className="w-4 h-4 text-emerald-500" /> {taskData.pay}</div>
                                </div>
                            </div>

                            {/* Phinix Score */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Match Score</p>
                                    <p className="text-3xl font-black text-blue-400">{taskData.score}%</p>
                                </div>
                                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Safety Risk</p>
                                    <p className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
                                        <ShieldAlert className="w-4 h-4" /> Low
                                    </p>
                                </div>
                            </div>

                            {/* Analysis Phases */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Intelligence Phases</h4>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                        <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-white">Phase 1: Discovery</p>
                                            <p className="text-[11px] text-muted-foreground">Listing verified. Requirements (React, Python) matched to NATHAN_OPS profile with 92% efficacy.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                        <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-white">Phase 2: Form Analysis</p>
                                            <p className="text-[11px] text-muted-foreground">Form fields detected. Auto-filled Experience (2.5yr) and Salary expectations ($45/hr) from Profile Vault.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 border-dashed">
                                        <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-white">Phase 3: Final Package</p>
                                            <p className="text-[11px] text-muted-foreground italic">Ready for human verification. Review drafted cover letter below.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview & Action */}
                            <div className="space-y-4 pt-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold font-mono">Draft_CoverLetter.txt</p>
                                    <p className="text-xs italic text-white/60 leading-relaxed">
                                        "Dear Hiring Team, I am writing to express my enthusiasm for the {taskData.title} position... My expertise in React and Automation matches your requirements perfectly..."
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl font-bold flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/20">
                                        Submit Application <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
