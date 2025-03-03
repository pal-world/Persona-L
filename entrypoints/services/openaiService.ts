import OpenAI from 'openai';
import { useApiKeyStore } from '../store/apiKeyStore';

// API 키를 스토어에서 가져오는 함수
const getOpenAIInstance = () => {
  const apiKey = useApiKeyStore.getState().apiKey;

  if (!apiKey) {
    throw new Error('API 키가 설정되지 않았습니다.');
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
};

export interface ChatCompletionOptions {
  prompt: string;
  pageContent?: string;
  persona?: string | PersonaResponse;
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface PersonaResponse {
  nickname: string;
  description: string;
}

export const generatePersona = async (pageContent: string, pageUrl?: string): Promise<PersonaResponse> => {
  try {
    const openai = getOpenAIInstance();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '당신은 텍스트를 분석하여 해당 글의 작가의 페르소나를 생성하는 전문가입니다. 마크다운 형식으로 응답해주세요. 다음 형식으로 작가의 페르소나를 생성해주세요:\n\n' +
            '## 닉네임: [작가의 특성을 잘 반영한 간결한 닉네임]\n\n' +
            '## 성격\n- [작가의 주요 성격 특성 1]\n- [작가의 주요 성격 특성 2]\n- [작가의 주요 성격 특성 3]\n\n' +
            '## 글쓰기 스타일\n- [작가의 글쓰기 스타일 특징 1]\n- [작가의 글쓰기 스타일 특징 2]\n\n' +
            '## 관점과 가치관\n- [작가의 세계관이나 주요 관점 1]\n- [작가의 세계관이나 주요 관점 2]\n\n' +
            '## 배경/전문 분야\n- [작가의 추정 배경이나 전문 분야]\n\n' +
            (pageUrl ? `${pageUrl}와 연결된 다른 페이지도 함께 분석해주세요.` : ''),
        },
        {
          role: 'user',
          content: `다음 텍스트를 분석하고, 이 글을 작성한 작가의 페르소나를 생성해주세요. 작가의 성격, 관점, 글쓰기 스타일 등을 포함해주세요:\n\n${pageContent}`,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content || '페르소나를 생성할 수 없습니다.';

    // 닉네임 추출 (## 닉네임: [닉네임] 형식에서)
    const nicknameMatch = content.match(/##\s*닉네임:\s*(.+?)(?=\n|$)/);

    // 닉네임을 제외한 나머지 내용을 설명으로 사용
    return {
      nickname: nicknameMatch?.[1]?.trim() || '이름 없는 작가',
      description: content, // 전체 마크다운 형식 내용을 그대로 사용
    };
  } catch (error) {
    console.error('페르소나 생성 오류:', error);
    throw new Error('페르소나 생성 중 오류가 발생했습니다.');
  }
};

export const chatWithPersona = async ({
  prompt,
  pageContent,
  persona,
  messages = [],
}: ChatCompletionOptions): Promise<string> => {
  try {
    const openai = getOpenAIInstance();

    // 시스템 메시지 생성
    const systemMessage = {
      role: 'system' as const,
      content: `당신은 다음과 같은 페르소나를 가진 작가입니다: ${typeof persona === 'string' ? persona : persona?.description}. 
      ${typeof persona !== 'string' && persona?.nickname ? `당신의 닉네임은 "${persona.nickname}"입니다.` : ''}
      당신이 작성한 글에 대해 독자와 대화하고 있습니다. 당신의 페르소나에 맞게 대답해주세요. 
      마크다운 형식으로 응답하여 텍스트를 강조하거나 구조화할 수 있습니다. 하지만 가능하면 진짜 사람과 대화하듯이 구어체로 응답해주세요.`,
    };

    // 초기 컨텍스트 메시지 생성 (작가의 글 내용)
    const contextMessage = {
      role: 'system' as const,
      content: `작가님이 작성한 글: ${pageContent}`,
    };

    // API 요청용 메시지 배열 구성 (타입 명시)
    const apiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [systemMessage, contextMessage];

    // 이전 대화 내용 추가 (최대 10개 메시지로 제한)
    const recentMessages = messages.slice(-10).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    apiMessages.push(...recentMessages);

    // 현재 사용자 메시지 추가
    apiMessages.push({
      role: 'user' as const,
      content: prompt,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: apiMessages,
      temperature: 0.7,
    });

    return response.choices[0].message.content || '응답을 생성할 수 없습니다.';
  } catch (error) {
    console.error('채팅 응답 오류:', error);
    throw new Error('채팅 응답 생성 중 오류가 발생했습니다.');
  }
};
