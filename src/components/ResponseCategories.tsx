import React from 'react';
import { useCallContext } from '../context/CallContext';
import type { ResponseCategory } from '../types';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquare,
  OctagonAlert,
} from 'lucide-react';

interface CategoryMetadata {
  key: ResponseCategory;
  shortcut: string;
  label: string;
  className: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryMetadata[] = [
  {
    key: 'POSITIVE',
    shortcut: '1',
    label: 'YES',
    className: 'cat-outline-green',
    icon: <CheckCircle2 size={17} />,
  },
  {
    key: 'NEGATIVE',
    shortcut: '2',
    label: 'NO',
    className: 'cat-outline-grey',
    icon: <XCircle size={17} />,
  },
  {
    key: 'CONFUSED',
    shortcut: '3',
    label: "DON'T KNOW",
    className: 'cat-outline-amber',
    icon: <HelpCircle size={17} />,
  },
  {
    key: 'OBJECTION',
    shortcut: '4',
    label: 'QUESTION',
    className: 'cat-outline-blue',
    icon: <MessageSquare size={17} />,
  },
  {
    key: 'STOP',
    shortcut: '5',
    label: 'STOP',
    className: 'cat-outline-red',
    icon: <OctagonAlert size={17} />,
  },
];

export const ResponseCategories: React.FC = () => {
  const {
    currentStage,
    isStage14,
    currentSubStep,
    selectedCategory,
    selectCategory,
    isHardStopped,
  } = useCallContext();

  const getStageSpecificDescription = (catKey: ResponseCategory): string => {
    if (isStage14 && currentSubStep && currentSubStep.branches[catKey]) {
      return currentSubStep.branches[catKey].buttonDescription;
    }
    if (currentStage && currentStage.branches[catKey]) {
      return currentStage.branches[catKey].buttonDescription;
    }
    return '';
  };

  return (
    <div className="customer-response-section" aria-label="Customer Response Buttons">
      <div className="section-label-bar">
        <span className="section-label">CUSTOMER RESPONSE</span>
        <span className="section-shortcut-hint">Shortcuts: 1 – 5</span>
      </div>

      <div className="categories-grid" role="group" aria-label="Five customer response options">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const stageDescription = getStageSpecificDescription(cat.key);

          return (
            <button
              key={cat.key}
              onClick={() => selectCategory(cat.key)}
              className={`category-btn ${cat.className} ${isSelected ? 'selected' : ''}`}
              aria-pressed={isSelected}
              disabled={isHardStopped && selectedCategory === 'STOP'}
            >
              <div className="category-top-row">
                <div className="category-title-wrap">
                  {cat.icon}
                  <span className="category-main-text">{cat.label}</span>
                </div>
                <span className="shortcut-badge">{cat.shortcut}</span>
              </div>

              {stageDescription && (
                <div className="category-stage-desc">
                  “{stageDescription}”
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
