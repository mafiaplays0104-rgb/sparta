import { CustomerRecord, LandlineUsage, ResponseCategory } from "../types";
import { CalculatorTools } from "./calculatorTools";

export interface ExtractedInfo {
  monthlyBill?: number;
  billApproximate?: boolean;
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

    // 2. Monthly Bill Extraction
    const billMatch = lower.match(/(?:pay|bill|paying|cost|costs|about|around|roughly)\s*(?:is|of)?\s*(?:around|about|roughly)?\s*(?:£)?\s*(\d+(?:\.\d{1,2})?|\d+\s*(?:pounds?|quid))/);
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

    // 3. Landline Usage Extraction
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

    // 4. Included Services (Broadband / TV / Phone)
    if (
      lower.includes("including broadband") ||
      lower.includes("includes broadband") ||
      lower.includes("with internet") ||
      lower.includes("includes internet") ||
      lower.includes("with wifi") ||
      lower.includes("with broadband")
    ) {
      result.billIncludesBroadband = true;
    }
    if (
      lower.includes("without broadband") ||
      lower.includes("no internet") ||
      lower.includes("don't have broadband") ||
      lower.includes("landline only") ||
      lower.includes("just phone")
    ) {
      result.billIncludesBroadband = false;
    }

    if (
      lower.includes("including tv") ||
      lower.includes("includes tv") ||
      lower.includes("with tv") ||
      lower.includes("tv package")
    ) {
      result.billIncludesTv = true;
      result.hasTvService = true;
    }
    if (
      lower.includes("not tv") ||
      lower.includes("no tv") ||
      lower.includes("without tv") ||
      lower.includes("don't have tv") ||
      lower.includes("just phone and internet")
    ) {
      result.billIncludesTv = false;
      result.hasTvService = false;
    }

    // 5. Medical Alarm Screening
    if (
      lower.includes("yes i have a pendant") ||
      lower.includes("yes, medical alarm") ||
      lower.includes("have an emergency alarm") ||
      lower.includes("lifeline") ||
      lower.includes("red button") ||
      lower.includes("care alarm")
    ) {
      result.medicalAlarm = true;
    } else if (
      lower.includes("no alarm") ||
      lower.includes("no medical") ||
      lower.includes("no pendant") ||
      lower.includes("nothing like that")
    ) {
      result.medicalAlarm = false;
    }

    // 6. Mobile detection
    if (lower.includes("no mobile") || lower.includes("don't have a mobile") || lower.includes("don't use a mobile")) {
      result.hasMobile = false;
    }

    return result;
  }

  /**
   * Classify user response into broad categories
   */
  public static classifyResponseCategory(text: string): ResponseCategory {
    const lower = text.toLowerCase();

    // Do not call
    if (
      lower.includes("do not call") ||
      lower.includes("take me off your list") ||
      lower.includes("never call again") ||
      lower.includes("remove my number")
    ) {
      return "DO_NOT_CALL";
    }

    // Wrong person
    if (
      lower.includes("wrong person") ||
      lower.includes("not mr") ||
      lower.includes("not mrs") ||
      lower.includes("moved away") ||
      lower.includes("passed away") ||
      lower.includes("doesn't live here")
    ) {
      return "WRONG_PERSON";
    }

    // Busy
    if (
      lower.includes("busy") ||
      lower.includes("don't have time") ||
      lower.includes("can you call later") ||
      lower.includes("in the middle of") ||
      lower.includes("cooking dinner")
    ) {
      return "BUSY";
    }

    // Suspicious / Security
    if (
      lower.includes("scam") ||
      lower.includes("who are you") ||
      lower.includes("is this genuine") ||
      lower.includes("how do i know") ||
      lower.includes("how did you get my number") ||
      lower.includes("why are you calling")
    ) {
      return "SUSPICIOUS";
    }

    // Refusal
    if (
      lower.includes("not interested") ||
      lower.includes("don't want anything") ||
      lower.includes("refuse") ||
      lower.includes("no thanks")
    ) {
      return "REFUSAL";
    }

    // Doesn't remember
    if (
      lower.includes("don't remember") ||
      lower.includes("not sure") ||
      lower.includes("no idea") ||
      lower.includes("haven't got a clue") ||
      lower.includes("can't recall")
    ) {
      return "DOESNT_REMEMBER";
    }

    // Needs time
    if (
      lower.includes("need to check") ||
      lower.includes("find my bill") ||
      lower.includes("let me look") ||
      lower.includes("hold on a second") ||
      lower.includes("one moment")
    ) {
      return "NEEDS_TIME";
    }

    // Confused
    if (
      lower.includes("don't understand") ||
      lower.includes("what do you mean") ||
      lower.includes("pardon") ||
      lower.includes("sorry?")
    ) {
      return "CONFUSED";
    }

    // Positive
    if (
      lower.includes("yes") ||
      lower.includes("good") ||
      lower.includes("fine") ||
      lower.includes("perfect") ||
      lower.includes("sounds good") ||
      lower.includes("makes sense")
    ) {
      return "POSITIVE";
    }

    return "NORMAL";
  }
}
