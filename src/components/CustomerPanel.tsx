import React from "react";
import {
  ShieldCheck,
  Receipt,
  Percent,
  CheckCircle2,
  HardDrive,
  Clock,
  Phone,
  Wifi,
  Building,
  AlertTriangle,
  CreditCard,
  UserCheck,
  Radio,
} from "lucide-react";
import { CustomerRecord, OfferConfig } from "../types";
import { CalculatorTools } from "../engine/calculatorTools";

interface CustomerPanelProps {
  customer: CustomerRecord;
  config: OfferConfig;
  onOpenDobCalculator: () => void;
  onOpenBillCalculator: () => void;
  onOpenVatCalculator?: () => void;
  onOpenIbanCalculator?: () => void;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({
  customer,
  config: _config,
  onOpenDobCalculator,
  onOpenBillCalculator,
  onOpenVatCalculator,
  onOpenIbanCalculator: _onOpenIbanCalculator,
}) => {
  // Recommended plan based on customer's discovery answers
  const recommendedPlan = CalculatorTools.recommendSpartaPlan(customer);
  const selectedPlan = customer.selectedPlanId
    ? CalculatorTools.getSpartaPlanById(customer.selectedPlanId) || recommendedPlan
    : recommendedPlan;

  // Probability calculations matching the Telecom Script
  const probSavings = CalculatorTools.calculateScriptProbabilitySavings(customer);

  // 6-Section Checklist matching the official Sparta Telecom Script
  const checklist = [
    {
      label: "1. Opening Hook (Qualify Calls, BB, Bill)",
      checked: !!(customer.callVolume || customer.broadbandStatus || customer.monthlyBill || customer.personalDetailsConfirmed),
    },
    {
      label: "2. Probability & Plan Selection (A / B / C)",
      checked: !!(customer.termsUnderstood || customer.pricePromiseAcknowledged || customer.probabilityBranch),
    },
    {
      label: "3. Sparta Brand & Openreach Network Pitch",
      checked: !!(customer.spartaBtPlatformAcknowledged || customer.brandDropAcknowledged),
    },
    {
      label: "4. Safety, Account Holder & Free Features",
      checked: !!(
        customer.isPrimaryAccountHolder !== undefined ||
        customer.socialAlarmStatus ||
        customer.callingFeaturesConfirmed
      ),
    },
    {
      label: "5. Data Protection (UK GDPR) & Direct Debit",
      checked: !!(customer.bankName || customer.dpaMandateFormRequested || customer.paymentMethod),
    },
    {
      label: "6. Compliance Day Check & Verification Handoff",
      checked: !!(
        customer.isDayVerified ||
        customer.verificationOfficerHandoff ||
        customer.finalConfirmationGiven ||
        customer.customerDecision === "YES"
      ),
    },
  ];

  const checkedCount = checklist.filter((c) => c.checked).length;

  return (
    <aside className="bg-slate-900/60 backdrop-blur-md border-l border-slate-800/80 p-3.5 flex flex-col h-full overflow-y-auto space-y-3.5 select-none text-xs">
      {/* 1. CUSTOMER IDENTITY & DETAILS */}
      <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Customer &amp; Landline
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sparta-950 text-sparta-400 border border-sparta-800 flex items-center gap-0.5">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>ACTIVE LINE</span>
          </span>
        </div>

        <div className="font-bold text-white text-sm">
          {customer.firstName || customer.lastName
            ? `${customer.title || "Mr"} ${customer.firstName || ""} ${customer.lastName || "Campbell"}`
            : "Mr Campbell"}
        </div>
        <div className="text-slate-300 font-mono text-xs">
          {customer.address || "14 Highfield Road"}, {customer.postcode || "B33 8TH"}
        </div>
        <div className="text-slate-400 font-mono text-xs flex items-center gap-1">
          <Phone className="w-3 h-3 text-sparta-400" />
          <span>{customer.contactNumber || "123455466"}</span>
        </div>

        {/* DOB */}
        <div className="text-[11px] text-indigo-300 pt-1 border-t border-slate-900 flex items-center justify-between">
          <span>DOB: {customer.dob || "14/05/1952"}</span>
          <button
            onClick={onOpenDobCalculator}
            className="text-[10px] underline hover:text-indigo-200"
          >
            Age Tool
          </button>
        </div>

        {/* Primary Account Holder & Decision Maker */}
        <div className="text-[11px] pt-1 border-t border-slate-900 flex items-center justify-between">
          <span className="text-slate-400">Primary Decision Maker:</span>
          <span
            className={`font-semibold ${
              customer.isPrimaryAccountHolder
                ? "text-emerald-400"
                : customer.isPrimaryAccountHolder === false
                ? "text-rose-400"
                : "text-amber-400"
            }`}
          >
            {customer.isPrimaryAccountHolder
              ? "✓ Confirmed"
              : customer.isPrimaryAccountHolder === false
              ? "✕ Not Primary"
              : "Pending Verification"}
          </span>
        </div>

        {/* Social Alarm / Pendant Check */}
        <div className="text-[11px] pt-1 border-t border-slate-900 flex items-center justify-between">
          <span className="text-slate-400">Social Alarm / Pendant:</span>
          <span
            className={`font-semibold ${
              customer.socialAlarmStatus === "NO"
                ? "text-emerald-400"
                : customer.socialAlarmStatus
                ? "text-cyan-400"
                : "text-slate-400"
            }`}
          >
            {customer.socialAlarmStatus === "NO"
              ? "No Alarm (None)"
              : customer.socialAlarmStatus === "YES_COPPER"
              ? "Copper Line Alarm"
              : customer.socialAlarmStatus === "YES_DIGITAL_SOCKET"
              ? "Wall Socket (Verified)"
              : "Unchecked"}
          </span>
        </div>

        {/* Compliance Day Verification */}
        {customer.isDayVerified && (
          <div className="text-[11px] pt-1 border-t border-slate-900 flex items-center justify-between text-emerald-400">
            <span>Day of Week Checked:</span>
            <span className="font-bold">✓ Spot on ({customer.dayVerificationAnswer || "Verified"})</span>
          </div>
        )}
      </div>

      {/* 2. PROBABILITY PROFILE & SAVINGS */}
      <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Probability Profile
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
            {probSavings.branch.replace("_", " ")}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400">Home Phone Usage:</span>
          <span className="font-semibold text-slate-200">
            {customer.callVolume === "HIGH_FREQUENT"
              ? "Quite a lot for calls"
              : customer.callVolume === "LOW_HARDLY_ANY"
              ? "Mostly incoming calls"
              : "Standard Usage"}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400">Broadband on Same Line:</span>
          <span className="font-semibold text-slate-200">
            {customer.broadbandStatus === "FIBRE_BROADBAND"
              ? "Yes (Fibre Broadband)"
              : customer.broadbandStatus === "NORMAL_BROADBAND"
              ? "Yes (Running on line)"
              : "No (Landline Only)"}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400">Current Monthly Bill:</span>
          <span className="font-bold text-amber-300 font-mono">
            {customer.monthlyBill ? `£${customer.monthlyBill.toFixed(2)}/mo` : "Around £40-£60"}
          </span>
        </div>

        {customer.billOrProviderConfused && (
          <div className="bg-amber-950/40 p-2 rounded-xl border border-amber-800/60 text-amber-300 text-[10px] flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span>Note: Customer uncertain about exact bill/provider. Soft pacing applied.</span>
          </div>
        )}

        {/* Calculated Monthly & 2-Year Savings */}
        <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-800/50 mt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-emerald-300 font-medium">Digital Package:</span>
            <span className="font-bold text-white font-mono">£{probSavings.formattedMonthlyPrice}/mo</span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-emerald-300 font-medium">Monthly Savings:</span>
            <span className="font-black text-emerald-400 font-mono">£{probSavings.formattedMonthlySavings}/mo</span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1 pt-1 border-t border-emerald-800/40">
            <span className="text-sparta-300 font-bold">Total 2-Year Savings:</span>
            <span className="font-black text-sparta-400 font-mono">£{probSavings.formattedTwoYearSavings}</span>
          </div>
        </div>
      </div>

      {/* 3. REVISED SPARTA TELECOM PACKAGE */}
      <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sparta-400">
            Sparta Digital Package
          </span>
          <div className="flex items-center gap-1">
            {onOpenVatCalculator && (
              <button
                onClick={onOpenVatCalculator}
                className="text-[10px] font-bold text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-0.5"
                title="Open 20% VAT Calculator [V]"
              >
                <Receipt className="w-2.5 h-2.5" />
                <span>20% VAT</span>
              </button>
            )}
            <span className="text-slate-600">•</span>
            <button
              onClick={onOpenBillCalculator}
              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-0.5"
              title="Open Savings Calculator [S]"
            >
              <Percent className="w-2.5 h-2.5" />
              <span>Savings</span>
            </button>
          </div>
        </div>

        <div className="font-bold text-white text-xs truncate">
          {selectedPlan.name}
        </div>
        <div className="text-[10px] text-slate-400">
          Exact phone number &amp; line unchanged
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400">1471 / 1571 Voicemail:</span>
          <span className="font-bold text-emerald-400">
            FREE (£0)
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400">Paper Itemized Bill:</span>
          <span className="font-semibold text-slate-200">
            Free 2 mo, then £1 (deactivate anytime)
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400">Platform:</span>
          <span className="font-semibold text-indigo-300">
            BT Platform (Separate Company)
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>Agreement Duration:</span>
          </span>
          <span className="font-bold text-indigo-300">
            24 Months Effective
          </span>
        </div>
      </div>

      {/* 4. LIVE CALL CHECKLIST */}
      <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Script Progression
          </span>
          <span className="text-[10px] font-mono text-sparta-400 font-bold">
            {checkedCount} / {checklist.length}
          </span>
        </div>

        <div className="space-y-1 text-[11px]">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 ${
                item.checked ? "text-slate-200" : "text-slate-500"
              }`}
            >
              <span
                className={`flex-shrink-0 ${
                  item.checked ? "text-emerald-400 font-bold" : "text-slate-600"
                }`}
              >
                {item.checked ? "✓" : "○"}
              </span>
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
