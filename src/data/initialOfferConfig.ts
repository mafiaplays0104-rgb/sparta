import { OfferConfig } from "../types";

export const initialOfferConfig: OfferConfig = {
  campaignName: "Sparta Telecom — Copper-to-Fibre Digital Upgrade & Price Promise",
  enabled: true,
  offerName: "Sparta Telecom Digital Transition & 24-Month Price Promise Guarantee",
  advisorName: "Alex",
  companyName: "Sparta Telecom",
  approvedAgentId: "ST-8924",
  maxDiscountPercent: 30,
  serviceUnchanged: true,
  contractUnchanged: true,
  equipmentUnchanged: false,
  paymentMethod: "DIRECT_DEBIT",
  authorisedText: {
    companyName: "Sparta Telecom",
    campaignReason:
      "All across the UK the old copper network is being retired and replaced by new fibre lines. Sparta Telecom operates on the same Openreach network, upgrading customer telephone lines without physical property disruption, with a 24-month price promise guarantee.",
    dataSourceExplanation:
      "We contact UK landline holders regarding the nationwide copper network retirement at their local telephone exchange.",
    verificationProcedure:
      "A colleague takes a brief verbal confirmation of the customer's understanding of the switchover before arrangements and router dispatch.",
    privacyNotice:
      "Under Data Protection Act 1998 (DPA 1998), confidential banking details are never requested over the phone. A Direct Debit mandate form from the customer's bank is dispatched by post for manual completion.",
    closingLines:
      "Everything is completed from our side, and a colleague will take a 1-minute verbal confirmation so we can smoothly process the arrangements and router dispatch.",
  },
  scriptLock: true,
  scriptVersion: "3.0.0",
  dataRetentionDays: 90,
};
