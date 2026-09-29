import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Info,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Percent,
  Sparkles,
  ArrowRight,
  AlertOctagon,
  HelpCircle,
  Calculator,
  RotateCcw,
} from "lucide-react";
import {
  MasterStage,
  CustomerRecord,
  OfferConfig,
  CustomerSentiment,
} from "../types";
import { MasterScriptEngine, STAGES_LIST } from "../engine/masterScriptEngine";
import { InformationExtractor, ExtractedInfo } from "../engine/informationExtractor";
import { SecurityEngine } from "../engine/securityEngine";
import { CalculatorTools } from "../engine/calculatorTools";

interface ScriptPanelProps {
  currentStage: MasterStage;
  customer: CustomerRecord;
  onUpdateCustomer: (updated: Partial<CustomerRecord>) => void;
  sentiment: CustomerSentiment;
  onSentimentChange: (sentiment: CustomerSentiment) => void;
  config: OfferConfig;
  onTransition: (nextStage: MasterStage) => void;
  onOpenDobCalculator: () => void;
  onOpenBillCalculator: () => void;
  onOpenObjections: () => void;
  onOpenCallback: () => void;
  onEndCall: (reason?: string) => void;
  overrideSayText?: string;
  onClearOverrideSayText?: () => void;
}

export const ScriptPanel: React.FC<ScriptPanelProps> = ({
  currentStage,
  customer,
  onUpdateCustomer,
  sentiment,
  onSentimentChange,
  config,
  onTransition,
  onOpenDobCalculator,
  onOpenBillCalculator,
  onOpenObjections,
  onOpenCallback,
  onEndCall,
  overrideSayText,
  onClearOverrideSayText,
}) => {
  const [copied, setCopied] = useState(false);
  const [customerResponseText, setCustomerResponseText] = useState("");
  const [conflictWarning, setConflictWarning] = useState<string | undefined>();
  const [prohibitedWarning, setProhibitedWarning] = useState<string | undefined>();

  const stageDef = MasterScriptEngine.getStageDefinition(currentStage, customer, config);
  const currentIndex = STAGES_LIST.indexOf(currentStage);
  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < STAGES_LIST.length - 1;

  const sayText = overrideSayText || stageDef.getSayText(customer, config);

  const handleCopy = () => {
    navigator.clipboard.writeText(sayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle live customer text changes
  const handleCustomerTextChange = (text: string) => {
    setCustomerResponseText(text);

    // 1. Prohibited information scan
    const scan = SecurityEngine.scanProhibitedInformation(text);
    if (scan.hasProhibited) {
      setProhibitedWarning(scan.warningMessage);
    } else {
      setProhibitedWarning(undefined);
    }

    // 2. Smart information extraction
    const extracted: ExtractedInfo = InformationExtractor.extractFromText(text, customer);

    if (extracted.conflictDetected) {
      setConflictWarning(extracted.conflictDetected.clarificationPrompt);
    } else {
      setConflictWarning(undefined);
    }

    // Update customer attributes if extracted
    const updates: Partial<CustomerRecord> = {};
    if (extracted.monthlyBill !== undefined) {
      updates.monthlyBill = extracted.monthlyBill;
      updates.billApproximate = extracted.billApproximate;
    }
    if (extracted.landlineUsage !== undefined) {
      updates.landlineUsage = extracted.landlineUsage;
    }
    if (extracted.billIncludesBroadband !== undefined) {
      updates.billIncludesBroadband = extracted.billIncludesBroadband;
    }
    if (extracted.billIncludesTv !== undefined) {
      updates.billIncludesTv = extracted.billIncludesTv;
      updates.hasTvService = extracted.hasTvService;
    }
    if (extracted.medicalAlarm !== undefined) {
      updates.medicalAlarm = extracted.medicalAlarm;
    }
    if (extracted.hasMobile !== undefined) {
      updates.hasMobile = extracted.hasMobile;
    }

    if (Object.keys(updates).length > 0) {
      onUpdateCustomer(updates);
    }

    // Adjust sentiment if detected
    if (extracted.responseCategory === "BUSY") {
      onSentimentChange("BUSY");
    } else if (extracted.responseCategory === "SUSPICIOUS") {
      onSentimentChange("SUSPICIOUS");
    } else if (extracted.responseCategory === "REFUSAL") {
      onSentimentChange("REFUSING");
    } else if (extracted.responseCategory === "CONFUSED") {
      onSentimentChange("CONFUSED");
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      if (onClearOverrideSayText) onClearOverrideSayText();
      setCustomerResponseText("");
      onTransition(STAGES_LIST[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      if (onClearOverrideSayText) onClearOverrideSayText();
      onTransition(STAGES_LIST[currentIndex - 1]);
    }
  };

  // Quick 30% savings computation if bill exists
  const billCalc = customer.monthlyBill
    ? CalculatorTools.calculateBillSavings(customer.monthlyBill, config.maxDiscountPercent)
    : null;

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-950 p-4 md:p-6 overflow-y-auto space-y-4">
      {/* 1. CURRENT STAGE BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-sparta-400 uppercase block mb-0.5">
            CURRENT STEP • STAGE {stageDef.stageNumber} OF 11
          </span>
          <h1 className="text-base md:text-lg font-black text-white tracking-tight">
            {stageDef.stageName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {overrideSayText && (
            <button
              onClick={onClearOverrideSayText}
              className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-amber-500/30"
              title="Return to Master Script wording"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Master Script</span>
            </button>
          )}

          <div className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Stage {stageDef.stageNumber} / 11
          </div>
        </div>
      </div>

      {/* 2. PROHIBITED INFORMATION BANNER (SECURITY GUARD) */}
      {prohibitedWarning && (
        <div className="p-3 rounded-xl bg-red-500/20 border-2 border-red-500 text-red-200 flex items-start gap-2.5 text-xs shadow-lg animate-bounce">
          <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              SECURITY VIOLATION BLOCKED — DO NOT REQUEST PROHIBITED CREDENTIALS
            </h4>
            <p className="mt-0.5 leading-relaxed">{prohibitedWarning}</p>
          </div>
        </div>
      )}

      {/* 3. MAIN "SAY THIS" APPROVED MASTER SCRIPT CARD */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-sparta-500/50 rounded-2xl p-5 md:p-6 relative shadow-xl">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="bg-sparta-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
              SAY THIS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Exact Master Script (Rule 2: Do Not Paraphrase)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Copy script line"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Verbatim Script Text */}
        <div className="text-lg md:text-xl text-white font-semibold leading-relaxed tracking-normal whitespace-pre-line select-text font-sans">
          {sayText}
        </div>

        {/* Pause Guidance Indicator */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-sparta-300">
          <span className="w-2 h-2 rounded-full bg-sparta-400 animate-pulse"></span>
          <span className="font-semibold italic">{stageDef.pauseInstruction}</span>
        </div>
      </div>

      {/* 4. CUSTOMER RESPONSE TEXT AREA WITH SMART EXTRACTION */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sparta-400" />
            <span>Customer Response (What Did The Customer Say?)</span>
          </label>
          <span className="text-[10px] text-slate-500">Live Auto-Extraction Active</span>
        </div>

        <textarea
          rows={2}
          value={customerResponseText}
          onChange={(e) => handleCustomerTextChange(e.target.value)}
          placeholder="Type or paste what the customer said (e.g. 'I pay about £80.99 and that includes broadband...')"
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs md:text-sm text-white focus:border-sparta-500 focus:outline-none placeholder:text-slate-500"
        />

        {/* Quick Response Buttons */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Situation & Response Branches
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {stageDef.quickResponses.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (qr.autoFill) onUpdateCustomer(qr.autoFill);
                  if (qr.nextStage) onTransition(qr.nextStage);
                  if (qr.guidance) {
                    alert(`Guidance:\n\n${qr.guidance}`);
                  }
                }}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:border-sparta-500/50"
              >
                <div className="text-xs font-bold text-sparta-300 mb-0.5">{qr.label}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{qr.actionDescription}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. STAGE-SPECIFIC INTERACTIVE TOOLS & DATA FIELDS */}
      {/* Stage 4: DOB Calculator Card */}
      {currentStage === "STAGE_4_DOB_VALIDATION" && (
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Stage 4 DOB & Age Calculator Tool
              </h3>
            </div>
            <button
              onClick={onOpenDobCalculator}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Open DOB Tool</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Enter Date of Birth (YYYY-MM-DD):</label>
              <input
                type="date"
                value={customer.dob || ""}
                onChange={(e) => {
                  const res = CalculatorTools.calculateAgeFromDob(e.target.value);
                  const isEligible = CalculatorTools.evaluateDobEligibility({ birthYear: res.birthYear }, config).isEligible;
                  onUpdateCustomer({
                    dob: e.target.value,
                    birthYear: res.birthYear,
                    calculatedAge: res.age,
                    isEligibleAge: isEligible,
                  });
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Quick Age Conversion:</label>
              <div className="flex gap-1.5 flex-wrap">
                {[68, 70, 72, 75, 78, 80].map((age) => (
                  <button
                    key={age}
                    onClick={() => {
                      const year = CalculatorTools.calculateYearFromAge(age);
                      const isEligible = CalculatorTools.evaluateDobEligibility({ birthYear: year }, config).isEligible;
                      onUpdateCustomer({
                        birthYear: year,
                        calculatedAge: age,
                        dob: `${year}-01-01`,
                        isEligibleAge: isEligible,
                      });
                    }}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                  >
                    {age} yrs (Born {2026 - age})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2 & 3: Bill Savings Calculator Widget */}
      {(currentStage === "STAGE_2_CURRENT_SERVICE" || currentStage === "STAGE_3_OFFER_INTRO") && (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Bill Reduction & 30% Savings Calculator
              </h3>
            </div>
            <button
              onClick={onOpenBillCalculator}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Open Bill Tool</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Original Bill</span>
              <span className="text-sm font-bold text-white font-mono">
                {customer.monthlyBill ? `£${customer.monthlyBill.toFixed(2)}` : "£0.00"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-emerald-400 block">30% Discounted</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {billCalc ? billCalc.formattedDiscounted : "—"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-sparta-300 block">Monthly Savings</span>
              <span className="text-sm font-bold text-sparta-300 font-mono">
                {billCalc ? billCalc.formattedMonthlySavings : "—"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-indigo-300 block">Annual Savings</span>
              <span className="text-sm font-bold text-indigo-300 font-mono">
                {billCalc ? billCalc.formattedAnnualSavings : "—"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: Direct Debit / Customer ID verification */}
      {currentStage === "STAGE_6_DIRECT_DEBIT_ID" && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Stage 6 Customer ID Match & Format Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Customer Identifier (Prefix: IBANGB):</label>
              <input
                type="text"
                value={customer.customerId || ""}
                onChange={(e) =>
                  onUpdateCustomer({
                    customerId: e.target.value.toUpperCase(),
                    customerIdStatus: "VERIFIED",
                  })
                }
                placeholder="e.g. IBANGB89371284"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono uppercase"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() =>
                  onUpdateCustomer({
                    customerIdStatus: "NOT_AVAILABLE",
                    customerIdUnavailable: true,
                  })
                }
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                ID Not Available
              </button>
              <button
                onClick={() =>
                  onUpdateCustomer({
                    customerIdStatus: "REFUSED",
                    customerIdRefused: true,
                  })
                }
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Uncomfortable Sharing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage 9: Medical Alarm & TV Equipment */}
      {currentStage === "STAGE_9_FINAL_QUESTIONS" && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Stage 9 Equipment & Medical Alarm Screening
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Medical Alarm Connected?</label>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateCustomer({ medicalAlarm: true })}
                  className={`flex-1 py-2 rounded-lg border font-bold ${
                    customer.medicalAlarm === true
                      ? "bg-rose-600/30 border-rose-500 text-rose-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  ⚠️ Yes (Alarm Present)
                </button>
                <button
                  onClick={() => onUpdateCustomer({ medicalAlarm: false })}
                  className={`flex-1 py-2 rounded-lg border font-bold ${
                    customer.medicalAlarm === false
                      ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  ✓ No (Standard Line)
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">TV Make & Model:</label>
              <input
                type="text"
                value={customer.tvMakeModel || ""}
                onChange={(e) =>
                  onUpdateCustomer({ tvMakeModel: e.target.value, hasTvService: true })
                }
                placeholder="e.g. Samsung 43-inch Smart TV"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. BOTTOM STAGE NAVIGATION */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={!canGoBack}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <div className="flex items-center gap-2">
          {currentStage === "STAGE_11_NATURAL_CLOSE" ? (
            <button
              onClick={() => onEndCall("LEAD_COMPLETED")}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-glow-primary transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Complete Lead & Disposition</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-sparta-600 hover:bg-sparta-500 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-glow-primary transition-all active:scale-95"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
};
