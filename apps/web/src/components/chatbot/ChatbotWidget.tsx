'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatbotStore } from '@/stores/chatbot-store';
import { ChatbotDialog } from './ChatbotDialog';

export function ChatbotWidget() {
  const { isOpen, setOpen } = useChatbotStore();
  const [hydrated, setHydrated] = useState(false);

  // Handle hydration for zustand persist
  useEffect(() => {
    useChatbotStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  // Don't render until hydrated to prevent SSR mismatch
  if (!hydrated) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-110 z-50"
          aria-label="Open AI Chatbot"
        >
          <MessageCircle className="h-7 w-7 text-white" />
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-purple-500"></span>
          </span>
        </Button>
      )}

      {/* Chat Dialog */}
      <ChatbotDialog />
    </>
  );
}
