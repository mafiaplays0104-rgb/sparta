import React, { useState } from 'react';
import { useCallContext } from '../context/CallContext';
import type { HardStopDisposition } from '../types';
import { HARD_STOP_SAY_THIS } from '../data/callFlowData';
import { OctagonAlert, RotateCcw, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';

const DISPOSITIONS: { key: HardStopDisposition; label: string; desc: string }[] = [
  {
    key: 'DO_NOT_CALL',
    label: 'DO NOT CALL',
    desc: 'Customer requested permanent removal / TPS compliance.',
  },
  {
    key: 'CUSTOMER_DECLINED',
    label: 'CUSTOMER DECLINED',
    desc: 'Customer declined offer or requested to stop call.',
  },
  {
    key: 'VULNERABILITY_CONCERN',
    label: 'VULNERABILITY CONCERN',
    desc: 'Customer appeared confused, unwell, or third-party guardianship required.',
  },
  {
    key: 'NO_SALE_ESCALATED_SENIOR',
    label: 'ESCALATED TO SENIOR',
    desc: 'Escalated to senior care colleague for completion or verification.',
  },
  {
    key: 'OTHER_COMPLIANCE_ISSUE',
    label: 'OTHER COMPLIANCE ISSUE',
    desc: 'Audio recording defect, abusive language, or regulatory dispute.',
  },
];

export const HardStopCard: React.FC = () => {
  const {
    hardStopDisposition,
    setHardStopDisposition,
    openHomeModal,
    addNote,
    notes,
    callHistory,
  } = useCallContext();

  const [callNote, setCallNote] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  const handleCloseAndLog = () => {
    if (callNote.trim()) {
      addNote(callNote.trim());
    }
    const logData = {
      timestamp: new Date().toISOString(),
      disposition: hardStopDisposition || 'NO_SALE_COMPLIANCE_STOP',
      notes: callNote ? [...notes, callNote] : notes,
      historyCount: callHistory.length,
      status: 'HARD_STOP_COMPLIANCE',
    };

    try {
      const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `call_log_STOP_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore in environments without DOM file download
    }

    setIsLogged(true);
  };

  return (
    <div className="hard-stop-overlay" role="alert" aria-live="assertive">
      <div className="hard-stop-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="hard-stop-title">
            <OctagonAlert size={30} />
            <span>🔴 CALL ENDED — COMPLIANCE STOP</span>
          </div>
        </div>

        <div className="hard-stop-say-this-box">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#fca5a5', marginBottom: '0.35rem' }}>
            MANDATORY COMPLIANCE CLOSING (SAY THIS):
          </div>
          <div style={{ fontSize: '1.05rem', lineHeight: '1.5', color: '#fee2e2', fontWeight: 500 }}>
            "{HARD_STOP_SAY_THIS}"
          </div>
        </div>

        {/* Mandatory Disposition Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div className="disposition-header">
            <ShieldCheck size={16} />
            <span>MANDATORY COMPLIANCE DISPOSITION</span>
          </div>

          <div className="disposition-pills-group">
            {DISPOSITIONS.map((disp) => {
              const isSelected = hardStopDisposition === disp.key;
              return (
                <button
                  key={disp.key}
                  type="button"
                  onClick={() => setHardStopDisposition(disp.key)}
                  className={`disposition-pill ${isSelected ? 'selected' : ''}`}
                  title={disp.desc}
                >
                  <div>{disp.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Notes Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label htmlFor="stop-call-notes" style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600 }}>
            COMPLIANCE CALL NOTES:
          </label>
          <textarea
            id="stop-call-notes"
            rows={2}
            value={callNote}
            onChange={(e) => setCallNote(e.target.value)}
            placeholder="Record reason for stop, customer statements, or verification status..."
            className="compact-notes-textarea"
          />
        </div>

        {/* Action CTA: Only CLOSE & LOG and RETURN HOME */}
        <div className="hard-stop-footer">
          <span style={{ fontSize: '0.85rem', color: '#fca5a5' }}>
            {isLogged ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#86efac' }}>
                <CheckCircle2 size={16} /> Call Logged & Summary Exported
              </span>
            ) : hardStopDisposition ? (
              `✓ Selected: ${hardStopDisposition.replace(/_/g, ' ')}`
            ) : (
              '⚠️ Please select a disposition before logging.'
            )}
          </span>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleCloseAndLog}
              className="btn-close-log"
              disabled={!hardStopDisposition}
            >
              <Download size={16} />
              <span>CLOSE & LOG</span>
            </button>

            <button
              type="button"
              onClick={openHomeModal}
              className="btn-home-reset"
            >
              <RotateCcw size={16} />
              <span>RETURN HOME</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
