import React, { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  PhoneForwarded,
  PhoneOff,
  Calendar,
  Percent,
  Keyboard,
  FileCheck,
} from "lucide-react";
import { MasterStage } from "../types";
import { STAGES_LIST } from "../engine/masterScriptEngine";

interface ActionBarProps {
  currentStage: MasterStage;
  onPrevious: () => void;
  onNext: () => void;
  onOpenObjections: () => void;
  onOpenCallback: () => void;
  onOpenDobCalculator: () => void;
  onOpenBillCalculator: () => void;
  onEndCall: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  currentStage,
  onPrevious,
  onNext,
  onOpenObjections,
  onOpenCallback,
  onOpenDobCalculator,
  onOpenBillCalculator,
  onEndCall,
}) => {
  const currentIndex = STAGES_LIST.indexOf(currentStage);
  const canGoBack = currentIndex > 0;
  const isFinalStage = currentStage === "STAGE_11_NATURAL_CLOSE";

  // Global Keyboard Shortcuts (1-9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.key) {
        case "1":
          e.preventDefault();
          if (canGoBack) onPrevious();
          break;
        case "4":
          e.preventDefault();
          onOpenObjections();
          break;
        case "5":
          e.preventDefault();
          onOpenDobCalculator();
          break;
        case "6":
          e.preventDefault();
          onOpenBillCalculator();
          break;
        case "7":
          e.preventDefault();
          onNext();
          break;
        case "8":
          e.preventDefault();
          onOpenCallback();
          break;
        case "9":
          e.preventDefault();
          onEndCall();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canGoBack, onPrevious, onNext, onOpenObjections, onOpenCallback, onOpenDobCalculator, onOpenBillCalculator, onEndCall]);

  return (
    <nav aria-label="Call controls" className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 text-xs text-slate-300">
      <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Quick Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrevious}
            disabled={!canGoBack}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-medium flex items-center gap-1 border border-slate-700 transition-all"
            title="Shortkey [1]"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>[1] Previous</span>
          </button>

          <button
            onClick={onOpenObjections}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1"
            title="Shortkey [4]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>[4] Objections</span>
          </button>

          <button
            onClick={onOpenDobCalculator}
            className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium flex items-center gap-1"
            title="Shortkey [5]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>[5] DOB Tool</span>
          </button>

          <button
            onClick={onOpenBillCalculator}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1"
            title="Shortkey [6]"
          >
            <Percent className="w-3.5 h-3.5" />
            <span>[6] 30% Savings</span>
          </button>
        </div>

        {/* Center: Keyboard hint */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 font-mono">
          <Keyboard className="w-3 h-3 text-slate-400" />
          <span>Shortcuts: 1=Back, 4=Objections, 5=DOB, 6=Savings, 7=Next, 8=Callback, 9=End</span>
        </div>

        {/* Right: Progress & End */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCallback}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1"
            title="Shortkey [8]"
          >
            <PhoneForwarded className="w-3.5 h-3.5 text-sparta-400" />
            <span>[8] Callback</span>
          </button>

          <button
            onClick={onNext}
            className="px-4 py-1.5 rounded-lg bg-sparta-600 hover:bg-sparta-500 text-white font-bold flex items-center gap-1 shadow-sm"
            title="Shortkey [7]"
          >
            <span>{isFinalStage ? "Finish" : "[7] Next"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onEndCall}
            className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1"
            title="Shortkey [9]"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>[9] Disposition</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
