import React from "react";
import {
  CheckCircle2,
  Circle,
  Calendar,
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
  config,
  onOpenDobCalculator,
  onOpenBillCalculator,
}) => {
  // Compact Checklist
  const checklist = [
    { label: "Customer Name", checked: !!(customer.firstName || customer.lastName) },
    { label: "Address", checked: !!customer.doorNumber },
    { label: "Postcode", checked: !!customer.postcode },
    { label: "Customer ID", checked: !!(customer.customerId || customer.customerIdStatus) },
    { label: "Mobile", checked: !!(customer.mobileNumber || customer.hasMobile !== undefined) },
    { label: "Medical Alarm", checked: customer.medicalAlarm !== undefined },
    { label: "TV Details", checked: !!(customer.tvMakeModel || customer.hasTvService !== undefined) },
  ];

  const checkedCount = checklist.filter((c) => c.checked).length;

  return (
    <aside className="bg-slate-900/60 backdrop-blur-md border-l border-slate-800/80 p-3.5 flex flex-col h-full overflow-y-auto space-y-3.5 select-none text-xs">
      {/* 1. CUSTOMER IDENTITY */}
      <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Customer
        </span>
        <div className="font-bold text-white text-sm">
          {customer.firstName || customer.lastName
            ? `${customer.title || "Mr/Mrs"} ${customer.firstName || ""} ${customer.lastName || ""}`
            : "—"}
        </div>
        <div className="text-slate-300 font-mono text-xs">
          {customer.doorNumber ? `${customer.doorNumber}, ` : ""}
          {customer.postcode || "—"}
        </div>
        <div className="text-slate-400 font-mono text-xs">
          {customer.contactNumber || "—"}
        </div>
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

      {/* 2. CURRENT SERVICE */}
      <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Current Service
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

        <div className="flex justify-between py-0.5">
          <span className="text-slate-400">Landline:</span>
          <span className="text-slate-200">
            {customer.landlineUsage ? customer.landlineUsage.replace(/_/g, " ") : "—"}
          </span>
        </div>

        <div className="flex justify-between py-0.5">
          <span className="text-slate-400">Broadband:</span>
          <span className="text-slate-200">
            {customer.billIncludesBroadband === true ? "Yes" : customer.billIncludesBroadband === false ? "No" : "—"}
          </span>
        </div>

        <div className="flex justify-between py-0.5">
          <span className="text-slate-400">TV:</span>
          <span className="text-slate-200 truncate max-w-[120px]">
            {customer.tvMakeModel || (customer.hasTvService === true ? "Yes" : "—")}
          </span>
        </div>
      </div>

      {/* 3. CONTACT & SAFETY */}
      {(customer.mobileNumber || customer.hasMobile || customer.medicalAlarm !== undefined) && (
        <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Contact &amp; Safety
          </span>

          {customer.mobileNumber && (
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Mobile:</span>
              <span className="text-slate-200 font-mono">{customer.mobileNumber}</span>
            </div>
          )}

          {customer.mobileNetwork && (
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400">Network:</span>
              <span className="text-slate-200">{customer.mobileNetwork}</span>
            </div>
          )}

          {customer.medicalAlarm !== undefined && (
            <div className="flex justify-between py-0.5 items-center">
              <span className="text-slate-400">Medical Alarm:</span>
              <span className={customer.medicalAlarm ? "text-rose-400 font-bold" : "text-emerald-400 font-medium"}>
                {customer.medicalAlarm ? "⚠️ Present" : "No Alarm"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 4. COMPACT COLLECTION CHECKLIST */}
      <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Collection
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
