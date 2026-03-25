"use client";

import { List, Search, Filter, Globe, Plus } from "lucide-react";

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

            <div className="glass-card p-12 flex flex-col items-center justify-center gap-4 text-center border-dashed border-white/10">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">No Tasks Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    Add platforms below and click <span className="text-blue-400 font-bold">&quot;Start Scanning&quot;</span> to begin discovering job opportunities and microtasks automatically.
                </p>
            </div>
        </section>
    );
}
