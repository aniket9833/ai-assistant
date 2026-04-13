'use client';
import { useState, useRef, KeyboardEvent } from 'react';

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }

  return (
    <div className="border-t border-gray-100 px-4 py-4 bg-white">
      <div className="flex items-end gap-3 max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-200 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Message your assistant… (Enter to send)"
          rows={1}
          className="flex-1 bg-transparent resize-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50 leading-relaxed"
          style={{ minHeight: '24px', maxHeight: '160px' }}
        />
        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">
        Shift+Enter for new line
      </p>
    </div>
  );
}
