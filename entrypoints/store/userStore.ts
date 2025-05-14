import { create } from 'zustand';
import { getUserUUID } from '../services/userService';

interface UserState {
  uuid: string | null;
  isLoading: boolean;
  error: string | null;
  initializeUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  uuid: null,
  isLoading: false,
  error: null,
  
  // 사용자 정보 초기화 함수
  initializeUser: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const uuid = await getUserUUID();
      set({ uuid, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '사용자 정보 초기화 실패'
      });
    }
  }
})); 