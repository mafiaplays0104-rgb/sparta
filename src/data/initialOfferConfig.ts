import { OfferConfig } from "../types";

export const initialOfferConfig: OfferConfig = {
  campaignName: "UK Telecom — Digital Fiber Landline & Broadband Upgrade",
  enabled: true,
  offerName: "Digital Landline & Fiber Broadband Bundle (£42.99 + 20% VAT = £51.58)",
  advisorName: "Peter",
  companyName: "[COMPANY NAME]",
  approvedAgentId: "[APPROVED ID]",
  maxDiscountPercent: 30,
  serviceUnchanged: true,
  contractUnchanged: true,
  equipmentUnchanged: false,
  paymentMethod: "DIRECT_DEBIT",
  authorisedText: {
    companyName: "[COMPANY NAME]",
    campaignReason:
      "The old copper wires are being retired, and lines are being upgraded to the new fiber digital network with bundled high-speed fiber broadband and unlimited UK calls at £42.99 plus 20% VAT (£51.58 total), locked for 2 years.",
    dataSourceExplanation:
      "We contact registered telephone line users regarding the national digital line upgrade and copper retirement schedule.",
    verificationProcedure:
      "Our senior verification officer confirms your new package price and address before sending your official confirmation letter and digital router.",
    privacyNotice:
      "All information is processed securely for account verification and digital router delivery. We never ask for card PINs or passwords.",
    closingLines:
      "To finalize everything, I will quickly connect you to our senior verification officer who will take just a minute to confirm your new package price and address before sending out your official confirmation letter and router.",
  },
  scriptLock: true,
  scriptVersion: "2.0.0",
  dataRetentionDays: 90,
};
