import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PersonaResponse } from '../services/openaiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// 저장된 대화 인터페이스 정의
interface SavedConversation {
  id: string;
  persona: string; // 저장 시에는 문자열 형태로만 저장
  messages: Message[];
  url: string;
  timestamp: Date;
}

interface PersonaState {
  persona: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  savedConversations: SavedConversation[]; // 저장된 대화 목록

  setPersona: (persona: string) => void;
  addMessage: (message: Message) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
  saveCurrentConversation: (url: string) => void; // 현재 대화 저장 함수
  deleteSavedConversation: (id: string) => void; // 저장된 대화 삭제 함수
}

// 로컬 스토리지를 사용하여 상태 유지
export const usePersonaStore = create<PersonaState>()(
  persist(
    (set, get) => ({
      persona: null,
      messages: [],
      isLoading: false,
      error: null,
      savedConversations: [],

      setPersona: (persona) => set({ persona }),
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearChat: () => set({ messages: [] }),
      saveCurrentConversation: (url) =>
        set((state) => {
          // 현재 대화가 없으면 저장하지 않음
          if (!state.persona || state.messages.length === 0) {
            return state;
          }

          // 새로운 저장된 대화 객체 생성
          const newSavedConversation: SavedConversation = {
            id: Date.now().toString(), // 현재 시간을 ID로 사용
            persona: state.persona,
            messages: [...state.messages],
            url,
            timestamp: new Date(),
          };

          // 기존 저장된 대화 목록에 추가
          return {
            savedConversations: [...state.savedConversations, newSavedConversation],
          };
        }),
      deleteSavedConversation: (id) =>
        set((state) => ({
          savedConversations: state.savedConversations.filter((conversation) => conversation.id !== id),
        })),
    }),
    {
      name: 'persona-storage', // 스토리지 키 이름
      storage: createJSONStorage(() => localStorage), // 로컬 스토리지 사용
      partialize: (state) => ({
        persona: state.persona,
        messages: state.messages,
        savedConversations: state.savedConversations, // 저장된 대화도 유지
      }), // 저장할 상태 선택
    },
  ),
);
