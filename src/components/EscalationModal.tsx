import React, { useState } from "react";
import { X, AlertTriangle, UserCheck, ShieldAlert, ArrowRight } from "lucide-react";

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmEscalate: (reason: string, notes: string) => void;
  defaultReason?: string;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  onConfirmEscalate,
  defaultReason,
}) => {
  const [reason, setReason] = useState(
    defaultReason || "Customer expresses significant confusion / vulnerability"
  );
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const reasons = [
    "Customer expresses significant confusion / vulnerability",
    "Medical alarm or life-critical service dependency connected",
    "Active physical landline / broadband service fault reported",
    "Customer explicitly requested speaking with a supervisor",
    "Customer highly suspicious; needs formal verification officer",
    "Payment verification cannot be safely conducted on this call",
    "Information requested by customer is unavailable in current system",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmEscalate(reason, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-red-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Senior Supervisor Escalation
              </h2>
              <p className="text-[11px] text-slate-400">
                Warm, responsible handover when specialist care is warranted.
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Spoken Handoff Script */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-sparta-400 uppercase tracking-wider block mb-1">
              SUGGESTED ADVISOR SCRIPT
            </span>
            <p className="text-white text-xs leading-relaxed italic">
              "Right, I understand. In that case, I'd rather make sure you're speaking to the right person who can properly deal with that for you. I'll arrange for this to be passed to a senior member of the team."
            </p>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">
              Reason for Escalation:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">
              Specific Handover Briefing:
            </label>
            <textarea
              placeholder="e.g. Caller mentioned lifeline pendant connected to hall socket; stopped sales conversation immediately..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white h-20 focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Compliance rule: Do NOT invent promises, engineer dates, or compensation.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 shadow-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span>Confirm Supervisor Handover</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
