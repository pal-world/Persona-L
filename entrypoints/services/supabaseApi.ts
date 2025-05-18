import { supabase } from './supabase';
import { getUserUUID } from './userService';

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
  uuid?: string;
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
  uuid?: string;
}

// 에러 응답 인터페이스
interface ErrorResponse {
  error?: string;
  message?: string;
}

/**
 * 서버 에러 메시지 추출 함수
 * @param error 에러 객체
 * @param defaultMessage 기본 에러 메시지
 * @returns 에러 메시지
 */
const extractErrorMessage = async (error: any, defaultMessage: string): Promise<string> => {
  // 에러 객체가 없는 경우 기본 메시지 반환
  if (!error) return defaultMessage;

  try {
    const errorJson = await error.context.json();

    // errorJson.error가 존재하면 해당 오류 메시지 반환
    if (errorJson && errorJson.error) return errorJson.error;

    // 밑에 로직 필요없다면 삭제해도 됨
    // 에러 응답에 데이터가 있는 경우
    if (error.response && error.response.data) {
      const responseData = error.response.data as ErrorResponse;
      if (responseData.error) return responseData.error;
      if (responseData.message) return responseData.message;
    }

    // Edge Function 에러 메시지가 있는 경우
    if (error.message) {
      // Edge Function 에러 응답이 JSON 문자열인 경우 파싱 시도
      try {
        if (error.message.includes('{') && error.message.includes('}')) {
          const jsonStartIndex = error.message.indexOf('{');
          const jsonEndIndex = error.message.lastIndexOf('}') + 1;
          const jsonStr = error.message.substring(jsonStartIndex, jsonEndIndex);
          const parsedError = JSON.parse(jsonStr) as ErrorResponse;

          if (parsedError.error) return parsedError.error;
          if (parsedError.message) return parsedError.message;
        }
      } catch (_) {
        // JSON 파싱 실패한 경우 원래 메시지 사용
      }

      return error.message;
    }
  } catch (_) {
    // 에러 파싱 중 문제가 발생한 경우 기본 메시지 반환
  }

  return defaultMessage;
};

/**
 * 페르소나 생성 함수
 * @param pageContent 현재 페이지 내용
 * @param pageUrl 현재 페이지 URL (옵션)
 * @returns PersonaResponse 객체
 */
export const generatePersona = async (pageContent: string, pageUrl?: string): Promise<PersonaResponse> => {
  // 사용자 UUID 가져오기
  const uuid = await getUserUUID();

  const payload: GeneratePersonaRequest = { pageContent, pageUrl, uuid };

  const { data, error } = await supabase.functions.invoke('openai/generate-persona', {
    body: payload,
  });

  if (error) {
    console.error('페르소나 생성 에러:', error);
    throw new Error(await extractErrorMessage(error, '페르소나 생성에 실패했습니다.'));
  }

  return data as PersonaResponse;
};

/**
 * 페르소나와 채팅 함수
 * @param params ChatWithPersonaRequest 객체
 * @returns 응답 문자열
 */
export const chatWithPersona = async (params: ChatWithPersonaRequest): Promise<string> => {
  // 사용자 UUID 가져오기
  const uuid = await getUserUUID();

  // 요청 파라미터에 UUID 추가
  const requestParams = { ...params, uuid };

  const { data, error } = await supabase.functions.invoke('openai/chat-with-persona', {
    body: requestParams,
  });

  if (error) {
    console.error('채팅 응답 생성 에러:', error);
    throw new Error(await extractErrorMessage(error, '채팅 응답 생성에 실패했습니다.'));
  }

  return (data as { response: string }).response;
};
