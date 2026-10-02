import { CustomerRecord, LandlineUsage, ResponseCategory, HomeServiceStatus } from "../types";
import { CalculatorTools } from "./calculatorTools";

export interface ExtractedInfo {
  monthlyBill?: number;
  billApproximate?: boolean;
  isUsingAtHome?: HomeServiceStatus;
  consumerId?: string;
  customerDecision?: "YES" | "NO" | "THINK_ABOUT_IT" | "CALL_BACK" | "UNDECIDED";
  landlineUsage?: LandlineUsage;
  billIncludesPhone?: boolean;
  billIncludesBroadband?: boolean;
  billIncludesTv?: boolean;
  medicalAlarm?: boolean;
  hasTvService?: boolean;
  tvMakeModel?: string;
  mobileNumber?: string;
  hasMobile?: boolean;
  sentimentHint?: string;
  responseCategory?: ResponseCategory;
  conflictDetected?: {
    field: string;
    previousValue: string;
    newValue: string;
    clarificationPrompt: string;
  };
}

export class InformationExtractor {
  /**
   * Smartly extract structured attributes from customer speech
   */
  public static extractFromText(
    text: string,
    existingRecord: CustomerRecord
  ): ExtractedInfo {
    if (!text || !text.trim()) return {};

    const lower = text.toLowerCase();
    const result: ExtractedInfo = {};

    // 1. Response Category Detection
    result.responseCategory = this.classifyResponseCategory(lower);

    // 2. Home Service Extraction (Section 9)
    if (
      lower.includes("yes at home") ||
      lower.includes("yes it's at home") ||
      lower.includes("yes, at home") ||
      lower.includes("use it at home") ||
      lower.includes("it's my home phone") ||
      lower.includes("at my house")
    ) {
      result.isUsingAtHome = "YES";
    } else if (
      lower.includes("not at home") ||
      lower.includes("business phone") ||
      lower.includes("office phone") ||
      lower.includes("for work only")
    ) {
      result.isUsingAtHome = "NO";
    } else if (lower.includes("don't know") && lower.includes("home")) {
      result.isUsingAtHome = "DONT_KNOW";
    }

    // 3. Monthly Bill Extraction (Section 10)
    const parsedAmount = CalculatorTools.parseBillAmount(text);

    if (parsedAmount !== null && parsedAmount > 0) {
      const isApprox =
        lower.includes("about") ||
        lower.includes("around") ||
        lower.includes("roughly") ||
        lower.includes("give or take") ||
        lower.includes("approx") ||
        lower.includes("think") ||
        lower.includes("maybe");

      // Check for conflict
      if (
        existingRecord.monthlyBill &&
        Math.abs(existingRecord.monthlyBill - parsedAmount) > 2
      ) {
        result.conflictDetected = {
          field: "Monthly Bill",
          previousValue: `£${existingRecord.monthlyBill.toFixed(2)}`,
          newValue: `£${parsedAmount.toFixed(2)}`,
          clarificationPrompt: `The customer previously gave £${existingRecord.monthlyBill.toFixed(0)} and has now given £${parsedAmount.toFixed(0)}. Please clarify: "Just to make sure I've got that right, was the amount £${existingRecord.monthlyBill.toFixed(0)} or around £${parsedAmount.toFixed(0)}?"`,
        };
      }

      result.monthlyBill = parsedAmount;
      result.billApproximate = isApprox;
    }

    // 4. Decision Extraction (Sections 48, 49)
    if (
      lower.includes("yes proceed") ||
      lower.includes("yes please") ||
      lower.includes("i want the reduction") ||
      lower.includes("yes that's fine") ||
      lower.includes("go ahead with it")
    ) {
      result.customerDecision = "YES";
    } else if (
      lower.includes("no i don't want it") ||
      lower.includes("no thanks") ||
      lower.includes("no reduction") ||
      lower.includes("i'll pass")
    ) {
      result.customerDecision = "NO";
    }

    // 5. Landline Usage Extraction
    if (
      lower.includes("hardly ever") ||
      lower.includes("rarely") ||
      lower.includes("don't use it much") ||
      lower.includes("barely use") ||
      lower.includes("not really") ||
      lower.includes("never use")
    ) {
      result.landlineUsage = "LOW";
    } else if (
      lower.includes("incoming calls only") ||
      lower.includes("incoming only") ||
      lower.includes("mostly incoming") ||
      lower.includes("mainly incoming")
    ) {
      result.landlineUsage = "INCOMING_ONLY";
    } else if (
      lower.includes("all the time") ||
      lower.includes("every day") ||
      lower.includes("quite often") ||
      lower.includes("a lot") ||
      lower.includes("frequently")
    ) {
      result.landlineUsage = "HIGH";
    } else if (lower.includes("moderate") || lower.includes("sometimes") || lower.includes("now and then")) {
      result.landlineUsage = "MODERATE";
    }

    // 6. Consumer ID extraction
    const idMatch = text.match(/(?:consumer\s*id|identification|reference|id)\s*(?:is|:)?\s*([a-zA-Z0-9]{5,15})/i);
    if (idMatch && idMatch[1]) {
      result.consumerId = idMatch[1].toUpperCase();
    }

    return result;
  }

  /**
   * Classify user response into broad categories
   */
  public static classifyResponseCategory(text: string): ResponseCategory {
    const lower = text.toLowerCase();

    // Do not call (Sections 41, 42)
    if (
      lower.includes("do not call") ||
      lower.includes("take me off your list") ||
      lower.includes("never call again") ||
      lower.includes("remove my number") ||
      lower.includes("stop calling me")
    ) {
      return "DO_NOT_CALL";
    }

    // Wrong person (Sections 22, 23)
    if (
      lower.includes("wrong person") ||
      lower.includes("not the account holder") ||
      lower.includes("partner's name") ||
      lower.includes("husband's name") ||
      lower.includes("wife's name") ||
      lower.includes("moved away") ||
      lower.includes("passed away") ||
      lower.includes("doesn't live here")
    ) {
      return "WRONG_PERSON";
    }

    // Busy (Section 4)
    if (
      lower.includes("busy") ||
      lower.includes("don't have time") ||
      lower.includes("can you call later") ||
      lower.includes("in the middle of") ||
      lower.includes("cooking dinner")
    ) {
      return "BUSY";
    }

    // Suspicious / Security (Sections 18, 27)
    if (
      lower.includes("scam") ||
      lower.includes("who are you") ||
      lower.includes("is this genuine") ||
      lower.includes("how do i know") ||
      lower.includes("don't trust") ||
      lower.includes("how did you get my number") ||
      lower.includes("why are you calling")
    ) {
      return "SUSPICIOUS";
    }

    // Refusal (Sections 3, 49)
    if (
      lower.includes("not interested") ||
      lower.includes("don't want anything") ||
      lower.includes("refuse") ||
      lower.includes("no thanks")
    ) {
      return "REFUSAL";
    }

    // Doesn't remember (Sections 7, 10, 26)
    if (
      lower.includes("don't remember") ||
      lower.includes("not sure") ||
      lower.includes("no idea") ||
      lower.includes("haven't got a clue") ||
      lower.includes("can't recall") ||
      lower.includes("don't have my bill")
    ) {
      return "DOESNT_REMEMBER";
    }

    // Needs time (Sections 30, 31)
    if (
      lower.includes("need to check") ||
      lower.includes("find my bill") ||
      lower.includes("let me look") ||
      lower.includes("hold on a second") ||
      lower.includes("think about it") ||
      lower.includes("speak to my family") ||
      lower.includes("one moment")
    ) {
      return "NEEDS_TIME";
    }

    // Confused (Section 13)
    if (
      lower.includes("don't understand") ||
      lower.includes("what do you mean") ||
      lower.includes("pardon") ||
      lower.includes("sorry?") ||
      lower.includes("confused")
    ) {
      return "CONFUSED";
    }

    // Positive (Sections 1, 12, 44, 48)
    if (
      lower.includes("yes") ||
      lower.includes("good") ||
      lower.includes("fine") ||
      lower.includes("perfect") ||
      lower.includes("sounds good") ||
      lower.includes("makes sense") ||
      lower.includes("interested")
    ) {
      return "POSITIVE";
    }

    return "NORMAL";
  }
}
