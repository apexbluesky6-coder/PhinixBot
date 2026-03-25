"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Activity, Globe, AlertTriangle, Send, Plus, X, Rocket, ExternalLink } from "lucide-react";
import TaskQueue from "@/components/dashboard/TaskQueue";
import AISidePanel from "@/components/dashboard/AISidePanel";
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

const SUGGESTED_PLATFORMS = [
  { name: "We Work Remotely", url: "https://weworkremotely.com", type: "Jobs", icon: "💼" },
  { name: "Toloka", url: "https://toloka.ai", type: "Microtasks", icon: "⚡" },
  { name: "Appen", url: "https://connect.appen.com", type: "Microtasks", icon: "🌍" },
  { name: "Upwork", url: "https://www.upwork.com", type: "Freelance", icon: "🚀" },
  { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs", type: "Jobs", icon: "🔗" },
  { name: "Indeed Remote", url: "https://www.indeed.com/q-remote-jobs.html", type: "Jobs", icon: "📋" },
];

export default function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [platforms, setPlatforms] = useState<{ name: string; url: string; type: string; icon: string }[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const addPlatform = (platform: typeof SUGGESTED_PLATFORMS[0]) => {
    if (!platforms.find(p => p.url === platform.url)) {
      setPlatforms([...platforms, platform]);
    }
  };

  const addCustomPlatform = () => {
    if (newUrl && newName) {
      setPlatforms([...platforms, { name: newName, url: newUrl, type: "Custom", icon: "🌐" }]);
      setNewUrl("");
      setNewName("");
      setShowAddForm(false);
    }
  };

  const removePlatform = (url: string) => {
    setPlatforms(platforms.filter(p => p.url !== url));
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
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Universal Core Active (Nathan Krop Profile)</span>
        </motion.div>

        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight premium-gradient-text">
              Phinix Fleet Command
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              <span className="text-white font-bold">Nathan Krop</span> — Add your target platforms below and start scanning for opportunities.
            </p>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={platforms.length === 0}
              onClick={handleSync}
              className={`glass-card px-8 py-4 transition-all flex items-center gap-3 ${platforms.length > 0 ? "bg-emerald-500 text-white border-emerald-400/50 hover:bg-emerald-400" : "bg-white/5 text-muted-foreground border-white/10 cursor-not-allowed"}`}
            >
              <Rocket className="w-4 h-4" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-tighter opacity-70">{platforms.length} Platform{platforms.length !== 1 ? "s" : ""} Added</p>
                <p className="text-sm font-black">{isSyncing ? "Scanning..." : "Start Scanning"}</p>
              </div>
            </motion.button>

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
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <KPIPulse />
          <TaskQueue onSelectTask={setSelectedTask} />

          {/* ===== PLATFORM MANAGER ===== */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" /> Target Platforms
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="glass-card px-4 py-2 flex items-center gap-2 bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 transition-all text-sm font-bold"
              >
                <Plus className="w-4 h-4" /> Add Custom URL
              </button>
            </div>

            {/* Custom URL input */}
            {showAddForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-bold">Add a Custom Platform</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Platform name (e.g. Freelancer)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="https://www.example.com/jobs"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                  />
                  <button
                    onClick={addCustomPlatform}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-sm transition-colors"
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            )}

            {/* Suggested Platforms */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">Quick Add (Recommended)</p>
              <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SUGGESTED_PLATFORMS.map(p => {
                  const isAdded = platforms.find(pl => pl.url === p.url);
                  return (
                    <motion.button
                      key={p.url}
                      variants={item}
                      onClick={() => isAdded ? removePlatform(p.url) : addPlatform(p)}
                      className={`glass-card p-4 text-left transition-all group ${isAdded ? "border-emerald-500/30 bg-emerald-500/5" : "hover:border-blue-500/30"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{p.icon}</span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${isAdded ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                          {isAdded ? "✓ Added" : p.type}
                        </span>
                      </div>
                      <p className="text-sm font-bold">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{p.url}</p>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            {/* Active platforms list */}
            {platforms.length > 0 && (
              <div className="glass-card p-4 space-y-2">
                <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-2">Active Scan Targets ({platforms.length})</p>
                {platforms.map(p => (
                  <div key={p.url} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-sm font-bold">{p.name}</span>
                      <a href={p.url} target="_blank" className="text-blue-400 hover:text-blue-300"><ExternalLink className="w-3 h-3" /></a>
                    </div>
                    <button onClick={() => removePlatform(p.url)} className="text-muted-foreground hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Escalation */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-amber-500">
              <AlertTriangle className="w-4 h-4" /> Priority Escalations
            </h2>
            <div className="glass-card p-6 border-dashed border-amber-500/20 bg-amber-500/5 flex flex-col items-center justify-center gap-3 text-center">
              <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
                <span className="text-white font-bold">0</span> tasks pending your attention. Add platforms and scan to populate this queue.
              </p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <EarningsTracker />
          <IntelligenceGrowth />
          <SafetyStatus />
        </div>
      </div>
    </div>
  );
}
