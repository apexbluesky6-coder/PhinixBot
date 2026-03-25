"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Shield, AlertTriangle, CheckCircle2, Bot, HelpCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface AISidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    taskData: any;
}

export default function AISidePanel({ isOpen, onClose, taskData }: AISidePanelProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [correction, setCorrection] = useState("");

    if (!taskData) return null;

    const handleCorrectionSubmit = () => {
        console.log("Human Correction Logged:", correction);
        setIsEditing(false);
        setCorrection("");
        // In a real app, this would update the PG database and fine-tune the RAG
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-[450px] bg-[#020617] border-l border-white/10 z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-blue-600/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    <Bot className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">Phinix Intelligence</h2>
                                    <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Analysis Active</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Task Summary */}
                            <section className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Sparkles className="w-3 h-3 text-blue-400" /> Intelligence Summary
                                    </h3>
                                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase">
                                        Confidence: 98%
                                    </span>
                                </div>
                                <div className="glass-card p-4 bg-white/5">
                                    <p className="text-sm leading-relaxed text-blue-100">
                                        This task involves <span className="text-white font-bold">visual classification</span> of urban vs rural environments. It corresponds to our tier-1 "Low Risk" rubric.
                                    </p>
                                </div>
                            </section>

                            {/* Simplified Blueprint */}
                            <section className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Simplified Blueprint
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        "Confirm image is not blurry.",
                                        "Look for paved roads vs dirt paths.",
                                        "Identify presence of high-density housing.",
                                        "Select primary label and submit."
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-3 text-sm p-3 rounded-xl bg-white/5 border border-white/5">
                                            <span className="text-blue-500 font-bold">{i + 1}.</span>
                                            <span className="text-muted-foreground">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Warnings / Traps */}
                            <section className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3" /> Trap Warnings
                                </h3>
                                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-3">
                                    <div className="flex gap-3">
                                        <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
                                        <p className="text-xs text-red-300 font-medium leading-relaxed">
                                            <span className="font-bold">Attention Check</span>: Occasionally a "broken link" image appears. You MUST select "Unclear/Error" or account performance will drop.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* AI Suggestion */}
                            {!isEditing ? (
                                <section className="space-y-3 p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Sparkles className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                                        <Bot className="w-3 h-3" /> Phinix Suggestion
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="text-2xl font-bold tracking-tight">Label: URBAN</div>
                                        <p className="text-sm text-blue-200/70 leading-relaxed">
                                            Detected skyscrapers and street lights in the background. High confidence in urban density.
                                        </p>
                                    </div>
                                </section>
                            ) : (
                                <section className="space-y-4 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                                        <HelpCircle className="w-3 h-3" /> Human Correction
                                    </h3>
                                    <textarea
                                        value={correction}
                                        onChange={(e) => setCorrection(e.target.value)}
                                        placeholder="Tell Phinix why this is wrong or what to do differently next time..."
                                        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-amber-500/50 resize-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCorrectionSubmit}
                                            className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold transition-all text-xs flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-3 h-3" /> Save & Learn
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Footer / Feedback */}
                        {!isEditing && (
                            <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
                                <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
                                    Is this suggestion accurate?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold transition-all text-sm active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Accept
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-all text-sm active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <HelpCircle className="w-4 h-4" /> Edit
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
