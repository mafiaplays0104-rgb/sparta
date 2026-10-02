import React from "react";
import {
  ShieldCheck,
  Percent,
} from "lucide-react";
import { CustomerRecord, OfferConfig } from "../types";

interface CustomerPanelProps {
  customer: CustomerRecord;
  config: OfferConfig;
  onOpenDobCalculator: () => void;
  onOpenBillCalculator: () => void;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({
  customer,
  config: _config,
  onOpenDobCalculator,
  onOpenBillCalculator,
}) => {
  // Compact Checklist matching 30% reduction live flow
  const checklist = [
    { label: "Consumer ID Check (Sec 7)", checked: !!(customer.consumerId || customer.customerId || customer.consumerIdStatus === "VERIFIED") },
    { label: "Home Service (Sec 9)", checked: customer.isUsingAtHome !== undefined && customer.isUsingAtHome !== "UNCONFIRMED" },
    { label: "Monthly Bill (Sec 10)", checked: customer.monthlyBill !== undefined },
    { label: "Reduction Explained (Sec 11)", checked: customer.finalConfirmationGiven || customer.monthlyBill !== undefined },
    { label: "Terms Understood (Sec 46)", checked: !!customer.termsUnderstood },
    { label: "Customer Decision (Sec 48/49)", checked: !!customer.customerDecision },
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
      </div>

      {/* 2. CURRENT SERVICE & 30% SAVINGS */}
      <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Telephone Service
          </span>
          <button
            onClick={onOpenBillCalculator}
            className="text-[10px] font-bold text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            <span>30% Calc</span>
          </button>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-400">Monthly Bill:</span>
          <span className="font-bold text-emerald-400 font-mono text-xs">
            {customer.monthlyBill !== undefined
              ? `£${customer.monthlyBill.toFixed(2)}`
              : "—"}
          </span>
        </div>

        {customer.monthlyBill !== undefined && (
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">30% Discount:</span>
            <span className="font-bold text-sparta-300 font-mono text-xs">
              £{(customer.monthlyBill * 0.7).toFixed(2)}/mo
            </span>
          </div>
        )}

        <div className="flex justify-between py-0.5">
          <span className="text-slate-400">Home Service:</span>
          <span className="text-slate-200 font-medium">
            {customer.isUsingAtHome === "YES"
              ? "✓ At Home"
              : customer.isUsingAtHome === "NO"
              ? "✕ Not Home"
              : customer.isUsingAtHome === "DONT_KNOW"
              ? "? Unsure"
              : "—"}
          </span>
        </div>

        {customer.customerDecision && (
          <div className="flex justify-between py-0.5 items-center pt-1 border-t border-slate-900">
            <span className="text-slate-400">Decision:</span>
            <span className={customer.customerDecision === "YES" ? "text-emerald-400 font-bold" : "text-rose-400 font-medium"}>
              {customer.customerDecision === "YES" ? "✓ Proceed (30%)" : "✕ Declined"}
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
          <span className="text-[10px] font-mono text-sparta-400 font-bold">
            {checkedCount} / {checklist.length}
          </span>
        </div>

        <div className="space-y-1 text-[11px]">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 ${
                item.checked ? "text-slate-300" : "text-slate-500"
              }`}
            >
              <span className={item.checked ? "text-emerald-400 font-bold" : "text-slate-600"}>
                {item.checked ? "✓" : "○"}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
