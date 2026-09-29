import React, { useState } from "react";
import {
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Calculator,
} from "lucide-react";
import { OfferConfig, CustomerRecord, DobAgeCalculation } from "../../types";
import { CalculatorTools } from "../../engine/calculatorTools";

interface DobCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OfferConfig;
  currentDob?: string;
  onApplyDob: (dobData: { dob?: string; birthYear?: number; calculatedAge?: number; isEligibleAge?: boolean }) => void;
}

export const DobCalculatorModal: React.FC<DobCalculatorModalProps> = ({
  isOpen,
  onClose,
  config,
  currentDob,
  onApplyDob,
}) => {
  const [mode, setMode] = useState<"AGE" | "YEAR" | "EXACT_DOB">("AGE");
  const [ageInput, setAgeInput] = useState<string>("72");
  const [yearInput, setYearInput] = useState<string>("1954");
  const [exactDobInput, setExactDobInput] = useState<string>(currentDob || "1954-06-15");

  if (!isOpen) return null;

  // Compute live calculation
  let calculation: DobAgeCalculation;
  if (mode === "AGE") {
    calculation = CalculatorTools.processDobCalculation({ mode: "AGE", value: ageInput }, config);
  } else if (mode === "YEAR") {
    calculation = CalculatorTools.processDobCalculation({ mode: "YEAR", value: yearInput }, config);
  } else {
    calculation = CalculatorTools.processDobCalculation({ mode: "EXACT_DOB", value: exactDobInput }, config);
  }

  const handleApply = () => {
    let finalDob = currentDob;
    if (mode === "EXACT_DOB" && calculation.exactDob) {
      finalDob = calculation.exactDob;
    } else if (calculation.birthYear) {
      finalDob = `${calculation.birthYear}-01-01`;
    }

    onApplyDob({
      dob: finalDob,
      birthYear: calculation.birthYear,
      calculatedAge: calculation.age,
      isEligibleAge: calculation.isEligible,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                DOB & Age / Birth Year Calculator
              </h3>
              <p className="text-[11px] text-slate-400">
                Calculate exact birth year from customer's age or verify campaign eligibility
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
          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMode("AGE")}
              className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                mode === "AGE"
                  ? "bg-indigo-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              1. Customer says Age
            </button>
            <button
              onClick={() => setMode("YEAR")}
              className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                mode === "YEAR"
                  ? "bg-indigo-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              2. Customer says Year
            </button>
            <button
              onClick={() => setMode("EXACT_DOB")}
              className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                mode === "EXACT_DOB"
                  ? "bg-indigo-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              3. Full Date (DOB)
            </button>
          </div>

          {/* Input Controls */}
          {mode === "AGE" && (
            <div className="space-y-2">
              <label className="text-slate-300 font-medium block">
                How old did the customer say they are?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={18}
                  max={120}
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  placeholder="e.g. 72"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-base font-bold text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-slate-400 font-medium">years old</span>
              </div>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {[65, 70, 72, 75, 78, 80, 82].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAgeInput(String(a))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                  >
                    {a} yrs
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "YEAR" && (
            <div className="space-y-2">
              <label className="text-slate-300 font-medium block">
                What year was the customer born in?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1900}
                  max={2026}
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  placeholder="e.g. 1954"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-base font-bold text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-slate-400 font-medium">birth year</span>
              </div>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {[1945, 1950, 1952, 1954, 1956, 1958, 1960].map((y) => (
                  <button
                    key={y}
                    onClick={() => setYearInput(String(y))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "EXACT_DOB" && (
            <div className="space-y-2">
              <label className="text-slate-300 font-medium block">
                Exact Date of Birth:
              </label>
              <input
                type="date"
                value={exactDobInput}
                onChange={(e) => setExactDobInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-base font-bold text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {/* Live Result Calculation Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                CALCULATION RESULT
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${
                  calculation.isEligible
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {calculation.isEligible ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Eligible</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Outside Bracket</span>
                  </>
                )}
              </span>
            </div>

            <div className="text-base font-bold text-white font-mono">
              {calculation.formattedDisplay}
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              {calculation.eligibilityMessage}
            </p>

            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-900 flex justify-between">
              <span>Campaign Rule: 1943 – 1960</span>
              <span>Current Year: 2026</span>
            </div>
          </div>
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
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <span>Apply to Customer Record</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
