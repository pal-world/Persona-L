export default defineBackground(() => {
  console.log('Persona-L 백그라운드 스크립트가 시작되었습니다.', { id: browser.runtime.id });

  // API 키 관련 메시지 리스너 제거

  // 확장 프로그램 설치 또는 업데이트 시 실행
  chrome.runtime.onInstalled.addListener(async (details) => {
    // 기존에 저장된 API 키 데이터 제거
    if (details.reason === 'update' || details.reason === 'install') {
      try {
        await chrome.storage.sync.remove('openaiApiKey');
        console.log('기존 API 키 설정이 제거되었습니다.');
      } catch (error) {
        console.error('설정 제거 중 오류 발생:', error);
      }
    }

    // ... 다른 초기화 코드 ...
  });
});
