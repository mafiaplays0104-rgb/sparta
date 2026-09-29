import { MasterStage, CustomerRecord, OfferConfig } from "../types";
import { STAGES_LIST, MasterScriptEngine } from "./masterScriptEngine";

export interface ScriptUnit {
  id: string;
  stage: MasterStage;
  stageNumber: number;
  stageName: string;
  unitIndex: number;
  totalUnitsInStage: number;
  getText: (customer: CustomerRecord, config: OfferConfig) => string;
  subNote?: string;
  isPauseAndListen: boolean;
  inputType?: "NONE" | "BILL_INPUT" | "DOB_INPUT" | "CUSTOMER_ID_INPUT" | "MOBILE_INPUT" | "ALARM_SELECT" | "TV_INPUT" | "CHOICE";
  quickOptions?: {
    label: string;
    action: (customer: CustomerRecord, onUpdate: (u: Partial<CustomerRecord>) => void) => void;
  }[];
}

export class ScriptUnitEngine {
  /**
   * Generates all units across all 11 stages with exact master script text
   */
  public static getAllUnits(customer: CustomerRecord, config: OfferConfig): ScriptUnit[] {
    const greeting = MasterScriptEngine.getTimeGreeting();
    const custName = MasterScriptEngine.getCustomerDisplayName(customer);
    const amountStr = customer.monthlyBill ? customer.monthlyBill.toFixed(2) : "[AMOUNT]";
    const doorNum = customer.doorNumber || "[NUMBER]";
    const postcodeStr = customer.postcode || "[POSTCODE]";
    const contactNum = customer.contactNumber || customer.mobileNumber || "[NUMBER]";
    const firstName = customer.firstName || "[NAME]";
    const surname = customer.lastName || "[SURNAME]";
    const addressStr = customer.address || (customer.doorNumber && customer.street ? `${customer.doorNumber} ${customer.street}` : "[ADDRESS]");
    const serviceSummary = MasterScriptEngine.getServiceSummary(customer);

    const units: ScriptUnit[] = [
      // ==========================================
      // STAGE 1 — OPENING
      // ==========================================
      {
        id: "s1_u1",
        stage: "STAGE_1_OPENING",
        stageNumber: 1,
        stageName: "Opening",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () => `“${greeting}.\nAm I speaking with ${custName}?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Yes, speaking",
            action: () => {},
          },
          {
            label: "Wrong Person",
            action: (_c, onUpdate) => {
              onUpdate({ title: "Wrong Person" });
            },
          },
        ],
      },
      {
        id: "s1_u2",
        stage: "STAGE_1_OPENING",
        stageNumber: 1,
        stageName: "Opening",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: () => `“Hi, my name is Alex, and I’m calling regarding your phone services. How are you doing today?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Doing well / Fine",
            action: () => {},
          },
          {
            label: "Busy / Call Later",
            action: () => {},
          },
          {
            label: "Not Interested",
            action: () => {},
          },
        ],
      },
      {
        id: "s1_u3",
        stage: "STAGE_1_OPENING",
        stageNumber: 1,
        stageName: "Opening",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () => `“GOOD TO HEAR THAT, So, just as a quick check, have you had any issues with your phone or broadband recently?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ No issues",
            action: (_c, onUpdate) => onUpdate({ issuesRecently: "NONE" }),
          },
          {
            label: "⚠️ Reports line/broadband fault",
            action: (_c, onUpdate) => onUpdate({ issuesRecently: "Customer reported issue" }),
          },
        ],
      },

      // ==========================================
      // STAGE 2 — GET TO KNOW THEIR CURRENT SERVICE
      // ==========================================
      {
        id: "s2_u1",
        stage: "STAGE_2_CURRENT_SERVICE",
        stageNumber: 2,
        stageName: "Get To Know Their Current Service",
        unitIndex: 1,
        totalUnitsInStage: 7,
        getText: () => `“Okay, I understand.\nAnd your landline — do you use that quite often?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "Low / Rarely",
            action: (_c, onUpdate) => onUpdate({ landlineUsage: "LOW" }),
          },
          {
            label: "Moderate",
            action: (_c, onUpdate) => onUpdate({ landlineUsage: "MODERATE" }),
          },
          {
            label: "Daily / High",
            action: (_c, onUpdate) => onUpdate({ landlineUsage: "HIGH" }),
          },
        ],
      },
      {
        id: "s2_u2",
        stage: "STAGE_2_CURRENT_SERVICE",
        stageNumber: 2,
        stageName: "Get To Know Their Current Service",
        unitIndex: 2,
        totalUnitsInStage: 7,
        getText: () => `“Or is it mainly for incoming calls?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "Mainly incoming",
            action: (_c, onUpdate) => onUpdate({ landlineUsage: "INCOMING_ONLY" }),
          },
          {
            label: "Outgoing as well",
            action: () => {},
          },
        ],
      },
      {
        id: "s2_u3",
        stage: "STAGE_2_CURRENT_SERVICE",
        stageNumber: 2,
        stageName: "Get To Know Their Current Service",
        unitIndex: 3,
        totalUnitsInStage: 7,
        getText: () => `“Right, okay.\nAnd are you happy with the bills you're getting at the moment?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "Paying too much",
            action: (_c, onUpdate) => onUpdate({ billSatisfaction: "PAYING_TOO_MUCH" }),
          },
          {
            label: "About right / Happy",
            action: (_c, onUpdate) => onUpdate({ billSatisfaction: "PAYING_ABOUT_RIGHT" }),
          },
        ],
      },
      {
        id: "s2_u4",
        stage: "STAGE_2_CURRENT_SERVICE",
        stageNumber: 2,
        stageName: "Get To Know Their Current Service",
        unitIndex: 4,
        totalUnitsInStage: 7,
        getText: () => `“Do you feel you're paying about right for what you use?”`,
        isPauseAndListen: true,
      },
      {
        id: "s2_u5",
        stage: "STAGE_2_CURRENT_SERVICE",
        stageNumber: 2,
        stageName: "Get To Know Their Current Service",
        unitIndex: 5,
        totalUnitsInStage: 7,
        getText: () => `“Okay.\nRoughly, how much would you say your average bill has been over the last three months?”`,
        isPauseAndListen: true,
        inputType: "BILL_INPUT",
        quickOptions: [
          {
            label: "£50 approx",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 50, billApproximate: true }),
          },
          {
            label: "£65 approx",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 65, billApproximate: true }),
          },
          {
            label: "£80.99",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 80.99, billApproximate: true }),
          },
          {
            label: "Doesn't remember",
            action: (_c, onUpdate) => onUpdate({ billApproximate: true }),
          },
        ],
      },
      {
        id: "s2_u6",
        stage: "STAGE_2_CURRENT_SERVICE",
        stageNumber: 2,
        stageName: "Get To Know Their Current Service",
        unitIndex: 6,
        totalUnitsInStage: 7,
        getText: () => `“Okay, thank you.\nAnd does that amount include your phone, internet and TV?\nOr just your phone and internet?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "Phone + Broadband only",
            action: (_c, onUpdate) => onUpdate({ billIncludesPhone: true, billIncludesBroadband: true, billIncludesTv: false }),
          },
          {
            label: "Phone + Net + TV",
            action: (_c, onUpdate) => onUpdate({ billIncludesPhone: true, billIncludesBroadband: true, billIncludesTv: true, hasTvService: true }),
          },
          {
            label: "Phone only",
            action: (_c, onUpdate) => onUpdate({ billIncludesPhone: true, billIncludesBroadband: false, billIncludesTv: false }),
          },
        ],
      },
      {
        id: "s2_u7",
        stage: "STAGE_2_CURRENT_SERVICE",
        stageNumber: 2,
        stageName: "Get To Know Their Current Service",
        unitIndex: 7,
        totalUnitsInStage: 7,
        getText: () => `“Alright, that makes sense.”`,
        isPauseAndListen: false,
      },

      // ==========================================
      // STAGE 3 — INTRODUCE THE OFFER NATURALLY
      // ==========================================
      {
        id: "s3_u1",
        stage: "STAGE_3_OFFER_INTRO",
        stageNumber: 3,
        stageName: "Introduce The Offer Naturally",
        unitIndex: 1,
        totalUnitsInStage: 4,
        getText: (c) => `“Based on what you've just told me, I can see you're paying around £${c.monthlyBill ? c.monthlyBill.toFixed(0) : "[AMOUNT]"}.\nAnd it sounds like you're not really using all of the minutes included in your current service.”`,
        isPauseAndListen: false,
      },
      {
        id: "s3_u2",
        stage: "STAGE_3_OFFER_INTRO",
        stageNumber: 3,
        stageName: "Introduce The Offer Naturally",
        unitIndex: 2,
        totalUnitsInStage: 4,
        getText: (_c, cfg) => `“There is an offer available that may be more suitable for the way you're using your phone.\nIt includes ${cfg.minutes} cross-network anytime calling minutes, along with dedicated customer service.”`,
        isPauseAndListen: false,
      },
      {
        id: "s3_u3",
        stage: "STAGE_3_OFFER_INTRO",
        stageNumber: 3,
        stageName: "Introduce The Offer Naturally",
        unitIndex: 3,
        totalUnitsInStage: 4,
        getText: () => `“And if you need technical assistance, the technical visit is included as part of the offer.\nThe full details and terms would be provided to you in writing, so you can read everything properly before any changes are made.”`,
        isPauseAndListen: true,
      },
      {
        id: "s3_u4",
        stage: "STAGE_3_OFFER_INTRO",
        stageNumber: 3,
        stageName: "Introduce The Offer Naturally",
        unitIndex: 4,
        totalUnitsInStage: 4,
        getText: () => `“Does that all make sense so far?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Yes, makes sense",
            action: () => {},
          },
          {
            label: "Wants written terms first",
            action: () => {},
          },
        ],
      },

      // ==========================================
      // STAGE 4 — AGE / DOB VALIDATION
      // ==========================================
      {
        id: "s4_u1",
        stage: "STAGE_4_DOB_VALIDATION",
        stageNumber: 4,
        stageName: "Age / DOB Validation",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () => `“Perfect.\nThere’s just one quick eligibility check I need to do at this stage.”`,
        isPauseAndListen: false,
      },
      {
        id: "s4_u2",
        stage: "STAGE_4_DOB_VALIDATION",
        stageNumber: 4,
        stageName: "Age / DOB Validation",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: () => `“Could you please confirm your date of birth for me?”`,
        subNote: "If the customer asks why: “It’s simply part of the eligibility check for the offer we’ve just discussed.”",
        isPauseAndListen: true,
        inputType: "DOB_INPUT",
        quickOptions: [
          {
            label: "Age 72 (Born 1954)",
            action: (_c, onUpdate) => onUpdate({ birthYear: 1954, calculatedAge: 72, isEligibleAge: true, dob: "1954-01-01" }),
          },
          {
            label: "Age 70 (Born 1956)",
            action: (_c, onUpdate) => onUpdate({ birthYear: 1956, calculatedAge: 70, isEligibleAge: true, dob: "1956-01-01" }),
          },
          {
            label: "Refuses DOB",
            action: (_c, onUpdate) => onUpdate({ dobRefused: true }),
          },
        ],
      },
      {
        id: "s4_u3",
        stage: "STAGE_4_DOB_VALIDATION",
        stageNumber: 4,
        stageName: "Age / DOB Validation",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () => `“Thank you, I’ve got that.”`,
        isPauseAndListen: false,
      },

      // ==========================================
      // STAGE 5 — CONFIRM THE ADDRESS
      // ==========================================
      {
        id: "s5_u1",
        stage: "STAGE_5_CONFIRM_ADDRESS",
        stageNumber: 5,
        stageName: "Confirm The Address",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () => `“Right, thank you.\nLet me just check your address while I have you.”`,
        isPauseAndListen: false,
      },
      {
        id: "s5_u2",
        stage: "STAGE_5_CONFIRM_ADDRESS",
        stageNumber: 5,
        stageName: "Confirm The Address",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: (c) => `“I have your door number as ${c.doorNumber || "[NUMBER]"}.\nAnd your postcode as ${c.postcode || "[POSTCODE]"}.\nIs that correct?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Address is correct",
            action: (_c, onUpdate) => onUpdate({ addressConfirmed: true }),
          },
          {
            label: "Edit Address",
            action: () => {},
          },
        ],
      },
      {
        id: "s5_u3",
        stage: "STAGE_5_CONFIRM_ADDRESS",
        stageNumber: 5,
        stageName: "Confirm The Address",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () => `“Perfect, thank you.”`,
        isPauseAndListen: false,
      },

      // ==========================================
      // STAGE 6 — DIRECT DEBIT ELIGIBILITY / CUSTOMER ID
      // ==========================================
      {
        id: "s6_u1",
        stage: "STAGE_6_DIRECT_DEBIT_ID",
        stageNumber: 6,
        stageName: "Direct Debit Eligibility / Customer ID",
        unitIndex: 1,
        totalUnitsInStage: 4,
        getText: () => `“Alright, just one more quick check regarding the Direct Debit eligibility.\nI need to verify the customer identification number linked to your account.”`,
        isPauseAndListen: false,
      },
      {
        id: "s6_u2",
        stage: "STAGE_6_DIRECT_DEBIT_ID",
        stageNumber: 6,
        stageName: "Direct Debit Eligibility / Customer ID",
        unitIndex: 2,
        totalUnitsInStage: 4,
        getText: () => `“Could you please confirm the customer ID you have with you?”`,
        subNote: "If the customer ID begins with “IBANGB” and that is how it appears on authorized account info, ask them to read identifier exactly as shown.",
        isPauseAndListen: true,
        inputType: "CUSTOMER_ID_INPUT",
        quickOptions: [
          {
            label: "ID Not Available",
            action: (_c, onUpdate) => onUpdate({ customerIdStatus: "NOT_AVAILABLE", customerIdUnavailable: true }),
          },
          {
            label: "Uncomfortable providing ID",
            action: (_c, onUpdate) => onUpdate({ customerIdStatus: "REFUSED", customerIdRefused: true }),
          },
        ],
      },
      {
        id: "s6_u3",
        stage: "STAGE_6_DIRECT_DEBIT_ID",
        stageNumber: 6,
        stageName: "Direct Debit Eligibility / Customer ID",
        unitIndex: 3,
        totalUnitsInStage: 4,
        getText: (c) => `“Thank you.\nLet me just repeat that back to make sure I’ve got it correctly.\n\n${c.customerId || "[ID NUMBER]"}\n\nIs that correct?”`,
        subNote: "Repeat the identifier slowly.",
        isPauseAndListen: true,
      },
      {
        id: "s6_u4",
        stage: "STAGE_6_DIRECT_DEBIT_ID",
        stageNumber: 6,
        stageName: "Direct Debit Eligibility / Customer ID",
        unitIndex: 4,
        totalUnitsInStage: 4,
        getText: () => `“Perfect, thank you.”`,
        subNote: "If customer asks why: “It’s just being used to match your account and check the Direct Debit eligibility. It isn't a request for your PIN, password or OTP.”",
        isPauseAndListen: false,
      },

      // ==========================================
      // STAGE 7 — CONFIRM THEIR PERSONAL DETAILS
      // ==========================================
      {
        id: "s7_u1",
        stage: "STAGE_7_PERSONAL_DETAILS",
        stageNumber: 7,
        stageName: "Confirm Their Personal Details",
        unitIndex: 1,
        totalUnitsInStage: 4,
        getText: () => `“Right, we're nearly there.\nLet me just go through a few details with you.”`,
        isPauseAndListen: false,
      },
      {
        id: "s7_u2",
        stage: "STAGE_7_PERSONAL_DETAILS",
        stageNumber: 7,
        stageName: "Confirm Their Personal Details",
        unitIndex: 2,
        totalUnitsInStage: 4,
        getText: (c) => `“Your first name is ${c.firstName || "[NAME]"}?\nAnd your surname is ${c.lastName || "[SURNAME]"}?”`,
        isPauseAndListen: true,
      },
      {
        id: "s7_u3",
        stage: "STAGE_7_PERSONAL_DETAILS",
        stageNumber: 7,
        stageName: "Confirm Their Personal Details",
        unitIndex: 3,
        totalUnitsInStage: 4,
        getText: (c) => `“Thank you.\nYour door number is ${c.doorNumber || "[NUMBER]"}.\nYour postcode is ${c.postcode || "[POSTCODE]"}.\nAnd your contact number is ${c.contactNumber || c.mobileNumber || "[NUMBER]"}.\nIs everything correct?”`,
        isPauseAndListen: true,
      },
      {
        id: "s7_u4",
        stage: "STAGE_7_PERSONAL_DETAILS",
        stageNumber: 7,
        stageName: "Confirm Their Personal Details",
        unitIndex: 4,
        totalUnitsInStage: 4,
        getText: () => `“Perfect.”`,
        isPauseAndListen: false,
      },

      // ==========================================
      // STAGE 8 — MOBILE DETAILS
      // ==========================================
      {
        id: "s8_u1",
        stage: "STAGE_8_MOBILE_DETAILS",
        stageNumber: 8,
        stageName: "Mobile Details",
        unitIndex: 1,
        totalUnitsInStage: 5,
        getText: () => `“Do you also have a mobile number that you use?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Yes, has mobile",
            action: (_c, onUpdate) => onUpdate({ hasMobile: true }),
          },
          {
            label: "No mobile phone",
            action: (_c, onUpdate) => onUpdate({ hasMobile: false, mobileNumber: "None" }),
          },
        ],
      },
      {
        id: "s8_u2",
        stage: "STAGE_8_MOBILE_DETAILS",
        stageNumber: 8,
        stageName: "Mobile Details",
        unitIndex: 2,
        totalUnitsInStage: 5,
        getText: () => `“Okay, could you give me that number, please?”`,
        isPauseAndListen: true,
        inputType: "MOBILE_INPUT",
      },
      {
        id: "s8_u3",
        stage: "STAGE_8_MOBILE_DETAILS",
        stageNumber: 8,
        stageName: "Mobile Details",
        unitIndex: 3,
        totalUnitsInStage: 5,
        getText: (c) => `“So I have that as ${c.mobileNumber || "[NUMBER]"}, is that right?”`,
        isPauseAndListen: true,
      },
      {
        id: "s8_u4",
        stage: "STAGE_8_MOBILE_DETAILS",
        stageNumber: 8,
        stageName: "Mobile Details",
        unitIndex: 4,
        totalUnitsInStage: 5,
        getText: () => `“Thank you.\nAnd is that pay-as-you-go or a contract phone?\nAnd which network are you with?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "Contract (EE / O2 / Vodafone)",
            action: (_c, onUpdate) => onUpdate({ mobileType: "CONTRACT" }),
          },
          {
            label: "Pay-As-You-Go",
            action: (_c, onUpdate) => onUpdate({ mobileType: "PAYG" }),
          },
        ],
      },
      {
        id: "s8_u5",
        stage: "STAGE_8_MOBILE_DETAILS",
        stageNumber: 8,
        stageName: "Mobile Details",
        unitIndex: 5,
        totalUnitsInStage: 5,
        getText: () => `“Okay, got it.”`,
        isPauseAndListen: false,
      },

      // ==========================================
      // STAGE 9 — A COUPLE OF FINAL QUESTIONS
      // ==========================================
      {
        id: "s9_u1",
        stage: "STAGE_9_FINAL_QUESTIONS",
        stageNumber: 9,
        stageName: "A Couple Of Final Questions",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () => `“Just a couple more things and then we're all done.\nDo you have any medical alarm connected to your phone line?”`,
        isPauseAndListen: true,
        inputType: "ALARM_SELECT",
        quickOptions: [
          {
            label: "✓ No Medical Alarm",
            action: (_c, onUpdate) => onUpdate({ medicalAlarm: false }),
          },
          {
            label: "⚠️ Yes, has Medical Alarm",
            action: (_c, onUpdate) => onUpdate({ medicalAlarm: true }),
          },
        ],
      },
      {
        id: "s9_u2",
        stage: "STAGE_9_FINAL_QUESTIONS",
        stageNumber: 9,
        stageName: "A Couple Of Final Questions",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: () => `“Okay, thank you.\nAnd do you have a TV service at home?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "Yes, have TV",
            action: (_c, onUpdate) => onUpdate({ hasTvService: true }),
          },
          {
            label: "No TV",
            action: (_c, onUpdate) => onUpdate({ hasTvService: false }),
          },
        ],
      },
      {
        id: "s9_u3",
        stage: "STAGE_9_FINAL_QUESTIONS",
        stageNumber: 9,
        stageName: "A Couple Of Final Questions",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () => `“Could you tell me the make and model of your TV?”`,
        subNote: "If they ask why: “It’s just so we have the correct information about the equipment you're currently using.”",
        isPauseAndListen: true,
        inputType: "TV_INPUT",
        quickOptions: [
          {
            label: "Samsung Smart TV",
            action: (_c, onUpdate) => onUpdate({ tvMakeModel: "Samsung Smart TV" }),
          },
          {
            label: "LG / Sony",
            action: (_c, onUpdate) => onUpdate({ tvMakeModel: "LG / Sony TV" }),
          },
        ],
      },

      // ==========================================
      // STAGE 10 — FINAL CHECK
      // ==========================================
      {
        id: "s10_u1",
        stage: "STAGE_10_FINAL_CHECK",
        stageNumber: 10,
        stageName: "Final Check",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () => `“Alright, ${custName}, we're almost finished.\nLet me quickly go through everything with you, just to make sure I've got it right.”`,
        isPauseAndListen: false,
      },
      {
        id: "s10_u2",
        stage: "STAGE_10_FINAL_CHECK",
        stageNumber: 10,
        stageName: "Final Check",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: (c) => `“Your name is ${c.firstName || "[NAME]"} ${c.lastName || "[SURNAME]"}.\nYour address is ${addressStr}.\nYour postcode is ${c.postcode || "[POSTCODE]"}.\nYour contact number is ${c.contactNumber || c.mobileNumber || "[NUMBER]"}.\nAnd your current service information is ${serviceSummary}.\n\nIs everything correct?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Everything Correct",
            action: () => {},
          },
        ],
      },
      {
        id: "s10_u3",
        stage: "STAGE_10_FINAL_CHECK",
        stageNumber: 10,
        stageName: "Final Check",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () => `“Perfect, thank you.\nI appreciate you going through that with me.”`,
        isPauseAndListen: false,
      },

      // ==========================================
      // STAGE 11 — NATURAL CLOSE
      // ==========================================
      {
        id: "s11_u1",
        stage: "STAGE_11_NATURAL_CLOSE",
        stageNumber: 11,
        stageName: "Natural Close",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () => `“That's everything I needed from you today.\nI'll pass your details across to the relevant team.”`,
        isPauseAndListen: false,
      },
      {
        id: "s11_u2",
        stage: "STAGE_11_NATURAL_CLOSE",
        stageNumber: 11,
        stageName: "Natural Close",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: () => `“They'll be able to go through the available options with you and explain the service, pricing and terms.\nAnd you'll have the relevant information to look over before making any changes.”`,
        isPauseAndListen: false,
      },
      {
        id: "s11_u3",
        stage: "STAGE_11_NATURAL_CLOSE",
        stageNumber: 11,
        stageName: "Natural Close",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () => `“Thank you very much for your time, ${custName}.\nHave a good day.”`,
        isPauseAndListen: true,
      },
    ];

    return units;
  }
}
