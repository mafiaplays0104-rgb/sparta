import {
  CallState,
  CustomerMood,
  Customer,
  OfferConfig,
  SuggestedResponse,
  ConsentRecord,
  IssueStatus,
} from "../types";

export interface StateMetadata {
  label: string;
  stepNumber: number;
  isSensitive?: boolean;
}

export const STATE_ORDER: { state: CallState; metadata: StateMetadata }[] = [
  { state: "OPENING", metadata: { label: "Opening", stepNumber: 1 } },
  { state: "BILL_RESPONSIBILITY", metadata: { label: "Bill Responsibility", stepNumber: 2 } },
  { state: "RAPPORT", metadata: { label: "Rapport", stepNumber: 3 } },
  { state: "SERVICE_DISCOVERY", metadata: { label: "Service Check", stepNumber: 4 } },
  { state: "ISSUE_CHECK", metadata: { label: "Issue Check", stepNumber: 5 } },
  { state: "BILL_DISCOVERY", metadata: { label: "Bill Discovery", stepNumber: 6 } },
  { state: "OFFER_INTRO", metadata: { label: "Offer Intro", stepNumber: 7 } },
  { state: "OFFER_EXPLANATION", metadata: { label: "Offer Details", stepNumber: 8 } },
  { state: "OFFER_INTEREST", metadata: { label: "Customer Interest", stepNumber: 9 } },
  { state: "ELIGIBILITY", metadata: { label: "Eligibility Check", stepNumber: 10 } },
  { state: "CUSTOMER_DETAILS", metadata: { label: "Customer Details", stepNumber: 11 } },
  { state: "PAYMENT_CONSENT", metadata: { label: "Direct Debit Consent", stepNumber: 12, isSensitive: true } },
  { state: "PAYMENT_DETAILS", metadata: { label: "Direct Debit Details", stepNumber: 13, isSensitive: true } },
  { state: "ADDITIONAL_DETAILS", metadata: { label: "Additional Info", stepNumber: 14 } },
  { state: "FINAL_REVIEW", metadata: { label: "Final Review", stepNumber: 15 } },
  { state: "END", metadata: { label: "Call Conclusion", stepNumber: 16 } },
];

export class ConversationEngine {
  /**
   * Evaluates if a given DOB falls within the configured campaign age range
   */
  public static checkDobEligibility(
    dobString: string | undefined,
    config: OfferConfig
  ): { isEligible: boolean; birthYear?: number; message: string } {
    if (!dobString) {
      return { isEligible: false, message: "Date of birth not yet entered." };
    }

    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) {
      return { isEligible: false, message: "Invalid date format." };
    }

    const birthYear = birthDate.getFullYear();
    const minYear = new Date(config.eligibilityRules.minimumDob).getFullYear();
    const maxYear = new Date(config.eligibilityRules.maximumDob).getFullYear();

    const isEligible = birthYear >= minYear && birthYear <= maxYear;

    return {
      isEligible,
      birthYear,
      message: isEligible
        ? `✓ Within configured eligibility range (${minYear}–${maxYear})`
        : `✕ Outside configured eligibility range (${minYear}–${maxYear})`,
    };
  }

  /**
   * Generates dynamic SuggestedResponse based on state, customer data, mood, and offer config
   */
  public static getSuggestedResponse(
    state: CallState,
    customer: Customer,
    mood: CustomerMood,
    config: OfferConfig,
    _consents: ConsentRecord[]
  ): SuggestedResponse {
    const maxPct = config.maxDiscountPercent;

    switch (state) {
      case "OPENING":
      case "BILL_RESPONSIBILITY":
        return {
          objective: "Identify the bill payer without artificial scripts or rushed pleasantries",
          sayLabel: "STEP 1 — BILL RESPONSIBILITY",
          primary:
            "Hello, am I speaking to the person who looks after the bills for this landline?",
          short:
            "Hello, do you handle the bills for this telephone line?",
          explain:
            "Hello, I'm calling regarding your telephone services and just wanted to ensure I'm speaking with the person who manages the account.",
          why: "Establishes commercial authority to discuss the telephone account before sharing any service details.",
          nextState: "RAPPORT",
          trainingTip: "Notice: 'Have I caught you at an alright time?' has been intentionally removed for a cleaner, calmer opening.",
          complianceWarning: "If nobody is available or caller is a minor/carer without authority, do not continue sales conversation.",
          stopConditions: [
            "If customer is NOT bill payer and nobody else available: Politely end call.",
          ],
        };

      case "RAPPORT":
        return {
          objective: "Acknowledge naturally and state the purpose of the call directly",
          sayLabel: "GREETING & REASON FOR CALL",
          primary:
            "Hello, my name's Alex, and I'm calling regarding your telephone line services. How are you doing today?",
          short:
            "Hello, I'm Alex calling regarding your telephone line services.",
          explain:
            "Hello, my name's Alex. I'm calling regarding your telephone line services and checking if any rate reductions apply to your package.",
          why: "Polite, transparent identification that builds trust without artificial small talk.",
          nextState: "SERVICE_DISCOVERY",
          trainingTip: "Keep rapport brief: 1 natural sentence based on their response ('Good to hear', 'Right, I'll keep this straightforward').",
        };

      case "SERVICE_DISCOVERY":
        return {
          objective: "Discover existing telephone and broadband services",
          sayLabel: "SERVICE DISCOVERY",
          primary:
            "Just so I understand what you've currently got, are you using the telephone line on its own, or does it also include your internet or any other services?",
          short:
            "Are you using just the landline on its own, or internet as well?",
          explain:
            "Before we talk about any discounts, it helps to confirm if your setup is just a telephone line, or if broadband internet is connected as well.",
          why: "Identifies whether the line qualifies under landline-only or broadband bundled tariffs.",
          nextState: "ISSUE_CHECK",
          requiredData: ["serviceType"],
          trainingTip: "Older customers often have landline only; confirm clearly without tech jargon.",
        };

      case "ISSUE_CHECK":
        return {
          objective: "Verify service health before discussing any commercial offers",
          sayLabel: "SERVICE HEALTH & ISSUE CHECK",
          primary:
            "Before I explain anything about the available reduction, are you having any trouble at all with the landline or internet service at the moment?",
          short:
            "Are you experiencing any faults or trouble with your landline right now?",
          explain:
            "We always like to check first whether your telephone is working properly, so we don't overlook any real service problems.",
          why: "Compliance rule: Never attempt to sell or promote discounts when a customer has an active service interruption.",
          nextState: "BILL_DISCOVERY",
          requiredData: ["issueStatus"],
          complianceWarning: "If any active issue is reported, switch immediately to issue note and supervisor escalation path.",
        };

      case "ISSUE_ESCALATION":
        return {
          objective: "Note service fault and route to senior support without fabricating claims",
          sayLabel: "ISSUE NOTATION & CARE HANDOFF",
          primary:
            "Right, I see. Let me make a note of that because I don't want to overlook an actual service problem while we're discussing the account. Can you tell me briefly what has been happening?",
          short:
            "I'm noting that problem down right away so it gets addressed properly by our technical team.",
          explain:
            "Right, I understand. In that case, I'd rather make sure you're speaking to the right person who can properly deal with that for you. I'll arrange for this to be passed to a senior member of the team.",
          why: "Never ignore customer pain. Prioritise service reliability over sales.",
          nextState: "ESCALATION",
          complianceWarning: "Do NOT invent engineer visits, compensation, fault tickets, or promises.",
          escalationRecommended: true,
        };

      case "BILL_DISCOVERY":
        return {
          objective: "Establish approximate current monthly billing figure",
          sayLabel: "APPROXIMATE BILL DISCOVERY",
          primary:
            customer.lastBillAmount
              ? `Perfect, roughly £${customer.lastBillAmount} — that's all I needed. I can use that as the starting point when explaining the available reduction.`
              : "Right, thank you. The reason I've asked is that we're currently checking whether reductions are available on qualifying existing packages. Do you happen to remember roughly what you paid on your last monthly bill?",
          short:
            "Do you remember roughly what last month's bill was?",
          explain:
            "No problem at all if you don't remember exactly. Even an approximate figure is fine — something like £30, £40, or £50.",
          why: "Establishes current baseline payment so applicable reduction can be accurately explained.",
          nextState: "OFFER_INTRO",
          requiredData: ["lastBillAmount"],
          trainingTip: "Do NOT pressure the customer to go search for paperwork. Approximate estimates are completely fine.",
        };

      case "OFFER_INTRO":
      case "OFFER_EXPLANATION":
        return {
          objective: "Clearly present up-to-30% reduction and explain what stays unchanged",
          sayLabel: "UP TO 30% REDUCTION PRESENTATION",
          primary:
            `There's currently an offer available of up to ${maxPct}% off, depending on the package and eligibility. And just to make that nice and clear, this isn't a change to the telephone service itself. Your existing contract remains the same, and the device or equipment you're already using remains the same as well.`,
          short:
            `There's an offer of up to ${maxPct}% off. Your service, contract, and equipment stay exactly as they are; the reduction is applied to the Direct Debit payment.`,
          explain:
            `The important point is that you're not being asked to change your phone or replace any equipment. We're simply checking whether your existing Direct Debit can move to the lower promotional rate of up to ${maxPct}% off.`,
          why: "Establishes clear commercial value while providing immediate reassurance against disruption.",
          nextState: "OFFER_INTEREST",
          complianceWarning: "NEVER state 'You WILL save 30%'. Always state 'up to 30%' depending on eligibility.",
        };

      case "OFFER_INTEREST":
        return {
          objective: "Confirm customer understanding naturally without high-pressure sales closing",
          sayLabel: "UNDERSTANDING CHECK",
          primary:
            "The reduction we're checking is on the Direct Debit payment, so if you're eligible, the amount being paid can move to the cheaper rate. Does that make sense so far?",
          short:
            "Does that make sense so far?",
          explain:
            "I want to make sure I've explained that clearly before we look at anything else. Are you happy with how that sounds?",
          why: "Maintains conversational comfort. Never force an aggressive 'Are you interested in buying?' close.",
          nextState: "ELIGIBILITY",
          stopConditions: [
            "If customer says 'Not interested': Reassure that nothing changes, respect choice gracefully, and end call.",
          ],
        };

      case "ELIGIBILITY":
        return {
          objective: "Perform non-intrusive age verification for campaign tariff",
          sayLabel: "ELIGIBILITY VERIFICATION (DOB)",
          primary:
            "The next part is simply an eligibility check. One of the details used for that is your date of birth. Could I take your date of birth, please?",
          short:
            "Could I take your date of birth for the eligibility check, please?",
          explain:
            "This specific reduction tariff is backed by campaign eligibility criteria. Verifying your birth year allows us to confirm whether the lower rate can be unlocked.",
          why: "Verifies customer fits the configured age bracket (1943–1960).",
          nextState: "CUSTOMER_DETAILS",
          requiredData: ["dateOfBirth"],
          complianceWarning: "Purpose must strictly be stated as 'Eligibility verification'. Do not invent other reasons.",
        };

      case "CUSTOMER_DETAILS":
        return {
          objective: "Record essential account and address information one field at a time",
          sayLabel: "REGISTERED ACCOUNT DETAILS",
          primary:
            mood === "ELDERLY_SLOW"
              ? "First, could I take your full name, please?"
              : "Could I confirm your full name and the address the telephone line is registered at?",
          short:
            "Could I take your full name and registered service address?",
          explain:
            "We just need to ensure the account details match your registered telephone line so any documentation reaches you properly.",
          why: "Confirms service registration without collecting unnecessary personal data.",
          nextState: "PAYMENT_CONSENT",
          requiredData: ["firstName", "lastName", "houseNumber", "street", "postcode"],
          trainingTip: "In elderly mode, ask one piece at a time: Name -> House number & Street -> Postcode.",
        };

      case "PAYMENT_CONSENT":
        return {
          objective: "Obtain explicit informed consent prior to discussing Direct Debit details",
          sayLabel: "SENSITIVE PAYMENT CONSENT GATE",
          primary:
            "Before we go any further, I want to explain the payment part clearly. The reason we're asking about the Direct Debit is to verify the payment method associated with the existing service and, where applicable, apply the authorised reduced rate. I'll only ask for the information that is genuinely required by the authorised payment process. Are you comfortable continuing with that?",
          short:
            "Before touching on payment, I want to confirm you're completely comfortable with us verifying your Direct Debit for the lower rate?",
          explain:
            "Your security is our top priority. We only ever verify the bank Sort Code and Account Number for the Direct Debit mandate. We never ask for card numbers, PINs, or online passwords. Are you happy for us to proceed?",
          why: "Mandatory regulatory gate: No financial details may be asked without upfront informed consent.",
          nextState: "PAYMENT_DETAILS",
          requiredData: ["paymentConsent"],
          complianceWarning: "STOP! Consent must be explicitly granted before payment fields become active.",
          stopConditions: [
            "If customer declines or is uneasy: Immediately stop payment collection. Offer callback or written dispatch.",
          ],
        };

      case "PAYMENT_DETAILS":
        return {
          objective: "Safely collect Sort Code and Account Number under strict Direct Debit rules",
          sayLabel: "DIRECT DEBIT VERIFICATION",
          primary:
            "Thank you. Could you please give me the 6-digit Sort Code and the 8-digit Account Number for the account your telephone bill is normally paid from?",
          short:
            "Could I take your bank Sort Code and Account Number for the Direct Debit?",
          explain:
            "Just the standard bank Sort Code and Account Number printed on your bank statement or chequebook. That's all the Direct Debit mandate needs.",
          why: "Updates the billing instruction with the bank to draw the reduced tariff amount.",
          nextState: "ADDITIONAL_DETAILS",
          requiredData: ["sortCode", "accountNumber"],
          complianceWarning: "NEVER ASK FOR CARD CVV, PIN, ONLINE BANKING PASSWORDS, OR ONE-TIME PASSCODES (OTP).",
        };

      case "ADDITIONAL_DETAILS":
        return {
          objective: "Check medical alarm dependency and optional account checks",
          sayLabel: "CRITICAL SERVICE DEPENDENCY & MOBILE INFO",
          primary:
            "One very important service question — do you have a medical alarm or similar pendant device connected through your telephone line?",
          short:
            "Do you have a medical alarm or emergency pendant plugged into the telephone line?",
          explain:
            "Because some customers have health pendants or emergency alarms on their line, we ensure we verify this so no service is ever put at risk.",
          why: "Essential vulnerable customer protection. Never alter lines with life-critical alarm systems without specialist care.",
          nextState: "FINAL_REVIEW",
          requiredData: ["medicalAlarm"],
          complianceWarning: "If YES for Medical Alarm: Display critical service warning and escalate to technical supervisor.",
        };

      case "FINAL_REVIEW":
        return {
          objective: "Present complete transparent review before concluding agreement",
          sayLabel: "FINAL CUSTOMER REVIEW & DISCLOSURE",
          primary:
            `Before we finish, let me quickly run through what we've discussed so there's no misunderstanding. The offer is a potential reduction of up to ${maxPct}%, depending on applicable eligibility. Your existing service is not being replaced, your equipment is not being replaced, and the reduction relates directly to the Direct Debit payment. Any applicable terms should be reviewed before you agree. Does that all make sense?`,
          short:
            `To recap: your service, contract, and equipment remain identical. We've applied for the up-to-${maxPct}% Direct Debit discount, and all terms will be sent for your review. Does that sound good?`,
          explain:
            "We want you to feel 100% confident. Nothing changes in your home, no new boxes will arrive, and you have complete visibility over the terms before anything is finalized.",
          why: "FCA and Ofcom fairness standards: Ensures unambiguous customer comprehension.",
          nextState: "END",
        };

      case "CONFUSION_MODE":
        return {
          objective: "Slow conversation down, reassure customer, and eliminate overwhelm",
          sayLabel: "REASSURANCE & SLOW PACING",
          primary:
            "No problem at all. Let me slow that right down for you. The service itself is staying the same, and your telephone and equipment won't change. We're simply checking if your monthly payment can be reduced, and I'll explain each piece before asking for anything.",
          short:
            "No rush at all. Everything stays the same; we're just checking if your monthly bill can be lower. Let's take it one simple step at a time.",
          explain:
            "There's no pressure and absolutely no rush. If at any point you'd rather pause or stop, just tell me.",
          why: "Re-establishes safety and removes anxiety for confused or elderly callers.",
          nextState: "BILL_DISCOVERY",
        };

      case "OBJECTION":
        return {
          objective: "Address customer concern respectfully with transparent facts",
          sayLabel: "OBJECTION RESOLUTION",
          primary:
            "I completely understand where you're coming from. There's no pressure whatsoever, and I want to make sure you have all the facts so you can decide what's best for you.",
          short:
            "I completely understand. No pressure at all.",
          explain:
            "Your peace of mind is what matters most. We can take all the time you need or leave things exactly as they are.",
          why: "De-escalates suspicion and respects customer sovereignty.",
          nextState: "OFFER_INTEREST",
        };

      case "CALLBACK":
        return {
          objective: "Schedule respectful callback at customer's preferred day and time",
          sayLabel: "CALLBACK SCHEDULING",
          primary:
            "That's completely fine. I'll arrange a callback for a time that suits you better. What day and time would be most convenient?",
          short:
            "No problem at all. When would be a better day and time for us to call back?",
          explain:
            "We'll make a note on the account so an advisor calls back only at your preferred hour.",
          why: "Respects customer schedule without forcing immediate interaction.",
          nextState: "END",
        };

      case "ESCALATION":
        return {
          objective: "Warm handover to senior supervisor or specialist support team",
          sayLabel: "SUPERVISOR HANDOFF",
          primary:
            "Right, I understand. In that case, I'd rather make sure you're speaking to the right person who can properly deal with that for you. I'll arrange for this to be passed to a senior member of the team.",
          short:
            "I'm passing your file straight to a senior team member who can handle this for you directly.",
          explain:
            "Rather than guess or give you incomplete answers, a senior specialist will review this and ensure everything is looked after properly.",
          why: "Ensures complex issues or vulnerable situations receive high-tier care.",
          nextState: "END",
        };

      case "END":
      default:
        return {
          objective: "Conclude the conversation politely with clear expectations",
          sayLabel: "CALL CONCLUSION",
          primary:
            config.authorisedText.closingLines ||
            "Thank you very much for your time today. I appreciate it. Everything we've discussed will follow the applicable process, and you should have the relevant information and terms to review. Have a lovely day.",
          short:
            "Thank you so much for your time today. Have a lovely day ahead.",
          explain:
            "Thank you for speaking with me. You'll receive full written confirmation of everything we discussed, and there is nothing further you need to do today. Take care.",
          why: "Leaves the customer with a positive, calm impression of the organization.",
          nextState: "END",
        };
    }
  }

  /**
   * Recommends a customer mood based on selected responses
   */
  public static recommendMood(
    recentPhrases: string[],
    issueStatus?: IssueStatus,
    medicalAlarm?: boolean
  ): CustomerMood | null {
    if (medicalAlarm) return "VULNERABILITY_CONCERN";
    if (issueStatus && issueStatus !== "NONE" && issueStatus !== "UNKNOWN") {
      return "CONFUSED";
    }

    const text = recentPhrases.join(" ").toLowerCase();
    if (text.includes("scam") || text.includes("fraud") || text.includes("don't trust")) {
      return "SUSPICIOUS";
    }
    if (text.includes("hurry") || text.includes("busy") || text.includes("quick") || text.includes("get to the point")) {
      return "IMPATIENT";
    }
    if (text.includes("sorry?") || text.includes("what was that") || text.includes("pardon") || text.includes("repeat")) {
      return "CONFUSED";
    }
    return null;
  }
}
