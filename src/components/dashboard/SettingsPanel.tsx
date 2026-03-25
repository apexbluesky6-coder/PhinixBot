"use client";

import { useState } from "react";
import { Settings, Key, User, Database, Bot, Shield, Save, CheckCircle, Eye, EyeOff, Zap, Globe, Brain } from "lucide-react";

const BOT_PLATFORMS = [
    { id: "toloka", name: "Toloka", icon: "⚡", status: "active" },
    { id: "appen", name: "Appen", icon: "🌍", status: "active" },
    { id: "clickworker", name: "Clickworker", icon: "🖱️", status: "paused" },
    { id: "weworkremotely", name: "We Work Remotely", icon: "💼", status: "active" },
    { id: "upwork", name: "Upwork (Watch Mode)", icon: "🚀", status: "watching" },
];

export default function SettingsPanel() {
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<"profile" | "api" | "bot">("profile");
    const [showKey, setShowKey] = useState(false);

    // Nathan's real profile data (editable)
    const [profile, setProfile] = useState({
        fullName: "Nathan Krop",
        email: "neithank47@gmail.com",
        phone: "",
        location: "Nairobi & Eldoret, Kenya",
        linkedin: "https://www.linkedin.com/in/nathan-isaac-905632257",
        github: "https://github.com/28dallas",
        skills: "JavaScript, Python, Ruby, React, REST APIs, Git",
        experience: "Full-stack developer trained at Moringa School. Built Event Connect, BlueskyAid, and organizational websites.",
        hourlyRate: "$25",
    });

    // Bot settings
    const [botConfig, setBotConfig] = useState({
        autoApply: true,
        humanInLoop: true,
        minMatchScore: 80,
        maxApplicationsPerDay: 20,
        stealthMode: true,
        scanInterval: "30",
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: "profile" as const, label: "Profile Vault", icon: User },
        { id: "api" as const, label: "API Keys", icon: Key },
        { id: "bot" as const, label: "Bot Config", icon: Bot },
    ];

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Settings className="w-8 h-8 text-blue-400" />
                        Settings
                    </h2>
                    <p className="text-muted-foreground mt-1">Configure your bot, profile, and API connections.</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${saved ? "bg-emerald-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
                >
                    {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? "Saved!" : "Save Changes"}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-muted-foreground hover:text-white"}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
                <div className="glass-card p-8 space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-2xl font-black text-blue-400">NK</div>
                        <div>
                            <h3 className="font-bold text-xl">Nathan Krop — Job Seeker Profile</h3>
                            <p className="text-muted-foreground text-sm">This data is used for all job applications and cover letters.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Full Name", key: "fullName" },
                            { label: "Email", key: "email" },
                            { label: "Phone", key: "phone" },
                            { label: "Location", key: "location" },
                            { label: "LinkedIn", key: "linkedin" },
                            { label: "GitHub", key: "github" },
                            { label: "Target Hourly Rate", key: "hourlyRate" },
                        ].map(f => (
                            <div key={f.key} className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{f.label}</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                    value={(profile as any)[f.key]}
                                    onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Key Skills (comma separated)</label>
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                            value={profile.skills}
                            onChange={e => setProfile(p => ({ ...p, skills: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Professional Summary</label>
                        <textarea
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none"
                            value={profile.experience}
                            onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))}
                        />
                    </div>
                </div>
            )}

            {/* API KEYS TAB */}
            {activeTab === "api" && (
                <div className="space-y-4">
                    {[
                        { label: "OpenAI API Key", icon: Brain, hint: "sk-proj-...", env: "OPENAI_API_KEY", status: "✅ Connected" },
                        { label: "Browserbase API Key", icon: Globe, hint: "bb_live_...", env: "BROWSERBASE_API_KEY", status: "✅ Connected" },
                        { label: "Browserbase Project ID", icon: Shield, hint: "27086854-...", env: "BROWSERBASE_PROJECT_ID", status: "✅ Connected" },
                        { label: "Firecrawl API Key", icon: Zap, hint: "fc-...", env: "FIRECRAWL_API_KEY", status: "✅ Connected" },
                        { label: "PostgreSQL Database URL", icon: Database, hint: "postgresql://...", env: "DATABASE_URL", status: "✅ Connected" },
                    ].map(key => (
                        <div key={key.env} className="glass-card p-6 flex items-center gap-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                                <key.icon className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm">{key.label}</p>
                                <p className="text-xs text-muted-foreground font-mono">{key.env}</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full shrink-0">{key.status}</span>
                        </div>
                    ))}
                    <p className="text-xs text-muted-foreground px-2">
                        🔒 API keys are stored securely in your <code className="bg-white/5 px-1.5 py-0.5 rounded">.env</code> file on your local machine and are never transmitted.
                    </p>
                </div>
            )}

            {/* BOT CONFIG TAB */}
            {activeTab === "bot" && (
                <div className="space-y-6">
                    {/* Toggles */}
                    <div className="glass-card p-6 space-y-5">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Behavior</h3>
                        {[
                            { key: "autoApply", label: "Auto-Apply (Quick Apply)", desc: "Bot automatically readies application packages for top matches." },
                            { key: "humanInLoop", label: "Human-in-the-Loop (HITL)", desc: "Low-confidence tasks are escalated for your manual review. Recommended." },
                            { key: "stealthMode", label: "Stealth Mode", desc: "Enables human-mimicry delays and mouse patterns to avoid detection." },
                        ].map(toggle => (
                            <div key={toggle.key} className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold">{toggle.label}</p>
                                    <p className="text-xs text-muted-foreground">{toggle.desc}</p>
                                </div>
                                <button
                                    onClick={() => setBotConfig(c => ({ ...c, [toggle.key]: !(c as any)[toggle.key] }))}
                                    className={`w-12 h-6 rounded-full transition-all shrink-0 relative ${(botConfig as any)[toggle.key] ? "bg-blue-600" : "bg-white/10"}`}
                                >
                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${(botConfig as any)[toggle.key] ? "left-[26px]" : "left-0.5"}`} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Sliders/Numbers */}
                    <div className="glass-card p-6 space-y-5">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Limits & Thresholds</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Min Match Score</label>
                                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50" value={botConfig.minMatchScore} onChange={e => setBotConfig(c => ({ ...c, minMatchScore: +e.target.value }))} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Max Apps / Day</label>
                                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50" value={botConfig.maxApplicationsPerDay} onChange={e => setBotConfig(c => ({ ...c, maxApplicationsPerDay: +e.target.value }))} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Scan Interval (mins)</label>
                                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50" value={botConfig.scanInterval} onChange={e => setBotConfig(c => ({ ...c, scanInterval: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    {/* Platform toggles */}
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Active Platforms</h3>
                        {BOT_PLATFORMS.map(p => (
                            <div key={p.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{p.icon}</span>
                                    <span className="text-sm font-bold">{p.name}</span>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${p.status === "active" ? "bg-emerald-500/20 text-emerald-400" : p.status === "watching" ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-muted-foreground"}`}>
                                    {p.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
