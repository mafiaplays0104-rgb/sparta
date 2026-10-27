import React, { useState } from "react";
import {
  Calculator,
  X,
  Copy,
  Check,
  Receipt,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Percent,
  CheckCircle2,
} from "lucide-react";
import { OfferConfig, VatCalculation } from "../../types";
import { CalculatorTools } from "../../engine/calculatorTools";
import { SPARTA_PLANS, SpartaPlan } from "../../data/spartaPlans";

interface VatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: OfferConfig;
  currentAmount?: number;
  onApplyBill: (billData: { monthlyBill: number; billApproximate: boolean }) => void;
  onSwitchToDiscountCalculator?: () => void;
}

export const VatCalculatorModal: React.FC<VatCalculatorModalProps> = ({
  isOpen,
  onClose,
  currentAmount,
  onApplyBill,
  onSwitchToDiscountCalculator,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("sparta_line_only");
  const [inputText, setInputText] = useState<string>(
    currentAmount ? currentAmount.toFixed(2) : "19.99"
  );
  const [mode, setMode] = useState<"ADD_VAT" | "EXTRACT_VAT">("ADD_VAT");
  const [includeRouter, setIncludeRouter] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const vatRate = 20; // 20% UK Standard VAT
  const routerFee = 30; // £30 router charge from Phase 4

  // Perform calculation
  const calculation: VatCalculation | null =
    mode === "ADD_VAT"
      ? CalculatorTools.calculateVat(inputText, vatRate, routerFee)
      : CalculatorTools.extractVatFromGross(inputText, vatRate, routerFee);

  const handleSelectPlan = (plan: SpartaPlan) => {
    setSelectedPlanId(plan.id);
    setInputText(plan.basePrice.toFixed(2));
    setMode("ADD_VAT");
  };

  const handleCopySnippet = () => {
    if (calculation) {
      navigator.clipboard.writeText(calculation.speechSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    if (calculation) {
      onApplyBill({
        monthlyBill: calculation.grossAmount,
        billApproximate: false,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Sparta Telecom Pricing &amp; 20% VAT Calculator
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  STANDARD 20%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Transparent “[Base Price] + VAT” breakdown and estimated gross monthly totals
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
          {/* Quick Select Sparta Telecom Plans */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Select Official Sparta Telecom Plan:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SPARTA_PLANS.map((plan) => {
                const isSelected =
                  Math.abs(parseFloat(inputText) - plan.basePrice) < 0.01 &&
                  mode === "ADD_VAT";
                return (
                  <button
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan)}
                    className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-teal-950/70 border-teal-500 shadow-md ring-1 ring-teal-500/50"
                        : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-white text-[11px] truncate">
                          {plan.name}
                        </span>
                        {plan.tag && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-slate-800 text-teal-300 font-mono flex-shrink-0">
                            {plan.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight line-clamp-1 mb-1.5">
                        {plan.minutes}
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-[10px] font-mono text-slate-400">
                        {plan.displayBase}
                      </span>
                      <span className="text-xs font-black text-teal-400 font-mono">
                        ≈ {plan.displayGross}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-[11px]">
            <button
              onClick={() => setMode("ADD_VAT")}
              className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === "ADD_VAT"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Add 20% VAT (Base Price → Total Amount)</span>
            </button>
            <button
              onClick={() => setMode("EXTRACT_VAT")}
              className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === "EXTRACT_VAT"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Extract Net from Gross (Total Inc. VAT)</span>
            </button>
          </div>

          {/* Custom Input field */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">
              {mode === "ADD_VAT"
                ? "Base Price (Excluding VAT):"
                : "Gross Total (Including VAT):"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-base font-bold text-teal-400 font-mono">
                £
              </span>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="19.99, 26.99, 31.99 or 48 pounds"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-base font-bold text-white font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Hardware Add-on (Router Fee) */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeRouterCheck"
                checked={includeRouter}
                onChange={(e) => setIncludeRouter(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 bg-slate-900 border-slate-700 focus:ring-teal-500 cursor-pointer"
              />
              <label
                htmlFor="includeRouterCheck"
                className="text-slate-300 font-medium cursor-pointer"
              >
                Include One-Time £30.00 Router Charge (Step 7)
              </label>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">
              Engineer Visit: FREE (£0)
            </span>
          </div>

          {/* Calculation Breakdown Cards */}
          {calculation ? (
            <div className="space-y-3">
              {/* PRIMARY CARDS GRID */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Net Amount Card */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Base Price (Excl. VAT)
                  </span>
                  <div className="text-lg font-black text-slate-200 font-mono">
                    {calculation.formattedNet}
                  </div>
                  <span className="text-[10px] text-slate-500">stated clearly as Base + VAT</span>
                </div>

                {/* 2. 20% VAT Amount Card */}
                <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30">
                  <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block mb-1 flex items-center justify-between">
                    <span>20% UK Standard VAT</span>
                    <span className="text-[9px] px-1 rounded bg-teal-900/60 text-teal-300 font-mono">
                      +20%
                    </span>
                  </span>
                  <div className="text-lg font-black text-teal-300 font-mono">
                    +{calculation.formattedVat}
                  </div>
                  <span className="text-[10px] text-teal-400/70">transparent tax addition</span>
                </div>

                {/* 3. KEY CARD: Amount After Adding VAT (Gross Total) */}
                <div className="col-span-2 p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border-2 border-emerald-500/60 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ESTIMATED GROSS MONTHLY TOTAL</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                      INC. 20% VAT
                    </span>
                  </div>
                  <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight my-1">
                    {calculation.formattedGross}
                    <span className="text-xs font-semibold text-emerald-300/80 ml-2">
                      per month
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80">
                    Quote clearly: “{calculation.formattedNet} + VAT (approx. {calculation.formattedGross} each month)”
                  </p>
                </div>

                {/* 4. 2-Year Price Promise Card */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>24-Month Price Promise</span>
                  </span>
                  <div className="text-lg font-black text-indigo-300 font-mono">
                    £{calculation.formattedTwoYearGross}
                  </div>
                  <span className="text-[10px] text-indigo-300/80">
                    locked for 2 years (zero price hikes)
                  </span>
                </div>

                {/* 5. 12-Month Annual Total Card */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Annual Gross (12 Mo.)</span>
                  </span>
                  <div className="text-lg font-black text-slate-200 font-mono">
                    {calculation.formattedAnnualGross}
                  </div>
                  <span className="text-[10px] text-slate-500">12 monthly billing cycles</span>
                </div>

                {/* 6. First Month with Router Card (if checked) */}
                {includeRouter && (
                  <div className="col-span-2 p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                        First Month Total (With £30 Router Fee)
                      </span>
                      <span className="text-[11px] text-amber-200/80">
                        Monthly {calculation.formattedGross} + One-time £30.00 router adjustment
                      </span>
                    </div>
                    <div className="text-xl font-black text-amber-400 font-mono">
                      {calculation.formattedFirstBillWithRouter}
                    </div>
                  </div>
                )}
              </div>

              {/* Speech Snippet Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>VERBATIM SCRIPT LINE (PRICING &amp; VAT)</span>
                  </span>
                  <button
                    onClick={handleCopySnippet}
                    className="text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-700"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-teal-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{calculation.speechSnippet}"
                </p>
              </div>

              {/* Switch to Discount Calculator Link */}
              {onSwitchToDiscountCalculator && (
                <div className="text-center pt-1">
                  <button
                    onClick={onSwitchToDiscountCalculator}
                    className="text-[11px] text-slate-400 hover:text-emerald-400 underline font-medium"
                  >
                    Looking to compare against customer's current bill? Switch to Savings Calculator
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-400">
              Please enter a valid amount to see the 20% VAT calculation.
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
            disabled={!calculation}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span>Apply {calculation ? calculation.formattedGross : "£0.00"} to Customer Record</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
