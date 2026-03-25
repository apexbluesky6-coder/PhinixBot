"use client";

import { useState } from "react";
import { User, Briefcase, Mail, Phone, MapPin, Globe, FileText, Plus } from "lucide-react";

const profiles = [
    {
        id: "JOB_SEEKER_1",
        name: "Nathan Ops",
        email: "nathan@phinix.ai",
        type: "Job Seeker",
        location: "Nairobi, Kenya",
        skills: ["Python", "React", "Automation"],
        lastUsed: "2 hours ago"
    },
    {
        id: "MICROTASK_WORKER_1",
        name: "Phinix_A01",
        email: "worker@phinix.ai",
        type: "Microtask Worker",
        location: "Remote",
        skills: ["Surveys", "Labeling"],
        lastUsed: "12 mins ago"
    }
];

export default function AccountSettings() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Profile Vault</h2>
                    <p className="text-muted-foreground mt-1">Manage your Job Seeker and Microtask identities.</p>
                </div>
                <button className="glass-card px-4 py-2 flex items-center gap-2 bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 transition-all text-sm font-bold">
                    <Plus className="w-4 h-4" /> New Profile
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profiles.map((profile) => (
                    <div key={profile.id} className="glass-card p-6 space-y-6 group hover:border-blue-500/30 transition-all">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    {profile.type === "Job Seeker" ? <Briefcase className="w-6 h-6 text-blue-400" /> : <User className="w-6 h-6 text-emerald-400" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{profile.name}</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{profile.type}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground bg-white/5 px-2 py-0.5 rounded">ID: {profile.id}</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-white/70">
                                <Mail className="w-4 h-4 text-muted-foreground" /> {profile.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white/70">
                                <MapPin className="w-4 h-4 text-muted-foreground" /> {profile.location}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white/70">
                                <Globe className="w-4 h-4 text-muted-foreground" /> 12 platforms connected
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-3">Core Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map(s => (
                                    <span key={s} className="px-2 py-1 bg-white/5 rounded text-[11px] font-medium border border-white/5">{s}</span>
                                ))}
                            </div>
                        </div>

                        <button className="w-full py-2 rounded-lg bg-blue-600/5 hover:bg-blue-600/20 border border-blue-500/10 transition-all text-xs font-bold uppercase tracking-widest">
                            Edit Profile & Resumes
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
