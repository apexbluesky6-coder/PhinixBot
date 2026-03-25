import { cn } from "@/lib/utils";
import { LucideIcon, Globe, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

interface PlatformCardProps {
    name: string;
    icon: LucideIcon;
    status: "Online" | "Offline" | "Maintenance";
    tasksCount: number;
    avgPay: string;
    risk: "Low" | "Medium" | "High";
    className?: string;
}

export default function PlatformCard({
    name,
    icon: Icon,
    status,
    tasksCount,
    avgPay,
    risk,
    className,
}: PlatformCardProps) {
    return (
        <div className={cn("glass-card p-6 flex flex-col gap-4 group", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                        <Icon className="text-blue-400 w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{name}</h3>
                        <div className="flex items-center gap-1.5">
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                status === "Online" ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-red-500"
                            )} />
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{status}</span>
                        </div>
                    </div>
                </div>
                <div className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                    risk === "Low" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        risk === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            "bg-red-500/10 text-red-400 border-red-500/20"
                )}>
                    {risk} Risk
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Found Tasks
                    </p>
                    <p className="text-xl font-bold">{tasksCount}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Avg. Time
                    </p>
                    <p className="text-xl font-bold">~12m</p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Est. Pay: <span className="text-white font-bold">{avgPay}/task</span></span>
                <button className="text-xs font-bold text-blue-400 hover:text-blue-200 transition-colors flex items-center gap-1">
                    Open Ingest <CheckCircle2 className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
