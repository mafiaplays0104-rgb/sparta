import React, { useState } from 'react';
import { useCallContext } from '../context/CallContext';
import {
  X,
  RotateCcw,
  Search,
  Sliders,
} from 'lucide-react';
import { RecoveryToolbar } from './RecoveryToolbar';
import { VerificationChecklist } from './VerificationChecklist';
import { NotesDrawer } from './NotesDrawer';

export const ToolsRail: React.FC = () => {
  const {
    isToolsRailOpen,
    setIsToolsRailOpen,
    setIsObjectionSearchOpen,
  } = useCallContext();

  const [activeSection, setActiveSection] = useState<'recovery' | 'checklist' | 'notes' | 'all'>('all');

  if (!isToolsRailOpen) return null;

  return (
    <div className="bottom-tools-rail" role="region" aria-label="Bottom Collapsible Tools Rail">
      {/* Rail Header Bar */}
      <div className="tools-rail-header">
        <div className="rail-title-wrap">
          <Sliders size={16} color="#38bdf8" />
          <span className="rail-main-title">PERSISTENT TOOLS RAIL</span>
          <span className="rail-subtitle-hint">Collapsible bottom drawer (toggle anytime via ☰)</span>
        </div>

        <div className="rail-tab-controls">
          <button
            onClick={() => setActiveSection('all')}
            className={`rail-tab-btn ${activeSection === 'all' ? 'active' : ''}`}
          >
            All Tools
          </button>
          <button
            onClick={() => setActiveSection('recovery')}
            className={`rail-tab-btn ${activeSection === 'recovery' ? 'active' : ''}`}
          >
            Recovery
          </button>
          <button
            onClick={() => setActiveSection('checklist')}
            className={`rail-tab-btn ${activeSection === 'checklist' ? 'active' : ''}`}
          >
            Checklist
          </button>
          <button
            onClick={() => setActiveSection('notes')}
            className={`rail-tab-btn ${activeSection === 'notes' ? 'active' : ''}`}
          >
            Notes
          </button>

          <button
            onClick={() => {
              setIsObjectionSearchOpen(true);
            }}
            className="rail-tab-btn search-trigger"
            title="Search Objections (S)"
          >
            <Search size={13} />
            <span>Search</span>
          </button>

          <button
            onClick={() => setIsToolsRailOpen(false)}
            className="rail-close-btn"
            title="Close Tools Rail (☰)"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Rail Content Grid */}
      <div className="tools-rail-body">
        {(activeSection === 'all' || activeSection === 'recovery') && (
          <div className="rail-section-panel recovery-panel">
            <div className="rail-section-header">
              <RotateCcw size={14} />
              <span>9 RECOVERY OVERLAY TOOLS</span>
            </div>
            <RecoveryToolbar />
          </div>
        )}

        <div className="rail-secondary-grid">
          {(activeSection === 'all' || activeSection === 'checklist') && (
            <div className="rail-section-panel checklist-panel">
              <VerificationChecklist />
            </div>
          )}

          {(activeSection === 'all' || activeSection === 'notes') && (
            <div className="rail-section-panel notes-panel">
              <NotesDrawer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
