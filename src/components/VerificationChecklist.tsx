import React, { useState } from 'react';
import { useCallContext } from '../context/CallContext';
import { CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'financial_decision', label: 'FINANCIAL DECISION' },
  { id: 'dob_verification', label: 'DOB' },
  { id: 'direct_debit', label: 'DIRECT DEBIT' },
  { id: 'consumer_id_iban', label: 'CONSUMER ID / IBAN' },
  { id: 'date_awareness', label: 'DATE CHECK' },
  { id: 'sort_code', label: 'SORT CODE' },
  { id: 'account_number', label: 'ACCOUNT NUMBER' },
  { id: 'name', label: 'NAME' },
  { id: 'address', label: 'ADDRESS' },
  { id: 'medical_alarm', label: 'MEDICAL ALARM' },
  { id: 'television', label: 'TV' },
  { id: 'mobile', label: 'MOBILE' },
];

export const VerificationChecklist: React.FC = () => {
  const { verifiedFields } = useCallContext();
  const [isOpen, setIsOpen] = useState(false);

  const completedCount = CHECKLIST_ITEMS.filter((item) => verifiedFields[item.id]).length;

  return (
    <div className="compact-checklist-container">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="checklist-summary-btn"
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckSquare size={14} color="#10b981" />
          <span>VERIFICATION CHECKLIST ({completedCount}/{CHECKLIST_ITEMS.length})</span>
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="checklist-items-grid">
          {CHECKLIST_ITEMS.map((item) => {
            const isDone = !!verifiedFields[item.id];
            return (
              <div
                key={item.id}
                className={`checklist-item ${isDone ? 'done' : 'pending'}`}
              >
                <span className="checklist-status-icon">{isDone ? '✓' : '○'}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
