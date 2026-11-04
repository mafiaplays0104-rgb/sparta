import { MasterStage, CustomerRecord, OfferConfig } from "../types";
import { MasterScriptEngine } from "./masterScriptEngine";

export interface ScriptUnit {
  id: string;
  stage: MasterStage;
  stageNumber: number;
  stageName: string;
  unitIndex: number;
  totalUnitsInStage: number;
  getText: (customer: CustomerRecord, config: OfferConfig) => string;
  expectedCustomerReply?: string;
  subNote?: string;
  isPauseAndListen: boolean;
  inputType?:
    | "NONE"
    | "BILL_INPUT"
    | "VAT_CALCULATOR"
    | "DOB_INPUT"
    | "CUSTOMER_ID_INPUT"
    | "MOBILE_INPUT"
    | "ALARM_SELECT"
    | "TV_INPUT"
    | "CHOICE";
  quickOptions?: {
    label: string;
    action: (customer: CustomerRecord, onUpdate: (u: Partial<CustomerRecord>) => void) => void;
  }[];
}

export class ScriptUnitEngine {
  /**
   * Generates all interactive units for the 6-Section Sparta Telecom Script
   * with dynamic customer name, agent name, bill amount, and probability branch
   */
  public static getAllUnits(customer: CustomerRecord, config: OfferConfig): ScriptUnit[] {
    const units: ScriptUnit[] = [
      // =====================================================================
      // SECTION 1 — THE OPENING HOOK  (3 sub-units)
      // =====================================================================
      {
        id: "s1_u1",
        stage: "SECTION_1_OPENING_HOOK",
        stageNumber: 1,
        stageName: "The Opening Hook",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: (cust, cfg) => {
          const agentName = MasterScriptEngine.getAgentName(cust, cfg);
          const lastName = cust.lastName || "[Customer Last Name]";
          const displayName = MasterScriptEngine.getCustomerDisplayName(cust);
          return (
            `Agent: Hello... yeah hiii, am I speaking to Mr/Mrs ${lastName}?\n\n` +
            `Cx: Yeah.\n\n` +
            `Agent: Hello ${displayName}, a lovely afternoon to you! This is ${agentName} calling regarding your landline that is currently active at your property.\n\n` +
            `Agent: I just wanted to update you that your phone line is eligible for a digital upgrade and a bill reduction of up to 30% this year. As you are probably aware, across the UK, traditional copper lines are being phased out and replaced by modern digital lines connected to your local exchange.`
          );
        },
        expectedCustomerReply: "Yeah / Okay / Go ahead",
        subNote: "🎯 TIP: Enter the customer's Last Name and your Agent Name in the left panel before the call — the script will personalise automatically.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "✅ Customer: 'Yeah' / 'Okay' (Proceed)",
            action: (_c, onUpdate) => onUpdate({ personalDetailsConfirmed: true }),
          },
        ],
      },
      {
        id: "s1_u2",
        stage: "SECTION_1_OPENING_HOOK",
        stageNumber: 1,
        stageName: "The Opening Hook",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: () =>
          `Agent: To make sure I look at the right options for you, may I know — do you use your home phone quite a lot for making calls, or is it mostly just there for incoming calls?\n\n` +
          `(Wait for customer response)\n\n` +
          `Agent: And do you also have your internet or broadband running on this exact same line?\n\n` +
          `(Wait for customer response)`,
        expectedCustomerReply: "Customer describes their usage and broadband situation",
        subNote: "Discovery Q1 & Q2: Call usage + broadband status. Log using the Quick Options below.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "📞 Mostly incoming calls — No broadband (Prob A)",
            action: (_c, onUpdate) =>
              onUpdate({
                callVolume: "LOW_HARDLY_ANY",
                landlineUsage: "INCOMING_ONLY",
                broadbandStatus: "NO_BROADBAND",
                billIncludesBroadband: false,
                probabilityBranch: "A",
              }),
          },
          {
            label: "📞 Regular calls + Normal Broadband (up to 24Mbps) (Prob B)",
            action: (_c, onUpdate) =>
              onUpdate({
                callVolume: "HIGH_FREQUENT",
                landlineUsage: "HIGH",
                broadbandStatus: "NORMAL_BROADBAND",
                billIncludesBroadband: true,
                probabilityBranch: "B",
              }),
          },
          {
            label: "🚀 Regular calls + Fibre Broadband (40/80Mbps) (Prob C)",
            action: (_c, onUpdate) =>
              onUpdate({
                callVolume: "HIGH_FREQUENT",
                landlineUsage: "HIGH",
                broadbandStatus: "FIBRE_BROADBAND",
                billIncludesBroadband: true,
                probabilityBranch: "C",
              }),
          },
        ],
      },
      {
        id: "s1_u3",
        stage: "SECTION_1_OPENING_HOOK",
        stageNumber: 1,
        stageName: "The Opening Hook",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () =>
          `Agent: Perfect, thank you. To ensure our digital packages make sense for you financially, could you give me a rough idea of what you currently pay each month for your phone bill? Is it around £40, £50, or over £60 a month, or perhaps a bit more or less than that?\n\n` +
          `(Wait for customer response — enter the exact amount in the Monthly Bill field on the left)`,
        expectedCustomerReply: "Customer states their approximate monthly bill",
        subNote: "Discovery Q3: Current monthly bill amount. Enter the exact figure on the left panel — savings auto-calculate instantly.",
        isPauseAndListen: true,
        inputType: "BILL_INPUT",
        quickOptions: [
          {
            label: "Around £40/mo",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 40.0, billApproximate: true }),
          },
          {
            label: "Around £50/mo",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 50.0, billApproximate: true }),
          },
          {
            label: "Around £60/mo",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 60.0, billApproximate: true }),
          },
          {
            label: "Over £70/mo",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 72.0, billApproximate: true }),
          },
          {
            label: "⚠️ Customer confused about bill / provider",
            action: (_c, onUpdate) => onUpdate({ billOrProviderConfused: true }),
          },
        ],
      },

      // =====================================================================
      // SECTION 2 — PROBABILITY & DYNAMIC PLAN SELECTION  (1 unit, dynamic text)
      // =====================================================================
      {
        id: "s2_u1",
        stage: "SECTION_2_PROBABILITY_PLANS",
        stageNumber: 2,
        stageName: "Probability & Dynamic Plan Selection",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: (cust) => MasterScriptEngine.getProbabilityPlanText(cust),
        expectedCustomerReply: "Hope that sounds good to you? (Wait for customer response)",
        subNote: "Script auto-selects Probability A / B / C based on broadband status and calculates exact savings from the customer's bill entered in Section 1.",
        isPauseAndListen: true,
        inputType: "VAT_CALCULATOR",
        quickOptions: [
          {
            label: "✅ Customer: 'Sounds good' — Probability A (Landline Only)",
            action: (_c, onUpdate) =>
              onUpdate({
                broadbandStatus: "NO_BROADBAND",
                probabilityBranch: "A",
                selectedPlanId: "sparta_line_only",
                termsUnderstood: true,
                pricePromiseAcknowledged: true,
              }),
          },
          {
            label: "✅ Customer: 'Sounds good' — Probability B (Normal BB)",
            action: (_c, onUpdate) =>
              onUpdate({
                broadbandStatus: "NORMAL_BROADBAND",
                probabilityBranch: "B",
                selectedPlanId: "sparta_line_normal_bb",
                termsUnderstood: true,
                pricePromiseAcknowledged: true,
              }),
          },
          {
            label: "✅ Customer: 'Sounds good' — Probability C (Fibre)",
            action: (_c, onUpdate) =>
              onUpdate({
                broadbandStatus: "FIBRE_BROADBAND",
                probabilityBranch: "C",
                selectedPlanId: "sparta_talk_fibre_40",
                termsUnderstood: true,
                pricePromiseAcknowledged: true,
              }),
          },
          {
            label: "❓ 'How much will I save?' (Quote figures from script above)",
            action: () => {},
          },
        ],
      },

      // =====================================================================
      // SECTION 3 — SPARTA BRAND & NETWORK PITCH  (2 units)
      // =====================================================================
      {
        id: "s3_u1",
        stage: "SECTION_3_SPARTA_BRAND_NETWORK",
        stageNumber: 3,
        stageName: "Sparta Telecom Brand & Network Pitch",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `Agent: All of these savings and digital services are coming to you on the same line, on your same number, without changing anything physically, courtesy of Sparta Telecom.\n\n` +
          `Agent: And Sparta Telecom, BT, TalkTalk, iTalk, EE, Plusnet — we all work on the exact same infrastructure platform, which is Openreach. I'm sure you've come across Openreach before?\n\n` +
          `(Wait for customer response)`,
        expectedCustomerReply: "Yes / I've heard of them",
        subNote: "Confirm Openreach shared platform. Wait for acknowledgement before continuing.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✅ Customer: 'Yes' / Acknowledges Openreach",
            action: (_c, onUpdate) => onUpdate({ brandDropAcknowledged: true }),
          },
        ],
      },
      {
        id: "s3_u2",
        stage: "SECTION_3_SPARTA_BRAND_NETWORK",
        stageNumber: 3,
        stageName: "Sparta Telecom Brand & Network Pitch",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `Agent: Exactly! However, we are a totally separate and independent service provider. Because Sparta operates on the Openreach wholesale network, there is no physical change needed inside your home. Your billing simply transfers over to Sparta Telecom so your line and broadband can successfully upgrade to digital, while bringing your monthly bills down.\n\n` +
          `Agent: Plus, under your agreement, you get a 24-month price promise guarantee, meaning for the next two full years your monthly package rate is legally fixed and won't increase under any circumstances.`,
        expectedCustomerReply: "Okay / That's good to know",
        subNote: "Independent provider + zero physical change + 24-month price promise.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✅ Customer: 'Understood' / 'Okay'",
            action: (_c, onUpdate) =>
              onUpdate({ spartaBtPlatformAcknowledged: true, pricePromiseAcknowledged: true }),
          },
        ],
      },

      // =====================================================================
      // SECTION 4 — SAFETY & ACCOUNT HOLDER CHECKS  (3 units)
      // =====================================================================
      {
        id: "s4_u1",
        stage: "SECTION_4_SAFETY_ACCOUNT_CHECKS",
        stageNumber: 4,
        stageName: "Compliant Safety & Account Holder Checks",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: (cust) => {
          const name = MasterScriptEngine.getCustomerDisplayName(cust);
          return (
            `[PRIMARY ACCOUNT HOLDER]\n\n` +
            `Agent: Now, just to confirm under standard regulatory guidelines, ${name} — are you the primary account holder or the person who makes the utility decisions for this household?\n\n` +
            `(Wait for customer response)`
          );
        },
        expectedCustomerReply: "Yes, I am",
        subNote: "Must confirm primary account holder status before proceeding.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "✅ Yes — Primary Account Holder & Decision Maker",
            action: (_c, onUpdate) =>
              onUpdate({
                isPrimaryAccountHolder: true,
                handlesUtilityDecisions: true,
                personalDetailsConfirmed: true,
              }),
          },
          {
            label: "❌ Not the Primary Decision Maker",
            action: (_c, onUpdate) =>
              onUpdate({ isPrimaryAccountHolder: false, handlesUtilityDecisions: false }),
          },
        ],
      },
      {
        id: "s4_u2",
        stage: "SECTION_4_SAFETY_ACCOUNT_CHECKS",
        stageNumber: 4,
        stageName: "Compliant Safety & Account Holder Checks",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: () =>
          `[MEDICAL ALARMS / PENDANTS]\n\n` +
          `Agent: Your personal safety is very important to us during this digital switchover. Do you currently use any type of social alarm, careline pendant, personal emergency button, or medical alarm plugged into your phone line?\n\n` +
          `  ➤ If NO: "Excellent, that makes things very straightforward."\n\n` +
          `  ➤ If YES: "Thank you for letting me know. To ensure your safety device remains 100% operational, our engineering team coordinates the line migration so there is zero loss of protection, keeping your lifeline active at all times."`,
        expectedCustomerReply: "No alarm / Yes with copper / Yes with digital socket",
        subNote: "Safety check: If alarm is digital, verify it plugs into an electrical wall socket (not router).",
        isPauseAndListen: true,
        inputType: "ALARM_SELECT",
        quickOptions: [
          {
            label: "✅ No alarm — 'Excellent, straightforward'",
            action: (_c, onUpdate) => onUpdate({ socialAlarmStatus: "NO", medicalAlarm: false }),
          },
          {
            label: "⚠️ Yes — Copper line alarm (transitions smoothly)",
            action: (_c, onUpdate) => onUpdate({ socialAlarmStatus: "YES_COPPER", medicalAlarm: true }),
          },
          {
            label: "⚠️ Yes — Digital, plugs into electrical wall socket (safe)",
            action: (_c, onUpdate) => onUpdate({ socialAlarmStatus: "YES_DIGITAL_SOCKET", medicalAlarm: true }),
          },
        ],
      },
      {
        id: "s4_u3",
        stage: "SECTION_4_SAFETY_ACCOUNT_CHECKS",
        stageNumber: 4,
        stageName: "Compliant Safety & Account Holder Checks",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () =>
          `[FREE CALLING FEATURES & PAPER BILLS]\n\n` +
          `Agent: You also get calling features like 1471 and 1571 voicemail included as a free feature.\n\n` +
          `Agent: We will also send you a paper itemized bill which is free for your first 2 months. Afterwards, if you wish to keep receiving paper bills, it is only £1 a month on top of your package, and you have the right to cancel paper billing at any time you choose.`,
        expectedCustomerReply: "Okay / Thank you",
        subNote: "Free 1471/1571 voicemail. Paper bill: free for 2 months, then only £1, deactivate anytime.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✅ Customer Acknowledges Free Features & Paper Bill",
            action: (_c, onUpdate) => onUpdate({ callingFeaturesConfirmed: true, paperBillConfirmed: true }),
          },
        ],
      },

      // =====================================================================
      // SECTION 5 — DATA PROTECTION (UK GDPR / DPA) & DIRECT DEBIT  (2 units)
      // =====================================================================
      {
        id: "s5_u1",
        stage: "SECTION_5_DATA_PROTECTION_DIRECT_DEBIT",
        stageNumber: 5,
        stageName: "Data Protection (UK GDPR / DPA) & Direct Debit Rights",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `[DIRECT DEBIT EXPLANATION & UK GDPR / DPA]\n\n` +
          `Agent: As you currently pay your bills via Direct Debit, your secure payment method stays exactly the same with Sparta Telecom.\n\n` +
          `Agent: Under Data Protection regulations — UK GDPR and the Data Protection Act — we do not take any confidential bank details over the telephone today. Instead, your current provider will issue your final statement, any advance payments will be refunded to you, and we will send out an official Direct Debit Mandate form specifically for your bank, so you remain in full control of setting up the new instruction.`,
        expectedCustomerReply: "Okay / That's fine",
        subNote: "No bank details taken over the phone — this is a UK GDPR / DPA compliance requirement.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✅ Customer: 'Okay' / Confirms Direct Debit",
            action: (_c, onUpdate) => onUpdate({ paymentMethod: "DIRECT_DEBIT", dpaMandateFormRequested: true }),
          },
        ],
      },
      {
        id: "s5_u2",
        stage: "SECTION_5_DATA_PROTECTION_DIRECT_DEBIT",
        stageNumber: 5,
        stageName: "Data Protection (UK GDPR / DPA) & Direct Debit Rights",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `Agent: And just so we send you the correct banking mandate form — which bank do you usually deal with?\n\n` +
          `(Customer names their bank, e.g., Barclays, Lloyds, NatWest)`,
        expectedCustomerReply: "Customer names their bank",
        subNote: "Log the bank name using the Quick Options below so the correct mandate form can be sent.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "🏦 Barclays",
            action: (_c, onUpdate) => onUpdate({ bankName: "Barclays" }),
          },
          {
            label: "🏦 Lloyds Bank",
            action: (_c, onUpdate) => onUpdate({ bankName: "Lloyds Bank" }),
          },
          {
            label: "🏦 NatWest",
            action: (_c, onUpdate) => onUpdate({ bankName: "NatWest" }),
          },
          {
            label: "🏦 HSBC UK",
            action: (_c, onUpdate) => onUpdate({ bankName: "HSBC UK" }),
          },
          {
            label: "🏦 Halifax",
            action: (_c, onUpdate) => onUpdate({ bankName: "Halifax" }),
          },
          {
            label: "🏦 Santander",
            action: (_c, onUpdate) => onUpdate({ bankName: "Santander" }),
          },
          {
            label: "🏦 Nationwide",
            action: (_c, onUpdate) => onUpdate({ bankName: "Nationwide Building Society" }),
          },
          {
            label: "🏦 TSB",
            action: (_c, onUpdate) => onUpdate({ bankName: "TSB" }),
          },
          {
            label: "🏦 Other (enter manually in left panel)",
            action: (_c, onUpdate) => onUpdate({ dpaMandateFormRequested: true }),
          },
        ],
      },

      // =====================================================================
      // SECTION 6 — COMPLIANCE CHECK & VERIFICATION HANDOFF  (2 units)
      // =====================================================================
      {
        id: "s6_u1",
        stage: "SECTION_6_COMPLIANCE_HANDOFF",
        stageNumber: 6,
        stageName: "Compliance Check & Verification Handoff",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `[CAPACITY & COGNITIVE CHECK]\n\n` +
          `Agent: Wonderful! To wrap things up, our compliance team requires me to ask a quick question just to ensure we've taken our time today and that everything discussed is completely clear. Just for the record, could you confirm for me what day of the week it is today? Is it Sunday, Monday, or Tuesday?\n\n` +
          `(Wait for customer response)`,
        expectedCustomerReply: "Customer names the day of the week",
        subNote: "⚠️ MANDATORY COMPLIANCE: This cognitive check is required. Do not skip.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "✅ Customer answered day correctly — 'Spot on!'",
            action: (_c, onUpdate) => onUpdate({ isDayVerified: true }),
          },
          {
            label: "⚠️ Customer uncertain / confused about day",
            action: (_c, onUpdate) => onUpdate({ isDayVerified: false }),
          },
        ],
      },
      {
        id: "s6_u2",
        stage: "SECTION_6_COMPLIANCE_HANDOFF",
        stageNumber: 6,
        stageName: "Compliance Check & Verification Handoff",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: (cust, cfg) => {
          const agentName = MasterScriptEngine.getAgentName(cust, cfg);
          const name = MasterScriptEngine.getCustomerDisplayName(cust);
          return (
            `Agent: Spot on! That's just to confirm we've had a clear, comfortable conversation today and that you are 100% satisfied with how everything has been explained.\n\n` +
            `[VERIFICATION OFFICER HANDOFF]\n\n` +
            `Agent: I'm now going to introduce you to my verification officer. They will spend just two minutes re-verifying these details to confirm your exact details and lock in your discounted rate. Thank you so much for your time, ${name}, please hold the line for just a moment!\n\n` +
            `— Agent ${agentName} hands over to Verification Officer —`
          );
        },
        expectedCustomerReply: "Thank you / Holding on",
        subNote: "🎉 LEAD COMPLETE — Connect the call to the verification officer now.",
        isPauseAndListen: false,
        quickOptions: [
          {
            label: "🎉 Lead Completed — Handoff to Verification Officer",
            action: (_c, onUpdate) =>
              onUpdate({
                finalConfirmationGiven: true,
                customerDecision: "YES",
                verificationOfficerHandoff: true,
              }),
          },
        ],
      },
    ];

    return units;
  }
}
