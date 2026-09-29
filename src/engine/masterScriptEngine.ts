import {
  MasterStage,
  CustomerRecord,
  OfferConfig,
  CustomerSentiment,
} from "../types";

export interface StageDefinition {
  stage: MasterStage;
  stageNumber: number;
  stageName: string;
  objective: string;
  getSayText: (customer: CustomerRecord, config: OfferConfig) => string;
  pauseInstruction: string;
  subSteps?: {
    id: string;
    label: string;
    getSayText: (customer: CustomerRecord, config: OfferConfig) => string;
  }[];
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
  "STAGE_1_OPENING",
  "STAGE_2_CURRENT_SERVICE",
  "STAGE_3_OFFER_INTRO",
  "STAGE_4_DOB_VALIDATION",
  "STAGE_5_CONFIRM_ADDRESS",
  "STAGE_6_DIRECT_DEBIT_ID",
  "STAGE_7_PERSONAL_DETAILS",
  "STAGE_8_MOBILE_DETAILS",
  "STAGE_9_FINAL_QUESTIONS",
  "STAGE_10_FINAL_CHECK",
  "STAGE_11_NATURAL_CLOSE",
];

export class MasterScriptEngine {
  /**
   * Helper to format time greeting (Good morning / Good afternoon)
   */
  public static getTimeGreeting(): string {
    const hours = new Date().getHours();
    return hours < 12 ? "Good morning" : "Good afternoon";
  }

  /**
   * Helper to resolve [Customer Name] placeholder
   */
  public static getCustomerDisplayName(customer: CustomerRecord): string {
    const prefix = customer.title || "Mr / Mrs";
    if (customer.lastName) {
      return `${prefix} ${customer.lastName}`;
    }
    if (customer.firstName) {
      return customer.firstName;
    }
    return "[Customer Name]";
  }

  /**
   * Format a concise service summary for Stage 10
   */
  public static getServiceSummary(customer: CustomerRecord): string {
    const parts: string[] = [];
    if (customer.monthlyBill) {
      parts.push(`paying around £${customer.monthlyBill.toFixed(2)}/month`);
    }
    if (customer.landlineUsage) {
      parts.push(`${customer.landlineUsage.toLowerCase().replace(/_/g, " ")} landline usage`);
    }
    if (customer.billIncludesBroadband) {
      parts.push("broadband included");
    }
    if (customer.billIncludesTv) {
      parts.push("TV service included");
    }
    if (customer.medicalAlarm !== undefined) {
      parts.push(customer.medicalAlarm ? "medical alarm connected" : "no medical alarm");
    }
    return parts.length > 0 ? parts.join(", ") : "landline phone service";
  }

  /**
   * Get the complete definition for any of the 11 Master Stages
   */
  public static getStageDefinition(
    stage: MasterStage,
    customer: CustomerRecord,
    config: OfferConfig
  ): StageDefinition {
    const greeting = this.getTimeGreeting();
    const custName = this.getCustomerDisplayName(customer);
    const amountStr = customer.monthlyBill
      ? customer.monthlyBill.toFixed(0)
      : "[AMOUNT]";
    const doorNum = customer.doorNumber || "[NUMBER]";
    const postcodeStr = customer.postcode || "[POSTCODE]";
    const contactNum = customer.contactNumber || customer.mobileNumber || "[NUMBER]";
    const firstName = customer.firstName || "[NAME]";
    const surname = customer.lastName || "[SURNAME]";
    const addressStr = customer.address || (customer.doorNumber && customer.street ? `${customer.doorNumber} ${customer.street}` : "[ADDRESS]");
    const serviceSummary = this.getServiceSummary(customer);

    switch (stage) {
      // -------------------------------------------------------------
      // STAGE 1 — OPENING
      // -------------------------------------------------------------
      case "STAGE_1_OPENING":
        return {
          stage: "STAGE_1_OPENING",
          stageNumber: 1,
          stageName: "Stage 1 — Opening",
          objective: "Greet customer professionally, confirm identity, build calm rapport, and check service health",
          getSayText: () =>
            `“${greeting}.\nAm I speaking with ${custName}?\nHi, my name is Alex, and I’m calling regarding your phone services. How are you doing today?”\n\nIf the customer responds positively:\n“GOOD TO HEAR THAT, So, just as a quick check, have you had any issues with your phone or broadband recently?”`,
          pauseInstruction: "Pause and listen to their response naturally without talking over them.",
          quickResponses: [
            {
              label: "Positive & No issues",
              actionDescription: "Customer is fine and has had no issues.",
              nextStage: "STAGE_2_CURRENT_SERVICE",
              guidance: "Acknowledge smoothly and move to Stage 2 Current Service.",
            },
            {
              label: "Has recent issues",
              actionDescription: "Customer reports noise, slow broadband, or fault.",
              autoFill: { issuesRecently: "Customer reported service issues" },
              guidance: "Note the issue clearly. Emphasize that technical assistance / visit is included in the offer.",
            },
            {
              label: "Customer is busy",
              actionDescription: "Customer says they don't have time right now.",
              category: "BUSY",
              guidance: "Say: 'No problem at all. I understand. Would another time be more convenient for you?' Offer callback.",
            },
            {
              label: "Who is calling?",
              actionDescription: "Customer asks for company identity.",
              guidance: "State approved company identity: 'I'm calling from Sparta on behalf of telephone line services.'",
            },
            {
              label: "Wrong Person",
              actionDescription: "The person answering is not the intended customer.",
              category: "WRONG_PERSON",
              guidance: "Do not disclose account details. Follow wrong person procedure.",
            },
            {
              label: "Not Interested",
              actionDescription: "Customer says not interested.",
              category: "REFUSAL",
              guidance: "Say: 'That's absolutely fine. I understand. Thank you for your time.'",
            },
          ],
          why: "Establishes natural human rapport, verifies caller authority, and ensures no unaddressed service outages exist.",
          nextStage: "STAGE_2_CURRENT_SERVICE",
        };

      // -------------------------------------------------------------
      // STAGE 2 — GET TO KNOW THEIR CURRENT SERVICE
      // -------------------------------------------------------------
      case "STAGE_2_CURRENT_SERVICE":
        return {
          stage: "STAGE_2_CURRENT_SERVICE",
          stageNumber: 2,
          stageName: "Stage 2 — Get To Know Their Current Service",
          objective: "Discover landline usage patterns, billing satisfaction, 3-month average bill, and bundle inclusions",
          getSayText: () =>
            `“Okay, I understand.\nAnd your landline — do you use that quite often?\nOr is it mainly for incoming calls?”\n\n[Pause and listen]\n\n“Right, okay.\nAnd are you happy with the bills you're getting at the moment?\nDo you feel you're paying about right for what you use?”\n\n[Pause and listen]\n\n“Okay.\nRoughly, how much would you say your average bill has been over the last three months?”\n\n[Pause and listen]\n\n“Okay, thank you.\nAnd does that amount include your phone, internet and TV?\nOr just your phone and internet?”\n\n[Pause and listen]\n\n“Alright, that makes sense.”`,
          pauseInstruction: "Pause and listen after each specific question. Allow customer to complete their answer.",
          quickResponses: [
            {
              label: "Low usage / Incoming only (~£50-£70)",
              actionDescription: "Customer rarely uses landline and pays around average.",
              autoFill: { landlineUsage: "LOW", billSatisfaction: "PAYING_TOO_MUCH" },
              guidance: "Excellent match for the 500-minute capped offer.",
            },
            {
              label: "Gives approximate amount",
              actionDescription: "Customer says 'about £65' or 'around £80'.",
              autoFill: { billApproximate: true },
              guidance: "Store as approximate = TRUE. Do not force an exact decimal.",
            },
            {
              label: "Gives exact amount",
              actionDescription: "Customer says '£72.43'.",
              autoFill: { billApproximate: false },
              guidance: "Store exact figure into bill record.",
            },
            {
              label: "Doesn't remember bill",
              actionDescription: "Customer has no idea what they pay.",
              guidance: "Say: 'That’s alright, no problem. If you have an old phone bill or statement nearby, you can have a quick look. There’s no need to guess.'",
            },
            {
              label: "Includes Phone + Broadband only",
              actionDescription: "Dual-play service without TV.",
              autoFill: { billIncludesPhone: true, billIncludesBroadband: true, billIncludesTv: false },
            },
            {
              label: "Includes Phone + Broadband + TV",
              actionDescription: "Triple-play bundle.",
              autoFill: { billIncludesPhone: true, billIncludesBroadband: true, billIncludesTv: true, hasTvService: true },
            },
          ],
          why: "Gathers legitimate baseline billing and usage details to confirm the customer is overpaying for unused minutes.",
          complianceWarning: "If customer gives conflicting bill amounts, use Information Clarification prompt.",
          requiredFields: ["monthlyBill"],
          nextStage: "STAGE_3_OFFER_INTRO",
          prevStage: "STAGE_1_OPENING",
        };

      // -------------------------------------------------------------
      // STAGE 3 — INTRODUCE THE OFFER NATURALLY
      // -------------------------------------------------------------
      case "STAGE_3_OFFER_INTRO":
        return {
          stage: "STAGE_3_OFFER_INTRO",
          stageNumber: 3,
          stageName: "Stage 3 — Introduce The Offer Naturally",
          objective: "Present the approved 500-minute offer, dedicated service, included tech visit, and written terms",
          getSayText: () =>
            `“Based on what you've just told me, I can see you're paying around £${amountStr}.\nAnd it sounds like you're not really using all of the minutes included in your current service.\nThere is an offer available that may be more suitable for the way you're using your phone.\nIt includes ${config.minutes} cross-network anytime calling minutes, along with dedicated customer service.\nAnd if you need technical assistance, the technical visit is included as part of the offer.\nThe full details and terms would be provided to you in writing, so you can read everything properly before any changes are made.”\n\n[Pause and let the customer respond]\n\n“Does that all make sense so far?”`,
          pauseInstruction: "Pause and let the customer absorb the offer details. Confirm understanding before moving forward.",
          quickResponses: [
            {
              label: "Makes sense / Sounds good",
              actionDescription: "Customer understands and is happy to proceed.",
              nextStage: "STAGE_4_DOB_VALIDATION",
              guidance: "Move smoothly to Stage 4 Age/DOB eligibility check.",
            },
            {
              label: "Asks about discount / savings",
              actionDescription: "Customer asks how much they will save.",
              guidance: "Use the Bill Reduction & 30% Savings Calculator tool to show exact monthly & annual savings.",
            },
            {
              label: "Wants written info first",
              actionDescription: "Customer requests to see written terms.",
              guidance: "Reassure: 'All full details and terms are sent to you in writing to read over before any changes take effect.'",
            },
            {
              label: "Is this a new contract / provider?",
              actionDescription: "Customer asks about disruption.",
              guidance: "Clarify: 'Your existing telephone line and setup remain intact; this simply unlocks the optimized rate.'",
            },
          ],
          why: "Transparency rule: Ensure customer fully comprehends the offer terms and written guarantee before taking eligibility details.",
          complianceWarning: "Do NOT invent discount percentages, contract lengths, or Openreach claims beyond configured parameters.",
          nextStage: "STAGE_4_DOB_VALIDATION",
          prevStage: "STAGE_2_CURRENT_SERVICE",
        };

      // -------------------------------------------------------------
      // STAGE 4 — AGE / DOB VALIDATION
      // -------------------------------------------------------------
      case "STAGE_4_DOB_VALIDATION":
        return {
          stage: "STAGE_4_DOB_VALIDATION",
          stageNumber: 4,
          stageName: "Stage 4 — Age / DOB Validation",
          objective: "Perform non-intrusive age / date of birth eligibility check using DOB Calculator",
          getSayText: () =>
            `“Perfect.\nThere’s just one quick eligibility check I need to do at this stage.\nCould you please confirm your date of birth for me?”\n\n[Pause and listen]\n\n“Thank you, I’ve got that.”\n\nIf the customer asks why:\n“It’s simply part of the eligibility check for the offer we’ve just discussed.”`,
          pauseInstruction: "Pause and listen carefully. If the customer gives their age or birth year, use the DOB Calculator.",
          quickResponses: [
            {
              label: "Provides full DOB",
              actionDescription: "Customer gives exact day, month, and year.",
              guidance: "Validate against campaign bracket and move to Address confirmation.",
            },
            {
              label: "Gives age (e.g. 'I am 72')",
              actionDescription: "Customer gives their age instead of full DOB.",
              guidance: "Open DOB Tool → Calculate birth year (2026 - 72 = 1954) and confirm.",
            },
            {
              label: "Gives birth year (e.g. '1954')",
              actionDescription: "Customer gives birth year.",
              guidance: "Open DOB Tool → Calculate age (72) and verify eligibility.",
            },
            {
              label: "Why do you need my DOB?",
              actionDescription: "Customer asks why date of birth is needed.",
              guidance: "Say: 'It’s simply part of the eligibility check for the offer we’ve just discussed.'",
            },
            {
              label: "Customer refuses DOB",
              actionDescription: "Customer is uncomfortable sharing date of birth.",
              autoFill: { dobRefused: true },
              guidance: "Say: 'That's completely fine. I understand you may not want to provide that over the phone. Without the eligibility check, I won't be able to complete that part of the process.'",
            },
          ],
          why: "Validates eligibility for campaign tariff bracket without storing unnecessary personal background.",
          complianceWarning: "Never infer age from accent, voice, or appearance. If refused, do not pressure.",
          requiredFields: ["dob"],
          allowFallback: true,
          fallbackText: "Customer refused DOB → Log and proceed with authorized alternative or disposition.",
          nextStage: "STAGE_5_CONFIRM_ADDRESS",
          prevStage: "STAGE_3_OFFER_INTRO",
        };

      // -------------------------------------------------------------
      // STAGE 5 — CONFIRM THE ADDRESS
      // -------------------------------------------------------------
      case "STAGE_5_CONFIRM_ADDRESS":
        return {
          stage: "STAGE_5_CONFIRM_ADDRESS",
          stageNumber: 5,
          stageName: "Stage 5 — Confirm The Address",
          objective: "Confirm registered door number and UK postcode for documentation delivery",
          getSayText: () =>
            `“Right, thank you.\nLet me just check your address while I have you.\nI have your door number as ${doorNum}.\nAnd your postcode as ${postcodeStr}.\nIs that correct?”\n\n[Pause and listen]\n\n“Perfect, thank you.”`,
          pauseInstruction: "Pause and listen for confirmation or correction.",
          quickResponses: [
            {
              label: "Address is correct",
              actionDescription: "Customer confirms door number and postcode.",
              autoFill: { addressConfirmed: true },
              nextStage: "STAGE_6_DIRECT_DEBIT_ID",
            },
            {
              label: "Customer corrects door number",
              actionDescription: "Door number was different.",
              guidance: "Update door number field immediately.",
            },
            {
              label: "Customer corrects postcode",
              actionDescription: "Postcode differs from record.",
              guidance: "Validate UK postcode format (e.g. SW1A 1AA) and update.",
            },
            {
              label: "Moved / Wrong address",
              actionDescription: "Customer reports having moved recently.",
              guidance: "Record current address for proper postal dispatch.",
            },
          ],
          why: "Ensures written guarantee and terms reach the correct physical property.",
          requiredFields: ["doorNumber", "postcode"],
          nextStage: "STAGE_6_DIRECT_DEBIT_ID",
          prevStage: "STAGE_4_DOB_VALIDATION",
        };

      // -------------------------------------------------------------
      // STAGE 6 — DIRECT DEBIT ELIGIBILITY / CUSTOMER IDENTIFICATION
      // -------------------------------------------------------------
      case "STAGE_6_DIRECT_DEBIT_ID":
        return {
          stage: "STAGE_6_DIRECT_DEBIT_ID",
          stageNumber: 6,
          stageName: "Stage 6 — Direct Debit Eligibility / Customer Identification",
          objective: "Verify customer ID number linked to account with IBANGB prefix formatting and read-back",
          getSayText: () =>
            `“Alright, just one more quick check regarding the Direct Debit eligibility.\nI need to verify the customer identification number linked to your account.\nCould you please confirm the customer ID you have with you?”\n\n[Pause and listen]\n\n*If the customer ID begins with “IBANGB” and that is how it appears on authorized account info, ask them to read the identifier exactly as shown.*\n\n“Thank you.\nLet me just repeat that back to make sure I’ve got it correctly.”\n\n[Repeat the identifier slowly]\n\n“Is that correct?”\n\n[Pause and listen]\n\n“Perfect, thank you.”\n\n---\n*If the customer asks why the ID is needed:*\n“It’s just being used to match your account and check the Direct Debit eligibility. It isn't a request for your PIN, password or OTP.”\n\n*If the customer does not have the ID available:*\n“That’s absolutely fine. Please don't guess it. We can leave that part for the relevant team to verify through the proper process.”\n\n*If the customer is uncomfortable providing it:*\n“No problem at all. I completely understand. You don't have to provide anything you're not comfortable sharing over the phone.”`,
          pauseInstruction: "Pause and listen carefully. Repeat back slowly to ensure absolute accuracy.",
          quickResponses: [
            {
              label: "Provides valid ID (e.g. IBANGB...)",
              actionDescription: "Customer provides correctly formatted identifier.",
              autoFill: { customerIdStatus: "VERIFIED" },
              guidance: "Repeat identifier back slowly and confirm accuracy.",
            },
            {
              label: "Asks why ID is needed",
              actionDescription: "Customer asks for the reason.",
              guidance: "Say: 'It’s just being used to match your account and check the Direct Debit eligibility. It isn't a request for your PIN, password or OTP.'",
            },
            {
              label: "Does not have ID with them",
              actionDescription: "Customer cannot locate customer ID.",
              autoFill: { customerIdStatus: "NOT_AVAILABLE", customerIdUnavailable: true },
              guidance: "Say: 'That’s absolutely fine. Please don't guess it. We can leave that part for the relevant team to verify through the proper process.'",
            },
            {
              label: "Uncomfortable providing ID",
              actionDescription: "Customer prefers not to share ID.",
              autoFill: { customerIdStatus: "REFUSED", customerIdRefused: true },
              guidance: "Say: 'No problem at all. I completely understand. You don't have to provide anything you're not comfortable sharing over the phone.'",
            },
            {
              label: "Invalid format identifier",
              actionDescription: "ID does not match expected format.",
              autoFill: { customerIdStatus: "INVALID" },
              guidance: "Say: 'The identifier doesn't appear to match the expected format. Could you please check it once more?'",
            },
          ],
          why: "Matches account for Direct Debit eligibility check without asking for prohibited financial credentials.",
          complianceWarning: "STRICT COMPLIANCE: NEVER ask for PIN, OTP, online passwords, or card security codes.",
          allowFallback: true,
          fallbackText: "Customer ID not available / refused → Proceed to personal details confirmation.",
          nextStage: "STAGE_7_PERSONAL_DETAILS",
          prevStage: "STAGE_5_CONFIRM_ADDRESS",
        };

      // -------------------------------------------------------------
      // STAGE 7 — CONFIRM THEIR PERSONAL DETAILS
      // -------------------------------------------------------------
      case "STAGE_7_PERSONAL_DETAILS":
        return {
          stage: "STAGE_7_PERSONAL_DETAILS",
          stageNumber: 7,
          stageName: "Stage 7 — Confirm Their Personal Details",
          objective: "Confirm First Name, Surname, Door number, Postcode, and Contact number",
          getSayText: () =>
            `“Right, we're nearly there.\nLet me just go through a few details with you.\nYour first name is ${firstName}?\nAnd your surname is ${surname}?”\n\n[Pause]\n\n“Thank you.\nYour door number is ${doorNum}.\nYour postcode is ${postcodeStr}.\nAnd your contact number is ${contactNum}.\nIs everything correct?”\n\n[Pause and listen]\n\n“Perfect.”`,
          pauseInstruction: "Pause between name verification and full contact detail verification.",
          quickResponses: [
            {
              label: "All details correct",
              actionDescription: "Customer confirms name, address, and contact number.",
              autoFill: { personalDetailsConfirmed: true },
              nextStage: "STAGE_8_MOBILE_DETAILS",
            },
            {
              label: "Corrects spelling of name",
              actionDescription: "Customer specifies spelling.",
              guidance: "Update first name or surname field.",
            },
            {
              label: "Provides alternate contact number",
              actionDescription: "Customer provides preferred telephone number.",
              guidance: "Update contact number field.",
            },
          ],
          why: "Verifies account holder record for proper CRM routing and legal contract generation.",
          requiredFields: ["firstName", "lastName", "contactNumber"],
          nextStage: "STAGE_8_MOBILE_DETAILS",
          prevStage: "STAGE_6_DIRECT_DEBIT_ID",
        };

      // -------------------------------------------------------------
      // STAGE 8 — MOBILE DETAILS
      // -------------------------------------------------------------
      case "STAGE_8_MOBILE_DETAILS":
        return {
          stage: "STAGE_8_MOBILE_DETAILS",
          stageNumber: 8,
          stageName: "Stage 8 — Mobile Details",
          objective: "Capture mobile telephone number, type (PAYG vs Contract), and network provider",
          getSayText: () =>
            `“Do you also have a mobile number that you use?”\n\nIf yes:\n“Okay, could you give me that number, please?”\n\n[Repeat it back]\n“So I have that as ${customer.mobileNumber || "[NUMBER]"}, is that right?”\n\n[Pause]\n\n“Thank you.\nAnd is that pay-as-you-go or a contract phone?\nAnd which network are you with?”\n\n[Pause and listen]\n\n“Okay, got it.”`,
          pauseInstruction: "Pause and repeat mobile number back slowly to confirm accuracy.",
          quickResponses: [
            {
              label: "Contract Mobile (e.g. EE, O2, Vodafone)",
              actionDescription: "Customer has a monthly mobile contract.",
              autoFill: { hasMobile: true, mobileType: "CONTRACT" },
            },
            {
              label: "Pay-As-You-Go Mobile",
              actionDescription: "Customer tops up via PAYG.",
              autoFill: { hasMobile: true, mobileType: "PAYG" },
            },
            {
              label: "No Mobile phone",
              actionDescription: "Customer does not own or use a mobile.",
              autoFill: { hasMobile: false, mobileNumber: "None" },
              nextStage: "STAGE_9_FINAL_QUESTIONS",
            },
          ],
          why: "Provides alternative contact channel for SMS updates and dispatch tracking.",
          nextStage: "STAGE_9_FINAL_QUESTIONS",
          prevStage: "STAGE_7_PERSONAL_DETAILS",
        };

      // -------------------------------------------------------------
      // STAGE 9 — A COUPLE OF FINAL QUESTIONS
      // -------------------------------------------------------------
      case "STAGE_9_FINAL_QUESTIONS":
        return {
          stage: "STAGE_9_FINAL_QUESTIONS",
          stageNumber: 9,
          stageName: "Stage 9 — A Couple Of Final Questions",
          objective: "Screen for life-critical medical alarms and document existing TV equipment make/model",
          getSayText: () =>
            `“Just a couple more things and then we're all done.\nDo you have any medical alarm connected to your phone line?”\n\n[Pause]\n\n“Okay, thank you.\nAnd do you have a TV service at home?”\n\n[Pause]\n\n“Could you tell me the make and model of your TV?”\n\nIf they ask why:\n“It’s just so we have the correct information about the equipment you're currently using.”`,
          pauseInstruction: "Pause after medical alarm question. Never rush over medical safety screening.",
          quickResponses: [
            {
              label: "No Medical Alarm & No TV",
              actionDescription: "Standard telephone setup.",
              autoFill: { medicalAlarm: false, hasTvService: false },
              nextStage: "STAGE_10_FINAL_CHECK",
            },
            {
              label: "Has Medical Alarm (Pendant / Lifeline)",
              actionDescription: "Life-safety device connected to landline.",
              autoFill: { medicalAlarm: true },
              guidance: "CRITICAL: Medical alarm flagged. Special care routing applies.",
            },
            {
              label: "Has TV (e.g. Samsung 43-inch, LG, Sony)",
              actionDescription: "Customer provides TV make and model.",
              autoFill: { hasTvService: true },
            },
            {
              label: "Why ask about TV / equipment?",
              actionDescription: "Customer inquires about TV equipment question.",
              guidance: "Say: 'It’s just so we have the correct information about the equipment you're currently using.'",
            },
          ],
          why: "Critical vulnerability screening: Life alarms must never be disturbed. TV equipment profile aids compatibility check.",
          complianceWarning: "If Medical Alarm is present, lead must be marked with medical alarm flag for specialist fulfillment.",
          requiredFields: ["medicalAlarm"],
          nextStage: "STAGE_10_FINAL_CHECK",
          prevStage: "STAGE_8_MOBILE_DETAILS",
        };

      // -------------------------------------------------------------
      // STAGE 10 — FINAL CHECK
      // -------------------------------------------------------------
      case "STAGE_10_FINAL_CHECK":
        return {
          stage: "STAGE_10_FINAL_CHECK",
          stageNumber: 10,
          stageName: "Stage 10 — Final Check",
          objective: "Perform comprehensive, transparent summary check of customer name, address, phone, and services",
          getSayText: () =>
            `“Alright, ${custName}, we're almost finished.\nLet me quickly go through everything with you, just to make sure I've got it right.\n\nYour name is ${firstName} ${surname}.\nYour address is ${addressStr}.\nYour postcode is ${postcodeStr}.\nYour contact number is ${contactNum}.\nAnd your current service information is ${serviceSummary}.\n\nIs everything correct?”\n\n[Pause and listen]\n\n“Perfect, thank you.\nI appreciate you going through that with me.”`,
          pauseInstruction: "Pause and listen to ensure customer agrees with all summarized information.",
          quickResponses: [
            {
              label: "Everything confirmed correct",
              actionDescription: "Customer agrees with all summarized items.",
              nextStage: "STAGE_11_NATURAL_CLOSE",
            },
            {
              label: "Customer makes a correction",
              actionDescription: "Customer spots a small mistake.",
              guidance: "Edit the appropriate customer field and re-confirm.",
            },
          ],
          why: "FCA and Ofcom fair treatment requirement: Customer must have full clarity over what has been recorded.",
          nextStage: "STAGE_11_NATURAL_CLOSE",
          prevStage: "STAGE_9_FINAL_QUESTIONS",
        };

      // -------------------------------------------------------------
      // STAGE 11 — NATURAL CLOSE
      // -------------------------------------------------------------
      case "STAGE_11_NATURAL_CLOSE":
      default:
        return {
          stage: "STAGE_11_NATURAL_CLOSE",
          stageNumber: 11,
          stageName: "Stage 11 — Natural Close",
          objective: "Warm, professional handoff to the relevant department and polite call conclusion",
          getSayText: () =>
            `“That's everything I needed from you today.\nI'll pass your details across to the relevant team.\nThey'll be able to go through the available options with you and explain the service, pricing and terms.\nAnd you'll have the relevant information to look over before making any changes.\nThank you very much for your time, ${custName}.\nHave a good day.”`,
          pauseInstruction: "Deliver closing warmly and allow customer to say goodbye.",
          quickResponses: [
            {
              label: "Complete Lead & Hand Off",
              actionDescription: "Lead completed successfully.",
              guidance: "Save lead packet and set disposition: LEAD_COMPLETED.",
            },
            {
              label: "Customer asks when team will call",
              actionDescription: "Inquires about next steps.",
              guidance: "Advise: 'The relevant team will follow up during normal office hours to go through everything with you.'",
            },
          ],
          why: "Concludes the call politely, sets clear expectations for the fulfillment team, and reinforces peace of mind.",
          nextStage: "CALL_COMPLETED" as MasterStage,
          prevStage: "STAGE_10_FINAL_CHECK",
        };
    }
  }
}
