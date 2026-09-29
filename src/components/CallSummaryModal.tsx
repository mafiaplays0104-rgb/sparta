import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  FileText,
  PhoneOff,
  Copy,
  Check,
  ShieldCheck,
  RotateCcw,
  Download,
  AlertTriangle,
} from "lucide-react";
import {
  CustomerRecord,
  OfferConfig,
  CallDisposition,
  CallbackDetails,
  CallAuditLog,
} from "../types";
import { MasterScriptEngine } from "../engine/masterScriptEngine";

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
  auditLogs,
  onResetCall,
}) => {
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const dispositionsList: { id: CallDisposition; label: string; category: string }[] = [
    { id: "LEAD_COMPLETED", label: "Lead Completed (Ready For Handoff)", category: "SUCCESS" },
    { id: "CUSTOMER_NOT_INTERESTED", label: "Customer Not Interested", category: "REFUSAL" },
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

  const leadPayload = {
    callId: `SPARTA-${Date.now().toString().slice(-6)}`,
    agentId: "AG-ALEX-01",
    timestamp: new Date().toISOString(),
    campaign: config.campaignName,
    scriptVersion: config.scriptVersion,
    disposition,
    customer: {
      title: customer.title || "Mr/Mrs",
      firstName: customer.firstName || "Unknown",
      lastName: customer.lastName || "Unknown",
      address: {
        doorNumber: customer.doorNumber || "",
        postcode: customer.postcode || "",
        fullAddress: customer.address || "",
      },
      contactNumber: customer.contactNumber || customer.mobileNumber || "",
      dob: customer.dob || (customer.birthYear ? `${customer.birthYear}-01-01` : ""),
      birthYear: customer.birthYear,
      calculatedAge: customer.calculatedAge,
      customerId: customer.customerId || "",
      customerIdStatus: customer.customerIdStatus || "NOT_AVAILABLE",
      mobile: {
        number: customer.mobileNumber || "",
        type: customer.mobileType || "UNKNOWN",
        network: customer.mobileNetwork || "",
      },
    },
    services: {
      monthlyBill: customer.monthlyBill || 0,
      billApproximate: !!customer.billApproximate,
      landlineUsage: customer.landlineUsage || "UNSURE",
      broadbandIncluded: !!customer.billIncludesBroadband,
      tvIncluded: !!customer.billIncludesTv,
      medicalAlarm: !!customer.medicalAlarm,
      tvMakeModel: customer.tvMakeModel || "",
    },
    offer: {
      offerName: config.offerName,
      minutes: config.minutes,
      discountPercent: config.maxDiscountPercent,
    },
    callback: callbackDetails,
    agentNotes: notes,
  };

  const jsonString = JSON.stringify(leadPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lead_${leadPayload.callId}_${disposition}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Call Conclusion & Mandatory Disposition
              </h2>
              <p className="text-[11px] text-slate-400">
                Assign disposition and verify lead packet before handoff
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
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Disposition Selector */}
          <div className="space-y-2">
            <label className="text-slate-300 font-bold uppercase text-[11px] tracking-wider block">
              1. Select Mandatory Call Disposition:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dispositionsList.map((d) => (
                <button
                  key={d.id}
                  onClick={() => onSelectDisposition(d.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                    disposition === d.id
                      ? "bg-sparta-600 text-white border-sparta-400 font-bold shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{d.label}</span>
                  {disposition === d.id && <Check className="w-4 h-4 ml-1 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Lead Summary Cards */}
          <div className="space-y-2">
            <label className="text-slate-300 font-bold uppercase text-[11px] tracking-wider block">
              2. Collected Customer Information Summary:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Name</span>
                <span className="text-white font-bold">
                  {customer.firstName || customer.lastName
                    ? `${customer.firstName || ""} ${customer.lastName || ""}`
                    : "—"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Door & Postcode</span>
                <span className="text-white font-mono">
                  {customer.doorNumber ? `${customer.doorNumber}, ` : ""}
                  {customer.postcode || "—"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Monthly Bill</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {customer.monthlyBill ? `£${customer.monthlyBill.toFixed(2)}` : "—"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DOB / Age</span>
                <span className="text-white font-mono">
                  {customer.dob || customer.birthYear ? `Born ${customer.birthYear || customer.dob}` : "—"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Customer ID Match</span>
                <span className="text-white font-mono">{customer.customerId || "Not Provided"}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Medical Alarm</span>
                <span className={customer.medicalAlarm ? "text-rose-400 font-bold" : "text-slate-400"}>
                  {customer.medicalAlarm ? "⚠️ Yes (Alarm Present)" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Agent Notes */}
          <div className="space-y-1">
            <label className="text-slate-400 block text-[11px]">Additional Agent Notes for Fulfillment Team:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Customer requested postal dispatch..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs focus:border-sparta-500 focus:outline-none"
            />
          </div>

          {/* JSON Payload Export Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                CRM HANDOFF PAYLOAD (AUDIT READY)
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={handleCopy}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 border border-slate-700"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy JSON"}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 border border-slate-700"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] text-slate-300 font-mono overflow-x-auto max-h-36">
              {jsonString}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={onResetCall}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset / Start New Call</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
            >
              Back to Script
            </button>
            <button
              onClick={() => {
                alert(`Lead saved with disposition: ${disposition}. Handed off to relevant team.`);
                onResetCall();
              }}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Submit Disposition & Handoff</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
