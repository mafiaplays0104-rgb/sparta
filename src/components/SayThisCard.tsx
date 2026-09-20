import React, { useState, useMemo } from 'react';
import { useCallContext } from '../context/CallContext';
import {
  Copy,
  Check,
  ShieldAlert,
  Info,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';

export const SayThisCard: React.FC = () => {
  const {
    sayThisText,
    currentStage,
    selectedCategory,
    activeRecovery,
    activeRebuttal,
    dismissRecovery,
    clearRebuttal,
    isSoftenActive,
    toggleSoften,
  } = useCallContext();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const cleanText = sayThisText.replace(/^[“"]|[”"]$/g, '');
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Estimate reading time in seconds (~130 words/min = ~2.2 words/sec)
  const readingTimeSec = useMemo(() => {
    const words = sayThisText.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.round(words / 2.2));
  }, [sayThisText]);

  // Status badge label
  const getBadgeLabel = () => {
    if (activeRebuttal) return `REBUTTAL ACTIVE (${activeRebuttal.label})`;
    if (activeRecovery) return `RECOVERY ACTIVE — ${activeRecovery.replace(/_/g, ' ')}`;
    if (selectedCategory) return `RECOMMENDED RESPONSE — ${selectedCategory}`;
    if (isSoftenActive && currentStage.sayThisSoftened) return 'SOFTENED SCRIPT VARIANT';
    return 'APPROVED SALES SCRIPT';
  };

  // Auto-scale font based on length to ensure 4 lines max without scroll
  const textLength = sayThisText.length;
  let dynamicFontSize = '1.35rem';
  if (textLength > 320) {
    dynamicFontSize = '1.05rem';
  } else if (textLength > 220) {
    dynamicFontSize = '1.18rem';
  } else if (textLength > 150) {
    dynamicFontSize = '1.28rem';
  }

  const isDataProtectionStage =
    currentStage.isDataProtectionFrame ||
    currentStage.id === 'stage_6a' ||
    currentStage.id === 'stage_6b' ||
    currentStage.id === 'stage_6c' ||
    currentStage.id === 'stage_6d';

  return (
    <section className="say-this-container" aria-label="Say This Main Script Container">
      {/* 6. DATA-PROTECTION FRAME STRIP */}
      {isDataProtectionStage && (
        <div className="data-protection-frame-strip">
          <div className="dp-strip-inner">
            <Lock size={13} />
            <span>Data-Protection Frame Active (Recorded Line / Masked Details Framing)</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="say-this-header">
        <div className="say-this-title-wrap">
          <span className="say-this-main-label">SAY THIS</span>
          <span className="say-this-status-pill">{getBadgeLabel()}</span>

          {/* Rebuttal Counter beside stage title */}
          {activeRebuttal && (
            <span className="rebuttal-active-badge">
              {currentStage.id.startsWith('stage_6') ? 'DD Push' : 'Rebuttal'}: {activeRebuttal.step}/
              {currentStage.rebuttals?.length || 3}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* SOFTEN toggle button inside card */}
          {currentStage.sayThisSoftened && (
            <button
              type="button"
              onClick={toggleSoften}
              className={`card-soften-btn ${isSoftenActive ? 'active' : ''}`}
              title="Toggle softened conversational script variant (S)"
            >
              <Sparkles size={12} />
              <span>{isSoftenActive ? 'SOFTENED' : 'SOFTEN'}</span>
            </button>
          )}

          {/* Return to Stage mini button if Rebuttal active */}
          {activeRebuttal && (
            <button
              onClick={clearRebuttal}
              className="recovery-return-btn"
              title="Return to standard stage script"
            >
              <RotateCcw size={12} />
              <span>Return to Stage</span>
            </button>
          )}

          {/* Return to Stage if Recovery active */}
          {activeRecovery && (
            <button
              onClick={dismissRecovery}
              className="recovery-return-btn"
              title="Return to standard stage script"
            >
              <RotateCcw size={12} />
              <span>Return to Stage</span>
            </button>
          )}

          {/* Reading-time Ring Indicator */}
          <div className="reading-time-indicator" title={`Estimated reading cadence: ~${readingTimeSec} seconds`}>
            <svg width="22" height="22" viewBox="0 0 24 24" className="reading-ring-svg">
              <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" fill="none" />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#38bdf8"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="56.5"
                strokeDashoffset="14"
                strokeLinecap="round"
              />
            </svg>
            <span className="reading-sec-text">{readingTimeSec}s</span>
          </div>

          {/* COPY Button */}
          <button
            onClick={handleCopy}
            className={`copy-btn ${copied ? 'copied' : ''}`}
            title="Copy exact text inside SAY THIS"
            aria-label={copied ? 'Copied to clipboard' : 'Copy text'}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>✓ COPIED</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The Single Exact Paragraph / Sentence to Read */}
      <div className="say-this-speech-box">
        <p className="say-this-text" style={{ fontSize: dynamicFontSize }}>
          {sayThisText}
        </p>
      </div>

      {/* Sensitive Guidance Warning if applicable */}
      {currentStage.isSensitive && (
        <div className="sensitive-reminder-box">
          <Info size={15} />
          <span>Explain the genuine purpose before requesting financial or verification information.</span>
        </div>
      )}

      {currentStage.complianceWarning && (
        <div className="compliance-warning-box">
          <ShieldAlert size={15} />
          <span>{currentStage.complianceWarning}</span>
        </div>
      )}
    </section>
  );
};
