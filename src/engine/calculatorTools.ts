import { BillSavingsCalculation, DobAgeCalculation, OfferConfig } from "../types";

export class CalculatorTools {
  private static readonly CURRENT_YEAR = 2026;

  /**
   * Parse natural bill strings like "80 pounds 99 pence", "80.99", "£80.99", "80 and 50p"
   */
  public static parseBillAmount(input: string | number): number | null {
    if (typeof input === "number") {
      return isNaN(input) || input <= 0 ? null : Math.round(input * 100) / 100;
    }

    if (!input || typeof input !== "string") return null;

    const cleanInput = input.trim().toLowerCase();

    // Direct numeric match like "80.99" or "£80.99"
    const directMatch = cleanInput.replace(/£/g, "").replace(/,/g, "").match(/^(\d+(\.\d+)?)$/);
    if (directMatch) {
      const val = parseFloat(directMatch[1]);
      return isNaN(val) || val <= 0 ? null : Math.round(val * 100) / 100;
    }

    // Natural speech pattern: e.g. "80 pounds 99 pence", "80 pounds 99 pents", "80 pounds and 50 pence"
    const poundsPenceMatch = cleanInput.match(/(\d+)\s*(?:pounds?|quid|£)?\s*(?:and)?\s*(\d+)\s*(?:pence|pents|cents?|p)?/);
    if (poundsPenceMatch) {
      const pounds = parseInt(poundsPenceMatch[1], 10);
      const pence = parseInt(poundsPenceMatch[2], 10);
      const total = pounds + pence / 100;
      return Math.round(total * 100) / 100;
    }

    // Just pounds match: e.g. "80 pounds" or "about 75"
    const justPoundsMatch = cleanInput.match(/(\d+)\s*(?:pounds?|quid|£)/);
    if (justPoundsMatch) {
      const pounds = parseInt(justPoundsMatch[1], 10);
      return pounds;
    }

    // Extract first decimal or number found
    const fallbackMatch = cleanInput.match(/(\d+(?:\.\d{1,2})?)/);
    if (fallbackMatch) {
      const val = parseFloat(fallbackMatch[1]);
      return isNaN(val) || val <= 0 ? null : Math.round(val * 100) / 100;
    }

    return null;
  }

  /**
   * Calculate 30% (or configured) discount, monthly savings, and annual savings
   */
  public static calculateBillSavings(
    amount: number | string,
    discountPercent: number = 30
  ): BillSavingsCalculation | null {
    const originalBill = this.parseBillAmount(amount);
    if (originalBill === null || originalBill <= 0) return null;

    const discountRate = discountPercent / 100;
    const monthlySavings = Math.round(originalBill * discountRate * 100) / 100;
    const discountedPrice = Math.round((originalBill - monthlySavings) * 100) / 100;
    const annualSavings = Math.round(monthlySavings * 12 * 100) / 100;

    const formattedOriginal = `£${originalBill.toFixed(2)}`;
    const formattedDiscounted = `£${discountedPrice.toFixed(2)}`;
    const formattedMonthlySavings = `£${monthlySavings.toFixed(2)}`;
    const formattedAnnualSavings = `£${annualSavings.toFixed(2)}`;

    const speechSnippet = `Based on what you've just told me, with your average bill around ${formattedOriginal}, the ${discountPercent}% reduction brings it down to ${formattedDiscounted}, saving you ${formattedMonthlySavings} each month, which is ${formattedAnnualSavings} saved in a year.`;

    return {
      originalBill,
      discountPercent,
      discountedPrice,
      monthlySavings,
      annualSavings,
      formattedOriginal,
      formattedDiscounted,
      formattedMonthlySavings,
      formattedAnnualSavings,
      speechSnippet,
    };
  }

  /**
   * Calculate birth year from age (e.g. age 72 in 2026 -> 1954)
   */
  public static calculateYearFromAge(age: number): number {
    return this.CURRENT_YEAR - age;
  }

  /**
   * Calculate age from birth year (e.g. 1954 -> 72 in 2026)
   */
  public static calculateAgeFromYear(birthYear: number): number {
    return this.CURRENT_YEAR - birthYear;
  }

  /**
   * Calculate exact age from a full date string (YYYY-MM-DD or DD/MM/YYYY)
   */
  public static calculateAgeFromDob(dobString: string): { age: number; birthYear: number; valid: boolean } {
    if (!dobString) return { age: 0, birthYear: 0, valid: false };

    let parsedDate: Date | null = null;

    // Check ISO format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dobString)) {
      parsedDate = new Date(dobString);
    } 
    // Check UK format DD/MM/YYYY
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dobString)) {
      const parts = dobString.split("/");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      parsedDate = new Date(year, month, day);
    } else {
      parsedDate = new Date(dobString);
    }

    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return { age: 0, birthYear: 0, valid: false };
    }

    const birthYear = parsedDate.getFullYear();
    if (birthYear < 1900 || birthYear > this.CURRENT_YEAR) {
      return { age: 0, birthYear: 0, valid: false };
    }

    const today = new Date(this.CURRENT_YEAR, 8, 30); // 2026
    let age = today.getFullYear() - parsedDate.getFullYear();
    const m = today.getMonth() - parsedDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < parsedDate.getDate())) {
      age--;
    }

    return { age: Math.max(0, age), birthYear, valid: true };
  }

  /**
   * Validate age or birth year against campaign eligibility rules
   */
  public static evaluateDobEligibility(
    calculation: { birthYear?: number; age?: number; exactDob?: string },
    config: OfferConfig
  ): { isEligible: boolean; message: string } {
    const minDobStr = config.eligibilityRules?.minimumDob || "1943-01-01";
    const maxDobStr = config.eligibilityRules?.maximumDob || "1960-12-31";
    const minYear = new Date(minDobStr).getFullYear();
    const maxYear = new Date(maxDobStr).getFullYear();

    let targetYear = calculation.birthYear;

    if (!targetYear && calculation.exactDob) {
      const res = this.calculateAgeFromDob(calculation.exactDob);
      if (res.valid) targetYear = res.birthYear;
    }

    if (!targetYear && calculation.age !== undefined) {
      targetYear = this.calculateYearFromAge(calculation.age);
    }

    if (!targetYear) {
      return { isEligible: false, message: "Date of birth or age not specified." };
    }

    const isEligible = targetYear >= minYear && targetYear <= maxYear;
    const minAge = this.calculateAgeFromYear(maxYear);
    const maxAge = this.calculateAgeFromYear(minYear);

    const message = isEligible
      ? `✓ Eligible: Born ${targetYear} (approx ${this.calculateAgeFromYear(targetYear)} yrs old). Within ${minYear}–${maxYear} campaign bracket.`
      : `✕ Outside Campaign Range: Born ${targetYear} (${this.calculateAgeFromYear(targetYear)} yrs old). Eligible bracket is ${minYear}–${maxYear} (${minAge}–${maxAge} yrs old).`;

    return { isEligible, message };
  }

  /**
   * Complete DOB/Age Tool processor
   */
  public static processDobCalculation(
    input: { mode: "AGE" | "YEAR" | "EXACT_DOB"; value: string | number },
    config: OfferConfig
  ): DobAgeCalculation {
    if (input.mode === "AGE") {
      const ageNum = typeof input.value === "number" ? input.value : parseInt(String(input.value), 10);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        return {
          inputMode: "AGE",
          isEligible: false,
          eligibilityMessage: "Please enter a realistic age between 18 and 120.",
          formattedDisplay: "Invalid age",
        };
      }
      const birthYear = this.calculateYearFromAge(ageNum);
      const evalRes = this.evaluateDobEligibility({ birthYear, age: ageNum }, config);
      return {
        inputMode: "AGE",
        age: ageNum,
        birthYear,
        isEligible: evalRes.isEligible,
        eligibilityMessage: evalRes.message,
        formattedDisplay: `Age ${ageNum} → Born in ${birthYear}`,
      };
    }

    if (input.mode === "YEAR") {
      const yearNum = typeof input.value === "number" ? input.value : parseInt(String(input.value), 10);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > this.CURRENT_YEAR) {
        return {
          inputMode: "YEAR",
          isEligible: false,
          eligibilityMessage: `Please enter a valid birth year between 1900 and ${this.CURRENT_YEAR}.`,
          formattedDisplay: "Invalid birth year",
        };
      }
      const age = this.calculateAgeFromYear(yearNum);
      const evalRes = this.evaluateDobEligibility({ birthYear: yearNum, age }, config);
      return {
        inputMode: "YEAR",
        age,
        birthYear: yearNum,
        isEligible: evalRes.isEligible,
        eligibilityMessage: evalRes.message,
        formattedDisplay: `Birth Year ${yearNum} → ${age} years old`,
      };
    }

    // EXACT_DOB mode
    const dobStr = String(input.value);
    const dobRes = this.calculateAgeFromDob(dobStr);
    if (!dobRes.valid) {
      return {
        inputMode: "EXACT_DOB",
        isEligible: false,
        eligibilityMessage: "Please provide a valid date in YYYY-MM-DD or DD/MM/YYYY format.",
        formattedDisplay: "Invalid date",
      };
    }

    const evalRes = this.evaluateDobEligibility({ birthYear: dobRes.birthYear, exactDob: dobStr }, config);
    return {
      inputMode: "EXACT_DOB",
      age: dobRes.age,
      birthYear: dobRes.birthYear,
      exactDob: dobStr,
      isEligible: evalRes.isEligible,
      eligibilityMessage: evalRes.message,
      formattedDisplay: `DOB ${dobStr} → Born ${dobRes.birthYear} (${dobRes.age} yrs old)`,
    };
  }
}
