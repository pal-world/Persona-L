import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

// 로컬 스토리지를 사용하여 상태 유지
export const usePersonaStore = create<PersonaState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'persona-storage', // 스토리지 키 이름
      storage: createJSONStorage(() => localStorage), // 로컬 스토리지 사용
      partialize: (state) => ({ 
        persona: state.persona, 
        messages: state.messages 
      }), // 저장할 상태 선택
    }
  )
); 