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

export const STAGES_LIST: MasterStage[] = [
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
    return "Mr. Customer";
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
      parts.push(`Broadband: ${customer.broadbandStatus.replace("_", " ")}`);
    }
    if (customer.callVolume) {
      parts.push(`Calls: ${customer.callVolume}`);
    }
    return parts.length > 0 ? parts.join(", ") : "active telephone line";
  }

  /**
   * Get the complete definition for any of the 9 Master Steps of the Telecom Script
   */
  public static getStageDefinition(
    stage: MasterStage,
    customer: CustomerRecord,
    config: OfferConfig
  ): StageDefinition {
    switch (stage) {
      // =============================================================
      // STEP 1 — OPENING 1 & OPENING 2
      // =============================================================
      case "STEP_1_OPENING_TECHNICAL":
      case "PHASE_1_INTRODUCTION":
      case "STAGE_1_OPENING":
        return {
          stage: "STEP_1_OPENING_TECHNICAL",
          stageNumber: 1,
          stageName: "Step 1: Opening (Opening 1 / Opening 2)",
          stepShortTitle: "Opening (1 or 2)",
          objective: "Deliver Opening 1 (feedback / 30% reduction) or Opening 2 (digital conversion).",
          goldenRuleNote: "Switch seamlessly between Opening 1 and Opening 2 based on time of day and campaign target.",
          getSayText: (cust) => {
            if (cust.selectedOpening === "OPENING_2") {
              return `Hi, very good morning to you. Am I speaking with Mr. Customer?\nMy name is ______i m calling u in regards to your home phone no. I’m sure you are already aware that in the coming future everything is going to be digital because the normal copper line is converting into digital one. Hence there is an opportunity for bill reduction this year.`;
            }
            return `Me : Hello.... yeah hiii, Am i speaking to Mr xxxxxx, \nCx : yeah Me : Hello Mr Campbell, a lovely afternoon to you, this side _______ Calling regarding your landline that is currently active at your property.\nJust wanted to see your feedback on the services,if there is a scope for improvement?\nOr\nJust wanted to update, that your phone line is eligible for a reduction up to 30% this year.\nOk ? Take the response !!!`;
          },
          pauseInstruction: "Ok ? Take the response !!! Listen for customer reply.",
          quickResponses: [
            {
              label: "Opening 1: “Okay” / “Yes”",
              actionDescription: "Customer confirms phone line and agrees to hear update.",
              autoFill: { selectedOpening: "OPENING_1", personalDetailsConfirmed: true },
              nextStage: "STEP_2_PROBABILITY_DISCOVERY",
              guidance: "Follow down the arrow (↓) to probability discovery.",
            },
            {
              label: "Opening 2: “Yes, speaking”",
              actionDescription: "Customer confirms Mr. Customer and listens to digital switchover.",
              autoFill: { selectedOpening: "OPENING_2", personalDetailsConfirmed: true },
              nextStage: "STEP_2_PROBABILITY_DISCOVERY",
              guidance: "Follow down the arrow (↓) to probability discovery.",
            },
            {
              label: "Switch to Opening 1 (Afternoon)",
              actionDescription: "Use Opening 1 (Feedback or 30% reduction).",
              autoFill: { selectedOpening: "OPENING_1" },
            },
            {
              label: "Switch to Opening 2 (Morning)",
              actionDescription: "Use Opening 2 (Digital conversion).",
              autoFill: { selectedOpening: "OPENING_2" },
            },
          ],
          why: "Dual opening gives the agent flexibility to lead with service feedback / 30% reduction or nationwide copper-to-digital switchover.",
          nextStage: "STEP_2_PROBABILITY_DISCOVERY",
        };

      // =============================================================
      // STEP 2 — PROBABILITY DISCOVERY & QUALIFICATION
      // =============================================================
      case "STEP_2_PROBABILITY_DISCOVERY":
      case "PHASE_2_TRANSITION_HOOK":
      case "STAGE_4_CURRENT_SERVICE":
      case "STAGE_5_CURRENT_BILL":
        return {
          stage: "STEP_2_PROBABILITY_DISCOVERY",
          stageNumber: 2,
          stageName: "Step 2: Probability Discovery & Qualification",
          stepShortTitle: "Probability Discovery",
          objective: "Qualify call volume (quite a lot vs incoming calls), broadband presence, and current monthly phone bill.",
          goldenRuleNote: "Ask all 3 discovery questions in order. If they are highly confused about what they pay or who their provider is, take note.",
          getSayText: () =>
            `To make sure I look at the right options for you, May I know if  you are  using your home phone quite a lot for making calls, or is it mostly just there for incoming calls?"\n\n (Wait for customer response. Listen to see if they follow the question easily.)\n"And do you also have your internet or broadband running on this exact same line?"\n (Wait for customer response.)\nPerfect, thank you. To ensure our digital packages make sense for you financially, could you give me a rough idea of what you currently pay each month for your phone bill? Is it around £40 , £50 or over £60 a month , or perhaps a bit more or less than that?"\n\n (Wait for customer response. If they are highly confused about what they pay or who their provider is, take note.)`,
          pauseInstruction: "Wait for customer response. Listen to see if they follow easily. If confused, take note.",
          quickResponses: [
            {
              label: "Mostly incoming calls • No broadband • Around £40-£50",
              actionDescription: "Landline Only branch.",
              autoFill: {
                callVolume: "LOW_HARDLY_ANY",
                broadbandStatus: "NO_BROADBAND",
                monthlyBill: 48,
              },
              nextStage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
              guidance: "Proceed to transition pitch for Sparta digital service.",
            },
            {
              label: "Using phone quite a lot • Broadband running on line • Around £50-£60+",
              actionDescription: "Broadband bundle branch.",
              autoFill: {
                callVolume: "HIGH_FREQUENT",
                broadbandStatus: "NORMAL_BROADBAND",
                monthlyBill: 58,
              },
              nextStage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
              guidance: "Proceed to transition pitch for Sparta digital service.",
            },
            {
              label: "⚠️ Customer confused about bill / provider",
              actionDescription: "Note customer confusion for compliance and soft pacing.",
              autoFill: { billOrProviderConfused: true },
              guidance: "Take note and proceed patiently with approximate figures.",
            },
          ],
          why: "Probability discovery establishes customer needs and matches them to the exact Sparta Telecom tariff.",
          nextStage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
          prevStage: "STEP_1_OPENING_TECHNICAL",
        };

      // =============================================================
      // STEP 3 — DYNAMIC PACKAGE PITCH & SAVINGS
      // =============================================================
      case "STEP_3_DYNAMIC_PACKAGE_PITCH":
      case "PHASE_3_BUNDLE_PRICE_GUARANTEE":
      case "STAGE_6_EXPLAINING_REDUCTION":
        return {
          stage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
          stageNumber: 3,
          stageName: "Step 3: Dynamic Package Pitch & Savings",
          stepShortTitle: "Transition & Savings",
          objective: "Transition customer to digital service with Sparta Telecom, keeping same line & number unchanged, quoting monthly and 24-month savings.",
          goldenRuleNote: "State monthly savings and total 2-year savings back in their pocket over effective 24 months.",
          getSayText: () =>
            `Based on what you've told me, we can transition you over to a digital service with Sparta Telecom. This will keep your exact same phone number and line completely unchanged, but it will bring your bill down to just £[Insert monthly price].\nThis means you will save £[Insert monthly savings] every single month. Over the course of the 24-month agreement, that adds up to a total saving of £[Insert total 2-year savings] back in your pocket.\nHope it sounds good to you?\n(Wait for customer response.\n All of these savings are coming to you on the same line on your same number without changing anything from  Sparta telecom for an effective 24 months, that means you will be saving every month £___   if i talk about in 2 years you will be saving £_____.`,
          pauseInstruction: "Hope it sounds good to you? (Wait for customer response.)",
          quickResponses: [
            {
              label: "Customer: “Sounds good” / “Okay”",
              actionDescription: "Customer confirms savings and accepts digital transition.",
              autoFill: { termsUnderstood: true, pricePromiseAcknowledged: true },
              nextStage: "STEP_4_SPARTA_BRAND_DROP",
              guidance: "Proceed to details verification and primary account holder check.",
            },
            {
              label: "“How much will I save?”",
              actionDescription: "Quote calculated monthly and 2-year savings.",
              guidance: "Quote £[Insert monthly savings] per month and £[Insert total 2-year savings] over the 24-month agreement.",
            },
          ],
          why: "Clear statement of 24-month agreement savings reinforces value on unchanged line and number.",
          nextStage: "STEP_4_SPARTA_BRAND_DROP",
          prevStage: "STEP_2_PROBABILITY_DISCOVERY",
        };

      // =============================================================
      // STEP 4 — DETAILS & PRIMARY DECISION MAKER VERIFICATION
      // =============================================================
      case "STEP_4_SPARTA_BRAND_DROP":
        return {
          stage: "STEP_4_SPARTA_BRAND_DROP",
          stageNumber: 4,
          stageName: "Step 4: Details & Primary Decision Maker Verification",
          stepShortTitle: "Details Verification",
          objective: "Verify phone number, customer name, address, DOB, and confirm primary account holder regulatory guideline.",
          goldenRuleNote: "Must confirm customer is primary account holder and handles utility decisions for this household.",
          getSayText: () =>
            `So in order to provide you to these savings and digital services i have your number with me 123455466 Your name with me Mr /Mrs/Miss/Ms_____\n Your address _______\nYour dob__________\nThank you. And just to confirm our regulatory guidelines, are you the primary account holder and the person who handles the utility decisions for this household?"\n \n (Wait for customer response.)`,
          pauseInstruction: "Wait for customer response. Confirm primary account holder and utility decisions.",
          quickResponses: [
            {
              label: "✓ Yes, Primary Account Holder & Decision Maker",
              actionDescription: "Customer confirms they handle household utility decisions.",
              autoFill: {
                isPrimaryAccountHolder: true,
                handlesUtilityDecisions: true,
                personalDetailsConfirmed: true,
              },
              nextStage: "STEP_5_VERIFICATION_AGE_RAPPORT",
              guidance: "Proceed to Direct Debit and social alarm safety check.",
            },
            {
              label: "❌ Not Primary Decision Maker",
              actionDescription: "Customer does not handle utility decisions.",
              autoFill: { isPrimaryAccountHolder: false, handlesUtilityDecisions: false },
              guidance: "Ask when the primary account holder is available to speak.",
            },
          ],
          why: "Regulatory compliance mandates that contract agreements are made with the authorized household utility decision maker.",
          nextStage: "STEP_5_VERIFICATION_AGE_RAPPORT",
          prevStage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
        };

      // =============================================================
      // STEP 5 — DIRECT DEBIT MODE & SOCIAL ALARM CHECK
      // =============================================================
      case "STEP_5_VERIFICATION_AGE_RAPPORT":
      case "STAGE_2_VERIFICATION_ID":
        return {
          stage: "STEP_5_VERIFICATION_AGE_RAPPORT",
          stageNumber: 5,
          stageName: "Step 5: Direct Debit Mode & Social Alarm / Pendant Check",
          stepShortTitle: "Direct Debit & Alarm",
          objective: "Confirm payment remains Direct Debit and conduct critical social alarm / pendant safety check.",
          goldenRuleNote: "If alarm is digital, must verify if it plugs into internet router or standard electrical wall socket.",
          getSayText: () =>
            `As you pay your bills by direct debit at the moment so your mode of payment will remain the same as it is with Sparta telecom.\n"Perfect. Since you currently pay your bills via Direct Debit, that secure payment method will stay exactly the same with us at Sparta Telecom. There's nothing new you need to set up there.\nNow, your safety is very important to us, especially with the digital switchover. Do you currently use any type of social alarm, pendant, or personal safety button connected to your phone line?"\n[If NO]: "Excellent, we can move right along."\n[If YES & Line is Copper]: "Perfect, we can proceed. Just to let you know, our team will ensure this transitions smoothly."\n[If YES & Line is Digital]: "Ah, I see. Could you let me know if that alarm plugs directly into your internet router, or does it plug into a standard electrical wall socket?" (Must be electricity to`,
          pauseInstruction: "Check alarm. If NO move along; if Copper transitions smoothly; if Digital verify electrical socket.",
          quickResponses: [
            {
              label: "[If NO]: Excellent, we can move right along",
              actionDescription: "No social alarm or pendant in use.",
              autoFill: { socialAlarmStatus: "NO", medicalAlarm: false },
              nextStage: "STEP_6_FREE_SERVICES_EXTENSIONS",
              guidance: "Move right along to calling features.",
            },
            {
              label: "[If YES & Line is Copper]: Transitions smoothly",
              actionDescription: "Alarm connected to copper line.",
              autoFill: { socialAlarmStatus: "YES_COPPER", medicalAlarm: true },
              nextStage: "STEP_6_FREE_SERVICES_EXTENSIONS",
              guidance: "Team will ensure this transitions smoothly.",
            },
            {
              label: "[If YES & Line is Digital]: Electrical wall socket",
              actionDescription: "Digital alarm plugs into standard electrical wall socket.",
              autoFill: { socialAlarmStatus: "YES_DIGITAL_SOCKET", medicalAlarm: true },
              nextStage: "STEP_6_FREE_SERVICES_EXTENSIONS",
              guidance: "Proceed with electrical wall socket confirmation.",
            },
          ],
          why: "Customer safety during digital conversion is paramount; alarm compatibility must be verified.",
          nextStage: "STEP_6_FREE_SERVICES_EXTENSIONS",
          prevStage: "STEP_4_SPARTA_BRAND_DROP",
        };

      // =============================================================
      // STEP 6 — FREE CALLING FEATURES & PAPER ITEMIZED BILL
      // =============================================================
      case "STEP_6_FREE_SERVICES_EXTENSIONS":
        return {
          stage: "STEP_6_FREE_SERVICES_EXTENSIONS",
          stageNumber: 6,
          stageName: "Step 6: Free Calling Features & Paper Itemized Bill",
          stepShortTitle: "Features & Paper Bill",
          objective: "Confirm free 1471/1571 voicemail and paper itemized bill (2 months free, then £1, deactivate anytime).",
          goldenRuleNote: "1571 voicemail is free. Paper bill free for 2 months, then £1, can deactivate anytime.",
          getSayText: () =>
            `You use any calling features like 1471/1571 1571 voice mail calling feature is free for you .\nWe will send u a paper itemized bill which is free for u for the first 2 months afterwards if u wish to continue it will only cost 1 pound on top of your package and you can deactivate the paper bill any time you want.`,
          pauseInstruction: "Customer confirms calling features and paper bill terms.",
          quickResponses: [
            {
              label: "Customer: “Okay” / Agrees",
              actionDescription: "Customer confirms calling features and paper bill terms.",
              autoFill: { callingFeaturesConfirmed: true, paperBillConfirmed: true },
              nextStage: "STEP_7_ENGINEER_ROUTER_COST",
              guidance: "Proceed to Sparta platform and independent company explanation.",
            },
          ],
          why: "Provides transparent reassurance on free voicemail features and optional £1 paper bill.",
          nextStage: "STEP_7_ENGINEER_ROUTER_COST",
          prevStage: "STEP_5_VERIFICATION_AGE_RAPPORT",
        };

      // =============================================================
      // STEP 7 — SPARTA PLATFORM & INDEPENDENT COMPANY
      // =============================================================
      case "STEP_7_ENGINEER_ROUTER_COST":
      case "PHASE_4_HARDWARE_INSTALLATION":
        return {
          stage: "STEP_7_ENGINEER_ROUTER_COST",
          stageNumber: 7,
          stageName: "Step 7: Sparta Telecom BT Platform & Independent Company",
          stepShortTitle: "Sparta Platform",
          objective: "Confirm working on same platform as BT works, while clarifying separate and independent company status.",
          goldenRuleNote: "Clarify Sparta works on same platform as BT, but is totally separate and independent from BT, Talk Talk, Italk, EE, Plusnet.",
          getSayText: () =>
            `So all these savings and digital services are coming to you with the help of Sparta Telecom and we are working on the same platform as BT works. However we are a totally separate and independent company from BT, Talk Talk, Italk ,EE , Plusnet.\nWait For cx response!`,
          pauseInstruction: "Wait For cx response! Confirm customer understands independent provider status.",
          quickResponses: [
            {
              label: "Customer: “Understood” / Acknowledges",
              actionDescription: "Customer acknowledges Sparta is independent on BT platform.",
              autoFill: { spartaBtPlatformAcknowledged: true, brandDropAcknowledged: true },
              nextStage: "STEP_8_DIRECT_DEBIT_DPA1998",
              guidance: "Proceed to compliance verification day question.",
            },
          ],
          why: "Clear platform disclosure satisfies regulatory transparency and avoids brand confusion.",
          nextStage: "STEP_8_DIRECT_DEBIT_DPA1998",
          prevStage: "STEP_6_FREE_SERVICES_EXTENSIONS",
        };

      // =============================================================
      // STEP 8 — COMPLIANCE COGNITIVE / DAY VERIFICATION
      // =============================================================
      case "STEP_8_DIRECT_DEBIT_DPA1998":
        return {
          stage: "STEP_8_DIRECT_DEBIT_DPA1998",
          stageNumber: 8,
          stageName: "Step 8: Compliance Cognitive / Day Verification",
          stepShortTitle: "Compliance Day Check",
          objective: "Ask compliance day verification question: Sunday, Monday, or Tuesday.",
          goldenRuleNote: "Ask what day of the week it is today: Sunday, Monday, or Tuesday. Ensures customer comfort and comprehension.",
          getSayText: () =>
            `"Wonderful. To wrap things up, our compliance team requires me to ask a quick verification question to ensure you feel completely comfortable with everything we've discussed. Just for the record, could you confirm for me what day of the week it is today? Is it Sunday, Monday, or Tuesday?"\n Wait For cx response!`,
          pauseInstruction: "Wait For cx response! Listen for customer's response to day of the week.",
          quickResponses: [
            {
              label: "Customer Answers Day Correctly",
              actionDescription: "Customer confirms day of the week.",
              autoFill: { isDayVerified: true },
              nextStage: "STEP_9_VERIFICATION_HANDOFF",
              guidance: "Proceed with 'Spot on!' and handoff to verification officer.",
            },
          ],
          why: "Cognitive comfort question guarantees customer is lucid, comfortable, and fully following the agreement.",
          nextStage: "STEP_9_VERIFICATION_HANDOFF",
          prevStage: "STEP_7_ENGINEER_ROUTER_COST",
        };

      // =============================================================
      // STEP 9 — VERIFICATION OFFICER HANDOFF
      // =============================================================
      case "STEP_9_VERIFICATION_HANDOFF":
      case "PHASE_5_VERIFICATION_CLOSING":
      case "STAGE_7_FINAL_CONFIRMATION":
      case "STAGE_8_BEFORE_AGREEMENT":
      case "STAGE_9_CUSTOMER_DECISION":
      default:
        return {
          stage: "STEP_9_VERIFICATION_HANDOFF",
          stageNumber: 9,
          stageName: "Step 9: Verification Officer Handoff",
          stepShortTitle: "Verification Handoff",
          objective: "Confirm pleasant experience ('Spot on!') and introduce customer to verification officer for 2-minute discount confirmation.",
          goldenRuleNote: "Thank customer by name (Mrs. Smith) and hold line for verification officer.",
          getSayText: () =>
            `"Spot on! The reason I ask is just to ensure we've taken our time today, had a clear conversation, and that you are happy with how everything was explained.\nI’m now going to introduce you to my verification officer. They will spend just two minutes re-verifying these details to ensure everything is perfectly accurate and that you've received the exact discount promised. Thank you so much for your time, Mrs. Smith, holding the line for just a moment!"`,
          pauseInstruction: "Hold line and hand over to verification officer.",
          quickResponses: [
            {
              label: "✓ Handoff to Verification Officer",
              actionDescription: "Customer agrees to 2-minute reverification. Lead successfully completed!",
              autoFill: {
                finalConfirmationGiven: true,
                customerDecision: "YES",
                verificationOfficerHandoff: true,
              },
              guidance: "Lead successfully completed! Connect call to verification officer.",
            },
          ],
          why: "Two-minute verification officer check guarantees audit-proof lead validity and customer satisfaction.",
          nextStage: "STEP_9_VERIFICATION_HANDOFF",
          prevStage: "STEP_8_DIRECT_DEBIT_DPA1998",
        };
    }
  }
}
