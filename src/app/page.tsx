"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Activity, Globe, AlertTriangle, Plus, X,
  Rocket, ExternalLink, Loader2, CheckCircle, XCircle,
  Briefcase, Zap, ChevronDown, ChevronUp
} from "lucide-react";
import AISidePanel from "@/components/dashboard/AISidePanel";
import SafetyStatus from "@/components/dashboard/SafetyStatus";
import IntelligenceGrowth from "@/components/dashboard/IntelligenceGrowth";
import EarningsTracker from "@/components/dashboard/EarningsTracker";
import KPIPulse from "@/components/dashboard/KPIPulse";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const SUGGESTED_PLATFORMS = [
  { name: "We Work Remotely", url: "https://weworkremotely.com", type: "Jobs", icon: "💼" },
  { name: "Toloka", url: "https://toloka.ai", type: "Microtasks", icon: "⚡" },
  { name: "Appen", url: "https://connect.appen.com", type: "Microtasks", icon: "🌍" },
  { name: "Upwork", url: "https://www.upwork.com", type: "Freelance", icon: "🚀" },
  { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs", type: "Jobs", icon: "🔗" },
  { name: "Indeed Remote", url: "https://www.indeed.com/q-remote-jobs.html", type: "Jobs", icon: "📋" },
];

interface TroopJob {
  title: string;
  company: string;
  pay: string;
  url: string;
  type: string;
}

interface TroopResult {
  troopId: string;
  platform: string;
  url: string;
  status: "scouting" | "found" | "error";
  jobs: TroopJob[];
  scannedAt: string;
  error?: string;
}

export default function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [platforms, setPlatforms] = useState<{ name: string; url: string; type: string; icon: string }[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");

  // Troop state
  const [isDeploying, setIsDeploying] = useState(false);
  const [troopResults, setTroopResults] = useState<TroopResult[]>([]);
  const [expandedTroop, setExpandedTroop] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  const addPlatform = (platform: typeof SUGGESTED_PLATFORMS[0]) => {
    if (!platforms.find((p) => p.url === platform.url)) {
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
    setPlatforms(platforms.filter((p) => p.url !== url));
  };

  // === DEPLOY TROOPS ===
  const deployTroops = async () => {
    if (platforms.length === 0) return;
    setIsDeploying(true);
    setDeployError(null);
    setTroopResults([]);

    try {
      const res = await fetch("/api/deploy-troops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms: platforms.map((p) => ({ name: p.name, url: p.url, type: p.type })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDeployError(data.error || "Deployment failed");
        return;
      }

      setTroopResults(data.results || []);
    } catch (err: any) {
      setDeployError(err.message || "Network error");
    } finally {
      setIsDeploying(false);
    }
  };

  const totalJobs = troopResults.reduce((sum, t) => sum + t.jobs.length, 0);

  return (
    <div className="space-y-12 pb-24">
      <AISidePanel
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        taskData={selectedTask}
      />

      {/* Hero */}
      <section className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit"
        >
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Universal Core Active (Nathan Krop Profile)
          </span>
        </motion.div>

        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight premium-gradient-text">Phinix Fleet Command</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              <span className="text-white font-bold">Nathan Krop</span> — Add platforms, then deploy your Troops to fetch
              real opportunities.
            </p>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={platforms.length === 0 || isDeploying}
              onClick={deployTroops}
              className={`glass-card px-8 py-4 transition-all flex items-center gap-3 ${platforms.length > 0
                ? "bg-emerald-500 text-white border-emerald-400/50 hover:bg-emerald-400"
                : "bg-white/5 text-muted-foreground border-white/10 cursor-not-allowed"
                } disabled:opacity-50`}
            >
              {isDeploying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Rocket className="w-4 h-4" />
              )}
              <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-tighter opacity-70">
                  {platforms.length} Platform{platforms.length !== 1 ? "s" : ""} Targeted
                </p>
                <p className="text-sm font-black">
                  {isDeploying ? "Deploying Troops..." : "Deploy Troops"}
                </p>
              </div>
            </motion.button>

            <div className="glass-card px-6 py-4 flex items-center gap-4 bg-blue-600/10 border-blue-500/20">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Activity className={`text-blue-500 w-5 h-5 ${isDeploying ? "animate-spin" : ""}`} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Troops Status</p>
                <p className="text-lg font-bold">
                  {isDeploying
                    ? "Scanning..."
                    : troopResults.length > 0
                      ? `${totalJobs} Found`
                      : "Standby"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <KPIPulse />

          {/* ===== TROOP RESULTS ===== */}
          {troopResults.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  🪖 Troop Reports
                  <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                    {totalJobs} opportunities found
                  </span>
                </h2>
                <button
                  onClick={deployTroops}
                  disabled={isDeploying}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  {isDeploying ? "Scanning..." : "↻ Re-scan All"}
                </button>
              </div>

              <div className="space-y-3">
                {troopResults.map((troop) => (
                  <motion.div
                    key={troop.troopId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card overflow-hidden"
                  >
                    {/* Troop header */}
                    <button
                      onClick={() =>
                        setExpandedTroop(expandedTroop === troop.troopId ? null : troop.troopId)
                      }
                      className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${troop.status === "found"
                            ? "bg-emerald-500/10 border border-emerald-500/20"
                            : troop.status === "error"
                              ? "bg-red-500/10 border border-red-500/20"
                              : "bg-blue-500/10 border border-blue-500/20"
                            }`}
                        >
                          {troop.status === "found" ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : troop.status === "error" ? (
                            <XCircle className="w-5 h-5 text-red-400" />
                          ) : (
                            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">{troop.platform}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{troop.troopId}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${troop.status === "found"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : troop.status === "error"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-blue-500/20 text-blue-400"
                            }`}
                        >
                          {troop.status === "found"
                            ? `${troop.jobs.length} jobs`
                            : troop.status === "error"
                              ? "Failed"
                              : "Scouting"}
                        </span>
                        {expandedTroop === troop.troopId ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Expanded job list */}
                    <AnimatePresence>
                      {expandedTroop === troop.troopId && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5"
                        >
                          {troop.error && (
                            <p className="p-4 text-sm text-red-400">{troop.error}</p>
                          )}
                          {troop.jobs.length === 0 && !troop.error && (
                            <p className="p-4 text-sm text-muted-foreground italic">
                              No clear job listings found. The page may require login or has a non-standard layout.
                            </p>
                          )}
                          {troop.jobs.map((job, ji) => (
                            <div
                              key={ji}
                              onClick={() => setSelectedTask({ ...job, id: `TRP-${ji}`, platform: troop.platform })}
                              className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer group/job"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/job:bg-blue-500/20 transition-all">
                                  {job.type === "Microtask" ? (
                                    <Zap className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Briefcase className="w-4 h-4 text-blue-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white group-hover/job:text-blue-400 transition-colors">{job.title}</p>
                                  <p className="text-xs text-muted-foreground">{job.company}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <span className="text-sm font-bold text-emerald-400">{job.pay}</span>
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">
                                  {job.type}
                                </span>
                                <a
                                  href={job.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Error display */}
          {deployError && (
            <div className="glass-card p-4 border-red-500/30 bg-red-500/5 text-red-400 text-sm font-bold">
              ❌ Deployment Error: {deployError}
            </div>
          )}

          {/* Task Queue (empty state when no results) */}
          {troopResults.length === 0 && !isDeploying && (
            <div className="glass-card p-12 flex flex-col items-center justify-center gap-4 text-center border-dashed border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">No Tasks Yet</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Add platforms below, then click{" "}
                <span className="text-emerald-400 font-bold">&quot;Deploy Troops&quot;</span> to send your AI
                workers to fetch real jobs and tasks.
              </p>
            </div>
          )}

          {/* Loading animation */}
          {isDeploying && (
            <div className="glass-card p-12 flex flex-col items-center justify-center gap-6 text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🪖</div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Troops Deployed!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {platforms.length} troops are simultaneously scanning {platforms.length} websites...
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {platforms.map((p) => (
                  <span
                    key={p.url}
                    className="text-[10px] font-bold px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 animate-pulse"
                  >
                    {p.icon} {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

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

            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 space-y-4"
              >
                <h3 className="text-sm font-bold">Add a Custom Platform</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Platform name (e.g. RemoteOK)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="https://www.example.com/jobs"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
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
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">
                Quick Add (Recommended)
              </p>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {SUGGESTED_PLATFORMS.map((p) => {
                  const isAdded = platforms.find((pl) => pl.url === p.url);
                  return (
                    <motion.button
                      key={p.url}
                      variants={item}
                      onClick={() => (isAdded ? removePlatform(p.url) : addPlatform(p))}
                      className={`glass-card p-4 text-left transition-all group ${isAdded ? "border-emerald-500/30 bg-emerald-500/5" : "hover:border-blue-500/30"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{p.icon}</span>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${isAdded
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/5 text-muted-foreground"
                            }`}
                        >
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
                <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-2">
                  Active Scan Targets ({platforms.length})
                </p>
                {platforms.map((p) => (
                  <div
                    key={p.url}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-sm font-bold">{p.name}</span>
                      <a
                        href={p.url}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <button
                      onClick={() => removePlatform(p.url)}
                      className="text-muted-foreground hover:text-red-400 transition-colors"
                    >
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
                <span className="text-white font-bold">0</span> tasks pending your attention. Deploy troops to
                populate this queue.
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
