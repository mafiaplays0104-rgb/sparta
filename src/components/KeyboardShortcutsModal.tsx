import React from 'react';
import { useCallContext } from '../context/CallContext';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  { key: '1', label: 'Select YES / POSITIVE category' },
  { key: '2', label: 'Select NO / NEGATIVE category' },
  { key: '3', label: "Select DON'T KNOW / CONFUSED category" },
  { key: '4', label: 'Select QUESTION / OBJECTION category' },
  { key: '5', label: 'Select STOP / COMPLIANCE category' },
  { key: 'N', label: 'Advance to NEXT step' },
  { key: 'B', label: 'Return to previous step (BACK)' },
  { key: 'H', label: 'Trigger HOME / Start New Call modal' },
  { key: 'S', label: 'Open Quick Search & Objection Library' },
  { key: 'Esc', label: 'Close any open modal or recovery box' },
];

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useCallContext();

  if (!isShortcutsModalOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Keyboard size={20} color="#60a5fa" />
            <h3 id="shortcuts-title" className="modal-title">
              Cockpit Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Operate the call flow rapidly with single keystrokes without taking your hands off the keyboard during live customer speech:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {SHORTCUTS.map((sc) => (
              <div
                key={sc.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.85rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                }}
              >
                <span style={{ fontSize: '0.88rem', color: '#ffffff' }}>{sc.label}</span>
                <kbd
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    background: 'rgba(0, 0, 0, 0.45)',
                    border: '1px solid var(--border-prominent)',
                    borderRadius: '4px',
                    padding: '0.2rem 0.6rem',
                    color: '#93c5fd',
                    boxShadow: '0 2px 0 rgba(0,0,0,0.5)',
                  }}
                >
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              background: '#3b82f6',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
