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
   * Generates all units across the 5 Phases of the UK Digital Fiber Landline Upgrade Script
   */
  public static getAllUnits(customer: CustomerRecord, _config: OfferConfig): ScriptUnit[] {
    const customerName =
      MasterScriptEngine.getCustomerDisplayName(customer) || "[Customer Name]";

    const units: ScriptUnit[] = [
      // ==========================================
      // PHASE 1 — INTRODUCTION & RAPPORT BUILDING
      // ==========================================
      {
        id: "p1_u1",
        stage: "PHASE_1_INTRODUCTION",
        stageNumber: 1,
        stageName: "Introduction & Rapport Building",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () => `“Hello, good afternoon! Am I speaking with ${customerName}?”`,
        expectedCustomerReply: "Yes.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Yes” (Confirmed Name)",
            action: (_c, onUpdate) => onUpdate({ personalDetailsConfirmed: true }),
          },
          {
            label: "“Who is calling please?”",
            action: () => {},
          },
          {
            label: "“What is this regarding?”",
            action: () => {},
          },
        ],
      },
      {
        id: "p1_u2",
        stage: "PHASE_1_INTRODUCTION",
        stageNumber: 1,
        stageName: "Introduction & Rapport Building",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `“I hope you're having a lovely day. I am calling regarding your existing landline service.”`,
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Proceed to Digital Transition",
            action: () => {},
          },
          {
            label: "“Is there a problem with my line?”",
            action: () => {},
          },
        ],
      },

      // ==========================================
      // PHASE 2 — IDENTIFYING THE TRANSITION & HOOK
      // ==========================================
      {
        id: "p2_u1",
        stage: "PHASE_2_TRANSITION_HOOK",
        stageNumber: 2,
        stageName: "Identifying the Transition & Hook",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `“As you may know, the old copper wires your landline currently runs on are being retired, and we are upgrading lines to the new fiber digital network. In order to keep your landline active and working, we will be upgrading it to the new network.”`,
        expectedCustomerReply:
          "Oh right, I was wondering what was happening / My husband usually deals with that side of things.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ “Oh right, I was wondering what was happening”",
            action: () => {},
          },
          {
            label: "“My husband / partner deals with that”",
            action: () => {},
          },
          {
            label: "“Is my landline being disconnected?”",
            action: () => {},
          },
        ],
      },
      {
        id: "p2_u2",
        stage: "PHASE_2_TRANSITION_HOOK",
        stageNumber: 2,
        stageName: "Identifying the Transition & Hook",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `“No problem at all, I'm here to assist you step-by-step. The great news is your landline number and phone will remain exactly the same. The only difference is that your call quality and reception will be much better since it will operate via the internet.”`,
        subNote:
          "Reassure: Handset & number remain 100% identical. The line operates via high-speed digital fiber.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer acknowledges & continues",
            action: () => {},
          },
          {
            label: "“Do I keep my exact same number?” (Yes, 100% same)",
            action: () => {},
          },
        ],
      },

      // ==========================================
      // PHASE 3 — PRESENTING THE BUNDLE & PRICE GUARANTEE
      // ==========================================
      {
        id: "p3_u1",
        stage: "PHASE_3_BUNDLE_PRICE_GUARANTEE",
        stageNumber: 3,
        stageName: "Presenting the Bundle & Price Guarantee",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `“As a privileged customer, we are bundling your landline upgrade with high-speed fiber broadband and unlimited calls to any local, national UK landline and mobile numbers.”`,
        expectedCustomerReply: "How much is that going to cost?",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer asks: “How much is that going to cost?”",
            action: () => {},
          },
          {
            label: "“Are mobile calls included?” (Yes, unlimited UK mobiles & landlines)",
            action: () => {},
          },
        ],
      },
      {
        id: "p3_u2",
        stage: "PHASE_3_BUNDLE_PRICE_GUARANTEE",
        stageNumber: 3,
        stageName: "Presenting the Bundle & Price Guarantee",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `“The total price for your digital landline and broadband services will be only £42.99 per month plus VAT (making it £51.58 total), and it comes with a price promise guarantee locked in for the next two years so your bill will not fluctuate or go up.”`,
        subNote:
          "Tariff: £42.99/mo + 20% VAT (£8.59) = £51.58/mo total. Price locked for 2 years with zero price fluctuations.",
        isPauseAndListen: true,
        inputType: "VAT_CALCULATOR",
        quickOptions: [
          {
            label: "✓ Customer accepts: £51.58 total (Locked 2 Years)",
            action: (_c, onUpdate) =>
              onUpdate({ monthlyBill: 51.58, billApproximate: false, termsUnderstood: true }),
          },
          {
            label: "“Does that include VAT?” (Yes, £51.58 total inc. 20% VAT)",
            action: () => {},
          },
          {
            label: "“Will the bill increase after 1 year?” (No, 2-year lock)",
            action: () => {},
          },
        ],
      },

      // ==========================================
      // PHASE 4 — HARDWARE & INSTALLATION DETAILS
      // ==========================================
      {
        id: "p4_u1",
        stage: "PHASE_4_HARDWARE_INSTALLATION",
        stageNumber: 4,
        stageName: "Hardware & Installation Details",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `“We will also send you a digital router by post. While these normally cost £100 to £120 in the market, as an upgrade customer it is only a one-time £30 charge automatically adjusted on your bills. Furthermore, a certified engineer's visit and installation charges will be completely free.”`,
        expectedCustomerReply: "Do I have to install the equipment myself?",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer asks: “Do I have to install it myself?”",
            action: () => {},
          },
          {
            label: "“When is the £30 billed?” (Automatically adjusted on bill)",
            action: () => {},
          },
        ],
      },
      {
        id: "p4_u2",
        stage: "PHASE_4_HARDWARE_INSTALLATION",
        stageNumber: 4,
        stageName: "Hardware & Installation Details",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `“Not at all! You just keep the router package when it arrives, and our engineers will visit your property to handle the entire setup on your behalf.”`,
        subNote:
          "Engineer setup is 100% free. Customer merely receives the postal package; the certified engineer completes everything.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer relieved / agrees to engineer setup",
            action: () => {},
          },
          {
            label: "“When will the engineer visit?”",
            action: () => {},
          },
        ],
      },

      // ==========================================
      // PHASE 5 — VERIFICATION & CLOSING
      // ==========================================
      {
        id: "p5_u1",
        stage: "PHASE_5_VERIFICATION_CLOSING",
        stageNumber: 5,
        stageName: "Verification & Closing",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: () =>
          `“To finalize everything, I will quickly connect you to our senior verification officer who will take just a minute to confirm your new package price and address before sending out your official confirmation letter and router. Please hold the line for a moment.”`,
        expectedCustomerReply: "Alright, thank you.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Alright, thank you.” (Transfer Ready)",
            action: (_c, onUpdate) =>
              onUpdate({ customerDecision: "YES", finalConfirmationGiven: true }),
          },
          {
            label: "“How long will this take?” (Just 1 minute to confirm)",
            action: () => {},
          },
          {
            label: "“When does the letter arrive?”",
            action: () => {},
          },
        ],
      },
    ];

    return units;
  }
}
