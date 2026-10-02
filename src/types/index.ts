export type MasterStage =
  | "STAGE_1_OPENING"
  | "STAGE_2_VERIFICATION_ID"
  | "STAGE_3_VERIFICATION_COMPLETED"
  | "STAGE_4_CURRENT_SERVICE"
  | "STAGE_5_CURRENT_BILL"
  | "STAGE_6_EXPLAINING_REDUCTION"
  | "STAGE_7_FINAL_CONFIRMATION"
  | "STAGE_8_BEFORE_AGREEMENT"
  | "STAGE_9_CUSTOMER_DECISION"
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

export type HomeServiceStatus = "YES" | "NO" | "DONT_KNOW" | "UNCONFIRMED";
export type CustomerIdStatus = "PENDING" | "VERIFIED" | "NOT_AVAILABLE" | "REFUSED" | "INVALID";
export type LandlineUsage = "LOW" | "MODERATE" | "HIGH" | "INCOMING_ONLY" | "UNSURE";
export type MobileType = "PAYG" | "CONTRACT" | "UNKNOWN";

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
  
  // Consumer Identification Number (Section 7)
  consumerId?: string;
  customerId?: string; // alias/backward compat
  consumerIdStatus?: CustomerIdStatus;
  customerIdStatus?: CustomerIdStatus;
  consumerIdRefused?: boolean;
  consumerIdUnavailable?: boolean;

  // Current Service (Section 9)
  isUsingAtHome?: HomeServiceStatus;
  
  // Current Monthly Bill (Section 10)
  monthlyBill?: number;
  billApproximate?: boolean;
  billSatisfaction?: string;

  // Decision & Agreement (Sections 45-49)
  termsUnderstood?: boolean;
  finalConfirmationGiven?: boolean;
  customerDecision?: "YES" | "NO" | "THINK_ABOUT_IT" | "CALL_BACK" | "UNDECIDED";

  // Optional DOB & Equipment fields if customer shares
  dob?: string;
  birthYear?: number;
  calculatedAge?: number;
  isEligibleAge?: boolean | null;
  dobRefused?: boolean;
  hasMobile?: boolean;
  mobileNumber?: string;
  mobileType?: MobileType;
  mobileNetwork?: string;
  medicalAlarm?: boolean;
  hasTvService?: boolean;
  tvMakeModel?: string;
  addressConfirmed?: boolean;
  landlineUsage?: LandlineUsage;
  billIncludesPhone?: boolean;
  billIncludesBroadband?: boolean;
  billIncludesTv?: boolean;
  issuesRecently?: string;
  personalDetailsConfirmed?: boolean;
}

export interface OfferConfig {
  campaignName: string;
  enabled: boolean;
  offerName: string;
  advisorName: string;
  companyName: string;
  approvedAgentId: string;
  maxDiscountPercent: number;
  serviceUnchanged: boolean;
  contractUnchanged: boolean;
  equipmentUnchanged: boolean;
  paymentMethod: "DIRECT_DEBIT";
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
  eligibilityRules?: {
    minimumDob?: string;
    maximumDob?: string;
    minAge?: number;
    maxAge?: number;
  };
  minutes?: number;
  crossNetwork?: boolean;
  anytime?: boolean;
  dedicatedCustomerService?: boolean;
  technicalVisit?: boolean;
  writtenTerms?: boolean;
}

export interface ObjectionItem {
  id: string;
  sectionNumber: number;
  category: string;
  name: string;
  triggers: string[];
  intent: string;
  recommendedResponse: string;
  optionalFollowUp?: string;
  escalationCondition?: string;
  stopCondition?: string;
  scriptStage?: MasterStage | "ALL";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  allowContinue: boolean;
  sensitiveInfoInvolved: boolean;
  action: "continue" | "pause_or_schedule" | "stop_collection" | "escalate" | "de_escalate" | "disposition";
}

export interface CustomerQuestionItem {
  id: string;
  sectionNumber?: number;
  questionKeywords: string[];
  customerAsk: string;
  approvedAnswer: string;
  notes?: string;
  category: "IDENTITY" | "OFFER" | "TECHNICAL" | "DATA_PRIVACY" | "BILLING" | "COMPANY" | "COMPLIANCE";
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
