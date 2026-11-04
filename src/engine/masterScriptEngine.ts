import {
  MasterStage,
  CustomerRecord,
  OfferConfig,
} from "../types";
import { CalculatorTools } from "./calculatorTools";

export interface StageDefinition {
  stage: MasterStage;
  stageNumber: number;
  stageName: string;
  stepShortTitle: string;
  objective: string;
  getSayText: (customer: CustomerRecord, config: OfferConfig) => string;
  pauseInstruction: string;
  goldenRuleNote?: string;
  quickResponses: {
    label: string;
    actionDescription: string;
    category?: string;
    autoFill?: Partial<CustomerRecord>;
    nextStage?: MasterStage;
    guidance?: string;
  }[];
  why: string;
  complianceWarning?: string;
  requiredFields?: (keyof CustomerRecord)[];
  allowFallback?: boolean;
  fallbackText?: string;
  nextStage: MasterStage;
  prevStage?: MasterStage;
}

// Active 6-section stages (displayed in progress bar)
export const STAGES_LIST: MasterStage[] = [
  "SECTION_1_OPENING_HOOK",
  "SECTION_2_PROBABILITY_PLANS",
  "SECTION_3_SPARTA_BRAND_NETWORK",
  "SECTION_4_SAFETY_ACCOUNT_CHECKS",
  "SECTION_5_DATA_PROTECTION_DIRECT_DEBIT",
  "SECTION_6_COMPLIANCE_HANDOFF",
];

export class MasterScriptEngine {
  /**
   * Returns Mr/Mrs [LastName] or falls back gracefully
   */
  public static getCustomerDisplayName(customer: CustomerRecord): string {
    const prefix = customer.title || "Mr / Mrs";
    if (customer.lastName) return `${prefix} ${customer.lastName}`;
    if (customer.firstName) return customer.firstName;
    return "[Customer Name]";
  }

  /**
   * Returns agent name from record or placeholder
   */
  public static getAgentName(customer: CustomerRecord, config: OfferConfig): string {
    return customer.agentName || config.advisorName || "[Agent Name]";
  }

  /**
   * Saves figure text e.g. "£48.00"
   */
  public static fmtGBP(amount?: number): string {
    if (!amount) return "£__.__";
    return `£${amount.toFixed(2)}`;
  }

  /**
   * Calculate monthly savings vs current bill for a plan gross price
   */
  public static calcMonthlySaving(currentBill: number | undefined, planGross: number): string {
    if (!currentBill) return "£__.__";
    const saving = currentBill - planGross;
    return saving > 0 ? `£${saving.toFixed(2)}` : "£0.00";
  }

  /**
   * Calculate 2-year total savings
   */
  public static calc2YearSaving(currentBill: number | undefined, planGross: number): string {
    if (!currentBill) return "£__.__";
    const saving = (currentBill - planGross) * 24;
    return saving > 0 ? `£${saving.toFixed(2)}` : "£0.00";
  }

  /**
   * Build the probability branch plan text depending on broadband status
   */
  public static getProbabilityPlanText(customer: CustomerRecord): string {
    const name = MasterScriptEngine.getCustomerDisplayName(customer);
    const bill = customer.monthlyBill;
    const branch = customer.broadbandStatus;

    if (!branch || branch === "NO_BROADBAND") {
      // PROBABILITY A
      const p1Gross = 23.99;
      const p2Gross = 32.39;
      const saving1Mo = MasterScriptEngine.calcMonthlySaving(bill, p1Gross);
      const saving1Yr = MasterScriptEngine.calc2YearSaving(bill, p1Gross);
      const saving2Mo = MasterScriptEngine.calcMonthlySaving(bill, p2Gross);
      const saving2Yr = MasterScriptEngine.calc2YearSaving(bill, p2Gross);

      return (
        `[PROBABILITY A — Landline Only / No Broadband]\n\n` +
        `Agent: Based on what you've told me, ${name}, we can transition your landline over to a digital service with Sparta Telecom. ` +
        `This keeps your exact same phone handset and same telephone number completely unchanged.\n\n` +
        `Agent: We have two great options for you:\n\n` +
        `  ➤ Option 1 — Sparta Line Only\n` +
        `    Just £19.99 + VAT (approx. £23.99/mo total) for line rental on the digital network.\n` +
        (bill ? `    Your saving: ${saving1Mo}/month • ${saving1Yr} over 24 months.\n\n` : `\n`) +
        `  ➤ Option 2 — Enhanced Line Only Plan\n` +
        `    £26.99 + VAT (approx. £32.39/mo total) — line rental plus 500 landline minutes and 200 mobile minutes built in.\n` +
        (bill ? `    Your saving: ${saving2Mo}/month • ${saving2Yr} over 24 months.\n\n` : `\n`) +
        `Agent: This brings your bill down nicely with a 2-year price freeze so your rate never increases. ` +
        `Over the 24-month agreement, that adds up to solid savings back in your pocket. Hope that sounds good to you?`
      );
    }

    if (branch === "NORMAL_BROADBAND") {
      // PROBABILITY B
      const p1Gross = 32.39;
      const p2Gross = 38.39;
      const saving1Mo = MasterScriptEngine.calcMonthlySaving(bill, p1Gross);
      const saving1Yr = MasterScriptEngine.calc2YearSaving(bill, p1Gross);
      const saving2Mo = MasterScriptEngine.calcMonthlySaving(bill, p2Gross);
      const saving2Yr = MasterScriptEngine.calc2YearSaving(bill, p2Gross);

      return (
        `[PROBABILITY B — Landline + Normal Broadband (Up to 24Mbps)]\n\n` +
        `Agent: Based on what you've told me, ${name}, we can transition both your landline and standard broadband over to a digital service with Sparta Telecom. ` +
        `This keeps your exact same phone number and line completely unchanged.\n\n` +
        `Agent: We have two great plans here:\n\n` +
        `  ➤ Sparta Line Only + Normal Broadband\n` +
        `    £26.99 + VAT (approx. £32.39/mo total) — speeds up to 24Mbps and 500 landline minutes.\n` +
        (bill ? `    Your saving: ${saving1Mo}/month • ${saving1Yr} over 24 months.\n\n` : `\n`) +
        `  ➤ Sparta Talk Unlimited + Normal Broadband\n` +
        `    £31.99 + VAT (approx. £38.39/mo total) — speeds up to 24Mbps, 1,000 landline minutes, and 500 mobile minutes.\n` +
        (bill ? `    Your saving: ${saving2Mo}/month • ${saving2Yr} over 24 months.\n\n` : `\n`) +
        `Agent: This lowers your monthly bill and locks your price for two full years with zero price hikes. ` +
        `Over the 2-year term, that gives you substantial savings. Hope that sounds good to you?`
      );
    }

    // PROBABILITY C — Fibre
    const p1Gross = 38.39;
    const p2Gross = 41.99;
    const p3Gross = 44.39;
    const saving1Mo = MasterScriptEngine.calcMonthlySaving(bill, p1Gross);
    const saving1Yr = MasterScriptEngine.calc2YearSaving(bill, p1Gross);
    const saving2Mo = MasterScriptEngine.calcMonthlySaving(bill, p2Gross);
    const saving2Yr = MasterScriptEngine.calc2YearSaving(bill, p2Gross);
    const saving3Mo = MasterScriptEngine.calcMonthlySaving(bill, p3Gross);
    const saving3Yr = MasterScriptEngine.calc2YearSaving(bill, p3Gross);

    return (
      `[PROBABILITY C — Landline + Fibre Broadband (Fibre 40 / 80)]\n\n` +
      `Agent: Based on what you've told me, ${name}, we can transition your high-speed fibre broadband and landline over to a digital service with Sparta Telecom with zero interruption.\n\n` +
      `Agent: We have fantastic fibre packages for you:\n\n` +
      `  ➤ Sparta Talk + Fibre 40\n` +
      `    £31.99 + VAT (approx. £38.39/mo total) — Fibre 40 speed and 500 landline minutes.\n` +
      (bill ? `    Your saving: ${saving1Mo}/month • ${saving1Yr} over 24 months.\n\n` : `\n`) +
      `  ➤ Sparta Unlimited + F40 (Enhanced)\n` +
      `    £34.99 + VAT (approx. £41.99/mo total) — Fibre 40 speed, 500 landline minutes, 200 mobile minutes, and a free engineer visit.\n` +
      (bill ? `    Your saving: ${saving2Mo}/month • ${saving2Yr} over 24 months.\n\n` : `\n`) +
      `  ➤ Sparta Talk Fibre 80 / Sparta Unlimited + F80\n` +
      `    £36.99 to £39.99 + VAT (approx. £44.39 to £47.99/mo total) — ultra-fast 80Mbps fibre speed.\n` +
      (bill ? `    Your saving: ${saving3Mo}/month • ${saving3Yr} over 24 months.\n\n` : `\n`) +
      `Agent: This gives you higher reliability and speed while protecting you with a 24-month fixed-price guarantee. Hope that sounds good to you?`
    );
  }

  /**
   * Format a concise service summary for verification
   */
  public static getServiceSummary(customer: CustomerRecord): string {
    const parts: string[] = [];
    if (customer.monthlyBill) {
      parts.push(`paying around £${customer.monthlyBill.toFixed(2)}/month`);
    }
    if (customer.broadbandStatus) {
      parts.push(`Broadband: ${customer.broadbandStatus.replace(/_/g, " ")}`);
    }
    if (customer.callVolume) {
      parts.push(`Calls: ${customer.callVolume}`);
    }
    return parts.length > 0 ? parts.join(", ") : "active telephone line";
  }

  /**
   * Master stage definition — 6 sections matching the official Sparta Telecom script
   */
  public static getStageDefinition(
    stage: MasterStage,
    customer: CustomerRecord,
    config: OfferConfig
  ): StageDefinition {
    const name = MasterScriptEngine.getCustomerDisplayName(customer);
    const agentName = MasterScriptEngine.getAgentName(customer, config);
    const bill = customer.monthlyBill;
    const billText = bill ? `£${bill.toFixed(2)}` : "£__.__";
    const lastName = customer.lastName || "[Customer Last Name]";

    switch (stage) {
      // ================================================================
      // SECTION 1 — THE OPENING HOOK
      // ================================================================
      case "SECTION_1_OPENING_HOOK":
      case "STEP_1_OPENING_TECHNICAL":
      case "PHASE_1_INTRODUCTION":
      case "STAGE_1_OPENING":
        return {
          stage: "SECTION_1_OPENING_HOOK",
          stageNumber: 1,
          stageName: "Section 1: The Opening Hook",
          stepShortTitle: "Opening Hook",
          objective:
            "Introduce yourself, confirm the customer, explain the digital upgrade opportunity, and qualify call usage, broadband, and current bill.",
          goldenRuleNote:
            "Enter the customer's name and agent name above first — the script will personalise automatically. Ask all 3 qualifying questions in order.",
          getSayText: (cust, cfg) => {
            const a = MasterScriptEngine.getAgentName(cust, cfg);
            const ln = cust.lastName || "[Customer Last Name]";
            const fn = MasterScriptEngine.getCustomerDisplayName(cust);
            return (
              `Agent: Hello... yeah hiii, am I speaking to Mr/Mrs ${ln}?\n\n` +
              `Cx: Yeah.\n\n` +
              `Agent: Hello ${fn}, a lovely afternoon to you! This is ${a} calling regarding your landline that is currently active at your property.\n\n` +
              `Agent: I just wanted to update you that your phone line is eligible for a digital upgrade and a bill reduction of up to 30% this year. As you are probably aware, across the UK, traditional copper lines are being phased out and replaced by modern digital lines connected to your local exchange.\n\n` +
              `────────────────────────────────────────\n` +
              `🔍 QUALIFYING QUESTIONS (ask in order):\n` +
              `────────────────────────────────────────\n\n` +
              `Agent: To make sure I look at the right options for you, may I know — do you use your home phone quite a lot for making calls, or is it mostly just there for incoming calls?\n\n` +
              `(Wait for customer response)\n\n` +
              `Agent: And do you also have your internet or broadband running on this exact same line?\n\n` +
              `(Wait for customer response)\n\n` +
              `Agent: Perfect, thank you. To ensure our digital packages make sense for you financially, could you give me a rough idea of what you currently pay each month for your phone bill? Is it around £40, £50, or over £60 a month, or perhaps a bit more or less than that?\n\n` +
              `(Wait for customer response — enter the amount in the Bill field on the left)`
            );
          },
          pauseInstruction:
            "Listen carefully and log the customer's call usage, broadband status, and monthly bill using the Quick Response buttons below.",
          quickResponses: [
            {
              label: "📞 Mostly incoming calls — No broadband",
              actionDescription: "Landline only. Set Probability A.",
              autoFill: {
                callVolume: "LOW_HARDLY_ANY",
                broadbandStatus: "NO_BROADBAND",
                probabilityBranch: "A",
              },
              nextStage: "SECTION_2_PROBABILITY_PLANS",
              guidance: "Proceed to Section 2 → Probability A plans.",
            },
            {
              label: "📞 Regular calls + Normal Broadband (up to 24Mbps)",
              actionDescription: "Normal broadband bundle. Set Probability B.",
              autoFill: {
                callVolume: "HIGH_FREQUENT",
                broadbandStatus: "NORMAL_BROADBAND",
                probabilityBranch: "B",
              },
              nextStage: "SECTION_2_PROBABILITY_PLANS",
              guidance: "Proceed to Section 2 → Probability B plans.",
            },
            {
              label: "🚀 Regular calls + Fibre Broadband (40/80Mbps)",
              actionDescription: "Fibre broadband bundle. Set Probability C.",
              autoFill: {
                callVolume: "HIGH_FREQUENT",
                broadbandStatus: "FIBRE_BROADBAND",
                probabilityBranch: "C",
              },
              nextStage: "SECTION_2_PROBABILITY_PLANS",
              guidance: "Proceed to Section 2 → Probability C plans.",
            },
            {
              label: "⚠️ Customer confused about bill / provider",
              actionDescription: "Note confusion and proceed patiently with approximate figures.",
              autoFill: { billOrProviderConfused: true },
              guidance: "Take note, pace slowly, and use approximate figures.",
            },
          ],
          why:
            "The opening hook establishes rapport and collects the three key qualification signals (call usage, broadband, bill) that determine which Probability branch to present.",
          nextStage: "SECTION_2_PROBABILITY_PLANS",
        };

      // ================================================================
      // SECTION 2 — PROBABILITY & DYNAMIC PLAN SELECTION
      // ================================================================
      case "SECTION_2_PROBABILITY_PLANS":
      case "STEP_2_PROBABILITY_DISCOVERY":
      case "STEP_3_DYNAMIC_PACKAGE_PITCH":
      case "PHASE_2_TRANSITION_HOOK":
      case "PHASE_3_BUNDLE_PRICE_GUARANTEE":
      case "STAGE_4_CURRENT_SERVICE":
      case "STAGE_5_CURRENT_BILL":
      case "STAGE_6_EXPLAINING_REDUCTION":
        return {
          stage: "SECTION_2_PROBABILITY_PLANS",
          stageNumber: 2,
          stageName: "Section 2: Probability & Dynamic Plan Selection",
          stepShortTitle: "Plan Selection",
          objective:
            "Present the correct Probability (A / B / C) plans based on the customer's broadband status, with live savings calculated from their actual bill.",
          goldenRuleNote:
            bill
              ? `💰 Customer's current bill: ${billText}/mo. Savings are auto-calculated below.`
              : "⚠️ Enter the customer's monthly bill in the left panel to auto-calculate savings.",
          getSayText: (cust) => MasterScriptEngine.getProbabilityPlanText(cust),
          pauseInstruction:
            "Hope that sounds good to you? (Wait for customer response — if they ask about savings, quote the calculated figures above.)",
          quickResponses: [
            {
              label: "✅ Customer: 'Sounds good' / 'Okay' — Probability A (Landline Only)",
              actionDescription: "Customer accepts Probability A landline-only plans.",
              autoFill: {
                broadbandStatus: "NO_BROADBAND",
                probabilityBranch: "A",
                selectedPlanId: "sparta_line_only",
                termsUnderstood: true,
                pricePromiseAcknowledged: true,
              },
              nextStage: "SECTION_3_SPARTA_BRAND_NETWORK",
              guidance: "Proceed to Section 3 — Sparta Brand & Network Pitch.",
            },
            {
              label: "✅ Customer: 'Sounds good' / 'Okay' — Probability B (Normal BB)",
              actionDescription: "Customer accepts Probability B normal broadband plans.",
              autoFill: {
                broadbandStatus: "NORMAL_BROADBAND",
                probabilityBranch: "B",
                selectedPlanId: "sparta_line_normal_bb",
                termsUnderstood: true,
                pricePromiseAcknowledged: true,
              },
              nextStage: "SECTION_3_SPARTA_BRAND_NETWORK",
              guidance: "Proceed to Section 3 — Sparta Brand & Network Pitch.",
            },
            {
              label: "✅ Customer: 'Sounds good' / 'Okay' — Probability C (Fibre)",
              actionDescription: "Customer accepts Probability C fibre broadband plans.",
              autoFill: {
                broadbandStatus: "FIBRE_BROADBAND",
                probabilityBranch: "C",
                selectedPlanId: "sparta_talk_fibre_40",
                termsUnderstood: true,
                pricePromiseAcknowledged: true,
              },
              nextStage: "SECTION_3_SPARTA_BRAND_NETWORK",
              guidance: "Proceed to Section 3 — Sparta Brand & Network Pitch.",
            },
            {
              label: "❓ 'How much will I save exactly?'",
              actionDescription: "Quote monthly and 2-year savings from the script above.",
              guidance: bill
                ? `Quote the saving figures shown in the script text above based on ${billText}/mo current bill.`
                : "Enter the customer's current monthly bill first to auto-calculate savings.",
            },
            {
              label: "🔄 Change Probability Branch",
              actionDescription: "Go back to Section 1 to re-qualify.",
              nextStage: "SECTION_1_OPENING_HOOK",
              guidance: "Return to qualifying questions to re-establish broadband status.",
            },
          ],
          why:
            "Presenting the right probability plan with auto-calculated personal savings maximises relevance and closes the value proposition.",
          nextStage: "SECTION_3_SPARTA_BRAND_NETWORK",
          prevStage: "SECTION_1_OPENING_HOOK",
        };

      // ================================================================
      // SECTION 3 — SPARTA TELECOM BRAND & NETWORK PITCH
      // ================================================================
      case "SECTION_3_SPARTA_BRAND_NETWORK":
      case "STEP_4_SPARTA_BRAND_DROP":
      case "STEP_7_ENGINEER_ROUTER_COST":
      case "PHASE_4_HARDWARE_INSTALLATION":
        return {
          stage: "SECTION_3_SPARTA_BRAND_NETWORK",
          stageNumber: 3,
          stageName: "Section 3: Sparta Telecom Brand & Network Pitch",
          stepShortTitle: "Brand & Network",
          objective:
            "Explain that Sparta works on the Openreach platform (same as BT, TalkTalk, EE, Plusnet) but is a totally independent provider — no physical change needed, 24-month price promise.",
          goldenRuleNote:
            "Confirm Sparta is on the Openreach wholesale network. Emphasise zero physical change, same number, same line, 24-month legally fixed price.",
          getSayText: () =>
            `Agent: All of these savings and digital services are coming to you on the same line, on your same number, without changing anything physically, courtesy of Sparta Telecom.\n\n` +
            `Agent: And Sparta Telecom, BT, TalkTalk, iTalk, EE, Plusnet — we all work on the exact same infrastructure platform, which is Openreach. I'm sure you've come across Openreach before?\n\n` +
            `(Wait for customer response)\n\n` +
            `Agent: Exactly! However, we are a totally separate and independent service provider. Because Sparta operates on the Openreach wholesale network, there is no physical change needed inside your home. Your billing simply transfers over to Sparta Telecom so your line and broadband can successfully upgrade to digital, while bringing your monthly bills down.\n\n` +
            `Agent: Plus, under your agreement, you get a 24-month price promise guarantee, meaning for the next two full years your monthly package rate is legally fixed and won't increase under any circumstances.`,
          pauseInstruction:
            "Wait for customer response after the Openreach question. Confirm they understand the independent provider status.",
          quickResponses: [
            {
              label: "✅ Customer: 'Understood' / 'Okay' / Acknowledges",
              actionDescription: "Customer understands Sparta is independent on the Openreach platform.",
              autoFill: {
                spartaBtPlatformAcknowledged: true,
                brandDropAcknowledged: true,
                pricePromiseAcknowledged: true,
              },
              nextStage: "SECTION_4_SAFETY_ACCOUNT_CHECKS",
              guidance: "Proceed to Section 4 — Safety & Account Holder Checks.",
            },
          ],
          why:
            "Clear platform disclosure satisfies regulatory transparency obligations and eliminates brand confusion between Sparta and BT/TalkTalk.",
          nextStage: "SECTION_4_SAFETY_ACCOUNT_CHECKS",
          prevStage: "SECTION_2_PROBABILITY_PLANS",
        };

      // ================================================================
      // SECTION 4 — COMPLIANT SAFETY & ACCOUNT HOLDER CHECKS
      // ================================================================
      case "SECTION_4_SAFETY_ACCOUNT_CHECKS":
      case "STEP_5_VERIFICATION_AGE_RAPPORT":
      case "STEP_6_FREE_SERVICES_EXTENSIONS":
      case "STAGE_2_VERIFICATION_ID":
      case "STAGE_3_VERIFICATION_COMPLETED":
        return {
          stage: "SECTION_4_SAFETY_ACCOUNT_CHECKS",
          stageNumber: 4,
          stageName: "Section 4: Compliant Safety & Account Holder Checks",
          stepShortTitle: "Safety & Account Check",
          objective:
            "Confirm primary account holder, conduct medical alarm / pendant safety check, and explain free calling features and paper bill terms.",
          goldenRuleNote:
            "If alarm is digital, verify whether it plugs into the internet router or a standard electrical wall socket. Must confirm primary account holder.",
          getSayText: (cust) => {
            const n = MasterScriptEngine.getCustomerDisplayName(cust);
            return (
              `[PRIMARY ACCOUNT HOLDER]\n\n` +
              `Agent: Now, just to confirm under standard regulatory guidelines, ${n} — are you the primary account holder or the person who makes the utility decisions for this household?\n\n` +
              `(Wait for customer response)\n\n` +
              `────────────────────────────────────────\n` +
              `[MEDICAL ALARMS / PENDANTS]\n` +
              `────────────────────────────────────────\n\n` +
              `Agent: Your personal safety is very important to us during this digital switchover. Do you currently use any type of social alarm, careline pendant, personal emergency button, or medical alarm plugged into your phone line?\n\n` +
              `  ➤ If NO: "Excellent, that makes things very straightforward."\n\n` +
              `  ➤ If YES: "Thank you for letting me know. To ensure your safety device remains 100% operational, our engineering team coordinates the line migration so there is zero loss of protection, keeping your lifeline active at all times."\n\n` +
              `────────────────────────────────────────\n` +
              `[FREE CALLING FEATURES & PAPER BILLS]\n` +
              `────────────────────────────────────────\n\n` +
              `Agent: You also get calling features like 1471 and 1571 voicemail included as a free feature.\n\n` +
              `Agent: We will also send you a paper itemized bill which is free for your first 2 months. Afterwards, if you wish to keep receiving paper bills, it is only £1 a month on top of your package, and you have the right to cancel paper billing at any time you choose.`
            );
          },
          pauseInstruction:
            "Listen carefully for account holder confirmation and alarm status before proceeding.",
          quickResponses: [
            {
              label: "✅ Primary Account Holder Confirmed + No Alarm",
              actionDescription: "Customer is primary decision maker. No social alarm in use.",
              autoFill: {
                isPrimaryAccountHolder: true,
                handlesUtilityDecisions: true,
                personalDetailsConfirmed: true,
                socialAlarmStatus: "NO",
                medicalAlarm: false,
                callingFeaturesConfirmed: true,
                paperBillConfirmed: true,
              },
              nextStage: "SECTION_5_DATA_PROTECTION_DIRECT_DEBIT",
              guidance: "Proceed to Section 5 — Data Protection & Direct Debit.",
            },
            {
              label: "✅ Primary Account Holder Confirmed + Alarm (Copper Line)",
              actionDescription: "Customer is primary decision maker. Alarm on copper line — will transition smoothly.",
              autoFill: {
                isPrimaryAccountHolder: true,
                handlesUtilityDecisions: true,
                socialAlarmStatus: "YES_COPPER",
                medicalAlarm: true,
                callingFeaturesConfirmed: true,
                paperBillConfirmed: true,
              },
              nextStage: "SECTION_5_DATA_PROTECTION_DIRECT_DEBIT",
              guidance: "Engineering team will ensure smooth transition. Proceed to Section 5.",
            },
            {
              label: "✅ Primary Account Holder Confirmed + Alarm (Wall Socket / Digital)",
              actionDescription: "Alarm plugs into electrical wall socket — safe to proceed.",
              autoFill: {
                isPrimaryAccountHolder: true,
                handlesUtilityDecisions: true,
                socialAlarmStatus: "YES_DIGITAL_SOCKET",
                medicalAlarm: true,
                callingFeaturesConfirmed: true,
                paperBillConfirmed: true,
              },
              nextStage: "SECTION_5_DATA_PROTECTION_DIRECT_DEBIT",
              guidance: "Electrical socket confirmed safe. Proceed to Section 5.",
            },
            {
              label: "❌ Not Primary Decision Maker",
              actionDescription: "Customer does not handle utility decisions for this household.",
              autoFill: {
                isPrimaryAccountHolder: false,
                handlesUtilityDecisions: false,
              },
              guidance:
                "Ask when the primary account holder is available to speak and schedule a callback.",
            },
          ],
          why:
            "Regulatory compliance and customer safety require confirming the account holder and checking alarm compatibility before digital migration.",
          nextStage: "SECTION_5_DATA_PROTECTION_DIRECT_DEBIT",
          prevStage: "SECTION_3_SPARTA_BRAND_NETWORK",
        };

      // ================================================================
      // SECTION 5 — DATA PROTECTION (UK GDPR / DPA) & DIRECT DEBIT RIGHTS
      // ================================================================
      case "SECTION_5_DATA_PROTECTION_DIRECT_DEBIT":
      case "STEP_8_DIRECT_DEBIT_DPA1998":
        return {
          stage: "SECTION_5_DATA_PROTECTION_DIRECT_DEBIT",
          stageNumber: 5,
          stageName: "Section 5: Data Protection (UK GDPR / DPA) & Direct Debit Rights",
          stepShortTitle: "Data Protection & DD",
          objective:
            "Confirm Direct Debit stays the same, explain UK GDPR compliance (no bank details over phone), and ask which bank to send the mandate form to.",
          goldenRuleNote:
            "We do NOT take bank details over the telephone — only ask which bank to post the mandate form to.",
          getSayText: () =>
            `[DIRECT DEBIT EXPLANATION & UK GDPR / DPA]\n\n` +
            `Agent: As you currently pay your bills via Direct Debit, your secure payment method stays exactly the same with Sparta Telecom.\n\n` +
            `Agent: Under Data Protection regulations — UK GDPR and the Data Protection Act — we do not take any confidential bank details over the telephone today. Instead, your current provider will issue your final statement, any advance payments will be refunded to you, and we will send out an official Direct Debit Mandate form specifically for your bank, so you remain in full control of setting up the new instruction.\n\n` +
            `Agent: And just so we send you the correct banking mandate form — which bank do you usually deal with?\n\n` +
            `(Customer names their bank, e.g., Barclays, Lloyds, NatWest)`,
          pauseInstruction:
            "Wait for customer to name their bank. Log the bank name using the Quick Response buttons below.",
          quickResponses: [
            {
              label: "🏦 Barclays",
              actionDescription: "Customer banks with Barclays.",
              autoFill: { bankName: "Barclays", dpaMandateFormRequested: true, paymentMethod: "DIRECT_DEBIT" },
              nextStage: "SECTION_6_COMPLIANCE_HANDOFF",
              guidance: "Bank noted. Proceed to Section 6 — Compliance & Verification Handoff.",
            },
            {
              label: "🏦 Lloyds Bank",
              actionDescription: "Customer banks with Lloyds.",
              autoFill: { bankName: "Lloyds Bank", dpaMandateFormRequested: true, paymentMethod: "DIRECT_DEBIT" },
              nextStage: "SECTION_6_COMPLIANCE_HANDOFF",
              guidance: "Bank noted. Proceed to Section 6.",
            },
            {
              label: "🏦 NatWest",
              actionDescription: "Customer banks with NatWest.",
              autoFill: { bankName: "NatWest", dpaMandateFormRequested: true, paymentMethod: "DIRECT_DEBIT" },
              nextStage: "SECTION_6_COMPLIANCE_HANDOFF",
              guidance: "Bank noted. Proceed to Section 6.",
            },
            {
              label: "🏦 HSBC UK",
              actionDescription: "Customer banks with HSBC.",
              autoFill: { bankName: "HSBC UK", dpaMandateFormRequested: true, paymentMethod: "DIRECT_DEBIT" },
              nextStage: "SECTION_6_COMPLIANCE_HANDOFF",
              guidance: "Bank noted. Proceed to Section 6.",
            },
            {
              label: "🏦 Halifax",
              actionDescription: "Customer banks with Halifax.",
              autoFill: { bankName: "Halifax", dpaMandateFormRequested: true, paymentMethod: "DIRECT_DEBIT" },
              nextStage: "SECTION_6_COMPLIANCE_HANDOFF",
              guidance: "Bank noted. Proceed to Section 6.",
            },
            {
              label: "🏦 Santander",
              actionDescription: "Customer banks with Santander.",
              autoFill: { bankName: "Santander", dpaMandateFormRequested: true, paymentMethod: "DIRECT_DEBIT" },
              nextStage: "SECTION_6_COMPLIANCE_HANDOFF",
              guidance: "Bank noted. Proceed to Section 6.",
            },
            {
              label: "🏦 Nationwide",
              actionDescription: "Customer banks with Nationwide.",
              autoFill: { bankName: "Nationwide Building Society", dpaMandateFormRequested: true, paymentMethod: "DIRECT_DEBIT" },
              nextStage: "SECTION_6_COMPLIANCE_HANDOFF",
              guidance: "Bank noted. Proceed to Section 6.",
            },
            {
              label: "🏦 Other Bank (type manually)",
              actionDescription: "Customer named a different bank — enter manually in the customer panel.",
              autoFill: { dpaMandateFormRequested: true, paymentMethod: "DIRECT_DEBIT" },
              nextStage: "SECTION_6_COMPLIANCE_HANDOFF",
              guidance: "Enter the bank name manually in the customer record. Proceed to Section 6.",
            },
          ],
          why:
            "UK GDPR / DPA compliance requires that no bank details be taken verbally. The mandate form process keeps the customer in full control.",
          nextStage: "SECTION_6_COMPLIANCE_HANDOFF",
          prevStage: "SECTION_4_SAFETY_ACCOUNT_CHECKS",
        };

      // ================================================================
      // SECTION 6 — COMPLIANCE CHECK & VERIFICATION HANDOFF
      // ================================================================
      case "SECTION_6_COMPLIANCE_HANDOFF":
      case "STEP_9_VERIFICATION_HANDOFF":
      case "PHASE_5_VERIFICATION_CLOSING":
      case "STAGE_7_FINAL_CONFIRMATION":
      case "STAGE_8_BEFORE_AGREEMENT":
      case "STAGE_9_CUSTOMER_DECISION":
      default:
        return {
          stage: "SECTION_6_COMPLIANCE_HANDOFF",
          stageNumber: 6,
          stageName: "Section 6: Compliance Check & Verification Handoff",
          stepShortTitle: "Compliance & Handoff",
          objective:
            "Conduct the capacity / cognitive day-of-week check, then hand off to the verification officer.",
          goldenRuleNote:
            `Thank the customer by name (${name}) and hold the line for the verification officer. The day check is compliance-required.`,
          getSayText: (cust, cfg) => {
            const a = MasterScriptEngine.getAgentName(cust, cfg);
            const n = MasterScriptEngine.getCustomerDisplayName(cust);
            return (
              `[CAPACITY & COGNITIVE CHECK]\n\n` +
              `Agent: Wonderful! To wrap things up, our compliance team requires me to ask a quick question just to ensure we've taken our time today and that everything discussed is completely clear. Just for the record, could you confirm for me what day of the week it is today? Is it Sunday, Monday, or Tuesday?\n\n` +
              `(Wait for customer response)\n\n` +
              `Agent: Spot on! That's just to confirm we've had a clear, comfortable conversation today and that you are 100% satisfied with how everything has been explained.\n\n` +
              `────────────────────────────────────────\n` +
              `[VERIFICATION OFFICER HANDOFF]\n` +
              `────────────────────────────────────────\n\n` +
              `Agent: I'm now going to introduce you to my verification officer. They will spend just two minutes re-verifying these details to confirm your exact details and lock in your discounted rate. Thank you so much for your time, ${n}, please hold the line for just a moment!\n\n` +
              `— Agent ${a} hands over to Verification Officer —`
            );
          },
          pauseInstruction:
            "Listen for the customer's day-of-week answer, confirm 'Spot on!', then introduce the verification officer.",
          quickResponses: [
            {
              label: "✅ Customer answered day correctly — Handoff to Verification Officer",
              actionDescription:
                "Day confirmed. Lead completed — connect to verification officer for 2-minute reverification.",
              autoFill: {
                isDayVerified: true,
                finalConfirmationGiven: true,
                customerDecision: "YES",
                verificationOfficerHandoff: true,
              },
              guidance:
                "🎉 Lead successfully completed! Connect the call to the verification officer now.",
            },
            {
              label: "⚠️ Customer uncertain / confused about day",
              actionDescription: "Customer seemed uncertain — note for compliance review.",
              autoFill: { isDayVerified: false },
              guidance:
                "Re-ask gently: 'No worries! Could you have another go — is it closer to the start of the week or the end?'",
            },
          ],
          complianceWarning:
            "The day-of-week cognitive check is a mandatory compliance requirement. Do not skip it.",
          why:
            "The cognitive comfort check ensures the customer is lucid and comfortable before the 2-minute verification officer reverification.",
          nextStage: "SECTION_6_COMPLIANCE_HANDOFF",
          prevStage: "SECTION_5_DATA_PROTECTION_DIRECT_DEBIT",
        };
    }
  }
}
