'use client';
import { useEffect, useRef } from 'react';
import StepLine from './StepLine';

interface Message {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  steps?: string[];
  createdAt?: string;
}

interface Props {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
}

export default function MessageList({ messages, isLoading, isSending }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.length === 0 && !isSending && (
        <div className="text-center text-sm text-gray-400 pt-12">
          Send a message to start the conversation
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[75%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}
          >
            {msg.role === 'assistant' && msg.steps && msg.steps.length > 0 && (
              <div className="mb-2 space-y-1">
                {msg.steps.map((step, i) => (
                  <StepLine key={i} text={step} />
                ))}
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        </div>
      ))}

      {isSending && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
            <div className="flex gap-1 items-center h-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
