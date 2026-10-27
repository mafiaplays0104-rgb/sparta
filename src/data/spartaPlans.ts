export type SpartaPlanCategory =
  | "LANDLINE_ONLY"
  | "NORMAL_BROADBAND"
  | "FIBRE_BROADBAND";

export interface SpartaPlan {
  id: string;
  name: string;
  category: SpartaPlanCategory;
  categoryLabel: string;
  basePrice: number;
  vatRate: number;
  vatAmount: number;
  grossPrice: number;
  displayBase: string;
  displayGross: string;
  minutes: string;
  broadbandSpeed: string;
  freeEngineerVisit: boolean;
  description: string;
  tag?: string;
  targetUsage: {
    callVolume: ("LOW" | "HIGH" | "ANY")[];
    broadbandNeeds: "NONE" | "NORMAL" | "FIBRE";
  };
}

export const SPARTA_PLANS: SpartaPlan[] = [
  // 1. Sparta Line Only: £19.99 + VAT (approx. £23.99/mo) | No Free Calls
  {
    id: "sparta_line_only",
    name: "Sparta Line Only",
    category: "LANDLINE_ONLY",
    categoryLabel: "Landline Only",
    basePrice: 19.99,
    vatRate: 20,
    vatAmount: 4.00,
    grossPrice: 23.99,
    displayBase: "£19.99 + VAT",
    displayGross: "£23.99/mo",
    minutes: "No Free Calls (Pay-As-You-Go)",
    broadbandSpeed: "None",
    freeEngineerVisit: false,
    description: "Ideal for low call users who hardly make any outbound calls and have no broadband.",
    tag: "Lowest Cost",
    targetUsage: {
      callVolume: ["LOW"],
      broadbandNeeds: "NONE",
    },
  },

  // 2. Enhanced Line Only / Line Only Plan with Minutes: £26.99 + VAT (approx. £32.39/mo) | 500 LL + 200 Mobile Mins
  {
    id: "sparta_enhanced_line_only",
    name: "Enhanced Line Only (Plan with Minutes)",
    category: "LANDLINE_ONLY",
    categoryLabel: "Landline Only",
    basePrice: 26.99,
    vatRate: 20,
    vatAmount: 5.40,
    grossPrice: 32.39,
    displayBase: "£26.99 + VAT",
    displayGross: "£32.39/mo",
    minutes: "500 Landline + 200 Mobile Mins",
    broadbandSpeed: "None",
    freeEngineerVisit: false,
    description: "Includes generous inclusive minutes for regular landline and mobile callers with no broadband.",
    tag: "Popular Landline",
    targetUsage: {
      callVolume: ["HIGH", "ANY"],
      broadbandNeeds: "NONE",
    },
  },

  // 3. Sparta Line Only + Normal Broadband: £26.99 + VAT (approx. £32.39/mo) | Up to 24Mbps, 500 LL Mins
  {
    id: "sparta_line_normal_bb",
    name: "Sparta Line Only + Normal Broadband",
    category: "NORMAL_BROADBAND",
    categoryLabel: "Normal Broadband (Up to 24Mbps)",
    basePrice: 26.99,
    vatRate: 20,
    vatAmount: 5.40,
    grossPrice: 32.39,
    displayBase: "£26.99 + VAT",
    displayGross: "£32.39/mo",
    minutes: "500 Landline Mins",
    broadbandSpeed: "Up to 24Mbps ADSL",
    freeEngineerVisit: false,
    description: "Standard broadband up to 24Mbps combined with 500 landline minutes.",
    tag: "Standard Broadband",
    targetUsage: {
      callVolume: ["LOW", "ANY"],
      broadbandNeeds: "NORMAL",
    },
  },

  // 4. Sparta Talk Unlimited + Normal BB: £31.99 + VAT (approx. £38.39/mo) | Up to 24Mbps, 1000 LL + 500 Mobile Mins
  {
    id: "sparta_talk_unlimited_normal_bb",
    name: "Sparta Talk Unlimited + Normal Broadband",
    category: "NORMAL_BROADBAND",
    categoryLabel: "Normal Broadband (Up to 24Mbps)",
    basePrice: 31.99,
    vatRate: 20,
    vatAmount: 6.40,
    grossPrice: 38.39,
    displayBase: "£31.99 + VAT",
    displayGross: "£38.39/mo",
    minutes: "1000 Landline + 500 Mobile Mins",
    broadbandSpeed: "Up to 24Mbps ADSL",
    freeEngineerVisit: false,
    description: "Unlimited peace-of-mind calling with normal broadband for everyday browsing.",
    tag: "Best Value Normal BB",
    targetUsage: {
      callVolume: ["HIGH"],
      broadbandNeeds: "NORMAL",
    },
  },

  // 5. Sparta Line Only + Fibre (Fibre 40): £29.99 + VAT (approx. £35.99/mo) | Fibre 40, No Free Calls
  {
    id: "sparta_line_fibre_40",
    name: "Sparta Line Only + Fibre (Fibre 40)",
    category: "FIBRE_BROADBAND",
    categoryLabel: "Fibre Broadband (Fibre 40 / 80)",
    basePrice: 29.99,
    vatRate: 20,
    vatAmount: 6.00,
    grossPrice: 35.99,
    displayBase: "£29.99 + VAT",
    displayGross: "£35.99/mo",
    minutes: "No Free Calls",
    broadbandSpeed: "Fibre 40 (40Mbps Superfast)",
    freeEngineerVisit: true,
    description: "Superfast 40Mbps fibre connection with pay-as-you-go landline calling.",
    tag: "Entry Fibre",
    targetUsage: {
      callVolume: ["LOW"],
      broadbandNeeds: "FIBRE",
    },
  },

  // 6. Sparta Talk + Fibre 40: £31.99 + VAT (approx. £38.39/mo) | Fibre 40, 500 LL Mins
  {
    id: "sparta_talk_fibre_40",
    name: "Sparta Talk + Fibre 40",
    category: "FIBRE_BROADBAND",
    categoryLabel: "Fibre Broadband (Fibre 40 / 80)",
    basePrice: 31.99,
    vatRate: 20,
    vatAmount: 6.40,
    grossPrice: 38.39,
    displayBase: "£31.99 + VAT",
    displayGross: "£38.39/mo",
    minutes: "500 Landline Mins",
    broadbandSpeed: "Fibre 40 (40Mbps Superfast)",
    freeEngineerVisit: true,
    description: "40Mbps Superfast fibre broadband paired with 500 UK landline minutes.",
    tag: "Recommended Fibre",
    targetUsage: {
      callVolume: ["LOW", "ANY"],
      broadbandNeeds: "FIBRE",
    },
  },

  // 7. Sparta Unlimited + F40 (Enhanced): £34.99 + VAT (approx. £41.99/mo) | Fibre 40, 500 LL + 200 Mobile Mins, Free Engineer Visit
  {
    id: "sparta_unlimited_f40_enhanced",
    name: "Sparta Unlimited + F40 (Enhanced)",
    category: "FIBRE_BROADBAND",
    categoryLabel: "Fibre Broadband (Fibre 40 / 80)",
    basePrice: 34.99,
    vatRate: 20,
    vatAmount: 7.00,
    grossPrice: 41.99,
    displayBase: "£34.99 + VAT",
    displayGross: "£41.99/mo",
    minutes: "500 Landline + 200 Mobile Mins",
    broadbandSpeed: "Fibre 40 (40Mbps Superfast)",
    freeEngineerVisit: true,
    description: "Enhanced fibre package with inclusive mobile and landline minutes, plus free certified engineer visit.",
    tag: "Best All-Rounder",
    targetUsage: {
      callVolume: ["HIGH", "ANY"],
      broadbandNeeds: "FIBRE",
    },
  },

  // 8. Sparta Talk Unlimited + Fibre 40: £39.99 + VAT (approx. £47.99/mo) | Fibre 40, 1000 LL + 500 Mobile Mins
  {
    id: "sparta_talk_unlimited_f40",
    name: "Sparta Talk Unlimited + Fibre 40",
    category: "FIBRE_BROADBAND",
    categoryLabel: "Fibre Broadband (Fibre 40 / 80)",
    basePrice: 39.99,
    vatRate: 20,
    vatAmount: 8.00,
    grossPrice: 47.99,
    displayBase: "£39.99 + VAT",
    displayGross: "£47.99/mo",
    minutes: "1000 Landline + 500 Mobile Mins",
    broadbandSpeed: "Fibre 40 (40Mbps Superfast)",
    freeEngineerVisit: true,
    description: "Massive talk bundle with 1,000 landline and 500 mobile minutes over 40Mbps fibre.",
    tag: "High Talk & Fibre",
    targetUsage: {
      callVolume: ["HIGH"],
      broadbandNeeds: "FIBRE",
    },
  },

  // 9. Sparta Talk Fibre 80 / Sparta Unlimited + F80: £36.99 to £39.99 + VAT (approx. £44.39 to £47.99/mo) | 80Mbps Fibre, Free Engineer Visit
  {
    id: "sparta_talk_fibre_80",
    name: "Sparta Talk Fibre 80 / Unlimited + F80",
    category: "FIBRE_BROADBAND",
    categoryLabel: "Fibre Broadband (Fibre 40 / 80)",
    basePrice: 36.99,
    vatRate: 20,
    vatAmount: 7.40,
    grossPrice: 44.39,
    displayBase: "£36.99 to £39.99 + VAT",
    displayGross: "£44.39 to £47.99/mo",
    minutes: "500 to 1000 Landline + 200 to 500 Mobile Mins",
    broadbandSpeed: "Fibre 80 (80Mbps Ultrafast)",
    freeEngineerVisit: true,
    description: "Top-tier 80Mbps ultrafast fibre speed with high minutes bundle and free certified engineer visit.",
    tag: "Max Speed Fibre 80",
    targetUsage: {
      callVolume: ["HIGH", "ANY"],
      broadbandNeeds: "FIBRE",
    },
  },
];

export const SPARTA_BANKS = [
  "Barclays",
  "Lloyds Bank",
  "NatWest",
  "Santander",
  "HSBC UK",
  "Halifax",
  "Nationwide Building Society",
  "Royal Bank of Scotland (RBS)",
  "TSB",
  "Virgin Money",
  "Co-operative Bank",
  "Metro Bank",
  "Clydesdale Bank",
  "Bank of Scotland",
  "Yorkshire Bank",
];
