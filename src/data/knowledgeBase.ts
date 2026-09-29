import { CustomerQuestionItem } from "../types";

export const knowledgeBaseQuestions: CustomerQuestionItem[] = [
  {
    id: "kb_why_postcode",
    category: "DATA_PRIVACY",
    customerAsk: "Why are you asking for my postcode and address?",
    questionKeywords: ["postcode", "address", "house number", "door number", "live"],
    approvedAnswer:
      "“We confirm your address so the written offer terms and confirmation pack can be posted directly to your address for you to review in black and white.”",
    notes: "Only collect registered service address.",
  },
  {
    id: "kb_why_tv",
    category: "TECHNICAL",
    customerAsk: "Why do you need the make and model of my TV?",
    questionKeywords: ["tv", "television", "model", "make", "samsung", "lg", "sony"],
    approvedAnswer:
      "“It’s just so we have the correct information about the equipment you're currently using at home.”",
    notes: "Exact approved script line from Stage 9.",
  },
  {
    id: "kb_keep_phone_number",
    category: "TECHNICAL",
    customerAsk: "Do I get to keep my existing landline telephone number?",
    questionKeywords: ["keep number", "same number", "phone number change", "change number"],
    approvedAnswer:
      "“Yes, your existing telephone number remains completely unchanged.”",
    notes: "Standard number portability and continuity.",
  },
  {
    id: "kb_engineer_visit",
    category: "TECHNICAL",
    customerAsk: "Will an engineer need to come into my house?",
    questionKeywords: ["engineer", "visit", "technician", "come to house", "drilling", "wires"],
    approvedAnswer:
      "“No routine installation visit is needed because your existing line remains active. However, if you ever experience technical difficulty, a technical visit is included as part of the offer.”",
    notes: "Technical visit included on demand.",
  },
  {
    id: "kb_openreach_bt",
    category: "COMPANY",
    customerAsk: "Are you Openreach or BT?",
    questionKeywords: ["bt", "openreach", "british telecom", "virgin", "sky"],
    approvedAnswer:
      "“No, I am calling from Sparta regarding your telephone line services. We are an independent communications provider reviewing tariffs on qualifying lines.”",
    notes: "Never claim to be Openreach or BT.",
  },
  {
    id: "kb_why_direct_debit",
    category: "BILLING",
    customerAsk: "Why does the offer require Direct Debit?",
    questionKeywords: ["direct debit", "dd", "bank details", "payment method"],
    approvedAnswer:
      "“The optimized tariff is structured through Direct Debit to ensure automated low-cost administration and guarantee the lower rate.”",
    notes: "Direct debit mandate is the authorized payment method.",
  },
  {
    id: "kb_how_to_cancel",
    category: "BILLING",
    customerAsk: "What if I change my mind or want to cancel?",
    questionKeywords: ["cancel", "cooling off", "change mind", "guarantee"],
    approvedAnswer:
      "“You have full statutory review rights. All terms will be provided in writing so you can read everything thoroughly before any changes are made.”",
    notes: "Always emphasize written documentation before commitment.",
  },
];

export class KnowledgeBaseEngine {
  /**
   * Search knowledge base for approved answers
   */
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

    // Check direct keyword match
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

    // No approved answer found
    return {
      matched: false,
      fallbackMessage:
        "NO APPROVED ANSWER AVAILABLE. Do not improvise claims. Escalate to a supervisor or provide the company's approved verification procedure.",
    };
  }
}
