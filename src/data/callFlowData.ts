import type {
  CallStage,
  AdminConfig,
  QuickObjection,
  RecoveryAction,
  RecoveryType,
} from '../types';

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  agentName: 'Alex',
  companyName: 'the customer rewards team',
  offerPercentage: 30,
  deliveryWording: 'LETTER',
  directDebitVerified: true,
  consumerIdIsIban: true,
  vulnerabilityEscalationNote:
    'Customer appears confused or unsure of date. DO NOT diagnose or challenge. Gently thank them, explain you will arrange a written summary by post, and route call to Senior Care Callback team.',
};

export const RECOVERY_ACTIONS: Record<RecoveryType, RecoveryAction> = {
  OFF_TOPIC: {
    type: 'OFF_TOPIC',
    label: 'Customer Went Off-Topic',
    acknowledgement: 'I completely understand, Mr Customer —',
    response: 'just to keep us on track, let me bring us back to where we were.',
    actionText: 'Return to current stage',
    sayThis: '"I completely understand, Mr Customer — just to keep us on track, let me bring us back to where we were."',
  },
  INTERRUPTED: {
    type: 'INTERRUPTED',
    label: 'Customer Interrupted',
    acknowledgement: 'Of course, please go ahead —',
    response: "I'm listening.",
    actionText: 'Return to current stage after they finish',
    sayThis: '"Of course, please go ahead — I\'m listening."',
  },
  REPEAT: {
    type: 'REPEAT',
    label: 'Need to Repeat',
    acknowledgement: 'Of course,',
    response: 'let me repeat that for you.',
    actionText: "Re-display the current stage's sayThis",
    sayThis: '',
  },
  CONFUSED: {
    type: 'CONFUSED',
    label: 'Customer Confused',
    acknowledgement: 'Let me put that another way —',
    response: 'no rush at all.',
    actionText: 'Return to current stage with softened phrasing',
    sayThis: '"Let me put that another way — no rush at all."',
  },
  SLOW_DOWN: {
    type: 'SLOW_DOWN',
    label: 'Need to Slow Down',
    acknowledgement: 'Absolutely —',
    response: "I'll slow down. Take your time.",
    actionText: 'Return to current stage',
    sayThis: '"Absolutely — I\'ll slow down. Take your time."',
  },
  BUSY_BAD_TIME: {
    type: 'BUSY_BAD_TIME',
    label: 'Customer Busy / Bad Time',
    acknowledgement: 'I completely understand, Mr Customer —',
    response: 'would it be better if I called you back at a more convenient time?',
    actionText: 'Route to Callback needed',
    sayThis: '"I completely understand, Mr Customer — would it be better if I called you back at a more convenient time?"',
  },
  NOT_BILL_PAYER: {
    type: 'NOT_BILL_PAYER',
    label: 'Not the Bill Payer',
    acknowledgement: 'That\'s completely fine.',
    response: 'Are you the person who normally handles the phone bill, or should I speak with someone else?',
    actionText: 'Route to Stage 1',
    sayThis: '"That\'s completely fine. Are you the person who normally handles the phone bill, or should I speak with someone else?"',
  },
  IS_SCAM: {
    type: 'IS_SCAM',
    label: 'Is This a Scam?',
    acknowledgement: "You're right to ask, Mr Customer —",
    response: 'we are not asking for your card number or any OTP. This is a recorded line, and we only verify the sort code and account number that are already printed on your statement.',
    actionText: 'Return to current stage',
    sayThis: '"You\'re right to ask, Mr Customer — we are not asking for your card number or any OTP. This is a recorded line, and we only verify the sort code and account number that are already printed on your statement."',
  },
  HOW_GET_NUMBER: {
    type: 'HOW_GET_NUMBER',
    label: 'How Did You Get My Number?',
    acknowledgement: "That's a fair question, Mr Customer —",
    response: "your number is on file with us as an existing customer, which is why you're eligible for this privileged reduction.",
    actionText: 'Return to current stage',
    sayThis: '"That\'s a fair question, Mr Customer — your number is on file with us as an existing customer, which is why you\'re eligible for this privileged reduction."',
  },
};

export const HARD_STOP_SAY_THIS =
  '"Of course, Mr Customer — I completely understand. I\'ll take you off our call list and you won\'t be contacted again about this. Thank you for your time, and have a good day."';

export const QUICK_OBJECTIONS: QuickObjection[] = [
  {
    id: 'who_are_you',
    trigger: 'Who are you?',
    acknowledgement: 'Of course, I understand why you ask.',
    shortAnswer:
      "My name is [AGENT_NAME], calling from the customer rewards team regarding your phone services.",
    bridgeBack: 'I was just explaining how our customer discount check works for your line.',
    tags: ['who', 'identity', 'caller', 'opening'],
  },
  {
    id: 'what_company',
    trigger: 'What company are you calling from?',
    acknowledgement: 'Certainly, that is good to check.',
    shortAnswer:
      'I am calling from [COMPANY_NAME]. We work with phone services to ensure privileged customers receive their bill reduction.',
    bridgeBack: 'Let me confirm the details regarding your current service.',
    tags: ['company', 'who', 'trust'],
  },
  {
    id: 'what_is_about',
    trigger: 'What is this about?',
    acknowledgement: 'I understand, let me make it very clear for you.',
    shortAnswer:
      'This call is about a bill reduction program offering up to thirty percent discount on your existing phone contract.',
    bridgeBack: 'We are simply checking whether you qualify for that discount.',
    tags: ['about', 'purpose', 'summary'],
  },
  {
    id: 'why_dob',
    trigger: 'Why do you need my date of birth?',
    stageRelevant: 'stage_5',
    acknowledgement: 'I completely understand your caution, and you are right to ask.',
    shortAnswer:
      'We only request your date of birth as a standard age check to confirm the eligibility discount tier for you.',
    bridgeBack: 'Your details show up masked on our end for data protection.',
    tags: ['dob', 'date of birth', 'age', 'security', 'privacy'],
  },
  {
    id: 'why_bank_details',
    trigger: 'Why do you need my bank details?',
    stageRelevant: 'stage_6c',
    acknowledgement: 'That is completely understandable, and you are right to be careful.',
    shortAnswer:
      'We do not ask for your card number or OTP. Sort code and account number are basic information printed on every bank statement, used only to validate your existing Direct Debit.',
    bridgeBack: 'Everything is confirmed in writing by post before any change takes effect.',
    tags: ['bank', 'sort code', 'account', 'iban', 'money', 'safety'],
  },
  {
    id: 'already_happy',
    trigger: 'I’m already happy with my provider.',
    acknowledgement: 'That is great to hear, and this is not a new contract.',
    shortAnswer:
      'Nothing about your services changes — it is simply a reduction of up to thirty percent applied to what you already pay.',
    bridgeBack: 'Would you be open to checking if your line qualifies?',
    tags: ['happy', 'satisfied', 'provider'],
  },
  {
    id: 'refuse_info',
    trigger: 'I don’t want to give you that information.',
    acknowledgement: 'I respect that completely, and you will never be pressured.',
    shortAnswer:
      'If you prefer, you can look at the Consumer ID on your statement or we can arrange written confirmation.',
    bridgeBack: 'Let me explain the safest option for you.',
    tags: ['refuse', 'decline', 'privacy'],
  },
  {
    id: 'is_new_contract',
    trigger: 'Is this a new contract?',
    acknowledgement: 'I am glad you asked that.',
    shortAnswer:
      'No, it is not a new contract. It is a discount applied directly to your existing contract and payment arrangement.',
    bridgeBack: 'Everything stays with your current provider.',
    tags: ['contract', 'new', 'switch', 'terms'],
  },
  {
    id: 'how_get_number',
    trigger: 'How did you get my number?',
    acknowledgement: 'That is a fair question.',
    shortAnswer:
      'Your number is on file with us as an existing customer, which is why you qualify for this privileged reduction.',
    bridgeBack: 'We are just verifying whether you wish to claim the discount.',
    tags: ['number', 'data', 'gdpr', 'privacy'],
  },
  {
    id: 'im_busy',
    trigger: 'I’m busy / Not a good time.',
    acknowledgement: 'I completely understand.',
    shortAnswer:
      'I will be very brief — just thirty seconds of your time, or I can arrange a convenient callback.',
    bridgeBack: 'Would you prefer a 30-second summary or a callback?',
    tags: ['busy', 'time', 'call back'],
  },
  {
    id: 'dont_understand',
    trigger: 'I don’t understand.',
    acknowledgement: 'No problem at all, let me keep it very simple.',
    shortAnswer:
      'Your phone bill can be reduced by up to 30% each month while keeping the exact same services you have now.',
    bridgeBack: 'We will send all details in black and white to your door.',
    tags: ['confused', 'clarity', 'simple'],
  },
  {
    id: 'never_heard',
    trigger: 'I’ve never heard of your company.',
    acknowledgement: 'That makes complete sense.',
    shortAnswer:
      'We call on behalf of customer retention and rewards to ensure customers receive verified bill reductions.',
    bridgeBack: 'You will receive full written paperwork before any modification is applied.',
    tags: ['company', 'trust', 'unknown'],
  },
];

export const RAW_STAGES: CallStage[] = [
  // =========================================================================
  // STAGE 0 — OPENING
  // =========================================================================
  {
    id: 'stage_0',
    stepNumber: 1,
    stageNumber: 0,
    title: 'STAGE 0 — OPENING',
    script:
      '"Good morning, Mr Customer. My name is Alex, and I\'m calling regarding your phone services. How are you doing today?"',
    sayThisSoftened:
      '"Good morning, Mr Customer. It\'s Alex calling about your phone services. Is now a good time for a quick chat?"',
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Doing well / polite',
        sayThis: '"That\'s lovely to hear. I\'ll keep this quick for you."',
        response: "That's lovely to hear. I'll keep this quick for you.",
        nextStage: 'stage_1',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'Not a good time / unwell',
        sayThis: '"No problem at all. I\'ll be very brief — just half a minute of your time."',
        response: "No problem at all. I'll be very brief — just half a minute of your time.",
        nextStage: 'stage_1',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: 'Unsure who I am',
        sayThis: '"That\'s completely fine. I\'m Alex from the customer rewards team, and I just have a quick call about your phone bill."',
        response: "That's completely fine. I'm Alex from the customer rewards team, and I just have a quick call about your phone bill.",
        nextStage: 'stage_1',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: "Asks why I'm calling",
        sayThis: '"Of course, happy to explain. It\'s about a bill reduction you may already qualify for."',
        response: "Of course, happy to explain. It's about a bill reduction you may already qualify for.",
        nextStage: 'stage_1',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Wants to end call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 1 — CONFIRM BILL PAYER
  // =========================================================================
  {
    id: 'stage_1',
    stepNumber: 2,
    stageNumber: 1,
    title: 'STAGE 1 — CONFIRM BILL PAYER',
    script:
      '"Just to make sure I\'m speaking to the right person — am I talking with the owner of this number, the one who takes care of the bills?"',
    sayThisSoftened:
      '"Quick one before we start — are you the person who takes care of the phone bill?"',
    rebuttals: [
      {
        step: 1,
        label: 'R1 — Clarify Bill Payer',
        text: '"That\'s completely fine. Are you the person who normally handles the phone bill, or should I speak with someone else?"',
      },
      {
        step: 2,
        label: 'R2 — Account Holder Rule',
        text: '"No problem at all — it\'s just because this reduction can only be applied to the account holder\'s name. Is that you?"',
      },
      {
        step: 3,
        label: 'R3 — Callback Option',
        text: '"That\'s completely fine. If it\'s easier, I can note your details for a callback when the account holder is available."',
      },
    ],
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Owner and bill payer',
        sayThis: '"That\'s perfect — exactly who I was hoping to reach."',
        response: "That's perfect — exactly who I was hoping to reach.",
        nextStage: 'stage_2',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'Not the bill payer',
        sayThis: '"That\'s completely fine. Are you the person who normally handles the phone bill, or should I speak with someone else?"',
        response: "That's completely fine. Are you the person who normally handles the phone bill, or should I speak with someone else?",
        nextStage: 'stage_2',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: 'Unsure / joint account',
        sayThis: '"No problem at all. Are you one of the people listed on the account?"',
        response: "No problem at all. Are you one of the people listed on the account?",
        nextStage: 'stage_2',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks why it matters',
        sayThis: '"Good question — it\'s just because this offer is only for the account holder, so I want to make sure I\'m speaking to the right person."',
        response: "Good question — it's just because this offer is only for the account holder, so I want to make sure I'm speaking to the right person.",
        nextStage: 'stage_2',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Wants to end call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 2 — PITCH 30% REDUCTION
  // =========================================================================
  {
    id: 'stage_2',
    stepNumber: 3,
    stageNumber: 2,
    title: 'STAGE 2 — PITCH 30% REDUCTION',
    script:
      '"Mr Customer, I\'d like to tell you about a special bill reduction program we\'re running for our privileged customers — a discount of up to thirty percent on your existing phone contract. Sounds good to you?"',
    sayThisSoftened:
      '"Mr Customer, there\'s a bill reduction we\'re offering our privileged customers — up to thirty percent off your current phone contract. Would you like to hear the details?"',
    rebuttals: [
      {
        step: 1,
        label: 'R1 — Existing Contract Reduction',
        text: '"That\'s completely fine. It\'s not a new contract — it\'s a reduction on what you\'re already paying."',
      },
      {
        step: 2,
        label: 'R2 — See the Figures',
        text: '"No problem at all — can I just tell you what the reduction would look like on your current bill? Then you decide."',
      },
      {
        step: 3,
        label: 'R3 — Written Details Review',
        text: '"That\'s completely understandable. I\'ll send the details in writing so you can review them in your own time — no commitment today."',
      },
    ],
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Interested / sounds good',
        sayThis: '"Wonderful — let me just take a couple of quick details so I can check what you qualify for."',
        response: "Wonderful — let me just take a couple of quick details so I can check what you qualify for.",
        nextStage: 'stage_3',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'Not interested',
        sayThis: '"That\'s completely fine. Just so I explain it properly — it\'s not a new contract, it\'s a reduction on what you\'re already paying. Ten seconds, and I\'ll show you the angle?"',
        response: "That's completely fine. Just so I explain it properly — it's not a new contract, it's a reduction on what you're already paying. Ten seconds, and I'll show you the angle?",
        nextStage: 'stage_3',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: "Doesn't understand offer",
        sayThis: '"No problem at all. It\'s a discount on your existing bill, not a new plan. Can I take a quick look at your current usage?"',
        response: "No problem at all. It's a discount on your existing bill, not a new plan. Can I take a quick look at your current usage?",
        nextStage: 'stage_3',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks price or terms',
        sayThis: '"Great question. It\'s a reduction applied on your existing contract — nothing about your services changes, just the monthly amount. Can I check what you\'re on right now?"',
        response: "Great question. It's a reduction applied on your existing contract — nothing about your services changes, just the monthly amount. Can I check what you're on right now?",
        nextStage: 'stage_3',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Declines call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 3 — SERVICE CHECK
  // =========================================================================
  {
    id: 'stage_3',
    stepNumber: 4,
    stageNumber: 3,
    title: 'STAGE 3 — SERVICE CHECK',
    script:
      '"Could you please confirm — is this just a phone line, or does it include Internet and TV channels too?"',
    sayThisSoftened:
      '"Quick check — is it just the phone line, or do you have internet and TV on the same plan?"',
    rebuttals: [
      {
        step: 1,
        label: 'R1 — Use Area Average',
        text: '"No problem at all. Most customers don\'t have the breakdown — I can use the average for your area."',
      },
      {
        step: 2,
        label: 'R2 — Rate Matching Reason',
        text: '"That\'s completely fine. It just helps match you to the right rate — phone only and bundles qualify differently."',
      },
      {
        step: 3,
        label: 'R3 — Letter Confirmation',
        text: '"No worries — I\'ll note it as best I can and the letter will confirm everything."',
      },
    ],
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Phone only / just phone',
        sayThis: '"Got it — just the phone line."',
        response: "Got it — just the phone line.",
        nextStage: 'stage_4',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'Includes internet or TV',
        sayThis: '"That\'s perfect — so phone, internet and TV together. That helps me see what fits best."',
        response: "That's perfect — so phone, internet and TV together. That helps me see what fits best.",
        nextStage: 'stage_4',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: "Unsure what's included",
        sayThis: '"No worries at all. Most customers don\'t have the breakdown in front of them. Would it help if I looked at the average for your area?"',
        response: "No worries at all. Most customers don't have the breakdown in front of them. Would it help if I looked at the average for your area?",
        nextStage: 'stage_4',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks why you need to know',
        sayThis: '"Good question — it\'s just so I can match you to the right reduction. Phone plans and bundles qualify at different rates."',
        response: "Good question — it's just so I can match you to the right reduction. Phone plans and bundles qualify at different rates.",
        nextStage: 'stage_4',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Wants to end call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 4 — LAST MONTH'S BILL
  // =========================================================================
  {
    id: 'stage_4',
    stepNumber: 5,
    stageNumber: 4,
    title: "STAGE 4 — LAST MONTH'S BILL",
    script:
      '"Could I ask — do you recall roughly how much you paid last month? I\'d like to check whether you\'re paying for what you\'re actually using."',
    sayThisSoftened:
      '"If you happen to remember — what did you pay last month, roughly? Just so I can check the plan matches your usage."',
    hasStatementProp: true,
    rebuttals: [
      {
        step: 1,
        label: 'R1 — Grab Statement & Hold',
        text: '"That\'s completely fine. Just grab your statement if it\'s close by — I\'ll wait."',
      },
      {
        step: 2,
        label: 'R2 — Rough Figure Bracket',
        text: '"No problem at all. Even a rough figure helps — was it more like twenty, or more like forty?"',
      },
      {
        step: 3,
        label: 'R3 — Work from Average',
        text: '"That\'s completely fine. We can work from the average for a plan like yours and confirm in the letter."',
      },
    ],
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Gives an amount',
        sayThis: '"Thank you — that gives me exactly what I need."',
        response: "Thank you — that gives me exactly what I need.",
        nextStage: 'stage_5',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: "Doesn't remember",
        sayThis: '"That\'s completely fine. Could you please grab any of your old phone bills or your bank statement to check? I\'ll hold for a moment."',
        response: "That's completely fine. Could you please grab any of your old phone bills or your bank statement to check? I'll hold for a moment.",
        nextStage: 'stage_5',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: 'Unsure of figure',
        sayThis: '"That\'s completely fine. Could you please grab any of your old phone bills or your bank statement to check? I\'ll hold for a moment."',
        response: "That's completely fine. Could you please grab any of your old phone bills or your bank statement to check? I'll hold for a moment.",
        nextStage: 'stage_5',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks why you need it',
        sayThis: '"Good question — it just helps me see if your current plan matches your usage. If not, that\'s exactly where the reduction kicks in."',
        response: "Good question — it just helps me see if your current plan matches your usage. If not, that's exactly where the reduction kicks in.",
        nextStage: 'stage_5',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Wants to end call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 5 — DOB FOR ELIGIBILITY
  // =========================================================================
  {
    id: 'stage_5',
    stepNumber: 6,
    stageNumber: 5,
    title: 'STAGE 5 — DOB FOR ELIGIBILITY',
    isSensitive: true,
    script:
      '"Since this reduction is only for a limited group of customers — could you please confirm your date of birth, so I can check the eligibility and discount for you?"',
    sayThisSoftened:
      '"This reduction is only for a limited group — could you confirm your date of birth so I can check if you qualify?"',
    rebuttals: [
      {
        step: 1,
        label: 'R1 — Age Group Brackets',
        text: '"That\'s completely fine. Could you just confirm the age group — 65 to 70, 71 to 75, 76 to 80, or 81 and above?"',
      },
      {
        step: 2,
        label: 'R2 — Tier Matching Purpose',
        text: '"No problem at all — it\'s only used to match you to the right discount tier. Nothing else."',
      },
      {
        step: 3,
        label: 'R3 — Written Details First',
        text: '"That\'s completely fine. If it\'s easier, I can send the details in writing for you to review first."',
      },
    ],
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Gives DOB',
        sayThis: '"Thank you — let me just check the tier that matches."',
        response: "Thank you — let me just check the tier that matches.",
        nextStage: 'stage_6a',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'Refuses DOB',
        sayThis: '"That\'s completely fine. Could you just confirm which age group you\'re in — 65 to 70, 71 to 75, 76 to 80, or 81 and above?"',
        response: "That's completely fine. Could you just confirm which age group you're in — 65 to 70, 71 to 75, 76 to 80, or 81 and above?",
        nextStage: 'stage_6a',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: 'Uncomfortable giving DOB',
        sayThis: '"That\'s completely fine. Could you just confirm which age group you\'re in — 65 to 70, 71 to 75, 76 to 80, or 81 and above?"',
        response: "That's completely fine. Could you just confirm which age group you're in — 65 to 70, 71 to 75, 76 to 80, or 81 and above?",
        nextStage: 'stage_6a',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'You already have my details',
        sayThis: '"That\'s exactly right — we do have your details on file, they just show up masked, like black dots when you type a password. I only need you to confirm one small thing so the system matches you to the right discount tier."',
        response: "That's exactly right — we do have your details on file, they just show up masked, like black dots when you type a password. I only need you to confirm one small thing so the system matches you to the right discount tier.",
        nextStage: 'stage_6a',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Ends call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 6A — DD PRE-FRAME
  // =========================================================================
  {
    id: 'stage_6a',
    stepNumber: 7,
    stageNumber: 6,
    title: 'STAGE 6A — DD PRE-FRAME',
    isDataProtectionFrame: true,
    script:
      '"Since this is a new discount that accommodates your existing contract and Direct Debit — every contract is eligible for one reduction per year. I just need to validate that your existing Direct Debit is eligible for this year\'s modification. Could you confirm — have you changed your payment method recently?"',
    sayThisSoftened:
      '"This discount runs alongside your existing Direct Debit — every contract qualifies for one reduction a year. Have you changed your payment method recently?"',
    rebuttals: [
      {
        step: 1,
        label: 'R1 — Same Direct Debit',
        text: '"That\'s completely fine. It\'s the same Direct Debit your bill already comes out of — nothing new."',
      },
      {
        step: 2,
        label: 'R2 — Checking Annual Qualification',
        text: '"No problem at all — we\'re just checking if it qualifies for this year\'s reduction."',
      },
      {
        step: 3,
        label: 'R3 — Written Details Option',
        text: '"That\'s completely fine. If it doesn\'t, I can note it and we\'ll send the details in writing."',
      },
    ],
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Payment method unchanged',
        sayThis: '"Thank you — that\'s what I needed to check."',
        response: "Thank you — that's what I needed to check.",
        nextStage: 'stage_6b',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'Has changed payment method',
        sayThis: '"Thank you — that\'s what I needed to check."',
        response: "Thank you — that's what I needed to check.",
        nextStage: 'stage_6b',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: 'Unsure',
        sayThis: '"No problem at all. Most customers don\'t track that — we\'ll just verify the current one on file."',
        response: "No problem at all. Most customers don't track that — we'll just verify the current one on file.",
        nextStage: 'stage_6b',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks why DD matters',
        sayThis: '"Good question — it\'s because the reduction is applied to the same Direct Debit you already have. Nothing new gets set up unless we need to."',
        response: "Good question — it's because the reduction is applied to the same Direct Debit you already have. Nothing new gets set up unless we need to.",
        nextStage: 'stage_6b',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Ends call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 6B — RECORDED-LINE FRAME
  // =========================================================================
  {
    id: 'stage_6b',
    stepNumber: 8,
    stageNumber: 6,
    title: 'STAGE 6B — RECORDED-LINE FRAME',
    isSensitive: true,
    isDataProtectionFrame: true,
    script:
      '"Since we\'re on a recorded line and follow data protection, I cannot voice out your Direct Debit details — but the system will verify them for the eligibility check. There\'s no transaction happening at this moment — just a validation."',
    sayThisSoftened:
      '"We\'re on a recorded line, so I can\'t say your details out loud — but the system will check them. No transaction, just a quick validation."',
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Understands',
        sayThis: '"Thank you — I appreciate that."',
        response: "Thank you — I appreciate that.",
        nextStage: 'stage_6c',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: "Doesn't want to share",
        sayThis: '"That\'s completely fine. Let me put your mind at ease."',
        response: "That's completely fine. Let me put your mind at ease.",
        nextStage: 'stage_6c',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: 'Confused about process',
        sayThis: '"No problem at all — I\'ll keep it simple. I just need to check the account your bill already comes out of, that\'s all."',
        response: "No problem at all — I'll keep it simple. I just need to check the account your bill already comes out of, that's all.",
        nextStage: 'stage_6c',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks about safety',
        sayThis: '"Of course — good question. We don\'t ask for your card number or any OTP. Just the sort code and account number — the same details already printed on every statement you have."',
        response: "Of course — good question. We don't ask for your card number or any OTP. Just the sort code and account number — the same details already printed on every statement you have.",
        nextStage: 'stage_6c',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Ends call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 6C — DD ASK PART 1 (SORT CODE)
  // =========================================================================
  {
    id: 'stage_6c',
    stepNumber: 9,
    stageNumber: 6,
    title: 'STAGE 6C — DD ASK PART 1 (SORT CODE)',
    isSensitive: true,
    isDataProtectionFrame: true,
    script:
      '"May I please have your sort code first — it\'s printed on every bank statement, debit card, and cheque leaf you have from the bank. Just the sort code, so the system can match your existing Direct Debit."',
    sayThisSoftened:
      '"Could you read me the sort code first? It\'s the six-digit number printed on your statement and your debit card."',
    rebuttals: [
      {
        step: 1,
        label: 'R1 — Sort Code & Account Number Openly Printed',
        text: '"Mr Customer, I completely understand your concern, and you\'re very right to ask. Just so I reassure you — we don\'t ask for your card number, any OTP, or confidential details on the phone. Sort code and account number are basic information printed on every bank statement, debit card, and cheque leaf. Banks wouldn\'t print them openly if they were critical. May I have the sort code, please?"',
      },
      {
        step: 2,
        label: 'R2 — Direct Debit Guarantee & Confirmation Letter',
        text: '"That\'s completely fine. Direct Debit is actually the most secure way to pay — no one can withdraw anything without your consent with your bank. And we\'re not making any transaction at this moment — just checking eligibility. If eligible, we\'ll send a confirmation letter in black and white and wait for your acknowledgment before modifying anything. May I have the sort code, please?"',
      },
      {
        step: 3,
        label: 'R3 — Uncorrupted Mode / Mandate Delay Warning',
        text: '"That\'s completely understandable. Since you\'re getting this call from the retention and rewards team, your details are stored in uncorrupted mode — like when you type a password, it shows up as black dots. I can see them, but the system just needs me to confirm the sort code to display whether your existing Direct Debit is eligible. If not, I\'d need to send a new mandate, and that takes 14 to 20 days — by then this offer may not be available. Please verify the sort code for me."',
      },
      {
        step: 4,
        label: 'R4 — Last Net (IBAN / Consumer ID)',
        text: '"That\'s completely okay, Mr Customer. Since you have your bank statement right there — can you see the Consumer Identification Number at the top? It starts with I-B-A-N G-B. Just read that number to me, and the system will pull the rest automatically. It\'s simply the reference number for your account."',
      },
    ],
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Gives sort code',
        sayThis: '"Thank you — and just the account number that goes with it, please."',
        response: "Thank you — and just the account number that goes with it, please.",
        nextStage: 'stage_6d',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'Refuses',
        sayThis: '"Mr Customer, I completely understand your concern, and you\'re very right to ask. Just so I reassure you — we don\'t ask for your card number, any OTP, or confidential details on the phone. Sort code and account number are basic information printed on every bank statement, debit card, and cheque leaf. Banks wouldn\'t print them openly if they were critical. May I have the sort code, please?"',
        response: "Mr Customer, I completely understand your concern, and you're very right to ask. Just so I reassure you — we don't ask for your card number, any OTP, or confidential details on the phone. Sort code and account number are basic information printed on every bank statement, debit card, and cheque leaf. Banks wouldn't print them openly if they were critical. May I have the sort code, please?",
        nextStage: 'stage_6c',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: "Doesn't know where to find it",
        sayThis: '"No problem at all — it\'s the six-digit number next to your account number, usually top right of your statement. Take your time."',
        response: "No problem at all — it's the six-digit number next to your account number, usually top right of your statement. Take your time.",
        nextStage: 'stage_6c',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks why sort code',
        sayThis: '"Good question — the sort code is just the numerical address of your bank. It identifies which branch you\'re with, nothing sensitive. Banks print it openly."',
        response: "Good question — the sort code is just the numerical address of your bank. It identifies which branch you're with, nothing sensitive. Banks print it openly.",
        nextStage: 'stage_6c',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Ends call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 6D — DD ASK PART 2 (ACCOUNT NUMBER)
  // =========================================================================
  {
    id: 'stage_6d',
    stepNumber: 10,
    stageNumber: 6,
    title: 'STAGE 6D — DD ASK PART 2 (ACCOUNT NUMBER)',
    isSensitive: true,
    isDataProtectionFrame: true,
    script:
      '"And the account number please — the eight-digit number beside the sort code. Just so the system confirms your existing Direct Debit is eligible for the modification."',
    sayThisSoftened:
      '"And the account number — the eight digits beside the sort code. Just so the system can confirm eligibility."',
    rebuttals: [
      {
        step: 1,
        label: 'R1 — Basic Info Printed Openly',
        text: '"Mr Customer, I completely understand your concern, and you\'re very right to ask. Just so I reassure you — we don\'t ask for your card number, any OTP, or confidential details on the phone. Sort code and account number are basic information printed on every bank statement, debit card, and cheque leaf. Banks wouldn\'t print them openly if they were critical. May I have the account number, please?"',
      },
      {
        step: 2,
        label: 'R2 — Direct Debit Guarantee',
        text: '"That\'s completely fine. Direct Debit is actually the most secure way to pay — no one can withdraw anything without your consent with your bank. And we\'re not making any transaction at this moment — just checking eligibility. If eligible, we\'ll send a confirmation letter in black and white and wait for your acknowledgment before modifying anything. May I have the account number, please?"',
      },
      {
        step: 3,
        label: 'R3 — System Confirmation',
        text: '"That\'s completely understandable. Since you\'re getting this call from the retention and rewards team, your details are stored in uncorrupted mode — like when you type a password, it shows up as black dots. I can see them, but the system just needs me to confirm the account number to display whether your existing Direct Debit is eligible. If not, I\'d need to send a new mandate, and that takes 14 to 20 days — by then this offer may not be available. Please verify the account number for me."',
      },
      {
        step: 4,
        label: 'R4 — Last Net (IBAN / Consumer ID)',
        text: '"That\'s completely okay, Mr Customer. Since you have your bank statement right there — can you see the Consumer Identification Number at the top? It starts with I-B-A-N G-B. Just read that number to me, and the system will pull the rest automatically. It\'s simply the reference number for your account."',
      },
    ],
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Gives account number',
        sayThis: '"Perfect — thank you, Mr Customer. That\'s what I needed for the eligibility check."',
        response: "Perfect — thank you, Mr Customer. That's what I needed for the eligibility check.",
        nextStage: 'stage_7',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'Refuses',
        sayThis: '"Mr Customer, I completely understand your concern, and you\'re very right to ask. Just so I reassure you — we don\'t ask for your card number, any OTP, or confidential details on the phone. Sort code and account number are basic information printed on every bank statement, debit card, and cheque leaf. Banks wouldn\'t print them openly if they were critical. May I have the account number, please?"',
        response: "Mr Customer, I completely understand your concern, and you're very right to ask. Just so I reassure you — we don't ask for your card number, any OTP, or confidential details on the phone. Sort code and account number are basic information printed on every bank statement, debit card, and cheque leaf. Banks wouldn't print them openly if they were critical. May I have the account number, please?",
        nextStage: 'stage_6d',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: "Can't find it",
        sayThis: '"No problem at all — it\'s right beside the sort code on your statement, eight digits. If it helps, it\'s the same number printed on your debit card, under the sort code."',
        response: "No problem at all — it's right beside the sort code on your statement, eight digits. If it helps, it's the same number printed on your debit card, under the sort code.",
        nextStage: 'stage_6d',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks why account number',
        sayThis: '"Good question — it\'s just to match the Direct Debit your bill comes out of, so the reduction goes onto the right account."',
        response: "Good question — it's just to match the Direct Debit your bill comes out of, so the reduction goes onto the right account.",
        nextStage: 'stage_6d',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Ends call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 7 — VERIFY NAME, ADDRESS, POSTCODE
  // =========================================================================
  {
    id: 'stage_7',
    stepNumber: 11,
    stageNumber: 7,
    title: 'STAGE 7 — VERIFY NAME, ADDRESS, POSTCODE',
    script:
      '"Just to verify what we have on file — I have your first and last name, your door number, and your postcode. Could you confirm those for me quickly?"',
    sayThisSoftened:
      '"Quick check — I have your name, door number, and postcode on file. Could you confirm those for me?"',
    rebuttals: [
      {
        step: 1,
        label: 'R1 — Update Details',
        text: '"That\'s completely fine. Let me update those — could you give me the correct spelling?"',
      },
      {
        step: 2,
        label: 'R2 — Confirm Correct Account',
        text: '"No problem at all — it\'s just to confirm I\'m updating the right account."',
      },
      {
        step: 3,
        label: 'R3 — Letter Confirmation',
        text: '"That\'s completely fine. I\'ll note the correction and the letter will confirm everything."',
      },
    ],
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Confirms details',
        sayThis: '"Thank you — all matching."',
        response: "Thank you — all matching.",
        nextStage: 'stage_8',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'Details incorrect',
        sayThis: '"That\'s completely fine. Let me update those — could you give me the correct spelling?"',
        response: "That's completely fine. Let me update those — could you give me the correct spelling?",
        nextStage: 'stage_8',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: 'Unsure',
        sayThis: '"That\'s completely fine. Let me update those — could you give me the correct spelling?"',
        response: "That's completely fine. Let me update those — could you give me the correct spelling?",
        nextStage: 'stage_8',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks why verify',
        sayThis: '"That\'s right — they\'re just masked on my end for data protection. I only need you to confirm so I know I\'m updating the correct account."',
        response: "That's right — they're just masked on my end for data protection. I only need you to confirm so I know I'm updating the correct account.",
        nextStage: 'stage_8',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Ends call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 8 — ALTERNATE MOBILE NUMBER
  // =========================================================================
  {
    id: 'stage_8',
    stepNumber: 12,
    stageNumber: 8,
    title: 'STAGE 8 — ALTERNATE MOBILE NUMBER',
    script:
      '"May I ask for an alternate contact number, if you use a mobile phone? Just so we can reach you if anything needs confirming about the discount."',
    sayThisSoftened:
      '"Do you have a mobile number we can note, just in case we need to confirm anything about the discount?"',
    rebuttals: [
      {
        step: 1,
        label: 'R1 — Keep Landline',
        text: '"No problem at all. I\'ll just note the landline on file."',
      },
      {
        step: 2,
        label: 'R2 — Letter Dispatched Regardless',
        text: '"That\'s completely fine. The letter will still come through — the mobile is only for the confirmation call."',
      },
      {
        step: 3,
        label: 'R3 — Discount Guaranteed',
        text: '"No worries — the discount applies either way."',
      },
    ],
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Gives mobile number',
        sayThis: '"Thank you — and is this mobile Pay-As-You-Go or a contract phone? And which network provider are you with?"',
        response: "Thank you — and is this mobile Pay-As-You-Go or a contract phone? And which network provider are you with?",
        nextStage: 'stage_9',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'No mobile / won\'t share',
        sayThis: '"No problem at all. I\'ll just note the landline on file."',
        response: "No problem at all. I'll just note the landline on file.",
        nextStage: 'stage_9',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: 'Unsure which to give',
        sayThis: '"No problem at all. I\'ll just note the landline on file."',
        response: "No problem at all. I'll just note the landline on file.",
        nextStage: 'stage_9',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks why mobile needed',
        sayThis: '"Good question — it\'s just for the discount confirmation. If the plan details need verifying, we\'ll reach you on that number."',
        response: "Good question — it's just for the discount confirmation. If the plan details need verifying, we'll reach you on that number.",
        nextStage: 'stage_8',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Ends call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 9 — MONTH CHECK
  // =========================================================================
  {
    id: 'stage_9',
    stepNumber: 13,
    stageNumber: 9,
    title: 'STAGE 9 — MONTH CHECK',
    script:
      '"Just to ensure I understand the deal we\'re locking in for you today — could you tell me which month we are in now?"',
    sayThisSoftened:
      '"Just a quick confirmation — which month are we in now?"',
    rebuttals: [
      {
        step: 1,
        label: 'R1 — Multiple Choice Assistance',
        text: '"No worries at all — would it help if I gave you the options? Is it January, February, or March?"',
      },
      {
        step: 2,
        label: 'R2 — Standard Verification',
        text: '"That\'s completely fine. It\'s just a standard confirmation — nothing more than that."',
      },
      {
        step: 3,
        label: 'R3 — Note and Move On',
        text: '"No problem. I\'ll note it and we\'ll move on."',
      },
    ],
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Correct month',
        sayThis: '"Perfect — thank you for confirming."',
        response: "Perfect — thank you for confirming.",
        nextStage: 'stage_10',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'Incorrect month',
        sayThis: '"No worries at all — would it help if I gave you the options? Is it January, February, or March?"',
        response: "No worries at all — would it help if I gave you the options? Is it January, February, or March?",
        nextStage: 'stage_10',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: 'Unsure',
        sayThis: '"No worries at all — would it help if I gave you the options? Is it January, February, or March?"',
        response: "No worries at all — would it help if I gave you the options? Is it January, February, or March?",
        nextStage: 'stage_10',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks why',
        sayThis: '"Good question — it\'s just a standard confirmation the system requires. Nothing to worry about, it just helps time the paperwork correctly."',
        response: "Good question — it's just a standard confirmation the system requires. Nothing to worry about, it just helps time the paperwork correctly.",
        nextStage: 'stage_9',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Ends call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // STAGE 10 — CLOSING / PLAN CONFIRMATION
  // =========================================================================
  {
    id: 'stage_10',
    stepNumber: 14,
    stageNumber: 10,
    title: 'STAGE 10 — CLOSING / PLAN CONFIRMATION',
    script:
      '"Mr Customer, thank you for your time today. I\'ll be sending you the plan details, terms and conditions in black and white to your door within two to three working days. Once you receive them, you can review and get back to us if you have any questions. Thank you again — and have a lovely rest of your day."',
    sayThisSoftened:
      '"Thank you for your time, Mr Customer. The plan details and terms will arrive in the post within two to three working days — you can review them and reach out if you have questions. Have a lovely day."',
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Happy / confirms close',
        sayThis: '"Thank you again — and have a lovely rest of your day."',
        response: "Thank you again — and have a lovely rest of your day.",
        nextStage: 'completion',
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'Has a last question',
        sayThis: '"Of course — what would you like to ask before we close?"',
        response: "Of course — what would you like to ask before we close?",
        nextStage: 'stage_10',
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: 'Unsure what happens next',
        sayThis: '"You\'ll receive a letter in two to three working days — the plan details and terms will all be in writing."',
        response: "You'll receive a letter in two to three working days — the plan details and terms will all be in writing.",
        nextStage: 'completion',
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'Asks about follow-up',
        sayThis: '"The letter will explain everything in detail — but I\'m happy to answer anything now."',
        response: "The letter will explain everything in detail — but I'm happy to answer anything now.",
        nextStage: 'stage_10',
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Ends call',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },

  // =========================================================================
  // CALL COMPLETION CARD STAGE
  // =========================================================================
  {
    id: 'completion',
    stepNumber: 15,
    title: 'CALL COMPLETE',
    script:
      '"Black-and-white letter dispatched to customer postal address within 2 working days. Account qualified for up to 30% monthly discount."',
    branches: {
      POSITIVE: {
        category: 'POSITIVE',
        label: 'YES / POSITIVE',
        buttonDescription: 'Sale — DD collected',
        sayThis: '"Thank you again, Mr Customer. Have a lovely rest of your day."',
        response: "Thank you again, Mr Customer. Have a lovely rest of your day.",
        nextStage: null,
      },
      NEGATIVE: {
        category: 'NEGATIVE',
        label: 'NO / NEGATIVE',
        buttonDescription: 'No sale — Not interested',
        sayThis: '"Thank you for your time today."',
        response: "Thank you for your time today.",
        nextStage: null,
      },
      CONFUSED: {
        category: 'CONFUSED',
        label: "DON'T KNOW / CONFUSED",
        buttonDescription: 'Sale — Callback needed',
        sayThis: '"We will call you back at the requested time."',
        response: "We will call you back at the requested time.",
        nextStage: null,
      },
      OBJECTION: {
        category: 'OBJECTION',
        label: 'QUESTION / OBJECTION',
        buttonDescription: 'No sale — Under age',
        sayThis: '"Thank you for your time."',
        response: "Thank you for your time.",
        nextStage: null,
      },
      STOP: {
        category: 'STOP',
        label: 'STOP / COMPLIANCE',
        buttonDescription: 'Compliance Stop',
        sayThis: HARD_STOP_SAY_THIS,
        response: HARD_STOP_SAY_THIS,
        nextStage: null,
        hardStop: true,
      },
    },
  },
];
