import React from "react";
import {
  X,
  BarChart3,
  CheckCircle2,
  PhoneOff,
  ShieldAlert,
  Clock,
  TrendingDown,
  Users,
  Percent,
} from "lucide-react";
import { MasterStage, CallDisposition } from "../types";
import { STAGES_LIST } from "../engine/masterScriptEngine";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Mock aggregated analytics data tailored for quality and compliance
  const stats = {
    totalCalls: 148,
    completedLeads: 62,
    conversionRate: 41.9,
    refusals: 31,
    securityConcerns: 12,
    callbacks: 24,
    avgCallDurationMin: "3:42",
    verificationFailures: 8,
    dispositionCounts: {
      LEAD_COMPLETED: 62,
      CUSTOMER_NOT_INTERESTED: 24,
      CUSTOMER_BUSY: 18,
      CALL_BACK_REQUESTED: 14,
      SECURITY_CONCERN: 12,
      INFORMATION_NOT_AVAILABLE: 5,
      CUSTOMER_REFUSED_VERIFICATION: 7,
      INVALID_INFORMATION: 3,
      WRONG_PERSON: 2,
      WRONG_NUMBER: 1,
      DO_NOT_CALL: 0,
      TECHNICAL_ISSUE: 0,
      ESCALATED: 0,
      SYSTEM_ERROR: 0,
    } as Record<CallDisposition, number>,
    topObjections: [
      { name: "Customer is busy / no time", count: 42, pct: 28 },
      { name: "Why do you need my DOB?", count: 34, pct: 23 },
      { name: "Send it in writing first", count: 29, pct: 20 },
      { name: "Is this a scam?", count: 18, pct: 12 },
      { name: "Why do you need Customer ID?", count: 15, pct: 10 },
    ],
    stageDropOffs: [
      { stage: "Stage 1 — Opening", dropCount: 22 },
      { stage: "Stage 2 — Current Service", dropCount: 14 },
      { stage: "Stage 3 — Introduce Offer", dropCount: 8 },
      { stage: "Stage 4 — DOB Validation", dropCount: 19 },
      { stage: "Stage 6 — Direct Debit ID", dropCount: 11 },
      { stage: "Stage 9 — Final Questions", dropCount: 4 },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sparta-600/20 text-sparta-400 border border-sparta-500/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Call Center Performance & Compliance Analytics
              </h2>
              <p className="text-[11px] text-slate-400">
                Optimized for lead accuracy, customer clarity, and compliance integrity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Calls
              </span>
              <div className="text-2xl font-black text-white font-mono">{stats.totalCalls}</div>
              <span className="text-[10px] text-slate-500">Recorded sessions</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Completed Leads
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {stats.completedLeads}
              </div>
              <span className="text-[10px] text-emerald-300/70">{stats.conversionRate}% completion rate</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Callbacks Booked
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono">{stats.callbacks}</div>
              <span className="text-[10px] text-amber-300/70">Scheduled follow-ups</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Avg Call Duration
              </span>
              <div className="text-2xl font-black text-sparta-300 font-mono">
                {stats.avgCallDurationMin}
              </div>
              <span className="text-[10px] text-slate-500">Calm pacing</span>
            </div>
          </div>

          {/* Objections & Drop-Offs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Common Objections */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Most Common Customer Objections
              </h3>
              <div className="space-y-2">
                {stats.topObjections.map((o, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-200">{o.name}</span>
                      <span className="text-slate-400 font-mono font-bold">{o.count} ({o.pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${o.pct * 2}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Drop-Offs */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Stage Drop-Off Breakdown
              </h3>
              <div className="space-y-2">
                {stats.stageDropOffs.map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-200">{s.stage}</span>
                      <span className="text-rose-400 font-mono font-bold">-{s.dropCount} drop</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${s.dropCount * 3.5}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Disposition Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Complete Disposition Breakdown (All 14 Categories)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(stats.dispositionCounts).map(([disp, count]) => (
                <div key={disp} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block truncate" title={disp}>
                    {disp.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm font-bold text-white font-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-sparta-600 hover:bg-sparta-500 text-white text-xs font-bold"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
