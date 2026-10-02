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
   * Generates all calibrated units across the 9 Live Call Flow stages of the 30% Bill Reduction Script
   */
  public static getAllUnits(customer: CustomerRecord, config: OfferConfig): ScriptUnit[] {
    const advisorName = config.advisorName || "Peter";
    const companyName = config.companyName || "[COMPANY NAME]";

    const units: ScriptUnit[] = [
      // ==========================================
      // STAGE 1 — OPENING (Section 1)
      // ==========================================
      {
        id: "s1_u1",
        stage: "STAGE_1_OPENING",
        stageNumber: 1,
        stageName: "Opening",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () => `“Hi, my name is ${advisorName}, and I'm calling regarding your telephone service. There's been a reduction of up to 30% on your monthly bill.”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer Listens / Says Yes",
            action: () => {},
          },
          {
            label: "“What is this about?”",
            action: () => {},
          },
          {
            label: "“Who are you calling from?”",
            action: () => {},
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
        getText: () => `“I'm just calling to let you know about the reduction and check if it applies to your current service.”`,
        isPauseAndListen: false,
      },
      {
        id: "s1_u3",
        stage: "STAGE_1_OPENING",
        stageNumber: 1,
        stageName: "Opening",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () => `“It will only take a couple of minutes. I'll check a few details and explain the saving clearly to you.”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Yes / Continues (Sec 1)",
            action: () => {},
          },
          {
            label: "“I'm not interested” (Sec 3)",
            action: () => {},
          },
          {
            label: "“I'm busy” (Sec 4)",
            action: () => {},
          },
        ],
      },

      // ==========================================
      // STAGE 2 — CONSUMER IDENTIFICATION NUMBER (Section 7)
      // ==========================================
      {
        id: "s2_u1",
        stage: "STAGE_2_VERIFICATION_ID",
        stageNumber: 2,
        stageName: "Consumer Identification Number",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: () => `“Before I continue, I just need to verify the account. Could you please give me your Consumer Identification Number?”`,
        isPauseAndListen: true,
        inputType: "CUSTOMER_ID_INPUT",
        subNote: "If customer asks why: “It's simply to verify the correct account and make sure I'm looking at the right service details. I don't want to give you information for the wrong account.”",
        quickOptions: [
          {
            label: "✓ ID Verified",
            action: (_c, onUpdate) => onUpdate({ consumerIdStatus: "VERIFIED", customerIdStatus: "VERIFIED" }),
          },
          {
            label: "Doesn't know where to find it (Sec 7)",
            action: (_c, onUpdate) => onUpdate({ consumerIdUnavailable: true, consumerIdStatus: "NOT_AVAILABLE" }),
          },
          {
            label: "Customer Refuses ID (Sec 7)",
            action: (_c, onUpdate) => onUpdate({ consumerIdRefused: true, consumerIdStatus: "REFUSED" }),
          },
        ],
      },

      // ==========================================
      // STAGE 3 — VERIFICATION COMPLETED (Section 8)
      // ==========================================
      {
        id: "s3_u1",
        stage: "STAGE_3_VERIFICATION_COMPLETED",
        stageNumber: 3,
        stageName: "Verification Completed",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () => `“Thank you. That's all I needed for the account verification.”`,
        isPauseAndListen: false,
      },
      {
        id: "s3_u2",
        stage: "STAGE_3_VERIFICATION_COMPLETED",
        stageNumber: 3,
        stageName: "Verification Completed",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () => `“I'll now check a few basic details about your current service so I can explain the reduction correctly.”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Proceed to service check",
            action: () => {},
          },
          {
            label: "Customer has a question (Sec 47)",
            action: () => {},
          },
        ],
      },

      // ==========================================
      // STAGE 4 — CURRENT SERVICE (Section 9)
      // ==========================================
      {
        id: "s4_u1",
        stage: "STAGE_4_CURRENT_SERVICE",
        stageNumber: 4,
        stageName: "Current Service",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: () => `“Can I just confirm, are you currently using this telephone service at your home?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ YES — Using at home",
            action: (_c, onUpdate) => onUpdate({ isUsingAtHome: "YES" }),
          },
          {
            label: "NO — Not at home",
            action: (_c, onUpdate) => onUpdate({ isUsingAtHome: "NO" }),
          },
          {
            label: "DON'T KNOW / Unsure",
            action: (_c, onUpdate) => onUpdate({ isUsingAtHome: "DONT_KNOW" }),
          },
        ],
      },

      // ==========================================
      // STAGE 5 — CURRENT MONTHLY BILL (Section 10)
      // ==========================================
      {
        id: "s5_u1",
        stage: "STAGE_5_CURRENT_BILL",
        stageNumber: 5,
        stageName: "Current Monthly Bill",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: () => `“Could you tell me roughly how much you're currently paying each month for your telephone service?”`,
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
            label: "£80.99 approx",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 80.99, billApproximate: true }),
          },
          {
            label: "Doesn't know (Sec 10)",
            action: () => {},
          },
          {
            label: "“Already cheap” (Sec 17)",
            action: () => {},
          },
        ],
      },

      // ==========================================
      // STAGE 6 — EXPLAINING THE REDUCTION (Section 11)
      // ==========================================
      {
        id: "s6_u1",
        stage: "STAGE_6_EXPLAINING_REDUCTION",
        stageNumber: 6,
        stageName: "Explaining The Reduction",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () => `“Based on the information you've given me, the available reduction could lower your monthly telephone cost.”`,
        isPauseAndListen: false,
      },
      {
        id: "s6_u2",
        stage: "STAGE_6_EXPLAINING_REDUCTION",
        stageNumber: 6,
        stageName: "Explaining The Reduction",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () => `“The exact amount depends on your current service and the details we've just checked.”`,
        isPauseAndListen: true,
        subNote: "If customer asks “How much exactly?”: “I'll confirm the exact figure once the remaining details have been checked. I don't want to give you an incorrect amount before everything is verified.”",
        quickOptions: [
          {
            label: "✓ Customer is interested (Sec 12)",
            action: () => {},
          },
          {
            label: "“How much will I save?” (Sec 5)",
            action: () => {},
          },
          {
            label: "“Is this a new contract?” (Sec 6)",
            action: () => {},
          },
          {
            label: "Customer is confused (Sec 13)",
            action: () => {},
          },
        ],
      },

      // ==========================================
      // STAGE 7 — FINAL CONFIRMATION (Section 45)
      // ==========================================
      {
        id: "s7_u1",
        stage: "STAGE_7_FINAL_CONFIRMATION",
        stageNumber: 7,
        stageName: "Final Confirmation",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () => `“Thank you for going through those details with me.”`,
        isPauseAndListen: false,
      },
      {
        id: "s7_u2",
        stage: "STAGE_7_FINAL_CONFIRMATION",
        stageNumber: 7,
        stageName: "Final Confirmation",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () => `“I'll now explain the available reduction and any important terms before you decide whether you want to continue.”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer Agrees to Continue (Sec 44)",
            action: (_c, onUpdate) => onUpdate({ finalConfirmationGiven: true }),
          },
          {
            label: "“I want to think about it” (Sec 30)",
            action: () => {},
          },
          {
            label: "“Speak to my family” (Sec 31)",
            action: () => {},
          },
          {
            label: "“Just send me something” (Sec 37)",
            action: () => {},
          },
        ],
      },

      // ==========================================
      // STAGE 8 — BEFORE ANY AGREEMENT (Section 46)
      // ==========================================
      {
        id: "s8_u1",
        stage: "STAGE_8_BEFORE_AGREEMENT",
        stageNumber: 8,
        stageName: "Before Any Agreement",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () => `“Before we go any further, I'll make sure you understand the price, service, and any relevant terms.”`,
        isPauseAndListen: false,
      },
      {
        id: "s8_u2",
        stage: "STAGE_8_BEFORE_AGREEMENT",
        stageNumber: 8,
        stageName: "Before Any Agreement",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () => `“If anything is unclear, please ask me and I'll explain it.”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Everything Clear / Understood",
            action: (_c, onUpdate) => onUpdate({ termsUnderstood: true }),
          },
          {
            label: "Customer has a question (Sec 47)",
            action: () => {},
          },
          {
            label: "“I'm not sure” (Sec 50)",
            action: () => {},
          },
          {
            label: "Asks you to repeat (Sec 51)",
            action: () => {},
          },
        ],
      },

      // ==========================================
      // STAGE 9 — CUSTOMER DECISION (Sections 48, 49)
      // ==========================================
      {
        id: "s9_u1",
        stage: "STAGE_9_CUSTOMER_DECISION",
        stageNumber: 9,
        stageName: "Customer Decision",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: () => `“Would you like to proceed with the 30% reduction on your telephone service?”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ YES — Proceed (Sec 48)",
            action: (_c, onUpdate) => onUpdate({ customerDecision: "YES" }),
          },
          {
            label: "✕ NO — Decline (Sec 49)",
            action: (_c, onUpdate) => onUpdate({ customerDecision: "NO" }),
          },
          {
            label: "End Call (Sec 43)",
            action: () => {},
          },
          {
            label: "Remove Number (Sec 41)",
            action: () => {},
          },
        ],
      },
    ];

    return units;
  }
}
