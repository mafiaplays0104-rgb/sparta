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
} from "lucide-react";
import { OfferConfig, BillSavingsCalculation } from "../../types";
import { CalculatorTools } from "../../engine/calculatorTools";

interface BillCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OfferConfig;
  currentAmount?: number;
  onApplyBill: (billData: { monthlyBill: number; billApproximate: boolean }) => void;
}

export const BillCalculatorModal: React.FC<BillCalculatorModalProps> = ({
  isOpen,
  onClose,
  config,
  currentAmount,
  onApplyBill,
}) => {
  const [inputText, setInputText] = useState<string>(
    currentAmount ? currentAmount.toFixed(2) : "80 pounds 99 pence"
  );
  const [discountPercent, setDiscountPercent] = useState<number>(
    config.maxDiscountPercent || 30
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate live savings
  const calculation: BillSavingsCalculation | null =
    CalculatorTools.calculateBillSavings(inputText, discountPercent);

  const handleCopySnippet = () => {
    if (calculation) {
      navigator.clipboard.writeText(calculation.speechSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    if (calculation) {
      const isApprox =
        inputText.toLowerCase().includes("about") ||
        inputText.toLowerCase().includes("around") ||
        inputText.toLowerCase().includes("roughly");

      onApplyBill({
        monthlyBill: calculation.originalBill,
        billApproximate: isApprox,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Bill Reduction & 30% Savings Calculator
              </h3>
              <p className="text-[11px] text-slate-400">
                Instant calculation for monthly discounted price, monthly savings, and annual savings
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
        <div className="p-5 space-y-4 text-xs">
          {/* Input field */}
          <div className="space-y-2">
            <label className="text-slate-300 font-medium block">
              Enter amount customer is paying (Text or Number):
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. 80 pounds 99 pence or 80.99"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-base font-bold text-white font-mono focus:border-emerald-500 focus:outline-none"
            />
            <div className="flex gap-1.5 flex-wrap pt-1">
              {["80 pounds 99 pence", "£50.00", "£65.00", "£72.43", "£85.00", "£110.00"].map((sample) => (
                <button
                  key={sample}
                  onClick={() => setInputText(sample)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Discount Percentage Selector */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Discount Applied:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[20, 25, 30, 35].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDiscountPercent(pct)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    discountPercent === pct
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Breakdown Cards */}
          {calculation ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Original Bill */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Current Monthly Bill
                  </span>
                  <div className="text-lg font-black text-slate-200 font-mono">
                    {calculation.formattedOriginal}
                  </div>
                  <span className="text-[10px] text-slate-500">per month</span>
                </div>

                {/* 30% Discounted Price */}
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    <span>{discountPercent}% Discounted Bill</span>
                  </span>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    {calculation.formattedDiscounted}
                  </div>
                  <span className="text-[10px] text-emerald-300/80">new monthly price</span>
                </div>

                {/* Monthly Savings */}
                <div className="p-3 rounded-xl bg-sparta-950/40 border border-sparta-500/40">
                  <span className="text-[10px] font-bold text-sparta-300 uppercase tracking-wider block mb-1">
                    Monthly Savings
                  </span>
                  <div className="text-lg font-black text-sparta-300 font-mono">
                    {calculation.formattedMonthlySavings}
                  </div>
                  <span className="text-[10px] text-slate-400">saved each month</span>
                </div>

                {/* Annual Savings */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Annual / Yearly Savings</span>
                  </span>
                  <div className="text-lg font-black text-indigo-300 font-mono">
                    {calculation.formattedAnnualSavings}
                  </div>
                  <span className="text-[10px] text-indigo-300/80">saved across 12 months</span>
                </div>
              </div>

              {/* Speech Snippet Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-sparta-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>APPROVED SPOKEN SUMMARY</span>
                  </span>
                  <button
                    onClick={handleCopySnippet}
                    className="text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-700"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{calculation.speechSnippet}"
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-400">
              Please enter a valid bill amount to see the calculation breakdown.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!calculation}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <span>Apply to Customer Record & Script</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
