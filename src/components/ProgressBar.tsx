import React from 'react';
import { useCallContext } from '../context/CallContext';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ProgressBar: React.FC = () => {
  const {
    stages,
    currentStageIndex,
    currentStage,
    isStage14,
    subStepIndex,
    verifiedFields,
  } = useCallContext();

  const totalSteps = stages.length;
  const currentStepNumber = currentStageIndex + 1;
  const progressPercent = Math.round((currentStepNumber / totalSteps) * 100);

  return (
    <div className="progress-section" aria-label="Call Progress Indicator">
      <div className="progress-meta-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="step-number-text">
            STEP {currentStepNumber} OF {totalSteps}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span className="step-percent-text">{progressPercent}%</span>
        </div>

        {currentStage.isSensitive && (
          <div className="sensitive-tag">
            <ShieldAlert size={13} />
            <span>SENSITIVE</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Current Stage Headline */}
      <div className="stage-header-row">
        <div className="stage-title-wrap">
          <span className="stage-subtitle-label">CURRENT STAGE</span>
          <h2 className="current-stage-title">{currentStage.title}</h2>
          {currentStage.internalLabel && (
            <span className="internal-audit-badge">{currentStage.internalLabel}</span>
          )}
        </div>

        {verifiedFields[currentStage.id] && (
          <div className="verified-status-tag">
            <CheckCircle2 size={13} />
            <span>✓ VERIFIED</span>
          </div>
        )}
      </div>

      {/* Sub-step tabs for Stage 14 */}
      {isStage14 && currentStage.subSteps && (
        <div className="substeps-row">
          {currentStage.subSteps.map((sub, idx) => {
            const isActive = idx === subStepIndex;
            const isDone = !!verifiedFields[sub.key] || idx < subStepIndex;
            return (
              <div
                key={sub.id}
                className={`substep-pill ${isActive ? 'active' : ''} ${isDone ? 'verified' : ''}`}
              >
                <span>{idx + 1}.</span>
                <span>{sub.title.replace(' VERIFICATION', '').replace(' CHECK', '')}</span>
                {isDone && <CheckCircle2 size={11} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
