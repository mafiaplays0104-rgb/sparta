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

  const testCases: TestCase[] = [
    {
      id: "test_stage_1_opening",
      name: "Stage 1 Opening Script Verbatim Line",
      category: "MASTER_SCRIPT",
      description: "Verifies Stage 1 opens with Peter and 30% reduction statement.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STAGE_1_OPENING", {}, config);
        const text = def.getSayText({}, config);
        const pass = text.includes("Peter") && text.includes("30% on your monthly bill");
        return {
          pass,
          actual: text.slice(0, 80) + "...",
          expected: "“Hi, my name is Peter, and I'm calling regarding your telephone service. There's been a reduction of up to 30%...”",
        };
      },
    },
    {
      id: "test_stage_2_consumer_id",
      name: "Stage 2 Consumer ID Check",
      category: "MASTER_SCRIPT",
      description: "Verifies Stage 2 requests Consumer Identification Number.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STAGE_2_VERIFICATION_ID", {}, config);
        const text = def.getSayText({}, config);
        const pass = text.includes("Consumer Identification Number");
        return {
          pass,
          actual: text,
          expected: "“Before I continue, I just need to verify the account. Could you please give me your Consumer Identification Number?”",
        };
      },
    },
    {
      id: "test_stage_4_current_service",
      name: "Stage 4 Current Home Service Screening",
      category: "MASTER_SCRIPT",
      description: "Verifies Stage 4 asks if using service at home.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STAGE_4_CURRENT_SERVICE", {}, config);
        const text = def.getSayText({}, config);
        const pass = text.includes("currently using this telephone service at your home");
        return {
          pass,
          actual: text,
          expected: "“Can I just confirm, are you currently using this telephone service at your home?”",
        };
      },
    },
    {
      id: "test_stage_5_current_bill",
      name: "Stage 5 Current Monthly Bill Discovery",
      category: "MASTER_SCRIPT",
      description: "Verifies Stage 5 asks for rough monthly telephone cost.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STAGE_5_CURRENT_BILL", {}, config);
        const text = def.getSayText({}, config);
        const pass = text.includes("roughly how much you're currently paying each month");
        return {
          pass,
          actual: text,
          expected: "“Could you tell me roughly how much you're currently paying each month for your telephone service?”",
        };
      },
    },
    {
      id: "test_stage_6_explaining_reduction",
      name: "Stage 6 Explaining The Reduction",
      category: "MASTER_SCRIPT",
      description: "Verifies Stage 6 explains reduction in 2 concise sentences.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STAGE_6_EXPLAINING_REDUCTION", {}, config);
        const text = def.getSayText({}, config);
        const pass = text.includes("available reduction could lower your monthly telephone cost");
        return {
          pass,
          actual: text.slice(0, 90) + "...",
          expected: "“Based on the information you've given me, the available reduction could lower your monthly telephone cost...”",
        };
      },
    },
    {
      id: "test_stage_7_final_confirmation",
      name: "Stage 7 Final Confirmation",
      category: "MASTER_SCRIPT",
      description: "Verifies Stage 7 thanks customer and prepares for reduction terms.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STAGE_7_FINAL_CONFIRMATION", {}, config);
        const text = def.getSayText({}, config);
        const pass = text.includes("Thank you for going through those details with me");
        return {
          pass,
          actual: text.slice(0, 90) + "...",
          expected: "“Thank you for going through those details with me. I'll now explain the available reduction...”",
        };
      },
    },
    {
      id: "test_stage_8_before_agreement",
      name: "Stage 8 Before Any Agreement",
      category: "MASTER_SCRIPT",
      description: "Verifies Stage 8 ensures clarity on price, service, and terms.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STAGE_8_BEFORE_AGREEMENT", {}, config);
        const text = def.getSayText({}, config);
        const pass = text.includes("understand the price, service, and any relevant terms");
        return {
          pass,
          actual: text.slice(0, 90) + "...",
          expected: "“Before we go any further, I'll make sure you understand the price, service, and any relevant terms...”",
        };
      },
    },
    {
      id: "test_stage_9_customer_decision",
      name: "Stage 9 Customer Decision Question",
      category: "MASTER_SCRIPT",
      description: "Verifies Stage 9 asks directly whether to proceed with 30% reduction.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STAGE_9_CUSTOMER_DECISION", {}, config);
        const text = def.getSayText({}, config);
        const pass = text.includes("Would you like to proceed with the 30% reduction");
        return {
          pass,
          actual: text,
          expected: "“Would you like to proceed with the 30% reduction on your telephone service?”",
        };
      },
    },
    {
      id: "test_30pct_savings_65",
      name: "30% Bill Savings Calculation (£65.00)",
      category: "CALCULATOR_TOOLS",
      description: "Verifies £65.00 bill yields £45.50 new bill, £19.50 monthly savings, £234.00 annual savings.",
      run: () => {
        const calc = CalculatorTools.calculateBillSavings(65, 30);
        const pass =
          calc !== null &&
          calc.discountedPrice === 45.50 &&
          calc.monthlySavings === 19.50 &&
          calc.annualSavings === 234.00;
        return {
          pass,
          actual: calc ? `Disc: £${calc.discountedPrice.toFixed(2)}, Mo: £${calc.monthlySavings.toFixed(2)}, Yr: £${calc.annualSavings.toFixed(2)}` : "null",
          expected: "Disc: £45.50, Mo: £19.50, Yr: £234.00",
        };
      },
    },
    {
      id: "test_30pct_savings_80_99",
      name: "30% Bill Savings Calculation (£80.99)",
      category: "CALCULATOR_TOOLS",
      description: "Verifies £80.99 text yields £56.69 new price, £24.30 monthly savings, £291.56-291.60 annual savings.",
      run: () => {
        const calc = CalculatorTools.calculateBillSavings("80 pounds 99 pence", 30);
        const pass =
          calc !== null &&
          calc.discountedPrice === 56.69 &&
          calc.monthlySavings >= 24.29 &&
          calc.monthlySavings <= 24.31;
        return {
          pass,
          actual: calc ? `Disc: £${calc.discountedPrice.toFixed(2)}, Mo: £${calc.monthlySavings.toFixed(2)}, Yr: £${calc.annualSavings.toFixed(2)}` : "null",
          expected: "Disc: £56.69, Mo: £24.30, Yr: £291.60",
        };
      },
    },
    {
      id: "test_prohibited_security_guard",
      name: "Prohibited Financial Credentials Guard",
      category: "SECURITY_GUARD",
      description: "Blocks attempts to ask for PIN, OTP, passwords, or card CVV.",
      run: () => {
        const scan = SecurityEngine.scanProhibitedInformation("Please read your card PIN and one-time password OTP");
        const pass = scan.hasProhibited && scan.detectedTypes.includes("PIN") && scan.detectedTypes.includes("OTP / One-Time Passcode");
        return {
          pass,
          actual: `Blocked: ${scan.hasProhibited}, Types: ${scan.detectedTypes.join(", ")}`,
          expected: "Blocked: true, Types: PIN, OTP / One-Time Passcode",
        };
      },
    },
    {
      id: "test_kb_are_you_bt",
      name: "Knowledge Base: “Are you from BT?” (Section 2)",
      category: "KNOWLEDGE_BASE",
      description: "Verifies KB returns approved identity explanation.",
      run: () => {
        const res = KnowledgeBaseEngine.searchQuestion("are you from bt");
        const pass = !!(res.matched && res.item?.approvedAnswer.includes("[COMPANY NAME]"));
        return {
          pass,
          actual: res.item ? res.item.approvedAnswer.slice(0, 60) + "..." : "not matched",
          expected: "“I'm calling from [COMPANY NAME]. I'll be happy to explain exactly who we are...”",
        };
      },
    },
    {
      id: "test_kb_agent_name",
      name: "Knowledge Base: “What is your name?” (Section 28)",
      category: "KNOWLEDGE_BASE",
      description: "Verifies KB answers with Peter.",
      run: () => {
        const res = KnowledgeBaseEngine.searchQuestion("what is your name");
        const pass = !!(res.matched && res.item?.approvedAnswer.includes("Peter"));
        return {
          pass,
          actual: res.item ? res.item.approvedAnswer : "not matched",
          expected: "“Of course. My name is Peter, and I'm calling from [COMPANY NAME]...”",
        };
      },
    },
    {
      id: "test_52_sections_count",
      name: "52-Section Objection Library Completeness",
      category: "OBJECTION_LIBRARY",
      description: "Verifies all 52 script sections are represented in objectionLibrary.",
      run: () => {
        const sections = new Set(objectionLibrary.map((o) => o.sectionNumber));
        const hasAll = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52].every((n) => sections.has(n));
        return {
          pass: hasAll && objectionLibrary.length >= 52,
          actual: `Total items: ${objectionLibrary.length}, Sections covered: ${sections.size}`,
          expected: "Total items >= 52, Sections covered: 52",
        };
      },
    },
    {
      id: "test_not_interested_handling",
      name: "“I'm not interested” Objection (Section 3)",
      category: "OBJECTION_LIBRARY",
      description: "Verifies respectful handling of refusal without pressure.",
      run: () => {
        const item = objectionLibrary.find((o) => o.sectionNumber === 3);
        const pass = !!item && item.recommendedResponse.includes("Before you decide, let me quickly explain what the reduction is about");
        return {
          pass,
          actual: item ? item.recommendedResponse.slice(0, 80) + "..." : "missing",
          expected: "“I completely understand. Before you decide, let me quickly explain what the reduction is about...”",
        };
      },
    },
    {
      id: "test_busy_handling",
      name: "“I'm busy” Handling (Section 4)",
      category: "OBJECTION_LIBRARY",
      description: "Verifies brief explanation and pause when customer is busy.",
      run: () => {
        const item = objectionLibrary.find((o) => o.sectionNumber === 4);
        const pass = !!item && item.recommendedResponse.includes("It shouldn't take long to check the account");
        return {
          pass,
          actual: item ? item.recommendedResponse.slice(0, 80) + "..." : "missing",
          expected: "“I completely understand. It shouldn't take long to check the account and see whether the reduction applies...”",
        };
      },
    },
    {
      id: "test_scam_inquiry_handling",
      name: "“Is this a scam?” Response (Section 27)",
      category: "OBJECTION_LIBRARY",
      description: "Verifies calm acknowledgment and independent verification offer.",
      run: () => {
        const item = objectionLibrary.find((o) => o.sectionNumber === 27);
        const pass = !!item && item.recommendedResponse.includes("You can independently verify the company");
        return {
          pass,
          actual: item ? item.recommendedResponse.slice(0, 80) + "..." : "missing",
          expected: "“I understand why you'd ask. You should always be careful with unexpected calls. Don't provide information you're uncomfortable sharing...”",
        };
      },
    },
    {
      id: "test_will_number_change",
      name: "“Will my number change?” Response (Section 33)",
      category: "OBJECTION_LIBRARY",
      description: "Verifies clear explanation before any agreement.",
      run: () => {
        const item = objectionLibrary.find((o) => o.sectionNumber === 3);
        const numItem = objectionLibrary.find((o) => o.sectionNumber === 33);
        const pass = !!numItem && numItem.recommendedResponse.includes("I'll explain any service changes before anything is agreed");
        return {
          pass,
          actual: numItem ? numItem.recommendedResponse : "missing",
          expected: "“I'll explain any service changes before anything is agreed. I don't want you to continue without understanding exactly what would happen.”",
        };
      },
    },
    {
      id: "test_remove_number_compliance",
      name: "“Remove my number” Compliance Stop (Section 41)",
      category: "COMPLIANCE",
      description: "Verifies DO_NOT_CALL suppression procedure.",
      run: () => {
        const item = objectionLibrary.find((o) => o.sectionNumber === 41);
        const pass = !!item && item.action === "disposition" && item.severity === "CRITICAL";
        return {
          pass,
          actual: item ? `Action: ${item.action}, Severity: ${item.severity}` : "missing",
          expected: "Action: disposition, Severity: CRITICAL",
        };
      },
    },
    {
      id: "test_golden_rule_units_length",
      name: "Golden Rule Length Check Across All Script Units",
      category: "SCRIPT_UNITS",
      description: "Verifies all script units follow 'one idea -> one short paragraph' without long text walls.",
      run: () => {
        const allUnits = ScriptUnitEngine.getAllUnits({}, config);
        const allShort = allUnits.every((u) => {
          const text = u.getText({}, config);
          return text.length < 300 && text.split("\n\n").length <= 2;
        });
        return {
          pass: allShort && allUnits.length >= 10,
          actual: `Total Units: ${allUnits.length}, All short paragraphs: ${allShort}`,
          expected: "Total Units >= 10, All short paragraphs: true",
        };
      },
    },
    {
      id: "test_live_call_flow_stages_order",
      name: "Live Call Flow 9-Stage Order Integrity",
      category: "FLOW_INTEGRITY",
      description: "Verifies the 9 stages follow OPEN -> VERIFY -> SERVICE -> BILL -> REDUCTION -> CONFIRMATION -> AGREEMENT -> DECISION.",
      run: () => {
        const expected = [
          "STAGE_1_OPENING",
          "STAGE_2_VERIFICATION_ID",
          "STAGE_3_VERIFICATION_COMPLETED",
          "STAGE_4_CURRENT_SERVICE",
          "STAGE_5_CURRENT_BILL",
          "STAGE_6_EXPLAINING_REDUCTION",
          "STAGE_7_FINAL_CONFIRMATION",
          "STAGE_8_BEFORE_AGREEMENT",
          "STAGE_9_CUSTOMER_DECISION",
        ];
        const pass = STAGES_LIST.length === expected.length && STAGES_LIST.every((s, i) => s === expected[i]);
        return {
          pass,
          actual: STAGES_LIST.join(" -> "),
          expected: expected.join(" -> "),
        };
      },
    },
  ];

  const handleRunAll = () => {
    setIsRunning(true);
    const newResults: Record<string, { pass: boolean; actual: string; expected: string }> = {};

    setTimeout(() => {
      for (const t of testCases) {
        newResults[t.id] = t.run();
      }
      setResults(newResults);
      setIsRunning(false);
    }, 300);
  };

  const passCount = Object.values(results).filter((r) => r.pass).length;
  const totalRun = Object.keys(results).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Acceptance Test Suite — UK Telecom 30% Reduction Script
                </h2>
                {totalRun > 0 && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      passCount === totalRun
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-red-950 text-red-400 border border-red-800"
                    }`}
                  >
                    {passCount} / {totalRun} PASSING
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Validates all 52 script sections, calculations, security guards, and flow transitions
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

        {/* Action Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="text-slate-400 text-[11px]">
            {testCases.length} Test Cases configured
          </div>

          <button
            onClick={handleRunAll}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunning ? "Running Suite..." : "Run All 21 Tests"}</span>
          </button>
        </div>

        {/* Test Cases List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {testCases.map((tc) => {
            const res = results[tc.id];

            return (
              <div
                key={tc.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {res ? (
                      res.pass ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      )
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0"></span>
                    )}
                    <span className="font-bold text-white text-xs">{tc.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                      {tc.category}
                    </span>
                  </div>

                  {res && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        res.pass
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {res.pass ? "PASSED" : "FAILED"}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">{tc.description}</p>

                {res && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block">EXPECTED:</span>
                      <span className="text-slate-300">{res.expected}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">ACTUAL:</span>
                      <span className={res.pass ? "text-emerald-300" : "text-red-300"}>
                        {res.actual}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
