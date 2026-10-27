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
  onOpenIbanCalculator,
}) => {
  // Recommended plan based on customer's discovery answers
  const recommendedPlan = CalculatorTools.recommendSpartaPlan(customer);
  const selectedPlan = customer.selectedPlanId
    ? CalculatorTools.getSpartaPlanById(customer.selectedPlanId) || recommendedPlan
    : recommendedPlan;

  // Comparison against current bill if available
  const comparison = customer.monthlyBill
    ? CalculatorTools.calculateSpartaComparison(customer.monthlyBill, selectedPlan)
    : null;

  // 9 Master Steps Checklist
  const checklist = [
    {
      label: "1. Opening & Technical Pitch",
      checked: !!(customer.firstName || customer.personalDetailsConfirmed),
    },
    {
      label: "2. Probability Qualified (Usage & Bill)",
      checked: !!(customer.callVolume || customer.broadbandStatus || customer.monthlyBill),
    },
    {
      label: "3. Dynamic Package Pitch (+VAT)",
      checked: !!(customer.selectedPlanId || customer.termsUnderstood),
    },
    {
      label: "4. Sparta Brand Drop & Openreach",
      checked: !!(customer.brandDropAcknowledged || customer.pricePromiseAcknowledged),
    },
    {
      label: "5. Details & Pensioner Rapport",
      checked: !!(customer.dob || customer.isEligibleAge),
    },
    {
      label: "6. Free 1571 & Extension Checked",
      checked: customer.hasExtensionPhones !== undefined,
    },
    {
      label: "7. Free Engineer & £30 Router",
      checked: !!customer.routerFeeAdjustedAcknowledged,
    },
    {
      label: "8. Direct Debit & DPA 1998 Form",
      checked: !!(customer.bankName || customer.dpaMandateFormRequested),
    },
    {
      label: "9. Colleague Verbal Handoff",
      checked: !!(customer.finalConfirmationGiven || customer.customerDecision === "YES"),
    },
  ];

  const checkedCount = checklist.filter((c) => c.checked).length;

  return (
    <aside className="bg-slate-900/60 backdrop-blur-md border-l border-slate-800/80 p-3.5 flex flex-col h-full overflow-y-auto space-y-3.5 select-none text-xs">
      {/* 1. CUSTOMER IDENTITY & ACCOUNT */}
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
            ? `${customer.title || "Mr/Mrs"} ${customer.firstName || ""} ${customer.middleInitial ? customer.middleInitial + ". " : ""}${customer.lastName || ""}`
            : "Customer"}
        </div>
        <div className="text-slate-300 font-mono text-xs">
          {customer.address || "14 Highfield Road"}, {customer.postcode || "B33 8TH"}
        </div>
        <div className="text-slate-400 font-mono text-xs flex items-center gap-1">
          <Phone className="w-3 h-3 text-sparta-400" />
          <span>{customer.contactNumber || "0121 496 0123"}</span>
        </div>

        {/* DOB & Pensioner Rapport */}
        <div className="text-[11px] text-indigo-300 pt-1 border-t border-slate-900 flex items-center justify-between">
          <span>DOB: {customer.dob || "14/05/1952"}</span>
          <button
            onClick={onOpenDobCalculator}
            className="text-[10px] underline hover:text-indigo-200"
          >
            Age Tool
          </button>
        </div>

        {/* Medical Alarm check */}
        <div className="text-[11px] pt-1 border-t border-slate-900 flex items-center justify-between">
          <span className="text-slate-400">Medical Alarm (Lifeline):</span>
          <span
            className={`font-semibold ${
              customer.medicalAlarm ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {customer.medicalAlarm ? "Yes (Careline)" : "None (Independent)"}
          </span>
        </div>

        {/* Extension phones */}
        {customer.extensionType && (
          <div className="text-[11px] pt-1 border-t border-slate-900 flex items-center justify-between">
            <span className="text-slate-400">Extension Phones:</span>
            <span className="font-semibold text-slate-200">
              {customer.extensionType === "CORDLESS"
                ? "Cordless (Compatible)"
                : customer.extensionType === "CORDED"
                ? "Corded (Engineer Setup)"
                : "None"}
            </span>
          </div>
        )}
      </div>

      {/* 2. PROBABILITY QUALIFICATION & USAGE */}
      <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Probability Profile
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
            {CalculatorTools.determineProbabilityBranch(customer).replace("_", " ")}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400">Call Volume:</span>
          <span className="font-semibold text-slate-200">
            {customer.callVolume === "LOW_HARDLY_ANY"
              ? "Hardly Any / Low"
              : customer.callVolume === "HIGH_FREQUENT"
              ? "A Lot / Frequent"
              : "Average Usage"}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400">Broadband:</span>
          <span className="font-semibold text-slate-200">
            {customer.broadbandStatus === "FIBRE_BROADBAND"
              ? "Fibre 40 / 80"
              : customer.broadbandStatus === "NORMAL_BROADBAND"
              ? "Normal BB (24Mbps)"
              : "None (Landline Only)"}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400">Current Average Bill:</span>
          <span className="font-bold text-amber-300 font-mono">
            {customer.monthlyBill ? `£${customer.monthlyBill.toFixed(2)}/mo` : "Not provided"}
          </span>
        </div>

        {customer.bankName && (
          <div className="flex justify-between items-center py-0.5 text-[11px] pt-1 border-t border-slate-900">
            <span className="text-slate-400 flex items-center gap-1">
              <Building className="w-3 h-3 text-cyan-400" />
              <span>DPA Bank Form:</span>
            </span>
            <span className="font-bold text-cyan-300">
              {customer.bankName}
            </span>
          </div>
        )}
      </div>

      {/* 3. REVISED SPARTA TELECOM PACKAGE */}
      <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sparta-400">
            Sparta Package
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
          {selectedPlan.minutes} • {selectedPlan.broadbandSpeed}
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400">Base Price:</span>
          <span className="font-bold text-slate-200 font-mono text-xs">
            {selectedPlan.displayBase}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="text-teal-400">UK VAT (20%):</span>
          <span className="font-bold text-teal-400 font-mono text-xs">
            +£{selectedPlan.vatAmount.toFixed(2)}/mo
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-t border-b border-slate-900 bg-emerald-950/20 px-1.5 rounded-lg">
          <span className="text-emerald-300 font-bold">Total Gross Bill:</span>
          <span className="font-black text-emerald-400 font-mono text-sm">
            {selectedPlan.displayGross}
          </span>
        </div>

        {/* Savings vs Current Bill */}
        {comparison && comparison.isSaving && (
          <div className="flex justify-between items-center py-0.5 text-[11px] bg-emerald-950/40 px-1.5 py-1 rounded text-emerald-300 font-semibold">
            <span>Customer Saves:</span>
            <span className="font-mono font-bold text-emerald-400">
              £{comparison.monthlySavings.toFixed(2)}/mo (£{comparison.twoYearSavings.toFixed(2)} / 2 yrs)
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-slate-400" />
            <span>Router Fee:</span>
          </span>
          <span className="font-semibold text-amber-300 font-mono">
            £30 (Adjusted future bill)
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400">Engineer Visit:</span>
          <span className="font-bold text-emerald-400">
            FREE (£0)
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>Price Promise:</span>
          </span>
          <span className="font-bold text-indigo-300">
            24 Months Locked
          </span>
        </div>

        {customer.customerDecision && (
          <div className="flex justify-between py-0.5 items-center pt-1 border-t border-slate-900">
            <span className="text-slate-400">Decision:</span>
            <span
              className={
                customer.customerDecision === "YES"
                  ? "text-emerald-400 font-bold"
                  : "text-rose-400 font-medium"
              }
            >
              {customer.customerDecision === "YES" ? `✓ Confirmed (${selectedPlan.displayGross})` : "✕ Declined"}
            </span>
          </div>
        )}
      </div>

      {/* 4. LIVE CALL CHECKLIST */}
      <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            9 Master Steps
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
