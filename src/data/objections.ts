import { ObjectionItem } from "../types";

export const objectionLibrary: ObjectionItem[] = [
  // A. CUSTOMER IS BUSY
  {
    id: "customer_busy",
    category: "AVAILABILITY",
    name: "Customer Is Busy / No Time",
    triggers: [
      "i'm busy",
      "i don't have time",
      "can you call later?",
      "bad time",
      "in the middle of something",
      "eating dinner",
      "heading out",
    ],
    intent: "Customer is occupied and cannot give full attention right now.",
    recommendedResponse:
      "“No problem at all. I understand. Would another time be more convenient for you?”",
    optionalFollowUp:
      "Offer to book a specific callback date and time without putting pressure on the customer.",
    stopCondition: "Never pressure them to continue. Transition to callback or polite end.",
    severity: "LOW",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "pause_or_schedule",
  },

  // B. CUSTOMER DOESN'T WANT TO TALK / NOT INTERESTED
  {
    id: "customer_not_interested",
    category: "INTEREST",
    name: "Customer Doesn't Want To Talk / Not Interested",
    triggers: [
      "i'm not interested",
      "i don't want anything",
      "not for me",
      "no thanks",
      "don't call me",
      "leave me alone",
    ],
    intent: "Customer expresses clear disinterest in hearing the offer.",
    recommendedResponse:
      "“That's absolutely fine. I understand. Thank you for your time.”",
    optionalFollowUp: "End the call politely or follow the authorized disposition.",
    stopCondition: "Do not attempt aggressive objection-handling or rebuttal scripts.",
    severity: "LOW",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },

  // C. CUSTOMER ASKS WHO IS CALLING
  {
    id: "who_is_calling",
    category: "IDENTITY",
    name: "Customer Asks Who Is Calling",
    triggers: [
      "who are you calling from?",
      "what company is this?",
      "who is this?",
      "who do you represent?",
      "what company are you with?",
    ],
    intent: "Customer wants clear, transparent identification of the calling party.",
    recommendedResponse:
      "“I'm calling from Sparta regarding your phone services. We're reviewing qualifying telephone lines for the 500-minute capped offer.”",
    optionalFollowUp:
      "Never invent a company name. Never claim to represent BT, Openreach, or any other organization unless authorized.",
    stopCondition: "If the customer asks for verification, provide official company contact details.",
    severity: "MEDIUM",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // D. CUSTOMER ASKS WHY THEY WERE CALLED
  {
    id: "why_called",
    category: "CAMPAIGN_REASON",
    name: "Customer Asks Why They Were Called",
    triggers: [
      "why are you calling me?",
      "why am i getting this call?",
      "what's the reason for this call?",
      "what do you want?",
    ],
    intent: "Customer seeks the commercial purpose and rationale of the call.",
    recommendedResponse:
      "“We're calling to check whether you're paying about right for your landline and phone services, and to see if the 500-minute offer is more suitable for your usage.”",
    optionalFollowUp: "Do not invent false eligibility or claim they were specially selected by the government.",
    stopCondition: "Provide straightforward explanation and pause for customer acknowledgment.",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // E. CUSTOMER ASKS HOW YOU GOT THEIR NUMBER
  {
    id: "how_got_number",
    category: "DATA_PRIVACY",
    name: "Customer Asks How You Got Their Number",
    triggers: [
      "how did you get my number?",
      "where did you get my details?",
      "who gave you my phone number?",
      "is this from the phone book?",
    ],
    intent: "Customer expresses concern regarding data privacy and consent sources.",
    recommendedResponse:
      "“Your contact details were provided through authorized UK telecom directory records for phone service reviews. If you prefer not to receive calls, I can easily note that on our system.”",
    optionalFollowUp:
      "If no approved answer is known, say: 'I'm sorry, I don't want to give you incorrect information about that. I can provide the approved contact details so you can verify the call.'",
    stopCondition: "Never fabricate data providers. If customer requests suppression, apply DO_NOT_CALL.",
    severity: "MEDIUM",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // F. CUSTOMER THINKS IT IS A SCAM
  {
    id: "thinks_scam",
    category: "SECURITY",
    name: "Customer Thinks It Is A Scam / Suspicious",
    triggers: [
      "is this a scam?",
      "how do i know you're genuine?",
      "sounds like a scam",
      "too many scammers calling",
      "i don't trust this",
      "how do i know you're real?",
    ],
    intent: "Customer has legitimate security and fraud concerns.",
    recommendedResponse:
      "“I completely understand why you'd want to be careful. You don't have to provide anything you're uncomfortable sharing. You can independently verify the company using the official contact details before continuing.”",
    optionalFollowUp:
      "NEVER say 'It's definitely not a scam'. Explain that we never ask for PINs, passwords, or OTPs.",
    stopCondition: "If customer still does not trust the call: STOP COLLECTION. Mark SECURITY_CONCERN.",
    severity: "HIGH",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "stop_collection",
  },

  // G. DOB OBJECTIONS — WHY NEEDED
  {
    id: "dob_why_needed",
    category: "DOB",
    name: "Customer Asks Why DOB Is Needed",
    triggers: [
      "why do you need my date of birth?",
      "why my dob?",
      "why are you asking for my birthday?",
      "what has my age got to do with it?",
    ],
    intent: "Customer questions why age / DOB verification is part of the process.",
    recommendedResponse:
      "“It’s simply part of the eligibility check for the offer we’ve just discussed.”",
    optionalFollowUp: "Reassure the customer that the date of birth is only checked against the tariff criteria.",
    stopCondition: "If the customer is happy, record DOB. If they refuse, do not pressure.",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: true,
    action: "continue",
  },

  // G2. DOB OBJECTIONS — REFUSAL
  {
    id: "dob_refusal",
    category: "DOB",
    name: "Customer Refuses To Provide DOB",
    triggers: [
      "i don't give my dob over the phone",
      "i refuse to give my date of birth",
      "i'm not telling you my birthday",
      "not giving that",
    ],
    intent: "Customer refuses to provide date of birth.",
    recommendedResponse:
      "“That's completely fine. I understand you may not want to provide that over the phone. Without the eligibility check, I won't be able to complete that part of the process.”",
    optionalFollowUp: "Do not repeatedly pressure the customer. Offer callback or complete with note.",
    stopCondition: "Stop DOB collection immediately. Mark DOB_REFUSED.",
    severity: "MEDIUM",
    allowContinue: true,
    sensitiveInfoInvolved: true,
    action: "continue",
  },

  // H. CUSTOMER ID OBJECTIONS — WHY NEEDED
  {
    id: "customer_id_why",
    category: "CUSTOMER_ID",
    name: "Customer Asks Why Customer ID Is Needed",
    triggers: [
      "why do you need my customer id?",
      "why my account id?",
      "what is the customer id used for?",
      "why do you need that number?",
    ],
    intent: "Customer wants assurance about why their account identifier is requested.",
    recommendedResponse:
      "“It’s just being used to match your account and check the Direct Debit eligibility. It isn't a request for your PIN, password or OTP.”",
    optionalFollowUp: "Emphasize that no security credentials or banking passwords are ever requested.",
    stopCondition: "If customer provides ID, repeat back slowly. If uncomfortable, use fallback.",
    severity: "MEDIUM",
    allowContinue: true,
    sensitiveInfoInvolved: true,
    action: "continue",
  },

  // H2. CUSTOMER DOES NOT HAVE ID
  {
    id: "customer_id_not_available",
    category: "CUSTOMER_ID",
    name: "Customer Does Not Have ID Available",
    triggers: [
      "i don't have my customer id",
      "i haven't got the paperwork",
      "i don't know where it is",
      "can't find my id",
      "i don't have that with me",
    ],
    intent: "Customer cannot locate or does not possess the customer ID document.",
    recommendedResponse:
      "“That’s absolutely fine. Please don't guess it. We can leave that part for the relevant team to verify through the proper process.”",
    optionalFollowUp: "Set customerIdStatus = NOT_AVAILABLE. Never allow the agent to fabricate an ID.",
    stopCondition: "Do not make the customer guess. Move to next step smoothly.",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // H3. CUSTOMER UNCOMFORTABLE PROVIDING ID
  {
    id: "customer_id_uncomfortable",
    category: "CUSTOMER_ID",
    name: "Customer Uncomfortable Providing ID",
    triggers: [
      "i'm not comfortable giving that",
      "i won't give my id over the phone",
      "i'd rather not share that",
    ],
    intent: "Customer does not feel safe sharing their account ID.",
    recommendedResponse:
      "“No problem at all. I completely understand. You don't have to provide anything you're not comfortable sharing over the phone.”",
    optionalFollowUp: "Provide the approved alternative process for fulfillment team verification.",
    stopCondition: "Stop ID collection immediately.",
    severity: "MEDIUM",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // H4. CUSTOMER GIVES INVALID ID
  {
    id: "customer_id_invalid",
    category: "CUSTOMER_ID",
    name: "Customer Gives Invalid ID Format",
    triggers: ["invalid_id_format_detected"],
    intent: "The provided identifier does not match the configured format (e.g. IBANGB prefix).",
    recommendedResponse:
      "“The identifier doesn't appear to match the expected format. Could you please check it once more?”",
    optionalFollowUp: "Allow Retry, Cancel, or Escalate. Never silently alter the customer's input.",
    stopCondition: "Prompt for re-check without arguing.",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // I. SEND IT IN WRITING FIRST
  {
    id: "send_in_writing",
    category: "OFFER",
    name: "Customer Wants Information In Writing First",
    triggers: [
      "send me something first",
      "put it in the post",
      "send it in writing",
      "can i see it in black and white?",
      "email me the details",
    ],
    intent: "Customer wants physical or written documentation before agreeing to changes.",
    recommendedResponse:
      "“That is exactly how it works. All the full details and terms are provided to you in writing, so you can read everything properly before any changes are made.”",
    optionalFollowUp: "Reassure that today's call only confirms details for the postal packet.",
    stopCondition: "Proceed with address verification so documentation can be dispatched.",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // J. ALREADY HAVE BROADBAND / DON'T USE LANDLINE
  {
    id: "dont_use_landline",
    category: "USAGE",
    name: "Customer Hardly Uses Landline",
    triggers: [
      "i don't use my landline",
      "i only use my mobile",
      "landline is just for broadband",
      "nobody calls my house phone",
    ],
    intent: "Customer feels the landline is obsolete for outgoing calls.",
    recommendedResponse:
      "“That's quite common nowadays. That's why this offer is designed specifically for lower usage, including 500 anytime minutes so you're not paying for unlimited minutes you don't need.”",
    optionalFollowUp: "Highlight that it prevents paying higher standard line rental rates.",
    stopCondition: "Acknowledge and proceed with Stage 2 / Stage 3.",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // K. CUSTOMER IS UPSET / DE-ESCALATION
  {
    id: "customer_upset",
    category: "DE_ESCALATION",
    name: "Customer Becomes Upset / Irritated",
    triggers: [
      "stop calling me!",
      "you're annoying me",
      "i'm sick of these calls",
      "this is harassment",
      "leave me alone!",
    ],
    intent: "Customer is emotionally agitated or angry.",
    recommendedResponse:
      "“I understand. I don't want to cause you any inconvenience. We can stop here if you'd prefer.”",
    optionalFollowUp: "Never argue. Never instruct the agent to pressure the customer.",
    stopCondition: "Immediately switch to DE-ESCALATION MODE and close respectfully.",
    severity: "CRITICAL",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "de_escalate",
  },

  // L. WRONG PERSON ANSWERING
  {
    id: "wrong_person",
    category: "IDENTITY",
    name: "Wrong Person / Person Not Available",
    triggers: [
      "he doesn't live here",
      "she moved away",
      "you have the wrong person",
      "i am the tenant",
      "passed away",
    ],
    intent: "The person on the phone is not the target account holder.",
    recommendedResponse:
      "“I apologize for the misunderstanding. I'll make sure our records are updated so you aren't disturbed further. Thank you for letting me know.”",
    optionalFollowUp: "Do not disclose customer information or account reason. Set disposition WRONG_PERSON.",
    stopCondition: "Cease all sales discussion immediately.",
    severity: "HIGH",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },

  // M. DO NOT CALL REQUEST
  {
    id: "do_not_call",
    category: "COMPLIANCE",
    name: "Customer Requests No Further Calls (DNC)",
    triggers: [
      "do not call me again",
      "take me off your calling list",
      "never phone this number again",
      "put me on your do not call list",
    ],
    intent: "Customer exercises formal right to object to telephone marketing.",
    recommendedResponse:
      "“I will immediately place your number on our Do Not Call suppression list so you will not receive any further calls from us. Thank you for your time.”",
    optionalFollowUp: "Immediately set disposition: DO_NOT_CALL. Zero further selling.",
    stopCondition: "Stop conversation completely.",
    severity: "CRITICAL",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },
];
