import React from 'react';
import { useCallContext } from '../context/CallContext';
import {
  Home,
  FileText,
  Shield,
  HelpCircle,
  Menu,
  Sparkles,
  Check,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    stages,
    currentStage,
    openHomeModal,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    isHardStopped,
    isStatementInHand,
    toggleStatementInHand,
    isSoftenActive,
    toggleSoften,
    isObjectionHandlerOpen,
    setIsObjectionHandlerOpen,
    isToolsRailOpen,
    setIsToolsRailOpen,
    setIsShortcutsModalOpen,
  } = useCallContext();

  // Core stages for the ribbon (Stages 0 through 10, total 11 stages)
  const coreStages = stages.filter((s) => s.stageNumber !== undefined);
  const currentStageNum = currentStage.stageNumber ?? (currentStage.id === 'completion' ? 10 : 0);

  return (
    <header className="cockpit-header">
      <div className="header-inner">
        {/* Left: HOME Button + Stage Ribbon + Statement In Hand */}
        <div className="header-left-group">
          <button
            onClick={openHomeModal}
            className="home-nav-btn"
            title="Start New Call (H)"
          >
            <Home size={15} />
            <span>HOME</span>
          </button>

          {/* Stage Ribbon (pips) */}
          <div className="stage-ribbon-container" title={`Stage ${currentStageNum} of 10`}>
            <div className="stage-ribbon-pips">
              {coreStages.map((stg) => {
                const num = stg.stageNumber ?? 0;
                const isCurrent = currentStage.id === stg.id;
                const isCompleted = currentStageNum > num && !isHardStopped;
                const isHardStopPip = isHardStopped && isCurrent;

                let pipClass = 'ribbon-pip';
                if (isHardStopPip) pipClass += ' hard-stop';
                else if (isCurrent) pipClass += ' current';
                else if (isCompleted) pipClass += ' completed';
                else pipClass += ' unreached';

                return (
                  <div
                    key={stg.id}
                    className={pipClass}
                    title={`${stg.title} (${num}/10)`}
                  >
                    {isCompleted ? <Check size={9} /> : null}
                  </div>
                );
              })}
            </div>

            <div className="stage-ribbon-counter">
              <span className="ribbon-current">{currentStageNum}</span>
              <span className="ribbon-sep">/</span>
              <span className="ribbon-total">10</span>
            </div>
          </div>

          {/* Statement In Hand Pin */}
          <button
            type="button"
            onClick={toggleStatementInHand}
            className={`statement-pin-btn ${isStatementInHand ? 'active' : ''}`}
            title={
              isStatementInHand
                ? 'Statement In Hand: Active (Reused for DOB, DD Sort Code, and IBAN)'
                : 'Statement In Hand: Inactive (Lights up at Stage 4)'
            }
          >
            <FileText size={14} />
            <span>Statement In Hand 📄</span>
          </button>
        </div>

        {/* Right Tools: Objection Handler, Soften, A-/A+, Help, Tools Rail */}
        <div className="header-right-group">
          {/* OBJECTION HANDLER Button */}
          <button
            onClick={() => setIsObjectionHandlerOpen((prev) => !prev)}
            className={`top-btn objection-btn ${isObjectionHandlerOpen ? 'active' : ''}`}
            title="Open Objection Handler (O)"
          >
            <Shield size={14} />
            <span>OBJECTION HANDLER</span>
            <kbd className="key-hint">O</kbd>
          </button>

          {/* SOFTEN Button */}
          <button
            onClick={toggleSoften}
            className={`top-btn soften-btn ${isSoftenActive ? 'active' : ''}`}
            title="Toggle Softened Script Variant (S)"
          >
            <Sparkles size={14} />
            <span>{isSoftenActive ? 'SOFTENED ON' : 'SOFTEN'}</span>
            <kbd className="key-hint">S</kbd>
          </button>

          {/* Text Size A- / A+ */}
          <div className="font-size-controls" role="group" aria-label="Text Size Controls">
            <button
              onClick={decreaseFontSize}
              disabled={fontSize === 'normal'}
              className="font-btn"
              title="Decrease SAY THIS text size"
            >
              A−
            </button>
            <span className="font-current-indicator">
              {fontSize === 'normal' ? '100%' : fontSize === 'large' ? '115%' : '130%'}
            </span>
            <button
              onClick={increaseFontSize}
              disabled={fontSize === 'extra-large'}
              className="font-btn"
              title="Increase SAY THIS text size"
            >
              A+
            </button>
          </div>

          {/* HELP Shortcuts Button */}
          <button
            onClick={() => setIsShortcutsModalOpen(true)}
            className="top-btn help-btn"
            title="Keyboard Shortcuts (?)"
          >
            <HelpCircle size={15} />
            <span>HELP</span>
            <kbd className="key-hint">?</kbd>
          </button>

          {/* TOOLS Rail Toggle */}
          <button
            onClick={() => setIsToolsRailOpen((prev) => !prev)}
            className={`top-btn tools-rail-toggle ${isToolsRailOpen ? 'active' : ''}`}
            title="Toggle Bottom Tools Rail (☰)"
          >
            <Menu size={16} />
            <span>TOOLS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
