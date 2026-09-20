export type ResponseCategory =
  | 'POSITIVE'
  | 'NEGATIVE'
  | 'CONFUSED'
  | 'OBJECTION'
  | 'STOP';

export type CustomerMood = 'CALM' | 'UNCERTAIN' | 'CONCERNED' | 'FRUSTRATED';

export type RecoveryType =
  | 'OFF_TOPIC'
  | 'INTERRUPTED'
  | 'REPEAT'
  | 'CONFUSED'
  | 'SLOW_DOWN'
  | 'BUSY_BAD_TIME'
  | 'NOT_BILL_PAYER'
  | 'IS_SCAM'
  | 'HOW_GET_NUMBER';

export type HardStopDisposition =
  | 'DO_NOT_CALL'
  | 'CUSTOMER_DECLINED'
  | 'VULNERABILITY_CONCERN'
  | 'OTHER_COMPLIANCE_ISSUE'
  | 'NO_SALE_ESCALATED_SENIOR';

export type FinalDisposition =
  | 'SALE_DD_COLLECTED'
  | 'SALE_IBAN_COLLECTED'
  | 'SALE_CALLBACK_NEEDED'
  | 'NO_SALE_NOT_INTERESTED'
  | 'NO_SALE_COMPLIANCE_STOP'
  | 'NO_SALE_UNDER_AGE'
  | 'NO_SALE_ESCALATED_SENIOR';

export interface CallBranch {
  category: ResponseCategory;
  label: string;
  buttonDescription: string;
  customerExample?: string;
  whyThisResponse?: string;
  acknowledgement?: string;
  response: string;
  bridge?: string;
  nextStage: string | null;
  hardStop?: boolean;
  sayThis?: string;
}

export interface StageRebuttal {
  step: number;
  label: string;
  text: string;
  actionText?: string;
}

export interface SubStep {
  id: string;
  key: 'name' | 'address' | 'medical_alarm' | 'television' | 'mobile';
  title: string;
  script: string;
  isSensitive?: boolean;
  sensitivityReminder?: string;
  branches: Record<ResponseCategory, CallBranch>;
}

export interface CallStage {
  id: string;
  stepNumber: number;
  stageNumber?: number;
  title: string;
  internalLabel?: string;
  script: string;
  sayThisSoftened?: string;
  rebuttals?: StageRebuttal[];
  isDataProtectionFrame?: boolean;
  hasStatementProp?: boolean;
  categoryRationale?: string;
  isSensitive?: boolean;
  sensitivityReminder?: string;
  complianceWarning?: string;
  factuallySupportedRequirement?: string;
  subSteps?: SubStep[];
  branches: Record<ResponseCategory, CallBranch>;
}

export interface AdminConfig {
  agentName: string;
  companyName: string;
  offerPercentage: number;
  deliveryWording: 'DOCUMENT' | 'LETTER';
  directDebitVerified: boolean;
  consumerIdIsIban: boolean;
  vulnerabilityEscalationNote: string;
}

export interface CallHistoryEntry {
  stageId: string;
  subStepIndex: number;
  selectedCategory: ResponseCategory | null;
  sayThisText: string;
  activeRecovery: RecoveryType | null;
  activeRebuttal: { step: number; text: string; label: string } | null;
  isSoftened: boolean;
  isStatementInHand: boolean;
  verifiedFields: Record<string, boolean>;
  rebuttalCallerStageId?: string | null;
}

export interface NoteItem {
  id: string;
  timestamp: string;
  text: string;
  stageId: string;
}

export interface QuickObjection {
  id: string;
  trigger: string;
  stageRelevant?: string;
  acknowledgement: string;
  shortAnswer: string;
  bridgeBack: string;
  tags: string[];
}

export interface RecoveryAction {
  type: RecoveryType;
  label: string;
  acknowledgement: string;
  response: string;
  actionText: string;
  sayThis?: string;
}
