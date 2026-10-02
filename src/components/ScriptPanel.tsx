import React, { useState } from "react";
import {
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertOctagon,
  Percent,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calculator,
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
  sentiment: _sentiment,
  onSentimentChange,
  config,
  onTransition,
  onOpenDobCalculator: _onOpenDobCalculator,
  onOpenBillCalculator,
  onOpenObjections: _onOpenObjections,
  onOpenCallback: _onOpenCallback,
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
    if (extracted.isUsingAtHome !== undefined) {
      updates.isUsingAtHome = extracted.isUsingAtHome;
    }
    if (extracted.consumerId !== undefined) {
      updates.consumerId = extracted.consumerId;
      updates.consumerIdStatus = "VERIFIED";
    }
    if (extracted.customerDecision !== undefined) {
      updates.customerDecision = extracted.customerDecision;
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
            CURRENT STEP • STAGE {stageDef.stageNumber} OF {STAGES_LIST.length}
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
            Step {stageDef.stageNumber} / {STAGES_LIST.length}
          </div>
        </div>
      </div>

      {/* GOLDEN RULE BADGE */}
      <div className="px-3.5 py-2 rounded-xl bg-sparta-950/80 border border-sparta-500/30 text-sparta-300 text-xs flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sparta-400 animate-pulse"></span>
          <span className="font-bold uppercase tracking-wider text-[10px] text-sparta-400">GOLDEN RULE:</span>
          <span>Keep every spoken section short. <strong>One idea → one short paragraph → one question.</strong></span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Up to 30% Reduction</span>
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

      {/* CONFLICT WARNING */}
      {conflictWarning && (
        <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs">
          <strong>Clarification needed:</strong> {conflictWarning}
        </div>
      )}

      {/* 3. MAIN "SAY THIS" APPROVED SCRIPT CARD */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-sparta-500/50 rounded-2xl p-5 md:p-6 relative shadow-xl">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="bg-sparta-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
              SAY THIS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              UK Telecom 30% Bill Reduction Call Script
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
        <div className="text-lg md:text-xl text-white font-medium leading-relaxed tracking-normal whitespace-pre-line select-text font-sans">
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
          placeholder="Type or paste customer words (e.g. 'I'm paying around £65 and yes it's at home...')"
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs md:text-sm text-white focus:border-sparta-500 focus:outline-none placeholder:text-slate-500"
        />

        {/* Quick Response Buttons */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Responses &amp; Branches
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {stageDef.quickResponses.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (qr.autoFill) onUpdateCustomer(qr.autoFill);
                  if (qr.nextStage) onTransition(qr.nextStage);
                  if (qr.guidance) {
                    alert(`Approved Response:\n\n${qr.guidance}`);
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

      {/* Stage 2: Consumer Identification Number Input */}
      {currentStage === "STAGE_2_VERIFICATION_ID" && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sparta-400" />
              <span>Consumer Identification Number Check (Section 7)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Found on customer's bill or service info</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Consumer Identification Number:</label>
              <input
                type="text"
                value={customer.consumerId || customer.customerId || ""}
                onChange={(e) =>
                  onUpdateCustomer({
                    consumerId: e.target.value.toUpperCase(),
                    customerId: e.target.value.toUpperCase(),
                    consumerIdStatus: "VERIFIED",
                    customerIdStatus: "VERIFIED",
                  })
                }
                placeholder="e.g. CIN-89371284"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono uppercase"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() =>
                  onUpdateCustomer({
                    consumerIdStatus: "NOT_AVAILABLE",
                    consumerIdUnavailable: true,
                  })
                }
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                ID Not Found on Bill
              </button>
              <button
                onClick={() =>
                  onUpdateCustomer({
                    consumerIdStatus: "REFUSED",
                    consumerIdRefused: true,
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

      {/* Stage 4: Current Service — Using at Home */}
      {currentStage === "STAGE_4_CURRENT_SERVICE" && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Current Service Screening (Section 9)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdateCustomer({ isUsingAtHome: "YES" })}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                customer.isUsingAtHome === "YES"
                  ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              ✓ YES — At Home
            </button>
            <button
              onClick={() => onUpdateCustomer({ isUsingAtHome: "NO" })}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                customer.isUsingAtHome === "NO"
                  ? "bg-amber-600/30 border-amber-500 text-amber-300"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              ✕ NO — Not Home
            </button>
            <button
              onClick={() => onUpdateCustomer({ isUsingAtHome: "DONT_KNOW" })}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                customer.isUsingAtHome === "DONT_KNOW"
                  ? "bg-indigo-600/30 border-indigo-500 text-indigo-300"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              ? Don't Know / Unsure
            </button>
          </div>
        </div>
      )}

      {/* Stage 5 & 6: Bill Reduction & 30% Savings Calculator Widget */}
      {(currentStage === "STAGE_5_CURRENT_BILL" || currentStage === "STAGE_6_EXPLAINING_REDUCTION") && (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                30% Bill Reduction &amp; Savings Calculator
              </h3>
            </div>
            <button
              onClick={onOpenBillCalculator}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Open Calculator Tool</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Current Bill</span>
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

      {/* Stage 9: Customer Decision Panel */}
      {currentStage === "STAGE_9_CUSTOMER_DECISION" && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Final Decision Recording (Sections 48 &amp; 49)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => {
                onUpdateCustomer({ customerDecision: "YES" });
                onEndCall("LEAD_COMPLETED");
              }}
              className="p-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500 text-emerald-300 font-bold flex flex-col items-center gap-1"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>YES — Proceed</span>
            </button>
            <button
              onClick={() => {
                onUpdateCustomer({ customerDecision: "NO" });
                onEndCall("CUSTOMER_NOT_INTERESTED");
              }}
              className="p-3 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 border border-rose-500 text-rose-300 font-bold flex flex-col items-center gap-1"
            >
              <XCircle className="w-5 h-5" />
              <span>NO — Respect Choice</span>
            </button>
            <button
              onClick={() => {
                onUpdateCustomer({ customerDecision: "THINK_ABOUT_IT" });
                onEndCall("CALL_BACK_REQUESTED");
              }}
              className="p-3 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500 text-amber-300 font-bold flex flex-col items-center gap-1"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Think About It / Callback</span>
            </button>
            <button
              onClick={() => onEndCall("DO_NOT_CALL")}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-400 font-bold flex flex-col items-center gap-1"
            >
              <AlertOctagon className="w-5 h-5 text-rose-400" />
              <span>Remove Number</span>
            </button>
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
          {currentStage === "STAGE_9_CUSTOMER_DECISION" ? (
            <button
              onClick={() => onEndCall("LEAD_COMPLETED")}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-glow-primary transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Complete Lead &amp; Disposition</span>
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
