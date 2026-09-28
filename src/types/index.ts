export type CallState =
  | "OPENING"
  | "BILL_RESPONSIBILITY"
  | "RAPPORT"
  | "SERVICE_DISCOVERY"
  | "ISSUE_CHECK"
  | "ISSUE_ESCALATION"
  | "BILL_DISCOVERY"
  | "OFFER_INTRO"
  | "OFFER_EXPLANATION"
  | "OFFER_INTEREST"
  | "ELIGIBILITY"
  | "CUSTOMER_DETAILS"
  | "PAYMENT_CONSENT"
  | "PAYMENT_DETAILS"
  | "ADDITIONAL_DETAILS"
  | "CONFUSION_MODE"
  | "OBJECTION"
  | "FINAL_REVIEW"
  | "CALLBACK"
  | "ESCALATION"
  | "END";

export type CustomerMood =
  | "COMFORTABLE"
  | "ELDERLY_SLOW"
  | "CONFUSED"
  | "SUSPICIOUS"
  | "IMPATIENT"
  | "TALKATIVE"
  | "VULNERABILITY_CONCERN";

export type LineVariant = "PRIMARY" | "SHORT" | "EXPLAIN";

export type ServiceType =
  | "PHONE_ONLY"
  | "PHONE_INTERNET"
  | "PHONE_INTERNET_TV"
  | "OTHER"
  | "UNKNOWN";

export type IssueStatus =
  | "NONE"
  | "LANDLINE"
  | "INTERNET"
  | "BOTH"
  | "UNKNOWN";

export interface Customer {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  isEligibleAge?: boolean | null;
  address?: {
    houseNumber?: string;
    street?: string;
    town?: string;
    postcode?: string;
  };
  landline?: string;
  mobile?: {
    number?: string;
    type?: "PAYG" | "CONTRACT";
    network?: string;
  };
  serviceType?: ServiceType;
  issueStatus?: IssueStatus;
  issueDescription?: string;
  lastBillAmount?: number;
  lastBillEstimated?: boolean;
  propertyStatus?: "OWNER" | "RENTER" | "UNKNOWN";
  medicalAlarm?: boolean;
  currentMonth?: string;
  equipment?: {
    type?: string;
    manufacturer?: string;
    model?: string;
  };
}

export type ConsentCategory =
  | "CALL"
  | "DOB"
  | "CUSTOMER_DETAILS"
  | "PAYMENT"
  | "TERMS";

export interface ConsentRecord {
  category: ConsentCategory;
  status: "PENDING" | "GRANTED" | "DECLINED";
  timestamp?: string;
}

export interface DirectDebitTempData {
  accountHolderName: string;
  sortCode: string;
  accountNumber: string;
  bankName?: string;
  iban?: string;
  isVerified?: boolean;
}

export interface OfferConfig {
  campaignName: string;
  enabled: boolean;
  maxDiscountPercent: number;
  serviceUnchanged: boolean;
  contractUnchanged: boolean;
  equipmentUnchanged: boolean;
  paymentMethod: "DIRECT_DEBIT";
  eligibilityRules: {
    minimumDob: string; // e.g. '1943-01-01'
    maximumDob: string; // e.g. '1960-12-31'
  };
  authorisedText: {
    offerDescription: string;
    paymentDescription: string;
    termsDescription: string;
    closingLines: string;
  };
  requiredFields: string[];
  optionalFields: string[];
  scriptVersion: string;
}

export interface SuggestedResponse {
  objective: string;
  sayLabel?: string;
  primary: string;
  short: string;
  explain: string;
  why: string;
  nextState: CallState;
  requiredData?: string[];
  stopConditions?: string[];
  escalationRecommended?: boolean;
  complianceWarning?: string;
  trainingTip?: string;
  allowedActions?: string[];
}

export interface ObjectionItem {
  id: string;
  category: string;
  triggerPhrases: string[];
  primary: string;
  short: string;
  explain: string;
  nextAction: string;
  stopCondition: string;
}

export type EndReason =
  | "COMPLETED"
  | "CUSTOMER_DECLINED"
  | "CALLBACK"
  | "ESCALATED"
  | "NOT_ELIGIBLE"
  | "CUSTOMER_CONFUSED"
  | "SERVICE_ISSUE"
  | "CUSTOMER_REQUESTED_END"
  | "OTHER";

export interface CallbackDetails {
  requested: boolean;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  advisorNotes: string;
}

export interface CallNotes {
  customerConcern: string;
  followUp: string;
  escalationReason: string;
  generalNotes: string;
}

export type CallMode = "PRODUCTION" | "QUICK" | "TRAINING";
