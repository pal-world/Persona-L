import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  outDir: 'dist',
  manifest: {
    name: 'Persona-L',
    description: '현재 페이지의 내용으로 작가의 Persona를 만들고 Personal(개인적인) 대화를 나눌 수 있는 확장 프로그램',
    permissions: ['activeTab', 'storage', 'scripting'],
    host_permissions: [
      '<all_urls>',
      'https://pdjaatezkzzhjkfjjntn.supabase.co/*'
    ],
  },
});
