/**
 * SPARTA PAYMENT SECURITY & COMPLIANCE ENGINE
 * 
 * Strict enforcement of Section 33, 34, 40, 56:
 * - Direct Debit only (Sort Code & Account Number)
 * - FORBIDDEN: Card numbers, CVV, PIN, OTP, online banking passwords
 * - FORBIDDEN: Persistence in localStorage, sessionStorage, console.log, analytics
 * - Volatile-only in-memory storage with immediate masking
 */

export interface ValidatedDirectDebit {
  accountHolderName: string;
  sortCode: string; // 6 digits, e.g. 12-34-56
  accountNumber: string; // 8 digits
  bankName?: string;
  isValid: boolean;
  errors: string[];
}

export class SecurityEngine {
  /**
   * Cleans and validates UK sort code
   * Acceptable formats: 12-34-56, 123456, 12 34 56
   */
  public static validateSortCode(input: string): { isValid: boolean; formatted: string; error?: string } {
    const digitsOnly = input.replace(/\D/g, "");
    if (digitsOnly.length !== 6) {
      return {
        isValid: false,
        formatted: input,
        error: "UK Sort Code must contain exactly 6 digits (e.g. 20-40-60).",
      };
    }
    const formatted = `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 4)}-${digitsOnly.slice(4, 6)}`;
    return { isValid: true, formatted };
  }

  /**
   * Cleans and validates UK 8-digit account number
   */
  public static validateAccountNumber(input: string): { isValid: boolean; formatted: string; error?: string } {
    const digitsOnly = input.replace(/\D/g, "");
    if (digitsOnly.length !== 8) {
      return {
        isValid: false,
        formatted: input,
        error: "UK Account Number must be exactly 8 digits.",
      };
    }
    return { isValid: true, formatted: digitsOnly };
  }

  /**
   * Masks sort code for safe screen display: **-**-56
   */
  public static maskSortCode(sortCode: string): string {
    const clean = sortCode.replace(/\D/g, "");
    if (clean.length < 6) return "••••••";
    return `••-••-${clean.slice(4, 6)}`;
  }

  /**
   * Masks account number for safe screen display: ••••4321
   */
  public static maskAccountNumber(accountNumber: string): string {
    const clean = accountNumber.replace(/\D/g, "");
    if (clean.length < 4) return "••••••••";
    return `••••${clean.slice(-4)}`;
  }

  /**
   * Verifies that forbidden payment attributes are never recorded or present
   */
  public static auditForbiddenFields(inputKey: string): boolean {
    const forbiddenKeywords = [
      "card",
      "cvv",
      "cvc",
      "pin",
      "otp",
      "password",
      "passcode",
      "securitycode",
      "expiry",
      "expdate",
    ];
    const lower = inputKey.toLowerCase().replace(/[^a-z]/g, "");
    return forbiddenKeywords.some((f) => lower.includes(f));
  }

  /**
   * Sanitizes advisor notes to ensure accidental paste of card or sensitive numbers is stripped
   */
  public static sanitizeNotes(notes: string): string {
    // Replace 16-digit credit card-like patterns
    let sanitized = notes.replace(/\b(?:\d[ -]*?){13,19}\b/g, "[REDACTED_CARD_NUMBER]");
    // Replace 3-4 digit CVV patterns when labelled
    sanitized = sanitized.replace(/(?:cvv|cvc|pin|otp)[\s:=]+(\d{3,6})/gi, "[REDACTED_AUTH_CODE]");
    return sanitized;
  }
}
