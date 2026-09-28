import React from "react";
import {
  User,
  HeartHandshake,
  CheckCircle2,
  Circle,
  AlertCircle,
  FileText,
  Volume2,
  ShieldAlert,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Customer, CustomerMood, CallNotes, ConsentRecord } from "../types";
import { SecurityEngine } from "../engine/securityEngine";

interface CustomerPanelProps {
  customer: Customer;
  mood: CustomerMood;
  onMoodChange: (newMood: CustomerMood) => void;
  notes: CallNotes;
  onUpdateNotes: (updatedNotes: Partial<CallNotes>) => void;
  consents: ConsentRecord[];
  isDirectDebitRecorded: boolean;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({
  customer,
  mood,
  onMoodChange,
  notes,
  onUpdateNotes,
  consents,
  isDirectDebitRecorded,
}) => {
  const moods: { id: CustomerMood; label: string; icon: string; desc: string }[] = [
    { id: "COMFORTABLE", label: "Comfortable", icon: "😊", desc: "Standard calm British pace" },
    { id: "ELDERLY_SLOW", label: "Elderly / Slow", icon: "🐢", desc: "1 question at a time, slow speech" },
    { id: "CONFUSED", label: "Confused", icon: "❓", desc: "Frequent re-explaining needed" },
    { id: "SUSPICIOUS", label: "Suspicious", icon: "🛡️", desc: "Wants reassurance, privacy focus" },
    { id: "IMPATIENT", label: "Impatient", icon: "⏱️", desc: "Short sentences, get straight to point" },
    { id: "TALKATIVE", label: "Talkative", icon: "💬", desc: "Needs gentle redirection" },
    { id: "VULNERABILITY_CONCERN", label: "Vulnerability", icon: "⚠️", desc: "Medical alarm or distress" },
  ];

  // Checklist computation
  const checklist = [
    { label: "Bill payer identified", checked: true },
    { label: "Service type known", checked: !!customer.serviceType },
    { label: "Last bill approximate", checked: !!customer.lastBillAmount || !!customer.lastBillEstimated },
    { label: "Date of Birth (DOB)", checked: !!customer.dateOfBirth },
    { label: "Customer Full Name", checked: !!customer.firstName && !!customer.lastName },
    { label: "Service Address & Postcode", checked: !!customer.address?.postcode },
    { label: "Direct Debit Mandate", checked: isDirectDebitRecorded },
    { label: "Mobile Details", checked: !!customer.mobile?.number },
    { label: "Medical Alarm Screened", checked: customer.medicalAlarm !== undefined },
  ];

  const handleNotesChange = (field: keyof CallNotes, value: string) => {
    // Sanitize against accidental credit card numbers
    const sanitized = SecurityEngine.sanitizeNotes(value);
    onUpdateNotes({ [field]: sanitized });
  };

  return (
    <aside className="bg-slate-900/60 backdrop-blur-md border-l border-slate-800 p-4 flex flex-col h-full overflow-y-auto space-y-4">
      {/* 1. CUSTOMER MOOD SELECTOR */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sparta-400" />
            <span>Customer Mood / Pace</span>
          </h2>
          <span className="text-[10px] text-slate-500">Live Adaptive</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => onMoodChange(m.id)}
              className={`p-2 rounded-lg text-left text-xs font-medium border transition-all ${
                mood === m.id
                  ? "bg-sparta-600/30 text-white border-sparta-400 shadow-sm"
                  : "bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
              }`}
              title={m.desc}
            >
              <div className="flex items-center gap-1.5">
                <span>{m.icon}</span>
                <span className="truncate text-[11px] font-semibold">{m.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Pace Guidance Box */}
        <div className="mt-2.5 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px]">
          {mood === "ELDERLY_SLOW" && (
            <div className="text-amber-300 space-y-1">
              <span className="font-bold flex items-center gap-1">
                🐢 ELDERLY-FRIENDLY PACE ACTIVE
              </span>
              <p className="text-slate-400 text-[10px]">
                Speak slowly • 1 question per step • Short sentences • Give gentle pauses.
              </p>
            </div>
          )}

          {mood === "TALKATIVE" && (
            <div className="text-blue-300 space-y-1.5">
              <span className="font-bold flex items-center gap-1">
                💬 TALKATIVE CALLER CONTROLS
              </span>
              <div className="flex flex-col gap-1 text-[10px]">
                <button
                  onClick={() =>
                    alert("Advisor: 'Absolutely, I understand. Right, coming back to the account itself, the next thing I need to check is...'")
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-left"
                >
                  [ACKNOWLEDGE + CONTINUE]
                </button>
                <button
                  onClick={() =>
                    alert("Advisor: 'I hear you completely. Just so we keep your day moving forward...'")
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-left"
                >
                  [BRING BACK TO CALL]
                </button>
              </div>
            </div>
          )}

          {mood === "SUSPICIOUS" && (
            <div className="text-rose-300 space-y-1">
              <span className="font-bold">🛡️ CAUTIOUS / SUSPICIOUS</span>
              <p className="text-slate-400 text-[10px]">
                Reiterate that no equipment changes or card numbers are involved. Offer callback or independent check.
              </p>
            </div>
          )}

          {mood === "IMPATIENT" && (
            <div className="text-orange-300 space-y-1">
              <span className="font-bold">⏱️ IMPATIENT CALLER</span>
              <p className="text-slate-400 text-[10px]">
                Cut all small talk. Use [SHORTEN] line variant and emphasize quick time.
              </p>
            </div>
          )}

          {mood === "COMFORTABLE" && (
            <div className="text-emerald-300 space-y-1">
              <span className="font-bold">😊 COMFORTABLE FLOW</span>
              <p className="text-slate-400 text-[10px]">
                Friendly, polite British cadence. Everything proceeding naturally.
              </p>
            </div>
          )}

          {mood === "VULNERABILITY_CONCERN" && (
            <div className="text-red-300 space-y-1">
              <span className="font-bold">⚠️ VULNERABILITY CONCERN</span>
              <p className="text-slate-400 text-[10px]">
                Do not push sales. Prioritize customer safety or supervisor handoff.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. INFORMATION CHECKLIST */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sparta-400" />
            <span>Information Checklist</span>
          </h2>
          <span className="text-[10px] font-mono text-sparta-400 font-semibold">
            {checklist.filter((c) => c.checked).length} / {checklist.length}
          </span>
        </div>

        <div className="space-y-1 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 text-xs py-1 ${
                item.checked ? "text-slate-200" : "text-slate-500"
              }`}
            >
              {item.checked ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
              )}
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ADVISOR CALL NOTES */}
      <div className="flex-1 flex flex-col min-h-[160px]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-sparta-400" />
            <span>Advisor Call Notes</span>
          </h2>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
            <ShieldAlert className="w-2.5 h-2.5" />
            PCI Redacted
          </span>
        </div>

        <div className="space-y-2 flex-1">
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">
              Customer Concern / Sentiment:
            </label>
            <input
              type="text"
              placeholder="e.g. Inquired about bill date..."
              value={notes.customerConcern}
              onChange={(e) => handleNotesChange("customerConcern", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs text-slate-200 focus:border-sparta-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">
              Follow-up / Action Required:
            </label>
            <input
              type="text"
              placeholder="e.g. Written terms via post..."
              value={notes.followUp}
              onChange={(e) => handleNotesChange("followUp", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs text-slate-200 focus:border-sparta-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">
              General Conversation Notes:
            </label>
            <textarea
              placeholder="e.g. Spoke with Margaret, very friendly..."
              value={notes.generalNotes}
              onChange={(e) => handleNotesChange("generalNotes", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 h-16 focus:border-sparta-500 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
