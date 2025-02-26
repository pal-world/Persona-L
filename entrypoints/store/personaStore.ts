import { create } from 'zustand';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PersonaState {
  persona: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  setPersona: (persona: string) => void;
  addMessage: (message: Message) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
}

export const usePersonaStore = create<PersonaState>((set) => ({
  persona: null,
  messages: [],
  isLoading: false,
  error: null,
  
  setPersona: (persona) => set({ persona }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearChat: () => set({ messages: [] }),
})); 