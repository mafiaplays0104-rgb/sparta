import React from "react";
import {
  ShieldCheck,
  Receipt,
  Percent,
  CheckCircle2,
  HardDrive,
  Clock,
} from "lucide-react";
import { CustomerRecord, OfferConfig } from "../types";

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
  // Checklist matching the 5 Live Phases
  const checklist = [
    {
      label: "Phase 1: Name Verified & Rapport",
      checked: !!(customer.firstName || customer.lastName || customer.personalDetailsConfirmed),
    },
    {
      label: "Phase 2: Digital Fiber Transition",
      checked: customer.isUsingAtHome !== undefined && customer.isUsingAtHome !== "UNCONFIRMED",
    },
    {
      label: "Phase 3: £42.99 + VAT (£51.58 Total)",
      checked: customer.monthlyBill !== undefined || !!customer.termsUnderstood,
    },
    {
      label: "Phase 4: £30 Router & Free Setup",
      checked: !!customer.termsUnderstood || customer.finalConfirmationGiven,
    },
    {
      label: "Phase 5: Senior Verification Officer",
      checked: !!customer.customerDecision || !!customer.finalConfirmationGiven,
    },
  ];

  const checkedCount = checklist.filter((c) => c.checked).length;

  return (
    <aside className="bg-slate-900/60 backdrop-blur-md border-l border-slate-800/80 p-3.5 flex flex-col h-full overflow-y-auto space-y-3.5 select-none text-xs">
      {/* 1. CUSTOMER IDENTITY & ACCOUNT */}
      <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Customer &amp; Account
          </span>
          {customer.consumerIdStatus === "VERIFIED" && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>VERIFIED</span>
            </span>
          )}
        </div>

        <div className="font-bold text-white text-sm">
          {customer.firstName || customer.lastName
            ? `${customer.title || "Mr/Mrs"} ${customer.firstName || ""} ${customer.lastName || ""}`
            : "Customer"}
        </div>
        <div className="text-slate-300 font-mono text-xs">
          {customer.doorNumber ? `${customer.doorNumber}, ` : ""}
          {customer.postcode || "—"}
        </div>
        <div className="text-slate-400 font-mono text-xs">
          {customer.contactNumber || "—"}
        </div>

        {(customer.consumerId || customer.customerId) && (
          <div className="text-[11px] text-sparta-300 pt-1 border-t border-slate-900 flex items-center justify-between">
            <span className="font-mono">ID: {customer.consumerId || customer.customerId}</span>
            <span className="text-[10px] text-emerald-400 font-bold">✓ Checked</span>
          </div>
        )}

        {(customer.dob || customer.birthYear) && (
          <div className="text-[11px] text-indigo-300 pt-1 border-t border-slate-900 flex items-center justify-between">
            <span>DOB: {customer.dob || `Born ${customer.birthYear}`}</span>
            <button
              onClick={onOpenDobCalculator}
              className="text-[10px] underline hover:text-indigo-200"
            >
              Edit
            </button>
          </div>
        )}

        {(customer.sortCode || customer.accountNumber) && (
          <div className="text-[11px] text-cyan-300 pt-1 border-t border-slate-900 flex items-center justify-between">
            <span className="font-mono truncate">
              Bank: {customer.sortCode} / {customer.accountNumber}
            </span>
            {onOpenIbanCalculator && (
              <button
                onClick={onOpenIbanCalculator}
                className="text-[10px] underline hover:text-cyan-200 ml-1 flex-shrink-0"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. UPGRADE PACKAGE & PRICING */}
      <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Digital Fiber Package
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
              title="Open 30% Savings Calculator [S]"
            >
              <Percent className="w-2.5 h-2.5" />
              <span>30% Calc</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400">Net Tariff (Ex. VAT):</span>
          <span className="font-bold text-slate-200 font-mono text-xs">
            £42.99/mo
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="text-teal-400">UK VAT (20%):</span>
          <span className="font-bold text-teal-400 font-mono text-xs">
            +£8.59/mo
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-t border-b border-slate-900 bg-emerald-950/20 px-1.5 rounded-lg">
          <span className="text-emerald-300 font-bold">Total Monthly Bill:</span>
          <span className="font-black text-emerald-400 font-mono text-sm">
            £51.58/mo
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-slate-400" />
            <span>Digital Router:</span>
          </span>
          <span className="font-semibold text-amber-300 font-mono">
            £30 one-time
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400">Certified Engineer:</span>
          <span className="font-bold text-emerald-400">
            FREE (£0)
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>Price Guarantee:</span>
          </span>
          <span className="font-bold text-indigo-300">
            2 Years Locked
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
              {customer.customerDecision === "YES" ? "✓ Upgraded (£51.58)" : "✕ Declined"}
            </span>
          </div>
        )}
      </div>

      {/* 3. LIVE CALL CHECKLIST */}
      <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Call Milestones
          </span>
          <span className="text-[10px] font-mono text-teal-400 font-bold">
            {checkedCount} / {checklist.length}
          </span>
        </div>

        <div className="space-y-1.5 text-[11px]">
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
