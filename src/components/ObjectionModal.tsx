import React, { useState } from "react";
import {
  X,
  Search,
  Check,
  Copy,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { objectionLibrary } from "../data/objections";
import { ObjectionItem } from "../types";

interface ObjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResponse?: (text: string) => void;
}

export const ObjectionModal: React.FC<ObjectionModalProps> = ({
  isOpen,
  onClose,
  onSelectResponse,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    "ALL",
    "NOT INTERESTED",
    "IS THIS A SCAM?",
    "WHY DO YOU NEED BANK DETAILS?",
    "WHY DO YOU NEED MY DOB?",
    "I DON'T WANT TO CHANGE MY CONTRACT",
    "I NEED TO SPEAK TO MY FAMILY",
    "SEND IT IN WRITING",
    "TOO BUSY",
  ];

  const filtered = objectionLibrary.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch =
      search === "" ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.primary.toLowerCase().includes(search.toLowerCase()) ||
      item.triggerPhrases.some((tp) => tp.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onSelectResponse) {
      onSelectResponse(text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                UK Objection & Hesitation Library
              </h2>
              <p className="text-[11px] text-slate-400">
                18+ verified respectful UK responses. Calm, non-manipulative, no-pressure.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer phrase: e.g. 'scam', 'bank', 'family', 'contract'..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sparta-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-sparta-600 text-white font-bold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Objection Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No objection found matching "{search}". Try searching for keywords like "bank", "scam", or "details".
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all space-y-3"
              >
                {/* Category & Triggers */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      When caller says: <span className="text-slate-300 italic">"{item.triggerPhrases.join('", "')}"</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(item.id, item.primary)}
                    className="text-xs px-2.5 py-1 rounded bg-sparta-600 hover:bg-sparta-500 text-white font-medium flex items-center gap-1 transition-all"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Script</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Use Response</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary Response */}
                <div>
                  <span className="text-[10px] font-bold text-sparta-400 uppercase tracking-wider block mb-1">
                    PRIMARY RESPONSE (SPOKEN)
                  </span>
                  <p className="text-xs text-white leading-relaxed select-text font-medium bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    "{item.primary}"
                  </p>
                </div>

                {/* Short & Explain Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-amber-400 font-bold block mb-0.5">
                      SHORT VERSION
                    </span>
                    <p className="text-slate-300 text-[11px]">"{item.short}"</p>
                  </div>
                  <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">
                      EXPLANATION
                    </span>
                    <p className="text-slate-300 text-[11px]">{item.explain}</p>
                  </div>
                </div>

                {/* Next Action & Hard Stop Condition */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                  <div className="text-slate-400 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-sparta-400" />
                    <span>Next: {item.nextAction}</span>
                  </div>

                  <div className="text-rose-400 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Stop: {item.stopCondition}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
