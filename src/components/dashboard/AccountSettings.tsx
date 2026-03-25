"use client";

import { useState } from "react";
import { Shield, Key, Eye, EyeOff, Plus, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Account {
    platform: string;
    email: string;
    isVerified: boolean;
}

export default function AccountSettings() {
    const [accounts, setAccounts] = useState<Account[]>([
        { platform: "Toloka", email: "worker_88@phinix.ai", isVerified: true },
        { platform: "Appen", email: "nathan_ops@gmail.com", isVerified: false }
    ]);
    const [showPass, setShowPass] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight premium-gradient-text">Credential Vault</h1>
                    <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Secure Platform Access</p>
                </div>
                <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Platform
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map((acc) => (
                    <div key={acc.platform} className="glass-card p-6 space-y-4 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                                    <Shield className={cn("w-6 h-6", acc.isVerified ? "text-emerald-500" : "text-amber-500")} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{acc.platform}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground font-mono">{acc.email}</span>
                                        {acc.isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                                    </div>
                                </div>
                            </div>
                            <div className={cn(
                                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border",
                                acc.isVerified ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            )}>
                                {acc.isVerified ? "Authenticated" : "Needs Login"}
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                                    <Key className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPass ? "text" : "password"}
                                    value="••••••••••••"
                                    readOnly
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-xs font-mono focus:outline-none focus:border-blue-500/50"
                                />
                                <button
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-white"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center italic">
                                Credentials are encrypted using AES-256 and never stored in plain text.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
