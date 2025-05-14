// 크롬 스토리지 관리 유틸리티

/**
 * 크롬 스토리지에 데이터를 저장하는 함수
 * @param key 저장할 키
 * @param value 저장할 값
 */
export const saveToStorage = async <T>(key: string, value: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

/**
 * 크롬 스토리지에서 데이터를 가져오는 함수
 * @param key 가져올 키
 * @returns 저장된 데이터
 */
export const getFromStorage = async <T>(key: string): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key] || null);
      }
    });
  });
};

/**
 * 크롬 스토리지에서 데이터를 삭제하는 함수
 * @param key 삭제할 키
 */
export const removeFromStorage = async (key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(key, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}; 