"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import AccountSettings from "./AccountSettings";
import ExecutionLogs from "./ExecutionLogs";
import FleetOverview from "./FleetOverview";
import { Activity } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [activeSegment, setActiveSegment] = useState("overview");

    return (
        <div className="flex bg-[#020617] text-white min-h-screen font-sans selection:bg-blue-500/30">
            <Sidebar activeId={activeSegment} onNavigate={setActiveSegment} />
            <main className="flex-1 ml-72 p-12 relative overflow-y-auto h-screen">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto space-y-12">
                    {activeSegment === "overview" && children}

                    {activeSegment === "accounts" && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <AccountSettings />
                        </div>
                    )}

                    {activeSegment === "logs" && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <ExecutionLogs />
                        </div>
                    )}

                    {activeSegment === "jobs" && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <FleetOverview />
                        </div>
                    )}

                    {(activeSegment === "memory" || activeSegment === "settings") && (
                        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                                <Activity className="w-8 h-8 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Segment Developing</h2>
                            <p className="text-muted-foreground italic">Phinix Intelligence is building this interface...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
