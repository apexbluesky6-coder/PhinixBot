import { cn } from "@/lib/utils";
import { Zap, Bot, User, CheckCircle2, MoreVertical, ExternalLink } from "lucide-react";

export interface TaskItem {
    id: string;
    platform: string;
    title: string;
    pay: string;
    time: string;
    score: number;
    aiLevel: "None" | "Suggestion" | "Partial" | "Heavy";
    status: "New" | "In-Progress" | "Review";
}

const mockTasks: TaskItem[] = [
    {
        id: "1",
        platform: "Toloka",
        title: "Image Classification: Urban vs Rural",
        pay: "$0.05",
        time: "30s",
        score: 98,
        aiLevel: "Heavy",
        status: "New"
    },
    {
        id: "2",
        platform: "Appen",
        title: "Sentiment Analysis on Product Reviews",
        pay: "$1.20",
        time: "5m",
        score: 85,
        aiLevel: "Partial",
        status: "In-Progress"
    },
    {
        id: "3",
        platform: "Clickworker",
        title: "Search Relevance: Electronics",
        pay: "$0.15",
        time: "2m",
        score: 92,
        aiLevel: "Suggestion",
        status: "New"
    }
];

interface TaskQueueProps {
    onSelectTask?: (task: TaskItem) => void;
}

export default function TaskQueue({ onSelectTask }: TaskQueueProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" /> High-Yield Queue
                </h2>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium">Sorted by PhinixScore</span>
                </div>
            </div>

            <div className="space-y-3">
                {mockTasks.map((task) => (
                    <div
                        key={task.id}
                        className="glass-card p-4 flex items-center gap-6 group hover:translate-x-1 cursor-pointer"
                        onClick={() => onSelectTask?.(task)}
                    >
                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex flex-col items-center justify-center border border-blue-500/20">
                            <span className="text-[10px] uppercase font-bold text-blue-400 leading-none">Score</span>
                            <span className="text-lg font-black text-blue-400">{task.score}</span>
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{task.platform}</span>
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    task.status === "In-Progress" ? "bg-amber-500 animate-pulse" : "bg-blue-500"
                                )} />
                            </div>
                            <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{task.title}</h3>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Estimated EHR</p>
                                <p className="text-sm font-bold text-emerald-400">+{task.pay}</p>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                                {task.aiLevel === "Heavy" ? <Bot className="w-4 h-4 text-blue-400" /> : <User className="w-4 h-4 text-muted-foreground" />}
                                <div className="text-left">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold leading-none mb-1">AI Involvement</p>
                                    <p className="text-xs font-bold">{task.aiLevel}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 transition-all" onClick={(e) => e.stopPropagation()}>
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
