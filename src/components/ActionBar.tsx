import React from "react";
import {
  HelpCircle,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  PhoneOff,
  ShieldAlert,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { CallState } from "../types";

interface ActionBarProps {
  currentState: CallState;
  onBack: () => void;
  onOpenWhy: () => void;
  onOpenObjections: () => void;
  onOpenCallback: () => void;
  onOpenEscalate: () => void;
  onEndCall: () => void;
  onRequestConsent?: () => void;
  isSensitiveStage: boolean;
  hasConsent: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  currentState,
  onBack,
  onOpenWhy,
  onOpenObjections,
  onOpenCallback,
  onOpenEscalate,
  onEndCall,
  onRequestConsent,
  isSensitiveStage,
  hasConsent,
}) => {
  return (
    <footer className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 sticky bottom-0 z-40 shadow-lg">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Action Cluster: Navigation & Context Help */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Go back to previous stage"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[BACK]</span>
          </button>

          <button
            onClick={onOpenWhy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Display 'Why am I asking this?'"
          >
            <Info className="w-3.5 h-3.5 text-sparta-400" />
            <span>[WHY?]</span>
          </button>

          <button
            onClick={onOpenObjections}
            className="px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-600/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Access UK Customer Objection Library"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>[OBJECTION]</span>
          </button>
        </div>

        {/* Center Sensitive Payment Gate Action (if at consent stage) */}
        {isSensitiveStage && !hasConsent && onRequestConsent && (
          <div className="animate-bounce">
            <button
              onClick={onRequestConsent}
              className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-glow-amber border border-amber-300"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>[REQUEST CONSENT] REQUIRED TO PROCEED</span>
            </button>
          </div>
        )}

        {/* Right Action Cluster: Branching, Supervisor & Terminate */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCallback}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Schedule a callback at customer's preferred day & time"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>[CALLBACK]</span>
          </button>

          <button
            onClick={onOpenEscalate}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-700/50"
            title="Escalate call to Senior Supervisor"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>[ESCALATE]</span>
          </button>

          <button
            onClick={onEndCall}
            className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ml-1"
            title="Conclude call and display summary"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>[END CALL]</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
