import React, { useState } from "react";
import {
  Calculator,
  X,
  Copy,
  Check,
  Percent,
  TrendingDown,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { OfferConfig, BillSavingsCalculation } from "../../types";
import { CalculatorTools } from "../../engine/calculatorTools";
import { SPARTA_PLANS, SpartaPlan } from "../../data/spartaPlans";

interface BillCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OfferConfig;
  currentAmount?: number;
  onApplyBill: (billData: { monthlyBill: number; billApproximate: boolean }) => void;
  onSwitchToVatCalculator?: () => void;
}

export const BillCalculatorModal: React.FC<BillCalculatorModalProps> = ({
  isOpen,
  onClose,
  config,
  currentAmount,
  onApplyBill,
  onSwitchToVatCalculator,
}) => {
  const [inputText, setInputText] = useState<string>(
    currentAmount ? currentAmount.toFixed(2) : "48.00"
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string>("sparta_line_only");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const selectedPlan: SpartaPlan =
    SPARTA_PLANS.find((p) => p.id === selectedPlanId) || SPARTA_PLANS[0];

  // Compare input against selected plan
  const comparison = CalculatorTools.calculateSpartaComparison(inputText, selectedPlan);

  const handleCopySnippet = () => {
    if (comparison) {
      navigator.clipboard.writeText(comparison.speechPitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    if (comparison) {
      const isApprox =
        inputText.toLowerCase().includes("about") ||
        inputText.toLowerCase().includes("around") ||
        inputText.toLowerCase().includes("roughly");

      onApplyBill({
        monthlyBill: comparison.currentBill,
        billApproximate: isApprox,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Sparta Telecom Savings &amp; Comparison Tool
              </h3>
              <p className="text-[11px] text-slate-400">
                Compare customer's current bill against Sparta digital packages and calculate 24-month savings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
          {/* Current Bill Input */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">
              Customer's Current Average Monthly Bill:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-base font-bold text-emerald-400 font-mono">
                £
              </span>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="48.00 or 48 pounds"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-base font-bold text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap pt-1">
              {["35.00", "48.00", "55.00", "65.00", "75.00", "85.00"].map((sample) => (
                <button
                  key={sample}
                  onClick={() => setInputText(sample)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                    inputText === sample
                      ? "bg-emerald-950 text-emerald-300 border-emerald-700 font-bold"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  £{sample}
                </button>
              ))}
            </div>
          </div>

          {/* Select Sparta Package to Compare Against */}
          <div className="space-y-2">
            <label className="text-slate-300 font-medium block">
              Compare Against Sparta Telecom Plan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SPARTA_PLANS.slice(0, 6).map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-2 rounded-xl text-left border transition-all flex items-center justify-between ${
                    selectedPlanId === plan.id
                      ? "bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="truncate mr-2">
                    <div className="font-bold text-white text-[11px] truncate">
                      {plan.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {plan.categoryLabel}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {plan.displayGross}
                    </span>
                    <div className="text-[9px] text-slate-500 font-mono">
                      {plan.displayBase}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Cards */}
          {comparison ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Current Bill */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Current Monthly Bill
                  </span>
                  <div className="text-xl font-black text-rose-400 font-mono">
                    £{comparison.currentBill.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500">existing provider average</span>
                </div>

                {/* Sparta Gross Bill */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    Sparta Total Gross
                  </span>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    £{comparison.spartaGross.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {selectedPlan.displayBase} + 20% VAT
                  </span>
                </div>

                {/* Monthly Savings */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Monthly Savings</span>
                  </span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {comparison.isSaving ? `£${comparison.monthlySavings.toFixed(2)}` : "Price Locked"}
                  </div>
                  <span className="text-[10px] text-emerald-300/80">saved each month</span>
                </div>

                {/* 2-Year Price Promise Savings */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>24-Month Total Savings</span>
                  </span>
                  <div className="text-2xl font-black text-indigo-300 font-mono">
                    {comparison.isSaving ? `£${comparison.twoYearSavings.toFixed(2)}` : "Locked 2 Yrs"}
                  </div>
                  <span className="text-[10px] text-indigo-300/80">
                    across 24 months price guarantee
                  </span>
                </div>
              </div>

              {/* Pitch Snippet */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>SCRIPT COMPARISON PITCH</span>
                  </span>
                  <button
                    onClick={handleCopySnippet}
                    className="text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-700"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{comparison.speechPitch}"
                </p>
              </div>

              {/* Link to VAT Calculator */}
              {onSwitchToVatCalculator && (
                <div className="text-center pt-1">
                  <button
                    onClick={onSwitchToVatCalculator}
                    className="text-[11px] text-slate-400 hover:text-teal-400 underline font-medium"
                  >
                    Need exact Base + VAT tax calculation? Switch to 20% VAT Calculator
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-400">
              Please enter a valid amount to compare savings.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!comparison}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span>Record £{comparison ? comparison.currentBill.toFixed(2) : "0.00"} Bill in Customer Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
