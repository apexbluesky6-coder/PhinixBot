"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Activity, Globe, ShieldCheck, Zap,
    History, ExternalLink, ChevronRight, BarChart3,
    AlertCircle, CheckCircle, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformDetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    platform: any;
    linkedData?: any;
    troopLogs?: any[];
    onRescan?: () => Promise<void>; // New: Rescan callback
}

export default function PlatformDetailsPanel({ isOpen, onClose, platform, linkedData, troopLogs = [], onRescan }: PlatformDetailsPanelProps) {
    const [isRescanning, setIsRescanning] = useState(false);
    if (!platform) return null;

    const handleRescan = async () => {
        if (!onRescan) return;
        setIsRescanning(true);
        try {
            await onRescan();
        } finally {
            setIsRescanning(false);
        }
    };

    const domain = new URL(platform.url).hostname;
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed right-0 top-0 h-full w-[500px] glass-card border-l border-white/10 z-[70] p-8 shadow-2xl overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 p-2 flex items-center justify-center border border-white/10">
                                    <img src={logoUrl} alt={platform.name} className="w-8 h-8 rounded-lg object-contain" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold premium-gradient-text tracking-tight">{platform.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", linkedData ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/20")} />
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                            {linkedData ? "Deployment Base Linked" : "Awaiting Connection"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                                <X className="w-6 h-6 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-card p-5 border-blue-500/10 bg-blue-500/5">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Fleet Density</p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-3xl font-black text-blue-400">12</p>
                                        <Zap className="w-5 h-5 text-blue-500/40 mb-1" />
                                    </div>
                                    <p className="text-[10px] text-blue-400/60 mt-2">Active Troop Nodes</p>
                                </div>
                                <div className="glass-card p-5 border-emerald-500/10 bg-emerald-500/5">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Platform Health</p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-3xl font-black text-emerald-400">98%</p>
                                        <BarChart3 className="w-5 h-5 text-emerald-500/40 mb-1" />
                                    </div>
                                    <p className="text-[10px] text-emerald-400/60 mt-2">Success Velocity</p>
                                </div>
                            </div>

                            {/* Connection Details */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> Endpoint Intelligence
                                </h4>
                                <div className="glass-card p-4 space-y-3 bg-black/20">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Base URL</span>
                                        <a href={platform.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                                            {domain} <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Encryption Type</span>
                                        <span className="text-white font-mono uppercase">Aes-256 Gcm</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Stealth Level</span>
                                        <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px]">Military Grade</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Logs (Mocked) */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <History className="w-4 h-4" /> Fleet History
                                    </h4>
                                    <button className="text-[10px] font-bold text-muted-foreground hover:text-white flex items-center gap-1 transition-colors">
                                        <RefreshCw className="w-3 h-3" /> Refresh
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { time: "2 min ago", action: "Scouting Troop Alpha", status: "Success", details: "25 targets acquired" },
                                        { time: "1 hour ago", action: "Batch Execution", status: "Success", details: "3 applications processed" },
                                        { time: "3 hours ago", action: "Handshake Test", status: "Success", details: "Credential vault verified" },
                                        { time: "Yesterday", action: "Discovery Run", status: "Partial", details: "CAPTCHA encountered, bypassed" }
                                    ].map((log, li) => (
                                        <div key={li} className="flex gap-4 group cursor-help transition-all">
                                            <div className="flex flex-col items-center gap-1 pt-1">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", log.status === "Success" ? "bg-emerald-500" : "bg-amber-500")} />
                                                <div className="w-[1px] h-full bg-white/5 group-last:bg-transparent" />
                                            </div>
                                            <div className="pb-4 border-b border-white/5 last:border-0 w-full">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{log.action}</p>
                                                    <span className="text-[10px] text-muted-foreground font-mono">{log.time}</span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground">{log.details}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    onClick={handleRescan}
                                    disabled={isRescanning}
                                    className="w-full py-4 glass-card border-blue-500/20 hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold flex items-center justify-center gap-2 group text-sm"
                                >
                                    {isRescanning ? (
                                        <><RefreshCw className="w-4 h-4 animate-spin" /> Deploying Troop...</>
                                    ) : (
                                        <>Initiate Full Site Re-Scan <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
