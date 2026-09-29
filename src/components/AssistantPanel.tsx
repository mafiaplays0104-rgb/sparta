import React, { useState } from "react";
import {
  Search,
  X,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { ObjectionItem } from "../types";
import { objectionLibrary } from "../data/objections";

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyObjectionResponse: (text: string) => void;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({
  isOpen,
  onClose,
  onApplyObjectionResponse,
}) => {
  const [search, setSearch] = useState("");
  const [selectedObjection, setSelectedObjection] = useState<ObjectionItem | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filtered = objectionLibrary.filter((item) => {
    return (
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.triggers.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleUseResponse = (text: string) => {
    onApplyObjectionResponse(text);
    onClose();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-fadeIn text-xs text-slate-100">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white uppercase tracking-wider text-xs">
            Objections &amp; Help
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* If an objection is currently selected, show ONE response at a time */}
        {selectedObjection ? (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {selectedObjection.name}
              </span>
              <button
                onClick={() => setSelectedObjection(null)}
                className="text-[10px] text-slate-400 hover:text-white underline"
              >
                ← Back to List
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white italic leading-relaxed whitespace-pre-line font-serif">
              {selectedObjection.recommendedResponse}
            </div>

            {selectedObjection.optionalFollowUp && (
              <p className="text-[11px] text-slate-400 leading-tight">
                💡 {selectedObjection.optionalFollowUp}
              </p>
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => handleUseResponse(selectedObjection.recommendedResponse)}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>USE RESPONSE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleCopy(selectedObjection.recommendedResponse)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Copy text"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ) : (
          /* Search & List */
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search: 'busy', 'why DOB', 'scam'..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedObjection(item)}
                  className="w-full p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 text-left transition-colors flex items-center justify-between group"
                >
                  <span className="text-xs text-slate-200 group-hover:text-amber-300 font-medium">
                    {item.name}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-end">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};
