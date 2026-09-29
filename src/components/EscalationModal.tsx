import React, { useState } from "react";
import { X, AlertOctagon, ArrowRight, ShieldAlert } from "lucide-react";

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
  const [reason, setReason] = useState(defaultReason || "Customer reported line or broadband fault");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmEscalate(reason, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Escalate To Senior Team
              </h3>
              <p className="text-[11px] text-slate-400">
                Route complex technical faults or security cases for specialist care
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">Escalation Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="Customer reported line or broadband fault">Customer reported line or broadband fault</option>
              <option value="Medical alarm / life safety priority care">Medical alarm / life safety priority care</option>
              <option value="Complex billing / tariff dispute">Complex billing / tariff dispute</option>
              <option value="High-tier security or independent verification request">High-tier security or independent verification request</option>
              <option value="Customer requested senior manager callback">Customer requested senior manager callback</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Detailed Situation Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Total loss of dial tone for 48 hours, customer needs priority engineer review..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Never promise specific engineer visit arrival times or compensation figures.</span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <span>Confirm Escalation Handoff</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
