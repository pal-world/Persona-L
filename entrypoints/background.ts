export default defineBackground(() => {
  console.log('Persona-L 백그라운드 스크립트가 시작되었습니다.', { id: browser.runtime.id });
  
  // API 키 관련 메시지 리스너 설정
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'validateApiKey') {
      // 백그라운드에서 API 키 유효성 검사 수행
      validateApiKey(message.apiKey)
        .then(isValid => sendResponse({ isValid }))
        .catch(error => sendResponse({ isValid: false, error: error.message }));
      
      return true; // 비동기 응답을 위해 true 반환
    }
  });
  
  // API 키 유효성 검사 함수
  async function validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('API 키 검증 오류:', error);
      return false;
    }
  }
});
