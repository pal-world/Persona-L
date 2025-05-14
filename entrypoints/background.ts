import { getUserUUID } from './services/userService';

export default defineBackground(() => {
  console.log('Persona-L 백그라운드 스크립트가 시작되었습니다.', { id: browser.runtime.id });

  // 확장 프로그램 설치/시작 시 UUID 초기화
  (async () => {
    try {
      const uuid = await getUserUUID();
      console.log('사용자 UUID 초기화 완료:', uuid);
    } catch (error) {
      console.error('사용자 UUID 초기화 실패:', error);
    }
  })();
});
