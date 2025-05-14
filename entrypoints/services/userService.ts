import { supabase } from './supabase';
import { saveToStorage, getFromStorage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

// 스토리지 키 상수
const USER_UUID_KEY = 'personaL_user_uuid';

/**
 * UUID 생성 함수
 * @returns 생성된 UUID
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * 사용자 UUID 가져오기 함수 (없으면 생성)
 * @returns 사용자 UUID
 */
export const getUserUUID = async (): Promise<string> => {
  // 스토리지에서 UUID 조회
  const storedUUID = await getFromStorage<string>(USER_UUID_KEY);
  
  // 저장된 UUID가 있으면 반환
  if (storedUUID) {
    return storedUUID;
  }
  
  // 없으면 새로 생성하고 저장
  const newUUID = generateUUID();
  await saveToStorage(USER_UUID_KEY, newUUID);
  
  // 서버에 등록
  try {
    await registerUserToServer(newUUID);
  } catch (error) {
    console.error('서버에 사용자 등록 실패:', error);
    // 실패해도 로컬에는 UUID 보존
  }
  
  return newUUID;
};

/**
 * 서버에 사용자 등록 함수
 * @param uuid 등록할 UUID
 */
export const registerUserToServer = async (uuid: string): Promise<void> => {
  const { error } = await supabase.functions.invoke('user', {
    method: 'POST',
    body: { uuid }
  });
  
  if (error) {
    throw new Error(`사용자 등록 실패: ${error.message}`);
  }
}; 