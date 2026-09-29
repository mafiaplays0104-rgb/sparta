export interface ValidationResult {
  isValid: boolean;
  normalizedValue?: string;
  errorMessage?: string;
}

export class SecurityEngine {
  /**
   * PROHIBITED CREDENTIALS SCANNER
   * Flags attempts to collect PIN, OTP, passwords, card security codes, or 16-digit card numbers.
   */
  public static scanProhibitedInformation(text: string): {
    hasProhibited: boolean;
    detectedTypes: string[];
    warningMessage: string;
  } {
    if (!text) return { hasProhibited: false, detectedTypes: [], warningMessage: "" };

    const lower = text.toLowerCase();
    const detected: string[] = [];

    // Check for PIN
    if (/\bpin\b|\bpin\s*code\b|\bcard\s*pin\b/i.test(lower)) {
      detected.push("PIN");
    }

    // Check for OTP / One-time code
    if (/\botp\b|\bone[\s-]?time[\s-]?(?:password|passcode|code)\b|\bverification\s*code\b/i.test(lower)) {
      detected.push("OTP / One-Time Passcode");
    }

    // Check for Banking Passwords / Login
    if (/\bbank(?:ing)?\s*password\b|\bonline\s*banking\s*login\b|\bmemorable\s*word\b/i.test(lower)) {
      detected.push("Online Banking Password / Login");
    }

    // Check for CVV / CVC / Security code
    if (/\b(?:cvv|cvc|cvv2|security\s*code|3[\s-]digit\s*code|card\s*security)\b/i.test(lower)) {
      detected.push("Card CVV / Security Code");
    }

    // Check for Credit / Debit Card PAN (13 to 19 digits formatted or unformatted)
    const cardPattern = /\b(?:\d[ -]*?){13,19}\b/;
    if (cardPattern.test(text.replace(/[^0-9]/g, "")) && text.replace(/[^0-9]/g, "").length >= 15) {
      detected.push("Payment Card Number (PAN)");
    }

    const hasProhibited = detected.length > 0;
    const warningMessage = hasProhibited
      ? `PROHIBITED INFORMATION DETECTED (${detected.join(", ")}). You must NEVER request PIN, OTP, online passwords, or card security codes.`
      : "";

    return {
      hasProhibited,
      detectedTypes: detected,
      warningMessage,
    };
  }

  /**
   * UK Postcode validator and uppercase normalizer
   * Accepts standard UK formats: e.g. SW1A 1AA, M1 1AE, B33 8TH, CR2 6XH, DN55 1PT
   */
  public static validateUkPostcode(postcode: string): ValidationResult {
    if (!postcode || !postcode.trim()) {
      return { isValid: false, errorMessage: "Postcode is required." };
    }

    const trimmed = postcode.trim().toUpperCase().replace(/\s+/g, " ");
    
    // Normalize format: add space before the last 3 chars if missing
    let normalized = trimmed;
    if (!normalized.includes(" ") && normalized.length >= 5) {
      normalized = `${normalized.slice(0, -3)} ${normalized.slice(-3)}`;
    }

    // UK Postcode Regex
    const ukPostcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})$/;

    if (!ukPostcodeRegex.test(normalized)) {
      return {
        isValid: false,
        normalizedValue: normalized,
        errorMessage: "Please enter a valid UK postcode format (e.g. SW1A 1AA or B33 8TH).",
      };
    }

    return {
      isValid: true,
      normalizedValue: normalized,
    };
  }

  /**
   * UK Phone Number validator
   * Accepts landlines (01, 02), mobiles (07), freephone/non-geo (03, 0800), and +44 formats
   */
  public static validateUkPhoneNumber(phone: string): ValidationResult {
    if (!phone || !phone.trim()) {
      return { isValid: false, errorMessage: "Phone number is required." };
    }

    // Strip spaces, dashes, parentheses
    let clean = phone.replace(/[\s\-\(\)]/g, "");

    // Normalize +44 to 0
    if (clean.startsWith("+44")) {
      clean = "0" + clean.slice(3);
    } else if (clean.startsWith("44") && clean.length === 12) {
      clean = "0" + clean.slice(2);
    }

    const ukPhoneRegex = /^(01\d{8,9}|02\d{9}|03\d{9}|07\d{9}|0800\d{6,7}|0808\d{6,7}|08\d{9})$/;

    if (!ukPhoneRegex.test(clean) || clean.length < 10 || clean.length > 11) {
      return {
        isValid: false,
        normalizedValue: clean,
        errorMessage: "Please enter a valid 10 or 11 digit UK telephone number.",
      };
    }

    return {
      isValid: true,
      normalizedValue: clean,
    };
  }

  /**
   * Customer ID / Direct Debit Match Identifier validator
   * Supports configured prefix such as 'IBANGB'
   */
  public static validateCustomerId(
    idString: string,
    requiredPrefix: string = "IBANGB"
  ): ValidationResult {
    if (!idString || !idString.trim()) {
      return { isValid: false, errorMessage: "Customer ID is required." };
    }

    const clean = idString.trim().toUpperCase().replace(/\s+/g, "");

    if (requiredPrefix && !clean.startsWith(requiredPrefix.toUpperCase())) {
      return {
        isValid: false,
        normalizedValue: clean,
        errorMessage: `The identifier must start with "${requiredPrefix}".`,
      };
    }

    // Typical length check for IBANGB or identifier (e.g. 10 to 34 alphanumeric characters)
    if (clean.length < 8 || clean.length > 34 || !/^[A-Z0-9]+$/.test(clean)) {
      return {
        isValid: false,
        normalizedValue: clean,
        errorMessage: "The identifier format is invalid. Please check the characters entered.",
      };
    }

    return {
      isValid: true,
      normalizedValue: clean,
    };
  }

  /**
   * Date of Birth validation
   */
  public static validateDob(dobString: string): ValidationResult {
    if (!dobString || !dobString.trim()) {
      return { isValid: false, errorMessage: "Date of birth is required." };
    }

    const dateObj = new Date(dobString);
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, errorMessage: "Invalid date format." };
    }

    const currentYear = 2026;
    const year = dateObj.getFullYear();

    if (year < 1900 || year > currentYear) {
      return { isValid: false, errorMessage: `Birth year must be between 1900 and ${currentYear}.` };
    }

    return {
      isValid: true,
      normalizedValue: dobString,
    };
  }

  /**
   * Sanitize advisor notes to strip card numbers and sensitive credentials
   */
  public static sanitizeNotes(notes: string): string {
    if (!notes) return "";
    // Redact potential 16-digit card sequences
    let sanitized = notes.replace(/\b(?:\d[ -]*?){13,19}\b/g, "[REDACTED_CARD_NUMBER]");
    // Redact CVV mentions
    sanitized = sanitized.replace(/\b(?:cvv|cvc)\s*[:=]?\s*\d{3,4}\b/gi, "[REDACTED_CVV]");
    // Redact PIN mentions
    sanitized = sanitized.replace(/\bpin\s*[:=]?\s*\d{4,6}\b/gi, "[REDACTED_PIN]");
    return sanitized;
  }
}
