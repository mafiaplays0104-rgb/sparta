import React from "react";
import { CheckCircle2, Circle, AlertCircle, ShieldAlert } from "lucide-react";
import { CallState } from "../types";
import { STATE_ORDER } from "../engine/conversationEngine";

interface CallProgressProps {
  currentState: CallState;
  onSelectState: (state: CallState) => void;
  completedStates: Set<CallState>;
}

export const CallProgress: React.FC<CallProgressProps> = ({
  currentState,
  onSelectState,
  completedStates,
}) => {
  const currentIndex = STATE_ORDER.findIndex((s) => s.state === currentState);

  return (
    <aside className="bg-slate-900/60 backdrop-blur-md border-r border-slate-800 p-4 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Call Journey
        </h2>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sparta-400 font-semibold">
          {Math.min(currentIndex + 1, STATE_ORDER.length)} / {STATE_ORDER.length}
        </span>
      </div>

      <div className="space-y-1 relative">
        {/* Connecting line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-[2px] bg-slate-800 -z-0" />

        {STATE_ORDER.map((item, idx) => {
          const isCurrent = item.state === currentState;
          const isCompleted = completedStates.has(item.state);
          const isPast = idx < currentIndex;

          return (
            <button
              key={item.state}
              onClick={() => onSelectState(item.state)}
              className={`w-full group text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 relative z-10 ${
                isCurrent
                  ? "bg-sparta-600/20 text-sparta-200 border border-sparta-500/40 shadow-sm"
                  : isCompleted || isPast
                  ? "text-slate-300 hover:bg-slate-800/60"
                  : "text-slate-500 hover:text-slate-400 hover:bg-slate-800/30"
              }`}
            >
              {/* Icon Status */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-sparta-400 bg-sparta-500 flex items-center justify-center animate-subtle-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                ) : (
                  <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-500" />
                )}
              </div>

              {/* Title & Sensitive pill */}
              <div className="flex items-center justify-between w-full min-w-0">
                <span className={`truncate ${isCurrent ? "font-bold text-white" : ""}`}>
                  {item.metadata.label}
                </span>

                {item.metadata.isSensitive && (
                  <span
                    className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5 ml-1"
                    title="Sensitive consent gate strictly enforced"
                  >
                    <ShieldAlert className="w-2.5 h-2.5" />
                    Consent
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Compliance reassurance banner at bottom of progress */}
      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] space-y-1.5 text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-sparta-400" />
            <span>British Standard UK OFCOM</span>
          </div>
          <p className="leading-snug text-slate-400 text-[10px]">
            Strict adherence to elderly caller fairness: No rushed closes, no card PIN/CVV collection, clear direct debit transparency.
          </p>
        </div>
      </div>
    </aside>
  );
};
