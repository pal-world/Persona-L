import { create } from 'zustand';
import { getUserUUID, getUserRequestInfo, UserRequestInfo } from '../services/userService';

interface UserState {
  uuid: string | null;
  requestInfo: UserRequestInfo | null;
  isLoading: boolean;
  error: string | null;
  initializeUser: () => Promise<void>;
  refreshRequestInfo: () => Promise<UserRequestInfo | null>;
}

export const useUserStore = create<UserState>((set) => ({
  uuid: null,
  requestInfo: null,
  isLoading: false,
  error: null,
  
  // 사용자 정보 초기화 함수
  initializeUser: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const uuid = await getUserUUID();
      set({ uuid, isLoading: false });
      
      // UUID를 가져온 후 바로 요청 정보도 가져오기
      const requestInfo = await getUserRequestInfo();
      set({ requestInfo });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '사용자 정보 초기화 실패'
      });
    }
  },
  
  // 요청 정보만 새로고침하는 함수
  refreshRequestInfo: async () => {
    try {
      const requestInfo = await getUserRequestInfo();
      set({ requestInfo });
      return requestInfo;
    } catch (error) {
      console.error('요청 정보 갱신 실패:', error);
      // 오류 발생 시에도 상태 업데이트는 하지 않음
      return null;
    }
  }
})); 