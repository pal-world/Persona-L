import { supabase } from './supabase';

// 페르소나 응답 인터페이스
export interface PersonaResponse {
  nickname: string;
  description: string;
}

// 메시지 인터페이스
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// 요청 인터페이스들
interface GeneratePersonaRequest {
  pageContent: string;
  pageUrl?: string;
}

interface ChatWithPersonaRequest {
  prompt: string;
  pageContent?: string;
  persona?:
    | string
    | {
        nickname: string;
        description: string;
      };
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

/**
 * 페르소나 생성 함수
 * @param pageContent 현재 페이지 내용
 * @param pageUrl 현재 페이지 URL (옵션)
 * @returns PersonaResponse 객체
 */
export const generatePersona = async (pageContent: string, pageUrl?: string): Promise<PersonaResponse> => {
  const payload: GeneratePersonaRequest = { pageContent, pageUrl };
  
  const { data, error } = await supabase.functions.invoke('openai/generate-persona', {
    body: payload
  });
  
  if (error) {
    throw new Error(error.message || '페르소나 생성에 실패했습니다.');
  }
  
  return data as PersonaResponse;
};

/**
 * 페르소나와 채팅 함수
 * @param params ChatWithPersonaRequest 객체
 * @returns 응답 문자열
 */
export const chatWithPersona = async (params: ChatWithPersonaRequest): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('openai/chat-with-persona', {
    body: params
  });
  
  if (error) {
    throw new Error(error.message || '채팅 응답 생성에 실패했습니다.');
  }
  
  return (data as { response: string }).response;
}; 