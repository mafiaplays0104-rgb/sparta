import { OfferConfig } from "../types";

export const initialOfferConfig: OfferConfig = {
  campaignName: "UK Landline Direct Debit Optimization 2026",
  enabled: true,
  maxDiscountPercent: 30,
  serviceUnchanged: true,
  contractUnchanged: true,
  equipmentUnchanged: true,
  paymentMethod: "DIRECT_DEBIT",
  eligibilityRules: {
    minimumDob: "1943-01-01",
    maximumDob: "1960-12-31",
  },
  authorisedText: {
    offerDescription:
      "There's currently an offer available of up to 30% off, depending on the package and eligibility. Your existing service, contract and equipment remain the same; the reduction applies directly to the Direct Debit payment rate.",
    paymentDescription:
      "The reason we're asking about the Direct Debit is to verify the payment method associated with the existing service and, where applicable, apply the authorised reduced rate. We never ask for card numbers, PINs, or online banking passwords.",
    termsDescription:
      "Any applicable terms must be sent and reviewed before final agreement. The existing telephone service continues seamlessly without interruption.",
    closingLines:
      "Thank you very much for your time today. Everything we've discussed will follow the applicable process, and you should have the relevant information and terms to review. Have a lovely day.",
  },
  requiredFields: [
    "firstName",
    "lastName",
    "dateOfBirth",
    "houseNumber",
    "street",
    "town",
    "postcode",
    "sortCode",
    "accountNumber",
  ],
  optionalFields: [
    "mobileNumber",
    "mobileNetwork",
    "propertyStatus",
    "currentMonth",
    "equipmentModel",
  ],
  scriptVersion: "v2.0.0",
};
