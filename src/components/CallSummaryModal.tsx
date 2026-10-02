import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Download,
  ShieldCheck,
  Percent,
} from "lucide-react";
import {
  CustomerRecord,
  OfferConfig,
  CallDisposition,
  CallbackDetails,
  CallAuditLog,
} from "../types";
import { MasterScriptEngine } from "../engine/masterScriptEngine";
import { CalculatorTools } from "../engine/calculatorTools";

interface CallSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerRecord;
  config: OfferConfig;
  disposition: CallDisposition;
  onSelectDisposition: (disposition: CallDisposition) => void;
  callbackDetails?: CallbackDetails;
  auditLogs: CallAuditLog[];
  onResetCall: () => void;
}

export const CallSummaryModal: React.FC<CallSummaryModalProps> = ({
  isOpen,
  onClose,
  customer,
  config,
  disposition,
  onSelectDisposition,
  callbackDetails,
  auditLogs: _auditLogs,
  onResetCall,
}) => {
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const dispositionsList: { id: CallDisposition; label: string; category: string }[] = [
    { id: "LEAD_COMPLETED", label: "Lead Completed (30% Reduction Accepted)", category: "SUCCESS" },
    { id: "CUSTOMER_NOT_INTERESTED", label: "Customer Not Interested / Declined", category: "REFUSAL" },
    { id: "CUSTOMER_BUSY", label: "Customer Busy", category: "AVAILABILITY" },
    { id: "CALL_BACK_REQUESTED", label: "Callback Requested", category: "FOLLOW_UP" },
    { id: "SECURITY_CONCERN", label: "Security Concern / Scam Suspicion", category: "SECURITY" },
    { id: "INFORMATION_NOT_AVAILABLE", label: "Information Not Available", category: "UNRESOLVED" },
    { id: "CUSTOMER_REFUSED_VERIFICATION", label: "Customer Refused Verification", category: "REFUSAL" },
    { id: "INVALID_INFORMATION", label: "Invalid Information Provided", category: "VALIDATION" },
    { id: "WRONG_PERSON", label: "Wrong Person Answered", category: "IDENTITY" },
    { id: "WRONG_NUMBER", label: "Wrong Number / Unobtainable", category: "IDENTITY" },
    { id: "DO_NOT_CALL", label: "Do Not Call (Suppression Required)", category: "COMPLIANCE" },
    { id: "TECHNICAL_ISSUE", label: "Technical Issue / Audio Dropped", category: "SYSTEM" },
    { id: "ESCALATED", label: "Escalated to Senior Team", category: "ESCALATION" },
    { id: "SYSTEM_ERROR", label: "System Error", category: "SYSTEM" },
  ];

  const billCalc = customer.monthlyBill
    ? CalculatorTools.calculateBillSavings(customer.monthlyBill, config.maxDiscountPercent)
    : null;

  const leadPayload = {
    callId: `UKTEL-${Date.now().toString().slice(-6)}`,
    advisor: config.advisorName || "Peter",
    company: config.companyName || "[COMPANY NAME]",
    agentReference: config.approvedAgentId || "[APPROVED ID]",
    timestamp: new Date().toISOString(),
    campaign: config.campaignName,
    scriptVersion: config.scriptVersion,
    disposition,
    customer: {
      title: customer.title || "Mr/Mrs",
      firstName: customer.firstName || "Unknown",
      lastName: customer.lastName || "Unknown",
      contactNumber: customer.contactNumber || customer.mobileNumber || "",
      address: {
        doorNumber: customer.doorNumber || "",
        postcode: customer.postcode || "",
        fullAddress: customer.address || "",
      },
      consumerId: customer.consumerId || customer.customerId || "",
      consumerIdStatus: customer.consumerIdStatus || customer.customerIdStatus || "NOT_AVAILABLE",
      isUsingAtHome: customer.isUsingAtHome || "UNCONFIRMED",
    },
    serviceAndSavings: {
      currentMonthlyBill: customer.monthlyBill || 0,
      billApproximate: !!customer.billApproximate,
      discountPercent: config.maxDiscountPercent,
      discountedMonthlyPrice: billCalc ? billCalc.discountedPrice : 0,
      monthlySavings: billCalc ? billCalc.monthlySavings : 0,
      annualSavings: billCalc ? billCalc.annualSavings : 0,
      termsUnderstood: !!customer.termsUnderstood,
      customerDecision: customer.customerDecision || "UNDECIDED",
    },
    callback: callbackDetails,
    advisorNotes: notes,
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(leadPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leadPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Lead-${leadPayload.callId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Call Conclusion &amp; Lead Summary
              </h2>
              <p className="text-[11px] text-slate-400">
                UK Telecom 30% Bill Reduction Campaign Summary (Advisor: {config.advisorName || "Peter"})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Disposition Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold uppercase tracking-wider text-[10px] block">
              Select Final Call Disposition:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dispositionsList.map((d) => (
                <button
                  key={d.id}
                  onClick={() => onSelectDisposition(d.id)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    disposition === d.id
                      ? "bg-emerald-600 text-white font-bold border-emerald-500 shadow-sm"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[11px]">{d.label}</div>
                  <span className="text-[9px] opacity-70 font-mono">{d.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lead Summary Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Customer</span>
              <div className="font-bold text-white text-sm">
                {MasterScriptEngine.getCustomerDisplayName(customer) || "Customer"}
              </div>
              <div className="text-slate-400 font-mono">{customer.contactNumber || "—"}</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Consumer ID</span>
              <div className="font-bold text-sparta-300 font-mono text-sm">
                {customer.consumerId || customer.customerId || "Not Provided"}
              </div>
              <span className="text-[10px] text-slate-400">
                Status: {customer.consumerIdStatus || "UNVERIFIED"}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">30% Savings</span>
              <div className="font-bold text-emerald-400 font-mono text-sm">
                {billCalc ? `${billCalc.formattedMonthlySavings}/mo` : "—"}
              </div>
              <span className="text-[10px] text-indigo-300 font-mono">
                {billCalc ? `${billCalc.formattedAnnualSavings}/yr` : "—"}
              </span>
            </div>
          </div>

          {/* Advisor Notes */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold uppercase tracking-wider text-[10px] block">
              Advisor Notes &amp; Observations:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record compliant call notes (e.g. customer accepted 30% reduction, letter to be sent)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Payload Preview */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Sanitized Lead JSON Payload
              </span>
              <button
                onClick={handleCopyPayload}
                className="text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md flex items-center gap-1 border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy JSON"}</span>
              </button>
            </div>
            <pre className="text-[10px] font-mono text-slate-300 bg-slate-900 p-2.5 rounded-lg overflow-x-auto max-h-36">
              {JSON.stringify(leadPayload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={() => {
              onResetCall();
              onClose();
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Call</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Lead</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Close Summary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
