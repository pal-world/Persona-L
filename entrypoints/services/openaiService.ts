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
  persona?: string;
}

export const generatePersona = async (pageContent: string): Promise<string> => {
  try {
    const openai = getOpenAIInstance();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 텍스트를 분석하여 해당 글의 작가의 페르소나를 생성하는 전문가입니다. 마크다운 형식으로 응답해주세요.',
        },
        {
          role: 'user',
          content: `다음 텍스트를 분석하고, 이 글을 작성한 작가의 페르소나를 생성해주세요. 작가의 성격, 관점, 글쓰기 스타일 등을 포함해주세요:\n\n${pageContent}`,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '페르소나를 생성할 수 없습니다.';
  } catch (error) {
    console.error('페르소나 생성 오류:', error);
    throw new Error('페르소나 생성 중 오류가 발생했습니다.');
  }
};

export const chatWithPersona = async ({ prompt, pageContent, persona }: ChatCompletionOptions): Promise<string> => {
  try {
    const openai = getOpenAIInstance();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `당신은 다음과 같은 페르소나를 가진 작가입니다: ${persona}. 
          당신이 작성한 글에 대해 독자와 대화하고 있습니다. 당신의 페르소나에 맞게 대답해주세요. 
          마크다운 형식으로 응답하여 텍스트를 강조하거나 구조화할 수 있습니다.`,
        },
        {
          role: 'user',
          content: `작가님이 작성한 글: ${pageContent}\n\n독자의 질문: ${prompt}`,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '응답을 생성할 수 없습니다.';
  } catch (error) {
    console.error('채팅 응답 오류:', error);
    throw new Error('채팅 응답 생성 중 오류가 발생했습니다.');
  }
};
