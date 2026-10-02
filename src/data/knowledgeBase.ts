import { CustomerQuestionItem } from "../types";

export const knowledgeBaseQuestions: CustomerQuestionItem[] = [
  {
    id: "kb_who_calling_from",
    sectionNumber: 2,
    category: "IDENTITY",
    customerAsk: "Who are you calling from?",
    questionKeywords: ["who are you calling from", "what company", "who is this", "company name"],
    approvedAnswer:
      "“I'm calling from [COMPANY NAME] regarding your telephone service and current monthly bill. I'm contacting you about the available reduction and checking whether your service qualifies for it.”",
    notes: "State approved company identity truthfully.",
  },
  {
    id: "kb_are_you_bt",
    sectionNumber: 2,
    category: "COMPANY",
    customerAsk: "Are you from BT?",
    questionKeywords: ["are you from bt", "is this bt", "british telecom", "representing bt"],
    approvedAnswer:
      "“I'm calling from [COMPANY NAME]. I'll be happy to explain exactly who we are before we continue. I don't want to give you the wrong information, so I'll keep everything clear and straightforward.”",
    notes: "If authorized to represent BT: “I'm calling on behalf of BT regarding your telephone service and current monthly bill...”",
  },
  {
    id: "kb_agent_name",
    sectionNumber: 28,
    category: "IDENTITY",
    customerAsk: "What is your name?",
    questionKeywords: ["what is your name", "who am i speaking with", "your name", "what's your name"],
    approvedAnswer:
      "“Of course. My name is Peter, and I'm calling from [COMPANY NAME]. I'm contacting you regarding the available reduction on your telephone service.”",
    notes: "Approved agent name: Peter.",
  },
  {
    id: "kb_agent_id",
    sectionNumber: 29,
    category: "IDENTITY",
    customerAsk: "What is your employee / agent number?",
    questionKeywords: ["employee number", "agent id", "employee id", "agent reference", "reference number"],
    approvedAnswer:
      "“Certainly. My employee or agent reference is [APPROVED ID]. You can use that reference when checking the call with the company.”",
    notes: "Approved reference ID: [APPROVED ID].",
  },
  {
    id: "kb_why_consumer_id",
    sectionNumber: 7,
    category: "DATA_PRIVACY",
    customerAsk: "Why do you need my Consumer Identification Number?",
    questionKeywords: ["why do you need consumer id", "why id", "why need id", "identification number"],
    approvedAnswer:
      "“It's simply to verify the correct account and make sure I'm looking at the right service details. I don't want to give you information for the wrong account.”",
    notes: "Used strictly for account matching.",
  },
  {
    id: "kb_how_much_save",
    sectionNumber: 5,
    category: "OFFER",
    customerAsk: "How much will I save?",
    questionKeywords: ["how much will i save", "how much saving", "what do i save", "saving amount"],
    approvedAnswer:
      "“The reduction can be up to 30%, depending on your current service and monthly bill. I'll check your details first, so I can give you the correct information rather than guessing.”",
    notes: "Up to 30% reduction depending on current service.",
  },
  {
    id: "kb_new_contract",
    sectionNumber: 6,
    category: "OFFER",
    customerAsk: "Is this a new contract?",
    questionKeywords: ["new contract", "contract change", "am i locked in", "new agreement"],
    approvedAnswer:
      "“Before I give you an answer, I'll check the details of your current service. I'll then explain whether the reduction involves any change to your existing service or agreement.”",
    notes: "Reassure and verify details first.",
  },
  {
    id: "kb_number_change",
    sectionNumber: 33,
    category: "TECHNICAL",
    customerAsk: "Will my telephone number change?",
    questionKeywords: ["will my number change", "keep my number", "phone number change", "change number"],
    approvedAnswer:
      "“I'll explain any service changes before anything is agreed. I don't want you to continue without understanding exactly what would happen.”",
    notes: "Explain changes clearly before agreement.",
  },
  {
    id: "kb_service_stop",
    sectionNumber: 34,
    category: "TECHNICAL",
    customerAsk: "Will my telephone service stop or disconnect?",
    questionKeywords: ["will my service stop", "will my line cut off", "disconnect", "interruption"],
    approvedAnswer:
      "“No, the purpose is to discuss the available reduction on your service. I'll explain any changes clearly before anything is agreed or processed.”",
    notes: "Service does not stop.",
  },
  {
    id: "kb_is_scam",
    sectionNumber: 27,
    category: "COMPLIANCE",
    customerAsk: "Is this a scam?",
    questionKeywords: ["is this a scam", "scammers", "fraud", "suspicious call"],
    approvedAnswer:
      "“I understand why you'd ask. You should always be careful with unexpected calls. Don't provide information you're uncomfortable sharing. You can independently verify the company before continuing.”",
    notes: "Never argue. Offer independent verification.",
  },
  {
    id: "kb_website",
    sectionNumber: 19,
    category: "IDENTITY",
    customerAsk: "Do you have a website I can check?",
    questionKeywords: ["website", "online", "web page", "check online"],
    approvedAnswer:
      "“Of course. You can verify the company and the service independently before providing any information. If you'd rather not continue on this call, that's completely fine.”",
    notes: "Support independent customer verification.",
  },
  {
    id: "kb_why_dob",
    sectionNumber: 25,
    category: "DATA_PRIVACY",
    customerAsk: "Why do you need my date of birth?",
    questionKeywords: ["why do you need my date of birth", "why dob", "why birthday"],
    approvedAnswer:
      "“It's used as part of the account verification process. The purpose is simply to make sure the correct customer and service record are being checked.”",
    notes: "Never pressure if refused.",
  },
  {
    id: "kb_why_bank_details",
    sectionNumber: 39,
    category: "BILLING",
    customerAsk: "Why do you need bank details?",
    questionKeywords: ["why do you need bank details", "why bank", "why account details", "sort code"],
    approvedAnswer:
      "“If payment information is required for the service, I'll explain exactly why it is needed before asking for anything. You should never provide financial information without understanding its purpose.”",
    notes: "Transparency rule: explain purpose clearly before requesting financial details.",
  },
];

export class KnowledgeBaseEngine {
  public static searchQuestion(query: string): {
    matched: boolean;
    item?: CustomerQuestionItem;
    fallbackMessage: string;
  } {
    if (!query || !query.trim()) {
      return {
        matched: false,
        fallbackMessage: "Please enter what the customer asked.",
      };
    }

    const clean = query.toLowerCase().trim();

    for (const item of knowledgeBaseQuestions) {
      const match = item.questionKeywords.some((kw) => clean.includes(kw.toLowerCase()));
      if (match) {
        return {
          matched: true,
          item,
          fallbackMessage: "",
        };
      }
    }

    return {
      matched: false,
      fallbackMessage:
        "NO APPROVED ANSWER AVAILABLE. Follow the Golden Rule: Do not improvise claims. Escalate or provide approved company verification details.",
    };
  }
}
