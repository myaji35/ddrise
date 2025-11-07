import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string; // Changed from Date to string for serialization
}

export interface LeadInfo {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  inquiryType?: string;
}

interface ChatbotState {
  // Session & Messages
  sessionId: string;
  messages: Message[];
  isLoading: boolean;
  isOpen: boolean;

  // Lead Capture
  leadInfo: LeadInfo;
  hasLeadBeenCaptured: boolean;

  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  clearMessages: () => void;
  updateLeadInfo: (info: Partial<LeadInfo>) => void;
  setLeadCaptured: (captured: boolean) => void;
  resetSession: () => void;
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessionId: crypto.randomUUID(),
      messages: [],
      isLoading: false,
      isOpen: false,
      leadInfo: {},
      hasLeadBeenCaptured: false,

      // Actions
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
            },
          ],
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setOpen: (open) => set({ isOpen: open }),

      clearMessages: () => set({ messages: [] }),

      updateLeadInfo: (info) =>
        set((state) => ({
          leadInfo: { ...state.leadInfo, ...info },
        })),

      setLeadCaptured: (captured) => set({ hasLeadBeenCaptured: captured }),

      resetSession: () =>
        set({
          sessionId: crypto.randomUUID(),
          messages: [],
          isLoading: false,
          leadInfo: {},
          hasLeadBeenCaptured: false,
        }),
    }),
    {
      name: 'daedong-chatbot-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        messages: state.messages,
        leadInfo: state.leadInfo,
        hasLeadBeenCaptured: state.hasLeadBeenCaptured,
      }),
      skipHydration: true, // Prevent SSR hydration mismatch
    }
  )
);
