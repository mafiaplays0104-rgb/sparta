import React from 'react';
import { useCallContext } from '../context/CallContext';
import type { RecoveryType } from '../types';
import { RECOVERY_ACTIONS } from '../data/callFlowData';

const RECOVERY_TYPES: RecoveryType[] = [
  'OFF_TOPIC',
  'INTERRUPTED',
  'REPEAT',
  'CONFUSED',
  'SLOW_DOWN',
  'BUSY_BAD_TIME',
  'NOT_BILL_PAYER',
  'IS_SCAM',
  'HOW_GET_NUMBER',
];

export const RecoveryToolbar: React.FC = () => {
  const { activeRecovery, triggerRecovery } = useCallContext();

  return (
    <div className="recovery-section">
      <span className="recovery-label">RECOVERY TOOLS:</span>

      <div className="recovery-buttons-wrap">
        {RECOVERY_TYPES.map((type) => {
          const item = RECOVERY_ACTIONS[type];
          if (!item) return null;
          const isActive = activeRecovery === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => triggerRecovery(type)}
              className={`recovery-pill ${isActive ? 'active' : ''}`}
              title={item.sayThis || `${item.acknowledgement} ${item.response}`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
