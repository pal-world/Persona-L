import React, { useCallback, memo, useRef, useEffect, useState } from 'react';
import { FaArrowLeft, FaSearch, FaTrash, FaExclamationTriangle, FaCommentAlt, FaUser, FaGlobe } from 'react-icons/fa';
import MarkdownRenderer from './MarkdownRenderer';
import { usePersonaStore } from '../../store/personaStore';
import AnimatedPage from './AnimatedPage';
import ConfirmDialog from './ConfirmDialog';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistoryProps {
  onClose: () => void;
  currentUrl?: string; // 현재 페이지 URL
}

// 검색 입력 컴포넌트를 별도의 메모이즈된 컴포넌트로 분리
interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const SearchInputComponent = memo(({ searchTerm, onSearchChange, inputRef }: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState(true); // 항상 활성화 상태로 시작

  // 컴포넌트가 마운트될 때 입력 필드에 포커스
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // 외부에서 searchTerm이 변경되면 inputValue도 업데이트
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // 입력 값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsActive(true); // 입력 중에는 항상 활성 상태 유지

    // 이전 타이머 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 300ms 후에 검색 실행 (디바운스)
    timeoutRef.current = setTimeout(() => {
      onSearchChange(newValue);
    }, 300);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className='p-4 border-b border-gray-200 bg-white'>
      <div
        className={`flex items-center bg-gray-100 rounded-full px-4 py-2 transition-colors ${
          isActive ? 'ring-2 ring-purple-400' : ''
        }`}
      >
        <FaSearch className='text-gray-400 mr-2' />
        <input
          ref={inputRef}
          type='text'
          placeholder='대화 내용 검색...'
          className='bg-transparent border-none outline-none w-full text-gray-700'
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsActive(true)}
          onBlur={() => setTimeout(() => setIsActive(false), 100)} // 약간의 지연을 두어 깜빡임 방지
        />
      </div>
    </div>
  );
});

SearchInputComponent.displayName = 'SearchInputComponent';

const ChatHistory = ({ onClose, currentUrl = '알 수 없는 페이지' }: ChatHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { savedConversations, deleteSavedConversation } = usePersonaStore(); // 저장된 대화 목록 가져오기
  const searchInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>; // 검색 입력창 참조 추가
  const [detailVisible, setDetailVisible] = useState(false); // 상세 페이지 애니메이션을 위한 상태 추가

  // 상대적 시간 표시 함수 (몇 시간 전, 하루 전 등)
  const formatRelativeTime = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    // 시간 차이를 밀리초에서 각 단위로 변환
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    // 1시간 미만
    if (minutes < 60) {
      return minutes <= 1 ? '방금 전' : `${minutes}분 전`;
    }
    // 24시간 미만
    else if (hours < 24) {
      return `${hours}시간 전`;
    }
    // 7일 이내
    else if (days < 7) {
      const dayNames = ['하루', '이틀', '사흘', '나흘', '닷새', '엿새'];
      return days < 7 ? `${days === 1 ? dayNames[0] : days <= 6 ? dayNames[days - 1] : days + '일'} 전` : '일주일 전';
    }
    // 7일 초과
    else {
      return timestamp.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  // URL 형식 가공 함수
  const formatUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      // 도메인 이름만 추출 (www. 제거)
      return urlObj.hostname.replace(/^www\./, '');
    } catch (e) {
      // URL 파싱에 실패한 경우 원본 반환
      return url;
    }
  };

  // 저장된 대화를 대화 그룹으로 변환
  const conversationGroups = React.useMemo(() => {
    if (savedConversations.length === 0) return [];

    // 저장된 대화 처리
    const groups = savedConversations.map((savedConv) => {
      // 닉네임이 빈 문자열이거나 undefined, null인 경우 처리
      const nickname =
        savedConv.personaNickname &&
        typeof savedConv.personaNickname === 'string' &&
        savedConv.personaNickname.trim() !== ''
          ? savedConv.personaNickname
          : '이름 없는 작가';

      return {
        id: savedConv.id,
        title: nickname,
        url: savedConv.url,
        messages: savedConv.messages,
        timestamp: new Date(savedConv.timestamp),
      };
    });

    // 최신 대화가 상단에 오도록 정렬
    return groups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [savedConversations]);

  // 검색어에 따라 대화 그룹 필터링
  const filteredGroups = React.useMemo(() => {
    if (!searchTerm.trim()) return conversationGroups;

    return conversationGroups.filter(
      (group) =>
        group.messages.some((message) => message.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        group.url.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [conversationGroups, searchTerm]);

  // 선택된 그룹 찾기
  const selectedGroup = React.useMemo(() => {
    if (selectedGroupId === null) return null;
    return conversationGroups.find((group) => group.id === selectedGroupId) || null;
  }, [conversationGroups, selectedGroupId]);

  // 그룹 선택 핸들러
  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    // 애니메이션을 위해 약간의 지연 후 detailVisible 상태 변경
    setTimeout(() => {
      setDetailVisible(true);
    }, 10);
  };

  // 대화 상세 화면에서 뒤로가기
  const handleBackToList = useCallback(() => {
    // 애니메이션 효과를 부드럽게 하기 위해 먼저 애니메이션을 시작하고 나중에 상태를 변경
    setDetailVisible(false);
  }, []);

  // 애니메이션 완료 후 상태 업데이트
  const handleDetailExitComplete = useCallback(() => {
    // 애니메이션이 완료된 후에만 선택된 그룹을 null로 설정
    setSelectedGroupId(null);
    // 필요한 경우 검색 입력에 다시 포커스
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // 컴포넌트 첫 렌더링 시 실행
  useEffect(() => {
    // 화면 전환 시 깜빡임 방지를 위한 스타일 적용
    const style = document.createElement('style');
    style.innerHTML = `
      .transition-container { 
        position: relative;
        height: 100%;
        width: 100%;
        overflow: hidden;
      }
      .page-enter {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10;
        transform: translateX(100%);
      }
      .page-enter-active {
        transform: translateX(0);
        transition: transform 300ms ease-in-out;
      }
      .page-exit {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 9;
        transform: translateX(0);
      }
      .page-exit-active {
        transform: translateX(-100%);
        transition: transform 300ms ease-in-out;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 대화 삭제 확인 처리
  const handleDeleteSavedConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setDeleteConfirmId(id); // 삭제할 대화 ID 설정
  };

  // 삭제 확인 처리
  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteSavedConversation(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // 삭제 취소 처리
  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // 메시지가 없을 때 표시할 컴포넌트
  const EmptyState = () => (
    <div className='flex flex-col items-center justify-center h-full py-12 px-4 text-center'>
      <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 shadow-sm'>
        <FaCommentAlt className='text-purple-500 text-xl' />
      </div>
      <h3 className='text-xl font-medium text-gray-800 mb-2'>저장된 대화가 없습니다</h3>
      <p className='text-gray-500 max-w-xs text-center'>
        아직 저장된 대화가 없습니다. 대화 중 저장 버튼을 눌러 대화를 저장해보세요.
      </p>
    </div>
  );

  // 검색 결과가 없을 때 표시할 컴포넌트
  const NoSearchResults = () => (
    <div className='flex flex-col items-center justify-center h-full py-12 px-4 text-center'>
      <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm'>
        <FaSearch className='text-gray-400 text-xl' />
      </div>
      <h3 className='text-xl font-medium text-gray-800 mb-2'>검색 결과가 없습니다</h3>
      <p className='text-gray-500 max-w-xs'>다른 검색어로 다시 시도해보세요.</p>
      <button
        onClick={() => setSearchTerm('')}
        className='mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors'
      >
        모든 대화 보기
      </button>
    </div>
  );

  // 대화 상세 화면
  const ConversationDetailView = () => {
    if (!selectedGroup) return null;

    return (
      <div className='h-full bg-white z-50 flex flex-col'>
        <div className='app-header flex items-center justify-center relative'>
          <button
            onClick={handleBackToList}
            className='absolute left-4 p-2 rounded-full hover:bg-purple-600/20 transition-all duration-200 text-white'
            title='뒤로 가기'
          >
            <FaArrowLeft className='w-5 h-5' />
          </button>
          <div className='flex flex-col items-center'>
            <h1 className='text-xl font-bold text-white'>{selectedGroup.title}</h1>
          </div>
          <button
            onClick={(e) => handleDeleteSavedConversation(selectedGroup.id, e)}
            className='absolute right-4 p-2 rounded-full hover:bg-purple-600/20 transition-all duration-200 text-white'
            title='대화 삭제'
          >
            <FaTrash className='w-5 h-5' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
          <div className='max-w-3xl mx-auto space-y-4 pt-1'>
            {selectedGroup.url && (
              <div className='mb-4 p-3 bg-white rounded-lg border-l-4 border-purple-300 shadow-sm'>
                <div className='flex items-start'>
                  <FaGlobe className='text-purple-500 mr-2 mt-1 flex-shrink-0' />
                  <div className='overflow-hidden'>
                    <p className='text-sm text-gray-600'>
                      이 대화는{' '}
                      <span className='text-purple-600 font-medium break-all'>{formatUrl(selectedGroup.url)}</span>{' '}
                      페이지에서 진행되었습니다.
                    </p>
                    <a
                      href={selectedGroup.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(selectedGroup.url, '_blank');
                      }}
                      className='text-xs text-gray-400 mt-1 truncate hover:text-clip hover:whitespace-normal hover:text-purple-500 hover:underline cursor-pointer block'
                    >
                      {selectedGroup.url}
                    </a>
                  </div>
                </div>
              </div>
            )}
            {selectedGroup.messages.map((message, index) => (
              <div key={index} className={`message-item ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`message-bubble ${message.role === 'user' ? 'message-bubble-user' : 'message-bubble-assistant'}`}
                >
                  {message.role === 'user' ? (
                    <p className='text-sm whitespace-pre-wrap break-words'>{message.content}</p>
                  ) : (
                    <div className='prose prose-sm max-w-none'>
                      <MarkdownRenderer content={message.content} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col h-full w-full bg-white'>
      {/* 삭제 확인 모달 - ConfirmDialog 컴포넌트로 대체 */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        title='대화 삭제 확인'
        message='이 대화를 정말 삭제하시겠습니까?'
        warningText='이 작업은 되돌릴 수 없습니다.'
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText='삭제'
      />

      {/* 본문 콘텐츠 */}
      <div className='flex-1 relative overflow-hidden'>
        {/* 목록 화면 - 항상 렌더링하고 z-index로 관리 */}
        <div className='h-full w-full flex flex-col absolute inset-0' style={{ zIndex: selectedGroup ? 0 : 1 }}>
          <div className='app-header flex items-center justify-center relative'>
            <button
              onClick={onClose}
              className='absolute left-4 p-2 rounded-full hover:bg-purple-600/20 transition-all duration-200 text-white'
              title='뒤로 가기'
            >
              <FaArrowLeft className='w-5 h-5' />
            </button>
            <h1 className='text-2xl font-bold text-white'>저장된 대화</h1>
          </div>

          {/* 검색 입력 */}
          <SearchInputComponent searchTerm={searchTerm} onSearchChange={setSearchTerm} inputRef={searchInputRef} />

          <div className='flex-1 overflow-y-auto bg-gray-50'>
            {conversationGroups.length === 0 ? (
              <EmptyState />
            ) : filteredGroups.length === 0 ? (
              <NoSearchResults />
            ) : (
              <div className='p-4'>
                <div className='space-y-3 max-w-3xl mx-auto'>
                  {filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => handleSelectGroup(group.id)}
                      className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all duration-200'
                    >
                      <div className='flex justify-between items-start'>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center'>
                            <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0'>
                              <FaUser className='text-purple-600 text-xs' />
                            </div>
                            <p className='text-sm font-medium text-gray-900 truncate'>{group.title}</p>
                          </div>
                          <p className='text-xs text-gray-500 mt-1 ml-10'>{formatRelativeTime(group.timestamp)}</p>
                        </div>
                        <div className='flex items-center'>
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mr-2'>
                            {group.messages.length}개 메시지
                          </span>
                          <button
                            onClick={(e) => handleDeleteSavedConversation(group.id, e)}
                            className='p-2 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors'
                            title='대화 삭제'
                          >
                            <FaTrash className='w-4 h-4' />
                          </button>
                        </div>
                      </div>
                      <div className='mt-3 text-sm text-gray-600 line-clamp-2 ml-10'>
                        {group.messages[0]?.content || '내용 없음'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 대화 상세 화면 */}
        {selectedGroup && (
          <AnimatedPage
            isVisible={detailVisible}
            direction='right'
            onExitComplete={handleDetailExitComplete}
            className='w-full h-full'
            useFixedPosition={false}
          >
            <div className='h-full w-full bg-white z-10'>
              <ConversationDetailView />
            </div>
          </AnimatedPage>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
