import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generatePersona, chatWithPersona, PersonaResponse, Message } from '../services/supabaseApi';

// 저장된 대화 인터페이스 정의
interface SavedConversation {
  id: string;
  persona: string; // 저장 시에는 문자열 형태로만 저장
  personaNickname?: string; // 페르소나의 닉네임 (옵션)
  messages: Message[];
  url: string;
  timestamp: Date;
}

interface PersonaState {
  persona: PersonaResponse | null;
  isLoading: boolean;
  error: string | null;
  messages: Message[];
  pageContent: string;
  pageUrl: string;
  savedConversations: SavedConversation[]; // 저장된 대화 목록
  personaNickname?: string; // 닉네임 상태 추가

  setPageContent: (content: string, url: string) => void;
  generatePersona: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  clearPersona: () => void;
  setPersona: (persona: PersonaResponse) => void;
  setPersonaNickname: (nickname: string) => void; // 닉네임 설정 함수 추가
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
      isLoading: false,
      error: null,
      messages: [],
      pageContent: '',
      pageUrl: '',
      savedConversations: [],
      personaNickname: undefined,

      setPageContent: (content, url) => set({ pageContent: content, pageUrl: url }),
      
      generatePersona: async () => {
        const { pageContent, pageUrl } = get();
        
        if (!pageContent) {
          set({ error: '페이지 내용이 없습니다.' });
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const persona = await generatePersona(pageContent, pageUrl);
          set({ persona, isLoading: false });
        } catch (error: unknown) {
          // error를 unknown 타입으로 명시적으로 지정하고 타입 체크
          const errorMessage = error instanceof Error ? error.message : '페르소나 생성 실패';
          set({ error: errorMessage, isLoading: false });
        }
      },
      
      sendMessage: async (content) => {
        const { messages, persona, pageContent } = get();
        
        const userMessage: Message = { role: 'user', content };
        set({ messages: [...messages, userMessage], isLoading: true, error: null });
        
        try {
          const response = await chatWithPersona({
            prompt: content,
            pageContent,
            // null 체크 후 persona 전달
            persona: persona ?? undefined,
            messages
          });
          
          const assistantMessage: Message = { role: 'assistant', content: response };
          set(state => ({ 
            messages: [...state.messages, assistantMessage], 
            isLoading: false 
          }));
        } catch (error: unknown) {
          // error를 unknown 타입으로 명시적으로 지정하고 타입 체크
          const errorMessage = error instanceof Error ? error.message : '메시지 전송 실패';
          set(state => ({ 
            error: errorMessage, 
            isLoading: false 
          }));
        }
      },
      
      clearMessages: () => set({ messages: [] }),
      clearPersona: () => set({ persona: null, messages: [] }),

      // PersonaResponse 타입으로 수정
      setPersona: (persona: PersonaResponse) => set({ persona }),
      
      setPersonaNickname: (nickname: string) => set({ personaNickname: nickname }),
      
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
            persona: state.persona.nickname,
            personaNickname: state.persona.nickname, // 닉네임 저장
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
    },
  ),
);
