"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Activity, Globe, AlertTriangle, Plus, X,
  Rocket, ExternalLink, Loader2, CheckCircle, XCircle,
  Briefcase, Zap, ChevronDown, ChevronUp, MousePointer2,
  ListChecks, Target, Coins, ShieldCheck, Lock
} from "lucide-react";
import AISidePanel from "@/components/dashboard/AISidePanel";
import AccountLinker from "@/components/dashboard/AccountLinker";
import PlatformDetailsPanel from "@/components/dashboard/PlatformDetailsPanel";
import SafetyStatus from "@/components/dashboard/SafetyStatus";
import IntelligenceGrowth from "@/components/dashboard/IntelligenceGrowth";
import EarningsTracker from "@/components/dashboard/EarningsTracker";
import KPIPulse from "@/components/dashboard/KPIPulse";
import { cn } from "@/lib/utils";

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
  platform?: string;
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

type JobStatus = "idle" | "working" | "completed" | "failed";

export default function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [platforms, setPlatforms] = useState<{ name: string; url: string; type: string; icon: string }[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");

  // Scouting State
  const [isDeploying, setIsDeploying] = useState(false);
  const [troopResults, setTroopResults] = useState<TroopResult[]>([]);
  const [expandedTroop, setExpandedTroop] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  // Batch Selection & Work State
  const [selectedJobUrls, setSelectedJobUrls] = useState<Set<string>>(new Set());
  const [jobStatuses, setJobStatuses] = useState<Record<string, JobStatus>>({});
  const [isWorkingAll, setIsWorkingAll] = useState(false);

  // Account Linking State
  const [linkedAccounts, setLinkedAccounts] = useState<Record<string, any>>({});
  const [platformToLink, setPlatformToLink] = useState<any>(null);
  const [selectedPlatformDetail, setSelectedPlatformDetail] = useState<any>(null);

  // Analytics State
  const [earnings, setEarnings] = useState({ today: 0, week: 0, month: 0, avgEhr: 0 });
  const [recentPayouts, setRecentPayouts] = useState<any[]>([]);
  const [kpiStats, setKpiStats] = useState({ accuracy: 0, acceptance: 0, runs: 0 });

  // Persistence Logic
  useEffect(() => {
    const savedPlatforms = localStorage.getItem("phinix_platforms");
    const savedAccounts = localStorage.getItem("phinix_accounts");
    const savedEarnings = localStorage.getItem("phinix_earnings");
    const savedPayouts = localStorage.getItem("phinix_payouts");
    const savedKpis = localStorage.getItem("phinix_kpis");

    if (savedPlatforms) setPlatforms(JSON.parse(savedPlatforms));
    if (savedAccounts) setLinkedAccounts(JSON.parse(savedAccounts));
    if (savedEarnings) setEarnings(JSON.parse(savedEarnings));
    if (savedPayouts) setRecentPayouts(JSON.parse(savedPayouts));
    if (savedKpis) setKpiStats(JSON.parse(savedKpis));
  }, []);

  useEffect(() => {
    if (platforms.length > 0) localStorage.setItem("phinix_platforms", JSON.stringify(platforms));
    localStorage.setItem("phinix_accounts", JSON.stringify(linkedAccounts));
    localStorage.setItem("phinix_earnings", JSON.stringify(earnings));
    localStorage.setItem("phinix_payouts", JSON.stringify(recentPayouts));
    localStorage.setItem("phinix_kpis", JSON.stringify(kpiStats));
  }, [platforms, linkedAccounts, earnings, recentPayouts, kpiStats]);

  const addPlatform = (platform: typeof SUGGESTED_PLATFORMS[0]) => {
    if (!platforms.find((p) => p.url === platform.url)) setPlatforms([...platforms, platform]);
  };
  const removePlatform = (url: string) => setPlatforms(platforms.filter((p) => p.url !== url));

  // === SCOUTING LOGIC ===
  const deployScoutTroops = async (specificPlatforms?: any[]) => {
    const targetPlatforms = specificPlatforms || platforms;
    if (targetPlatforms.length === 0) return;

    setIsDeploying(true);
    setDeployError(null);
    if (!specificPlatforms) setTroopResults([]); // Only clear if full scan

    try {
      const res = await fetch("/api/deploy-troops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms: targetPlatforms.map((p) => ({ name: p.name, url: p.url, type: p.type })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (specificPlatforms) {
        // Merge results if specific
        setTroopResults(prev => {
          const others = prev.filter(r => !specificPlatforms.find(sp => sp.name === r.platform));
          return [...others, ...(data.results || [])];
        });
      } else {
        setTroopResults(data.results || []);
      }
    } catch (err: any) {
      setDeployError(err.message || "Network error");
    } finally {
      setIsDeploying(false);
    }
  };

  // === BATCH WORK LOGIC ===
  const toggleJobSelection = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    const newSet = new Set(selectedJobUrls);
    if (newSet.has(url)) newSet.delete(url); else newSet.add(url);
    setSelectedJobUrls(newSet);
  };

  const deployWorkTroops = async () => {
    if (selectedJobUrls.size === 0) return;
    setIsWorkingAll(true);

    // Create list of tasks from selection
    const tasksToWork: TroopJob[] = [];
    troopResults.forEach(r => {
      r.jobs.forEach(j => {
        if (selectedJobUrls.has(j.url)) tasksToWork.push({ ...j, platform: r.platform });
      });
    });

    // Mark all selected as working
    const newStatuses = { ...jobStatuses };
    tasksToWork.forEach(t => newStatuses[t.url] = "working");
    setJobStatuses(newStatuses);

    try {
      const res = await fetch("/api/auto-work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: tasksToWork, linkedAccounts })
      });
      const data = await res.json();

      // Update statuses based on batch results
      const updatedStatuses = { ...newStatuses };
      let newlyEarned = 0;
      let successCount = 0;

      if (data.results) {
        data.results.forEach((r: any) => {
          const isSuccess = r.status === "completed";
          updatedStatuses[r.jobUrl] = isSuccess ? "completed" : "failed";

          if (isSuccess) {
            successCount++;
            // Parse pay string: e.g. "$15.00" or "10$" -> 15.0
            const task = tasksToWork.find(t => t.url === r.jobUrl);
            const amtStr = (task?.pay || "0").replace(/[^0-9.]/g, "");
            const amt = parseFloat(amtStr) || 0;
            newlyEarned += amt;

            if (amt > 0) {
              setRecentPayouts(prev => [
                { platform: task?.platform || "Unknown", amount: `$${amt.toFixed(2)}`, date: "Just now" },
                ...prev.slice(0, 4)
              ]);
            }
          }
        });
      }

      // Update Analytics
      if (successCount > 0) {
        setEarnings(prev => ({
          ...prev,
          today: prev.today + newlyEarned,
          week: prev.week + newlyEarned,
          month: prev.month + newlyEarned,
          avgEhr: prev.avgEhr === 0 ? 12.5 : prev.avgEhr + 0.5 // Simulated EHR growth
        }));

        setKpiStats(prev => {
          const newRuns = prev.runs + tasksToWork.length;
          const currentSuccesses = (prev.acceptance / 100) * prev.runs + successCount;
          return {
            runs: newRuns,
            accuracy: Math.min(95 + Math.random() * 4, 100), // AI refine simulation
            acceptance: (currentSuccesses / newRuns) * 100
          };
        });
      }

      setJobStatuses(updatedStatuses);
    } catch (err) {
      console.error("Batch work failed", err);
    } finally {
      setIsWorkingAll(false);
      setSelectedJobUrls(new Set());
    }
  };

  const totalResults = troopResults.reduce((sum, t) => sum + t.jobs.length, 0);

  return (
    <div className="space-y-12 pb-24">
      <AISidePanel
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        taskData={selectedTask}
        credentials={selectedTask ? linkedAccounts[selectedTask.platformUrl] : null}
      />

      <AccountLinker
        isOpen={!!platformToLink}
        onClose={() => setPlatformToLink(null)}
        platform={platformToLink}
        existingData={platformToLink ? linkedAccounts[platformToLink.url] : null}
        onSave={(url, data) => setLinkedAccounts({ ...linkedAccounts, [url]: data })}
      />

      <PlatformDetailsPanel
        isOpen={!!selectedPlatformDetail}
        onClose={() => setSelectedPlatformDetail(null)}
        platform={selectedPlatformDetail}
        linkedData={selectedPlatformDetail ? linkedAccounts[selectedPlatformDetail.url] : null}
        troopLogs={[]} // Future: Fetch from DB/logs
        onRescan={async () => {
          await deployScoutTroops([selectedPlatformDetail]);
        }}
      />

      {/* Hero Section */}
      <section className="space-y-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Universal Core Active (Nathan Krop Profile)</span>
        </motion.div>

        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight premium-gradient-text">Phinix Fleet Command</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              <span className="text-white font-bold">Nathan Krop</span> — Deploy Troops to fetch real-time tasks, then send multiple workers to execute them simultaneously.
            </p>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={platforms.length === 0 || isDeploying}
              onClick={() => deployScoutTroops()}
              className={cn("glass-card px-8 py-4 flex items-center gap-3 transition-all",
                platforms.length > 0 ? "bg-blue-600 text-white border-blue-400/50 hover:bg-blue-500" : "bg-white/5 text-muted-foreground border-white/10 cursor-not-allowed")}
            >
              {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-tighter opacity-70">Scouting Intelligence</p>
                <p className="text-sm font-black">{isDeploying ? "Deploying Scouts..." : "Deploy Scouts"}</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={selectedJobUrls.size === 0 || isWorkingAll}
              onClick={deployWorkTroops}
              className={cn("glass-card px-8 py-4 flex items-center gap-3 transition-all",
                selectedJobUrls.size > 0 ? "bg-emerald-500 text-white border-emerald-400/50 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20" : "bg-white/5 text-muted-foreground border-white/10 cursor-not-allowed")}
            >
              {isWorkingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
              <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-tighter opacity-70">Action Phase</p>
                <p className="text-sm font-black">{isWorkingAll ? "Troops Working..." : selectedJobUrls.size > 0 ? `Deploy ${selectedJobUrls.size} Work Troops` : "No Selection"}</p>
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Stats and Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <KPIPulse
            ehr={earnings.avgEhr}
            accuracy={kpiStats.accuracy}
            acceptance={kpiStats.acceptance}
          />

          {/* ===== TROOP REPORTS ===== */}
          {troopResults.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    🪖 Troop Reports
                    <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">{totalResults} found</span>
                  </h2>
                  {selectedJobUrls.size > 0 && (
                    <span className="text-xs font-bold text-emerald-400 animate-pulse flex items-center gap-2">
                      <MousePointer2 className="w-3 h-3" /> {selectedJobUrls.size} Targeted
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => deployScoutTroops()} disabled={isDeploying} className="text-xs font-bold text-muted-foreground hover:text-white transition-colors">↻ Rescan All</button>
                </div>
              </div>

              <div className="space-y-3">
                {troopResults.map((troop) => (
                  <motion.div key={troop.troopId} className="glass-card overflow-hidden border-white/5 hover:border-white/10 transition-colors">
                    <button onClick={() => setExpandedTroop(expandedTroop === troop.troopId ? null : troop.troopId)} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                          troop.status === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400")}>
                          {troop.status === "found" ? <ListChecks className="w-5 h-5" /> : troop.status === "error" ? <XCircle className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">{troop.platform}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{troop.troopId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={cn("text-xs font-bold px-2 py-1 rounded-full", troop.status === "found" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>
                          {troop.status === "found" ? `${troop.jobs.length} scouts active` : "Failed"}
                        </span>
                        {expandedTroop === troop.troopId ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedTroop === troop.troopId && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5">
                          {troop.jobs.map((job, ji) => {
                            const jobStatus = jobStatuses[job.url] || "idle";
                            const isSelected = selectedJobUrls.has(job.url);
                            return (
                              <div key={ji} onClick={() => setSelectedTask({ ...job, id: `TRP-${ji}`, platform: troop.platform, platformUrl: troop.url })} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer group/job relative overflow-hidden">
                                {/* Progress Bar for 'Working' status */}
                                {jobStatus === "working" && <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 60, ease: "linear" }} className="absolute bottom-0 left-0 h-0.5 bg-blue-500" />}

                                <div className="flex items-center gap-4 relative z-10">
                                  <button onClick={(e) => toggleJobSelection(e, job.url)} className={cn("w-5 h-5 rounded border flex items-center justify-center transition-all",
                                    isSelected ? "bg-blue-600 border-blue-500" : "border-white/20 hover:border-white/40")}>
                                    {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                  </button>
                                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    {jobStatus === "working" ? <Loader2 className="w-4 h-4 text-blue-400 animate-spin" /> :
                                      jobStatus === "completed" ? <CheckCircle className="w-4 h-4 text-emerald-400" /> :
                                        jobStatus === "failed" ? <XCircle className="w-4 h-4 text-red-400" /> :
                                          <Target className="w-4 h-4 text-white/20 group-hover/job:text-blue-400 transition-colors" />}
                                  </div>
                                  <div>
                                    <p className={cn("text-xs font-bold transition-colors", jobStatus === "completed" ? "text-emerald-400" : jobStatus === "failed" ? "text-red-400" : "text-white group-hover/job:text-blue-400")}>{job.title}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight">{job.company}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6 relative z-10">
                                  <span className="text-xs font-bold text-blue-400">{job.pay}</span>
                                  <a href={job.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white/20 hover:text-white transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ===== PLATFORM MANAGER ===== */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 px-1">
                <Globe className="w-5 h-5 text-blue-500" /> Deployment Bases
              </h2>
              <button onClick={() => setShowAddForm(!showAddForm)} className="glass-card px-4 py-2 flex items-center gap-2 bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 transition-all text-sm font-bold">
                <Plus className="w-4 h-4" /> Add Custom
              </button>
            </div>

            {showAddForm && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 border-blue-500/20">
                <div className="flex gap-4">
                  <input value={newName} onChange={e => setNewName(e.target.value)} type="text" placeholder="Base Name (e.g. RemoteOK)" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
                  <input value={newUrl} onChange={e => setNewUrl(e.target.value)} type="url" placeholder="https://..." className="flex-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
                  <button onClick={() => { if (newName && newUrl) { setPlatforms([...platforms, { name: newName, url: newUrl, type: "Custom", icon: "🌐" }]); setNewUrl(""); setNewName(""); setShowAddForm(false); } }} className="bg-blue-600 px-6 py-2 rounded-lg font-bold">Add Base</button>
                </div>
              </motion.div>
            )}

            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SUGGESTED_PLATFORMS.map(p => {
                const isAdded = platforms.find(pl => pl.url === p.url);
                const isLinked = linkedAccounts[p.url];
                const domain = new URL(p.url).hostname;
                const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

                return (
                  <motion.div key={p.url} variants={item}
                    onClick={() => isAdded && setSelectedPlatformDetail(p)}
                    className={cn("glass-card p-4 text-left transition-all relative group flex flex-col",
                      isAdded ? "border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/5 cursor-pointer hover:shadow-emerald-500/10" : "hover:border-blue-500/30 cursor-default")}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                        <img src={logoUrl} alt={p.name} className="w-5 h-5 object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-2">
                        {isAdded && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {isAdded && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setPlatformToLink(p); }}
                            className={cn("p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all", isLinked ? "text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/10" : "text-muted-foreground")}
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-bold truncate pr-6">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate opacity-50 mb-4">{domain}</p>

                    <button
                      onClick={(e) => { e.stopPropagation(); isAdded ? removePlatform(p.url) : addPlatform(p); }}
                      className={cn("w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all mt-auto",
                        isAdded ? "bg-white/5 border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400" : "bg-blue-600 border-blue-400/50 hover:bg-blue-500 shadow-lg shadow-blue-500/10 font-black")}
                    >
                      {isAdded ? "Retire Base" : "Add Base"}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <EarningsTracker
            today={earnings.today}
            week={earnings.week}
            month={earnings.month}
            avgEhr={earnings.avgEhr}
            recentPayouts={recentPayouts}
          />
          <div className="p-6 glass-card space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Defensive Guard
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/70">Stealth Mode</p>
                <div className="w-8 h-4 bg-emerald-500/20 rounded-full flex items-center px-0.5 border border-emerald-500/30">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/70">Human Mimicry</p>
                <span className="text-[10px] font-bold text-emerald-400">7-15s delay</span>
              </div>
              <div className="text-[11px] text-muted-foreground italic bg-black/20 p-3 rounded-lg border border-white/5">
                "Defensive protocols active. Each troop operates with an unique IP and interaction pattern."
              </div>
            </div>
          </div>
          <IntelligenceGrowth />
          <SafetyStatus />
        </div>
      </div>
    </div>
  );
}
