import { ObjectionItem } from "../types";

export const objectionLibrary: ObjectionItem[] = [
  {
    id: "not_interested",
    category: "NOT INTERESTED",
    triggerPhrases: ["Not interested", "I don't want this", "No thanks", "Not for me"],
    primary:
      "No problem at all. Just so you're completely clear on what I was explaining, the service itself isn't being changed. The existing package and equipment remain as they are; we're simply checking whether a lower Direct Debit rate is available. If that's not something you want, that's absolutely fine.",
    short:
      "That's completely fine. We're only checking if your current bill qualifies for a lower Direct Debit rate with no equipment changes. If not for you, no problem.",
    explain:
      "I appreciate your candour. I only mention it because it doesn't involve moving providers or replacing hardware. If you'd rather leave things untouched, I will gladly respect that.",
    nextAction: "Confirm if customer wishes to hear the 1-sentence summary or immediately conclude call.",
    stopCondition: "If the customer repeats their refusal or remains uninterested, immediately end the call politely.",
  },
  {
    id: "too_busy",
    category: "TOO BUSY",
    triggerPhrases: ["I'm busy right now", "Bad time", "Eating lunch", "Heading out"],
    primary:
      "I completely understand and I don't want to hold you up. Would it be better if we arranged a convenient time to call you back, or would you prefer we leave it for now?",
    short:
      "No problem at all, I won't hold you. Shall we book a quick 2-minute callback for another day?",
    explain:
      "There is no urgency whatsoever. We can easily reschedule for a quieter moment that suits your routine.",
    nextAction: "Offer [CALLBACK] or politely end call.",
    stopCondition: "Do not continue pitching if the customer says they are in a rush.",
  },
  {
    id: "is_this_a_scam",
    category: "IS THIS A SCAM?",
    triggerPhrases: ["Is this a scam?", "Sounds like fraud", "How do I know you're real?", "Too many scammers"],
    primary:
      "I completely understand why you'd be cautious, particularly when telephone calls and services are involved. Please don't provide anything you're uncomfortable sharing. If you'd like, we can stop here and you can independently verify the service through official contact routes before continuing.",
    short:
      "I completely respect your caution. Please don't share anything you're uncomfortable with. We can stop here or provide details for you to verify independently.",
    explain:
      "There are so many telephone scams nowadays that being careful is the smartest thing to do. We will never ask for card details, PINs, or online passwords.",
    nextAction: "Provide callback option, supervisor escalation, or respectful termination.",
    stopCondition: "Never argue, never say 'It's definitely not a scam', and never pressure the customer.",
  },
  {
    id: "why_details",
    category: "WHY DO YOU NEED MY DETAILS?",
    triggerPhrases: ["Why do you need my details?", "Why are you asking personal questions?", "Why my name and address?"],
    primary:
      "That's a very fair question. The only details we ask for are to accurately confirm the registered account and verify that any available reduction is applied to the correct line.",
    short:
      "We only take the bare minimum to match your registered landline account and ensure the discount applies to the right service.",
    explain:
      "Just like any utility service, we need to ensure we are talking about the right property and that records match accurately. Nothing is shared or used for anything else.",
    nextAction: "Explain field purpose transparently before taking any value.",
    stopCondition: "If customer declines sharing basic address/name, do not push.",
  },
  {
    id: "why_dob",
    category: "WHY DO YOU NEED MY DOB?",
    triggerPhrases: ["Why do you need my date of birth?", "Why my DOB?", "I don't give my birthday"],
    primary:
      "That's simply being used as part of the eligibility check for this specific reduction tier. I don't want to guess or tell you that you're eligible before we've actually checked.",
    short:
      "It's solely to check whether your account meets the campaign's age eligibility criteria for the reduced rate.",
    explain:
      "Certain discount tiers are backed by specific campaign criteria, so the date of birth ensures we don't promise a lower rate that hasn't been approved.",
    nextAction: "If comfortable, record DOB. If uncomfortable, use no-pressure fallback.",
    stopCondition: "If customer says 'I don't give that over the phone', say: 'That's completely understandable. We can stop there.'",
  },
  {
    id: "why_bank_details",
    category: "WHY DO YOU NEED BANK DETAILS?",
    triggerPhrases: ["Why do you need bank details?", "Why Direct Debit?", "Why my sort code?", "Not giving my account number"],
    primary:
      "That's a very fair question. The reason we're asking is specifically to verify the Direct Debit payment method associated with the service and process the applicable payment arrangement. I don't want you giving me anything that isn't actually required.",
    short:
      "Only to verify the existing Direct Debit arrangement so the lower monthly billing rate can take effect. Never any cards or passwords.",
    explain:
      "Because the reduction works by lowering your monthly Direct Debit pull, the bank mandate needs the sort code and account number to update the billing figure.",
    nextAction: "Present the strict Sensitive Consent Gate. Customer must explicitly agree.",
    stopCondition: "Never ask for card number, CVV, PIN, or banking passwords. If refused, stop payment collection immediately.",
  },
  {
    id: "you_already_have_details",
    category: "YOU ALREADY HAVE MY DETAILS",
    triggerPhrases: ["You should already have my details", "Look it up on your screen", "Don't you have my file?"],
    primary:
      "That's understandable. I don't want to pretend I can see information that isn't actually available to me. The particular detail we're asking for is part of the verification process, but if you're not comfortable providing it over the phone, we shouldn't push you to do so.",
    short:
      "I don't want to pretend I can see data that isn't on my screen. It's a standard verification step, but only if you're comfortable.",
    explain:
      "For security and data privacy reasons, advisors do not have unrestricted visibility into full banking or sensitive files until verified with the customer.",
    nextAction: "Remain honest about system boundaries. Never claim backend capabilities that don't exist.",
    stopCondition: "Do not say 'it's blacked out' or 'it's encrypted' unless real system confirms it.",
  },
  {
    id: "send_in_writing",
    category: "SEND IT IN WRITING",
    triggerPhrases: ["Send me something first", "Put it in the post", "Send it in writing", "Email me the offer"],
    primary:
      "Certainly. If the authorised process allows the information to be sent before completing the payment verification, I'll arrange that route for you. If a formal document or mandate is required, you should have the opportunity to review the terms before agreeing to anything.",
    short:
      "Certainly. You should always have the chance to review terms in writing before committing to anything.",
    explain:
      "We completely support having written documentation. Any authorised terms and confirmations can be provided for your peace of mind.",
    nextAction: "Switch to post/email written dispatch workflow or schedule callback.",
    stopCondition: "Do not force phone agreement if customer insists on written papers first.",
  },
  {
    id: "no_phone_trust",
    category: "I DON'T TRUST PHONE CALLS",
    triggerPhrases: ["I never do business over the phone", "I don't trust callers", "My family told me not to"],
    primary:
      "I completely respect that rule — it's very sensible advice. There is never any obligation to do anything over the phone that you're not completely at ease with.",
    short:
      "That is very sound advice. We would never want you to do anything on a phone call you don't feel entirely comfortable with.",
    explain:
      "Protecting yourself is always the right priority. We can note your account and conclude the call right now.",
    nextAction: "Politely conclude call or log customer communication preference.",
    stopCondition: "Immediately offer graceful exit without objection friction.",
  },
  {
    id: "no_contract_change",
    category: "I DON'T WANT TO CHANGE MY CONTRACT",
    triggerPhrases: ["I don't want a new contract", "I'm tied into a contract", "Don't lock me in", "No contract changes"],
    primary:
      "That's completely understandable. The offer we're checking isn't intended to require a change to the existing service or equipment. The point is to check whether a reduced Direct Debit rate is available for the existing package. If you don't want to proceed, that's absolutely fine.",
    short:
      "No change to your contract. Your existing terms and telephone line remain intact; we are only checking for a lower payment rate.",
    explain:
      "You are not switching to an unfamiliar provider or signing a brand new agreement. It is simply applying a promotional discount to what you already have.",
    nextAction: "Reassure that existing service & contract remain identical.",
    stopCondition: "If customer remains opposed, accept gracefully and close.",
  },
  {
    id: "no_new_package",
    category: "I DON'T WANT A NEW PACKAGE",
    triggerPhrases: ["I don't want a new package", "Don't change my plan", "Leave my package alone"],
    primary:
      "You keep exactly what you have right now. Your telephone line and whatever features you use remain unchanged. We're only looking at the monthly price you pay for it.",
    short:
      "Your package stays 100% the same. We are solely checking whether the monthly bill can be lower.",
    explain:
      "No features are added or removed. It's the identical package you know and use every day, just at a discount if eligible.",
    nextAction: "Check service discovery and confirm package retention.",
    stopCondition: "If customer does not want any adjustments, respect choice.",
  },
  {
    id: "no_equipment_change",
    category: "I DON'T WANT TO CHANGE MY EQUIPMENT",
    triggerPhrases: ["I don't want a new router", "I like my handset", "Don't send any boxes", "No new equipment"],
    primary:
      "You keep your existing handset, sockets, and any current equipment exactly as they are. Nobody will ask you to unplug anything or set up new gadgets.",
    short:
      "All your equipment stays exactly where it is. Nothing new to plug in or learn.",
    explain:
      "We know how disruptive it is when companies send new boxes. There is zero hardware replacement involved in this discount.",
    nextAction: "Highlight 'Equipment: Unchanged' pill in UI.",
    stopCondition: "Confirm customer is reassured; proceed only if comfortable.",
  },
  {
    id: "happy_with_service",
    category: "I'M HAPPY WITH MY CURRENT SERVICE",
    triggerPhrases: ["I'm happy as I am", "Everything works fine", "Satisfied with my provider"],
    primary:
      "That's good to hear. We're not trying to suggest there's anything wrong with the service. The reason for the call is simply to check whether the existing package qualifies for a lower Direct Debit payment.",
    short:
      "That's great! We wouldn't change your service at all — just checking if you could pay less for what already works.",
    explain:
      "A lot of our customers love their current setup; our goal is simply ensuring loyal customers aren't paying more than the best current eligible rate.",
    nextAction: "Frame as price reduction on an already satisfactory service.",
    stopCondition: "If customer declines paying less, thank them and end call.",
  },
  {
    id: "how_much_save",
    category: "HOW MUCH WILL I SAVE?",
    triggerPhrases: ["How much will I save?", "What's the exact saving?", "Give me a number"],
    primary:
      "The reduction can be up to 30%, depending on the package and eligibility. If you tell me roughly what you normally pay, I can explain the applicable reduction rather than giving you a figure that may not apply.",
    short:
      "Up to 30% off. If you let me know roughly what last month's bill was, I can calculate your specific saving.",
    explain:
      "Because everyone has different calling plans or features, the exact pound amount depends on your current bill. Up to 30% is the maximum reduction tier.",
    nextAction: "Prompt for approximate monthly bill amount.",
    stopCondition: "Never guarantee an exact 30% saving until verified with bill figure.",
  },
  {
    id: "what_exactly_changes",
    category: "WHAT EXACTLY CHANGES?",
    triggerPhrases: ["What changes?", "What will be different?", "What am I giving up?"],
    primary:
      "Nothing changes with the service itself. Your telephone service remains the same, your existing contract remains the same, and the equipment remains the same. What we're checking is whether the Direct Debit payment can be reduced under the available offer.",
    short:
      "Only the monthly price on your Direct Debit changes. The line, contract, handset, and provider stay identical.",
    explain:
      "Think of it like getting a discount voucher on your regular weekly shop — the goods are identical, you just pay a smaller total at checkout.",
    nextAction: "Show What Changes vs What Does Not Change table.",
    stopCondition: "Ensure customer nods or confirms understanding before continuing.",
  },
  {
    id: "why_calling",
    category: "WHY ARE YOU CALLING?",
    triggerPhrases: ["Why are you calling me?", "What prompted this call?", "Why now?"],
    primary:
      "We're conducting an account review on qualifying telephone lines to see if existing customers can be moved to our reduced Direct Debit rate of up to 30% off.",
    short:
      "It's a periodic review to see if your telephone line qualifies for our up-to-30% Direct Debit discount.",
    explain:
      "We routinely check active lines in your area to ensure customers aren't stuck on higher baseline rates when discount tiers become available.",
    nextAction: "Transition to bill responsibility or service check.",
    stopCondition: "If caller asks not to be contacted again, log DNC preference.",
  },
  {
    id: "who_are_you",
    category: "WHO ARE YOU?",
    triggerPhrases: ["Who are you?", "What company is this?", "Who's calling?"],
    primary:
      "My name is Alex, calling on behalf of the telephone services account team. We assist customers with rate reviews and service optimization.",
    short:
      "I'm Alex from the telephone services review team, checking rate reductions on existing packages.",
    explain:
      "We work with existing UK landline services to check if accounts qualify for current commercial discount tariffs.",
    nextAction: "State identity clearly without claiming to be an unauthorized brand.",
    stopCondition: "Never misrepresent identity or pretend to be another brand.",
  },
  {
    id: "speak_to_family",
    category: "I NEED TO SPEAK TO MY FAMILY",
    triggerPhrases: ["I need to speak to my son/daughter", "Talk to my family first", "My daughter handles this", "Need to check with someone"],
    primary:
      "Of course. That's perfectly reasonable and there's no need to make any decision while you're unsure. Would you like me to book a callback for when they are with you, or would you prefer we leave it with you?",
    short:
      "Of course, that is completely reasonable. No decisions need to be rushed. Shall we arrange a callback when your family is around?",
    explain:
      "It is always a good idea to check with family members who help look after things. We can make a note and call back whenever suits you both.",
    nextAction: "Offer [CALLBACK] or [END CALL].",
    stopCondition: "Do not pressure them to decide alone. Family involvement is welcomed.",
  },
];
