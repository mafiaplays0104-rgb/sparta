import { OfferConfig } from "../types";

export const initialOfferConfig: OfferConfig = {
  campaignName: "SPARTA UK Landline Direct Debit Optimization 2026",
  enabled: true,
  offerName: "Sparta 500 Anytime Minutes Plan",
  minutes: 500,
  crossNetwork: true,
  anytime: true,
  dedicatedCustomerService: true,
  technicalVisit: true,
  writtenTerms: true,
  maxDiscountPercent: 30,
  serviceUnchanged: true,
  contractUnchanged: true,
  equipmentUnchanged: true,
  paymentMethod: "DIRECT_DEBIT",
  customerIdPrefix: "IBANGB",
  eligibilityRules: {
    minimumDob: "1943-01-01",
    maximumDob: "1960-12-31",
    minAge: 65,
    maxAge: 83,
  },
  authorisedText: {
    companyName: "Sparta Phone Services",
    campaignReason:
      "We are checking whether qualifying telephone customers can access the 500-minute capped rate and lower Direct Debit billing.",
    dataSourceExplanation:
      "Your details were provided under authorized UK business directories for telecom review. We do not share your information with third-party advertisers.",
    verificationProcedure:
      "You can independently verify Sparta through our official customer services portal or by checking our registered corporate identity.",
    privacyNotice:
      "All information collected is processed under UK GDPR standards strictly for eligibility assessment and contract fulfillment.",
    closingLines:
      "That's everything I needed from you today. I'll pass your details across to the relevant team. They'll be able to go through the available options with you and explain the service, pricing and terms. And you'll have the relevant information to look over before making any changes. Thank you very much for your time. Have a good day.",
  },
  scriptLock: true,
  scriptVersion: "1.0.0",
  dataRetentionDays: 90,
};
