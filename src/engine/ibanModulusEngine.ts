import { VOCALINK_WEIGHTS, SORT_CODE_SUBSTITUTIONS, ModulusAlgorithm, ModulusWeightEntry } from "../data/vocalinkModulusData";

export interface BankInfo {
  name: string;
  code: string;
}

export const KNOWN_BANK_DIRECTORIES: Record<string, BankInfo> = {
  "040004": { name: "Monzo Bank", code: "MONZ" },
  "231470": { name: "Starling Bank", code: "SRLG" },
  "608371": { name: "Revolut", code: "REVU" },
  "089999": { name: "Co-Operative Bank / Smile", code: "CPBK" },
  "200000": { name: "Barclays Bank", code: "BARC" },
  "400000": { name: "HSBC UK", code: "MIDL" },
  "300000": { name: "Lloyds Bank", code: "LOYD" },
  "600000": { name: "NatWest", code: "NWBK" },
  "160000": { name: "Royal Bank of Scotland (RBS)", code: "RBOS" },
  "090126": { name: "Santander UK", code: "ABBY" },
  "070093": { name: "Nationwide Building Society", code: "NAVI" },
  "110000": { name: "Halifax / Bank of Scotland", code: "HLFX" },
  "870000": { name: "TSB Bank", code: "TSBS" },
  "820000": { name: "Clydesdale Bank / Yorkshire Bank", code: "CLYD" },
  "930000": { name: "ClearBank", code: "CLBK" },
  "083210": { name: "Virgin Money", code: "NOVA" },
  "180002": { name: "Coutts & Co", code: "COUT" },
  "608000": { name: "Metro Bank", code: "MYMC" },
};

export function lookupBankInfo(sortCode: string): BankInfo {
  const cleanSc = sortCode.replace(/[^0-9]/g, "");
  if (KNOWN_BANK_DIRECTORIES[cleanSc]) {
    return KNOWN_BANK_DIRECTORIES[cleanSc];
  }

  const prefix2 = cleanSc.substring(0, 2);
  const prefix3 = cleanSc.substring(0, 3);

  if (prefix2 === "11" || prefix2 === "10") {
    return { name: "Halifax / Bank of Scotland", code: "HLFX" };
  } else if (prefix2 === "40") {
    return { name: "HSBC Bank plc", code: "MIDL" };
  } else if (prefix2 === "20" || prefix2 === "23") {
    return { name: "Barclays Bank", code: "BARC" };
  } else if (prefix2 === "30" || prefix2 === "77") {
    return { name: "Lloyds Bank", code: "LOYD" };
  } else if (prefix2 === "56" || prefix2 === "60" || prefix2 === "50") {
    return { name: "NatWest (National Westminster)", code: "NWBK" };
  } else if (prefix2 === "16" || prefix2 === "17" || prefix2 === "18") {
    return { name: "Royal Bank of Scotland (RBS)", code: "RBOS" };
  } else if (prefix2 === "08" || prefix2 === "09") {
    if (prefix3 === "084" || prefix3 === "085" || prefix3 === "086") {
      return { name: "Co-Operative Bank plc", code: "CPBK" };
    }
    return { name: "Santander UK / Co-Op", code: "ABBY" };
  } else if (prefix2 === "07") {
    return { name: "Nationwide Building Society", code: "NAVI" };
  } else if (prefix2 === "87") {
    return { name: "TSB Bank", code: "TSBS" };
  } else if (prefix2 === "82" || prefix2 === "80") {
    return { name: "Clydesdale Bank / Yorkshire Bank", code: "CLYD" };
  } else if (prefix2 === "93") {
    return { name: "ClearBank", code: "CLBK" };
  }

  return { name: "UK Clearing Bank", code: "HLFX" };
}

export type PositionLetter =
  | "u" | "v" | "w" | "x" | "y" | "z"
  | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export class BankAccount {
  public sortCode: string;
  public accountNumber: string;

  constructor(sortCode: string, accountNumber: string) {
    let cleanAcc = String(accountNumber).replace(/-/g, "").replace(/\s/g, "").trim();
    let cleanSc = String(sortCode).replace(/-/g, "").replace(/\s/g, "").trim();

    if (cleanSc.length !== 6 || !/^\d{6}$/.test(cleanSc)) {
      throw new Error("Expected a 6 digits sort code");
    }
    if (cleanAcc.length < 6 || cleanAcc.length > 10 || !/^\d+$/.test(cleanAcc)) {
      throw new Error("Account number must be between 6 and 10 digits");
    }

    // 10 digits special cases: Co-Operative Bank
    if (cleanAcc.length === 10) {
      const coopPrefixes = ["084", "085", "086"];
      if (coopPrefixes.some((p) => cleanSc.startsWith(p))) {
        cleanAcc = cleanAcc.substring(0, 8);
      } else {
        cleanAcc = cleanAcc.slice(-8);
      }
    } else if (cleanAcc.length === 9) {
      // Santander 9 digits
      cleanSc = cleanSc.substring(0, 5) + cleanAcc[0];
      cleanAcc = cleanAcc.substring(1);
    } else if (cleanAcc.length <= 7) {
      cleanAcc = cleanAcc.padStart(8, "0");
    }

    this.sortCode = cleanSc;
    this.accountNumber = cleanAcc;
  }

  public digits(): number[] {
    return (this.sortCode + this.accountNumber).split("").map((c) => parseInt(c, 10));
  }

  public numberAtPosition(letter: PositionLetter): number {
    const map: Record<PositionLetter, number> = {
      u: 0, v: 1, w: 2, x: 3, y: 4, z: 5,
      a: 6, b: 7, c: 8, d: 9, e: 10, f: 11, g: 12, h: 13,
    };
    return this.digits()[map[letter]];
  }
}

export interface SortCodeDataNode {
  start: number;
  end: number;
  algo: ModulusAlgorithm;
  weights: number[];
  exceptionVal: number;
  lineNum: number;
  next?: SortCodeDataNode;
}

export interface ValidationTrace {
  algorithm: ModulusAlgorithm | "NONE";
  weights: number[];
  remainder: number;
  expectedRemainder: number;
  exceptionId: number;
}

export interface IbanDetails {
  iban: string;
  formattedIban: string;
  checkDigits: string;
  bban: string;
  countryCode: string;
  bankCode: string;
  sortCode: string;
  accountNumber: string;
}

export interface ReconstructedCandidate {
  sortCode: string;
  accountNumber: string;
  bank: string;
  bankCode: string;
  iban: string;
  formattedIban: string;
  checkDigits: string;
}

export interface SolveResult {
  sortCode: string;
  accountNumber: string;
  totalCombinationsTested: number;
  totalCandidates: number;
  candidates: ReconstructedCandidate[];
  trace?: ValidationTrace | null;
  elapsedMs: number;
}

export class ModulusCheckerEngine {
  private weightsMap: Map<string, SortCodeDataNode> = new Map();
  private substitutions: Record<string, string> = SORT_CODE_SUBSTITUTIONS;

  constructor() {
    this.loadWeights(VOCALINK_WEIGHTS);
  }

  private loadWeights(entries: ModulusWeightEntry[]) {
    entries.forEach((entry, lineIdx) => {
      const [start, end, algo, weights, exc] = entry;
      const lineNum = lineIdx + 1;

      for (let scInt = start; scInt <= end; scInt++) {
        const scStr = String(scInt).padStart(6, "0");
        const node: SortCodeDataNode = {
          start,
          end,
          algo,
          weights: [...weights],
          exceptionVal: exc,
          lineNum,
        };

        const existing = this.weightsMap.get(scStr);
        if (!existing) {
          this.weightsMap.set(scStr, node);
        } else {
          if (existing.lineNum < lineNum) {
            existing.next = node;
          } else {
            node.next = existing;
            this.weightsMap.set(scStr, node);
          }
        }
      }
    });
  }

  private static addDigits(n: number): number {
    return (n % 10) + Math.floor(n / 10);
  }

  public static dblal(b: BankAccount, weights: number[], initialSum = 0): number {
    const digs = b.digits();
    let s = initialSum;
    for (let i = 0; i < digs.length; i++) {
      s += ModulusCheckerEngine.addDigits(digs[i] * (weights[i] || 0));
    }
    return s % 10;
  }

  public static mod(b: BankAccount, weights: number[], modulus: number): number {
    const digs = b.digits();
    let s = 0;
    for (let i = 0; i < digs.length; i++) {
      s += digs[i] * (weights[i] || 0);
    }
    return s % modulus;
  }

  public remainderFromRegularCheck(
    b: BankAccount,
    scData: SortCodeDataNode,
    weightsOverride?: number[]
  ): number {
    const w = weightsOverride || scData.weights;
    if (scData.algo === "DBLAL") {
      return ModulusCheckerEngine.dblal(b, w, 0);
    } else if (scData.algo === "MOD11") {
      return ModulusCheckerEngine.mod(b, w, 11);
    } else if (scData.algo === "MOD10") {
      return ModulusCheckerEngine.mod(b, w, 10);
    }
    throw new Error(`Unknown algorithm: ${scData.algo}`);
  }

  private getWeightsException2Or9(b: BankAccount, scData: SortCodeDataNode): number[] {
    const a = b.numberAtPosition("a");
    const g = b.numberAtPosition("g");
    if (a !== 0 && g !== 9) {
      return [0, 0, 1, 2, 5, 3, 6, 4, 8, 7, 10, 9, 3, 1];
    } else if (a !== 0 && g === 9) {
      return [0, 0, 0, 0, 0, 0, 0, 0, 8, 7, 10, 9, 3, 1];
    }
    return scData.weights;
  }

  private checkForSortCodeData(
    b: BankAccount,
    scData: SortCodeDataNode,
    attempt: number
  ): boolean {
    if (scData.exceptionVal !== 0) {
      const exc = scData.exceptionVal;
      if (exc === 1) {
        return ModulusCheckerEngine.dblal(b, scData.weights, 27) === 0;
      } else if (exc === 2) {
        const w = this.getWeightsException2Or9(b, scData);
        return this.remainderFromRegularCheck(b, scData, w) === 0;
      } else if (exc === 4) {
        const g = b.numberAtPosition("g");
        const h = b.numberAtPosition("h");
        const checkDigit = g * 10 + h;
        return this.remainderFromRegularCheck(b, scData) === checkDigit;
      } else if (exc === 5) {
        const subSc = this.substitutions[b.sortCode] || b.sortCode;
        const targetB = new BankAccount(subSc, b.accountNumber);
        if (attempt === 1) {
          const checkDigit = targetB.numberAtPosition("g");
          const rem = this.remainderFromRegularCheck(targetB, scData);
          if (rem === 0 && checkDigit === 0) return true;
          if (rem === 1) return false;
          return 11 - rem === checkDigit;
        } else {
          const checkDigit = targetB.numberAtPosition("h");
          const rem = this.remainderFromRegularCheck(targetB, scData);
          if (rem === 0 && checkDigit === 0) return true;
          return 10 - rem === checkDigit;
        }
      } else if (exc === 6) {
        const a = b.numberAtPosition("a");
        const g = b.numberAtPosition("g");
        const h = b.numberAtPosition("h");
        if (a >= 4 && a <= 8 && g === h) {
          return true;
        }
        return this.remainderFromRegularCheck(b, scData) === 0;
      } else if (exc === 7) {
        if (b.numberAtPosition("g") === 9) {
          const w = [0, 0, 0, 0, 0, 0, 0, 0, ...scData.weights.slice(8)];
          return this.remainderFromRegularCheck(b, scData, w) === 0;
        }
        return this.remainderFromRegularCheck(b, scData) === 0;
      } else if (exc === 8) {
        const targetB = new BankAccount("090126", b.accountNumber);
        return this.remainderFromRegularCheck(targetB, scData) === 0;
      } else if (exc === 9) {
        const w = this.getWeightsException2Or9(b, scData);
        if (this.remainderFromRegularCheck(b, scData, w) === 0) {
          return true;
        }
        const targetB = new BankAccount("309634", b.accountNumber);
        const targetSc = this.weightsMap.get("309634");
        if (!targetSc) return false;
        return this.remainderFromRegularCheck(targetB, targetSc) === 0;
      } else if (exc === 10) {
        const a = b.numberAtPosition("a");
        const bDig = b.numberAtPosition("b");
        const g = b.numberAtPosition("g");
        if ((a === 0 || a === 9) && bDig === 9 && g === 9) {
          const w = [0, 0, 0, 0, 0, 0, 0, 0, ...scData.weights.slice(8)];
          return this.remainderFromRegularCheck(b, scData, w) === 0;
        }
        return this.remainderFromRegularCheck(b, scData) === 0;
      } else if (exc === 14 && attempt === 2) {
        const h = b.numberAtPosition("h");
        if (h >= 2 && h <= 8) {
          return false;
        }
        const modAcc = "0" + b.accountNumber.slice(0, 7);
        const targetB = new BankAccount(b.sortCode, modAcc);
        return this.remainderFromRegularCheck(targetB, scData) === 0;
      }
    }

    return this.remainderFromRegularCheck(b, scData) === 0;
  }

  private followsExceptions(node: SortCodeDataNode, ...vals: number[]): boolean {
    return vals.includes(node.exceptionVal) || Boolean(node.next && vals.includes(node.next.exceptionVal));
  }

  public isValid(b: BankAccount): boolean {
    const scData = this.weightsMap.get(b.sortCode);
    if (!scData) {
      return true; // If not in table, modulus checking is not applicable per Vocalink specification
    }

    const firstCheck = this.checkForSortCodeData(b, scData, 1);

    const c = b.numberAtPosition("c");
    const hasNextAnd3 = Boolean(scData.next && scData.next.exceptionVal === 3);
    if ((scData.exceptionVal === 3 || hasNextAnd3) && (c === 6 || c === 9)) {
      return firstCheck;
    }

    if (this.followsExceptions(scData, 2, 9)) {
      if (firstCheck) return true;
    }

    if (scData.exceptionVal === 14) {
      if (firstCheck) return true;
      return this.checkForSortCodeData(b, scData, 2);
    }

    let secondCheck = true;
    if (scData.next) {
      secondCheck = this.checkForSortCodeData(b, scData.next, 2);
    }

    if (
      this.followsExceptions(scData, 2, 9) ||
      this.followsExceptions(scData, 10, 11) ||
      this.followsExceptions(scData, 12, 13)
    ) {
      return firstCheck || secondCheck;
    }

    return firstCheck && secondCheck;
  }

  public getValidationTrace(b: BankAccount): ValidationTrace {
    const scData = this.weightsMap.get(b.sortCode);
    if (!scData) {
      return {
        algorithm: "NONE",
        weights: [],
        remainder: 0,
        expectedRemainder: 0,
        exceptionId: 0,
      };
    }

    const rem = this.remainderFromRegularCheck(b, scData);
    let expectedRemainder = 0;
    if (scData.exceptionVal === 4) {
      expectedRemainder = b.numberAtPosition("g") * 10 + b.numberAtPosition("h");
    }

    return {
      algorithm: scData.algo,
      weights: scData.weights,
      remainder: rem,
      expectedRemainder,
      exceptionId: scData.exceptionVal,
    };
  }
}

// Singleton Engine instance
export const modulusEngine = new ModulusCheckerEngine();

/**
 * Calculates official UK IBAN from Sort Code and Account Number
 * Format: GB + 2 check digits + 4-char Bank Code + 6-digit Sort Code + 8-digit Account Number
 */
export function calculateIban(
  sortCode: string,
  accountNumber: string,
  bankCode = "HLFX",
  countryCode = "GB"
): IbanDetails {
  const cleanAcc = String(accountNumber).replace(/\D/g, "").padStart(8, "0");
  const cleanSc = String(sortCode).replace(/\D/g, "").padStart(6, "0");
  const bban = `${bankCode.toUpperCase()}${cleanSc}${cleanAcc}`;
  const tempStr = `${bban}${countryCode.toUpperCase()}00`;

  let numericStr = "";
  for (let i = 0; i < tempStr.length; i++) {
    const ch = tempStr[i];
    if (/[A-Za-z]/.test(ch)) {
      numericStr += String(ch.toUpperCase().charCodeAt(0) - 65 + 10);
    } else {
      numericStr += ch;
    }
  }

  // Modulo 97 on large numeric string
  let remainder = 0;
  for (let i = 0; i < numericStr.length; i++) {
    remainder = (remainder * 10 + parseInt(numericStr[i], 10)) % 97;
  }

  const checkVal = 98 - remainder;
  const checkDigits = String(checkVal).padStart(2, "0");
  const iban = `${countryCode.toUpperCase()}${checkDigits}${bban}`;

  // Formatted with 4-character blocks
  const formattedIban = iban.match(/.{1,4}/g)?.join(" ") || iban;

  return {
    iban,
    formattedIban,
    checkDigits,
    bban,
    countryCode: countryCode.toUpperCase(),
    bankCode: bankCode.toUpperCase(),
    sortCode: cleanSc,
    accountNumber: cleanAcc,
  };
}

/**
 * Solve / Reconstruct missing digits in Sort Code and Account Number
 * Supports wildcards: ?, *, X, x, _
 */
export function solveMissingDigits(
  scMask: string,
  accMask: string,
  targetIbanCheck?: string | null,
  bankCodeOverride?: string | null,
  maxResults = 500
): SolveResult {
  const startTime = performance.now();
  const cleanScMask = scMask.trim();
  const cleanAccMask = accMask.trim();

  const scMissingIndices: number[] = [];
  for (let i = 0; i < cleanScMask.length; i++) {
    if (/[?*Xx_]/.test(cleanScMask[i])) scMissingIndices.push(i);
  }

  const accMissingIndices: number[] = [];
  for (let i = 0; i < cleanAccMask.length; i++) {
    if (/[?*Xx_]/.test(cleanAccMask[i])) accMissingIndices.push(i);
  }

  if (scMissingIndices.length > 3) {
    throw new Error("Maximum 3 missing digits allowed in sort code");
  }
  if (accMissingIndices.length > 4) {
    throw new Error("Maximum 4 missing digits allowed in account number");
  }

  // Generate Sort Code permutations
  const scCandidates: string[] = [];
  const generateCombos = (indices: number[], mask: string, out: string[]) => {
    const total = Math.pow(10, indices.length);
    for (let c = 0; c < total; c++) {
      const chars = mask.split("");
      let val = c;
      for (let j = indices.length - 1; j >= 0; j--) {
        const digit = val % 10;
        chars[indices[j]] = String(digit);
        val = Math.floor(val / 10);
      }
      out.push(chars.join(""));
    }
  };

  generateCombos(scMissingIndices, cleanScMask, scCandidates);

  const accCandidates: string[] = [];
  generateCombos(accMissingIndices, cleanAccMask, accCandidates);

  const totalCombinationsTested = scCandidates.length * accCandidates.length;
  const validCandidates: ReconstructedCandidate[] = [];

  for (const sc of scCandidates) {
    const defaultBank = lookupBankInfo(sc);
    const bCode = bankCodeOverride && bankCodeOverride !== "AUTO" ? bankCodeOverride : defaultBank.code;

    for (const acc of accCandidates) {
      try {
        const b = new BankAccount(sc, acc);
        if (modulusEngine.isValid(b)) {
          const ibanInfo = calculateIban(b.sortCode, b.accountNumber, bCode);
          if (
            !targetIbanCheck ||
            ibanInfo.checkDigits === String(targetIbanCheck).padStart(2, "0")
          ) {
            validCandidates.push({
              sortCode: b.sortCode,
              accountNumber: b.accountNumber,
              bank: defaultBank.name,
              bankCode: bCode,
              iban: ibanInfo.iban,
              formattedIban: ibanInfo.formattedIban,
              checkDigits: ibanInfo.checkDigits,
            });

            if (validCandidates.length >= maxResults) break;
          }
        }
      } catch {
        // Skip invalid formats
      }
    }
    if (validCandidates.length >= maxResults) break;
  }

  let trace: ValidationTrace | null = null;
  if (validCandidates.length === 1) {
    try {
      const singleB = new BankAccount(validCandidates[0].sortCode, validCandidates[0].accountNumber);
      trace = modulusEngine.getValidationTrace(singleB);
    } catch {
      // ignore
    }
  }

  const elapsedMs = Math.round(performance.now() - startTime);

  return {
    sortCode: cleanScMask,
    accountNumber: cleanAccMask,
    totalCombinationsTested,
    totalCandidates: validCandidates.length,
    candidates: validCandidates,
    trace,
    elapsedMs,
  };
}
