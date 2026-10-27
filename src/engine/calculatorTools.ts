import { BillSavingsCalculation, VatCalculation, DobAgeCalculation, OfferConfig, CustomerRecord } from "../types";
import { SPARTA_PLANS, SpartaPlan, SpartaPlanCategory } from "../data/spartaPlans";

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
   * Calculate 20% UK Standard VAT, Net Amount, Gross Amount, and contract totals
   */
  public static calculateVat(
    amount: number | string,
    vatRate: number = 20,
    routerFee: number = 30
  ): VatCalculation | null {
    const netAmount = this.parseBillAmount(amount);
    if (netAmount === null || netAmount <= 0) return null;

    // Exact Sparta Telecom plan prices at 20% VAT
    let grossAmount: number;
    let vatAmount: number;

    const spartaMatch = SPARTA_PLANS.find(
      (p) => Math.abs(netAmount - p.basePrice) < 0.005 && vatRate === 20
    );

    if (spartaMatch) {
      grossAmount = spartaMatch.grossPrice;
      vatAmount = spartaMatch.vatAmount;
    } else if (Math.abs(netAmount - 42.99) < 0.005 && vatRate === 20) {
      grossAmount = 51.58;
      vatAmount = 8.59;
    } else {
      vatAmount = Math.round(netAmount * (vatRate / 100) * 100) / 100;
      grossAmount = Math.round((netAmount + vatAmount) * 100) / 100;
    }

    const annualGross = Math.round(grossAmount * 12 * 100) / 100;
    const twoYearGross = Math.round(grossAmount * 24 * 100) / 100;
    const firstBillWithRouter = Math.round((grossAmount + routerFee) * 100) / 100;

    const formattedNet = `£${netAmount.toFixed(2)}`;
    const formattedVat = `£${vatAmount.toFixed(2)}`;
    const formattedGross = `£${grossAmount.toFixed(2)}`;
    const formattedAnnualGross = `£${annualGross.toFixed(2)}`;
    const formattedTwoYearGross = `£${twoYearGross.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formattedFirstBillWithRouter = `£${firstBillWithRouter.toFixed(2)}`;

    const speechSnippet = `So what you will be paying after the upgrade as your telephone bills that is only ${formattedNet} + VAT (making it approx. ${formattedGross} total) each month, locked in with a 24-month price promise guarantee so your bill won't increase under any circumstances.`;

    return {
      netAmount,
      vatRate,
      vatAmount,
      grossAmount,
      formattedNet,
      formattedVat,
      formattedGross,
      annualGross,
      formattedAnnualGross,
      twoYearGross,
      formattedTwoYearGross,
      routerFee,
      firstBillWithRouter,
      formattedFirstBillWithRouter,
      speechSnippet,
    };
  }

  /**
   * Extract Net and VAT from a Gross amount (Amount including VAT)
   */
  public static extractVatFromGross(
    amount: number | string,
    vatRate: number = 20,
    routerFee: number = 30
  ): VatCalculation | null {
    const gross = this.parseBillAmount(amount);
    if (gross === null || gross <= 0) return null;

    let netAmount: number;
    let vatAmount: number;

    const spartaGrossMatch = SPARTA_PLANS.find(
      (p) => Math.abs(gross - p.grossPrice) < 0.005 && vatRate === 20
    );

    if (spartaGrossMatch) {
      netAmount = spartaGrossMatch.basePrice;
      vatAmount = spartaGrossMatch.vatAmount;
    } else if (Math.abs(gross - 51.58) < 0.005 && vatRate === 20) {
      netAmount = 42.99;
      vatAmount = 8.59;
    } else {
      netAmount = Math.round((gross / (1 + vatRate / 100)) * 100) / 100;
      vatAmount = Math.round((gross - netAmount) * 100) / 100;
    }

    const annualGross = Math.round(gross * 12 * 100) / 100;
    const twoYearGross = Math.round(gross * 24 * 100) / 100;
    const firstBillWithRouter = Math.round((gross + routerFee) * 100) / 100;

    const formattedNet = `£${netAmount.toFixed(2)}`;
    const formattedVat = `£${vatAmount.toFixed(2)}`;
    const formattedGross = `£${gross.toFixed(2)}`;
    const formattedAnnualGross = `£${annualGross.toFixed(2)}`;
    const formattedTwoYearGross = `£${twoYearGross.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formattedFirstBillWithRouter = `£${firstBillWithRouter.toFixed(2)}`;

    const speechSnippet = `So what you will be paying after the upgrade as your telephone bills that is only ${formattedNet} + VAT (making it approx. ${formattedGross} total) each month, locked in with a 24-month price promise guarantee so your bill won't increase under any circumstances.`;

    return {
      netAmount,
      vatRate,
      vatAmount,
      grossAmount: gross,
      formattedNet,
      formattedVat,
      formattedGross,
      annualGross,
      formattedAnnualGross,
      twoYearGross,
      formattedTwoYearGross,
      routerFee,
      firstBillWithRouter,
      formattedFirstBillWithRouter,
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

  // =========================================================================
  // SPARTA TELECOM PRICING MATRIX & PROBABILITY BRANCHING ENGINE
  // =========================================================================

  /**
   * Return all 9 Sparta Telecom plans
   */
  public static getSpartaPlans(): SpartaPlan[] {
    return SPARTA_PLANS;
  }

  /**
   * Find plan by ID
   */
  public static getSpartaPlanById(id: string): SpartaPlan | undefined {
    return SPARTA_PLANS.find((p) => p.id === id);
  }

  /**
   * Get plans by category
   */
  public static getSpartaPlansByCategory(category: SpartaPlanCategory): SpartaPlan[] {
    return SPARTA_PLANS.filter((p) => p.category === category);
  }

  /**
   * Determine Probability Branch from customer's broadband status
   */
  public static determineProbabilityBranch(customer: CustomerRecord): SpartaPlanCategory {
    if (customer.broadbandStatus === "FIBRE_BROADBAND") {
      return "FIBRE_BROADBAND";
    }
    if (customer.broadbandStatus === "NORMAL_BROADBAND") {
      return "NORMAL_BROADBAND";
    }
    return "LANDLINE_ONLY";
  }

  /**
   * Recommends the ideal Sparta Telecom plan based on probability qualification
   */
  public static recommendSpartaPlan(customer: CustomerRecord): SpartaPlan {
    const branch = this.determineProbabilityBranch(customer);
    const isHighCall =
      customer.callVolume === "HIGH_FREQUENT" ||
      customer.landlineUsage === "HIGH" ||
      customer.landlineUsage === "MODERATE";

    if (branch === "LANDLINE_ONLY") {
      return isHighCall
        ? SPARTA_PLANS.find((p) => p.id === "sparta_enhanced_line_only")!
        : SPARTA_PLANS.find((p) => p.id === "sparta_line_only")!;
    }

    if (branch === "NORMAL_BROADBAND") {
      return isHighCall
        ? SPARTA_PLANS.find((p) => p.id === "sparta_talk_unlimited_normal_bb")!
        : SPARTA_PLANS.find((p) => p.id === "sparta_line_normal_bb")!;
    }

    // FIBRE_BROADBAND
    if (isHighCall) {
      return SPARTA_PLANS.find((p) => p.id === "sparta_unlimited_f40_enhanced")!;
    }
    return SPARTA_PLANS.find((p) => p.id === "sparta_talk_fibre_40")!;
  }

  /**
   * Compare customer's current bill against a Sparta Telecom plan
   */
  public static calculateSpartaComparison(
    currentBillInput: number | string,
    plan: SpartaPlan
  ): {
    currentBill: number;
    spartaBase: number;
    spartaVat: number;
    spartaGross: number;
    monthlySavings: number;
    twoYearSavings: number;
    isSaving: boolean;
    speechPitch: string;
  } | null {
    const currentBill = this.parseBillAmount(currentBillInput);
    if (currentBill === null) return null;

    const spartaGross = plan.grossPrice;
    const monthlySavings = Math.round((currentBill - spartaGross) * 100) / 100;
    const twoYearSavings = Math.round(monthlySavings * 24 * 100) / 100;
    const isSaving = monthlySavings > 0;

    const formattedDiff = `£${Math.abs(monthlySavings).toFixed(2)}`;
    const formattedTwoYearDiff = `£${Math.abs(twoYearSavings).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let speechPitch: string;
    if (isSaving) {
      speechPitch = `At the moment you're paying around £${currentBill.toFixed(2)}, but with Sparta Telecom your revised telephone bill will be only ${plan.displayBase} (which is approx. ${plan.displayGross} including 20% VAT). That saves you ${formattedDiff} each month, which adds up to ${formattedTwoYearDiff} saved over your 24-month price promise guarantee!`;
    } else {
      speechPitch = `Your new package with Sparta Telecom will be only ${plan.displayBase} (approx. ${plan.displayGross} inc. VAT) locked in with our 24-month price promise guarantee, meaning no unexpected price hikes for the next two years.`;
    }

    return {
      currentBill,
      spartaBase: plan.basePrice,
      spartaVat: plan.vatAmount,
      spartaGross,
      monthlySavings,
      twoYearSavings,
      isSaving,
      speechPitch,
    };
  }
}
