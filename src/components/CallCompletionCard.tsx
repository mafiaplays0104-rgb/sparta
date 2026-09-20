import React, { useEffect, useState } from 'react';
import { useCallContext } from '../context/CallContext';
import type { FinalDisposition } from '../types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  FileCheck,
  ShieldCheck,
  Download,
  CheckCircle2,
} from 'lucide-react';

const FINAL_DISPOSITIONS: { key: FinalDisposition; label: string; desc: string }[] = [
  {
    key: 'SALE_DD_COLLECTED',
    label: 'Sale — DD collected',
    desc: 'Customer verified Sort Code and Account Number for Direct Debit modification.',
  },
  {
    key: 'SALE_IBAN_COLLECTED',
    label: 'Sale — IBAN collected',
    desc: 'Customer verified via IBAN / Consumer ID reference on statement.',
  },
  {
    key: 'SALE_CALLBACK_NEEDED',
    label: 'Sale — Callback needed',
    desc: 'Customer requested callback to complete verification or check statement.',
  },
  {
    key: 'NO_SALE_NOT_INTERESTED',
    label: 'No sale — Not interested',
    desc: 'Customer declined bill reduction offer.',
  },
  {
    key: 'NO_SALE_COMPLIANCE_STOP',
    label: 'No sale — Compliance STOP',
    desc: 'Customer asked to end call or remove number.',
  },
  {
    key: 'NO_SALE_UNDER_AGE',
    label: 'No sale — Under age / no eligibility',
    desc: 'Customer did not meet eligibility or age criteria.',
  },
  {
    key: 'NO_SALE_ESCALATED_SENIOR',
    label: 'No sale — Escalated to senior',
    desc: 'Transferred or escalated to senior care specialist for manual verification.',
  },
];

export const CallCompletionCard: React.FC = () => {
  const {
    stages,
    finalDisposition,
    setFinalDisposition,
    verifiedFields,
    notes,
    addNote,
    openHomeModal,
    adminConfig,
    callHistory,
    isStatementInHand,
  } = useCallContext();

  const [callNote, setCallNote] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const verifiedCount = Object.keys(verifiedFields).length;
  const coreStagesCount = stages.filter(
    (s) => !s.id.startsWith('rebuttal_') && s.id !== 'completion'
  ).length;

  const handleLogAndClose = () => {
    if (callNote.trim()) {
      addNote(callNote.trim());
    }
    const logData = {
      timestamp: new Date().toISOString(),
      disposition: finalDisposition || 'SALE_DD_COLLECTED',
      statementInHand: isStatementInHand,
      verifiedFields,
      notes: callNote ? [...notes, callNote] : notes,
      historyCount: callHistory.length,
      status: 'CALL_COMPLETE',
      adminOffer: `${adminConfig.offerPercentage}% discount`,
    };

    try {
      const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `call_summary_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore if DOM download not available
    }

    setIsLogged(true);
  };

  return (
    <div className="completion-card">
      <div className="completion-icon-wrapper">
        <Trophy size={36} />
      </div>

      <div>
        <h2 className="completion-title">CALL COMPLETE ✓</h2>
        <div className="completion-subtitle">
          Core stages completed: {coreStagesCount} / {coreStagesCount}
        </div>
      </div>

      {/* Metric Stats Pills */}
      <div className="completion-metrics-row">
        <div className="metric-pill">
          <FileCheck size={16} color="#34d399" />
          <span style={{ color: 'var(--text-secondary)' }}>Items Verified:</span>
          <strong>{verifiedCount}</strong>
        </div>

        <div className="metric-pill">
          <ShieldCheck size={16} color="#fbbf24" />
          <span style={{ color: 'var(--text-secondary)' }}>Notes Recorded:</span>
          <strong>{notes.length}</strong>
        </div>
      </div>

      {/* 7 Disposition Chips */}
      <div style={{ width: '100%', maxWidth: '780px' }}>
        <div className="disposition-header" style={{ marginBottom: '0.65rem' }}>
          SELECT FINAL CALL DISPOSITION
        </div>

        <div className="final-disposition-grid">
          {FINAL_DISPOSITIONS.map((disp) => {
            const isSelected = finalDisposition === disp.key;
            return (
              <button
                key={disp.key}
                type="button"
                onClick={() => setFinalDisposition(disp.key)}
                className={`final-disp-btn ${isSelected ? 'selected' : ''}`}
                title={disp.desc}
              >
                {disp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Notes Textarea */}
      <div style={{ width: '100%', maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label htmlFor="completion-notes" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          CALL SUMMARY NOTES:
        </label>
        <textarea
          id="completion-notes"
          rows={2}
          value={callNote}
          onChange={(e) => setCallNote(e.target.value)}
          placeholder="Add any agent verification notes, customer nuances, or follow-up details..."
          className="compact-notes-textarea"
        />
      </div>

      {/* Summary Note */}
      <div className="completion-summary-text">
        Black-and-white {adminConfig.deliveryWording.toLowerCase()} dispatched to customer postal address within 2 working days. Account qualified for up to {adminConfig.offerPercentage}% monthly discount.
      </div>

      {/* Action CTA: LOG & CLOSE and RETURN HOME */}
      <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
        <button
          type="button"
          onClick={handleLogAndClose}
          className="btn-log-close"
          disabled={!finalDisposition}
        >
          {isLogged ? <CheckCircle2 size={18} /> : <Download size={18} />}
          <span>{isLogged ? 'SUMMARY EXPORTED ✓' : 'LOG & CLOSE'}</span>
        </button>

        <button
          type="button"
          onClick={openHomeModal}
          className="btn-return-home"
        >
          <RotateCcw size={18} />
          <span>RETURN HOME</span>
        </button>
      </div>
    </div>
  );
};
