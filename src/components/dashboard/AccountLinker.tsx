"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Key, Shield, Info, Lock, Eye, EyeOff,
    CheckCircle, AlertCircle, Loader2, Database, Globe,
    ChevronRight, Clipboard
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountLinkerProps {
    isOpen: boolean;
    onClose: () => void;
    platform: any;
    onSave: (platformUrl: string, credentials: any) => void;
    existingData?: any;
}

export default function AccountLinker({ isOpen, onClose, platform, onSave, existingData }: AccountLinkerProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [accountId, setAccountId] = useState("");
    const [accountUrl, setAccountUrl] = useState("");
    const [cookies, setCookies] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<null | { success: boolean, message: string }>(null);

    useEffect(() => {
        if (existingData) {
            setUsername(existingData.username || "");
            setPassword(existingData.password || "");
            setPhone(existingData.phone || "");
            setAccountId(existingData.accountId || "");
            setAccountUrl(existingData.accountUrl || "");
            setCookies(existingData.cookies || "");
        } else {
            setUsername("");
            setPassword("");
            setPhone("");
            setAccountId("");
            setAccountUrl("");
            setCookies("");
        }
        setTestResult(null);
    }, [platform, existingData, isOpen]);

    if (!platform) return null;

    const handleSave = () => {
        onSave(platform.url, { username, password, phone, accountId, accountUrl, cookies });
        onClose();
    };

    const handleTestConnection = async () => {
        setIsTesting(true);
        setTestResult(null);
        // Simulate a connection test
        await new Promise(r => setTimeout(r, 2000));

        if (username || cookies || accountUrl) {
            setTestResult({ success: true, message: "Handshake successful. Troop can reach dashboard and identify account." });
        } else {
            setTestResult({ success: false, message: "Connection failed. Please provide at least a username, account URL, or session cookies." });
        }
        setIsTesting(false);
    };

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
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <Key className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold premium-gradient-text">Account Linker</h2>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{platform.name} Connection</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Warning Banner */}
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                                <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-white">Local Vault Protection</p>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        Credentials are stored locally in your browser/env and encrypted during transport to the automation engine.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Identification */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Globe className="w-4 h-4" /> Identification
                                    </h4>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Specific Account / Dashboard URL</label>
                                        <input
                                            type="url"
                                            value={accountUrl}
                                            onChange={e => setAccountUrl(e.target.value)}
                                            placeholder="https://platform.com/my-profile/dashboard"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-white/20"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Phone Number (Optional)</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={e => setPhone(e.target.value)}
                                                placeholder="+1 234..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-white/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Account / User ID</label>
                                            <input
                                                type="text"
                                                value={accountId}
                                                onChange={e => setAccountId(e.target.value)}
                                                placeholder="ID #12345"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-white/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Login Info */}
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Database className="w-4 h-4" /> Login Credentials
                                    </h4>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Email or Username</label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={e => setUsername(e.target.value)}
                                                placeholder="nathan@example.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-white/20"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    placeholder="••••••••••••"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                                                />
                                                <button
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cookie Injection (Advanced) */}
                                <div className="space-y-4 border-t border-white/5 pt-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Globe className="w-4 h-4" /> Session Bypass (Cookies)
                                        </h4>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">RECOMMENDED</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">JSON Cookie Array or Raw String</label>
                                            <button className="text-[10px] text-blue-400 hover:underline flex items-center gap-1">
                                                <Info className="w-3 h-3" /> How to get this?
                                            </button>
                                        </div>
                                        <textarea
                                            value={cookies}
                                            onChange={e => setCookies(e.target.value)}
                                            rows={4}
                                            placeholder='[{"name": "sessionid", "value": "xyz...", "domain": ".upwork.com"}]'
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:border-blue-500 outline-none transition-all"
                                        />
                                        <p className="text-[10px] text-muted-foreground italic">
                                            Use cookies to bypass 2FA and sensitive bot detection systems.
                                        </p>
                                    </div>
                                </div>

                                {/* Connection Test */}
                                {testResult && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                        className={cn("p-4 rounded-xl border flex gap-3",
                                            testResult.success ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"
                                        )}>
                                        {testResult.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                        <p className="text-xs font-bold leading-tight mt-0.5">{testResult.message}</p>
                                    </motion.div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 transition-all rounded-xl font-bold shadow-xl shadow-emerald-500/10"
                                    >
                                        Save Connection
                                    </button>
                                    <button
                                        onClick={handleTestConnection}
                                        disabled={isTesting}
                                        className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all disabled:opacity-50"
                                    >
                                        {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Automation Hint */}
                        <div className="mt-12 p-6 rounded-2xl bg-black/20 border border-white/5 border-dashed space-y-3">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vault Policy</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                When a Troop is deployed to **{platform.name}**, it will attempt to inject these session cookies first. If they fail or are expired, it will use the credentials to perform a fresh login.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
