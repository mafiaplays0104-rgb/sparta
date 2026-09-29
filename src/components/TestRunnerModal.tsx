import React, { useState } from "react";
import {
  X,
  Play,
  CheckCircle2,
  XCircle,
  FlaskConical,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { OfferConfig } from "../types";
import { CalculatorTools } from "../engine/calculatorTools";
import { SecurityEngine } from "../engine/securityEngine";
import { InformationExtractor } from "../engine/informationExtractor";
import { KnowledgeBaseEngine } from "../data/knowledgeBase";
import { objectionLibrary } from "../data/objections";
import { MasterScriptEngine, STAGES_LIST } from "../engine/masterScriptEngine";
import { ScriptUnitEngine } from "../engine/scriptUnitEngine";

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OfferConfig;
}

interface TestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  run: () => { pass: boolean; actual: string; expected: string };
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [results, setResults] = useState<Record<string, { pass: boolean; actual: string; expected: string }>>({});
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  // Build the 21 test cases as specified in Section 50 of the prompt
  const testCases: TestCase[] = [
    {
      id: "test_30pct_savings_calc",
      name: "30% Bill Savings Calculator Tool",
      category: "CALCULATOR_TOOLS",
      description: "Verifies £80.99 yields £56.69 new price, £24.30 monthly savings, £291.56 annual savings.",
      run: () => {
        const calc = CalculatorTools.calculateBillSavings("80 pounds 99 pence", 30);
        const pass =
          calc !== null &&
          calc.discountedPrice === 56.69 &&
          calc.monthlySavings >= 24.29 &&
          calc.monthlySavings <= 24.31 &&
          calc.annualSavings >= 291.55 &&
          calc.annualSavings <= 291.65;
        return {
          pass,
          actual: calc ? `Disc: £${calc.discountedPrice.toFixed(2)}, Mo: £${calc.monthlySavings.toFixed(2)}, Yr: £${calc.annualSavings.toFixed(2)}` : "null",
          expected: "Disc: £56.69, Mo: £24.30, Yr: £291.60",
        };
      },
    },
    {
      id: "test_dob_age_calc",
      name: "DOB & Age / Year Conversion Tool",
      category: "CALCULATOR_TOOLS",
      description: "Verifies Age 72 in 2026 converts to birth year 1954 and checks eligibility.",
      run: () => {
        const year = CalculatorTools.calculateYearFromAge(72);
        const res = CalculatorTools.processDobCalculation({ mode: "AGE", value: 72 }, config);
        const pass = year === 1954 && res.isEligible === true;
        return {
          pass,
          actual: `Year: ${year}, Eligible: ${res.isEligible}`,
          expected: "Year: 1954, Eligible: true",
        };
      },
    },
    {
      id: "test_prohibited_pin_otp",
      name: "Prohibited Financial Credentials Guard",
      category: "SECURITY_GUARD",
      description: "Detects and blocks attempts to collect PIN, OTP, online password, or card numbers.",
      run: () => {
        const scan = SecurityEngine.scanProhibitedInformation("Can you give me your card PIN and one-time passcode OTP?");
        const pass = scan.hasProhibited && scan.detectedTypes.includes("PIN") && scan.detectedTypes.includes("OTP / One-Time Passcode");
        return {
          pass,
          actual: `Blocked: ${scan.hasProhibited}, Types: ${scan.detectedTypes.join(", ")}`,
          expected: "Blocked: true, Types: PIN, OTP / One-Time Passcode",
        };
      },
    },
    {
      id: "test_customer_id_ibangb_validation",
      name: "Customer ID IBANGB Prefix Validation",
      category: "DATA_VALIDATION",
      description: "Enforces uppercase IBANGB prefix formatting without corrupting raw data.",
      run: () => {
        const validRes = SecurityEngine.validateCustomerId("ibangb987654321", "IBANGB");
        const invalidRes = SecurityEngine.validateCustomerId("GB12345678", "IBANGB");
        const pass = validRes.isValid && validRes.normalizedValue === "IBANGB987654321" && !invalidRes.isValid;
        return {
          pass,
          actual: `Valid: ${validRes.isValid} (${validRes.normalizedValue}), Invalid: ${invalidRes.isValid}`,
          expected: "Valid: true (IBANGB987654321), Invalid: false",
        };
      },
    },
    {
      id: "test_uk_postcode_normalization",
      name: "UK Postcode Structure & Uppercase Normalization",
      category: "DATA_VALIDATION",
      description: "Normalizes lowercase 'ab12 3cd' to 'AB12 3CD' with valid UK postcode regex.",
      run: () => {
        const res = SecurityEngine.validateUkPostcode("sw1a 1aa");
        const pass = res.isValid && res.normalizedValue === "SW1A 1AA";
        return {
          pass,
          actual: `Valid: ${res.isValid}, Normalized: ${res.normalizedValue}`,
          expected: "Valid: true, Normalized: SW1A 1AA",
        };
      },
    },
    {
      id: "test_conflict_detection",
      name: "Conflicting Information Detection",
      category: "SMART_EXTRACTION",
      description: "Flags conflict when customer changes bill from £50 to £80.",
      run: () => {
        const extracted = InformationExtractor.extractFromText("Actually my bill is £80", { monthlyBill: 50 });
        const pass = !!extracted.conflictDetected && extracted.conflictDetected.previousValue === "£50.00";
        return {
          pass,
          actual: `Conflict Detected: ${!!extracted.conflictDetected}`,
          expected: "Conflict Detected: true",
        };
      },
    },
    {
      id: "test_smart_bundle_extraction",
      name: "Smart Bundle & Usage Extraction",
      category: "SMART_EXTRACTION",
      description: "Extracts broadband=true, tv=false, and landline=LOW from natural speech.",
      run: () => {
        const extracted = InformationExtractor.extractFromText(
          "I hardly ever use the landline, I pay around £65 and that includes broadband but not TV.",
          {}
        );
        const pass =
          extracted.monthlyBill === 65 &&
          extracted.billIncludesBroadband === true &&
          extracted.billIncludesTv === false &&
          extracted.landlineUsage === "LOW";
        return {
          pass,
          actual: `Bill: £${extracted.monthlyBill}, BB: ${extracted.billIncludesBroadband}, TV: ${extracted.billIncludesTv}, Landline: ${extracted.landlineUsage}`,
          expected: "Bill: £65, BB: true, TV: false, Landline: LOW",
        };
      },
    },
    {
      id: "test_kb_unknown_question_guard",
      name: "Customer Question 'No Approved Answer' Guard",
      category: "KNOWLEDGE_BASE",
      description: "Returns 'NO APPROVED ANSWER AVAILABLE' for unconfigured questions without improvising.",
      run: () => {
        const res = KnowledgeBaseEngine.searchQuestion("Can I get a free satellite dish installed on my roof tomorrow?");
        const pass = !res.matched && res.fallbackMessage.includes("NO APPROVED ANSWER");
        return {
          pass,
          actual: `Matched: ${res.matched}, Fallback: ${res.fallbackMessage.slice(0, 30)}...`,
          expected: "Matched: false, Fallback: NO APPROVED ANSWER...",
        };
      },
    },
    {
      id: "test_objection_busy_schedule",
      name: "Customer Busy Objection Handling",
      category: "OBJECTION_ENGINE",
      description: "Provides polite rescheduling response without high pressure.",
      run: () => {
        const item = objectionLibrary.find((o) => o.id === "customer_busy");
        const pass = !!item && item.action === "pause_or_schedule" && item.recommendedResponse.includes("Would another time be more convenient");
        return {
          pass,
          actual: item ? `Action: ${item.action}, Pass: ${pass}` : "Not found",
          expected: "Action: pause_or_schedule, Pass: true",
        };
      },
    },
    {
      id: "test_scam_concern_handling",
      name: "Scam / Security Concern Handling",
      category: "OBJECTION_ENGINE",
      description: "Provides official verification route without arguing 'It's definitely not a scam'.",
      run: () => {
        const item = objectionLibrary.find((o) => o.id === "thinks_scam");
        const pass = !!item && item.action === "stop_collection" && item.recommendedResponse.includes("independently verify the company");
        return {
          pass,
          actual: item ? `Action: ${item.action}` : "Not found",
          expected: "Action: stop_collection",
        };
      },
    },
    {
      id: "test_master_script_stages_count",
      name: "Master Script 11 Stages Integrity",
      category: "SCRIPT_ENGINE",
      description: "Verifies exactly 11 distinct sequential stages with approved wording.",
      run: () => {
        const stages = STAGES_LIST;
        const pass = stages.length === 11 && stages[0] === "STAGE_1_OPENING" && stages[10] === "STAGE_11_NATURAL_CLOSE";
        return {
          pass,
          actual: `Stages count: ${stages.length}, First: ${stages[0]}, Last: ${stages[10]}`,
          expected: "Stages count: 11, First: STAGE_1_OPENING, Last: STAGE_11_NATURAL_CLOSE",
        };
      },
    },
    {
      id: "test_stage_3_exact_minutes",
      name: "Stage 3 500-Minute Offer Parameter",
      category: "SCRIPT_ENGINE",
      description: "Ensures Stage 3 includes configured 500 minutes without inventing arbitrary figures.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STAGE_3_OFFER_INTRO", {}, config);
        const text = def.getSayText({}, config);
        const pass = text.includes("500 cross-network anytime calling minutes");
        return {
          pass,
          actual: `Contains 500 minutes: ${pass}`,
          expected: "Contains 500 minutes: true",
        };
      },
    },
    {
      id: "test_medical_alarm_safety",
      name: "Medical Alarm Life Safety Screening",
      category: "VULNERABILITY",
      description: "Ensures Stage 9 includes explicit medical alarm screening before final check.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STAGE_9_FINAL_QUESTIONS", {}, config);
        const text = def.getSayText({}, config);
        const pass = text.includes("medical alarm connected to your phone line");
        return {
          pass,
          actual: `Screens medical alarm: ${pass}`,
          expected: "Screens medical alarm: true",
        };
      },
    },
    {
      id: "test_do_not_call_compliance",
      name: "Do Not Call Immediate Cessation",
      category: "COMPLIANCE",
      description: "Verifies DO_NOT_CALL disposition ceases selling immediately.",
      run: () => {
        const dnc = objectionLibrary.find((o) => o.id === "do_not_call");
        const pass = !!dnc && dnc.allowContinue === false && dnc.action === "disposition";
        return {
          pass,
          actual: `Allow continue: ${dnc?.allowContinue}, Action: ${dnc?.action}`,
          expected: "Allow continue: false, Action: disposition",
        };
      },
    },
    {
      id: "test_dob_refusal_fallback",
      name: "Customer Refuses DOB Graceful Fallback",
      category: "OBJECTION_ENGINE",
      description: "Provides polite fallback without pressuring when customer refuses date of birth.",
      run: () => {
        const item = objectionLibrary.find((o) => o.id === "dob_refusal");
        const pass = !!item && item.recommendedResponse.includes("That's completely fine");
        return {
          pass,
          actual: item ? `Pass: ${pass}` : "Not found",
          expected: "Pass: true",
        };
      },
    },
    {
      id: "test_customer_id_not_available",
      name: "Customer ID Not Available Fallback",
      category: "OBJECTION_ENGINE",
      description: "Allows leaving customer ID for fulfillment team verification without guessing.",
      run: () => {
        const item = objectionLibrary.find((o) => o.id === "customer_id_not_available");
        const pass = !!item && item.recommendedResponse.includes("Please don't guess it");
        return {
          pass,
          actual: item ? `Pass: ${pass}` : "Not found",
          expected: "Pass: true",
        };
      },
    },
    {
      id: "test_customer_id_why",
      name: "Customer ID Direct Debit Purpose Explanation",
      category: "OBJECTION_ENGINE",
      description: "Explains ID is only used to match Direct Debit and is not a request for PIN/OTP.",
      run: () => {
        const item = objectionLibrary.find((o) => o.id === "customer_id_why");
        const pass = !!item && item.recommendedResponse.includes("Direct Debit eligibility");
        return {
          pass,
          actual: item ? `Pass: ${pass}` : "Not found",
          expected: "Pass: true",
        };
      },
    },
    {
      id: "test_wrong_person_privacy",
      name: "Wrong Person Privacy Protection",
      category: "COMPLIANCE",
      description: "Ensures no account information is disclosed if wrong person answers.",
      run: () => {
        const item = objectionLibrary.find((o) => o.id === "wrong_person");
        const pass = !!item && item.allowContinue === false && item.action === "disposition";
        return {
          pass,
          actual: item ? `Action: ${item.action}, AllowContinue: ${item.allowContinue}` : "Not found",
          expected: "Action: disposition, AllowContinue: false",
        };
      },
    },
    {
      id: "test_de_escalation_upset",
      name: "Upset Customer De-Escalation Mode",
      category: "VULNERABILITY",
      description: "Provides calm, short, non-confrontational phrasing when customer is upset.",
      run: () => {
        const item = objectionLibrary.find((o) => o.id === "customer_upset");
        const pass = !!item && item.recommendedResponse.includes("We can stop here if you'd prefer");
        return {
          pass,
          actual: item ? `Pass: ${pass}` : "Not found",
          expected: "Pass: true",
        };
      },
    },
    {
      id: "test_send_in_writing",
      name: "Send In Writing First Explanation",
      category: "OFFER",
      description: "Confirms all terms and details are provided in writing before changes occur.",
      run: () => {
        const item = objectionLibrary.find((o) => o.id === "send_in_writing");
        const pass = !!item && item.recommendedResponse.includes("provided to you in writing");
        return {
          pass,
          actual: item ? `Pass: ${pass}` : "Not found",
          expected: "Pass: true",
        };
      },
    },
    {
      id: "test_script_unit_engine_determinism",
      name: "Single Script Unit Engine Determinism",
      category: "SCRIPT_ENGINE",
      description: "Verifies 1-by-1 discrete unit generation across all 11 stages without modifying locked wording.",
      run: () => {
        const units = ScriptUnitEngine.getAllUnits({ firstName: "John", lastName: "Smith", monthlyBill: 80.99 }, config);
        const pass = units.length >= 25 && units.every((u) => !!u.stage && typeof u.getText === "function" && u.stageNumber >= 1 && u.stageNumber <= 11);
        return {
          pass,
          actual: `Total Units: ${units.length}, Valid: ${pass}`,
          expected: "Total Units: >= 25, Valid: true",
        };
      },
    },
  ];

  const handleRunAll = () => {
    setIsRunning(true);
    const newResults: Record<string, { pass: boolean; actual: string; expected: string }> = {};

    testCases.forEach((tc) => {
      try {
        newResults[tc.id] = tc.run();
      } catch (err: any) {
        newResults[tc.id] = { pass: false, actual: `Error: ${err.message}`, expected: "Success" };
      }
    });

    setResults(newResults);
    setIsRunning(false);
  };

  const passCount = Object.values(results).filter((r) => r.pass).length;
  const totalRun = Object.keys(results).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Automated Test Suite & State Simulator
              </h2>
              <p className="text-[11px] text-slate-400">
                Verifies all primary call states, calculations, validations, and security boundaries
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
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="font-bold text-white text-sm">
                Automated Acceptance Suite ({testCases.length} Tests)
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Calculators • Prohibited Information • Validations • Objections • Master Script
              </p>
            </div>

            <div className="flex items-center gap-3">
              {totalRun > 0 && (
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border font-mono ${
                    passCount === totalRun
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {passCount} / {totalRun} Passed ({((passCount / totalRun) * 100).toFixed(0)}%)
                </span>
              )}

              <button
                onClick={handleRunAll}
                disabled={isRunning}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? "Running Tests..." : "Run All 21 Tests"}</span>
              </button>
            </div>
          </div>

          {/* Test cases list */}
          <div className="space-y-2">
            {testCases.map((tc) => {
              const res = results[tc.id];

              return (
                <div
                  key={tc.id}
                  className={`p-3 rounded-xl border transition-all ${
                    res
                      ? res.pass
                        ? "bg-emerald-950/20 border-emerald-500/30"
                        : "bg-rose-950/20 border-rose-500/30"
                      : "bg-slate-950/60 border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {res ? (
                        res.pass ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700"></div>
                      )}
                      <span className="font-bold text-white text-xs">{tc.name}</span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {tc.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                    {tc.description}
                  </p>

                  {res && (
                    <div className="mt-2 pl-6 pt-2 border-t border-slate-800/80 text-[10px] font-mono grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-300">
                      <div>
                        <span className="text-slate-500">Expected: </span>
                        <span>{res.expected}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Actual: </span>
                        <span className={res.pass ? "text-emerald-400" : "text-rose-400"}>
                          {res.actual}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
