import { useState, useEffect } from 'react';
import { usePersonaStore } from '../store/personaStore';
import { useUserStore } from '../store/userStore';
import { extractPageContent } from '../utils/pageContentExtractor';
import { generatePersona, chatWithPersona } from '../services/supabaseApi';
import ChatInterface from './components/ChatInterface';
import PersonaCreator from './components/PersonaCreator';
import ChatHistory from './components/ChatHistory';
import AnimatedPage from './components/AnimatedPage';
import ConfirmDialog from './components/ConfirmDialog';
import ErrorMessage from './components/ErrorMessage';
import RequestInfoBadge from './components/RequestInfoBadge';
import { FaSpinner, FaBookmark } from 'react-icons/fa';

function App() {
  const {
    persona,
    messages,
    isLoading,
    error,
    setPersona,
    setPersonaNickname,
    addMessage,
    setIsLoading,
    setError,
    clearChat,
    saveCurrentConversation,
    savedConversations,
    clearPersona,
  } = usePersonaStore();

  // 사용자 정보 스토어에서 상태와 함수 가져오기
  const { uuid, initializeUser, requestInfo, refreshRequestInfo } = useUserStore();

  const [pageContent, setPageContent] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [showSavedConversations, setShowSavedConversations] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // 초기화
  useEffect(() => {
    const initialize = async () => {
      setIsInitializing(true);

      try {
        // 사용자 UUID 초기화
        await initializeUser();

        // 현재 활성 탭의 URL 가져오기
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url) {
          setCurrentUrl(tab.url);
        }
      } catch (err) {
        console.error('초기화 오류:', err);
      }

      setIsInitializing(false);
    };

    initialize();
  }, [initializeUser]);

  // uuid 로깅 (개발용)
  useEffect(() => {
    if (uuid) {
      console.log('현재 사용자 UUID:', uuid);
    }
  }, [uuid]);

  const fetchPageContent = async (): Promise<string> => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        // 현재 탭의 URL 저장
        if (tab.url) {
          setCurrentUrl(tab.url);
        }

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
    // UUID가 없는 경우 다시 초기화 시도
    if (!uuid) {
      await initializeUser();
    }

    setIsLoading(true);

    try {
      // 요청 전 남은 요청 수 확인
      if (!requestInfo || requestInfo.remaining <= 0) {
        // 최신 정보 확인을 위해 갱신
        const updatedInfo = await refreshRequestInfo();
        
        if (!updatedInfo || updatedInfo.remaining <= 0) {
          setError('남은 요청 횟수가 없습니다. 나중에 다시 시도해주세요.');
          setIsLoading(false);
          return;
        }
      }

      // 페르소나 생성 버튼 클릭 시 페이지 콘텐츠 가져오기
      const content = await fetchPageContent();
      setPageContent(content);

      if (!content || content.trim().length < 50) {
        setError('페이지 콘텐츠가 충분하지 않습니다.');
        setIsLoading(false);
        return;
      }

      // 두 번째 인자로 currentUrl 전달
      const newPersona = await generatePersona(content, currentUrl);

      setPersona(newPersona);
      setPersonaNickname(newPersona.nickname);

      // 첫 메시지를 더 자세하게 구성
      const introMessage = `안녕하세요! 저는 "${newPersona.nickname}"입니다.

${newPersona.description}

어떤 것이 궁금하신가요?`;

      addMessage({
        role: 'assistant',
        content: introMessage,
      });

      // 페르소나 생성 후 요청 정보 갱신
      refreshRequestInfo();
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

    try {
      // 남은 요청 수 확인
      if (!requestInfo || requestInfo.remaining <= 0) {
        // 최신 정보 확인을 위해 갱신
        const updatedInfo = await refreshRequestInfo();
        
        if (!updatedInfo || updatedInfo.remaining <= 0) {
          setError('남은 요청 횟수가 없습니다. 나중에 다시 시도해주세요.');
          return;
        }
      }
      
      addMessage({ role: 'user', content: message });
      setIsLoading(true);

      // 이전 대화 내용을 포함하여 API 호출
      const response = await chatWithPersona({
        prompt: message,
        pageContent,
        persona,
        messages: messages, // 이전 대화 내용 전달
      });

      addMessage({ role: 'assistant', content: response });
      
      // 메시지를 성공적으로 보낸 후 요청 정보 갱신
      refreshRequestInfo();
    } catch (err) {
      // 구체적인 에러 메시지가 있으면 표시
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('메시지 전송 중 오류가 발생했습니다.');
      }

      // 에러가 발생해도 사용자 메시지는 유지
      console.error('채팅 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 채팅 종료 함수
  const handleEndChat = () => {
    clearPersona();
    setPersonaNickname('');
    clearChat();
    setError(null);
  };

  // 대화 저장 함수 수정
  const handleSaveChat = () => {
    if (persona && messages.length > 0) {
      // 커스텀 확인 대화상자 표시
      setShowSaveConfirm(true);
    }
  };

  // 저장 확인 처리 함수
  const handleConfirmSave = () => {
    saveCurrentConversation(currentUrl);
    setShowSaveSuccess(true);

    clearPersona();
    setPersonaNickname('');
    clearChat();
    setError(null);

    setShowSaveConfirm(false);

    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  // 저장 취소 처리 함수
  const handleCancelSave = () => {
    setShowSaveConfirm(false);
  };

  // 초기화 중이거나 API 키 초기화가 완료되지 않았을 때 로딩 표시
  if (isInitializing) {
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
        <div className='flex items-center gap-2'>
          <RequestInfoBadge className="mr-2" />
          {savedConversations.length > 0 && (
            <button
              onClick={() => setShowSavedConversations(true)}
              className='p-2 rounded-full text-white hover:bg-purple-500 hover:bg-opacity-50 hover:rotate-12 transition-all'
              title='저장된 대화'
            >
              <FaBookmark className='text-lg' />
            </button>
          )}
        </div>
      </header>

      <main className='flex-1 overflow-auto p-4.5 flex flex-col gap-4.5'>
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {showSaveSuccess && (
          <div className='glass-card bg-green-50 bg-opacity-90 border-l-4 border-green-500 text-green-700 p-4 animate-bounce-sm rounded-modern'>
            <p className='font-medium'>대화가 성공적으로 저장되었습니다.</p>
          </div>
        )}

        {persona ? (
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onEndChat={handleEndChat}
            onSaveChat={handleSaveChat}
          />
        ) : (
          <PersonaCreator onCreatePersona={handleCreatePersona} isLoading={isLoading} />
        )}
      </main>

      {/* 저장된 대화는 애니메이션 방식으로 표시 */}
      <AnimatedPage
        isVisible={showSavedConversations}
        onExitComplete={() => setShowSavedConversations(false)}
        useFixedPosition={true}
      >
        <ChatHistory onClose={() => setShowSavedConversations(false)} currentUrl={currentUrl} />
      </AnimatedPage>

      {/* 커스텀 확인 대화상자 추가 */}
      <ConfirmDialog
        isOpen={showSaveConfirm}
        title='대화 저장 확인'
        message='대화를 저장하면 현재 대화가 종료되고 초기 화면으로 돌아갑니다. 계속하시겠습니까?'
        warningText='이 작업은 되돌릴 수 없습니다.'
        onConfirm={handleConfirmSave}
        onCancel={handleCancelSave}
      />
    </div>
  );
}

export default App;
