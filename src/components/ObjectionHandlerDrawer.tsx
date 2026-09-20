import React from 'react';
import { useCallContext } from '../context/CallContext';
import { X, Shield, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';

export const ObjectionHandlerDrawer: React.FC = () => {
  const {
    currentStage,
    activeRebuttal,
    fireRebuttal,
    clearRebuttal,
    isObjectionHandlerOpen,
    setIsObjectionHandlerOpen,
  } = useCallContext();

  if (!isObjectionHandlerOpen) return null;

  const rebuttals = currentStage.rebuttals || [];
  const stageHasRebuttals = rebuttals.length > 0;

  return (
    <aside
      className="objection-drawer-overlay"
      aria-label="Objection Handler Panel"
      role="dialog"
    >
      <div className="objection-drawer">
        {/* Drawer Header */}
        <div className="objection-drawer-header">
          <div className="objection-drawer-title">
            <Shield size={18} color="#38bdf8" />
            <div>
              <h3>OBJECTION HANDLER</h3>
              <span className="objection-stage-hint">
                {currentStage.title} {stageHasRebuttals ? `(${rebuttals.length}-Step Ladder)` : ''}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsObjectionHandlerOpen(false)}
            className="drawer-close-btn"
            title="Close Drawer (Esc / O)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="objection-drawer-content">
          {activeRebuttal && (
            <div className="active-rebuttal-banner">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="arb-title">Currently Fired: {activeRebuttal.label}</span>
                <button
                  onClick={clearRebuttal}
                  className="arb-clear-btn"
                  title="Return to standard stage script"
                >
                  <RotateCcw size={12} />
                  <span>Return to Stage</span>
                </button>
              </div>
              <p className="arb-text">{activeRebuttal.text}</p>
            </div>
          )}

          {stageHasRebuttals ? (
            <div className="rebuttal-ladder-list">
              <div className="ladder-intro-note">
                Click any rebuttal below to display it immediately in SAY THIS without losing stage position:
              </div>

              {rebuttals.map((reb) => {
                const isActive = activeRebuttal?.step === reb.step;

                return (
                  <div
                    key={reb.step}
                    className={`rebuttal-card ${isActive ? 'active' : ''}`}
                    onClick={() => fireRebuttal(reb.step)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fireRebuttal(reb.step);
                      }
                    }}
                  >
                    <div className="rebuttal-card-header">
                      <span className="rebuttal-step-tag">R{reb.step}</span>
                      <span className="rebuttal-card-title">{reb.label}</span>
                      <kbd className="rebuttal-kbd">R{reb.step}</kbd>
                    </div>

                    <p className="rebuttal-script-text">{reb.text}</p>

                    <div className="rebuttal-card-footer">
                      <span className="rebuttal-action-label">
                        {isActive ? '✓ Fired in SAY THIS' : 'Click to say this line'}
                      </span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-rebuttal-state">
              <AlertCircle size={28} color="#94a3b8" />
              <p>No objection ladder for this stage.</p>
              <span>Use the standard customer response buttons or recovery tools.</span>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="objection-drawer-footer">
          <span className="footer-tip">Tip: Closing drawer preserves the active rebuttal in SAY THIS</span>
          <button
            onClick={() => setIsObjectionHandlerOpen(false)}
            className="drawer-done-btn"
          >
            Keep & Close
          </button>
        </div>
      </div>
    </aside>
  );
};
