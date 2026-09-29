import React from "react";
import { MasterStage } from "../types";
import { STAGES_LIST, MasterScriptEngine } from "../engine/masterScriptEngine";

interface CallProgressProps {
  currentStage: MasterStage;
  onSelectStage: (stage: MasterStage) => void;
  completedStages: Set<MasterStage>;
}

export const CallProgress: React.FC<CallProgressProps> = ({
  currentStage,
  onSelectStage,
  completedStages,
}) => {
  const currentIndex = STAGES_LIST.indexOf(currentStage);

  return (
    <aside className="bg-slate-900/60 backdrop-blur-md border-r border-slate-800/80 p-3.5 flex flex-col h-full overflow-y-auto space-y-3 select-none text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Workflow
        </span>
        <span className="text-[10px] font-mono text-sparta-400 font-bold">
          {currentIndex >= 0 ? currentIndex + 1 : 11} / 11
        </span>
      </div>

      {/* Simplified Stages List */}
      <nav aria-label="Workflow stages" className="space-y-0.5 flex-1">
        {STAGES_LIST.map((stageKey, idx) => {
          const isCurrent = stageKey === currentStage;
          const isCompleted = completedStages.has(stageKey);
          const stageDef = MasterScriptEngine.getStageDefinition(stageKey, {}, {
            campaignName: "",
            enabled: true,
            offerName: "",
            minutes: 500,
            crossNetwork: true,
            anytime: true,
            dedicatedCustomerService: true,
            technicalVisit: true,
            writtenTerms: true,
            maxDiscountPercent: 30,
            serviceUnchanged: true,
            contractUnchanged: true,
            equipmentUnchanged: true,
            paymentMethod: "DIRECT_DEBIT",
            customerIdPrefix: "IBANGB",
            eligibilityRules: { minimumDob: "", maximumDob: "" },
            authorisedText: {
              companyName: "",
              campaignReason: "",
              dataSourceExplanation: "",
              verificationProcedure: "",
              privacyNotice: "",
              closingLines: "",
            },
            scriptLock: true,
            scriptVersion: "1.0.0",
            dataRetentionDays: 90,
          });

          return (
            <button
              key={stageKey}
              onClick={() => onSelectStage(stageKey)}
              className={`w-full text-left py-2 px-2.5 rounded-xl transition-all flex items-center gap-2.5 text-xs ${
                isCurrent
                  ? "bg-sparta-600/30 text-white font-bold border border-sparta-500/40"
                  : isCompleted
                  ? "text-slate-300 hover:bg-slate-800/40"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 font-mono ${
                  isCurrent
                    ? "bg-sparta-500 text-slate-950 font-bold"
                    : isCompleted
                    ? "text-emerald-400 font-bold"
                    : "text-slate-600"
                }`}
              >
                {isCompleted ? "✓" : isCurrent ? "●" : "○"}
              </span>
              <span className="truncate text-[11px] leading-tight">
                {stageDef.stageName.replace(/Stage \d+ — /, "")}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
