import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Persona-L',
    description: '현재 페이지의 내용을 작가의 마음으로 요약해주는 확장 프로그램',
    permissions: ['activeTab', 'storage', 'scripting'],
    host_permissions: ['<all_urls>']
  }
});
