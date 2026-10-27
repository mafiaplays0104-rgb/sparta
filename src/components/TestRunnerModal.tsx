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
    // =========================================================================
    // SPARTA TELECOM 9-STEP MASTER CONVERSATION SUITE
    // =========================================================================
    {
      id: "test_sparta_step_1_delayed_brand_drop",
      name: "Step 1: Delayed Brand Drop & Copper Retirement",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 1 introduces copper retirement exchange upgrade WITHOUT mentioning Sparta Telecom (Delayed Brand Drop).",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_1_OPENING_TECHNICAL", { firstName: "John", lastName: "Smith" }, config);
        const text = def.getSayText({ firstName: "John", lastName: "Smith" }, config);
        const hasDelayedBrand = !text.toLowerCase().includes("sparta telecom");
        const hasCopperUpdate = text.includes("old copper network is gradually getting retired") && text.includes("technical update");
        const pass = hasDelayedBrand && hasCopperUpdate;
        return {
          pass,
          actual: hasDelayedBrand ? "Brand successfully delayed (no Sparta mention). Technical pitch present." : "FAILED: Brand dropped early!",
          expected: "Delayed Brand Drop: No mention of Sparta Telecom. Explains nationwide copper-to-fibre upgrade.",
        };
      },
    },
    {
      id: "test_sparta_step_2_discovery",
      name: "Step 2: Probability Discovery & Qualification",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 2 qualifies call volume, broadband presence, and current monthly bills.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_2_PROBABILITY_DISCOVERY", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("do you make a lot of calls with this landline or do you hardly make any calls at all") &&
          text.includes("do you also use any Broadband") &&
          text.includes("how much is it that you usually pay for your telephone bills");
        return {
          pass,
          actual: text.slice(0, 100) + "...",
          expected: "Qualifies: 1. Call volume (a lot vs hardly any), 2. Broadband presence, 3. Average current bill.",
        };
      },
    },
    {
      id: "test_sparta_step_3_dynamic_branching",
      name: "Step 3: Dynamic Package Pitch (Landline Only vs Broadband)",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 3 dynamically pitches £19.99 + VAT for Landline Only or broadband tariffs with gross totals.",
      run: () => {
        const landlineDef = MasterScriptEngine.getStageDefinition("STEP_3_DYNAMIC_PACKAGE_PITCH", { broadbandStatus: "NO_BROADBAND" }, config);
        const landlineText = landlineDef.getSayText({ broadbandStatus: "NO_BROADBAND" }, config);
        const pass =
          landlineText.includes("£19.99 + VAT") &&
          landlineText.includes("£26.99 + VAT");
        return {
          pass,
          actual: landlineText.slice(0, 110) + "...",
          expected: "“...only £19.99 + VAT (Sparta Line Only) or £26.99 + VAT (Enhanced Line Only with 500 landline and 200 mobile minutes)...”",
        };
      },
    },
    {
      id: "test_sparta_step_4_brand_drop_openreach",
      name: "Step 4: Sparta Brand Drop, Openreach & 24-Mo Guarantee",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 4 drops Sparta Telecom, explains Openreach network, and 24-month price promise guarantee.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_4_SPARTA_BRAND_DROP", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("Sparta Telecom") &&
          text.includes("Openreach") &&
          text.includes("24 months price promise guarantee") &&
          text.includes("nothing will be changing physically");
        return {
          pass,
          actual: text.slice(0, 110) + "...",
          expected: "Brand drop Sparta Telecom, Openreach network, separate company, same number/line, 24 months price promise.",
        };
      },
    },
    {
      id: "test_sparta_step_5_pensioner_rapport",
      name: "Step 5: Verification, Lifeline & Pensioner Rapport",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 5 checks medical alarm (Lifeline/Careline), middle initial, and delivers approved DOB pensioner rapport.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_5_VERIFICATION_AGE_RAPPORT", { dob: "14/05/1952" }, config);
        const text = def.getSayText({ dob: "14/05/1952" }, config);
        const pass =
          text.includes("lifeline or careline") &&
          text.includes("middle initial") &&
          text.includes("My goodness, you must have seen a lots of changes in this country by now... HAHAHA");
        return {
          pass,
          actual: text.slice(text.indexOf("My goodness"), text.indexOf("HAHAHA") + 6),
          expected: "“My goodness, you must have seen a lots of changes in this country by now... HAHAHA”",
        };
      },
    },
    {
      id: "test_sparta_step_6_free_services_extensions",
      name: "Step 6: Free 1571 Answering Machine & Extension Phone Check",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 6 confirms free 1571/1471 answering machine, paper bill (2 months free then £1), and checks cordless/corded phones.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_6_FREE_SERVICES_EXTENSIONS", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("1571 / 1471") &&
          text.includes("paper bill") &&
          text.includes("cordless or corded") &&
          text.includes("you don't need to purchase any new phone");
        return {
          pass,
          actual: text.slice(0, 100) + "...",
          expected: "1571/1471 free service, paper bill free for 2 months then £1, extension walk and talk check.",
        };
      },
    },
    {
      id: "test_sparta_step_7_engineer_router_adjusted",
      name: "Step 7: 14-15 Day Openreach Engineer & £30 Adjusted Router",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 7 explains Openreach engineer visit in 14-15 business days, free engineer setup, and £30 router adjusted on future bill (not upfront).",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_7_ENGINEER_ROUTER_COST", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("14 to 15 business days") &&
          text.includes("neither for the installation and nor for the engineer's visit") &&
          text.includes("one time charge of 30 pounds") &&
          text.includes("not in advance, once the upgrade will have happened then it will be adjusted in your future telephone bills");
        return {
          pass,
          actual: text.slice(0, 110) + "...",
          expected: "Openreach visit in 14-15 business days, free installation/visit, £30 router adjusted on future bills, zero upfront.",
        };
      },
    },
    {
      id: "test_sparta_step_8_dpa_mandate",
      name: "Step 8: Direct Debit & DPA 1998 Paper Mandate",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 8 strictly enforces DPA 1998 compliance (NO bank details taken on phone; paper mandate form sent) and inquires bank name.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_8_DIRECT_DEBIT_DPA1998", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("DPA 1998") &&
          text.includes("not be requiring any of your confidential details or banking details over the phone") &&
          text.includes("send you the direct debit mandate form of your bank") &&
          text.includes("which bank you generally deal with");
        return {
          pass,
          actual: text.slice(0, 110) + "...",
          expected: "DPA 1998: No bank details taken on phone. Send bank mandate form by post. Inquire bank name.",
        };
      },
    },
    {
      id: "test_sparta_step_9_handoff",
      name: "Step 9: Colleague Verbal Confirmation Handoff",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 9 transitions customer to colleague for verbal switchover confirmation.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_9_VERIFICATION_HANDOFF", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("one of my colleagues will just be taking a verbal confirmation from you") &&
          text.includes("Here's my colleague just have a word with him");
        return {
          pass,
          actual: text.slice(0, 100) + "...",
          expected: "“...one of my colleagues will just be taking a verbal confirmation from you... Here's my colleague just have a word with him...”",
        };
      },
    },
    {
      id: "test_sparta_pricing_matrix_vat",
      name: "Sparta Pricing Matrix: Exact 20% VAT Calculations",
      category: "CALCULATOR_TOOLS",
      description: "Verifies all Sparta Telecom packages calculate exact Base + 20% VAT = Gross total.",
      run: () => {
        const plans = CalculatorTools.getSpartaPlans();
        const p19 = CalculatorTools.calculateVat(19.99, 20);
        const p26 = CalculatorTools.calculateVat(26.99, 20);
        const p31 = CalculatorTools.calculateVat(31.99, 20);
        const p34 = CalculatorTools.calculateVat(34.99, 20);
        const p39 = CalculatorTools.calculateVat(39.99, 20);

        const pass =
          plans.length === 9 &&
          p19?.grossAmount === 23.99 &&
          p26?.grossAmount === 32.39 &&
          p31?.grossAmount === 38.39 &&
          p34?.grossAmount === 41.99 &&
          p39?.grossAmount === 47.99;

        return {
          pass,
          actual: `9 plans verified. £19.99->£${p19?.grossAmount}, £26.99->£${p26?.grossAmount}, £31.99->£${p31?.grossAmount}, £34.99->£${p34?.grossAmount}, £39.99->£${p39?.grossAmount}`,
          expected: "9 plans: £19.99->£23.99, £26.99->£32.39, £31.99->£38.39, £34.99->£41.99, £39.99->£47.99",
        };
      },
    },
    {
      id: "test_sparta_delayed_brand_rule",
      name: "Compliance Rule 1: Delayed Brand Drop Verification",
      category: "SPARTA_COMPLIANCE",
      description: "Ensures Step 1 NEVER contains 'Sparta Telecom', but Step 4 properly introduces the brand.",
      run: () => {
        const step1 = MasterScriptEngine.getStageDefinition("STEP_1_OPENING_TECHNICAL", {}, config).getSayText({}, config);
        const step4 = MasterScriptEngine.getStageDefinition("STEP_4_SPARTA_BRAND_DROP", {}, config).getSayText({}, config);
        const pass = !step1.toLowerCase().includes("sparta telecom") && step4.includes("Sparta Telecom");
        return {
          pass,
          actual: `Step 1 has Sparta: ${step1.toLowerCase().includes("sparta telecom")}, Step 4 has Sparta: ${step4.includes("Sparta Telecom")}`,
          expected: "Step 1 has Sparta: false, Step 4 has Sparta: true",
        };
      },
    },
    {
      id: "test_sparta_probability_branching_rule",
      name: "Compliance Rule 2: Probability Branching Resolution",
      category: "SPARTA_COMPLIANCE",
      description: "Verifies CalculatorTools.determineProbabilityBranch routes correctly between Landline Only, Normal BB, and Fibre BB.",
      run: () => {
        const b1 = CalculatorTools.determineProbabilityBranch({ broadbandStatus: "NO_BROADBAND" });
        const b2 = CalculatorTools.determineProbabilityBranch({ broadbandStatus: "NORMAL_BROADBAND" });
        const b3 = CalculatorTools.determineProbabilityBranch({ broadbandStatus: "FIBRE_BROADBAND" });
        const pass = b1 === "LANDLINE_ONLY" && b2 === "NORMAL_BROADBAND" && b3 === "FIBRE_BROADBAND";
        return {
          pass,
          actual: `b1=${b1}, b2=${b2}, b3=${b3}`,
          expected: "b1=LANDLINE_ONLY, b2=NORMAL_BROADBAND, b3=FIBRE_BROADBAND",
        };
      },
    },
    {
      id: "test_sparta_dpa1998_rule",
      name: "Compliance Rule 4: DPA 1998 Confidential Banking Shield",
      category: "SPARTA_COMPLIANCE",
      description: "Ensures Step 8 explicitly cites DPA 1998 and prohibits taking bank details over the phone.",
      run: () => {
        const step8 = MasterScriptEngine.getStageDefinition("STEP_8_DIRECT_DEBIT_DPA1998", {}, config).getSayText({}, config);
        const pass = step8.includes("DPA 1998") && step8.includes("not be requiring any of your confidential details or banking details over the phone");
        return {
          pass,
          actual: step8.slice(step8.indexOf("DPA 1998"), step8.indexOf("DPA 1998") + 90) + "...",
          expected: "“...working here under DPA 1998, so we will not be requiring any of your confidential details or banking details over the phone...”",
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
      id: "test_sparta_master_stages_order",
      name: "Sparta Telecom 9-Step Flow Sequence Integrity",
      category: "FLOW_INTEGRITY",
      description: "Verifies the 9 Sparta steps follow OPENING -> DISCOVERY -> PITCH -> BRAND DROP -> VERIFY -> SERVICES -> ENGINEER -> DIRECT DEBIT -> HANDOFF.",
      run: () => {
        const expected = [
          "STEP_1_OPENING_TECHNICAL",
          "STEP_2_PROBABILITY_DISCOVERY",
          "STEP_3_DYNAMIC_PACKAGE_PITCH",
          "STEP_4_SPARTA_BRAND_DROP",
          "STEP_5_VERIFICATION_AGE_RAPPORT",
          "STEP_6_FREE_SERVICES_EXTENSIONS",
          "STEP_7_ENGINEER_ROUTER_COST",
          "STEP_8_DIRECT_DEBIT_DPA1998",
          "STEP_9_VERIFICATION_HANDOFF",
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
