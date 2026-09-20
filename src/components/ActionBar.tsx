import React from 'react';
import { useCallContext } from '../context/CallContext';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

export const ActionBar: React.FC = () => {
  const {
    stages,
    currentStageIndex,
    isStage14,
    subStepIndex,
    currentStage,
    currentBranch,
    selectedCategory,
    activeRecovery,
    rebuttalCallerStageId,
    canGoBack,
    canGoNext,
    goBack,
    goNext,
    isHardStopped,
  } = useCallContext();

  if (isHardStopped) return null;

  // Calculate Next Step title
  let nextStepTitle = 'Next Stage';

  if (activeRecovery === 'BUSY_BAD_TIME') {
    nextStepTitle = 'COMPLETION (Callback Needed)';
  } else if (activeRecovery === 'NOT_BILL_PAYER') {
    nextStepTitle = 'STAGE 1 — CONFIRM BILL PAYER';
  } else if (currentStage.id.startsWith('rebuttal_')) {
    if (currentStage.id === 'rebuttal_4') {
      if (selectedCategory === 'POSITIVE') {
        nextStepTitle = 'STAGE 7 — VERIFY NAME, ADDRESS, POSTCODE';
      } else if (selectedCategory === 'NEGATIVE') {
        nextStepTitle = 'ESCALATE TO SENIOR (STOP)';
      } else {
        nextStepTitle = currentStage.title;
      }
    } else {
      if (selectedCategory === 'POSITIVE') {
        nextStepTitle =
          rebuttalCallerStageId === 'stage_6d'
            ? 'STAGE 6D — DD ASK PART 2 (ACCOUNT NUMBER)'
            : 'STAGE 6C — DD ASK PART 1 (SORT CODE)';
      } else if (selectedCategory === 'NEGATIVE') {
        const nextRebMap: Record<string, string> = {
          rebuttal_1: 'REBUTTAL 2',
          rebuttal_2: 'REBUTTAL 3',
          rebuttal_3: 'REBUTTAL 4 (LAST NET IBAN)',
        };
        nextStepTitle = nextRebMap[currentStage.id] || 'Next Rebuttal';
      } else {
        nextStepTitle = currentStage.title;
      }
    }
  } else if (isStage14 && currentStage.subSteps && subStepIndex < currentStage.subSteps.length - 1) {
    nextStepTitle = currentStage.subSteps[subStepIndex + 1].title;
  } else if (currentBranch?.nextStage) {
    if (currentBranch.nextStage === 'completion') {
      nextStepTitle = 'COMPLETION CARD';
    } else {
      const nextStg = stages.find((s) => s.id === currentBranch.nextStage);
      if (nextStg) nextStepTitle = nextStg.title;
    }
  } else if (currentStageIndex < stages.length - 1) {
    nextStepTitle = stages[currentStageIndex + 1].title;
  } else {
    nextStepTitle = 'COMPLETION CARD';
  }

  const hasActionPending = selectedCategory || activeRecovery === 'BUSY_BAD_TIME' || activeRecovery === 'NOT_BILL_PAYER';

  return (
    <div className="action-bar-container">
      <div className="action-bar-inner">
        {/* BACK button */}
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className="btn-nav back"
          title="Return to previous state (B)"
        >
          <ArrowLeft size={18} />
          <span>BACK (B)</span>
        </button>

        {/* Middle: Next Stage preview if category or recovery action selected */}
        <div className="next-stage-indicator">
          {hasActionPending ? (
            <>
              <span className="next-hint-label">NEXT:</span>
              <span className="next-stage-name">
                {nextStepTitle} <ArrowUpRight size={13} style={{ display: 'inline' }} />
              </span>
            </>
          ) : (
            <span className="next-hint-pending">
              Select one of the 5 customer responses above to enable NEXT
            </span>
          )}
        </div>

        {/* NEXT button */}
        <button
          onClick={goNext}
          disabled={!canGoNext}
          className="btn-nav next"
          title="Advance to next step (N)"
        >
          <span>NEXT (N)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
