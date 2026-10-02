import { ObjectionItem } from "../types";

export const objectionLibrary: ObjectionItem[] = [
  // 1. OPENING — WHAT IS THIS ABOUT / SAYS YES
  {
    id: "sec_1_what_is_this_about",
    sectionNumber: 1,
    category: "OPENING",
    name: "Customer asks “What is this about?”",
    triggers: [
      "what is this about?",
      "what's this regarding?",
      "what is the call about?",
      "why are you calling?",
    ],
    intent: "Customer wants immediate clarity on the reason for the call.",
    recommendedResponse:
      "“It's regarding your current telephone service. There may be a reduction of up to 30% on your monthly bill.\n\nI'll quickly check your details first, then I'll explain what the reduction would mean for you.”",
    optionalFollowUp: "Golden Rule: Keep it short, one paragraph, and pause.",
    stopCondition: "If customer declines, respect decision and transition gracefully.",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },
  {
    id: "sec_1_customer_says_yes",
    sectionNumber: 1,
    category: "OPENING",
    name: "Customer says Yes / Continues",
    triggers: ["yes", "go ahead", "okay", "sure", "continue"],
    intent: "Customer is willing to hear the reduction details.",
    recommendedResponse:
      "“Perfect, thank you. I'll just check a few details with you so I can make sure everything is correct.”",
    stopCondition: "Proceed with unhurried, calm pace.",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 2. CUSTOMER WANTS TO KNOW WHO YOU ARE
  {
    id: "sec_2_who_are_you_calling_from",
    sectionNumber: 2,
    category: "IDENTITY",
    name: "Customer: “Who are you calling from?”",
    triggers: [
      "who are you calling from?",
      "what company is this?",
      "who is this calling?",
      "who do you represent?",
    ],
    intent: "Customer requires clear caller and company identity.",
    recommendedResponse:
      "“I'm calling from [COMPANY NAME] regarding your telephone service and current monthly bill.\n\nI'm contacting you about the available reduction and checking whether your service qualifies for it.”",
    optionalFollowUp: "Always state approved company name truthfully.",
    stopCondition: "Never invent or misrepresent company identity.",
    severity: "MEDIUM",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },
  {
    id: "sec_2_are_you_from_bt",
    sectionNumber: 2,
    category: "IDENTITY",
    name: "Customer: “Are you from BT?”",
    triggers: ["are you from bt?", "is this bt?", "are you british telecom?", "bt?"],
    intent: "Customer asks whether you are BT.",
    recommendedResponse:
      "“I'm calling from [COMPANY NAME]. I'll be happy to explain exactly who we are before we continue.\n\nI don't want to give you the wrong information, so I'll keep everything clear and straightforward.”",
    optionalFollowUp:
      "If authorized to represent BT: “I'm calling on behalf of BT regarding your telephone service and current monthly bill. I'm contacting you about the available reduction and checking whether your service qualifies for it.”",
    stopCondition: "Only claim to represent BT if strictly authorized.",
    severity: "HIGH",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 3. CUSTOMER SAYS “I'M NOT INTERESTED”
  {
    id: "sec_3_not_interested",
    sectionNumber: 3,
    category: "INTEREST",
    name: "Customer says “I'm not interested”",
    triggers: ["i'm not interested", "not interested", "no thank you", "not for me"],
    intent: "Customer expresses initial reluctance.",
    recommendedResponse:
      "“I completely understand. Before you decide, let me quickly explain what the reduction is about.\n\nIf you're eligible, I'll tell you exactly what the saving could be. You can then decide whether you want to continue.”",
    optionalFollowUp:
      "If they still don't want it: “No problem at all. I understand. Thank you for your time, and I'll let you get back to your day.”",
    stopCondition: "Clarify once gently. If they still refuse, stop immediately.",
    severity: "LOW",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },

  // 4. CUSTOMER SAYS “I'M BUSY”
  {
    id: "sec_4_busy",
    sectionNumber: 4,
    category: "AVAILABILITY",
    name: "Customer says “I'm busy”",
    triggers: ["i'm busy", "busy right now", "no time", "in the middle of something", "bad time"],
    intent: "Customer is pressed for time.",
    recommendedResponse:
      "“I completely understand. It shouldn't take long to check the account and see whether the reduction applies to your service.\n\nI'll keep it brief and only ask for the details needed to check your eligibility.”",
    optionalFollowUp: "If they agree: “Thank you. I'll keep this as quick and simple as possible.”",
    stopCondition: "Offer a callback if they prefer not to speak now.",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "pause_or_schedule",
  },

  // 5. CUSTOMER SAYS “HOW MUCH WILL I SAVE?”
  {
    id: "sec_5_how_much_save",
    sectionNumber: 5,
    category: "OFFER",
    name: "Customer says “How much will I save?”",
    triggers: ["how much will i save?", "how much is the saving?", "what do i save?", "how much discount?"],
    intent: "Customer wants immediate financial figures.",
    recommendedResponse:
      "“The reduction can be up to 30%, depending on your current service and monthly bill.\n\nI'll check your details first, so I can give you the correct information rather than guessing.”",
    stopCondition: "Never guess figures before checking baseline bill.",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 6. CUSTOMER SAYS “IS THIS A NEW CONTRACT?”
  {
    id: "sec_6_new_contract",
    sectionNumber: 6,
    category: "OFFER",
    name: "Customer says “Is this a new contract?”",
    triggers: ["is this a new contract?", "am i signing a contract?", "contract change?", "new agreement?"],
    intent: "Customer is concerned about contract disruption.",
    recommendedResponse:
      "“Before I give you an answer, I'll check the details of your current service.\n\nI'll then explain whether the reduction involves any change to your existing service or agreement.”",
    stopCondition: "Provide clear, transparent explanation before any agreement.",
    severity: "MEDIUM",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 7. CONSUMER IDENTIFICATION NUMBER
  {
    id: "sec_7_consumer_id_why",
    sectionNumber: 7,
    category: "VERIFICATION",
    name: "Consumer ID: “Why do you need it?”",
    triggers: ["why do you need my consumer id?", "why do you need it?", "why id?"],
    intent: "Customer asks why Consumer Identification Number is requested.",
    recommendedResponse:
      "“It's simply to verify the correct account and make sure I'm looking at the right service details.\n\nI don't want to give you information for the wrong account.”",
    stopCondition: "Do not pressure customer if they refuse.",
    severity: "MEDIUM",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },
  {
    id: "sec_7_consumer_id_where",
    sectionNumber: 7,
    category: "VERIFICATION",
    name: "Consumer ID: Doesn't know where to find it",
    triggers: ["where do i find it?", "i don't know where it is", "don't know where to look"],
    intent: "Customer cannot locate the Consumer Identification Number.",
    recommendedResponse:
      "“That's absolutely fine. Take your time and have a look at your latest bill or service information.\n\nIt may be shown with your other account details.”",
    stopCondition: "Allow customer time or proceed with available details.",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },
  {
    id: "sec_7_consumer_id_refuses",
    sectionNumber: 7,
    category: "VERIFICATION",
    name: "Consumer ID: Customer refuses",
    triggers: ["i'm not giving that", "i refuse to give id", "won't give id", "not sharing id"],
    intent: "Customer refuses to provide account ID.",
    recommendedResponse:
      "“That's completely fine. Please don't share anything you're uncomfortable sharing.\n\nWithout verification, I may not be able to check the account details for you.”",
    stopCondition: "Never pressure. Respect refusal.",
    severity: "HIGH",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 8. VERIFICATION COMPLETED
  {
    id: "sec_8_verification_completed",
    sectionNumber: 8,
    category: "VERIFICATION",
    name: "Verification Completed",
    triggers: ["id verified", "verification done", "account verified"],
    intent: "Account verification is complete.",
    recommendedResponse:
      "“Thank you. That's all I needed for the account verification.\n\nI'll now check a few basic details about your current service so I can explain the reduction correctly.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 9. CURRENT SERVICE
  {
    id: "sec_9_current_service",
    sectionNumber: 9,
    category: "SERVICE",
    name: "Current Service: Ask at home",
    triggers: ["current service", "at home", "using service at home"],
    intent: "Confirm telephone service is used at home.",
    recommendedResponse:
      "“Can I just confirm, are you currently using this telephone service at your home?”",
    optionalFollowUp:
      "YES: “Perfect, thank you. I'll just confirm a couple more details.”\nNO: “No problem. Let me make sure I have the correct service information before we continue.”\nDON'T KNOW: “That's completely fine. I'll ask another simple question to help confirm the service.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 10. CURRENT MONTHLY BILL
  {
    id: "sec_10_monthly_bill",
    sectionNumber: 10,
    category: "BILLING",
    name: "Current Monthly Bill",
    triggers: ["monthly bill", "how much paying", "current payment"],
    intent: "Discover monthly bill amount.",
    recommendedResponse:
      "“Could you tell me roughly how much you're currently paying each month for your telephone service?”",
    optionalFollowUp:
      "CUSTOMER DOESN'T KNOW: “That's fine. If you have your latest bill nearby, you can check it for me.”\nCUSTOMER GIVES AMOUNT: “Thank you. That gives me a better idea of your current monthly cost.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 11. EXPLAINING THE REDUCTION
  {
    id: "sec_11_explaining_reduction",
    sectionNumber: 11,
    category: "OFFER",
    name: "Explaining The Reduction",
    triggers: ["explaining reduction", "how much exactly?", "exact figure"],
    intent: "Present reduction clearly.",
    recommendedResponse:
      "“Based on the information you've given me, the available reduction could lower your monthly telephone cost.\n\nThe exact amount depends on your current service and the details we've just checked.”",
    optionalFollowUp:
      "CUSTOMER ASKS “HOW MUCH EXACTLY?”: “I'll confirm the exact figure once the remaining details have been checked. I don't want to give you an incorrect amount before everything is verified.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 12. CUSTOMER IS INTERESTED
  {
    id: "sec_12_interested",
    sectionNumber: 12,
    category: "FLOW",
    name: "Customer Is Interested",
    triggers: ["sounds good", "i'm interested", "tell me more", "let's hear it"],
    intent: "Customer expresses interest to proceed.",
    recommendedResponse:
      "“That's good. I'll quickly go through the remaining details with you.\n\nThis is just to make sure the information on the account is correct before we continue.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 13. CUSTOMER IS CONFUSED
  {
    id: "sec_13_confused",
    sectionNumber: 13,
    category: "FLOW",
    name: "Customer Is Confused",
    triggers: ["i'm confused", "i don't follow", "i don't understand", "what do you mean?"],
    intent: "Customer needs simplified explanation.",
    recommendedResponse:
      "“No problem at all. I'll keep it simple.\n\nI'm checking your current telephone service to see whether the available bill reduction applies to you.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 14. CUSTOMER INTERRUPTS
  {
    id: "sec_14_interrupts",
    sectionNumber: 14,
    category: "FLOW",
    name: "Customer Interrupts",
    triggers: ["interrupt", "wait a minute", "hang on", "let me ask"],
    intent: "Customer speaks up during script delivery.",
    recommendedResponse:
      "“Of course, please go ahead.\n\nI'll listen to your question first, and then I'll explain the part you want to know about.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 15. CUSTOMER GOES OFF TOPIC
  {
    id: "sec_15_off_topic",
    sectionNumber: 15,
    category: "FLOW",
    name: "Customer Goes Off Topic",
    triggers: ["off topic", "tangent", "talking about weather", "unrelated story"],
    intent: "Customer strays from the call flow.",
    recommendedResponse:
      "“I understand. We can come back to that in a moment.\n\nLet me quickly finish this account check first, so I can give you the correct information.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 16. CUSTOMER SAYS “I ALREADY HAVE A DISCOUNT”
  {
    id: "sec_16_already_have_discount",
    sectionNumber: 16,
    category: "BILLING",
    name: "Customer says “I already have a discount”",
    triggers: ["i already have a discount", "i'm on a discount", "already discounted", "have special rate"],
    intent: "Customer mentions existing discount.",
    recommendedResponse:
      "“That's fine. I'll take that into account when checking the current service.\n\nThe purpose of the call is to see whether any available reduction applies to your account.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 17. CUSTOMER SAYS “MY BILL IS ALREADY CHEAP”
  {
    id: "sec_17_bill_already_cheap",
    sectionNumber: 17,
    category: "BILLING",
    name: "Customer says “My bill is already cheap”",
    triggers: ["my bill is already cheap", "i pay very little", "it's already low", "cheap bill"],
    intent: "Customer feels their bill cannot be improved.",
    recommendedResponse:
      "“That's good to hear. I'll simply check the current service before saying whether anything can be reduced.\n\nIf there is no further reduction available, I'll tell you clearly.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 18. CUSTOMER SAYS “I DON'T TRUST PHONE CALLS”
  {
    id: "sec_18_dont_trust_calls",
    sectionNumber: 18,
    category: "SECURITY",
    name: "Customer says “I don't trust phone calls”",
    triggers: ["i don't trust phone calls", "don't trust cold calls", "uncomfortable on the phone"],
    intent: "Customer is cautious regarding telephone communications.",
    recommendedResponse:
      "“I completely understand. You should always be careful with personal information over the phone.\n\nPlease don't provide anything you're uncomfortable sharing. I can explain the purpose of each detail before you provide it.”",
    severity: "HIGH",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 19. CUSTOMER ASKS FOR A WEBSITE
  {
    id: "sec_19_website",
    sectionNumber: 19,
    category: "IDENTITY",
    name: "Customer Asks For A Website",
    triggers: ["do you have a website?", "what's your website?", "can i check online?", "website"],
    intent: "Customer wants independent online verification.",
    recommendedResponse:
      "“Of course. You can verify the company and the service independently before providing any information.\n\nIf you'd rather not continue on this call, that's completely fine.”",
    severity: "MEDIUM",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 20. CUSTOMER SAYS “I'LL CALL MY PROVIDER”
  {
    id: "sec_20_call_my_provider",
    sectionNumber: 20,
    category: "INTEREST",
    name: "Customer says “I'll call my provider”",
    triggers: ["i'll call my provider", "i'll speak to my provider", "i'll ring my own company"],
    intent: "Customer prefers contacting their provider directly.",
    recommendedResponse:
      "“That's absolutely fine. You can contact your provider directly and ask about any available reduction on your current service.\n\nThank you for your time, and have a good day.”",
    severity: "LOW",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },

  // 21. CUSTOMER SAYS “CALL ME LATER”
  {
    id: "sec_21_call_me_later",
    sectionNumber: 21,
    category: "AVAILABILITY",
    name: "Customer says “Call me later”",
    triggers: ["call me later", "ring me back", "call back another time", "can you call tomorrow?"],
    intent: "Customer requests a callback.",
    recommendedResponse:
      "“Of course. What time would be convenient for you?\n\nI'll make a note of the preferred time so you're not contacted at an inconvenient moment.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "pause_or_schedule",
  },

  // 22. CUSTOMER SAYS “I'M NOT THE ACCOUNT HOLDER”
  {
    id: "sec_22_not_account_holder",
    sectionNumber: 22,
    category: "COMPLIANCE",
    name: "Customer says “I'm not the account holder”",
    triggers: ["i'm not the account holder", "not in my name", "not my account", "not the bill payer"],
    intent: "The person on the call does not hold authority on the account.",
    recommendedResponse:
      "“No problem. I don't want to discuss account information with the wrong person.\n\nI'll leave it there rather than asking you for any account details.”",
    stopCondition: "Do NOT collect account details from non-account holders.",
    severity: "HIGH",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },

  // 23. CUSTOMER SAYS “THE ACCOUNT IS IN MY PARTNER'S NAME”
  {
    id: "sec_23_partner_name",
    sectionNumber: 23,
    category: "COMPLIANCE",
    name: "Customer says “The account is in my partner's name”",
    triggers: ["in my partner's name", "in my husband's name", "in my wife's name", "spouse's name"],
    intent: "Account belongs to partner/spouse.",
    recommendedResponse:
      "“That's fine. Because the account is in their name, I'll need to speak with the account holder directly.\n\nI won't ask you to provide their private account information.”",
    stopCondition: "Compliance rule: Do not collect private information through a third party.",
    severity: "HIGH",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },

  // 24. CUSTOMER SAYS “I DON'T WANT TO GIVE MY DATE OF BIRTH”
  {
    id: "sec_24_dob_refusal",
    sectionNumber: 24,
    category: "DATA_PRIVACY",
    name: "Customer says “I don't want to give my date of birth”",
    triggers: ["i don't want to give my dob", "not giving date of birth", "won't give dob", "refuse birthday"],
    intent: "Customer prefers not to share birth date.",
    recommendedResponse:
      "“That's completely understandable.\n\nPlease only provide information you're comfortable sharing. Without the required verification, I may not be able to complete the account check.”",
    stopCondition: "Never pressure.",
    severity: "MEDIUM",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 25. CUSTOMER SAYS “WHY DO YOU NEED MY DATE OF BIRTH?”
  {
    id: "sec_25_why_dob",
    sectionNumber: 25,
    category: "DATA_PRIVACY",
    name: "Customer says “Why do you need my date of birth?”",
    triggers: ["why do you need my date of birth?", "why do you need my dob?", "why birthday?"],
    intent: "Customer inquires why DOB is asked.",
    recommendedResponse:
      "“It's used as part of the account verification process.\n\nThe purpose is simply to make sure the correct customer and service record are being checked.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 26. CUSTOMER SAYS “I DON'T HAVE MY BILL”
  {
    id: "sec_26_dont_have_bill",
    sectionNumber: 26,
    category: "BILLING",
    name: "Customer says “I don't have my bill”",
    triggers: ["i don't have my bill", "bill is not here", "can't find bill", "no paperwork"],
    intent: "Customer lacks bill document nearby.",
    recommendedResponse:
      "“That's absolutely fine. We can continue with the information you have available.\n\nIf we need anything else, I'll explain what is required before asking for it.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 27. CUSTOMER ASKS “IS THIS A SCAM?”
  {
    id: "sec_27_is_this_a_scam",
    sectionNumber: 27,
    category: "SECURITY",
    name: "Customer asks “Is this a scam?”",
    triggers: ["is this a scam?", "are you scammers?", "this sounds like a scam", "fraud"],
    intent: "Customer expresses fraud suspicion.",
    recommendedResponse:
      "“I understand why you'd ask. You should always be careful with unexpected calls.\n\nDon't provide information you're uncomfortable sharing. You can independently verify the company before continuing.”",
    stopCondition: "Never argue, never say 'I promise we are legitimate'.",
    severity: "CRITICAL",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 28. CUSTOMER ASKS FOR YOUR NAME
  {
    id: "sec_28_your_name",
    sectionNumber: 28,
    category: "IDENTITY",
    name: "Customer asks for your name",
    triggers: ["what is your name?", "who am i speaking to?", "what's your name?", "your name please"],
    intent: "Customer requests caller name.",
    recommendedResponse:
      "“Of course. My name is Peter, and I'm calling from [COMPANY NAME].\n\nI'm contacting you regarding the available reduction on your telephone service.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 29. CUSTOMER ASKS FOR YOUR EMPLOYEE NUMBER
  {
    id: "sec_29_employee_number",
    sectionNumber: 29,
    category: "IDENTITY",
    name: "Customer asks for your employee number",
    triggers: ["what is your employee number?", "what's your agent id?", "employee reference", "agent number"],
    intent: "Customer asks for formal employee ID reference.",
    recommendedResponse:
      "“Certainly. My employee or agent reference is [APPROVED ID].\n\nYou can use that reference when checking the call with the company.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 30. CUSTOMER SAYS “I WANT TO THINK ABOUT IT”
  {
    id: "sec_30_think_about_it",
    sectionNumber: 30,
    category: "DECISION",
    name: "Customer says “I want to think about it”",
    triggers: ["i want to think about it", "need time to think", "i'll think about it", "let me think"],
    intent: "Customer wants time before deciding.",
    recommendedResponse:
      "“Of course. There's no problem with taking some time to think about it.\n\nI'll make sure you've understood the reduction and what it means before you make any decision.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 31. CUSTOMER SAYS “I NEED TO SPEAK TO MY FAMILY”
  {
    id: "sec_31_speak_to_family",
    sectionNumber: 31,
    category: "DECISION",
    name: "Customer says “I need to speak to my family”",
    triggers: ["i need to speak to my family", "speak to my daughter", "speak to my son", "discuss with family"],
    intent: "Customer consults family members.",
    recommendedResponse:
      "“That's completely fine.\n\nIt's always better to discuss changes to your service with anyone else involved in managing the household bills.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 32. CUSTOMER SAYS “I'M HAPPY WITH MY CURRENT PROVIDER”
  {
    id: "sec_32_happy_with_provider",
    sectionNumber: 32,
    category: "INTEREST",
    name: "Customer says “I'm happy with my current provider”",
    triggers: ["i'm happy with my provider", "happy with bt", "happy with current service", "don't want to change"],
    intent: "Customer is loyal to existing provider.",
    recommendedResponse:
      "“That's completely fine. I'm not asking you to make a decision immediately.\n\nI'm simply checking whether the available reduction applies to your current telephone service.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 33. CUSTOMER SAYS “WILL MY NUMBER CHANGE?”
  {
    id: "sec_33_will_number_change",
    sectionNumber: 33,
    category: "TECHNICAL",
    name: "Customer says “Will my number change?”",
    triggers: ["will my number change?", "do i keep my number?", "change my phone number?", "same number"],
    intent: "Customer is worried about losing phone number.",
    recommendedResponse:
      "“I'll explain any service changes before anything is agreed.\n\nI don't want you to continue without understanding exactly what would happen.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 34. CUSTOMER SAYS “WILL MY SERVICE STOP?”
  {
    id: "sec_34_service_stop",
    sectionNumber: 34,
    category: "TECHNICAL",
    name: "Customer says “Will my service stop?”",
    triggers: ["will my service stop?", "will my line be cut off?", "will it disconnect?", "service disruption"],
    intent: "Customer fears loss of telephone service.",
    recommendedResponse:
      "“No, the purpose is to discuss the available reduction on your service.\n\nI'll explain any changes clearly before anything is agreed or processed.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 35. CUSTOMER ASKS ABOUT CONTRACT
  {
    id: "sec_35_contract_inquiry",
    sectionNumber: 35,
    category: "OFFER",
    name: "Customer Asks About Contract",
    triggers: ["what is the contract?", "how long is the contract?", "contract details", "is there a contract?"],
    intent: "Customer asks for contract conditions.",
    recommendedResponse:
      "“I'll check the details of your current service first.\n\nOnce that's confirmed, I'll explain any contract or service conditions that apply.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 36. CUSTOMER SAYS “I DON'T WANT A CONTRACT”
  {
    id: "sec_36_dont_want_contract",
    sectionNumber: 36,
    category: "OFFER",
    name: "Customer says “I don't want a contract”",
    triggers: ["i don't want a contract", "no contract", "refuse contracts", "not signing a contract"],
    intent: "Customer is averse to contracts.",
    recommendedResponse:
      "“I understand.\n\nI'll check whether the available reduction has any contract requirements and explain them clearly before you decide.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 37. CUSTOMER SAYS “JUST SEND ME SOMETHING”
  {
    id: "sec_37_send_something",
    sectionNumber: 37,
    category: "OFFER",
    name: "Customer says “Just send me something”",
    triggers: ["just send me something", "send it in the post", "put it in writing", "send letter"],
    intent: "Customer wants written information.",
    recommendedResponse:
      "“That's understandable.\n\nI'll explain what the offer involves first, so you know exactly what information you're being sent and why.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 38. CUSTOMER SAYS “I DON'T WANT TO GIVE BANK DETAILS”
  {
    id: "sec_38_no_bank_details",
    sectionNumber: 38,
    category: "DATA_PRIVACY",
    name: "Customer says “I don't want to give bank details”",
    triggers: ["i don't want to give bank details", "no bank details", "won't give bank", "not sharing bank"],
    intent: "Customer refuses financial data sharing.",
    recommendedResponse:
      "“That's completely fine.\n\nPlease don't provide financial information unless you're comfortable and the purpose has been clearly explained and verified.”",
    stopCondition: "Never pressure for financial details.",
    severity: "HIGH",
    allowContinue: true,
    sensitiveInfoInvolved: true,
    action: "continue",
  },

  // 39. CUSTOMER ASKS “WHY DO YOU NEED BANK DETAILS?”
  {
    id: "sec_39_why_bank_details",
    sectionNumber: 39,
    category: "BILLING",
    name: "Customer asks “Why do you need bank details?”",
    triggers: ["why do you need bank details?", "why bank details?", "why account number?"],
    intent: "Customer wants justification for payment details.",
    recommendedResponse:
      "“If payment information is required for the service, I'll explain exactly why it is needed before asking for anything.\n\nYou should never provide financial information without understanding its purpose.”",
    severity: "HIGH",
    allowContinue: true,
    sensitiveInfoInvolved: true,
    action: "continue",
  },

  // 40. CUSTOMER BECOMES ANGRY
  {
    id: "sec_40_angry",
    sectionNumber: 40,
    category: "COMPLIANCE",
    name: "Customer Becomes Angry",
    triggers: ["customer angry", "angry shouting", "stop wasting my time", "furious"],
    intent: "Customer is visibly agitated.",
    recommendedResponse:
      "“I understand you're unhappy, and I don't want to waste your time.\n\nI'll stop here. Thank you for speaking with me, and I hope you have a good day.”",
    stopCondition: "Stop call immediately. Do not argue.",
    severity: "CRITICAL",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },

  // 41. CUSTOMER SAYS “REMOVE MY NUMBER”
  {
    id: "sec_41_remove_number",
    sectionNumber: 41,
    category: "COMPLIANCE",
    name: "Customer says “Remove my number”",
    triggers: ["remove my number", "take me off your list", "delete my number", "do not call list"],
    intent: "Customer demands number suppression.",
    recommendedResponse:
      "“Understood. I won't continue with the call.\n\nI'll follow the company's process for your request regarding future contact.”",
    stopCondition: "Mandatory compliance: Flag for suppression (DO_NOT_CALL).",
    severity: "CRITICAL",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },

  // 42. CUSTOMER SAYS “STOP CALLING ME”
  {
    id: "sec_42_stop_calling",
    sectionNumber: 42,
    category: "COMPLIANCE",
    name: "Customer says “Stop calling me”",
    triggers: ["stop calling me", "don't call again", "stop ringing me", "never call here"],
    intent: "Customer demands immediate cessation of calls.",
    recommendedResponse:
      "“Understood. I'll stop the call now.\n\nI'll follow the correct process for your request. Thank you for your time.”",
    stopCondition: "Stop call immediately.",
    severity: "CRITICAL",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },

  // 43. CUSTOMER WANTS TO END THE CALL
  {
    id: "sec_43_wants_to_end",
    sectionNumber: 43,
    category: "FLOW",
    name: "Customer Wants To End The Call",
    triggers: ["i want to hang up", "goodbye", "i have to go now", "let me go"],
    intent: "Customer chooses to end conversation.",
    recommendedResponse:
      "“Of course. I won't keep you.\n\nThank you for your time, and I hope you have a lovely day.”",
    severity: "LOW",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },

  // 44. CUSTOMER AGREES TO CONTINUE
  {
    id: "sec_44_agrees_to_continue",
    sectionNumber: 44,
    category: "FLOW",
    name: "Customer Agrees To Continue",
    triggers: ["i agree to continue", "let's carry on", "what's next?", "keep going"],
    intent: "Customer confirms willingness to proceed.",
    recommendedResponse:
      "“Perfect, thank you.\n\nI'll keep everything simple and go through the remaining details one at a time.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 45. FINAL CONFIRMATION
  {
    id: "sec_45_final_confirmation",
    sectionNumber: 45,
    category: "CONFIRMATION",
    name: "Final Confirmation",
    triggers: ["final confirmation", "confirm details", "checked details"],
    intent: "Transition to explanation of reduction and terms.",
    recommendedResponse:
      "“Thank you for going through those details with me.\n\nI'll now explain the available reduction and any important terms before you decide whether you want to continue.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 46. BEFORE ANY AGREEMENT
  {
    id: "sec_46_before_agreement",
    sectionNumber: 46,
    category: "COMPLIANCE",
    name: "Before Any Agreement",
    triggers: ["before agreement", "understand terms", "price and service"],
    intent: "Ensure customer understands price, service, and terms.",
    recommendedResponse:
      "“Before we go any further, I'll make sure you understand the price, service, and any relevant terms.\n\nIf anything is unclear, please ask me and I'll explain it.”",
    severity: "MEDIUM",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 47. CUSTOMER HAS A QUESTION
  {
    id: "sec_47_has_question",
    sectionNumber: 47,
    category: "FLOW",
    name: "Customer Has A Question",
    triggers: ["i have a question", "can i ask something?", "question", "one quick question"],
    intent: "Customer poses an inquiry.",
    recommendedResponse:
      "“Of course. What would you like me to explain?\n\nI'll answer that first, then we can continue from where we stopped.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 48. CUSTOMER SAYS YES
  {
    id: "sec_48_says_yes",
    sectionNumber: 48,
    category: "DECISION",
    name: "Customer Says Yes",
    triggers: ["yes i agree", "yes proceed", "yes that's fine", "yes i want it"],
    intent: "Customer agrees to the offer reduction.",
    recommendedResponse:
      "“Perfect. Thank you for confirming.\n\nI'll now go through the next step with you and make sure everything is clear.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 49. CUSTOMER SAYS NO
  {
    id: "sec_49_says_no",
    sectionNumber: 49,
    category: "DECISION",
    name: "Customer Says No",
    triggers: ["no i don't want it", "no thanks", "no i decline", "no not for me"],
    intent: "Customer declines the reduction.",
    recommendedResponse:
      "“No problem at all. I respect your decision.\n\nThank you for your time, and I'll leave it there.”",
    stopCondition: "Respect decision immediately without rebuttals.",
    severity: "LOW",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },

  // 50. CUSTOMER SAYS “I'M NOT SURE”
  {
    id: "sec_50_not_sure",
    sectionNumber: 50,
    category: "DECISION",
    name: "Customer says “I'm not sure”",
    triggers: ["i'm not sure", "not completely sure", "unsure", "i don't know yet"],
    intent: "Customer is undecided.",
    recommendedResponse:
      "“That's completely fine.\n\nI'll explain the part you're unsure about, and then you can decide whether you want to continue.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 51. CUSTOMER ASKS YOU TO REPEAT
  {
    id: "sec_51_repeat",
    sectionNumber: 51,
    category: "FLOW",
    name: "Customer Asks You To Repeat",
    triggers: ["can you repeat that?", "say that again", "pardon?", "didn't catch that", "repeat"],
    intent: "Customer did not hear or needs line repeated.",
    recommendedResponse:
      "“Of course.\n\nI'll say it again slowly and keep it as simple as possible.”",
    severity: "LOW",
    allowContinue: true,
    sensitiveInfoInvolved: false,
    action: "continue",
  },

  // 52. HARD STOP / COMPLIANCE
  {
    id: "sec_52_hard_stop",
    sectionNumber: 52,
    category: "COMPLIANCE",
    name: "Hard Stop / Compliance Rules",
    triggers: ["compliance", "hard stop", "must stop", "regulatory rule"],
    intent: "Mandatory compliance directives.",
    recommendedResponse:
      "• If the customer clearly asks to end the call, stop the call.\n• If the customer says they do not want to provide information, do not pressure them.\n• If the customer asks who you represent, give the truthful company identity.\n• If the customer asks for verification, provide the approved verification method.\n• If the customer is not the account holder, do not collect the account holder's private information through them.",
    stopCondition: "Strict compliance: Always honor customer boundaries.",
    severity: "CRITICAL",
    allowContinue: false,
    sensitiveInfoInvolved: false,
    action: "disposition",
  },
];
