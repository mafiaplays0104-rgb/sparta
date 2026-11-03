import { MasterStage, CustomerRecord, OfferConfig } from "../types";

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
   * Generates all interactive units for the Telecom Script with exact word-for-word fidelity
   */
  public static getAllUnits(customer: CustomerRecord, _config: OfferConfig): ScriptUnit[] {
    const units: ScriptUnit[] = [
      // =====================================================================
      // STEP 1 — OPENING 1 & OPENING 2
      // =====================================================================
      {
        id: "s1_u1",
        stage: "STEP_1_OPENING_TECHNICAL",
        stageNumber: 1,
        stageName: "Opening",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: (cust) => {
          if (cust.selectedOpening === "OPENING_2") {
            return `Hi, very good morning to you. Am I speaking with Mr. Customer?\nMy name is ______i m calling u in regards to your home phone no. I’m sure you are already aware that in the coming future everything is going to be digital because the normal copper line is converting into digital one. Hence there is an opportunity for bill reduction this year.`;
          }
          return `Me : Hello.... yeah hiii, Am i speaking to Mr xxxxxx, \nCx : yeah Me : Hello Mr Campbell, a lovely afternoon to you, this side _______ Calling regarding your landline that is currently active at your property.\nJust wanted to see your feedback on the services,if there is a scope for improvement?\nOr\nJust wanted to update, that your phone line is eligible for a reduction up to 30% this year.\nOk ? Take the response !!!`;
        },
        expectedCustomerReply: "yeah / Ok",
        subNote: "Opening 1 (Afternoon feedback / 30% reduction) or Opening 2 (Morning digital conversion).",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "Switch to Opening 1 (Afternoon)",
            action: (_c, onUpdate) => onUpdate({ selectedOpening: "OPENING_1" }),
          },
          {
            label: "Switch to Opening 2 (Morning)",
            action: (_c, onUpdate) => onUpdate({ selectedOpening: "OPENING_2" }),
          },
          {
            label: "✓ Customer: “Yeah” / “Ok” (Proceed)",
            action: (_c, onUpdate) => onUpdate({ personalDetailsConfirmed: true }),
          },
        ],
      },

      // =====================================================================
      // STEP 2 — PROBABILITY DISCOVERY & QUALIFICATION
      // =====================================================================
      {
        id: "s2_u1",
        stage: "STEP_2_PROBABILITY_DISCOVERY",
        stageNumber: 2,
        stageName: "Probability Discovery & Qualification",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () =>
          `To make sure I look at the right options for you, May I know if  you are  using your home phone quite a lot for making calls, or is it mostly just there for incoming calls?"\n\n (Wait for customer response. Listen to see if they follow the question easily.)`,
        expectedCustomerReply: "(Wait for customer response. Listen to see if they follow the question easily.)",
        subNote: "Discovery Q1: Qualify home phone call volume.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "Using phone quite a lot for making calls",
            action: (_c, onUpdate) => onUpdate({ callVolume: "HIGH_FREQUENT", landlineUsage: "HIGH" }),
          },
          {
            label: "Mostly just there for incoming calls",
            action: (_c, onUpdate) => onUpdate({ callVolume: "LOW_HARDLY_ANY", landlineUsage: "INCOMING_ONLY" }),
          },
        ],
      },
      {
        id: "s2_u2",
        stage: "STEP_2_PROBABILITY_DISCOVERY",
        stageNumber: 2,
        stageName: "Probability Discovery & Qualification",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: () => `"And do you also have your internet or broadband running on this exact same line?"\n (Wait for customer response.)`,
        expectedCustomerReply: "(Wait for customer response.)",
        subNote: "Discovery Q2: Broadband running on exact same line.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "No broadband (Landline only)",
            action: (_c, onUpdate) => onUpdate({ broadbandStatus: "NO_BROADBAND", billIncludesBroadband: false }),
          },
          {
            label: "Yes, broadband running on exact same line",
            action: (_c, onUpdate) => onUpdate({ broadbandStatus: "NORMAL_BROADBAND", billIncludesBroadband: true }),
          },
          {
            label: "Yes, fibre broadband running on line",
            action: (_c, onUpdate) => onUpdate({ broadbandStatus: "FIBRE_BROADBAND", billIncludesBroadband: true }),
          },
        ],
      },
      {
        id: "s2_u3",
        stage: "STEP_2_PROBABILITY_DISCOVERY",
        stageNumber: 2,
        stageName: "Probability Discovery & Qualification",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () =>
          `Perfect, thank you. To ensure our digital packages make sense for you financially, could you give me a rough idea of what you currently pay each month for your phone bill? Is it around £40 , £50 or over £60 a month , or perhaps a bit more or less than that?"\n\n (Wait for customer response. If they are highly confused about what they pay or who their provider is, take note.)`,
        expectedCustomerReply: "(Wait for customer response. If they are highly confused about what they pay or who their provider is, take note.)",
        subNote: "Discovery Q3: Current bill (£40, £50, £60+). Take note if highly confused.",
        isPauseAndListen: true,
        inputType: "BILL_INPUT",
        quickOptions: [
          {
            label: "Around £40 a month",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 40.0, billApproximate: true }),
          },
          {
            label: "Around £50 a month",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 50.0, billApproximate: true }),
          },
          {
            label: "Over £60 a month (£65)",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 65.0, billApproximate: true }),
          },
          {
            label: "⚠️ Customer highly confused (Take Note)",
            action: (_c, onUpdate) => onUpdate({ billOrProviderConfused: true }),
          },
        ],
      },

      // =====================================================================
      // STEP 3 — DYNAMIC PACKAGE PITCH & SAVINGS
      // =====================================================================
      {
        id: "s3_u1",
        stage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
        stageNumber: 3,
        stageName: "Dynamic Package Pitch & Savings",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `Based on what you've told me, we can transition you over to a digital service with Sparta Telecom. This will keep your exact same phone number and line completely unchanged, but it will bring your bill down to just £[Insert monthly price].\nThis means you will save £[Insert monthly savings] every single month. Over the course of the 24-month agreement, that adds up to a total saving of £[Insert total 2-year savings] back in your pocket.\nHope it sounds good to you?\n(Wait for customer response.`,
        expectedCustomerReply: "(Wait for customer response.",
        subNote: "Pitch digital transition with Sparta Telecom, same phone number & line unchanged, with monthly and 2-year savings.",
        isPauseAndListen: true,
        inputType: "VAT_CALCULATOR",
        quickOptions: [
          {
            label: "Customer: “Sounds good to me”",
            action: (_c, onUpdate) => onUpdate({ termsUnderstood: true }),
          },
        ],
      },
      {
        id: "s3_u2",
        stage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
        stageNumber: 3,
        stageName: "Dynamic Package Pitch & Savings",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `All of these savings are coming to you on the same line on your same number without changing anything from  Sparta telecom for an effective 24 months, that means you will be saving every month £___   if i talk about in 2 years you will be saving £_____.`,
        expectedCustomerReply: "(Customer: That sounds great / Okay.)",
        subNote: "Reiterate effective 24 months savings on same line, same number.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "Customer Confirms 24-Month Savings",
            action: (_c, onUpdate) => onUpdate({ pricePromiseAcknowledged: true }),
          },
        ],
      },

      // =====================================================================
      // STEP 4 — DETAILS & PRIMARY DECISION MAKER VERIFICATION
      // =====================================================================
      {
        id: "s4_u1",
        stage: "STEP_4_SPARTA_BRAND_DROP",
        stageNumber: 4,
        stageName: "Details & Primary Decision Maker Verification",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `So in order to provide you to these savings and digital services i have your number with me 123455466 Your name with me Mr /Mrs/Miss/Ms_____\n Your address _______\nYour dob__________`,
        expectedCustomerReply: "(Customer: That's right / Confirmed.)",
        subNote: "Verify number, name, address, and date of birth.",
        isPauseAndListen: true,
        inputType: "DOB_INPUT",
        quickOptions: [
          {
            label: "✓ Details Confirmed",
            action: (_c, onUpdate) => onUpdate({ addressConfirmed: true, personalDetailsConfirmed: true }),
          },
        ],
      },
      {
        id: "s4_u2",
        stage: "STEP_4_SPARTA_BRAND_DROP",
        stageNumber: 4,
        stageName: "Details & Primary Decision Maker Verification",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `Thank you. And just to confirm our regulatory guidelines, are you the primary account holder and the person who handles the utility decisions for this household?"\n \n (Wait for customer response.)`,
        expectedCustomerReply: "(Wait for customer response.)",
        subNote: "Regulatory compliance check: must handle household utility decisions.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "✓ Yes, Primary Account Holder & Decision Maker",
            action: (_c, onUpdate) => onUpdate({ isPrimaryAccountHolder: true, handlesUtilityDecisions: true }),
          },
          {
            label: "❌ Not Primary Decision Maker",
            action: (_c, onUpdate) => onUpdate({ isPrimaryAccountHolder: false, handlesUtilityDecisions: false }),
          },
        ],
      },

      // =====================================================================
      // STEP 5 — DIRECT DEBIT MODE & SOCIAL ALARM CHECK
      // =====================================================================
      {
        id: "s5_u1",
        stage: "STEP_5_VERIFICATION_AGE_RAPPORT",
        stageNumber: 5,
        stageName: "Direct Debit Mode & Social Alarm / Pendant Check",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `As you pay your bills by direct debit at the moment so your mode of payment will remain the same as it is with Sparta telecom.\n"Perfect. Since you currently pay your bills via Direct Debit, that secure payment method will stay exactly the same with us at Sparta Telecom. There's nothing new you need to set up there.`,
        expectedCustomerReply: "(Customer: Okay.)",
        subNote: "Reassure Direct Debit payment mode stays exactly the same.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "Customer Confirms Direct Debit",
            action: (_c, onUpdate) => onUpdate({ paymentMethod: "DIRECT_DEBIT" }),
          },
        ],
      },
      {
        id: "s5_u2",
        stage: "STEP_5_VERIFICATION_AGE_RAPPORT",
        stageNumber: 5,
        stageName: "Direct Debit Mode & Social Alarm / Pendant Check",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `Now, your safety is very important to us, especially with the digital switchover. Do you currently use any type of social alarm, pendant, or personal safety button connected to your phone line?"\n[If NO]: "Excellent, we can move right along."\n[If YES & Line is Copper]: "Perfect, we can proceed. Just to let you know, our team will ensure this transitions smoothly."\n[If YES & Line is Digital]: "Ah, I see. Could you let me know if that alarm plugs directly into your internet router, or does it plug into a standard electrical wall socket?" (Must be electricity to`,
        expectedCustomerReply: "(Customer: No alarm / Yes with copper line / Yes with digital line.)",
        subNote: "Safety check: If digital alarm, must plug into standard electrical wall socket.",
        isPauseAndListen: true,
        inputType: "ALARM_SELECT",
        quickOptions: [
          {
            label: "[If NO]: Move right along",
            action: (_c, onUpdate) => onUpdate({ socialAlarmStatus: "NO", medicalAlarm: false }),
          },
          {
            label: "[If YES & Line is Copper]: Transitions smoothly",
            action: (_c, onUpdate) => onUpdate({ socialAlarmStatus: "YES_COPPER", medicalAlarm: true }),
          },
          {
            label: "[If YES & Line is Digital]: Electrical wall socket",
            action: (_c, onUpdate) => onUpdate({ socialAlarmStatus: "YES_DIGITAL_SOCKET", medicalAlarm: true }),
          },
        ],
      },

      // =====================================================================
      // STEP 6 — FREE CALLING FEATURES & PAPER ITEMIZED BILL
      // =====================================================================
      {
        id: "s6_u1",
        stage: "STEP_6_FREE_SERVICES_EXTENSIONS",
        stageNumber: 6,
        stageName: "Free Calling Features & Paper Itemized Bill",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () => `You use any calling features like 1471/1571 1571 voice mail calling feature is free for you .`,
        expectedCustomerReply: "(Customer: Okay / Thank you.)",
        subNote: "1571 voicemail calling feature is free.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer Acknowledges Free Voicemail",
            action: (_c, onUpdate) => onUpdate({ callingFeaturesConfirmed: true }),
          },
        ],
      },
      {
        id: "s6_u2",
        stage: "STEP_6_FREE_SERVICES_EXTENSIONS",
        stageNumber: 6,
        stageName: "Free Calling Features & Paper Itemized Bill",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `We will send u a paper itemized bill which is free for u for the first 2 months afterwards if u wish to continue it will only cost 1 pound on top of your package and you can deactivate the paper bill any time you want.`,
        expectedCustomerReply: "(Customer: Okay.)",
        subNote: "Paper bill: free for 2 months, then £1. Can deactivate anytime.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer Acknowledges Paper Bill Terms",
            action: (_c, onUpdate) => onUpdate({ paperBillConfirmed: true }),
          },
        ],
      },

      // =====================================================================
      // STEP 7 — SPARTA PLATFORM & INDEPENDENT COMPANY
      // =====================================================================
      {
        id: "s7_u1",
        stage: "STEP_7_ENGINEER_ROUTER_COST",
        stageNumber: 7,
        stageName: "Sparta Telecom BT Platform & Independent Company",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: () =>
          `So all these savings and digital services are coming to you with the help of Sparta Telecom and we are working on the same platform as BT works. However we are a totally separate and independent company from BT, Talk Talk, Italk ,EE , Plusnet.\nWait For cx response!`,
        expectedCustomerReply: "Wait For cx response!",
        subNote: "Shared BT platform clarification; separate & independent from BT, TalkTalk, EE, Plusnet.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer Understands Independent Company",
            action: (_c, onUpdate) => onUpdate({ spartaBtPlatformAcknowledged: true, brandDropAcknowledged: true }),
          },
        ],
      },

      // =====================================================================
      // STEP 8 — COMPLIANCE COGNITIVE / DAY VERIFICATION
      // =====================================================================
      {
        id: "s8_u1",
        stage: "STEP_8_DIRECT_DEBIT_DPA1998",
        stageNumber: 8,
        stageName: "Compliance Cognitive / Day Verification",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: () =>
          `"Wonderful. To wrap things up, our compliance team requires me to ask a quick verification question to ensure you feel completely comfortable with everything we've discussed. Just for the record, could you confirm for me what day of the week it is today? Is it Sunday, Monday, or Tuesday?"\n Wait For cx response!`,
        expectedCustomerReply: "Wait For cx response!",
        subNote: "Compliance question: Sunday, Monday, or Tuesday? Ensures customer comfort and understanding.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "Customer Answers Correct Day",
            action: (_c, onUpdate) => onUpdate({ isDayVerified: true }),
          },
          {
            label: "Customer Answers Incorrect / Confused",
            action: (_c, onUpdate) => onUpdate({ isDayVerified: false }),
          },
        ],
      },

      // =====================================================================
      // STEP 9 — VERIFICATION OFFICER HANDOFF
      // =====================================================================
      {
        id: "s9_u1",
        stage: "STEP_9_VERIFICATION_HANDOFF",
        stageNumber: 9,
        stageName: "Verification Officer Handoff",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: () =>
          `"Spot on! The reason I ask is just to ensure we've taken our time today, had a clear conversation, and that you are happy with how everything was explained.\nI’m now going to introduce you to my verification officer. They will spend just two minutes re-verifying these details to ensure everything is perfectly accurate and that you've received the exact discount promised. Thank you so much for your time, Mrs. Smith, holding the line for just a moment!"`,
        expectedCustomerReply: "(Customer: Thank you, holding on.)",
        subNote: "Introduce to verification officer for 2-minute discount confirmation.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Connect to Verification Officer",
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
