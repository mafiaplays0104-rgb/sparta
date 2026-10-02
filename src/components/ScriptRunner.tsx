import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Calendar,
  Percent,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { ScriptUnit } from "../engine/scriptUnitEngine";
import { CustomerRecord, OfferConfig } from "../types";
import { CalculatorTools } from "../engine/calculatorTools";

interface ScriptRunnerProps {
  unit: ScriptUnit;
  unitIndexOverall: number;
  totalUnitsOverall: number;
  customer: CustomerRecord;
  config: OfferConfig;
  onUpdateCustomer: (u: Partial<CustomerRecord>) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  onOpenDobCalculator: () => void;
  onOpenBillCalculator: () => void;
  onOpenObjections: () => void;
  onEndCall: (reason?: string) => void;
  overrideSayText?: string;
  onClearOverrideSayText?: () => void;
}

export const ScriptRunner: React.FC<ScriptRunnerProps> = ({
  unit,
  unitIndexOverall,
  totalUnitsOverall,
  customer,
  config,
  onUpdateCustomer,
  onNext,
  onPrevious,
  canGoNext: _canGoNext,
  canGoPrevious,
  onOpenDobCalculator,
  onOpenBillCalculator,
  onOpenObjections,
  onEndCall,
  overrideSayText,
  onClearOverrideSayText,
}) => {
  const [copied, setCopied] = useState(false);
  const [customBillInput, setCustomBillInput] = useState("");

  const sayText = overrideSayText || unit.getText(customer, config);

  const handleCopy = () => {
    navigator.clipboard.writeText(sayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFinalUnit = unitIndexOverall === totalUnitsOverall - 1;

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="w-full max-w-3xl flex flex-col justify-between min-h-[480px] bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative transition-all duration-150">
        {/* 1. PROGRESS BAR / STAGE HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-sparta-400 uppercase tracking-widest font-mono">
              STAGE {unit.stageNumber} — {unit.stageName}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-mono text-slate-400">
              Part {unit.unitIndex} of {unit.totalUnitsInStage}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {overrideSayText && (
              <button
                onClick={onClearOverrideSayText}
                className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md flex items-center gap-1 hover:bg-amber-500/30"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Script</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
              title="Copy text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. SCRIPT UNIT CARD — THE PROMINENT CENTERPIECE */}
        <div className="flex-1 flex flex-col justify-center items-center text-center my-4 px-2 select-text">
          <span className="text-[10px] font-black uppercase tracking-widest text-sparta-500 mb-3 bg-sparta-950 px-2.5 py-0.5 rounded-full border border-sparta-800/80">
            SAY THIS
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-3xl font-medium text-white leading-relaxed tracking-normal whitespace-pre-line max-w-2xl font-sans">
            {sayText}
          </h2>

          {/* Subnote if applicable */}
          {unit.subNote && (
            <p className="mt-3 text-xs text-slate-400 italic max-w-xl">
              {unit.subNote}
            </p>
          )}

          {/* PAUSE & LISTEN BADGE */}
          {unit.isPauseAndListen && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/90 border border-sparta-500/40 text-sparta-300 text-xs font-bold tracking-wider animate-pulse shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sparta-400"></span>
              <span>PAUSE &amp; LISTEN</span>
            </div>
          )}
        </div>

        {/* 3. CONTEXTUAL INLINE INPUTS / QUICK BUTTONS */}
        <div className="my-2 flex flex-col items-center space-y-2.5">
          {/* Bill input helper */}
          {unit.inputType === "BILL_INPUT" && (
            <div className="w-full max-w-md bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-slate-400 font-medium">Customer states:</span>
                <input
                  type="text"
                  placeholder="e.g. 65 or £80.99"
                  value={customBillInput}
                  onChange={(e) => setCustomBillInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-sm font-bold text-white font-mono focus:border-sparta-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const parsed = CalculatorTools.parseBillAmount(customBillInput);
                    if (parsed) {
                      onUpdateCustomer({ monthlyBill: parsed, billApproximate: true });
                      setCustomBillInput("");
                    }
                  }}
                  className="bg-sparta-600 hover:bg-sparta-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs"
                >
                  Save £
                </button>
              </div>

              <div className="flex gap-1.5 w-full justify-center">
                <button
                  onClick={onOpenBillCalculator}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold underline"
                >
                  <Percent className="w-3 h-3" />
                  <span>Open 30% Savings Calculator</span>
                </button>
              </div>
            </div>
          )}

          {/* Consumer Identification Number helper */}
          {unit.inputType === "CUSTOMER_ID_INPUT" && (
            <div className="w-full max-w-md bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sparta-400" />
              <input
                type="text"
                placeholder="Enter Consumer ID from bill..."
                value={customer.consumerId || customer.customerId || ""}
                onChange={(e) =>
                  onUpdateCustomer({
                    consumerId: e.target.value.toUpperCase(),
                    customerId: e.target.value.toUpperCase(),
                    consumerIdStatus: "VERIFIED",
                    customerIdStatus: "VERIFIED",
                  })
                }
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs font-mono font-bold text-white uppercase focus:border-sparta-500 focus:outline-none"
              />
            </div>
          )}

          {/* Optional DOB helper */}
          {unit.inputType === "DOB_INPUT" && (
            <div className="w-full max-w-md bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-slate-300 font-medium">
                  {customer.dob
                    ? `DOB: ${customer.dob}`
                    : customer.birthYear
                    ? `Born: ${customer.birthYear} (~${customer.calculatedAge}y)`
                    : "DOB optional"}
                </span>
              </div>
              <button
                onClick={onOpenDobCalculator}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded-lg text-xs"
              >
                DOB Tool
              </button>
            </div>
          )}

          {/* Quick Choice Buttons for this unit */}
          {unit.quickOptions && unit.quickOptions.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {unit.quickOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    opt.action(customer, onUpdateCustomer);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. PRIMARY NAVIGATION BUTTONS */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-2">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Press Left Arrow"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={onOpenObjections}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>52 Script Sections / Help</span>
          </button>

          {isFinalUnit ? (
            <button
              onClick={() => onEndCall("LEAD_COMPLETED")}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <span>Complete Lead &amp; Disposition</span>
              <Check className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-6 py-2.5 rounded-xl bg-sparta-500 hover:bg-sparta-400 text-slate-950 text-xs md:text-sm font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
              title="Press Enter or Right Arrow"
            >
              <span>NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
};
