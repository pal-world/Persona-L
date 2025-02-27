import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ApiKeyState {
  apiKey: string | null;
  isKeyValid: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  setApiKey: (key: string) => Promise<void>;
  validateApiKey: (key: string) => Promise<boolean>;
  clearApiKey: () => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set, get) => ({
      apiKey: null,
      isKeyValid: false,
      isLoading: false,
      isInitialized: false,
      error: null,
      
      setApiKey: async (key) => {
        set({ isLoading: true, error: null });
        try {
          const isValid = await get().validateApiKey(key);
          
          if (isValid) {
            set({ apiKey: key, isKeyValid: true, isLoading: false, isInitialized: true });
          } else {
            set({ error: 'API 키가 유효하지 않습니다.', isLoading: false, isInitialized: true });
          }
        } catch (error) {
          set({ 
            error: '키 저장 중 오류가 발생했습니다.', 
            isLoading: false,
            isInitialized: true
          });
        }
      },
      
      validateApiKey: async (key) => {
        try {
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
        set({ apiKey: null, isKeyValid: false });
      },
      
      setError: (error) => set({ error }),
      
      setInitialized: (initialized) => set({ isInitialized: initialized })
    }),
    {
      name: 'api-key-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        apiKey: state.apiKey,
        isKeyValid: state.isKeyValid
      }),
    }
  )
);

// 초기화 함수 - 스토리지에서 API 키 로드
export const initializeApiKey = async () => {
  const store = useApiKeyStore.getState();
  
  // 이미 초기화되었으면 스킵
  if (store.isInitialized) return;
  
  store.setInitialized(false);
  
  try {
    // 로컬 스토리지에서 이미 로드된 경우 검증만 수행
    if (store.apiKey) {
      const isValid = await store.validateApiKey(store.apiKey);
      useApiKeyStore.setState({ 
        isKeyValid: isValid,
        isInitialized: true
      });
    } else {
      // 크롬 스토리지에서 API 키 로드
      const { apiKey } = await chrome.storage.local.get('apiKey');
      if (apiKey) {
        await store.setApiKey(apiKey);
      } else {
        // API 키가 없는 경우도 초기화 완료로 표시
        useApiKeyStore.setState({ isInitialized: true });
      }
    }
  } catch (error) {
    console.error('API 키 초기화 오류:', error);
    // 오류가 발생해도 초기화 완료로 표시
    useApiKeyStore.setState({ isInitialized: true });
  }
}; 