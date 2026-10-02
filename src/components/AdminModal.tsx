import React, { useState } from "react";
import {
  X,
  Settings,
  Lock,
  Unlock,
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
    if (confirm("Reset all campaign configuration settings to default UK Telecom 30% reduction rules?")) {
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
                  Campaign Settings &amp; Script Governance
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sparta-300 border border-slate-700 font-bold">
                  v{formData.scriptVersion}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                UK Telecom 30% Bill Reduction Campaign Parameters
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
                1. Script Lock &amp; Version
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
                  <span>Script Lock Enabled</span>
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

          {/* Section 2: Advisor & Company Credentials */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sparta-400 uppercase text-[11px] tracking-wider">
              2. Advisor &amp; Organization Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Advisor Name (Script: Peter)</label>
                <input
                  type="text"
                  required
                  value={formData.advisorName || "Peter"}
                  onChange={(e) => setFormData({ ...formData, advisorName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName || "[COMPANY NAME]"}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Approved Agent Reference ID</label>
                <input
                  type="text"
                  required
                  value={formData.approvedAgentId || "[APPROVED ID]"}
                  onChange={(e) => setFormData({ ...formData, approvedAgentId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sparta-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Reduction Parameters */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sparta-400 uppercase text-[11px] tracking-wider">
              3. Bill Reduction Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <label className="text-slate-400 block mb-1">Max Discount Percentage Cap (%)</label>
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
          </div>

          {/* Section 4: Authorized Statements */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sparta-400 uppercase text-[11px] tracking-wider">
              4. Authorized Compliance &amp; Verification Text
            </h3>
            <div className="space-y-2">
              <div>
                <label className="text-slate-400 block mb-0.5">Campaign Purpose Statement</label>
                <textarea
                  rows={2}
                  value={formData.authorisedText.campaignReason}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      authorisedText: { ...formData.authorisedText, campaignReason: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-sans focus:border-sparta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">Company Verification Procedure</label>
                <textarea
                  rows={2}
                  value={formData.authorisedText.verificationProcedure}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      authorisedText: { ...formData.authorisedText, verificationProcedure: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-sans focus:border-sparta-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer controls */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              Reset to Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-sparta-600 hover:bg-sparta-500 text-slate-950 font-black shadow-md flex items-center gap-1.5"
              >
                {savedSuccess ? <span>✓ Saved!</span> : <span>Save Configuration</span>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
