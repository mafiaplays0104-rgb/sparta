import { MasterStage, CustomerRecord, OfferConfig } from "../types";
import { MasterScriptEngine } from "./masterScriptEngine";
import { CalculatorTools } from "./calculatorTools";
import { SPARTA_PLANS, SPARTA_BANKS } from "../data/spartaPlans";

export interface ScriptUnit {
  id: string;
  stage: MasterStage;
  stageNumber: number;
  stageName: string;
  unitIndex: number;
  totalUnitsInStage: number;
  getText: (customer: CustomerRecord, config: OfferConfig) => string;
  expectedCustomerReply?: string;
  subNote?: string;
  isPauseAndListen: boolean;
  inputType?:
    | "NONE"
    | "BILL_INPUT"
    | "VAT_CALCULATOR"
    | "DOB_INPUT"
    | "CUSTOMER_ID_INPUT"
    | "MOBILE_INPUT"
    | "ALARM_SELECT"
    | "TV_INPUT"
    | "CHOICE";
  quickOptions?: {
    label: string;
    action: (customer: CustomerRecord, onUpdate: (u: Partial<CustomerRecord>) => void) => void;
  }[];
}

export class ScriptUnitEngine {
  /**
   * Generates all interactive units across the 9 Master Steps of the Sparta Telecom Script
   */
  public static getAllUnits(customer: CustomerRecord, config: OfferConfig): ScriptUnit[] {
    const customerName = MasterScriptEngine.getCustomerDisplayName(customer);
    const advisorName = config.advisorName || "Alex";
    const phoneNumber = customer.contactNumber || "0121 496 0123";
    const fullAddress = customer.address || "14 Highfield Road";
    const postcode = customer.postcode || "B33 8TH";
    const dob = customer.dob || "14/05/1952";

    const units: ScriptUnit[] = [
      // =====================================================================
      // STEP 1 — OPENING & TECHNICAL UPDATE PITCH (DELAYED BRAND DROP)
      // =====================================================================
      {
        id: "s1_u1",
        stage: "STEP_1_OPENING_TECHNICAL",
        stageNumber: 1,
        stageName: "Opening & Technical Update Pitch",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () => `“Hello... yeah hiii, am I speaking to ${customerName}?”`,
        expectedCustomerReply: "Yeah.",
        subNote: "RULE 1: DELAYED BRAND DROP. Never mention 'Sparta Telecom' in opening greeting.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Yeah” (Confirmed Account Holder)",
            action: (_c, onUpdate) => onUpdate({ personalDetailsConfirmed: true }),
          },
          {
            label: "“Who is calling please?”",
            action: () => {},
          },
          {
            label: "“What is this regarding?”",
            action: () => {},
          },
        ],
      },
      {
        id: "s1_u2",
        stage: "STEP_1_OPENING_TECHNICAL",
        stageNumber: 1,
        stageName: "Opening & Technical Update Pitch",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: () =>
          `“Hello ${customerName}, a lovely afternoon to you, this side ${advisorName} calling regarding your landline that is currently active at your property.”`,
        expectedCustomerReply: "Okay.",
        subNote: "Warm, polite, conversational tone. Establish connection with active property landline.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Okay”",
            action: () => {},
          },
          {
            label: "“Yes, that's my home phone”",
            action: () => {},
          },
        ],
      },
      {
        id: "s1_u3",
        stage: "STEP_1_OPENING_TECHNICAL",
        stageNumber: 1,
        stageName: "Opening & Technical Update Pitch",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () =>
          `“Well I have given you a call regarding a quick technical update that will be happening at your property as all across the UK now all the old copper network is gradually getting retired and replaced by new fibre line, and in your area and in your postcode as well, the exchange that your landline is connected with, it has also gotten upgraded. But as I was just checking your line, it is still connected with the old copper network, that's the reason I've called you to help you out upgrade your telephone line, so that in future you can continue using your home phone the same way you have been using till now without any disruption in your telephone line. Okay???”`,
        expectedCustomerReply: "Okay.",
        subNote: "Reassure that home phone continues working without disruption.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Okay” (Understands Technical Update)",
            action: (_c, onUpdate) => onUpdate({ isUsingAtHome: "YES" }),
          },
          {
            label: "“Is my landline going to stop working?”",
            action: () => {},
          },
        ],
      },

      // =====================================================================
      // STEP 2 — PROBABILITY DISCOVERY & QUALIFICATION
      // =====================================================================
      {
        id: "s2_u1",
        stage: "STEP_2_PROBABILITY_DISCOVERY",
        stageNumber: 2,
        stageName: "Probability Discovery & Qualification",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () =>
          `“So, in that regard, what would you say—do you make a lot of calls with this landline or do you hardly make any calls at all??”`,
        expectedCustomerReply: "Hardly any calls / A lot of calls.",
        subNote: "Discovery Q1: Qualify call volume for minute bundle allocation.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "Hardly Any Calls / Low Usage",
            action: (_c, onUpdate) => onUpdate({ callVolume: "LOW_HARDLY_ANY", landlineUsage: "LOW" }),
          },
          {
            label: "A Lot of Calls / High Usage",
            action: (_c, onUpdate) => onUpdate({ callVolume: "HIGH_FREQUENT", landlineUsage: "HIGH" }),
          },
          {
            label: "Average / Moderate Usage",
            action: (_c, onUpdate) => onUpdate({ callVolume: "AVERAGE", landlineUsage: "MODERATE" }),
          },
        ],
      },
      {
        id: "s2_u2",
        stage: "STEP_2_PROBABILITY_DISCOVERY",
        stageNumber: 2,
        stageName: "Probability Discovery & Qualification",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: () => `“And at your place, do you also use any Broadband?”`,
        expectedCustomerReply: "No / Yes, normal broadband / Yes, fibre.",
        subNote: "Discovery Q2: Qualify broadband presence (Landline Only vs Normal BB vs Fibre BB).",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "No Broadband (Landline Only)",
            action: (_c, onUpdate) => onUpdate({ broadbandStatus: "NO_BROADBAND", billIncludesBroadband: false }),
          },
          {
            label: "Normal Broadband (Up to 24Mbps)",
            action: (_c, onUpdate) => onUpdate({ broadbandStatus: "NORMAL_BROADBAND", billIncludesBroadband: true }),
          },
          {
            label: "Fibre Broadband (Fibre 40 / 80)",
            action: (_c, onUpdate) => onUpdate({ broadbandStatus: "FIBRE_BROADBAND", billIncludesBroadband: true }),
          },
        ],
      },
      {
        id: "s2_u3",
        stage: "STEP_2_PROBABILITY_DISCOVERY",
        stageNumber: 2,
        stageName: "Probability Discovery & Qualification",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: (cust) => {
          const bbMention = cust.broadbandStatus && cust.broadbandStatus !== "NO_BROADBAND"
            ? " [and for your Broadband]"
            : "";
          return `“And just so I can compare and see if any discount will be available for you on your new telephone package on the digital line, at the moment for your landline${bbMention}, on an average how much is it that you usually pay for your telephone bills??”`;
        },
        expectedCustomerReply: "Around £48 / £55 / £65.",
        subNote: "Discovery Q3: Capture current monthly bill for exact comparison against revised Sparta tariffs.",
        isPauseAndListen: true,
        inputType: "BILL_INPUT",
        quickOptions: [
          {
            label: "£48 / month (Average Landline)",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 48.0, billApproximate: true }),
          },
          {
            label: "£55 / month (Landline + BB)",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 55.0, billApproximate: true }),
          },
          {
            label: "£65 / month (Fibre Bundle)",
            action: (_c, onUpdate) => onUpdate({ monthlyBill: 65.0, billApproximate: true }),
          },
        ],
      },

      // =====================================================================
      // STEP 3 — DYNAMIC PACKAGE PITCH (BRANCHING BASED ON PROBABILITY)
      // =====================================================================
      {
        id: "s3_u1",
        stage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
        stageNumber: 3,
        stageName: "Dynamic Package Pitch (Branching)",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: (cust) => {
          const branch = CalculatorTools.determineProbabilityBranch(cust);
          if (branch === "LANDLINE_ONLY") {
            return `“Got it, so after the upgrade now the prices of the telephone bills, they are also going to get revised, so what you will be paying after the upgrade as your telephone bills that is only £19.99 + VAT (Sparta Line Only, approx. £23.99/mo) or £26.99 + VAT (Enhanced Line Only with 500 landline and 200 mobile minutes, approx. £32.39/mo) each month. Okay???”`;
          }
          if (branch === "NORMAL_BROADBAND") {
            return `“Got it, so after the upgrade now the prices of the telephone bills, they are also going to get revised, so what you will be paying after the upgrade as your telephone bills that is only £26.99 + VAT (Line Only + Normal BB with 500 mins, approx. £32.39/mo) or £31.99 + VAT (Sparta Talk Unlimited + Normal BB with 1000 LL + 500 mobile mins, approx. £38.39/mo) each month. Okay???”`;
          }
          // FIBRE_BROADBAND
          return `“Got it, so after the upgrade now the prices of the telephone bills, they are also going to get revised, so what you will be paying after the upgrade as your telephone bills that is ranging from £29.99 + VAT up to £39.99 + VAT depending on your selected Fibre 40 or Fibre 80 speed and minute bundles (such as Fibre 40 at £31.99+VAT approx. £38.39/mo, or Sparta Unlimited + F40 at £34.99+VAT approx. £41.99/mo). Okay???”`;
        },
        expectedCustomerReply: "Okay.",
        subNote: "RULE 3: PRICING & VAT TRANSPARENCY. State '[Base Price] + VAT' and gross total.",
        isPauseAndListen: true,
        inputType: "VAT_CALCULATOR",
        quickOptions: [
          {
            label: "Select £19.99 + VAT (£23.99/mo) — Line Only",
            action: (_c, onUpdate) =>
              onUpdate({
                selectedPlanId: "sparta_line_only",
                selectedPlanName: "Sparta Line Only",
                selectedPlanBasePrice: 19.99,
                selectedPlanGrossPrice: 23.99,
              }),
          },
          {
            label: "Select £26.99 + VAT (£32.39/mo) — Enhanced 500+200 Mins",
            action: (_c, onUpdate) =>
              onUpdate({
                selectedPlanId: "sparta_enhanced_line_only",
                selectedPlanName: "Enhanced Line Only (Plan with Minutes)",
                selectedPlanBasePrice: 26.99,
                selectedPlanGrossPrice: 32.39,
              }),
          },
          {
            label: "Select £31.99 + VAT (£38.39/mo) — Talk + Fibre 40",
            action: (_c, onUpdate) =>
              onUpdate({
                selectedPlanId: "sparta_talk_fibre_40",
                selectedPlanName: "Sparta Talk + Fibre 40",
                selectedPlanBasePrice: 31.99,
                selectedPlanGrossPrice: 38.39,
              }),
          },
          {
            label: "Select £34.99 + VAT (£41.99/mo) — Unlimited + F40 Enhanced",
            action: (_c, onUpdate) =>
              onUpdate({
                selectedPlanId: "sparta_unlimited_f40_enhanced",
                selectedPlanName: "Sparta Unlimited + F40 (Enhanced)",
                selectedPlanBasePrice: 34.99,
                selectedPlanGrossPrice: 41.99,
              }),
          },
        ],
      },

      // =====================================================================
      // STEP 4 — SPARTA TELECOM BRAND DROP & NETWORK EXPLANATION
      // =====================================================================
      {
        id: "s4_u1",
        stage: "STEP_4_SPARTA_BRAND_DROP",
        stageNumber: 4,
        stageName: "Sparta Telecom Brand Drop & Openreach",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () =>
          `“And this upgrade and this new telephone package, it is coming to you from Sparta Telecom. And Sparta Telecom, BT, TalkTalk, we all work on the same network that's Openreach. I'm sure you might have come across Openreach before?”`,
        expectedCustomerReply: "Yeah I have.",
        subNote: "BRAND DROP INTRODUCED HERE. Highlight Openreach shared network.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Yeah I have” (Knows Openreach)",
            action: (_c, onUpdate) => onUpdate({ brandDropAcknowledged: true }),
          },
          {
            label: "“Who is Openreach?”",
            action: () => {},
          },
        ],
      },
      {
        id: "s4_u2",
        stage: "STEP_4_SPARTA_BRAND_DROP",
        stageNumber: 4,
        stageName: "Sparta Telecom Brand Drop & Openreach",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: () =>
          `“So basically this upgrade is done by Sparta telecom and sparta telecom is a totally separate and independent company from your current service provider and like all UK providers since sparta also runs and operates on the same network openreach, so by grace of that nothing will be changing physically at your property and just so you know, you'll use the same landline and the same number, only now the billing name will change from your current provider to sparta telecom, so that your landline [and BB] both can successfully get upgrade from normal to digital and also your telephone bills could be a little cheaper with sparta telecom. Okay??”`,
        expectedCustomerReply: "Alright.",
        subNote: "Reassure that phone number & landline remain identical; billing name changes to Sparta Telecom.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Alright”",
            action: () => {},
          },
          {
            label: "“Are you part of BT?” (Clarify independent provider)",
            action: () => {},
          },
        ],
      },
      {
        id: "s4_u3",
        stage: "STEP_4_SPARTA_BRAND_DROP",
        stageNumber: 4,
        stageName: "Sparta Telecom Brand Drop & Openreach",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () =>
          `“And one more benefit that you'll be getting with sparta telecom is 24 months price promise guarantee, that means you will be under the privilege as well as security that for the upcoming two years your bills won't be increasing under any circumstances. Okay???”`,
        expectedCustomerReply: "Okay.",
        subNote: "COMPLIANCE & REASSURANCE: 24-month locked price promise guarantee.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Okay” (Acknowledged 2-Year Price Promise)",
            action: (_c, onUpdate) => onUpdate({ pricePromiseAcknowledged: true }),
          },
        ],
      },

      // =====================================================================
      // STEP 5 — VERIFICATION, AGE & RAPPORT BUILDING
      // =====================================================================
      {
        id: "s5_u1",
        stage: "STEP_5_VERIFICATION_AGE_RAPPORT",
        stageNumber: 5,
        stageName: "Verification, Age & Rapport Building",
        unitIndex: 1,
        totalUnitsInStage: 3,
        getText: () =>
          `“So now in order for us to provide you with this upgrade I'll quickly be verifying the details, i've got your telephone number here with me, correct me if i'm wrong that's ${phoneNumber}, right?? ... And by any chance do you also use any medical alarm system like lifeline or careline anything like that??”`,
        expectedCustomerReply: "That's correct / No.",
        subNote: "Phone confirmation & critical medical alarm check (Lifeline/Careline).",
        isPauseAndListen: true,
        inputType: "ALARM_SELECT",
        quickOptions: [
          {
            label: "✓ No Alarm ('That's a good thing you're doing independent')",
            action: (_c, onUpdate) => onUpdate({ medicalAlarm: false }),
          },
          {
            label: "Customer HAS Lifeline/Careline ('Yes')",
            action: (_c, onUpdate) => onUpdate({ medicalAlarm: true }),
          },
        ],
      },
      {
        id: "s5_u2",
        stage: "STEP_5_VERIFICATION_AGE_RAPPORT",
        stageNumber: 5,
        stageName: "Verification, Age & Rapport Building",
        unitIndex: 2,
        totalUnitsInStage: 3,
        getText: () =>
          `“And i've got your full name here with me that's ${customerName}, right?? And do you also use any middle initial or any middle name that you like?? And i've got your mailing address here with me that's ${fullAddress}, with the postcode ${postcode}”`,
        expectedCustomerReply: "Yes / That's right.",
        subNote: "Verify full name, middle initial inquiry, and postal address.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Name & Address Confirmed (No Middle Name)",
            action: (_c, onUpdate) => onUpdate({ addressConfirmed: true, personalDetailsConfirmed: true }),
          },
          {
            label: "Middle Initial Provided",
            action: (_c, onUpdate) => onUpdate({ middleInitial: "J", addressConfirmed: true }),
          },
        ],
      },
      {
        id: "s5_u3",
        stage: "STEP_5_VERIFICATION_AGE_RAPPORT",
        stageNumber: 5,
        stageName: "Verification, Age & Rapport Building",
        unitIndex: 3,
        totalUnitsInStage: 3,
        getText: () =>
          `“And now just for the age validation, just to make sure that yes you're elligible for this upgrade, could you please help me out with your DOB?? ... ${dob}? My goodness, you must have seen a lots of changes in this country by now... HAHAHA”`,
        expectedCustomerReply: "Oh sure I have, HAHAHA",
        subNote: "PENSIONER RAPPORT: Warm human laughter after capturing DOB.",
        isPauseAndListen: true,
        inputType: "DOB_INPUT",
        quickOptions: [
          {
            label: "✓ Customer Laughs: “Oh sure I have, HAHAHA”",
            action: (_c, onUpdate) => onUpdate({ dob, isEligibleAge: true }),
          },
        ],
      },

      // =====================================================================
      // STEP 6 — FREE SERVICES & EXTENSION CHECK
      // =====================================================================
      {
        id: "s6_u1",
        stage: "STEP_6_FREE_SERVICES_EXTENSIONS",
        stageNumber: 6,
        stageName: "Free Services & Extension Check",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `“And with this services the 1571 / 1471 that's the answering machine for your landline, now that is also going to be an absolutely free service for you and you'll also receive paper bill each and every month which will show you how many calls you've made, how you're getting charged and for the first 2 months even the paper bill is absolutely free for you and thereafter it will only cost you £1 extra on top of your package price.”`,
        expectedCustomerReply: "Okay.",
        subNote: "Highlight free 1571/1471 answering machine and transparent paper billing terms.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Okay”",
            action: () => {},
          },
        ],
      },
      {
        id: "s6_u2",
        stage: "STEP_6_FREE_SERVICES_EXTENSIONS",
        stageNumber: 6,
        stageName: "Free Services & Extension Check",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `“And apart from this main phone have you got any extension aswell connected on the same telephone line?? ... Oh and are both of them cordless or corded, i mean can you walk and talk with both of them? ... Then both of the phones will be working absolutely fine with the services, you don't need to purchase any new phone.”`,
        expectedCustomerReply: "Yes, cordless / No extensions.",
        subNote: "Check extensions and reassure no new phones needed.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "Both Cordless ('Walk & Talk' - 100% fine)",
            action: (_c, onUpdate) => onUpdate({ hasExtensionPhones: true, extensionType: "CORDLESS" }),
          },
          {
            label: "No Extensions (Main Phone Only)",
            action: (_c, onUpdate) => onUpdate({ hasExtensionPhones: false, extensionType: "NONE" }),
          },
          {
            label: "Corded Extension (Handled by engineer)",
            action: (_c, onUpdate) => onUpdate({ hasExtensionPhones: true, extensionType: "CORDED" }),
          },
        ],
      },

      // =====================================================================
      // STEP 7 — ENGINEER PROCESS, ROUTER & COST BREAKDOWN
      // =====================================================================
      {
        id: "s7_u1",
        stage: "STEP_7_ENGINEER_ROUTER_COST",
        stageNumber: 7,
        stageName: "Engineer Process, Router & Cost Breakdown",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `“And now i'll tell you how this upgrade is actually going to happen, so for the upgrade we will be fixing an appointment with the openreach engineers and in the upcoming 2 weeks time, about 14 to 15 business days from now, the certified engineers are going to visit your house physically to install the digital line, and since it going to be background update so there will be no physical changes required at your property and prior to the engineers visit you'll be receiving a new fibre optic router as well, and after receiving the router, your job is going to be very simple, you just have to hand over the router to those openreach engineers and rest they'll be doing every needful things to upgrade your telephone line. Okay??”`,
        expectedCustomerReply: "Okay.",
        subNote: "Certified Openreach engineer visit in 14-15 business days. Hand over posted router to engineer.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Okay” (Understands Handover)",
            action: () => {},
          },
        ],
      },
      {
        id: "s7_u2",
        stage: "STEP_7_ENGINEER_ROUTER_COST",
        stageNumber: 7,
        stageName: "Engineer Process, Router & Cost Breakdown",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `“And the best part about sparta telecom is that, with us you would not need to pay anything neither for the installation and nor for the engineer's visit as everything will be taken care of by us, however if you'll go down to the market to find these kind of digital router, it might cost you nearly about 100 or 110 pounds but now that as you're retired and a pentioner and as you're going to be our priviledged customer with sparta telecom, this router is only going to cost you one time charge of 30 pounds and that too not in advance, once the upgrade will have happened then it will be adjusted in your future telephone bills, so basically you do not need to pay anything upfront for this upgrade to take place okay?? ... So now i believe you're happy and satisfied to go ahead with sparta telecom for the digital services and we're a separate and indipendent company from your current provider. i believe you do understand that now??”`,
        expectedCustomerReply: "Very good. Yes.",
        subNote: "Free installation & engineer visit. £30 one-time pensioner router adjusted on future bill. Zero upfront.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Very good” (Happy & Satisfied)",
            action: (_c, onUpdate) => onUpdate({ routerFeeAdjustedAcknowledged: true, termsUnderstood: true }),
          },
        ],
      },

      // =====================================================================
      // STEP 8 — DIRECT DEBIT & DPA 1998 MANDATE
      // =====================================================================
      {
        id: "s8_u1",
        stage: "STEP_8_DIRECT_DEBIT_DPA1998",
        stageNumber: 8,
        stageName: "Direct Debit & DPA 1998 Mandate",
        unitIndex: 1,
        totalUnitsInStage: 2,
        getText: () =>
          `“Perfect, and at the moment you're paying your bills is it by cash, cheque or Direct Debit? ... Oh Direct Debit, so the best part is that even the mode of the payment is going to remain exactly the same as it is and let me tell you how it is going to work, once you come to sparta telecom for the digital services, before that your current provider is just going to charge you one final bill and if they have charged you any money in advance then they are also going to refund you with that money, and then the direct debit that you've setup with them, it is automatically going to get cancelled, and later on a new Direct Debit will be setup with sparta telecom for your future billing purposes. Okay?”`,
        expectedCustomerReply: "Okay.",
        subNote: "Direct Debit continuity: old DD auto cancelled, current provider refunds advance payments.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Okay” (Understands Transition)",
            action: (_c, onUpdate) => onUpdate({ paymentMethod: "DIRECT_DEBIT" }),
          },
        ],
      },
      {
        id: "s8_u2",
        stage: "STEP_8_DIRECT_DEBIT_DPA1998",
        stageNumber: 8,
        stageName: "Direct Debit & DPA 1998 Mandate",
        unitIndex: 2,
        totalUnitsInStage: 2,
        getText: () =>
          `“But the good part is that as we're working here under DPA 1998, so we will not be requiring any of your confidential details or banking details over the phone, what we will do is that we will send you the direct debit mandate form of your bank which you can fill it up yourself and send it back to us. Okay? ... And just to send you the correct direct debit mandate form, which bank you generally deal with?”`,
        expectedCustomerReply: "Barclays / Lloyds / NatWest.",
        subNote: "DPA 1998 COMPLIANCE: NO bank details taken over phone. Send paper mandate form of their bank.",
        isPauseAndListen: true,
        inputType: "CHOICE",
        quickOptions: [
          {
            label: "Barclays",
            action: (_c, onUpdate) => onUpdate({ bankName: "Barclays", dpaMandateFormRequested: true }),
          },
          {
            label: "Lloyds Bank",
            action: (_c, onUpdate) => onUpdate({ bankName: "Lloyds Bank", dpaMandateFormRequested: true }),
          },
          {
            label: "NatWest",
            action: (_c, onUpdate) => onUpdate({ bankName: "NatWest", dpaMandateFormRequested: true }),
          },
          {
            label: "Santander",
            action: (_c, onUpdate) => onUpdate({ bankName: "Santander", dpaMandateFormRequested: true }),
          },
          {
            label: "HSBC UK",
            action: (_c, onUpdate) => onUpdate({ bankName: "HSBC UK", dpaMandateFormRequested: true }),
          },
          {
            label: "Halifax",
            action: (_c, onUpdate) => onUpdate({ bankName: "Halifax", dpaMandateFormRequested: true }),
          },
          {
            label: "Nationwide",
            action: (_c, onUpdate) => onUpdate({ bankName: "Nationwide Building Society", dpaMandateFormRequested: true }),
          },
        ],
      },

      // =====================================================================
      // STEP 9 — VERIFICATION HANDOFF
      // =====================================================================
      {
        id: "s9_u1",
        stage: "STEP_9_VERIFICATION_HANDOFF",
        stageNumber: 9,
        stageName: "Verification Handoff",
        unitIndex: 1,
        totalUnitsInStage: 1,
        getText: () =>
          `“Perfectly fine, now everything is done from my side and in a minute one of my colleagues will just be taking a verbal confirmation from you that you've understood about this switchover, so you just have to give an affirmative response so that we can move further smoothly to do the arrangements, okay? ... Here's my colleague just have a word with him...”`,
        expectedCustomerReply: "Okay.",
        subNote: "Warm verbal confirmation handoff to colleague. Affirmative response to proceed.",
        isPauseAndListen: true,
        quickOptions: [
          {
            label: "✓ Customer: “Okay” (Verbal Confirmation Complete)",
            action: (_c, onUpdate) => onUpdate({ finalConfirmationGiven: true, customerDecision: "YES" }),
          },
        ],
      },
    ];

    return units;
  }
}
