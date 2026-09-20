import React, { useState } from 'react';
import { useCallContext } from '../context/CallContext';
import type { AdminConfig } from '../types';
import { DEFAULT_ADMIN_CONFIG } from '../data/callFlowData';
import { Settings, X, Save, RotateCcw, Check } from 'lucide-react';

export const AdminConfigModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    adminConfig,
    updateAdminConfig,
  } = useCallContext();

  const [formConfig, setFormConfig] = useState<AdminConfig>(adminConfig);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isAdminModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminConfig(formConfig);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      setIsAdminModalOpen(false);
    }, 1200);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all parameters to factory defaults?')) {
      setFormConfig(DEFAULT_ADMIN_CONFIG);
      updateAdminConfig(DEFAULT_ADMIN_CONFIG);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 1200);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} color="#60a5fa" />
            <h3 id="admin-modal-title" className="modal-title">
              Admin & Business Script Configuration
            </h3>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '0.65rem 0.95rem',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.25)',
              }}
            >
              Changes made here immediately update the real-time caller scripts, variables, and compliance rules across all 15 stages.
            </div>

            {/* Agent Name & Company Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Caller / Agent Name (XYZ):
                </label>
                <input
                  type="text"
                  value={formConfig.agentName}
                  onChange={(e) => setFormConfig({ ...formConfig, agentName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-prominent)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Authorized Company Name:
                </label>
                <input
                  type="text"
                  value={formConfig.companyName}
                  onChange={(e) => setFormConfig({ ...formConfig, companyName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-prominent)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            {/* Offer % & Delivery Wording */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Offer Reduction Percentage (%):
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={formConfig.offerPercentage}
                  onChange={(e) =>
                    setFormConfig({
                      ...formConfig,
                      offerPercentage: Number(e.target.value) || 30,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-prominent)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Delivery Wording ([DOCUMENT/LETTER]):
                </label>
                <select
                  value={formConfig.deliveryWording}
                  onChange={(e) =>
                    setFormConfig({
                      ...formConfig,
                      deliveryWording: e.target.value as 'DOCUMENT' | 'LETTER',
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-prominent)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                  }}
                >
                  <option value="LETTER">LETTER ("black-and-white letter")</option>
                  <option value="DOCUMENT">DOCUMENT ("black-and-white document")</option>
                </select>
              </div>
            </div>

            {/* Compliance & Factual System Switches */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.9rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24' }}>
                COMPLIANCE & SYSTEM INTEGRATION CHECKS
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formConfig.directDebitVerified}
                  onChange={(e) =>
                    setFormConfig({
                      ...formConfig,
                      directDebitVerified: e.target.checked,
                    })
                  }
                />
                <span style={{ fontSize: '0.85rem' }}>
                  <strong>Stage 9:</strong> Direct Debit payment history is factually verified by internal system (Never invent payment history).
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formConfig.consumerIdIsIban}
                  onChange={(e) =>
                    setFormConfig({
                      ...formConfig,
                      consumerIdIsIban: e.target.checked,
                    })
                  }
                />
                <span style={{ fontSize: '0.85rem' }}>
                  <strong>Stage 10:</strong> Business has confirmed "Consumer Identification Number" means IBAN.
                </span>
              </label>
            </div>

            {/* Vulnerability Escalation Protocol */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Vulnerability / Cognitive Awareness Escalation Note (Stage 11):
              </label>
              <textarea
                rows={3}
                value={formConfig.vulnerabilityEscalationNote}
                onChange={(e) =>
                  setFormConfig({
                    ...formConfig,
                    vulnerabilityEscalationNote: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-prominent)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={handleResetDefaults}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.55rem 1rem',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isSavedNotice && (
                <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={16} /> Saved!
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '6px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-prominent)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1.35rem',
                  borderRadius: '6px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                }}
              >
                <Save size={15} />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
