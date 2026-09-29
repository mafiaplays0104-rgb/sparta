import React, { useState } from "react";
import {
  X,
  Settings,
  ShieldCheck,
  Save,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
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

  const handleBumpMinor = () => {
    const parts = formData.scriptVersion.replace("v", "").split(".").map(Number);
    if (parts.length === 3) {
      parts[1] += 1;
      parts[2] = 0;
      setFormData({
        ...formData,
        scriptVersion: `${parts[0]}.${parts[1]}.${parts[2]}`,
      });
    }
  };

  const handleBumpPatch = () => {
    const parts = formData.scriptVersion.replace("v", "").split(".").map(Number);
    if (parts.length === 3) {
      parts[2] += 1;
      setFormData({
        ...formData,
        scriptVersion: `${parts[0]}.${parts[1]}.${parts[2]}`,
      });
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all campaign configuration settings to default Spartan compliance rules?")) {
      setFormData({ ...initialOfferConfig });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sparta-600/20 text-sparta-400 border border-sparta-500/30 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Admin Configuration & Campaign Control
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sparta-300 border border-slate-700 font-bold">
                  v{formData.scriptVersion}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Configure offer parameters, script locking, customer ID format, and compliance rules
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
          {/* Section 1: Script Lock & Versioning */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sparta-400 uppercase text-[11px] tracking-wider">
                1. SCRIPT_LOCK & Version Governance
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.scriptLock}
                  onChange={(e) => setFormData({ ...formData, scriptLock: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-sparta-600 focus:ring-0"
                />
                <span className="text-white font-bold flex items-center gap-1">
                  {formData.scriptLock ? <Lock className="w-3 h-3 text-emerald-400" /> : <Unlock className="w-3 h-3 text-amber-400" />}
                  <span>SCRIPT_LOCK Enabled</span>
                </span>
              </label>
            </div>

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
                <label className="text-slate-400 block mb-1">Script Version</label>
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
                    onClick={handleBumpPatch}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                  >
                    +Patch
                  </button>
                  <button
                    type="button"
                    onClick={handleBumpMinor}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sparta-300 font-mono text-[11px]"
                  >
                    +Minor
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Offer Parameters (Section 15) */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sparta-400 uppercase text-[11px] tracking-wider">
              2. Offer Configuration (Configuration-Driven)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Offer Name</label>
                <input
                  type="text"
                  required
                  value={formData.offerName}
                  onChange={(e) => setFormData({ ...formData, offerName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Minutes Included (Approved Script: 500)</label>
                <input
                  type="number"
                  required
                  value={formData.minutes}
                  onChange={(e) => setFormData({ ...formData, minutes: Number(e.target.value) || 500 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Max Discount % (Default: 30%)</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={formData.maxDiscountPercent}
                  onChange={(e) => setFormData({ ...formData, maxDiscountPercent: Number(e.target.value) || 30 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sparta-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.crossNetwork}
                  onChange={(e) => setFormData({ ...formData, crossNetwork: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-sparta-600 focus:ring-0"
                />
                <span>Cross-Network</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.anytime}
                  onChange={(e) => setFormData({ ...formData, anytime: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-sparta-600 focus:ring-0"
                />
                <span>Anytime Calling</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.technicalVisit}
                  onChange={(e) => setFormData({ ...formData, technicalVisit: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-sparta-600 focus:ring-0"
                />
                <span>Technical Visit Included</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.writtenTerms}
                  onChange={(e) => setFormData({ ...formData, writtenTerms: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-sparta-600 focus:ring-0"
                />
                <span>Written Terms Provided</span>
              </label>
            </div>
          </div>

          {/* Section 3: Eligibility & Identification Rules */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sparta-400 uppercase text-[11px] tracking-wider">
              3. Customer ID Format & DOB Eligibility Range
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Customer ID Required Prefix</label>
                <input
                  type="text"
                  required
                  value={formData.customerIdPrefix}
                  onChange={(e) => setFormData({ ...formData, customerIdPrefix: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono uppercase focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Minimum Eligible DOB</label>
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
                <label className="text-slate-400 block mb-1">Maximum Eligible DOB</label>
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

          {/* Section 4: Authorized Statements & Policies */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sparta-400 uppercase text-[11px] tracking-wider">
              4. Authorized Company Information & Compliance Policy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Company Registered Name</label>
                <input
                  type="text"
                  required
                  value={formData.authorisedText.companyName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      authorisedText: {
                        ...formData.authorisedText,
                        companyName: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Data Retention Period (Days)</label>
                <input
                  type="number"
                  min={30}
                  max={365}
                  value={formData.dataRetentionDays}
                  onChange={(e) => setFormData({ ...formData, dataRetentionDays: Number(e.target.value) || 90 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sparta-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Official Verification Procedure (Scam / Identity Fallback)</label>
              <textarea
                rows={2}
                value={formData.authorisedText.verificationProcedure}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    authorisedText: {
                      ...formData.authorisedText,
                      verificationProcedure: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-sparta-500 focus:outline-none"
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
