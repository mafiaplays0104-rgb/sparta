import React, { useState } from 'react';
import { useCallContext } from '../context/CallContext';
import { StickyNote, Plus, Clock, Tag } from 'lucide-react';

const QUICK_TAGS = [
  'Prefers morning calls',
  'Wants callback',
  'Hard of hearing / speaks slowly',
  'Interested in broadband speed',
  'Verified independent decision maker',
];

export const NotesDrawer: React.FC = () => {
  const { notes, addNote } = useCallContext();
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addNote(inputText);
      setInputText('');
    }
  };

  const handleAddQuickTag = (tag: string) => {
    addNote(tag);
  };

  return (
    <div
      style={{
        background: 'rgba(17, 24, 39, 0.5)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.85rem 1.15rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StickyNote size={17} color="#60a5fa" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            CALL SCRATCHPAD & NOTES ({notes.length})
          </span>
        </div>

        <button
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#60a5fa',
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
          }}
        >
          {isOpen ? 'Hide Notes ▲' : 'Open Notes ▼'}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Quick Tags */}
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '0.35rem',
              }}
            >
              Quick Presets:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddQuickTag(tag)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.55rem',
                    borderRadius: '4px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Tag size={11} />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Customer requested callback tomorrow at 11am..."
              style={{
                flex: 1,
                padding: '0.55rem 0.85rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-prominent)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.85rem',
              }}
            />
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.55rem 0.95rem',
                borderRadius: '6px',
                background: '#3b82f6',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
              }}
            >
              <Plus size={15} />
              <span>Add Note</span>
            </button>
          </form>

          {/* Notes List */}
          {notes.length > 0 ? (
            <div
              style={{
                maxHeight: '130px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    padding: '0.45rem 0.75rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: '#f3f4f6' }}>{note.text}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <Clock size={11} />
                    {note.timestamp}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No notes entered yet for this call.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
