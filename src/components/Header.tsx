import React from "react";
import {
  Settings,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Percent,
  FlaskConical,
  HelpCircle,
} from "lucide-react";
import { OfferConfig, MasterStage } from "../types";

interface HeaderProps {
  config: OfferConfig;
  currentStage: MasterStage;
  onResetCall: () => void;
  onOpenAdmin: () => void;
  onOpenObjections: () => void;
  onOpenDobCalculator: () => void;
  onOpenBillCalculator: () => void;
  onOpenTestRunner: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  currentStage: _currentStage,
  onResetCall,
  onOpenAdmin,
  onOpenObjections,
  onOpenDobCalculator,
  onOpenBillCalculator,
  onOpenTestRunner,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 text-white px-4 py-2 sticky top-0 z-40 shadow-sm select-none">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Branding & Script Locked */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sparta-600 flex items-center justify-center p-1 text-slate-950 font-black text-xs shadow-sm">
            SP
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-sm text-white">SPARTA</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              v{config.scriptVersion}
            </span>
            {config.scriptLock && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>LOCKED</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Compact Utilities */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenDobCalculator}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 flex items-center gap-1"
            title="DOB / Age Calculator [D]"
          >
            <Calendar className="w-3 h-3" />
            <span className="hidden sm:inline">Age/DOB</span>
          </button>

          <button
            onClick={onOpenBillCalculator}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 flex items-center gap-1"
            title="30% Savings Calculator [S]"
          >
            <Percent className="w-3 h-3" />
            <span className="hidden sm:inline">30% Savings</span>
          </button>

          <button
            onClick={onOpenObjections}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 flex items-center gap-1"
            title="Objection Library [O]"
          >
            <HelpCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Objections</span>
          </button>

          <button
            onClick={onOpenTestRunner}
            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition-colors"
            title="Run 21 Acceptance Tests"
          >
            <FlaskConical className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Admin Configuration"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResetCall}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="New Call"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
