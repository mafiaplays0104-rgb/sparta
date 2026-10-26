import {
  MasterStage,
  CustomerRecord,
  OfferConfig,
} from "../types";

export interface StageDefinition {
  stage: MasterStage;
  stageNumber: number;
  stageName: string;
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

export const STAGES_LIST: MasterStage[] = [
  "PHASE_1_INTRODUCTION",
  "PHASE_2_TRANSITION_HOOK",
  "PHASE_3_BUNDLE_PRICE_GUARANTEE",
  "PHASE_4_HARDWARE_INSTALLATION",
  "PHASE_5_VERIFICATION_CLOSING",
];

export class MasterScriptEngine {
  /**
   * Helper to resolve customer name or greeting
   */
  public static getCustomerDisplayName(customer: CustomerRecord): string {
    const prefix = customer.title || "Mr / Mrs";
    if (customer.lastName) {
      return `${prefix} ${customer.lastName}`;
    }
    if (customer.firstName) {
      return customer.firstName;
    }
    return "";
  }

  /**
   * Format a concise service summary for verification
   */
  public static getServiceSummary(customer: CustomerRecord): string {
    const parts: string[] = [];
    if (customer.monthlyBill) {
      parts.push(`paying around £${customer.monthlyBill.toFixed(2)}/month`);
    }
    if (customer.isUsingAtHome) {
      parts.push(`home service: ${customer.isUsingAtHome}`);
    }
    if (customer.consumerId) {
      parts.push(`Consumer ID: ${customer.consumerId}`);
    }
    return parts.length > 0 ? parts.join(", ") : "current telephone service";
  }

  /**
   * Get the complete definition for any of the 9 Master Stages of the UK Telecom 30% Reduction Script
   */
  public static getStageDefinition(
    stage: MasterStage,
    customer: CustomerRecord,
    config: OfferConfig
  ): StageDefinition {
    const advisorName = config.advisorName || "Peter";
    const companyName = config.companyName || "[COMPANY NAME]";
    const approvedId = config.approvedAgentId || "[APPROVED ID]";
    const billStr = customer.monthlyBill
      ? `£${customer.monthlyBill.toFixed(2)}`
      : "[AMOUNT]";

    switch (stage) {
      // =============================================================
      // PHASE 1 — INTRODUCTION & RAPPORT BUILDING
      // =============================================================
      case "PHASE_1_INTRODUCTION": {
        const customerName = MasterScriptEngine.getCustomerDisplayName(customer) || "[Customer Name]";
        return {
          stage: "PHASE_1_INTRODUCTION",
          stageNumber: 1,
          stageName: "Phase 1: Introduction & Rapport Building",
          objective: "Establish contact with the customer, verify name, build rapport, and introduce call purpose regarding existing landline service.",
          goldenRuleNote: "Warm, professional greeting. Verify speaking with the account holder.",
          getSayText: () =>
            `“Hello, good afternoon! Am I speaking with ${customerName}?”\n\n(Customer: Yes.)\n\n“I hope you're having a lovely day. I am calling regarding your existing landline service.”`,
          pauseInstruction: "Confirm customer identity and listen for their response.",
          quickResponses: [
            {
              label: "Customer: “Yes” / Confirms Identity",
              actionDescription: "Customer confirms they are the account holder.",
              nextStage: "PHASE_2_TRANSITION_HOOK",
              guidance: "Acknowledge and proceed smoothly into explaining the digital network transition.",
            },
            {
              label: "“Who is calling?”",
              actionDescription: "Customer asks who is calling.",
              guidance: `Say: “I'm calling on behalf of your existing landline service regarding the digital network upgrade for your area.”`,
            },
            {
              label: "“What is this regarding?”",
              actionDescription: "Customer asks what the call is about.",
              guidance: "Say: “It is regarding your current landline service and the upgrade from old copper lines to the new digital fiber network.”",
            },
          ],
          why: "Polite rapport building and early identity confirmation establish authority and trust.",
          nextStage: "PHASE_2_TRANSITION_HOOK",
        };
      }

      // =============================================================
      // PHASE 2 — IDENTIFYING THE TRANSITION & HOOK
      // =============================================================
      case "PHASE_2_TRANSITION_HOOK":
        return {
          stage: "PHASE_2_TRANSITION_HOOK",
          stageNumber: 2,
          stageName: "Phase 2: Identifying the Transition & Hook",
          objective: "Explain the copper retirement transition and reassure the customer that phone number and handset remain identical with improved reception.",
          goldenRuleNote: "Reassure that landline number and phone remain 100% identical; quality will be much better via the internet.",
          getSayText: () =>
            `“As you may know, the old copper wires your landline currently runs on are being retired, and we are upgrading lines to the new fiber digital network. In order to keep your landline active and working, we will be upgrading it to the new network.”\n\n(Customer: Oh right, I was wondering what was happening / My husband usually deals with that side of things.)\n\n“No problem at all, I'm here to assist you step-by-step. The great news is your landline number and phone will remain exactly the same. The only difference is that your call quality and reception will be much better since it will operate via the internet.”`,
          pauseInstruction: "Listen to the customer's response regarding the national line switch-off.",
          quickResponses: [
            {
              label: "“I was wondering what was happening”",
              actionDescription: "Customer is aware or interested in the transition.",
              nextStage: "PHASE_3_BUNDLE_PRICE_GUARANTEE",
              guidance: "Move to presenting the privileged bundle and 2-year price guarantee.",
            },
            {
              label: "“My husband/partner usually deals with that”",
              actionDescription: "Customer mentions a family member.",
              guidance: "Say: “No problem at all, I'm here to assist you step-by-step. The great news is your landline number and phone will remain exactly the same.”",
            },
            {
              label: "“Will my number change?”",
              actionDescription: "Customer worries about losing their phone number.",
              guidance: "Reassure: “Your landline number and existing phone will remain exactly the same. Only call quality will improve.”",
            },
          ],
          why: "Clear hook explaining copper retirement gives legitimate reason for the upgrade.",
          nextStage: "PHASE_3_BUNDLE_PRICE_GUARANTEE",
          prevStage: "PHASE_1_INTRODUCTION",
        };

      // =============================================================
      // PHASE 3 — PRESENTING THE BUNDLE & PRICE GUARANTEE
      // =============================================================
      case "PHASE_3_BUNDLE_PRICE_GUARANTEE":
        return {
          stage: "PHASE_3_BUNDLE_PRICE_GUARANTEE",
          stageNumber: 3,
          stageName: "Phase 3: Presenting the Bundle & Price Guarantee",
          objective: "Present bundle: digital landline + high-speed fiber broadband + unlimited calls at £42.99/mo + VAT (£51.58 total) with 2-year price guarantee.",
          goldenRuleNote: "Clearly state: £42.99 per month plus VAT (making it £51.58 total) with a locked 2-year price guarantee.",
          getSayText: () =>
            `“As a privileged customer, we are bundling your landline upgrade with high-speed fiber broadband and unlimited calls to any local, national UK landline and mobile numbers.”\n\n(Customer: How much is that going to cost?)\n\n“The total price for your digital landline and broadband services will be only £42.99 per month plus VAT (making it £51.58 total), and it comes with a price promise guarantee locked in for the next two years so your bill will not fluctuate or go up.”`,
          pauseInstruction: "Present pricing clearly and listen for customer acceptance.",
          quickResponses: [
            {
              label: "Customer asks: “How much is that going to cost?”",
              actionDescription: "Customer asks for pricing.",
              guidance: "State: “The total price is only £42.99 per month plus VAT, making it £51.58 total, locked in for 2 years.”",
            },
            {
              label: "Customer Agrees / Accepts Price",
              actionDescription: "Customer is happy with £51.58 total and 2-year price guarantee.",
              nextStage: "PHASE_4_HARDWARE_INSTALLATION",
              guidance: "Move smoothly into router dispatch and free engineer details.",
            },
            {
              label: "“Does that include VAT?”",
              actionDescription: "Customer clarifies tax amount.",
              guidance: "Say: “The base bundle is £42.99 per month, plus 20% VAT which is £8.59, making it exactly £51.58 in total with no hidden fees.”",
            },
            {
              label: "“Will the price increase next year?”",
              actionDescription: "Customer asks about price hikes.",
              guidance: "Say: “No, it comes with a price promise guarantee locked in for the next two years so your bill will not fluctuate or go up.”",
            },
          ],
          why: "Transparent all-inclusive pricing with a 2-year price lock eliminates anxiety of mid-contract price rises.",
          nextStage: "PHASE_4_HARDWARE_INSTALLATION",
          prevStage: "PHASE_2_TRANSITION_HOOK",
        };

      // =============================================================
      // PHASE 4 — HARDWARE & INSTALLATION DETAILS
      // =============================================================
      case "PHASE_4_HARDWARE_INSTALLATION":
        return {
          stage: "PHASE_4_HARDWARE_INSTALLATION",
          stageNumber: 4,
          stageName: "Phase 4: Hardware & Installation Details",
          objective: "Detail digital router postal delivery (£30 upgrade charge vs £100-£120 market) and completely free certified engineer installation visit.",
          goldenRuleNote: "Reassure the customer that the certified engineer setup is completely FREE and they do not need to install anything themselves.",
          getSayText: () =>
            `“We will also send you a digital router by post. While these normally cost £100 to £120 in the market, as an upgrade customer it is only a one-time £30 charge automatically adjusted on your bills. Furthermore, a certified engineer's visit and installation charges will be completely free.”\n\n(Customer: Do I have to install the equipment myself?)\n\n“Not at all! You just keep the router package when it arrives, and our engineers will visit your property to handle the entire setup on your behalf.”`,
          pauseInstruction: "Listen to customer questions on equipment dispatch and engineer setup.",
          quickResponses: [
            {
              label: "Customer asks: “Do I have to install it myself?”",
              actionDescription: "Customer asks about self-installation.",
              guidance: "Say: “Not at all! You just keep the router package when it arrives, and our engineers will visit your property to handle the entire setup on your behalf.”",
            },
            {
              label: "Customer agrees / Pleased with free engineer",
              actionDescription: "Customer accepts router and installation plan.",
              nextStage: "PHASE_5_VERIFICATION_CLOSING",
              guidance: "Transition to senior verification officer closing.",
            },
            {
              label: "“When is the £30 charged?”",
              actionDescription: "Customer asks about the one-time router fee.",
              guidance: "Say: “It is a one-time £30 upgrade charge automatically adjusted on your bills, saving you over £70 off market price.”",
            },
          ],
          why: "Eliminates fear of complicated technology setup by providing a certified engineer at no cost.",
          nextStage: "PHASE_5_VERIFICATION_CLOSING",
          prevStage: "PHASE_3_BUNDLE_PRICE_GUARANTEE",
        };

      // =============================================================
      // PHASE 5 — VERIFICATION & CLOSING
      // =============================================================
      case "PHASE_5_VERIFICATION_CLOSING":
        return {
          stage: "PHASE_5_VERIFICATION_CLOSING",
          stageNumber: 5,
          stageName: "Phase 5: Verification & Closing",
          objective: "Transfer customer to senior verification officer for a 1-minute price and address confirmation before dispatching router and confirmation letter.",
          goldenRuleNote: "Brief 1-minute confirmation with senior verification officer before dispatching confirmation letter and router.",
          getSayText: () =>
            `“To finalize everything, I will quickly connect you to our senior verification officer who will take just a minute to confirm your new package price and address before sending out your official confirmation letter and router. Please hold the line for a moment.”\n\n(Customer: Alright, thank you.)`,
          pauseInstruction: "Customer agrees ('Alright, thank you'). Transfer line to Senior Verification Officer.",
          quickResponses: [
            {
              label: "Customer: “Alright, thank you” (Proceed to Transfer)",
              actionDescription: "Customer agrees to hold for verification officer.",
              nextStage: "CALL_COMPLETED" as MasterStage,
              guidance: "Initiate warm transfer to senior verification officer and complete lead disposition.",
            },
            {
              label: "“How long will this take?”",
              actionDescription: "Customer asks for verification time.",
              guidance: "Say: “Just about one minute to confirm your new package price and address before we dispatch your router.”",
            },
          ],
          why: "Independent verification confirms contract terms, ensures compliance, and finalizes delivery.",
          nextStage: "CALL_COMPLETED" as MasterStage,
          prevStage: "PHASE_4_HARDWARE_INSTALLATION",
        };

      // -------------------------------------------------------------
      // LEGACY STAGES (Maintained for Backward Compatibility)
      // -------------------------------------------------------------
      case "STAGE_1_OPENING":
        return {
          stage: "STAGE_1_OPENING",
          stageNumber: 1,
          stageName: "Stage 1 — Opening",
          objective: "Introduce Peter, announce up to 30% monthly bill reduction, and confirm customer willingness to hear details",
          goldenRuleNote: "Keep every spoken section short. One idea → one short paragraph → one question.",
          getSayText: () =>
            `“Hi, my name is ${advisorName}, and I'm calling regarding your telephone service. There's been a reduction of up to 30% on your monthly bill.\n\nI'm just calling to let you know about the reduction and check if it applies to your current service.\n\nIt will only take a couple of minutes. I'll check a few details and explain the saving clearly to you.”`,
          pauseInstruction: "Pause and listen to the customer's response. Do not rush over the opening.",
          quickResponses: [
            {
              label: "Customer says YES / Continues",
              actionDescription: "Customer is interested or happy to continue.",
              nextStage: "STAGE_2_VERIFICATION_ID",
              guidance: "Say: “Perfect, thank you. I'll just check a few details with you so I can make sure everything is correct.”",
            },
            {
              label: "“What is this about?”",
              actionDescription: "Customer asks for clarity on the call purpose.",
              guidance: "Say: “It's regarding your current telephone service. There may be a reduction of up to 30% on your monthly bill. I'll quickly check your details first, then I'll explain what the reduction would mean for you.”",
            },
            {
              label: "“Who are you calling from?”",
              actionDescription: "Customer asks for company identity.",
              guidance: `Say: “I'm calling from ${companyName} regarding your telephone service and current monthly bill. I'm contacting you about the available reduction and checking whether your service qualifies for it.”`,
            },
            {
              label: "“Are you from BT?”",
              actionDescription: "Customer asks if you represent BT.",
              guidance: `Say: “I'm calling from ${companyName}. I'll be happy to explain exactly who we are before we continue. I don't want to give you the wrong information, so I'll keep everything clear and straightforward.”`,
            },
            {
              label: "“I'm not interested”",
              actionDescription: "Customer expresses disinterest.",
              guidance: "Say: “I completely understand. Before you decide, let me quickly explain what the reduction is about. If you're eligible, I'll tell you exactly what the saving could be. You can then decide whether you want to continue.”",
            },
            {
              label: "“I'm busy”",
              actionDescription: "Customer says they are busy.",
              category: "BUSY",
              guidance: "Say: “I completely understand. It shouldn't take long to check the account and see whether the reduction applies to your service. I'll keep it brief and only ask for the details needed to check your eligibility.”",
            },
          ],
          why: "Clear, transparent identification and immediate statement of the up to 30% reduction without deceptive hooks.",
          nextStage: "STAGE_2_VERIFICATION_ID",
        };

      // -------------------------------------------------------------
      // STAGE 2 — CONSUMER IDENTIFICATION NUMBER (Section 7)
      // -------------------------------------------------------------
      case "STAGE_2_VERIFICATION_ID":
        return {
          stage: "STAGE_2_VERIFICATION_ID",
          stageNumber: 2,
          stageName: "Stage 2 — Consumer Identification Number",
          objective: "Request and verify the Consumer Identification Number to ensure the correct account is reviewed",
          goldenRuleNote: "Ask clearly for the Consumer Identification Number and explain its purpose calmly.",
          getSayText: () =>
            `“Before I continue, I just need to verify the account. Could you please give me your Consumer Identification Number?”`,
          pauseInstruction: "Pause and listen for the customer's Consumer Identification Number.",
          quickResponses: [
            {
              label: "Provides Consumer ID",
              actionDescription: "Customer reads out their Consumer Identification Number.",
              autoFill: { consumerIdStatus: "VERIFIED" },
              nextStage: "STAGE_3_VERIFICATION_COMPLETED",
              guidance: "Record Consumer ID and move smoothly to Verification Completed.",
            },
            {
              label: "“Why do you need it?”",
              actionDescription: "Customer asks for the reason.",
              guidance: "Say: “It's simply to verify the correct account and make sure I'm looking at the right service details. I don't want to give you information for the wrong account.”",
            },
            {
              label: "Doesn't know where to find it",
              actionDescription: "Customer cannot find the number on their bill.",
              autoFill: { consumerIdUnavailable: true, consumerIdStatus: "NOT_AVAILABLE" },
              guidance: "Say: “That's absolutely fine. Take your time and have a look at your latest bill or service information. It may be shown with your other account details.”",
            },
            {
              label: "Customer Refuses ID",
              actionDescription: "Customer is uncomfortable sharing ID.",
              autoFill: { consumerIdRefused: true, consumerIdStatus: "REFUSED" },
              guidance: "Say: “That's completely fine. Please don't share anything you're uncomfortable sharing. Without verification, I may not be able to check the account details for you.”",
            },
          ],
          why: "Verifies account legitimacy and prevents giving telephone service details to an unverified recipient.",
          complianceWarning: "Never pressure the customer for identification. If refused, respect their comfort level.",
          nextStage: "STAGE_3_VERIFICATION_COMPLETED",
          prevStage: "STAGE_1_OPENING",
        };

      // -------------------------------------------------------------
      // STAGE 3 — VERIFICATION COMPLETED (Section 8)
      // -------------------------------------------------------------
      case "STAGE_3_VERIFICATION_COMPLETED":
        return {
          stage: "STAGE_3_VERIFICATION_COMPLETED",
          stageNumber: 3,
          stageName: "Stage 3 — Verification Completed",
          objective: "Acknowledge verification completion and transition into basic service check",
          goldenRuleNote: "Keep the acknowledgement brief and transition smoothly.",
          getSayText: () =>
            `“Thank you. That's all I needed for the account verification.\n\nI'll now check a few basic details about your current service so I can explain the reduction correctly.”`,
          pauseInstruction: "Pause briefly and move to confirming current service.",
          quickResponses: [
            {
              label: "Continue to Current Service",
              actionDescription: "Proceed to check home telephone usage.",
              nextStage: "STAGE_4_CURRENT_SERVICE",
            },
            {
              label: "Customer has a question",
              actionDescription: "Customer asks something before proceeding.",
              guidance: "Say: “Of course. What would you like me to explain? I'll answer that first, then we can continue from where we stopped.”",
            },
            {
              label: "Customer interrupts",
              actionDescription: "Customer speaks or asks for clarification.",
              guidance: "Say: “Of course, please go ahead. I'll listen to your question first, and then I'll explain the part you want to know about.”",
            },
          ],
          why: "Signals completion of the security gate so customer feels at ease.",
          nextStage: "STAGE_4_CURRENT_SERVICE",
          prevStage: "STAGE_2_VERIFICATION_ID",
        };

      // -------------------------------------------------------------
      // STAGE 4 — CURRENT SERVICE (Section 9)
      // -------------------------------------------------------------
      case "STAGE_4_CURRENT_SERVICE":
        return {
          stage: "STAGE_4_CURRENT_SERVICE",
          stageNumber: 4,
          stageName: "Stage 4 — Current Service",
          objective: "Confirm whether the customer is currently using the telephone service at their home",
          goldenRuleNote: "One simple, direct question: 'Are you currently using this telephone service at your home?'",
          getSayText: () =>
            `“Can I just confirm, are you currently using this telephone service at your home?”`,
          pauseInstruction: "Pause and listen for home service confirmation.",
          quickResponses: [
            {
              label: "YES (Using at home)",
              actionDescription: "Customer confirms home use.",
              autoFill: { isUsingAtHome: "YES" },
              nextStage: "STAGE_5_CURRENT_BILL",
              guidance: "Say: “Perfect, thank you. I'll just confirm a couple more details.”",
            },
            {
              label: "NO (Not at home)",
              actionDescription: "Customer says it is not a home line.",
              autoFill: { isUsingAtHome: "NO" },
              guidance: "Say: “No problem. Let me make sure I have the correct service information before we continue.”",
            },
            {
              label: "DON'T KNOW / UNSURE",
              actionDescription: "Customer is unsure.",
              autoFill: { isUsingAtHome: "DONT_KNOW" },
              guidance: "Say: “That's completely fine. I'll ask another simple question to help confirm the service.”",
            },
          ],
          why: "Ensures the telephone service is eligible residential service before discussing pricing.",
          nextStage: "STAGE_5_CURRENT_BILL",
          prevStage: "STAGE_3_VERIFICATION_COMPLETED",
        };

      // -------------------------------------------------------------
      // STAGE 5 — CURRENT MONTHLY BILL (Section 10)
      // -------------------------------------------------------------
      case "STAGE_5_CURRENT_BILL":
        return {
          stage: "STAGE_5_CURRENT_BILL",
          stageNumber: 5,
          stageName: "Stage 5 — Current Monthly Bill",
          objective: "Ask customer roughly how much they currently pay each month for their telephone service",
          goldenRuleNote: "Ask for rough monthly cost. Do not force an exact decimal if they give an estimate.",
          getSayText: () =>
            `“Could you tell me roughly how much you're currently paying each month for your telephone service?”`,
          pauseInstruction: "Pause and listen. Allow them to check their bill if needed.",
          quickResponses: [
            {
              label: "Customer gives amount (e.g. £50 - £80)",
              actionDescription: "Customer provides approximate or exact bill amount.",
              nextStage: "STAGE_6_EXPLAINING_REDUCTION",
              guidance: "Say: “Thank you. That gives me a better idea of your current monthly cost.”",
            },
            {
              label: "Customer doesn't know",
              actionDescription: "Customer does not know the amount.",
              guidance: "Say: “That's fine. If you have your latest bill nearby, you can check it for me.”",
            },
            {
              label: "“I already have a discount”",
              actionDescription: "Customer mentions an existing promotional tariff.",
              guidance: "Say: “That's fine. I'll take that into account when checking the current service. The purpose of the call is to see whether any available reduction applies to your account.”",
            },
            {
              label: "“My bill is already cheap”",
              actionDescription: "Customer says they already pay a low bill.",
              guidance: "Say: “That's good to hear. I'll simply check the current service before saying whether anything can be reduced. If there is no further reduction available, I'll tell you clearly.”",
            },
          ],
          why: "Baseline billing is required to calculate the exact 30% reduction accurately.",
          nextStage: "STAGE_6_EXPLAINING_REDUCTION",
          prevStage: "STAGE_4_CURRENT_SERVICE",
        };

      // -------------------------------------------------------------
      // STAGE 6 — EXPLAINING THE REDUCTION (Section 11)
      // -------------------------------------------------------------
      case "STAGE_6_EXPLAINING_REDUCTION":
        return {
          stage: "STAGE_6_EXPLAINING_REDUCTION",
          stageNumber: 6,
          stageName: "Stage 6 — Explaining The Reduction",
          objective: "Explain how the available 30% reduction lowers monthly cost based on the service details checked",
          goldenRuleNote: "Explain reduction in two short sentences. Do not guess exact figures until verified.",
          getSayText: () =>
            `“Based on the information you've given me, the available reduction could lower your monthly telephone cost.\n\nThe exact amount depends on your current service and the details we've just checked.”`,
          pauseInstruction: "Pause and confirm the customer understands before moving to final review.",
          quickResponses: [
            {
              label: "Customer is Interested",
              actionDescription: "Customer is positive and wants to proceed.",
              nextStage: "STAGE_7_FINAL_CONFIRMATION",
              guidance: "Say: “That's good. I'll quickly go through the remaining details with you. This is just to make sure the information on the account is correct before we continue.”",
            },
            {
              label: "“How much exactly?”",
              actionDescription: "Customer asks for the exact penny amount.",
              guidance: "Say: “I'll confirm the exact figure once the remaining details have been checked. I don't want to give you an incorrect amount before everything is verified.”",
            },
            {
              label: "“How much will I save?”",
              actionDescription: "Customer asks about savings breakdown.",
              guidance: "Say: “The reduction can be up to 30%, depending on your current service and monthly bill. I'll check your details first, so I can give you the correct information rather than guessing.”",
            },
            {
              label: "“Is this a new contract?”",
              actionDescription: "Customer asks about contract terms.",
              guidance: "Say: “Before I give you an answer, I'll check the details of your current service. I'll then explain whether the reduction involves any change to your existing service or agreement.”",
            },
            {
              label: "Customer is Confused",
              actionDescription: "Customer finds the explanation unclear.",
              guidance: "Say: “No problem at all. I'll keep it simple. I'm checking your current telephone service to see whether the available bill reduction applies to you.”",
            },
          ],
          why: "Presents commercial benefit clearly without exaggerated claims or premature promises.",
          nextStage: "STAGE_7_FINAL_CONFIRMATION",
          prevStage: "STAGE_5_CURRENT_BILL",
        };

      // -------------------------------------------------------------
      // STAGE 7 — FINAL CONFIRMATION (Section 45)
      // -------------------------------------------------------------
      case "STAGE_7_FINAL_CONFIRMATION":
        return {
          stage: "STAGE_7_FINAL_CONFIRMATION",
          stageNumber: 7,
          stageName: "Stage 7 — Final Confirmation",
          objective: "Thank customer for going through details and prepare to explain reduction & terms",
          goldenRuleNote: "One short paragraph setting expectations for terms review.",
          getSayText: () =>
            `“Thank you for going through those details with me.\n\nI'll now explain the available reduction and any important terms before you decide whether you want to continue.”`,
          pauseInstruction: "Pause and check if customer is ready for terms.",
          quickResponses: [
            {
              label: "Customer agrees to continue",
              actionDescription: "Customer confirms they are ready.",
              nextStage: "STAGE_8_BEFORE_AGREEMENT",
              guidance: "Say: “Perfect, thank you. I'll keep everything simple and go through the remaining details one at a time.”",
            },
            {
              label: "“I want to think about it”",
              actionDescription: "Customer wants thinking time.",
              guidance: "Say: “Of course. There's no problem with taking some time to think about it. I'll make sure you've understood the reduction and what it means before you make any decision.”",
            },
            {
              label: "“I need to speak to my family”",
              actionDescription: "Customer wishes to consult family.",
              guidance: "Say: “That's completely fine. It's always better to discuss changes to your service with anyone else involved in managing the household bills.”",
            },
            {
              label: "“Just send me something”",
              actionDescription: "Customer wants written postal details.",
              guidance: "Say: “That's understandable. I'll explain what the offer involves first, so you know exactly what information you're being sent and why.”",
            },
          ],
          why: "Transparent transition ensuring customer never feels rushed into a decision.",
          nextStage: "STAGE_8_BEFORE_AGREEMENT",
          prevStage: "STAGE_6_EXPLAINING_REDUCTION",
        };

      // -------------------------------------------------------------
      // STAGE 8 — BEFORE ANY AGREEMENT (Section 46)
      // -------------------------------------------------------------
      case "STAGE_8_BEFORE_AGREEMENT":
        return {
          stage: "STAGE_8_BEFORE_AGREEMENT",
          stageNumber: 8,
          stageName: "Stage 8 — Before Any Agreement",
          objective: "Verify customer understands price, service, and all relevant terms before concluding",
          goldenRuleNote: "Ensure absolute transparency and encourage questions.",
          getSayText: () =>
            `“Before we go any further, I'll make sure you understand the price, service, and any relevant terms.\n\nIf anything is unclear, please ask me and I'll explain it.”`,
          pauseInstruction: "Pause and listen carefully. Answer all customer questions thoroughly.",
          quickResponses: [
            {
              label: "Customer understands & is ready",
              actionDescription: "Customer indicates complete understanding.",
              nextStage: "STAGE_9_CUSTOMER_DECISION",
            },
            {
              label: "Customer has a question",
              actionDescription: "Customer asks for clarification.",
              guidance: "Say: “Of course. What would you like me to explain? I'll answer that first, then we can continue from where we stopped.”",
            },
            {
              label: "Customer asks you to repeat",
              actionDescription: "Customer wants the line repeated.",
              guidance: "Say: “Of course. I'll say it again slowly and keep it as simple as possible.”",
            },
            {
              label: "“I'm not sure”",
              actionDescription: "Customer is hesitant or undecided.",
              guidance: "Say: “That's completely fine. I'll explain the part you're unsure about, and then you can decide whether you want to continue.”",
            },
            {
              label: "“Will my number change?”",
              actionDescription: "Customer asks about phone number retention.",
              guidance: "Say: “I'll explain any service changes before anything is agreed. I don't want you to continue without understanding exactly what would happen.”",
            },
            {
              label: "“Will my service stop?”",
              actionDescription: "Customer asks about service interruption.",
              guidance: "Say: “No, the purpose is to discuss the available reduction on your service. I'll explain any changes clearly before anything is agreed or processed.”",
            },
          ],
          why: "Mandatory compliance checkpoint: Full disclosure before agreement.",
          nextStage: "STAGE_9_CUSTOMER_DECISION",
          prevStage: "STAGE_7_FINAL_CONFIRMATION",
        };

      // -------------------------------------------------------------
      // STAGE 9 — CUSTOMER DECISION & CLOSE (Sections 48, 49, 43)
      // -------------------------------------------------------------
      case "STAGE_9_CUSTOMER_DECISION":
      default:
        return {
          stage: "STAGE_9_CUSTOMER_DECISION",
          stageNumber: 9,
          stageName: "Stage 9 — Customer Decision",
          objective: "Receive the customer's decision on the 30% reduction and close politely and professionally",
          goldenRuleNote: "Respect customer decision immediately without pressure.",
          getSayText: () =>
            `“Would you like to proceed with the 30% reduction on your telephone service?”`,
          pauseInstruction: "Listen to the customer's final response.",
          quickResponses: [
            {
              label: "Customer says YES (Section 48)",
              actionDescription: "Customer accepts the reduction.",
              autoFill: { customerDecision: "YES" },
              guidance: "Say: “Perfect. Thank you for confirming. I'll now go through the next step with you and make sure everything is clear.”",
            },
            {
              label: "Customer says NO (Section 49)",
              actionDescription: "Customer declines the reduction.",
              autoFill: { customerDecision: "NO" },
              guidance: "Say: “No problem at all. I respect your decision. Thank you for your time, and I'll leave it there.”",
            },
            {
              label: "Customer wants to end call (Section 43)",
              actionDescription: "Customer wishes to conclude the conversation.",
              guidance: "Say: “Of course. I won't keep you. Thank you for your time, and I hope you have a lovely day.”",
            },
            {
              label: "Remove number (Section 41/42)",
              actionDescription: "Customer requests no further contact.",
              category: "DO_NOT_CALL",
              guidance: "Say: “Understood. I won't continue with the call. I'll follow the company's process for your request regarding future contact.”",
            },
          ],
          why: "Gives customer full autonomy and executes compliant conclusion.",
          nextStage: "CALL_COMPLETED" as MasterStage,
          prevStage: "STAGE_8_BEFORE_AGREEMENT",
        };
    }
  }
}
