import { create } from 'zustand';

interface ApiKeyState {
  apiKey: string | null;
  isKeyValid: boolean;
  isLoading: boolean;
  error: string | null;
  
  setApiKey: (key: string) => Promise<void>;
  validateApiKey: (key: string) => Promise<boolean>;
  clearApiKey: () => void;
  setError: (error: string | null) => void;
}

export const useApiKeyStore = create<ApiKeyState>((set, get) => ({
  apiKey: null,
  isKeyValid: false,
  isLoading: false,
  error: null,
  
  setApiKey: async (key) => {
    set({ isLoading: true, error: null });
    try {
      const isValid = await get().validateApiKey(key);
      
      if (isValid) {
        // 크롬 스토리지에 API 키 저장
        await chrome.storage.local.set({ apiKey: key });
        set({ apiKey: key, isKeyValid: true, isLoading: false });
      } else {
        set({ error: 'API 키가 유효하지 않습니다.', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: '키 저장 중 오류가 발생했습니다.', 
        isLoading: false 
      });
    }
  },
  
  validateApiKey: async (key) => {
    try {
      // OpenAI API 키 유효성 검사 (간단한 모델 호출)
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.status === 200;
    } catch (error) {
      set({ error: 'API 키 검증 중 오류가 발생했습니다.' });
      return false;
    }
  },
  
  clearApiKey: () => {
    chrome.storage.local.remove('apiKey');
    set({ apiKey: null, isKeyValid: false });
  },
  
  setError: (error) => set({ error })
}));

// 초기화 함수 - 스토리지에서 API 키 로드
export const initializeApiKey = async () => {
  const { apiKey } = await chrome.storage.local.get('apiKey');
  if (apiKey) {
    useApiKeyStore.getState().setApiKey(apiKey);
  }
}; 