import React, { useState, useMemo } from 'react';
import { useCallContext } from '../context/CallContext';
import { QUICK_OBJECTIONS } from '../data/callFlowData';
import { Search, X, ArrowRight } from 'lucide-react';

export const ObjectionSearchModal: React.FC = () => {
  const {
    isObjectionSearchOpen,
    setIsObjectionSearchOpen,
    stages,
    jumpToStage,
    formatScriptText,
  } = useCallContext();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredObjections = useMemo(() => {
    if (!searchQuery.trim()) return QUICK_OBJECTIONS;
    const q = searchQuery.toLowerCase();
    return QUICK_OBJECTIONS.filter(
      (obj) =>
        obj.trigger.toLowerCase().includes(q) ||
        obj.shortAnswer.toLowerCase().includes(q) ||
        obj.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredStages = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return stages.filter(
      (stg) =>
        stg.title.toLowerCase().includes(q) ||
        (stg.internalLabel && stg.internalLabel.toLowerCase().includes(q)) ||
        stg.script.toLowerCase().includes(q)
    );
  }, [stages, searchQuery]);

  if (!isObjectionSearchOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
      <div className="modal-content" style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={20} color="#60a5fa" />
            <h3 id="search-modal-title" className="modal-title">
              Quick Search & Objection Library
            </h3>
          </div>
          <button
            onClick={() => setIsObjectionSearchOpen(false)}
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                top: '50%',
                left: '12px',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type e.g. DOB, IBAN, bank details, already happy, angry, letter..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.4rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-prominent)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.95rem',
              }}
            />
          </div>

          {/* Direct Stage Jump Results */}
          {filteredStages.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#60a5fa',
                  marginBottom: '0.4rem',
                }}
              >
                Matching Stages ({filteredStages.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {filteredStages.map((stg) => (
                  <div
                    key={stg.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                        Stage {stg.stepNumber}: {stg.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {stg.script.slice(0, 90)}...
                      </div>
                    </div>
                    <button
                      onClick={() => jumpToStage(stg.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.4rem 0.75rem',
                        background: '#3b82f6',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      <span>Jump to Stage</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Objection Guidance Items */}
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              Objection Guidance ({filteredObjections.length}):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredObjections.map((obj) => (
                <div
                  key={obj.id}
                  style={{
                    padding: '1rem',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1rem' }}>
                      “{obj.trigger}”
                    </div>
                    {obj.stageRelevant && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          background: 'rgba(255,255,255,0.08)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Relevant: {obj.stageRelevant}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 600 }}>
                    <strong>Acknowledgement:</strong> {formatScriptText(obj.acknowledgement)}
                  </div>

                  <div style={{ fontSize: '0.92rem', color: '#ffffff', lineHeight: 1.45 }}>
                    <strong>Say this:</strong> {formatScriptText(obj.shortAnswer)}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#93c5fd', fontStyle: 'italic' }}>
                    <strong>Bridge Back:</strong> {formatScriptText(obj.bridgeBack)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={() => setIsObjectionSearchOpen(false)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-prominent)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
