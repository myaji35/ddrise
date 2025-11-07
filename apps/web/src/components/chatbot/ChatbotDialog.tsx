'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useChatbotStore } from '@/stores/chatbot-store';
import { MessageList } from './MessageList';
import { useTranslations } from 'next-intl';

export function ChatbotDialog() {
  const t = useTranslations('contact');
  const { isOpen, setOpen, messages, addMessage, isLoading, setLoading, sessionId } = useChatbotStore();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    setLoading(true);

    try {
      // Call AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
          history: messages.slice(-10), // Last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add AI response
      addMessage({
        role: 'assistant',
        content: data.response,
      });

      // If lead info was extracted, update store
      if (data.leadInfo) {
        useChatbotStore.getState().updateLeadInfo(data.leadInfo);
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact us directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-6 right-6 w-[400px] h-[600px] shadow-2xl z-50 flex flex-col bg-white border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">AI Assistant</h3>
            <p className="text-xs text-white/80">24/7 Available</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(false)}
          className="text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-indigo-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">
              Welcome to Daedong AI Assistant
            </h4>
            <p className="text-sm text-slate-600 mb-4">
              Ask me about our products, request a quote, or inquire about partnerships.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput('I need a quote for pipe cutting equipment');
                  inputRef.current?.focus();
                }}
                className="text-xs"
              >
                Request Quote
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput('Tell me about EXACT products');
                  inputRef.current?.focus();
                }}
                className="text-xs"
              >
                About EXACT
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput('I want to become a partner');
                  inputRef.current?.focus();
                }}
                className="text-xs"
              >
                Partnership
              </Button>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Powered by AI • Available 24/7
        </p>
      </form>
    </Card>
  );
}
