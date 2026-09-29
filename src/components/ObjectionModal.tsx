import React, { useState } from "react";
import {
  X,
  Search,
  HelpCircle,
  Check,
  Copy,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { ObjectionItem } from "../types";
import { objectionLibrary } from "../data/objections";

interface ObjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResponse: (text: string) => void;
}

export const ObjectionModal: React.FC<ObjectionModalProps> = ({
  isOpen,
  onClose,
  onSelectResponse,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    "ALL",
    "AVAILABILITY",
    "INTEREST",
    "IDENTITY",
    "DOB",
    "CUSTOMER_ID",
    "SECURITY",
    "OFFER",
    "COMPLIANCE",
  ];

  const filtered = objectionLibrary.filter((item) => {
    const matchesCat = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesQuery =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.triggers.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      item.recommendedResponse.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Approved UK Objection Library (Searchable)
              </h2>
              <p className="text-[11px] text-slate-400">
                Authorized responses for customer hesitations, privacy questions, and security concerns
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

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Type customer words: 'busy', 'why DOB', 'why ID', 'is this a scam', 'not interested'..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition-all text-[11px] ${
                  selectedCategory === cat
                    ? "bg-amber-600 text-white font-bold shadow-sm"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 text-xs">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No objection matches found for "{search}". Try searching "busy", "scam", "DOB", or "ID".
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{item.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-bold">
                      {item.category}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.severity === "CRITICAL"
                        ? "bg-red-500/20 text-red-300"
                        : item.severity === "HIGH"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.severity} SEVERITY
                  </span>
                </div>

                {/* Triggers */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500">Triggers:</span>
                  {item.triggers.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                      "{t}"
                    </span>
                  ))}
                </div>

                {/* Recommended approved line */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 italic leading-relaxed text-xs">
                  {item.recommendedResponse}
                </div>

                {item.optionalFollowUp && (
                  <p className="text-[11px] text-slate-400">
                    💡 <strong className="text-slate-300">Follow-up Guidance:</strong> {item.optionalFollowUp}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <span className="text-[10px] text-slate-500">
                    Stop Rule: {item.stopCondition}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(item.recommendedResponse)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                    >
                      {copiedText === item.recommendedResponse ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedText === item.recommendedResponse ? "Copied" : "Copy"}</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectResponse(item.recommendedResponse);
                        onClose();
                      }}
                      className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                    >
                      <span>Insert Into Script</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Close Library
          </button>
        </div>
      </div>
    </div>
  );
};
