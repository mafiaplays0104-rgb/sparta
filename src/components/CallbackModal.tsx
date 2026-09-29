import React, { useState } from "react";
import { X, Calendar, Clock, PhoneForwarded, Check } from "lucide-react";
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
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("10:30");
  const [timezone, setTimezone] = useState("Europe/London (GMT/BST)");
  const [reason, setReason] = useState("Customer is busy / requested convenient time");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmCallback({
      requested: true,
      preferredDate: date,
      preferredTime: time,
      timezone,
      reason,
      advisorNotes: notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <PhoneForwarded className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Schedule Customer Callback
              </h3>
              <p className="text-[11px] text-slate-400">
                Book agreed follow-up slot without pressuring the customer
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
          {customerName && (
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between text-[11px]">
              <span className="text-slate-400">Customer:</span>
              <span className="text-white font-bold">{customerName}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Preferred Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Preferred Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Timezone</label>
            <input
              type="text"
              disabled
              value={timezone}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-slate-400 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Callback Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="Customer is busy / requested convenient time">Customer is busy / requested convenient time</option>
              <option value="Customer wants to check paperwork / bills">Customer wants to check paperwork / bills</option>
              <option value="Customer asked to speak to family member">Customer asked to speak to family member</option>
              <option value="Independent company verification in progress">Independent company verification in progress</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Advisor Follow-up Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call back after 2pm when bill payer is home..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none"
            />
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
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Book Callback & Complete Call</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
