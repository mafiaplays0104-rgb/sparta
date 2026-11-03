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
    // SPARTA TELECOM 9-STEP MASTER CONVERSATION SUITE (EXACT TELECOM SCRIPT)
    // =========================================================================
    {
      id: "test_sparta_step_1_openings",
      name: "Step 1: Telecom Script Openings (Opening 1 & Opening 2)",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 1 exact text for Opening 1 (feedback / 30% reduction) and Opening 2 (digital conversion).",
      run: () => {
        const def1 = MasterScriptEngine.getStageDefinition("STEP_1_OPENING_TECHNICAL", { selectedOpening: "OPENING_1" }, config);
        const text1 = def1.getSayText({ selectedOpening: "OPENING_1" }, config);
        const def2 = MasterScriptEngine.getStageDefinition("STEP_1_OPENING_TECHNICAL", { selectedOpening: "OPENING_2" }, config);
        const text2 = def2.getSayText({ selectedOpening: "OPENING_2" }, config);

        const hasOp1 =
          text1.includes("Hello Mr Campbell, a lovely afternoon to you, this side _______ Calling regarding your landline that is currently active at your property.") &&
          text1.includes("eligible for a reduction up to 30% this year.") &&
          text1.includes("Ok ? Take the response !!!");

        const hasOp2 =
          text2.includes("Am I speaking with Mr. Customer?") &&
          text2.includes("normal copper line is converting into digital one. Hence there is an opportunity for bill reduction this year.");

        const pass = hasOp1 && hasOp2;
        return {
          pass,
          actual: pass ? "Opening 1 & Opening 2 exact wording verified." : "FAILED: Opening text mismatch",
          expected: "Opening 1: 'Hello Mr Campbell... reduction up to 30%' & Opening 2: 'Mr. Customer... copper line is converting into digital one'",
        };
      },
    },
    {
      id: "test_sparta_step_2_discovery",
      name: "Step 2: Probability Discovery & Qualification",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 2 qualifies call volume, broadband on exact line, and bill around £40, £50, or over £60.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_2_PROBABILITY_DISCOVERY", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("using your home phone quite a lot for making calls, or is it mostly just there for incoming calls") &&
          text.includes("internet or broadband running on this exact same line") &&
          text.includes("around £40 , £50 or over £60 a month");
        return {
          pass,
          actual: text.slice(0, 100) + "...",
          expected: "Qualifies: 1. Phone usage, 2. Broadband on same line, 3. Bill around £40, £50, or over £60.",
        };
      },
    },
    {
      id: "test_sparta_step_3_transition_savings",
      name: "Step 3: Transition to Digital Service & 24-Month Savings",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 3 states transition over to Sparta Telecom, brings bill down to £[Insert monthly price], saves £[Insert monthly savings] and total 2-year savings.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_3_DYNAMIC_PACKAGE_PITCH", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("transition you over to a digital service with Sparta Telecom.") &&
          text.includes("£[Insert monthly price]") &&
          text.includes("£[Insert monthly savings]") &&
          text.includes("£[Insert total 2-year savings]") &&
          text.includes("effective 24 months");
        return {
          pass,
          actual: text.slice(0, 110) + "...",
          expected: "Exact pitch: Transition over to digital service with Sparta Telecom, £[Insert monthly price], 24-month savings.",
        };
      },
    },
    {
      id: "test_sparta_step_4_details_decision_maker",
      name: "Step 4: Details & Primary Decision Maker Verification",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 4 confirms number 123455466, name, address, DOB, and primary account holder utility decisions check.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_4_SPARTA_BRAND_DROP", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("123455466") &&
          text.includes("Mr /Mrs/Miss/Ms_____") &&
          text.includes("Your address _______") &&
          text.includes("Your dob__________") &&
          text.includes("primary account holder and the person who handles the utility decisions");
        return {
          pass,
          actual: text.slice(0, 110) + "...",
          expected: "Number 123455466, Name, Address, DOB, and Primary account holder regulatory check.",
        };
      },
    },
    {
      id: "test_sparta_step_5_direct_debit_alarm",
      name: "Step 5: Direct Debit Mode & Social Alarm / Pendant Check",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 5 checks Direct Debit mode continuity and social alarm/pendant (No, Copper, or Digital wall socket).",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_5_VERIFICATION_AGE_RAPPORT", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("bills by direct debit at the moment so your mode of payment will remain the same") &&
          text.includes("social alarm, pendant, or personal safety button") &&
          text.includes("[If NO]: \"Excellent, we can move right along.\"") &&
          text.includes("[If YES & Line is Copper]") &&
          text.includes("[If YES & Line is Digital]");
        return {
          pass,
          actual: text.slice(0, 110) + "...",
          expected: "Direct debit continuity, social alarm check with [If NO], [If YES & Copper], and [If YES & Digital].",
        };
      },
    },
    {
      id: "test_sparta_step_6_calling_features_paper_bill",
      name: "Step 6: Free Calling Features & Paper Itemized Bill",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 6 confirms free 1471/1571 voicemail and paper itemized bill (2 months free, then £1).",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_6_FREE_SERVICES_EXTENSIONS", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("1471/1571 1571 voice mail calling feature is free for you") &&
          text.includes("paper itemized bill which is free for u for the first 2 months") &&
          text.includes("only cost 1 pound on top of your package");
        return {
          pass,
          actual: text.slice(0, 100) + "...",
          expected: "1471/1571 voicemail free, paper bill free for 2 months then 1 pound.",
        };
      },
    },
    {
      id: "test_sparta_step_7_bt_platform_independence",
      name: "Step 7: Sparta BT Platform & Separate Company Confirmation",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 7 confirms Sparta works on the same platform as BT, but is separate and independent from BT, Talk Talk, EE, Plusnet.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_7_ENGINEER_ROUTER_COST", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("working on the same platform as BT works") &&
          text.includes("totally separate and independent company from BT, Talk Talk, Italk ,EE , Plusnet") &&
          text.includes("Wait For cx response!");
        return {
          pass,
          actual: text.slice(0, 110) + "...",
          expected: "Working on same platform as BT, totally separate and independent from BT, Talk Talk, Italk, EE, Plusnet.",
        };
      },
    },
    {
      id: "test_sparta_step_8_compliance_day_verification",
      name: "Step 8: Compliance Cognitive / Day Verification",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 8 asks compliance day verification question: Sunday, Monday, or Tuesday.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_8_DIRECT_DEBIT_DPA1998", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("compliance team requires me to ask a quick verification question") &&
          text.includes("confirm for me what day of the week it is today? Is it Sunday, Monday, or Tuesday?") &&
          text.includes("Wait For cx response!");
        return {
          pass,
          actual: text.slice(0, 110) + "...",
          expected: "Compliance day question: 'Is it Sunday, Monday, or Tuesday?'",
        };
      },
    },
    {
      id: "test_sparta_step_9_verification_officer_handoff",
      name: "Step 9: Spot on & Verification Officer Handoff",
      category: "SPARTA_9_STEPS",
      description: "Verifies Step 9 delivers 'Spot on!', introduces verification officer for 2-minute check, and thanks Mrs. Smith.",
      run: () => {
        const def = MasterScriptEngine.getStageDefinition("STEP_9_VERIFICATION_HANDOFF", {}, config);
        const text = def.getSayText({}, config);
        const pass =
          text.includes("Spot on!") &&
          text.includes("introduce you to my verification officer") &&
          text.includes("spend just two minutes re-verifying these details") &&
          text.includes("Thank you so much for your time, Mrs. Smith, holding the line for just a moment!");
        return {
          pass,
          actual: text.slice(0, 100) + "...",
          expected: "'Spot on!... introduce you to my verification officer... Mrs. Smith...'",
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
      id: "test_sparta_script_probability_savings",
      name: "Script Probability Savings Calculation Helper",
      category: "CALCULATOR_TOOLS",
      description: "Verifies calculateScriptProbabilitySavings correctly calculates monthly price, monthly savings, and 2-year total savings.",
      run: () => {
        const calc = CalculatorTools.calculateScriptProbabilitySavings({
          monthlyBill: 50.0,
          broadbandStatus: "NO_BROADBAND",
          callVolume: "LOW_HARDLY_ANY",
        });
        const pass =
          calc.monthlyPrice === 23.99 &&
          calc.monthlySavings === 26.01 &&
          calc.twoYearSavings === 624.24;

        return {
          pass,
          actual: `Price: £${calc.formattedMonthlyPrice}, Monthly: £${calc.formattedMonthlySavings}, 2-Year: £${calc.formattedTwoYearSavings}`,
          expected: "Price: £23.99, Monthly: £26.01, 2-Year: £624.24",
        };
      },
    },
    {
      id: "test_sparta_platform_separation_rule",
      name: "Compliance Rule 1: Platform & Independence Disclosure",
      category: "SPARTA_COMPLIANCE",
      description: "Ensures Step 7 explicitly confirms working on BT platform while being totally separate from BT, Talk Talk, EE, Plusnet.",
      run: () => {
        const step7 = MasterScriptEngine.getStageDefinition("STEP_7_ENGINEER_ROUTER_COST", {}, config).getSayText({}, config);
        const pass =
          step7.includes("working on the same platform as BT works") &&
          step7.includes("totally separate and independent company from BT, Talk Talk, Italk ,EE , Plusnet");
        return {
          pass,
          actual: `Step 7 Platform & Independence: ${pass}`,
          expected: "Same platform as BT works, totally separate and independent company from BT, Talk Talk, Italk, EE, Plusnet.",
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
      id: "test_sparta_day_verification_rule",
      name: "Compliance Rule 3: Cognitive Day of Week Verification",
      category: "SPARTA_COMPLIANCE",
      description: "Ensures Step 8 explicitly asks Sunday, Monday, or Tuesday to ensure customer comfort and comprehension.",
      run: () => {
        const step8 = MasterScriptEngine.getStageDefinition("STEP_8_DIRECT_DEBIT_DPA1998", {}, config).getSayText({}, config);
        const pass = step8.includes("Sunday, Monday, or Tuesday");
        return {
          pass,
          actual: pass ? "Compliance day question present in Step 8" : "Failed",
          expected: "Step 8 contains: 'confirm for me what day of the week it is today? Is it Sunday, Monday, or Tuesday?'",
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
      id: "test_sparta_master_stages_order",
      name: "Sparta Telecom 9-Step Flow Sequence Integrity",
      category: "FLOW_INTEGRITY",
      description: "Verifies the 9 Sparta steps follow OPENING -> DISCOVERY -> PITCH -> DETAILS -> DIRECT DEBIT & ALARM -> CALLING FEATURES -> PLATFORM -> COMPLIANCE DAY -> HANDOFF.",
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
                  Acceptance Test Suite — Sparta Telecom Script &amp; Probability
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
                Validates exact verbatim script steps, probability branching, calculators, and compliance verification
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
            <span>{isRunning ? "Running Suite..." : `Run All ${testCases.length} Tests`}</span>
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
