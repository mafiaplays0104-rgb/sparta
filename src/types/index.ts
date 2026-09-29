export type MasterStage =
  | "STAGE_1_OPENING"
  | "STAGE_2_CURRENT_SERVICE"
  | "STAGE_3_OFFER_INTRO"
  | "STAGE_4_DOB_VALIDATION"
  | "STAGE_5_CONFIRM_ADDRESS"
  | "STAGE_6_DIRECT_DEBIT_ID"
  | "STAGE_7_PERSONAL_DETAILS"
  | "STAGE_8_MOBILE_DETAILS"
  | "STAGE_9_FINAL_QUESTIONS"
  | "STAGE_10_FINAL_CHECK"
  | "STAGE_11_NATURAL_CLOSE"
  | "CALL_COMPLETED"
  | "CALL_DISPOSITIONED";

export type CallState = MasterStage;

export type CustomerSentiment =
  | "CALM"
  | "FRIENDLY"
  | "CONFUSED"
  | "HESITANT"
  | "BUSY"
  | "UPSET"
  | "SUSPICIOUS"
  | "REFUSING";

export type ResponseCategory =
  | "NORMAL"
  | "POSITIVE"
  | "CONFUSED"
  | "NEEDS_TIME"
  | "DOESNT_REMEMBER"
  | "SUSPICIOUS"
  | "REFUSAL"
  | "BUSY"
  | "WRONG_PERSON"
  | "DO_NOT_CALL";

export type LandlineUsage = "LOW" | "MODERATE" | "HIGH" | "INCOMING_ONLY" | "UNSURE";
export type BillSatisfaction = "HAPPY" | "PAYING_ABOUT_RIGHT" | "PAYING_TOO_MUCH" | "UNSURE";
export type MobileType = "PAYG" | "CONTRACT" | "UNKNOWN";
export type CustomerIdStatus = "PENDING" | "VERIFIED" | "NOT_AVAILABLE" | "REFUSED" | "INVALID";

export interface CustomerRecord {
  // Identity & Contact
  title?: string;
  firstName?: string;
  lastName?: string;
  doorNumber?: string;
  street?: string;
  address?: string;
  postcode?: string;
  contactNumber?: string;
  
  // DOB & Age
  dob?: string;
  birthYear?: number;
  calculatedAge?: number;
  isEligibleAge?: boolean | null;
  dobRefused?: boolean;

  // Identification / Direct Debit Match
  customerId?: string;
  customerIdStatus?: CustomerIdStatus;
  customerIdRefused?: boolean;
  customerIdUnavailable?: boolean;

  // Mobile
  hasMobile?: boolean;
  mobileNumber?: string;
  mobileType?: MobileType;
  mobileNetwork?: string;

  // Services
  landlineUsage?: LandlineUsage;
  billSatisfaction?: BillSatisfaction;
  monthlyBill?: number;
  billApproximate?: boolean;
  billIncludesPhone?: boolean;
  billIncludesBroadband?: boolean;
  billIncludesTv?: boolean;
  issuesRecently?: string;

  // Equipment & Safety
  medicalAlarm?: boolean;
  hasTvService?: boolean;
  tvMakeModel?: string;

  // Address confirmed flag
  addressConfirmed?: boolean;
  personalDetailsConfirmed?: boolean;
}

export interface OfferConfig {
  campaignName: string;
  enabled: boolean;
  offerName: string;
  minutes: number;
  crossNetwork: boolean;
  anytime: boolean;
  dedicatedCustomerService: boolean;
  technicalVisit: boolean;
  writtenTerms: boolean;
  maxDiscountPercent: number;
  serviceUnchanged: boolean;
  contractUnchanged: boolean;
  equipmentUnchanged: boolean;
  paymentMethod: "DIRECT_DEBIT";
  customerIdPrefix: string; // e.g. "IBANGB"
  eligibilityRules: {
    minimumDob: string; // e.g. '1943-01-01'
    maximumDob: string; // e.g. '1960-12-31'
    minAge?: number;
    maxAge?: number;
  };
  authorisedText: {
    companyName: string;
    campaignReason: string;
    dataSourceExplanation: string;
    verificationProcedure: string;
    privacyNotice: string;
    closingLines: string;
  };
  scriptLock: boolean;
  scriptVersion: string;
  dataRetentionDays: number;
}

export interface ObjectionItem {
  id: string;
  category: string;
  name: string;
  triggers: string[];
  intent: string;
  recommendedResponse: string;
  optionalFollowUp?: string;
  escalationCondition?: string;
  stopCondition: string;
  scriptStage?: MasterStage | "ALL";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  allowContinue: boolean;
  sensitiveInfoInvolved: boolean;
  action: "continue" | "pause_or_schedule" | "stop_collection" | "escalate" | "de_escalate" | "disposition";
}

export interface CustomerQuestionItem {
  id: string;
  questionKeywords: string[];
  customerAsk: string;
  approvedAnswer: string;
  notes?: string;
  category: "ELIGIBILITY" | "IDENTITY" | "TECHNICAL" | "DATA_PRIVACY" | "BILLING" | "COMPANY";
}

export type CallDisposition =
  | "LEAD_COMPLETED"
  | "CUSTOMER_NOT_INTERESTED"
  | "CUSTOMER_BUSY"
  | "CALL_BACK_REQUESTED"
  | "SECURITY_CONCERN"
  | "INFORMATION_NOT_AVAILABLE"
  | "CUSTOMER_REFUSED_VERIFICATION"
  | "INVALID_INFORMATION"
  | "WRONG_PERSON"
  | "WRONG_NUMBER"
  | "DO_NOT_CALL"
  | "TECHNICAL_ISSUE"
  | "ESCALATED"
  | "SYSTEM_ERROR";

export interface CallbackDetails {
  requested: boolean;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  reason: string;
  advisorNotes?: string;
}

export interface CallAuditLog {
  agent_id: string;
  call_id: string;
  script_version: string;
  campaign_version: string;
  timestamp: string;
  stage: MasterStage;
  disposition?: CallDisposition;
  validation_events: string[];
  objection_category?: string;
  handoff_status: "PENDING" | "COMPLETED" | "ESCALATED" | "TERMINATED";
}

export interface AnalyticsData {
  totalCalls: number;
  completedLeads: number;
  incompleteLeads: number;
  customerRefusals: number;
  securityConcerns: number;
  callbacks: number;
  averageCallDurationSec: number;
  averageStageDurationSec: Record<MasterStage, number>;
  stageDropOffs: Record<MasterStage, number>;
  commonObjections: Record<string, number>;
  commonQuestions: Record<string, number>;
  verificationFailures: number;
  missingInformationCount: number;
  dispositionBreakdown: Record<CallDisposition, number>;
}

export interface BillSavingsCalculation {
  originalBill: number;
  discountPercent: number;
  discountedPrice: number;
  monthlySavings: number;
  annualSavings: number;
  formattedOriginal: string;
  formattedDiscounted: string;
  formattedMonthlySavings: string;
  formattedAnnualSavings: string;
  speechSnippet: string;
}

export interface DobAgeCalculation {
  inputMode: "AGE" | "YEAR" | "EXACT_DOB";
  age?: number;
  birthYear?: number;
  exactDob?: string;
  isEligible: boolean;
  eligibilityMessage: string;
  formattedDisplay: string;
}

export type CallMode = "PRODUCTION" | "QUICK" | "TRAINING";
