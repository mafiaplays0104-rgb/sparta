import React, { useState } from "react";
import {
  X,
  Settings,
  ShieldCheck,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  AlertCircle,
} from "lucide-react";
import { OfferConfig } from "../types";
import { initialOfferConfig } from "../data/initialOfferConfig";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OfferConfig;
  onSaveConfig: (newConfig: OfferConfig) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<OfferConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleBumpVersion = () => {
    const parts = formData.scriptVersion.replace("v", "").split(".").map(Number);
    if (parts.length === 3) {
      parts[1] += 1; // bump minor
      setFormData({
        ...formData,
        scriptVersion: `v${parts[0]}.${parts[1]}.${parts[2]}`,
      });
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all campaign settings to factory default compliance configuration?")) {
      setFormData({ ...initialOfferConfig });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sparta-600/20 text-sparta-400 border border-sparta-500/30 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Admin Configuration & Campaign Governance
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sparta-300 border border-slate-700 font-bold">
                  {formData.scriptVersion}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Configure authorized commercial statements, eligibility brackets, and version publishing.
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Section 1: Campaign Core */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sparta-400 uppercase text-[11px] tracking-wider">
              1. Campaign Identity & Versioning
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={formData.campaignName}
                  onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Script Version & Publish</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.scriptVersion}
                    onChange={(e) => setFormData({ ...formData, scriptVersion: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sparta-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleBumpVersion}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sparta-300 font-medium whitespace-nowrap text-[11px]"
                    title="Publish next minor version"
                  >
                    + Bump
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Commercial Offer Rules */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sparta-400 uppercase text-[11px] tracking-wider">
              2. Authorized Commercial Claims & Discount Cap
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">
                  Maximum Authorized Discount (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={formData.maxDiscountPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDiscountPercent: Number(e.target.value) || 30,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Payment Method</label>
                <input
                  type="text"
                  disabled
                  value="DIRECT_DEBIT (Mandatory compliance locked)"
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-400 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.serviceUnchanged}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceUnchanged: e.target.checked })
                  }
                  className="rounded bg-slate-900 border-slate-700 text-sparta-600 focus:ring-0"
                />
                <span>Service Unchanged</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.contractUnchanged}
                  onChange={(e) =>
                    setFormData({ ...formData, contractUnchanged: e.target.checked })
                  }
                  className="rounded bg-slate-900 border-slate-700 text-sparta-600 focus:ring-0"
                />
                <span>Contract Unchanged</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.equipmentUnchanged}
                  onChange={(e) =>
                    setFormData({ ...formData, equipmentUnchanged: e.target.checked })
                  }
                  className="rounded bg-slate-900 border-slate-700 text-sparta-600 focus:ring-0"
                />
                <span>Equipment Unchanged</span>
              </label>
            </div>
          </div>

          {/* Section 3: Age / DOB Eligibility Bracket */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sparta-400 uppercase text-[11px] tracking-wider">
              3. Age Eligibility Rules (DOB Range)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Minimum Qualifying DOB</label>
                <input
                  type="date"
                  required
                  value={formData.eligibilityRules.minimumDob}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eligibilityRules: {
                        ...formData.eligibilityRules,
                        minimumDob: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Maximum Qualifying DOB</label>
                <input
                  type="date"
                  required
                  value={formData.eligibilityRules.maximumDob}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eligibilityRules: {
                        ...formData.eligibilityRules,
                        maximumDob: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sparta-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Authorized Statements */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sparta-400 uppercase text-[11px] tracking-wider">
              4. Authorized Script Text (Prevents Advisor Guesswork)
            </h3>

            <div>
              <label className="text-slate-400 block mb-1">Authorized Offer Description</label>
              <textarea
                value={formData.authorisedText.offerDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    authorisedText: {
                      ...formData.authorisedText,
                      offerDescription: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white h-16 focus:border-sparta-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Authorized Closing Lines</label>
              <textarea
                value={formData.authorisedText.closingLines}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    authorisedText: {
                      ...formData.authorisedText,
                      closingLines: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white h-16 focus:border-sparta-500 focus:outline-none"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Factory Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-sparta-600 hover:bg-sparta-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-glow-primary"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? "Saved & Published!" : "Save & Publish Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
