import React, { useState } from "react";
import {
  Copy,
  Check,
  ChevronRight,
  Info,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  PhoneOff,
  ArrowRight,
  Volume2,
  Calendar,
  Lock,
  UserCheck,
  Percent,
  CheckCircle,
  XCircle,
  HeartHandshake,
  AlertOctagon,
} from "lucide-react";
import {
  CallState,
  CustomerMood,
  Customer,
  OfferConfig,
  SuggestedResponse,
  LineVariant,
  ServiceType,
  IssueStatus,
  ConsentRecord,
  DirectDebitTempData,
  CallMode,
} from "../types";
import { ConversationEngine } from "../engine/conversationEngine";
import { SecurityEngine } from "../engine/securityEngine";

interface ScriptPanelProps {
  state: CallState;
  suggestedResponse: SuggestedResponse;
  customer: Customer;
  onUpdateCustomer: (updated: Partial<Customer>) => void;
  mood: CustomerMood;
  config: OfferConfig;
  consents: ConsentRecord[];
  onGrantConsent: (category: ConsentRecord["category"]) => void;
  onDeclineConsent: (category: ConsentRecord["category"]) => void;
  onTransition: (nextState: CallState) => void;
  onEscalate: (reason: string) => void;
  onOpenObjections: () => void;
  onEndCall: (reason?: string) => void;
  callMode: CallMode;
  directDebitData: DirectDebitTempData;
  onUpdateDirectDebitData: (data: Partial<DirectDebitTempData>) => void;
}

export const ScriptPanel: React.FC<ScriptPanelProps> = ({
  state,
  suggestedResponse,
  customer,
  onUpdateCustomer,
  mood,
  config,
  consents,
  onGrantConsent,
  onDeclineConsent,
  onTransition,
  onEscalate,
  onOpenObjections,
  onEndCall,
  callMode,
  directDebitData,
  onUpdateDirectDebitData,
}) => {
  const [variant, setVariant] = useState<LineVariant>("PRIMARY");
  const [copied, setCopied] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  // Pick text based on variant or mood
  const getActiveText = () => {
    if (variant === "SHORT" || mood === "IMPATIENT") return suggestedResponse.short;
    if (variant === "EXPLAIN" || mood === "ELDERLY_SLOW" || mood === "CONFUSED") {
      return suggestedResponse.explain;
    }
    return suggestedResponse.primary;
  };

  const activeText = getActiveText();

  const handleCopy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseLine = () => {
    handleCopy();
    // In Quick or Production mode, if nextState exists, provide intuitive progression
    if (suggestedResponse.nextState && suggestedResponse.nextState !== state) {
      onTransition(suggestedResponse.nextState);
    }
  };

  const paymentConsentGranted = consents.find(
    (c) => c.category === "PAYMENT" && c.status === "GRANTED"
  );

  const dobEligibility = ConversationEngine.checkDobEligibility(
    customer.dateOfBirth,
    config
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4 md:p-6 overflow-y-auto">
      {/* 1. CURRENT OBJECTIVE BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-sparta-400 uppercase block mb-0.5">
            CURRENT OBJECTIVE
          </span>
          <h1 className="text-base md:text-lg font-bold text-white tracking-tight">
            {suggestedResponse.objective}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setVariant("PRIMARY")}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              variant === "PRIMARY"
                ? "bg-sparta-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Full Line
          </button>
          <button
            onClick={() => setVariant("SHORT")}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              variant === "SHORT"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Shorten
          </button>
          <button
            onClick={() => setVariant("EXPLAIN")}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
              variant === "EXPLAIN"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Slow Down / Explain
          </button>
        </div>
      </div>

      {/* 2. MAIN SCRIPT CARD ("SAY:") */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-sparta-500/40 rounded-2xl p-5 md:p-6 mb-4 relative shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-sparta-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full tracking-wider uppercase">
              SAY
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {suggestedResponse.sayLabel || state}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* The spoken phrase */}
        <p className="text-lg md:text-xl text-white font-medium leading-relaxed tracking-normal select-text">
          "{activeText}"
        </p>

        {/* Script Variant Action Controls */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={handleUseLine}
            className="bg-sparta-500 hover:bg-sparta-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs md:text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            title="Mark line as used and proceed"
          >
            <span>[USE LINE]</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setVariant("SHORT")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-1.5 rounded-lg text-xs transition-colors border border-slate-700"
          >
            [SHORTEN]
          </button>

          <button
            onClick={() => setVariant("EXPLAIN")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-1.5 rounded-lg text-xs transition-colors border border-slate-700"
          >
            [SLOW DOWN]
          </button>

          <button
            onClick={() => setVariant("EXPLAIN")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-1.5 rounded-lg text-xs transition-colors border border-slate-700"
          >
            [EXPLAIN]
          </button>

          <button
            onClick={() => setShowWhy(!showWhy)}
            className={`font-medium px-3 py-1.5 rounded-lg text-xs transition-colors border ${
              showWhy
                ? "bg-sparta-950 text-sparta-300 border-sparta-700"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
          >
            [WHY?]
          </button>

          <button
            onClick={onOpenObjections}
            className="bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/80 font-medium px-3 py-1.5 rounded-lg text-xs transition-colors ml-auto flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>[OBJECTION]</span>
          </button>
        </div>
      </div>

      {/* 3. "WHY?" COLLAPSIBLE PANEL */}
      {showWhy && (
        <div className="bg-slate-900/90 border border-sparta-500/30 rounded-xl p-4 mb-4 text-xs text-slate-300 animate-fadeIn">
          <div className="flex items-center gap-2 text-sparta-300 font-bold mb-1 uppercase tracking-wider text-[11px]">
            <Info className="w-4 h-4" />
            <span>WHY AM I ASKING THIS?</span>
          </div>
          <p className="leading-relaxed text-slate-200 mb-2">{suggestedResponse.why}</p>
          {suggestedResponse.complianceWarning && (
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-1.5 text-[11px]">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{suggestedResponse.complianceWarning}</span>
            </div>
          )}
        </div>
      )}

      {/* 4. STATE-SPECIFIC INTERACTIVE ACTIONS & DATA INPUTS */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-4">
        {/* Step: OPENING / BILL RESPONSIBILITY */}
        {(state === "OPENING" || state === "BILL_RESPONSIBILITY") && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Customer Response — Bill Responsibility
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => onTransition("RAPPORT")}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-950/50 hover:border-emerald-500/50 border border-slate-700 text-left transition-all group"
              >
                <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center justify-between">
                  <span>✓ Yes, I look after bills</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-[11px] text-slate-400">
                  Proceed to friendly introduction & rapport.
                </div>
              </button>

              <button
                onClick={() => {
                  alert(
                    "Advisor Line: 'That's absolutely fine. Is there somebody else who normally looks after the telephone bill?'"
                  );
                }}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-amber-950/50 hover:border-amber-500/50 border border-slate-700 text-left transition-all"
              >
                <div className="text-xs font-bold text-amber-400 mb-1">
                  Someone else manages it
                </div>
                <div className="text-[11px] text-slate-400">
                  Ask if the bill payer is available right now.
                </div>
              </button>

              <button
                onClick={() => {
                  onEndCall("Nobody available to handle telephone bill");
                }}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 hover:border-rose-500/50 border border-slate-700 text-left transition-all"
              >
                <div className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1">
                  <PhoneOff className="w-3 h-3" />
                  <span>✕ Nobody available</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Say polite closing and end call without disturbing.
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step: RAPPORT */}
        {state === "RAPPORT" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Natural 1-Sentence Rapport Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => onTransition("SERVICE_DISCOVERY")}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition-all"
              >
                <span className="text-xs font-bold text-sparta-300 block mb-1">
                  Customer says: "I'm fine"
                </span>
                <span className="text-xs text-slate-300 italic block">
                  "Good to hear. Right, I'll keep this nice and straightforward for you."
                </span>
              </button>

              <button
                onClick={() => onTransition("SERVICE_DISCOVERY")}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition-all"
              >
                <span className="text-xs font-bold text-sparta-300 block mb-1">
                  Customer says: "I'm alright"
                </span>
                <span className="text-xs text-slate-300 italic block">
                  "Good stuff. I'll explain exactly why I'm calling."
                </span>
              </button>

              <button
                onClick={() => onTransition("SERVICE_DISCOVERY")}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition-all"
              >
                <span className="text-xs font-bold text-sparta-300 block mb-1">
                  Customer says: "What's this regarding?"
                </span>
                <span className="text-xs text-slate-300 italic block">
                  "Of course. It's regarding your telephone line services, checking if any reductions apply."
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Step: SERVICE_DISCOVERY */}
        {state === "SERVICE_DISCOVERY" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Existing Customer Service
              </h3>
              {customer.serviceType && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Selected: {customer.serviceType.replace(/_/g, " ")}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { type: "PHONE_ONLY" as ServiceType, label: "Phone Only", desc: "Landline voice line only" },
                { type: "PHONE_INTERNET" as ServiceType, label: "Phone + Broadband", desc: "Landline + Wi-Fi Internet" },
                { type: "PHONE_INTERNET_TV" as ServiceType, label: "Phone + Net + TV", desc: "Triple-play bundle" },
                { type: "OTHER" as ServiceType, label: "Other / Unsure", desc: "Alternative setup" },
              ].map((s) => (
                <button
                  key={s.type}
                  onClick={() => {
                    onUpdateCustomer({ serviceType: s.type });
                    onTransition("ISSUE_CHECK");
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    customer.serviceType === s.type
                      ? "bg-sparta-600/30 border-sparta-400 text-white"
                      : "bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold mb-1">{s.label}</div>
                  <div className="text-[10px] text-slate-400">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: ISSUE_CHECK */}
        {state === "ISSUE_CHECK" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Check for Active Line or Internet Issues
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => {
                  onUpdateCustomer({ issueStatus: "NONE" });
                  onTransition("BILL_DISCOVERY");
                }}
                className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-600/40 text-left transition-all"
              >
                <div className="text-xs font-bold text-emerald-300 mb-1">✓ No Issues</div>
                <div className="text-[11px] text-slate-400">
                  Line and service working smoothly.
                </div>
              </button>

              <button
                onClick={() => {
                  onUpdateCustomer({ issueStatus: "LANDLINE" });
                  onTransition("ISSUE_ESCALATION");
                }}
                className="p-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 text-left transition-all"
              >
                <div className="text-xs font-bold text-amber-300 mb-1">⚠️ Landline Trouble</div>
                <div className="text-[11px] text-slate-400">
                  Noise, crackle, no dial tone.
                </div>
              </button>

              <button
                onClick={() => {
                  onUpdateCustomer({ issueStatus: "INTERNET" });
                  onTransition("ISSUE_ESCALATION");
                }}
                className="p-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 text-left transition-all"
              >
                <div className="text-xs font-bold text-amber-300 mb-1">⚠️ Internet Fault</div>
                <div className="text-[11px] text-slate-400">
                  Dropping connection or slow speeds.
                </div>
              </button>

              <button
                onClick={() => {
                  onUpdateCustomer({ issueStatus: "BOTH" });
                  onTransition("ISSUE_ESCALATION");
                }}
                className="p-3 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-600/40 text-left transition-all"
              >
                <div className="text-xs font-bold text-red-300 mb-1">🚨 Both Faulty</div>
                <div className="text-[11px] text-slate-400">
                  Total loss of phone and net.
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step: ISSUE_ESCALATION */}
        {state === "ISSUE_ESCALATION" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  ATTENTION REQUIRED — DO NOT CONTINUE NORMAL SALES FLOW
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Customer has reported an active service issue. Compliance requires not overlooking service faults. Do NOT invent engineer visits, compensation, or tickets.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Brief customer description of issue:
              </label>
              <textarea
                value={customer.issueDescription || ""}
                onChange={(e) => onUpdateCustomer({ issueDescription: e.target.value })}
                placeholder="e.g. Crackling on landline for 3 days..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 h-20 focus:border-sparta-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEscalate("Customer reported service fault: " + (customer.issueDescription || "Unspecified"))}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
              >
                <span>ESCALATE TO SENIOR SUPERVISOR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onTransition("BILL_DISCOVERY")}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg text-xs"
              >
                Customer insists on checking reduction anyway
              </button>
            </div>
          </div>
        )}

        {/* Step: BILL_DISCOVERY */}
        {state === "BILL_DISCOVERY" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Monthly Bill Discovery
              </h3>
              {customer.lastBillAmount && (
                <span className="text-xs text-sparta-400 font-mono font-bold">
                  Estimated saving: ~£{((customer.lastBillAmount * config.maxDiscountPercent) / 100).toFixed(0)}/mo
                  (new bill ~£{(customer.lastBillAmount * (1 - config.maxDiscountPercent / 100)).toFixed(0)})
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Quick estimate:</span>
              {[25, 30, 40, 50, 60, 75].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    onUpdateCustomer({ lastBillAmount: amt, lastBillEstimated: true });
                    onTransition("OFFER_INTRO");
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold font-mono transition-all ${
                    customer.lastBillAmount === amt
                      ? "bg-sparta-600 text-white border-sparta-400"
                      : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  ~£{amt}
                </button>
              ))}

              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-xs text-slate-400">Custom £:</span>
                <input
                  type="number"
                  placeholder="e.g. 48"
                  value={customer.lastBillAmount || ""}
                  onChange={(e) => onUpdateCustomer({ lastBillAmount: Number(e.target.value) || undefined })}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-xs text-white font-mono focus:border-sparta-500 focus:outline-none"
                />
                <button
                  onClick={() => onTransition("OFFER_INTRO")}
                  className="bg-sparta-600 hover:bg-sparta-500 text-white px-2.5 py-1 rounded text-xs font-medium"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => {
                  onUpdateCustomer({ lastBillEstimated: true });
                  onTransition("OFFER_INTRO");
                }}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Customer doesn't remember bill → leave for now & continue
              </button>
            </div>
          </div>
        )}

        {/* Step: OFFER_INTRO & EXPLANATION */}
        {(state === "OFFER_INTRO" || state === "OFFER_EXPLANATION") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Authorized Offer Scope — What Does & Doesn't Change
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sparta-500/20 text-sparta-300 border border-sparta-500/30">
                Up to {config.maxDiscountPercent}% Reduction
              </span>
            </div>

            {/* 4 Cards from Section 18 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-bold text-sparta-400 uppercase tracking-wider mb-1">
                  SERVICE
                </div>
                <div className="text-xs font-semibold text-white">
                  Existing service remains the same*
                </div>
                <div className="text-[10px] text-slate-400 mt-1">No disruption to line</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-bold text-sparta-400 uppercase tracking-wider mb-1">
                  CONTRACT
                </div>
                <div className="text-xs font-semibold text-white">
                  Existing contract remains the same*
                </div>
                <div className="text-[10px] text-slate-400 mt-1">No forced renewals</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-bold text-sparta-400 uppercase tracking-wider mb-1">
                  EQUIPMENT
                </div>
                <div className="text-xs font-semibold text-white">
                  Existing equipment remains the same*
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Keep current handset</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  PAYMENT
                </div>
                <div className="text-xs font-semibold text-emerald-200">
                  Direct Debit payment reduced if eligible
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Up to {config.maxDiscountPercent}% discount</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => onTransition("OFFER_INTEREST")}
                className="bg-sparta-600 hover:bg-sparta-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <span>Check Customer Understanding</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: OFFER_INTEREST */}
        {state === "OFFER_INTEREST" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Customer Reaction — "Does that make sense so far?"
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => onTransition("ELIGIBILITY")}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-950/50 hover:border-emerald-500/50 border border-slate-700 text-left transition-all"
              >
                <div className="text-xs font-bold text-emerald-400 mb-1">
                  ✓ Yes, makes sense / happy to check
                </div>
                <div className="text-[11px] text-slate-400">
                  Move naturally to non-intrusive eligibility check.
                </div>
              </button>

              <button
                onClick={() => onOpenObjections()}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-amber-950/50 hover:border-amber-500/50 border border-slate-700 text-left transition-all"
              >
                <div className="text-xs font-bold text-amber-400 mb-1">
                  Has questions or hesitation
                </div>
                <div className="text-[11px] text-slate-400">
                  Open UK Objection Engine to address naturally.
                </div>
              </button>

              <button
                onClick={() => {
                  onEndCall("Customer not interested after clear explanation");
                }}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 hover:border-rose-500/50 border border-slate-700 text-left transition-all"
              >
                <div className="text-xs font-bold text-rose-400 mb-1">
                  ✕ Customer says "Not interested"
                </div>
                <div className="text-[11px] text-slate-400">
                  Respect refusal gracefully without repeated pressure.
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step: ELIGIBILITY */}
        {state === "ELIGIBILITY" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Date of Birth Verification
                </h3>
                <span className="text-[11px] text-slate-400">
                  Campaign Rule: Qualifying birth years {new Date(config.eligibilityRules.minimumDob).getFullYear()}–{new Date(config.eligibilityRules.maximumDob).getFullYear()}
                </span>
              </div>

              {customer.dateOfBirth && (
                <div
                  className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                    dobEligibility.isEligible
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  }`}
                >
                  {dobEligibility.message}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs text-slate-300 font-medium">Customer DOB:</label>
              <input
                type="date"
                value={customer.dateOfBirth || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const check = ConversationEngine.checkDobEligibility(val, config);
                  onUpdateCustomer({ dateOfBirth: val, isEligibleAge: check.isEligible });
                }}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sparta-500 focus:outline-none"
              />

              {customer.dateOfBirth && dobEligibility.isEligible && (
                <button
                  onClick={() => onTransition("CUSTOMER_DETAILS")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1 ml-auto"
                >
                  <span>Confirmed Eligible → Next: Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {customer.dateOfBirth && !dobEligibility.isEligible && (
                <button
                  onClick={() => onEndCall("Outside campaign eligibility bracket")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs ml-auto"
                >
                  Outside criteria → Conclude respectfully
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Customer asks: "Why do you need my date of birth?"</span>
              <button
                onClick={() => {
                  alert(
                    "Advisor Response: 'That's simply being used as part of the eligibility check. I don't want to guess or tell you that you're eligible before we've actually checked.'"
                  );
                }}
                className="text-sparta-400 hover:underline"
              >
                Show Advisor Script
              </button>
            </div>
          </div>
        )}

        {/* Step: CUSTOMER_DETAILS */}
        {state === "CUSTOMER_DETAILS" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Customer Details Verification
              </h3>
              <span className="text-[11px] text-slate-400">
                Ask one item at a time for older callers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">First Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Margaret"
                  value={customer.firstName || ""}
                  onChange={(e) => onUpdateCustomer({ firstName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Last Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Davies"
                  value={customer.lastName || ""}
                  onChange={(e) => onUpdateCustomer({ lastName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">House / Door Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 14B or Orchard House"
                  value={customer.address?.houseNumber || ""}
                  onChange={(e) =>
                    onUpdateCustomer({
                      address: { ...customer.address, houseNumber: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Street *</label>
                <input
                  type="text"
                  placeholder="e.g. Victoria Road"
                  value={customer.address?.street || ""}
                  onChange={(e) =>
                    onUpdateCustomer({
                      address: { ...customer.address, street: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Town / City *</label>
                <input
                  type="text"
                  placeholder="e.g. Bristol"
                  value={customer.address?.town || ""}
                  onChange={(e) =>
                    onUpdateCustomer({
                      address: { ...customer.address, town: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Postcode *</label>
                <input
                  type="text"
                  placeholder="e.g. BS1 4DJ"
                  value={customer.address?.postcode || ""}
                  onChange={(e) =>
                    onUpdateCustomer({
                      address: { ...customer.address, postcode: e.target.value.toUpperCase() },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono uppercase focus:border-sparta-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => onTransition("PAYMENT_CONSENT")}
                className="bg-sparta-600 hover:bg-sparta-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
              >
                <span>Proceed to Direct Debit Consent Gate</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: PAYMENT_CONSENT (CRITICAL GATE) */}
        {state === "PAYMENT_CONSENT" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>SENSITIVE PAYMENT INFORMATION — CRITICAL CONSENT GATE</span>
              </div>
              <ul className="text-xs space-y-1 text-slate-300 list-disc list-inside">
                <li>1. Explain why information is required (Direct Debit discount rate).</li>
                <li>2. Explain exactly what will happen (no service disruption, monthly savings).</li>
                <li>3. Confirm the customer understands.</li>
                <li>4. Obtain clear explicit verbal consent.</li>
                <li>5. <strong>NEVER ask for card PIN, CVV, OTP or online-banking passwords.</strong></li>
                <li>6. Never claim to see details that the system does not actually have.</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200">
              <div className="text-sparta-400 font-bold mb-1">MANDATORY ADVISOR SCRIPT:</div>
              <p className="italic">
                "Before we go any further, I want to explain the payment part clearly. The reason we're asking about the Direct Debit is to verify the payment method associated with the existing service and apply the authorised reduced rate. Are you comfortable continuing with that?"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => onDeclineConsent("PAYMENT")}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg text-xs"
              >
                Customer declines payment discussion → Lock payment & offer alternative
              </button>

              <button
                onClick={() => {
                  onGrantConsent("PAYMENT");
                  onTransition("PAYMENT_DETAILS");
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-glow-emerald"
              >
                <Check className="w-4 h-4" />
                <span>[REQUEST CONSENT] — Customer Consents & Unlocks Direct Debit</span>
              </button>
            </div>
          </div>
        )}

        {/* Step: PAYMENT_DETAILS */}
        {state === "PAYMENT_DETAILS" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Direct Debit Information Collection
                </h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Consent Recorded: {paymentConsentGranted?.timestamp || "Active Session"}
                </span>
              </div>

              <div className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
                NO CARDS • NO CVV • NO PIN • NO OTP
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mrs Margaret Davies"
                  value={directDebitData.accountHolderName}
                  onChange={(e) =>
                    onUpdateDirectDebitData({ accountHolderName: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Sort Code (6 digits)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 20-40-60"
                  value={directDebitData.sortCode}
                  onChange={(e) => {
                    const validated = SecurityEngine.validateSortCode(e.target.value);
                    onUpdateDirectDebitData({ sortCode: validated.formatted });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Account Number (8 digits)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12345678"
                  maxLength={8}
                  value={directDebitData.accountNumber}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, "");
                    onUpdateDirectDebitData({ accountNumber: clean });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sparta-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <div>
                <span>Security Mask Preview: </span>
                <span className="font-mono text-sparta-300 font-bold">
                  {SecurityEngine.maskSortCode(directDebitData.sortCode)} /{" "}
                  {SecurityEngine.maskAccountNumber(directDebitData.accountNumber)}
                </span>
              </div>
              <span className="text-emerald-400 text-[10px]">
                ✓ Isolated from browser storage & logs
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => onTransition("ADDITIONAL_DETAILS")}
                className="bg-sparta-600 hover:bg-sparta-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
              >
                <span>Save Payment & Continue to Additional Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: ADDITIONAL_DETAILS */}
        {state === "ADDITIONAL_DETAILS" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Additional Account Verification & Safety Checks
            </h3>

            {/* Medical Alarm Critical Check */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <label className="text-xs text-white font-bold block mb-1">
                Medical Alarm / Pendant Dependency Check *
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                "One important service question — do you have a medical alarm or similar device connected through the telephone line?"
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdateCustomer({ medicalAlarm: false })}
                  className={`px-3 py-1 rounded text-xs font-semibold border ${
                    customer.medicalAlarm === false
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  No Medical Alarm
                </button>
                <button
                  onClick={() => {
                    onUpdateCustomer({ medicalAlarm: true });
                    alert(
                      "IMPORTANT SERVICE DEPENDENCY: Customer has a medical alarm. Do not recommend changes that could interrupt service. Escalate to specialist team."
                    );
                  }}
                  className={`px-3 py-1 rounded text-xs font-semibold border ${
                    customer.medicalAlarm === true
                      ? "bg-red-600 text-white border-red-400 animate-pulse"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  ⚠️ YES — Medical Alarm Present
                </button>
              </div>
            </div>

            {/* Mobile Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Mobile Number</label>
                <input
                  type="text"
                  placeholder="e.g. 07123 456789"
                  value={customer.mobile?.number || ""}
                  onChange={(e) =>
                    onUpdateCustomer({
                      mobile: { ...customer.mobile, number: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Mobile Type</label>
                <select
                  value={customer.mobile?.type || "PAYG"}
                  onChange={(e) =>
                    onUpdateCustomer({
                      mobile: {
                        ...customer.mobile,
                        type: e.target.value as "PAYG" | "CONTRACT",
                      },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sparta-500 focus:outline-none"
                >
                  <option value="PAYG">Pay-As-You-Go</option>
                  <option value="CONTRACT">Monthly Contract</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Mobile Network</label>
                <input
                  type="text"
                  placeholder="e.g. EE, O2, Vodafone, Giffgaff"
                  value={customer.mobile?.network || ""}
                  onChange={(e) =>
                    onUpdateCustomer({
                      mobile: { ...customer.mobile, network: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => onTransition("FINAL_REVIEW")}
                className="bg-sparta-600 hover:bg-sparta-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
              >
                <span>Proceed to Final Review</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: FINAL_REVIEW */}
        {state === "FINAL_REVIEW" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Customer-Facing Final Review
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Offer:</span>
                <span className="font-bold text-sparta-300">Up to {config.maxDiscountPercent}% Direct Debit reduction</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Existing Service:</span>
                <span className="font-bold text-emerald-400">Unchanged*</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Existing Contract:</span>
                <span className="font-bold text-emerald-400">Unchanged*</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Equipment:</span>
                <span className="font-bold text-emerald-400">Unchanged*</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Payment:</span>
                <span className="font-bold text-sparta-300">Direct Debit to be reduced if eligible</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Eligibility:</span>
                <span className="font-bold text-emerald-400">
                  {dobEligibility.isEligible ? "Confirmed" : "Pending review"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Customer Terms:</span>
                <span className="font-bold text-slate-200">Customer must review authorised terms</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => onTransition("END")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-glow-emerald"
              >
                <span>Customer Confirms & Agrees → Close Call</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: END / SUMMARY */}
        {state === "END" && (
          <div className="space-y-4 text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white">Call Workflow Concluded</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              All compliance steps, authorizations, and notes have been recorded in accordance with UK telecommunications standards.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
