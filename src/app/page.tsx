"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Activity, Layers, Zap, Globe, AlertTriangle } from "lucide-react";
import PlatformCard from "@/components/dashboard/PlatformCard";
import TaskQueue from "@/components/dashboard/TaskQueue";
import AISidePanel from "@/components/dashboard/AISidePanel";
import ExecutionLogs from "@/components/dashboard/ExecutionLogs";
import SafetyStatus from "@/components/dashboard/SafetyStatus";
import IntelligenceGrowth from "@/components/dashboard/IntelligenceGrowth";
import EarningsTracker from "@/components/dashboard/EarningsTracker";
import KPIPulse from "@/components/dashboard/KPIPulse";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="space-y-12 pb-24">
      <AISidePanel
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        taskData={selectedTask}
      />

      {/* Hero Section */}
      <section className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit"
        >
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Universal Core Active</span>
        </motion.div>

        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight premium-gradient-text">
              Phinix Fleet Command
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              <span className="text-white font-bold">2 workers + 1 AI agent</span> operating across <span className="text-white font-bold">ANY website</span>. Morning Routine active.
            </p>
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="glass-card px-6 py-4 flex items-center gap-4 bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 transition-all active:scale-95 group disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-600 transition-all">
              <Activity className={`text-blue-500 w-5 h-5 group-hover:text-white ${isSyncing ? "animate-spin" : ""}`} />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Universal Pulse</p>
              <p className="text-lg font-bold">{isSyncing ? "Syncing..." : "24/7 Monitoring"}</p>
            </div>
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <KPIPulse />

          <TaskQueue onSelectTask={setSelectedTask} />

          {/* Connected Platforms */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white/50 italic">
              <Globe className="w-5 h-5" /> Seed Infrastructure
            </h2>
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={item}>
                <PlatformCard name="Toloka" icon={Zap} status="Online" tasksCount={84} avgPay="$0.35" risk="Low" />
              </motion.div>
              <motion.div variants={item}>
                <PlatformCard name="Appen" icon={Globe} status="Online" tasksCount={12} avgPay="$15.00" risk="Medium" />
              </motion.div>
              <motion.div variants={item}>
                <PlatformCard name="Clickworker" icon={Layers} status="Maintenance" tasksCount={0} avgPay="$0.00" risk="Low" className="opacity-40" />
              </motion.div>
            </motion.div>
          </section>

          {/* Escalation */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-amber-500">
              <AlertTriangle className="w-4 h-4" /> Priority Escalations
            </h2>
            <div className="glass-card p-6 border-dashed border-amber-500/20 bg-amber-500/5 flex flex-col items-center justify-center gap-3 text-center">
              <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
                <span className="text-white font-bold">0</span> tasks pending your attention. Universal engine is running autonomously.
              </p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <EarningsTracker />
          <IntelligenceGrowth />
          <SafetyStatus />
          <ExecutionLogs />
        </div>
      </div>
    </div>
  );
}
