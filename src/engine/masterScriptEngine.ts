import {
  MasterStage,
  CustomerRecord,
  OfferConfig,
} from "../types";
import { CalculatorTools } from "./calculatorTools";

export interface StageDefinition {
  stage: MasterStage;
  stageNumber: number;
  stageName: string;
  stepShortTitle: string;
  objective: string;
  getSayText: (customer: CustomerRecord, config: OfferConfig) => string;
  pauseInstruction: string;
  goldenRuleNote?: string;
  quickResponses: {
    label: string;
    actionDescription: string;
    category?: string;
    autoFill?: Partial<CustomerRecord>;
    nextStage?: MasterStage;
    guidance?: string;
  }[];
  why: string;
  complianceWarning?: string;
  requiredFields?: (keyof CustomerRecord)[];
  allowFallback?: boolean;
  fallbackText?: string;
  nextStage: MasterStage;
  prevStage?: MasterStage;
}

export const STAGES_LIST: MasterStage[] = [
  "STEP_1_OPENING_TECHNICAL",
  "STEP_2_PROBABILITY_DISCOVERY",
  "STEP_3_DYNAMIC_PACKAGE_PITCH",
  "STEP_4_SPARTA_BRAND_DROP",
  "STEP_5_VERIFICATION_AGE_RAPPORT",
  "STEP_6_FREE_SERVICES_EXTENSIONS",
  "STEP_7_ENGINEER_ROUTER_COST",
  "STEP_8_DIRECT_DEBIT_DPA1998",
  "STEP_9_VERIFICATION_HANDOFF",
];

export class MasterScriptEngine {
  /**
   * Helper to resolve customer name or greeting
   */
  public static getCustomerDisplayName(customer: CustomerRecord): string {
    const prefix = customer.title || "Mr / Mrs";
    if (customer.lastName) {
      return `${prefix} ${customer.lastName}`;
    }
    if (customer.firstName) {
      return customer.firstName;
    }
    return "Sir/Madam";
  }

  /**
   * Format a concise service summary for verification
   */
  public static getServiceSummary(customer: CustomerRecord): string {
    const parts: string[] = [];
    if (customer.monthlyBill) {
      parts.push(`paying around £${customer.monthlyBill.toFixed(2)}/month`);
    }
    if (customer.broadbandStatus) {
      parts.push(`Broadband: ${customer.broadbandStatus.replace("_", " ")}`);
    }
    if (customer.callVolume) {
      parts.push(`Calls: ${customer.callVolume}`);
    }
    return parts.length > 0 ? parts.join(", ") : "active telephone line";
  }

  /**
   * Get the complete definition for any of the 9 Master Steps of the Sparta Telecom Script
   */
  public static getStageDefinition(
    stage: MasterStage,
    customer: CustomerRecord,
    config: OfferConfig
  ): StageDefinition {
    const advisorName = config.advisorName || "Alex";
    const customerName = MasterScriptEngine.getCustomerDisplayName(customer);
    const phoneNumber = customer.contactNumber || "0121 496 0123";
    const fullAddress = customer.address || "14 Highfield Road";
    const postcode = customer.postcode || "B33 8TH";
    const dob = customer.dob || "14/05/1952";
    const billStr = customer.monthlyBill ? `£${customer.monthlyBill.toFixed(2)}` : "your average bill";

    switch (stage) {
      // =============================================================
      // STEP 1 — OPENING & TECHNICAL UPDATE PITCH
      // =============================================================
      case "STEP_1_OPENING_TECHNICAL":
      case "PHASE_1_INTRODUCTION":
      case "STAGE_1_OPENING":
        return {
          stage: "STEP_1_OPENING_TECHNICAL",
          stageNumber: 1,
          stageName: "Step 1: Opening & Technical Update Pitch",
          stepShortTitle: "Opening & Update",
          objective: "Warm, polite opening introducing nationwide copper-to-fibre network upgrade. NEVER mention Sparta Telecom in this opening greeting.",
          goldenRuleNote: "DELAYED BRAND DROP: Do NOT mention 'Sparta Telecom'. Focus on the technical exchange upgrade and zero disruption.",
          complianceWarning: "STRICT RULE: Never mention 'Sparta Telecom' in opening. Technical network update first.",
          getSayText: () =>
            `“Hello... yeah hiii, am I speaking to ${customerName}?”\n\n(Customer: Yeah.)\n\n“Hello ${customerName}, a lovely afternoon to you, this side ${advisorName} calling regarding your landline that is currently active at your property.”\n\n(Customer: Okay.)\n\n“Well I have given you a call regarding a quick technical update that will be happening at your property as all across the UK now all the old copper network is gradually getting retired and replaced by new fibre line, and in your area and in your postcode as well, the exchange that your landline is connected with, it has also gotten upgraded. But as I was just checking your line, it is still connected with the old copper network, that's the reason I've called you to help you out upgrade your telephone line, so that in future you can continue using your home phone the same way you have been using till now without any disruption in your telephone line. Okay???”`,
          pauseInstruction: "Customer replies 'Okay' or acknowledges the technical update. Listen patiently.",
          quickResponses: [
            {
              label: "Customer: “Okay” / “Yes”",
              actionDescription: "Customer acknowledges update smoothly.",
              nextStage: "STEP_2_PROBABILITY_DISCOVERY",
              guidance: "Transition immediately into probability qualification questions.",
            },
            {
              label: "“Who is calling please?”",
              actionDescription: "Customer asks who is calling.",
              guidance: `Say: “This side ${advisorName} calling regarding your landline active at your property and the technical network upgrade for your area.” (Do NOT drop brand name yet).`,
            },
            {
              label: "“Is there a problem with my telephone line?”",
              actionDescription: "Customer is concerned about line interruption.",
              guidance: "Say: “Not at all, your line is active. We are helping you transition to the upgraded digital exchange so you can continue using your home phone without any disruption.”",
            },
          ],
          why: "Delayed brand drop avoids immediate sales resistance and grounds the call in an urgent, genuine nationwide technical infrastructure upgrade.",
          nextStage: "STEP_2_PROBABILITY_DISCOVERY",
        };

      // =============================================================
      // STEP 2 — PROBABILITY DISCOVERY & QUALIFICATION
      // =============================================================
      case "STEP_2_PROBABILITY_DISCOVERY":
      case "PHASE_2_TRANSITION_HOOK":
      case "STAGE_4_CURRENT_SERVICE":
      case "STAGE_5_CURRENT_BILL":
        return {
          stage: "STEP_2_PROBABILITY_DISCOVERY",
          stageNumber: 2,
          stageName: "Step 2: Probability Discovery & Qualification",
          stepShortTitle: "Discovery & Qualification",
          objective: "Qualify customer's usage: call volume (a lot vs hardly any), broadband presence, and current monthly bills for dynamic branch routing.",
          goldenRuleNote: "Ask all 3 discovery questions: 1. Call volume, 2. Broadband presence, 3. Average current bill.",
          getSayText: () =>
            `“So, in that regard, what would you say—do you make a lot of calls with this landline or do you hardly make any calls at all??”\n\n(Customer captures call volume)\n\n“And at your place, do you also use any Broadband?”\n\n(Customer captures broadband status)\n\n“And just so I can compare and see if any discount will be available for you on your new telephone package on the digital line, at the moment for your landline [and for your Broadband], on an average how much is it that you usually pay for your telephone bills??”`,
          pauseInstruction: "Record customer's call volume, broadband type, and current monthly bill.",
          quickResponses: [
            {
              label: "Landline Only • Hardly any calls • Bill £40-£50",
              actionDescription: "Route to Landline Only Branch (£19.99 + VAT).",
              autoFill: {
                callVolume: "LOW_HARDLY_ANY",
                broadbandStatus: "NO_BROADBAND",
                monthlyBill: 48,
              },
              nextStage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
              guidance: "Pitch Sparta Line Only (£19.99 + VAT = £23.99/mo).",
            },
            {
              label: "Normal Broadband • Average Calls • Bill £50-£65",
              actionDescription: "Route to Normal Broadband Branch (£26.99 or £31.99 + VAT).",
              autoFill: {
                callVolume: "AVERAGE",
                broadbandStatus: "NORMAL_BROADBAND",
                monthlyBill: 58,
              },
              nextStage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
              guidance: "Pitch Line Only + Normal BB (£26.99+VAT) or Talk Unlimited + Normal BB (£31.99+VAT).",
            },
            {
              label: "Fibre Broadband • Heavy Calls/Streaming • Bill £60+",
              actionDescription: "Route to Fibre 40 / 80 Branch.",
              autoFill: {
                callVolume: "HIGH_FREQUENT",
                broadbandStatus: "FIBRE_BROADBAND",
                monthlyBill: 68,
              },
              nextStage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
              guidance: "Pitch Fibre 40 (£29.99-£39.99 + VAT) or Fibre 80 with free engineer visit.",
            },
          ],
          why: "Probability discovery establishes customer needs and matches them to the exact Sparta Telecom tariff.",
          nextStage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
          prevStage: "STEP_1_OPENING_TECHNICAL",
        };

      // =============================================================
      // STEP 3 — DYNAMIC PACKAGE PITCH (BRANCHING BASED ON PROBABILITY)
      // =============================================================
      case "STEP_3_DYNAMIC_PACKAGE_PITCH":
      case "PHASE_3_BUNDLE_PRICE_GUARANTEE":
      case "STAGE_6_EXPLAINING_REDUCTION":
        return {
          stage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
          stageNumber: 3,
          stageName: "Step 3: Dynamic Package Pitch (Branching)",
          stepShortTitle: "Dynamic Package Pitch",
          objective: "Pitch the exact Sparta pricing branch based on qualified probability (Landline Only, Normal BB, or Fibre BB), quoting Base Price + 20% VAT and gross totals.",
          goldenRuleNote: "Always state prices clearly as '[Base Price] + VAT' and provide the estimated gross monthly total.",
          getSayText: (cust) => {
            const branch = CalculatorTools.determineProbabilityBranch(cust);
            if (branch === "LANDLINE_ONLY") {
              return `“Got it, so after the upgrade now the prices of the telephone bills, they are also going to get revised, so what you will be paying after the upgrade as your telephone bills that is only £19.99 + VAT (Sparta Line Only, approx. £23.99/mo) or £26.99 + VAT (Enhanced Line Only with 500 landline and 200 mobile minutes, approx. £32.39/mo) each month. Okay???”`;
            }
            if (branch === "NORMAL_BROADBAND") {
              return `“Got it, so after the upgrade now the prices of the telephone bills, they are also going to get revised, so what you will be paying after the upgrade as your telephone bills that is only £26.99 + VAT (Line Only + Normal BB with 500 mins, approx. £32.39/mo) or £31.99 + VAT (Sparta Talk Unlimited + Normal BB with 1000 LL + 500 mobile mins, approx. £38.39/mo) each month. Okay???”`;
            }
            // FIBRE_BROADBAND
            return `“Got it, so after the upgrade now the prices of the telephone bills, they are also going to get revised, so what you will be paying after the upgrade as your telephone bills that is ranging from £29.99 + VAT up to £39.99 + VAT depending on your selected Fibre 40 or Fibre 80 speed and minute bundles (such as Fibre 40 with 500 mins at £31.99+VAT approx. £38.39/mo, or Sparta Unlimited + F40 at £34.99+VAT approx. £41.99/mo). Okay???”`;
          },
          pauseInstruction: "Present pricing transparently. Listen for customer agreement ('Okay' / 'That sounds good').",
          quickResponses: [
            {
              label: "Customer Agrees / Accepts Tariff",
              actionDescription: "Customer confirms new revised tariff.",
              nextStage: "STEP_4_SPARTA_BRAND_DROP",
              guidance: "Proceed smoothly to Step 4 for the Sparta Telecom brand introduction.",
            },
            {
              label: "“Does that include VAT?”",
              actionDescription: "Customer asks about VAT inclusive price.",
              guidance: "State: “Yes, £19.99 plus 20% VAT is approx. £23.99 per month total (or £26.99 + VAT is £32.39/mo), with no hidden costs.”",
            },
            {
              label: "“Can I get calls included?”",
              actionDescription: "Customer wants minutes bundle.",
              guidance: "Offer the £26.99 + VAT plan with 500 landline + 200 mobile minutes (approx. £32.39/mo total).",
            },
          ],
          why: "Clear VAT transparency builds immediate trust and avoids billing surprises.",
          nextStage: "STEP_4_SPARTA_BRAND_DROP",
          prevStage: "STEP_2_PROBABILITY_DISCOVERY",
        };

      // =============================================================
      // STEP 4 — SPARTA TELECOM BRAND DROP & NETWORK EXPLANATION
      // =============================================================
      case "STEP_4_SPARTA_BRAND_DROP":
        return {
          stage: "STEP_4_SPARTA_BRAND_DROP",
          stageNumber: 4,
          stageName: "Step 4: Sparta Telecom Brand Drop & Openreach",
          stepShortTitle: "Sparta Brand Drop",
          objective: "Introduce Sparta Telecom, explain shared Openreach network, clarify separate independent provider status, billing name switch, and 24-month price promise guarantee.",
          goldenRuleNote: "BRAND DROP HERE: Explain Sparta runs on Openreach just like BT/TalkTalk. Zero physical changes. 24-month price promise guarantee.",
          getSayText: () =>
            `“And this upgrade and this new telephone package, it is coming to you from Sparta Telecom. And Sparta Telecom, BT, TalkTalk, we all work on the same network that's Openreach. I'm sure you might have come across Openreach before?”\n\n(Customer: Yeah I have.)\n\n“So basically this upgrade is done by Sparta telecom and sparta telecom is a totally separate and independent company from your current service provider and like all UK providers since sparta also runs and operates on the same network openreach, so by grace of that nothing will be changing physically at your property and just so you know, you'll use the same landline and the same number, only now the billing name will change from your current provider to sparta telecom, so that your landline [and BB] both can successfully get upgrade from normal to digital and also your telephone bills could be a little cheaper with sparta telecom. Okay??”\n\n(Customer: Alright.)\n\n“And one more benefit that you'll be getting with sparta telecom is 24 months price promise guarantee, that means you will be under the privilege as well as security that for the upcoming two years your bills won't be increasing under any circumstances. Okay???”`,
          pauseInstruction: "Customer replies 'Okay'. Confirm understanding of Sparta Telecom as independent company on Openreach.",
          quickResponses: [
            {
              label: "Customer: “Okay” / Understands",
              actionDescription: "Customer accepts Sparta Telecom & 24-month price promise.",
              autoFill: { brandDropAcknowledged: true, pricePromiseAcknowledged: true },
              nextStage: "STEP_5_VERIFICATION_AGE_RAPPORT",
              guidance: "Proceed to Step 5 details verification and pensioner rapport.",
            },
            {
              label: "“Are you BT?”",
              actionDescription: "Customer asks if you are BT.",
              guidance: "Clarify: “No, Sparta Telecom is a separate and independent company, but we operate on the exact same Openreach network as BT, so your line and number remain identical.”",
            },
            {
              label: "“Will I lose my phone number?”",
              actionDescription: "Customer worries about phone number change.",
              guidance: "Reassure: “Not at all! You keep your exact same phone number and landline, only the billing name changes to Sparta Telecom.”",
            },
          ],
          why: "Transparently establishing Sparta Telecom's relationship to Openreach satisfies regulatory compliance while reassuring the customer of seamless continuity.",
          nextStage: "STEP_5_VERIFICATION_AGE_RAPPORT",
          prevStage: "STEP_3_DYNAMIC_PACKAGE_PITCH",
        };

      // =============================================================
      // STEP 5 — VERIFICATION, AGE & RAPPORT BUILDING
      // =============================================================
      case "STEP_5_VERIFICATION_AGE_RAPPORT":
      case "STAGE_2_VERIFICATION_ID":
        return {
          stage: "STEP_5_VERIFICATION_AGE_RAPPORT",
          stageNumber: 5,
          stageName: "Step 5: Verification, Age & Rapport Building",
          stepShortTitle: "Verification & Rapport",
          objective: "Verify phone number, check medical alarm (Lifeline/Careline), confirm full name, middle initial, address, and validate DOB with warm pensioner rapport.",
          goldenRuleNote: "PENSIONER RAPPORT: When customer gives DOB, respond warmly: '[DOB]? My goodness, you must have seen a lots of changes in this country by now... HAHAHA'",
          getSayText: () =>
            `“So now in order for us to provide you with this upgrade I'll quickly be verifying the details, i've got your telephone number here with me, correct me if i'm wrong that's ${phoneNumber}, right??”\n\n(Customer: That's correct.)\n\n“And by any chance do you also use any medical alarm system like lifeline or careline anything like that??”\n\n(Customer: No.)\n\n“That's a good thing that you're still doing independent. And i've got your full name here with me that's ${customerName}, right??”\n\n(Customer: Yes.)\n\n“And do you also use any middle initial or any middle name that you like??”\n\n(Customer captures middle initial / No)\n\n“And i've got your mailing address here with me that's ${fullAddress}, with the postcode ${postcode}”\n\n(Customer: That's right.)\n\n“And now just for the age validation, just to make sure that yes you're elligible for this upgrade, could you please help me out with your DOB??”\n\n(Customer: It's ${dob})\n\n“${dob}? My goodness, you must have seen a lots of changes in this country by now... HAHAHA”`,
          pauseInstruction: "Share a warm laugh with customer on their DOB and pensioner milestone.",
          quickResponses: [
            {
              label: "Verified Details & Customer Laughs ('Oh sure I have, HAHAHA')",
              actionDescription: "Details verified and rapport built smoothly.",
              autoFill: { addressConfirmed: true, personalDetailsConfirmed: true, medicalAlarm: false },
              nextStage: "STEP_6_FREE_SERVICES_EXTENSIONS",
              guidance: "Proceed to Step 6 for answering machine and extension phones check.",
            },
            {
              label: "Customer HAS Lifeline / Medical Alarm ('Yes')",
              actionDescription: "Customer uses Careline/Lifeline.",
              autoFill: { medicalAlarm: true },
              guidance: "Acknowledge: “No problem at all, our certified engineer will ensure the digital socket works seamlessly with your alarm unit.”",
            },
            {
              label: "Customer asks: “Why do you need my DOB?”",
              actionDescription: "Customer asks purpose of DOB.",
              guidance: "Say: “Just for age validation to make sure you qualify as a privileged customer for the upgrade and discounted router.”",
            },
          ],
          why: "Warm human laughter and rapport around age breaks institutional barriers and reassures elderly landline holders.",
          nextStage: "STEP_6_FREE_SERVICES_EXTENSIONS",
          prevStage: "STEP_4_SPARTA_BRAND_DROP",
        };

      // =============================================================
      // STEP 6 — FREE SERVICES & EXTENSION CHECK
      // =============================================================
      case "STEP_6_FREE_SERVICES_EXTENSIONS":
        return {
          stage: "STEP_6_FREE_SERVICES_EXTENSIONS",
          stageNumber: 6,
          stageName: "Step 6: Free Services & Extension Check",
          stepShortTitle: "Free Services & Extensions",
          objective: "Confirm free 1571/1471 answering machine, paper bill (2 months free, then £1), and check extension phone compatibility (cordless/corded).",
          goldenRuleNote: "Confirm 1571/1471 is free. Check if extension phones are cordless/corded and reassure no new phones needed.",
          getSayText: () =>
            `“And with this services the 1571 / 1471 that's the answering machine for your landline, now that is also going to be an absolutely free service for you and you'll also receive paper bill each and every month which will show you how many calls you've made, how you're getting charged and for the first 2 months even the paper bill is absolutely free for you and thereafter it will only cost you £1 extra on top of your package price.”\n\n(Customer: Okay.)\n\n“And apart from this main phone have you got any extension aswell connected on the same telephone line??”\n\n(Customer captures extension details)\n\n“Oh and are both of them cordless or corded, i mean can you walk and talk with both of them?”\n\n(Customer: Yes.)\n\n“Then both of the phones will be working absolutely fine with the services, you don't need to purchase any new phone.”`,
          pauseInstruction: "Customer confirms phone setup. Reassure they don't need new handsets.",
          quickResponses: [
            {
              label: "Customer: “Okay” / Both phones cordless",
              actionDescription: "Extension confirmed cordless and fully compatible.",
              autoFill: { hasExtensionPhones: true, extensionType: "CORDLESS" },
              nextStage: "STEP_7_ENGINEER_ROUTER_COST",
              guidance: "Proceed to Step 7 engineer appointment and router details.",
            },
            {
              label: "Customer has only 1 main telephone (No extensions)",
              actionDescription: "Single phone at property.",
              autoFill: { hasExtensionPhones: false, extensionType: "NONE" },
              nextStage: "STEP_7_ENGINEER_ROUTER_COST",
              guidance: "Proceed directly to Step 7.",
            },
            {
              label: "Customer has corded extension in bedroom/hallway",
              actionDescription: "Corded extension present.",
              autoFill: { hasExtensionPhones: true, extensionType: "CORDED" },
              guidance: "Reassure: “Our engineer will check the extension socket so your existing corded phone keeps working perfectly.”",
            },
          ],
          why: "Elderly customers frequently worry about whether their existing extension handsets and answering machines will stop working on digital lines.",
          nextStage: "STEP_7_ENGINEER_ROUTER_COST",
          prevStage: "STEP_5_VERIFICATION_AGE_RAPPORT",
        };

      // =============================================================
      // STEP 7 — ENGINEER PROCESS, ROUTER & COST BREAKDOWN
      // =============================================================
      case "STEP_7_ENGINEER_ROUTER_COST":
      case "PHASE_4_HARDWARE_INSTALLATION":
        return {
          stage: "STEP_7_ENGINEER_ROUTER_COST",
          stageNumber: 7,
          stageName: "Step 7: Engineer Process, Router & Cost Breakdown",
          stepShortTitle: "Engineer & Router (£30)",
          objective: "Explain Openreach certified engineer visit in 14-15 business days, prior router postal delivery, free engineer visit, and pensioner £30 one-time router fee adjusted on future bill with zero upfront fee.",
          goldenRuleNote: "ZERO UPFRONT: Free certified engineer visit. Router is £30 one-time (vs £100-£110 market) adjusted on future bill, not in advance.",
          getSayText: () =>
            `“And now i'll tell you how this upgrade is actually going to happen, so for the upgrade we will be fixing an appointment with the openreach engineers and in the upcoming 2 weeks time, about 14 to 15 business days from now, the certified engineers are going to visit your house physically to install the digital line, and since it going to be background update so there will be no physical changes required at your property and prior to the engineers visit you'll be receiving a new fibre optic router as well, and after receiving the router, your job is going to be very simple, you just have to hand over the router to those openreach engineers and rest they'll be doing every needful things to upgrade your telephone line. Okay??”\n\n(Customer: Okay.)\n\n“And the best part about sparta telecom is that, with us you would not need to pay anything neither for the installation and nor for the engineer's visit as everything will be taken care of by us, however if you'll go down to the market to find these kind of digital router, it might cost you nearly about 100 or 110 pounds but now that as you're retired and a pentioner and as you're going to be our priviledged customer with sparta telecom, this router is only going to cost you one time charge of 30 pounds and that too not in advance, once the upgrade will have happened then it will be adjusted in your future telephone bills, so basically you do not need to pay anything upfront for this upgrade to take place okay??”\n\n(Customer: Very good.)\n\n“So now i believe you're happy and satisfied to go ahead with sparta telecom for the digital services and we're a separate and indipendent company from your current provider. i believe you do understand that now??”`,
          pauseInstruction: "Customer replies 'Yes' or 'Very good'. Confirm satisfaction and understanding.",
          quickResponses: [
            {
              label: "Customer: “Very good” / Satisfied to proceed",
              actionDescription: "Customer understands engineer visit and £30 adjusted charge.",
              autoFill: { routerFeeAdjustedAcknowledged: true, termsUnderstood: true },
              nextStage: "STEP_8_DIRECT_DEBIT_DPA1998",
              guidance: "Move to Step 8 Direct Debit and DPA 1998 mandate explanation.",
            },
            {
              label: "“Do I have to pay anything today?”",
              actionDescription: "Customer asks about immediate payment.",
              guidance: "Emphasize: “No, you do not pay anything upfront today. The £30 is adjusted in your future telephone bill only after the upgrade takes place.”",
            },
            {
              label: "“Do I have to plug in the router myself?”",
              actionDescription: "Customer worried about technical installation.",
              guidance: "Reassure: “Not at all! You simply hand the package to the Openreach engineer when they visit, and they do everything for you.”",
            },
          ],
          why: "Removes technical fear by providing a free engineer visit and confirms zero upfront payment for pensioner peace of mind.",
          nextStage: "STEP_8_DIRECT_DEBIT_DPA1998",
          prevStage: "STEP_6_FREE_SERVICES_EXTENSIONS",
        };

      // =============================================================
      // STEP 8 — DIRECT DEBIT & DPA 1998 MANDATE
      // =============================================================
      case "STEP_8_DIRECT_DEBIT_DPA1998":
        return {
          stage: "STEP_8_DIRECT_DEBIT_DPA1998",
          stageNumber: 8,
          stageName: "Step 8: Direct Debit & DPA 1998 Mandate",
          stepShortTitle: "Direct Debit & DPA 1998",
          objective: "Confirm payment method, explain final bill & refund from current provider, and emphasize DPA 1998 compliance (NO bank details taken on phone; bank-specific mandate form sent in post).",
          goldenRuleNote: "DPA 1998 COMPLIANCE: Do NOT take sort code or account number over phone. Send the official paper mandate form of their bank.",
          complianceWarning: "STRICT COMPLIANCE: Never ask for confidential bank details over the phone under DPA 1998. Only ask for the Bank Name to post the correct mandate form.",
          getSayText: () =>
            `“Perfect, and at the moment you're paying your bills is it by cash, cheque or Direct Debit?”\n\n(Customer: Direct Debit.)\n\n“Oh Direct Debit, so the best part is that even the mode of the payment is going to remain exactly the same as it is and let me tell you how it is going to work, once you come to sparta telecom for the digital services, before that your current provider is just going to charge you one final bill and if they have charged you any money in advance then they are also going to refund you with that money, and then the direct debit that you've setup with them, it is automatically going to get cancelled, and later on a new Direct Debit will be setup with sparta telecom for your future billing purposes. Okay?”\n\n(Customer: Okay.)\n\n“But the good part is that as we're working here under DPA 1998, so we will not be requiring any of your confidential details or banking details over the phone, what we will do is that we will send you the direct debit mandate form of your bank which you can fill it up yourself and send it back to us. Okay?”\n\n(Customer: Okay.)\n\n“And just to send you the correct direct debit mandate form, which bank you generally deal with?”`,
          pauseInstruction: "Customer provides Bank Name (e.g. Barclays, Lloyds, NatWest). Select/record their bank.",
          quickResponses: [
            {
              label: "Bank Provided (e.g. Barclays / Lloyds / NatWest)",
              actionDescription: "Customer specifies their banking provider.",
              autoFill: { dpaMandateFormRequested: true },
              nextStage: "STEP_9_VERIFICATION_HANDOFF",
              guidance: "Acknowledge bank and transition to colleague verbal confirmation handoff.",
            },
            {
              label: "Customer: “Why do you need to know my bank?”",
              actionDescription: "Customer asks why bank name is required.",
              guidance: "Reassure: “Each bank has its own specific Direct Debit mandate form with their logo and address, so we just make sure we post you the exact form for your bank.”",
            },
            {
              label: "Customer pays by Cash / Cheque",
              actionDescription: "Customer does not currently use Direct Debit.",
              guidance: "Explain: “Direct Debit with Sparta ensures your 24-month price guarantee and automatic discounts, and we will send you the mandate form to review comfortably in the post.”",
            },
          ],
          why: "Explicitly stating DPA 1998 compliance and refusing to take sensitive bank numbers over the phone eliminates scam fear and builds massive credibility.",
          nextStage: "STEP_9_VERIFICATION_HANDOFF",
          prevStage: "STEP_7_ENGINEER_ROUTER_COST",
        };

      // =============================================================
      // STEP 9 — VERIFICATION HANDOFF
      // =============================================================
      case "STEP_9_VERIFICATION_HANDOFF":
      case "PHASE_5_VERIFICATION_CLOSING":
      case "STAGE_7_FINAL_CONFIRMATION":
      case "STAGE_8_BEFORE_AGREEMENT":
      case "STAGE_9_CUSTOMER_DECISION":
      default:
        return {
          stage: "STEP_9_VERIFICATION_HANDOFF",
          stageNumber: 9,
          stageName: "Step 9: Verification Handoff",
          stepShortTitle: "Verification Handoff",
          objective: "Warm, professional handoff to colleague for verbal confirmation that customer understood switchover before processing arrangements.",
          goldenRuleNote: "Hand over with warmth. Colleague takes verbal confirmation of understanding.",
          getSayText: () =>
            `“Perfectly fine, now everything is done from my side and in a minute one of my colleagues will just be taking a verbal confirmation from you that you've understood about this switchover, so you just have to give an affirmative response so that we can move further smoothly to do the arrangements, okay?”\n\n(Customer: Okay.)\n\n“Here's my colleague just have a word with him...”`,
          pauseInstruction: "Customer confirms 'Okay'. Hand over line to colleague for verbal switchover confirmation.",
          quickResponses: [
            {
              label: "Customer: “Okay” (Handoff Accepted)",
              actionDescription: "Customer gives affirmative response and accepts verbal confirmation handoff.",
              autoFill: { finalConfirmationGiven: true, customerDecision: "YES" },
              guidance: "Lead successfully completed! Connect to verification colleague.",
            },
            {
              label: "Customer asks: “What will they ask me?”",
              actionDescription: "Customer asks what colleague will ask.",
              guidance: "Say: “Just a quick 30-second verbal confirmation that you're happy with the switchover to digital and understand Sparta Telecom is looking after your line.”",
            },
          ],
          why: "Two-party verbal confirmation ensures regulatory compliance, customer comprehension, and high lead quality.",
          nextStage: "STEP_9_VERIFICATION_HANDOFF",
          prevStage: "STEP_8_DIRECT_DEBIT_DPA1998",
        };
    }
  }
}
