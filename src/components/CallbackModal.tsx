import React, { useState } from "react";
import { X, Calendar, Clock, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import { CallbackDetails } from "../types";

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCallback: (details: CallbackDetails) => void;
  customerName?: string;
  customerPhone?: string;
}

export const CallbackModal: React.FC<CallbackModalProps> = ({
  isOpen,
  onClose,
  onConfirmCallback,
  customerName,
  customerPhone,
}) => {
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [preferredTime, setPreferredTime] = useState("10:00 - 12:00 (Morning)");
  const [reason, setReason] = useState("Customer requested callback to review with family");
  const [advisorNotes, setAdvisorNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmCallback({
      requested: true,
      preferredDate,
      preferredTime,
      reason,
      advisorNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Schedule Customer Callback
              </h2>
              <p className="text-[11px] text-slate-400">
                Book a polite, non-pressuring callback at customer's convenience.
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
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
            <span className="font-semibold text-sparta-400 block mb-0.5">Customer Contact:</span>
            <span>{customerName || "Customer on Landline"}</span>
            {customerPhone && <span className="ml-2 font-mono text-slate-400">({customerPhone})</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Preferred Date:</label>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sparta-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Preferred Time Window:</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-sparta-500 focus:outline-none"
              >
                <option value="09:00 - 11:00 (Early Morning)">09:00 - 11:00 (Early Morning)</option>
                <option value="11:00 - 13:00 (Late Morning)">11:00 - 13:00 (Late Morning)</option>
                <option value="14:00 - 16:00 (Afternoon)">14:00 - 16:00 (Afternoon)</option>
                <option value="16:00 - 18:00 (Early Evening)">16:00 - 18:00 (Early Evening)</option>
                <option value="Weekend Morning">Weekend Morning</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Reason for Callback:</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-sparta-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Advisor Callback Notes:</label>
            <textarea
              placeholder="e.g. Margaret's daughter will be visiting on Friday to review together..."
              value={advisorNotes}
              onChange={(e) => setAdvisorNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white h-20 focus:border-sparta-500 focus:outline-none resize-none"
            />
          </div>

          <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Compliance guarantee: No unnecessary payment details collected to schedule callbacks.</span>
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
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Callback & End Call</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
