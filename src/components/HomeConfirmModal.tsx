import React from 'react';
import { useCallContext } from '../context/CallContext';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

export const HomeConfirmModal: React.FC = () => {
  const { isHomeModalOpen, confirmHomeReset, cancelHomeReset } = useCallContext();

  if (!isHomeModalOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="home-modal-title">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={22} color="#f59e0b" />
            <h3 id="home-modal-title" className="modal-title">
              Start a new call?
            </h3>
          </div>
          <button onClick={cancelHomeReset} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.5 }}>
            This will reset the active call flow, reset the call timer, clear selected responses and objection states, and return you to:
          </p>
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontWeight: 700,
              color: '#93c5fd',
              fontSize: '0.9rem',
            }}
          >
            STAGE 1: OPENING (Step 1 of 15)
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Ensure your call wrap-up or notes are noted if required before proceeding.
          </p>
        </div>

        <div className="modal-footer">
          <button
            onClick={cancelHomeReset}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-prominent)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            CANCEL
          </button>

          <button
            onClick={confirmHomeReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.65rem 1.45rem',
              borderRadius: '8px',
              background: '#ef4444',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.92rem',
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.35)',
            }}
          >
            <RotateCcw size={16} />
            <span>START NEW CALL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
