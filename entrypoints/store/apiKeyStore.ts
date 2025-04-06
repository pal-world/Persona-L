import { create } from 'zustand';

// API 키 저장소 - 더 이상 API 키를 관리할 필요가 없어 간단한 상태만 유지
interface ApiKeyState {
  isInitialized: boolean;
}

export const useApiKeyStore = create<ApiKeyState>()((set) => ({
  isInitialized: true,
}));

// 더 이상 API 키를 초기화할 필요가 없으므로 간단히 함수만 유지
export const initializeApiKey = async (): Promise<void> => {
  // 아무것도 하지 않음
  return Promise.resolve();
}; 