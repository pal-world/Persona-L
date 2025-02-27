import { useState, useEffect } from 'react';
import { usePersonaStore } from '../store/personaStore';
import { useApiKeyStore } from '../store/apiKeyStore';
import { extractPageContent } from '../utils/pageContentExtractor';
import { generatePersona, chatWithPersona } from '../services/openaiService';
import ChatInterface from './components/ChatInterface';
import PersonaCreator from './components/PersonaCreator';
import ApiKeySettings from './components/ApiKeySettings';
import { FaCog, FaSpinner } from 'react-icons/fa';
import { initializeApiKey } from '../store/apiKeyStore';

function App() {
  const { persona, messages, isLoading, error, setPersona, addMessage, setIsLoading, setError, clearChat } = usePersonaStore();
  const { apiKey, isInitialized } = useApiKeyStore();
  const [pageContent, setPageContent] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [prevApiKey, setPrevApiKey] = useState<string | null>(null);

  // 초기화
  useEffect(() => {
    const initialize = async () => {
      setIsInitializing(true);
      await initializeApiKey();
      setIsInitializing(false);
    };

    initialize();
  }, []);

  // API 키 변경 감지
  useEffect(() => {
    // 이전 API 키가 있고, 현재 API 키가 없는 경우 (API 키가 삭제된 경우)
    if (prevApiKey && !apiKey) {
      // 페르소나와 대화 내용 초기화
      setPersona('');
      clearChat();
      setPageContent('');
      setError(null);
    }
    
    // 현재 API 키 상태 저장
    setPrevApiKey(apiKey);
  }, [apiKey, prevApiKey, setPersona, clearChat, setError]);

  // API 키가 변경될 때 에러 메시지 초기화
  useEffect(() => {
    if (apiKey) setError(null);
  }, [apiKey, setError]);

  const handleCloseSettings = () => {
    setShowSettings(false);
    // API 키 관련 에러 메시지 초기화
    if (apiKey) setError(null);
  };

  const fetchPageContent = async (): Promise<string> => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        const content = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: extractPageContent,
        });

        const extractedContent = content[0].result ?? '';
        return extractedContent;
      }
      throw new Error('활성 탭을 찾을 수 없습니다.');
    } catch (err) {
      console.error('페이지 콘텐츠 추출 오류:', err);
      throw new Error('페이지 콘텐츠를 가져올 수 없습니다.');
    }
  };

  const handleCreatePersona = async () => {
    if (!apiKey) {
      setError('API 키를 먼저 설정해주세요.');
      setShowSettings(true);
      return;
    }

    setIsLoading(true);

    try {
      // 페르소나 생성 버튼 클릭 시 페이지 콘텐츠 가져오기
      const content = await fetchPageContent();
      setPageContent(content);

      if (!content || content.trim().length < 50) {
        setError('페이지 콘텐츠가 충분하지 않습니다.');
        setIsLoading(false);
        return;
      }

      const newPersona = await generatePersona(content);
      setPersona(newPersona);
      addMessage({
        role: 'assistant',
        content: `안녕하세요! 저는 이 글의 작가입니다. ${newPersona.substring(0, 100)}... 어떤 것이 궁금하신가요?`,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('페르소나 생성 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !persona) return;

    addMessage({ role: 'user', content: message });
    setIsLoading(true);

    try {
      // 이전 대화 내용을 포함하여 API 호출
      const response = await chatWithPersona({
        prompt: message,
        pageContent,
        persona,
        messages: messages, // 이전 대화 내용 전달
      });

      addMessage({ role: 'assistant', content: response });
    } catch (err) {
      setError('메시지 전송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 초기화 중이거나 API 키 초기화가 완료되지 않았을 때 로딩 표시
  if (isInitializing || !isInitialized) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 w-[400px] h-[600px] font-sans'>
        <FaSpinner className='animate-spin text-purple-600 text-4xl mb-4' />
        <p className='text-gray-600'>초기화 중...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-purple-100 w-[400px] h-[600px] font-sans'>
      <header className='app-header'>
        <div>
          <h1>Persona-L</h1>
          <p>작가의 마음으로 글을 이해하세요</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className='btn-icon btn-glow-effect hover:bg-purple-500 hover:bg-opacity-50 text-white hover:rotate-12 transition-transform rounded-modern'
          title='API 키 설정'
        >
          <FaCog className='text-lg' />
        </button>
      </header>

      <main className='flex-1 overflow-auto p-4.5 flex flex-col gap-4.5'>
        {error && (
          <div className='glass-card bg-red-50 bg-opacity-90 border-l-4 border-red-500 text-red-700 p-4 animate-bounce-sm rounded-modern'>
            <p className='font-medium'>{error}</p>
          </div>
        )}

        {!apiKey && (
          <div className='glass-card p-5 flex flex-col items-center rounded-modern-lg animate-fade-in'>
            <h2 className='text-xl font-semibold text-gray-800 mb-3 tracking-tight'>API 키 설정</h2>
            <p className='text-gray-600 text-center mb-4 leading-relaxed'>
              Persona-L을 사용하기 위해 OpenAI API 키가 필요합니다
            </p>
            <button
              onClick={() => setShowSettings(true)}
              className='btn btn-primary btn-glow-effect w-full py-2.5 rounded-modern animate-click'
            >
              API 키 설정하기
            </button>
          </div>
        )}

        {persona ? (
          <ChatInterface messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
        ) : (
          <PersonaCreator onCreatePersona={handleCreatePersona} isLoading={isLoading} />
        )}
      </main>

      {showSettings && <ApiKeySettings onClose={handleCloseSettings} />}
    </div>
  );
}

export default App;
