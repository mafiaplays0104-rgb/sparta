import React from "react";
import {
  GraduationCap,
  X,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { CallState, SuggestedResponse, CustomerMood, OfferConfig } from "../types";

interface TrainingModeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: CallState;
  suggestedResponse: SuggestedResponse;
  mood: CustomerMood;
  config: OfferConfig;
}

export const TrainingModeDrawer: React.FC<TrainingModeDrawerProps> = ({
  isOpen,
  onClose,
  state,
  suggestedResponse,
  mood,
  config,
}) => {
  if (!isOpen) return null;

  const getWhatNotToSay = () => {
    switch (state) {
      case "OPENING":
      case "BILL_RESPONSIBILITY":
        return [
          "Do NOT say: 'Have I caught you at an alright time?' (Explicitly removed)",
          "Do NOT use American sales speak: 'I'm reaching out today with an incredible deal'",
          "Do NOT pretend to already know personal details you don't possess",
        ];
      case "OFFER_INTRO":
      case "OFFER_EXPLANATION":
        return [
          "Do NOT say: 'You will definitely save 30%' — discount is always 'up to 30%' depending on eligibility",
          "Do NOT claim the customer must sign a new broadband contract if it's telephone-only",
          "Do NOT claim their existing router or telephone is obsolete",
        ];
      case "OFFER_INTEREST":
        return [
          "Do NOT jump straight to: 'Are you interested in buying this today?'",
          "Do NOT badger the caller after a clear 'No'",
          "Do NOT create false urgency ('This offer expires at 5pm today')",
        ];
      case "PAYMENT_CONSENT":
      case "PAYMENT_DETAILS":
        return [
          "NEVER ask for card number, CVV, or PIN under any circumstances",
          "NEVER ask for online-banking passwords or One-Time Passcodes (OTP)",
          "NEVER claim: 'We can already see your bank details on screen' unless real system confirms it",
        ];
      case "ELIGIBILITY":
        return [
          "Do NOT claim DOB is required for credit reference agency searches if it's only campaign age verification",
          "Do NOT make the customer feel self-conscious about their age",
        ];
      default:
        return [
          "Avoid slang like 'mate', 'innit', 'bro', or 'yo'",
          "Do NOT rush speech when speaking with an elderly caller",
          "Do NOT fabricate engineer visits, tickets, or compensation",
        ];
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-5 flex flex-col overflow-y-auto animate-slideLeft text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Training & Coaching Mode
            </h2>
            <span className="text-[10px] text-indigo-400">Senior Advisor Guidance</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 py-4 flex-1">
        {/* Why this is asked */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-bold text-sparta-400 uppercase tracking-wider flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Why is this question being asked?</span>
          </span>
          <p className="text-slate-200 leading-relaxed">{suggestedResponse.why}</p>
        </div>

        {/* What information is required */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>What information is required at this stage?</span>
          </span>
          <p className="text-slate-300">
            {suggestedResponse.requiredData && suggestedResponse.requiredData.length > 0
              ? `Required fields: ${suggestedResponse.requiredData.join(", ")}`
              : "No mandatory customer fields required — conversational alignment only."}
          </p>
        </div>

        {/* What NOT to say */}
        <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/40 space-y-2">
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>What NOT to say (Compliance Hard Stops)</span>
          </span>
          <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
            {getWhatNotToSay().map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Handling objections at this step */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Expected Caller Hesitation</span>
          </span>
          <p className="text-slate-300 text-[11px]">
            If caller expresses hesitation or confusion, do not defend or talk over them. Use the [OBJECTION] button to find the calm, pre-approved British response.
          </p>
        </div>

        {/* Next State */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Next Planned Stage:</span>
          <span className="text-sparta-400 font-bold font-mono">
            {suggestedResponse.nextState || "END"}
          </span>
        </div>
      </div>
    </div>
  );
};
