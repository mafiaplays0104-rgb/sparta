import React, { useState } from "react";
import {
  CheckCircle,
  Copy,
  RotateCcw,
  Check,
  ShieldCheck,
  FileText,
  PhoneOff,
  User,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  Customer,
  OfferConfig,
  CallNotes,
  ConsentRecord,
  EndReason,
  CallbackDetails,
} from "../types";
import { SecurityEngine } from "../engine/securityEngine";

interface CallSummaryModalProps {
  isOpen: boolean;
  endReason: EndReason;
  customer: Customer;
  config: OfferConfig;
  notes: CallNotes;
  consents: ConsentRecord[];
  callbackDetails?: CallbackDetails;
  isDirectDebitRecorded: boolean;
  onResetCall: () => void;
  onClose: () => void;
}

export const CallSummaryModal: React.FC<CallSummaryModalProps> = ({
  isOpen,
  endReason,
  customer,
  config,
  notes,
  consents,
  callbackDetails,
  isDirectDebitRecorded,
  onResetCall,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const paymentConsent = consents.find((c) => c.category === "PAYMENT");
  const paymentStatus = isDirectDebitRecorded
    ? "Completed (Verified & Masked)"
    : paymentConsent?.status === "GRANTED"
    ? "Consent Granted (Incomplete)"
    : paymentConsent?.status === "DECLINED"
    ? "Declined by Customer"
    : "Not Started";

  const customerDetailsStatus =
    customer.firstName && customer.lastName && customer.address?.postcode
      ? "Complete"
      : "Incomplete";

  const eligibilityStatus =
    customer.isEligibleAge === true
      ? "Confirmed (Within Range)"
      : customer.isEligibleAge === false
      ? "Outside Configured Bracket"
      : "Not Screened";

  const getCleanSummaryText = () => {
    return `--- SPARTA LIVE CALL SUMMARY ---
Campaign: ${config.campaignName} (v${config.scriptVersion})
Outcome: ${endReason}
Customer: ${customer.firstName || ""} ${customer.lastName || "Caller"}
Service: ${customer.serviceType || "Unknown"}
Service Issue: ${customer.issueStatus || "None"}
Baseline Bill: ${customer.lastBillAmount ? `£${customer.lastBillAmount}` : "Unspecified"}
Offer Presented: Up to ${config.maxDiscountPercent}% Direct Debit Reduction
Eligibility: ${eligibilityStatus}
Details: ${customerDetailsStatus}
Payment: ${paymentStatus}
${callbackDetails?.requested ? `Callback Booked: ${callbackDetails.preferredDate} (${callbackDetails.preferredTime})` : ""}
Customer Concern: ${SecurityEngine.sanitizeNotes(notes.customerConcern || "None")}
Follow-up Required: ${SecurityEngine.sanitizeNotes(notes.followUp || "None")}
Escalation Reason: ${SecurityEngine.sanitizeNotes(notes.escalationReason || "None")}
General Notes: ${SecurityEngine.sanitizeNotes(notes.generalNotes || "None")}
Compliance: No sensitive card/PIN data recorded. Direct Debit mandate masked.
---------------------------------`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(getCleanSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Call Conclusion & Audit Summary
              </h2>
              <p className="text-[11px] text-slate-400">
                Safe, sanitized record for CRM logging and compliance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy for CRM"}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Status Badge Card */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                Final Call Status
              </span>
              <span className="text-sm font-extrabold text-sparta-300">{endReason}</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-sparta-600/20 text-sparta-300 border border-sparta-500/30 font-semibold font-mono">
              Campaign: {config.campaignName}
            </span>
          </div>

          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Customer:</span>
              <span className="text-white font-medium">
                {customer.firstName || customer.lastName
                  ? `${customer.firstName || ""} ${customer.lastName || ""}`
                  : "Caller"}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Service Discovered:</span>
              <span className="text-white font-medium">{customer.serviceType || "Unknown"}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Service Issue:</span>
              <span className={customer.issueStatus && customer.issueStatus !== "NONE" ? "text-amber-400 font-semibold" : "text-emerald-400 font-medium"}>
                {customer.issueStatus || "None"}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Current Bill:</span>
              <span className="text-white font-mono font-medium">
                {customer.lastBillAmount ? `£${customer.lastBillAmount}/mo` : "Not disclosed"}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Eligibility (DOB):</span>
              <span className="text-white font-medium">{eligibilityStatus}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Customer Details:</span>
              <span className="text-white font-medium">{customerDetailsStatus}</span>
            </div>
          </div>

          {/* Payment Status (NEVER raw bank info) */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[10px]">Direct Debit Payment Status:</span>
              <span className="text-white font-semibold">{paymentStatus}</span>
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PCI Compliant (No banking details saved in summary)</span>
            </div>
          </div>

          {/* Callback Details if any */}
          {callbackDetails?.requested && (
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/60 text-blue-200 space-y-1">
              <span className="font-bold flex items-center gap-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Scheduled Callback Details</span>
              </span>
              <p className="text-[11px]">
                {callbackDetails.preferredDate} at {callbackDetails.preferredTime}
              </p>
              <p className="text-slate-400 text-[10px]">Reason: {callbackDetails.reason}</p>
            </div>
          )}

          {/* Notes */}
          {(notes.customerConcern || notes.followUp || notes.generalNotes) && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-slate-500 block text-[10px] font-bold uppercase">
                Sanitized Advisor Notes
              </span>
              {notes.customerConcern && (
                <div className="text-slate-300">
                  <strong className="text-slate-400">Concern:</strong> {notes.customerConcern}
                </div>
              )}
              {notes.followUp && (
                <div className="text-slate-300">
                  <strong className="text-slate-400">Follow-up:</strong> {notes.followUp}
                </div>
              )}
              {notes.generalNotes && (
                <div className="text-slate-300">
                  <strong className="text-slate-400">Notes:</strong> {notes.generalNotes}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
          >
            Review Call Again
          </button>

          <button
            onClick={onResetCall}
            className="px-4 py-2 rounded-lg bg-sparta-600 hover:bg-sparta-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-glow-primary"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ready for Next Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
