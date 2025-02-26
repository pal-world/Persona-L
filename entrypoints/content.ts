export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('Persona-L 콘텐츠 스크립트가 로드되었습니다.');
  },
});
