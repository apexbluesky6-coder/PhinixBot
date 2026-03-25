"use client";

import {
  Zap,
  LayoutGrid,
  Briefcase,
  BrainCircuit,
  Settings,
  Shield,
  ListChecks
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutGrid, label: "Overview", id: "overview" },
  { icon: Briefcase, label: "Active Jobs", count: 12, id: "jobs" },
  { icon: Shield, label: "Accounts", id: "accounts" },
  { icon: ListChecks, label: "Execution Logs", id: "logs" },
  { icon: BrainCircuit, label: "Agent Memory", id: "memory" },
  { icon: Settings, label: "Settings", id: "settings" },
];

interface SidebarProps {
  activeId?: string;
  onNavigate?: (id: string) => void;
}

export default function Sidebar({ activeId = "overview", onNavigate }: SidebarProps) {
  return (
    <aside className="w-72 bg-[#020617]/80 backdrop-blur-xl border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col z-50">
      <div className="p-8 pb-12 text-center flex flex-col items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
            <Zap className="text-white fill-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white">PHINIX<span className="text-blue-500">REMO</span></h1>
        </div>
        <div className="mt-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active • $12.50/hr</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate?.(item.id)}
            className={cn(
              "sidebar-link w-full text-left",
              activeId === item.id && "sidebar-link-active"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-bold text-sm flex-1">{item.label}</span>
            {item.count && (
              <span className="bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full text-white">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 mx-4 mb-4 rounded-2xl bg-blue-600/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase">Core Status</p>
            <p className="text-xs font-bold text-white">V1.0.2 Stable</p>
          </div>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1">
          <div className="bg-blue-600 h-1 rounded-full w-2/3 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
        </div>
      </div>
    </aside>
  );
}
