'use client';

import { useEffect, useRef } from 'react';
import { Bot, User, Loader2 } from 'lucide-react';
import { Message } from '@/stores/chatbot-store';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex gap-3',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
          )}

          <div
            className={cn(
              'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm',
              message.role === 'user'
                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                : 'bg-white text-slate-900 border border-slate-200'
            )}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
            <p
              className={cn(
                'text-xs mt-1',
                message.role === 'user' ? 'text-white/70' : 'text-slate-500'
              )}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {message.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-600" />
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
