import { OfferConfig } from "../types";

export const initialOfferConfig: OfferConfig = {
  campaignName: "UK Telecom — 30% Bill Reduction Campaign",
  enabled: true,
  offerName: "Up to 30% Monthly Bill Reduction",
  advisorName: "Peter",
  companyName: "[COMPANY NAME]",
  approvedAgentId: "[APPROVED ID]",
  maxDiscountPercent: 30,
  serviceUnchanged: true,
  contractUnchanged: true,
  equipmentUnchanged: true,
  paymentMethod: "DIRECT_DEBIT",
  authorisedText: {
    companyName: "[COMPANY NAME]",
    campaignReason:
      "There's been a reduction of up to 30% on your monthly bill, and we are checking whether your current telephone service qualifies for it.",
    dataSourceExplanation:
      "We contact registered telephone line users regarding authorized tariff reductions and bill savings.",
    verificationProcedure:
      "You can independently verify [COMPANY NAME] and our service before providing any details. Our agent reference is [APPROVED ID].",
    privacyNotice:
      "All information is checked strictly to verify the correct account and service eligibility. We never ask for unauthorized financial credentials.",
    closingLines:
      "Thank you for going through those details with me. I'll now explain the available reduction and any important terms before you decide whether you want to continue.",
  },
  scriptLock: true,
  scriptVersion: "1.0.0",
  dataRetentionDays: 90,
};
