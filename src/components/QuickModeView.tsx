import React, { useState } from "react";
import {
  ChevronRight,
  Zap,
  Copy,
  Check,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { CallState, SuggestedResponse, CustomerMood } from "../types";

interface QuickModeViewProps {
  state: CallState;
  suggestedResponse: SuggestedResponse;
  mood: CustomerMood;
  onTransition: (nextState: CallState) => void;
  onOpenObjections: () => void;
  onSwitchToProduction: () => void;
}

export const QuickModeView: React.FC<QuickModeViewProps> = ({
  state,
  suggestedResponse,
  mood,
  onTransition,
  onOpenObjections,
  onSwitchToProduction,
}) => {
  const [copied, setCopied] = useState(false);

  const sayText =
    mood === "IMPATIENT"
      ? suggestedResponse.short
      : suggestedResponse.primary;

  const handleCopy = () => {
    navigator.clipboard.writeText(sayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNextActionLabel = () => {
    switch (state) {
      case "OPENING":
      case "BILL_RESPONSIBILITY":
        return "Confirm if customer is the bill payer";
      case "RAPPORT":
        return "Acknowledge response and lead into service discovery";
      case "SERVICE_DISCOVERY":
        return "Identify if phone only or bundled with broadband";
      case "ISSUE_CHECK":
        return "Check if landline or internet is currently faulty";
      case "BILL_DISCOVERY":
        return "Record approximate last bill amount";
      case "OFFER_INTRO":
      case "OFFER_EXPLANATION":
        return "Present up to 30% reduction and explain what stays unchanged";
      case "OFFER_INTEREST":
        return "Check understanding ('Does that make sense so far?')";
      case "ELIGIBILITY":
        return "Take Date of Birth to verify qualifying bracket";
      case "CUSTOMER_DETAILS":
        return "Collect Name, House Number, Street and Postcode";
      case "PAYMENT_CONSENT":
        return "Obtain clear verbal consent before payment discussion";
      case "PAYMENT_DETAILS":
        return "Record Sort Code and Account Number for Direct Debit";
      case "ADDITIONAL_DETAILS":
        return "Screen for Medical Alarm / Lifeline pendant";
      case "FINAL_REVIEW":
        return "Confirm all summary terms before closing";
      case "END":
        return "Say courteous closing and wrap call";
      default:
        return "Continue to next conversation step";
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto p-6 md:p-12 w-full animate-fadeIn">
      {/* Banner */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            QUICK MODE ACTIVE
          </span>
          <span className="text-xs text-slate-500">Minimalist live copilot</span>
        </div>

        <button
          onClick={onSwitchToProduction}
          className="text-xs text-sparta-400 hover:text-white underline"
        >
          Switch to Full Production Mode
        </button>
      </div>

      {/* Card 1: Objective */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4 shadow-md">
        <span className="text-xs font-bold text-sparta-400 uppercase tracking-wider block mb-1">
          OBJECTIVE
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {suggestedResponse.objective}
        </h2>
      </div>

      {/* Card 2: SAY */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sparta-950/40 border-2 border-sparta-500/50 rounded-2xl p-6 md:p-8 mb-4 shadow-xl relative">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-sparta-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            SAY
          </span>

          <button
            onClick={handleCopy}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed select-text tracking-tight">
          "{sayText}"
        </p>

        {suggestedResponse.complianceWarning && (
          <div className="mt-4 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{suggestedResponse.complianceWarning}</span>
          </div>
        )}
      </div>

      {/* Card 3: NEXT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
            NEXT ACTION
          </span>
          <p className="text-sm font-semibold text-white">{getNextActionLabel()}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenObjections}
            className="px-4 py-2 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-800 text-xs font-semibold hover:bg-amber-900/50 flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Objection</span>
          </button>

          {suggestedResponse.nextState && suggestedResponse.nextState !== state && (
            <button
              onClick={() => onTransition(suggestedResponse.nextState)}
              className="px-5 py-2.5 rounded-xl bg-sparta-500 hover:bg-sparta-400 text-slate-950 text-xs md:text-sm font-extrabold flex items-center gap-2 shadow-glow-primary active:scale-95 transition-all"
            >
              <span>Done → Advance Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
