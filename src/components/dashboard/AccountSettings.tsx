"use client";

import { Briefcase, User, Mail, MapPin, Globe, Github, Plus, ExternalLink } from "lucide-react";

const profiles = [
    {
        id: "JOB_SEEKER_1",
        name: "Nathan Krop",
        email: "neithank47@gmail.com",
        type: "Job Seeker",
        location: "Nairobi & Eldoret, Kenya",
        skills: ["JavaScript", "Python", "Ruby", "React", "REST APIs", "Git"],
        linkedin: "https://www.linkedin.com/in/nathan-isaac-905632257",
        github: "https://github.com/28dallas",
        lastUsed: "Active"
    },
    {
        id: "MICROTASK_WORKER_1",
        name: "Phinix_Worker_A",
        email: "neithank47@gmail.com",
        type: "Microtask Worker",
        location: "Remote (Kenya)",
        skills: ["Surveys", "Image Labeling", "Text Moderation", "Data Entry"],
        linkedin: "",
        github: "",
        lastUsed: "On Standby"
    }
];

export default function AccountSettings() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Profile Vault</h2>
                    <p className="text-muted-foreground mt-1">Your Job Seeker and Microtask identities used for all applications.</p>
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
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-lg font-black">
                                    {profile.type === "Job Seeker" ? "NK" : "PA"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{profile.name}</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{profile.type}</p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${profile.lastUsed === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                                {profile.lastUsed}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-white/70">
                                <Mail className="w-4 h-4 text-muted-foreground shrink-0" /> {profile.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white/70">
                                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" /> {profile.location}
                            </div>
                            {profile.linkedin && (
                                <a href={profile.linkedin} target="_blank" className="flex items-center gap-3 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                    <Globe className="w-4 h-4 shrink-0" /> LinkedIn <ExternalLink className="w-3 h-3 ml-auto" />
                                </a>
                            )}
                            {profile.github && (
                                <a href={profile.github} target="_blank" className="flex items-center gap-3 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                    <Globe className="w-4 h-4 shrink-0" /> GitHub <ExternalLink className="w-3 h-3 ml-auto" />
                                </a>
                            )}
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-3">Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map(s => (
                                    <span key={s} className="px-2 py-1 bg-white/5 rounded text-[11px] font-medium border border-white/5">{s}</span>
                                ))}
                            </div>
                        </div>

                        <button className="w-full py-2 rounded-lg bg-blue-600/5 hover:bg-blue-600/20 border border-blue-500/10 transition-all text-xs font-bold uppercase tracking-widest">
                            {profile.type === "Job Seeker" ? "Edit Profile & Resume" : "Configure Worker Settings"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
