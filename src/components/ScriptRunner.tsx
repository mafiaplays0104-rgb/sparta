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
  Receipt,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertTriangle,
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
  onOpenVatCalculator?: () => void;
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
  onOpenVatCalculator,
  onOpenObjections,
  onEndCall,
  overrideSayText,
  onClearOverrideSayText,
}) => {
  const [copied, setCopied] = useState(false);
  const [customBillInput, setCustomBillInput] = useState("");
  const [useLiveNumbersInScript, setUseLiveNumbersInScript] = useState(false);

  // Compute live probability numbers
  const probSavings = CalculatorTools.calculateScriptProbabilitySavings(customer);

  // Raw say text from unit or override
  let sayText = overrideSayText || unit.getText(customer, config);

  // If live numbers mode is enabled on the pitch unit, populate exact placeholders
  if (useLiveNumbersInScript && (unit.id === "s3_u1" || unit.id === "s3_u2")) {
    sayText = sayText
      .replace("£[Insert monthly price]", `£${probSavings.formattedMonthlyPrice}`)
      .replace("£[Insert monthly savings]", `£${probSavings.formattedMonthlySavings}`)
      .replace("£[Insert total 2-year savings]", `£${probSavings.formattedTwoYearSavings}`)
      .replace("£___", `£${probSavings.formattedMonthlySavings}`)
      .replace("£_____", `£${probSavings.formattedTwoYearSavings}`);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(sayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFinalUnit = unitIndexOverall === totalUnitsOverall - 1;

  // Day of week calculation for compliance step
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = daysOfWeek[new Date().getDay()];

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="w-full max-w-3xl flex flex-col justify-between min-h-[500px] bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative transition-all duration-150">
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

        {/* OPENING SWITCHER (Stage 1) */}
        {unit.stageNumber === 1 && (
          <div className="w-full flex items-center justify-center gap-2 mb-3">
            <button
              onClick={() => onUpdateCustomer({ selectedOpening: "OPENING_1" })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                customer.selectedOpening !== "OPENING_2"
                  ? "bg-sparta-600 text-slate-950 border-sparta-400 shadow-md scale-105"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              Opening 1 (Afternoon Feedback / 30% Off)
            </button>
            <button
              onClick={() => onUpdateCustomer({ selectedOpening: "OPENING_2" })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                customer.selectedOpening === "OPENING_2"
                  ? "bg-sparta-600 text-slate-950 border-sparta-400 shadow-md scale-105"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              Opening 2 (Morning Digital Transition)
            </button>
          </div>
        )}

        {/* 2. SCRIPT UNIT CARD — THE PROMINENT CENTERPIECE */}
        <div className="flex-1 flex flex-col justify-center items-center text-center my-3 px-2 select-text">
          <span className="text-[10px] font-black uppercase tracking-widest text-sparta-500 mb-3 bg-sparta-950 px-2.5 py-0.5 rounded-full border border-sparta-800/80">
            SAY THIS
          </span>

          <h2 className="text-xl sm:text-2xl md:text-2xl font-medium text-white leading-relaxed tracking-normal whitespace-pre-line max-w-2xl font-sans text-left">
            {sayText}
          </h2>

          {/* Expected Customer Reply Banner from Script */}
          {unit.expectedCustomerReply && (
            <div className="mt-4 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-amber-500/30 max-w-xl text-left flex items-start gap-2.5 shadow-sm w-full">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex-shrink-0 mt-0.5 font-mono">
                Customer Reply
              </span>
              <p className="text-xs sm:text-sm text-slate-200 italic font-sans leading-relaxed">
                "{unit.expectedCustomerReply}"
              </p>
            </div>
          )}

          {/* Subnote if applicable */}
          {unit.subNote && (
            <p className="mt-2.5 text-xs text-slate-400 italic max-w-xl text-center">
              {unit.subNote}
            </p>
          )}

          {/* PAUSE & LISTEN BADGE */}
          {unit.isPauseAndListen && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/90 border border-sparta-500/40 text-sparta-300 text-xs font-bold tracking-wider animate-pulse shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sparta-400"></span>
              <span>PAUSE &amp; LISTEN</span>
            </div>
          )}
        </div>

        {/* 3. CONTEXTUAL INLINE INPUTS / PROBABILITY HELPERS */}
        <div className="my-2 flex flex-col items-center space-y-2.5">
          {/* PROBABILITY SAVINGS DISPLAY FOR STEP 3 */}
          {(unit.id === "s3_u1" || unit.id === "s3_u2") && (
            <div className="w-full max-w-xl bg-slate-950/95 p-3.5 rounded-2xl border border-teal-500/40 flex flex-col gap-2.5 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-white">
                    Probability Package: <span className="text-sparta-300 font-bold">{probSavings.plan.name}</span>
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 uppercase font-mono">
                  {probSavings.branch.replace("_", " ")}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Monthly Price</span>
                  <span className="text-sm font-black text-white font-mono">
                    £{probSavings.formattedMonthlyPrice}
                  </span>
                </div>
                <div className="bg-emerald-950/40 p-2 rounded-xl border border-emerald-800/60">
                  <span className="text-[10px] text-emerald-300 block">Monthly Savings</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    £{probSavings.formattedMonthlySavings}
                  </span>
                </div>
                <div className="bg-sparta-950/60 p-2 rounded-xl border border-sparta-700/60">
                  <span className="text-[10px] text-sparta-300 block">2-Year Total Savings</span>
                  <span className="text-sm font-black text-sparta-400 font-mono">
                    £{probSavings.formattedTwoYearSavings}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => setUseLiveNumbersInScript((prev) => !prev)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    useLiveNumbersInScript
                      ? "bg-teal-500 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {useLiveNumbersInScript ? "✓ Live Numbers Active in Script" : "Insert Live Numbers into Script"}
                  </span>
                </button>

                {onOpenVatCalculator && (
                  <button
                    onClick={onOpenVatCalculator}
                    className="text-xs text-teal-400 hover:text-teal-300 underline font-bold"
                  >
                    Pricing Matrix [V]
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bill input helper (Stage 2 Unit 3) */}
          {unit.inputType === "BILL_INPUT" && (
            <div className="w-full max-w-md bg-slate-950/90 p-3 rounded-2xl border border-slate-800 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-slate-400 font-medium">Customer states:</span>
                <input
                  type="text"
                  placeholder="e.g. £40, £50, £60"
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
                  <span>Calculate 30% Savings [S]</span>
                </button>
              </div>
            </div>
          )}

          {/* Social Alarm / Pendant Helper (Stage 5 Unit 2) */}
          {unit.inputType === "ALARM_SELECT" && (
            <div className="w-full max-w-xl bg-slate-950/90 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Customer Alarm Assessment:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onUpdateCustomer({ socialAlarmStatus: "NO", medicalAlarm: false })}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                    customer.socialAlarmStatus === "NO"
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[10px] text-slate-500 uppercase">Option 1</div>
                  [If NO]: Move right along
                </button>
                <button
                  onClick={() => onUpdateCustomer({ socialAlarmStatus: "YES_COPPER", medicalAlarm: true })}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                    customer.socialAlarmStatus === "YES_COPPER"
                      ? "bg-amber-950/80 border-amber-500 text-amber-300"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[10px] text-slate-500 uppercase">Option 2</div>
                  [If YES & Copper]: Smooth Transition
                </button>
                <button
                  onClick={() => onUpdateCustomer({ socialAlarmStatus: "YES_DIGITAL_SOCKET", medicalAlarm: true })}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                    customer.socialAlarmStatus === "YES_DIGITAL_SOCKET"
                      ? "bg-cyan-950/80 border-cyan-500 text-cyan-300"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[10px] text-slate-500 uppercase">Option 3</div>
                  [If YES & Digital]: Wall socket verified
                </button>
              </div>
            </div>
          )}

          {/* Compliance Day Verification Helper (Stage 8) */}
          {unit.id === "s8_u1" && (
            <div className="w-full max-w-md bg-slate-950/90 p-3 rounded-2xl border border-slate-800 flex flex-col items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">
                Customer's answer to day of week:
              </span>
              <div className="flex items-center gap-2">
                {["Sunday", "Monday", "Tuesday", currentDayName].filter((v, i, a) => a.indexOf(v) === i).map((day) => (
                  <button
                    key={day}
                    onClick={() =>
                      onUpdateCustomer({
                        dayVerificationAnswer: day,
                        isDayVerified: true,
                      })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      customer.dayVerificationAnswer === day
                        ? "bg-emerald-600 text-white border-emerald-400"
                        : "bg-slate-900 text-slate-300 border-slate-800 hover:text-white"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {customer.isDayVerified && (
                <div className="text-emerald-400 text-xs font-bold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Spot on! Compliance question verified.</span>
                </div>
              )}
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
            <span>Objections &amp; Q&amp;A</span>
          </button>

          {isFinalUnit ? (
            <button
              onClick={() => onEndCall("LEAD_COMPLETED")}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <span>Introduce to Verification Officer</span>
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
