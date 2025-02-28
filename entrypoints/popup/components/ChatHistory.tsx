import React, { useCallback, useMemo, memo, useRef, useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaSearch,
  FaTrash,
  FaChevronRight,
  FaUser,
  FaClock,
  FaGlobe,
  FaBookmark,
  FaEllipsisV,
  FaExclamationTriangle,
} from 'react-icons/fa';
import MarkdownRenderer from './MarkdownRenderer';
import { usePersonaStore } from '../../store/personaStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistoryProps {
  messages: Message[];
  onClose: () => void;
  onClearHistory: () => void;
  currentUrl?: string; // 현재 페이지 URL
}

// 대화 그룹 인터페이스 정의
interface ConversationGroup {
  id: string;
  title: string;
  url: string; // 사이트 URL
  messages: Message[];
  timestamp: Date;
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

const ChatHistory: React.FC<ChatHistoryProps> = ({ onClose, currentUrl = '알 수 없는 페이지' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { savedConversations, deleteSavedConversation } = usePersonaStore(); // 저장된 대화 목록 가져오기
  const searchInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>; // 검색 입력창 참조 추가

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
    const groups = savedConversations.map((savedConv) => ({
      id: savedConv.id,
      title: formatUrl(savedConv.url),
      url: savedConv.url,
      messages: savedConv.messages,
      timestamp: new Date(savedConv.timestamp),
    }));

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
  };

  // 대화 상세 화면에서 뒤로가기
  const handleBackToList = () => {
    setSelectedGroupId(null);
  };

  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 저장된 대화 삭제 핸들러
  const handleDeleteSavedConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setDeleteConfirmId(id); // 삭제 확인 모달 표시
  };

  // 삭제 확인 핸들러
  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteSavedConversation(deleteConfirmId);
      // 현재 선택된 대화가 삭제된 대화인 경우 목록으로 돌아감
      if (selectedGroupId === deleteConfirmId) {
        setSelectedGroupId(null);
      }
      setDeleteConfirmId(null); // 모달 닫기
    }
  };

  // 삭제 취소 핸들러
  const handleCancelDelete = () => {
    setDeleteConfirmId(null); // 모달 닫기
  };

  // 삭제 확인 모달
  const DeleteConfirmModal = () => {
    if (!deleteConfirmId) return null;

    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in backdrop-blur-sm'>
        <div className='bg-white rounded-modern-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden animate-scale-in'>
          <div className='p-5 border-b border-gray-200 bg-gradient-to-r from-purple-100 to-purple-50'>
            <div className='flex items-center'>
              <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 shadow-sm'>
                <FaExclamationTriangle className='text-purple-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-800'>대화 삭제 확인</h3>
            </div>
          </div>
          <div className='p-5 bg-white'>
            <p className='text-gray-600 mb-5 leading-relaxed'>
              저장된 대화를 삭제하시겠습니까?
              <br />
              <span className='text-sm text-purple-600'>이 작업은 되돌릴 수 없습니다.</span>
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={handleCancelDelete}
                className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-modern transition-colors'
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-modern transition-colors shadow-sm'
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 메시지가 없을 때 표시할 컴포넌트
  const EmptyState = () => (
    <div className='flex flex-col items-center justify-center h-full py-12 px-4 text-center'>
      <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
        <FaBookmark className='text-purple-500 text-xl' />
      </div>
      <h3 className='text-lg font-medium text-gray-800 mb-2'>저장된 대화가 없습니다</h3>
      <p className='text-gray-500 max-w-xs'>
        아직 저장된 대화가 없습니다. 대화 중 저장 버튼을 눌러 대화를 저장해보세요.
      </p>
    </div>
  );

  // 검색 결과가 없을 때 표시할 컴포넌트
  const NoSearchResults = () => (
    <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
      <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3'>
        <FaSearch className='text-gray-400 text-lg' />
      </div>
      <h3 className='text-lg font-medium text-gray-800 mb-2'>검색 결과가 없습니다</h3>
      <p className='text-gray-500 max-w-xs'>다른 검색어로 다시 시도해보세요.</p>
    </div>
  );

  // 검색어 변경 핸들러 - useCallback으로 메모이제이션
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // 대화 목록 화면
  const ConversationListView = () => (
    <div className='fixed inset-0 bg-white z-50 flex flex-col'>
      <header className='p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm'>
        <div className='flex items-center'>
          <button
            onClick={onClose}
            className='mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors'
            aria-label='뒤로 가기'
          >
            <FaArrowLeft className='text-gray-700' />
          </button>
          <h2 className='text-xl font-semibold text-gray-800'>저장된 대화</h2>
        </div>
      </header>

      <SearchInputComponent searchTerm={searchTerm} onSearchChange={handleSearchChange} inputRef={searchInputRef} />

      <div className='flex-1 overflow-y-auto bg-gray-50'>
        {conversationGroups.length === 0 ? (
          <EmptyState />
        ) : filteredGroups.length === 0 ? (
          <NoSearchResults />
        ) : (
          <div className='divide-y divide-gray-200'>
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className='p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer relative'
                onClick={() => handleSelectGroup(group.id)}
              >
                <div className='flex justify-between items-start mb-2'>
                  <div className='flex items-center flex-1 min-w-0 mr-4'>
                    <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0'>
                      <FaUser className='text-purple-600' />
                    </div>
                    <div className='min-w-0'>
                      <h3 className='font-medium text-gray-800 flex items-center truncate'>
                        {group.title}
                        <FaBookmark className='text-purple-500 ml-2 text-sm flex-shrink-0' title='저장된 대화' />
                      </h3>
                      <p className='text-xs text-gray-500 flex items-center mt-1 truncate'>
                        <FaGlobe className='mr-1 flex-shrink-0' />
                        <span className='truncate'>{group.url}</span>
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center flex-shrink-0'>
                    <span className='text-xs text-gray-500 flex items-center whitespace-nowrap mr-3'>
                      <FaClock className='mr-1' />
                      {formatDate(group.timestamp)}
                    </span>
                    <button
                      onClick={(e) => handleDeleteSavedConversation(group.id, e)}
                      className='p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors mr-2'
                      aria-label='대화 삭제'
                      title='대화 삭제'
                    >
                      <FaTrash className='text-sm' />
                    </button>
                    <FaChevronRight className='text-gray-400' />
                  </div>
                </div>
                <div className='ml-13 pl-0'>
                  <p className='text-sm text-gray-600 line-clamp-2'>
                    {group.messages[0]?.content.substring(0, 100)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // 대화 상세 화면
  const ConversationDetailView = () => {
    if (!selectedGroup) return null;

    return (
      <div className='fixed inset-0 bg-white z-50 flex flex-col'>
        <header className='p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm'>
          <div className='flex items-center flex-1 min-w-0 mr-4'>
            <button
              onClick={handleBackToList}
              className='mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0'
              aria-label='뒤로 가기'
            >
              <FaArrowLeft className='text-gray-700' />
            </button>
            <div className='min-w-0'>
              <h2 className='text-xl font-semibold text-gray-800 flex items-center truncate'>
                <span className='truncate'>{selectedGroup.title}</span>
                <FaBookmark className='text-purple-500 ml-2 text-sm flex-shrink-0' title='저장된 대화' />
              </h2>
              <p className='text-xs text-gray-500 flex items-center truncate'>
                <FaGlobe className='mr-1 flex-shrink-0' />
                <span className='truncate'>{selectedGroup.url}</span>
              </p>
            </div>
          </div>
          <button
            onClick={(e) => handleDeleteSavedConversation(selectedGroup.id, e)}
            className='p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors flex-shrink-0'
            aria-label='저장된 대화 삭제'
            title='저장된 대화 삭제'
          >
            <FaTrash />
          </button>
        </header>

        <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
          <div className='max-w-3xl mx-auto space-y-4'>
            {selectedGroup.messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-sm ${
                  message.role === 'user'
                    ? 'bg-purple-50 border-l-4 border-purple-400 ml-4'
                    : 'bg-white border-l-4 border-gray-300 mr-4'
                }`}
              >
                <div className='mb-2'>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      message.role === 'user' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {message.role === 'user' ? '사용자' : '작가'}
                  </span>
                </div>

                <div className='text-gray-700'>
                  {message.role === 'user' ? <p>{message.content}</p> : <MarkdownRenderer content={message.content} />}
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
      {/* 삭제 확인 모달 */}
      {deleteConfirmId && <DeleteConfirmModal />}

      {/* 헤더 */}
      <header className='sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'>
        <div className='flex items-center'>
          {selectedGroup ? (
            <button
              onClick={handleBackToList}
              className='mr-2 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors'
            >
              <FaArrowLeft />
            </button>
          ) : (
            <FaBookmark className='mr-2' />
          )}
          <h2 className='text-lg font-semibold'>{selectedGroup ? formatUrl(selectedGroup.url) : '저장된 대화'}</h2>
        </div>
        <button onClick={onClose} className='hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors'>
          <FaArrowLeft />
        </button>
      </header>

      {/* 검색 입력 (대화 목록 화면에서만 표시) */}
      {!selectedGroup && (
        <SearchInputComponent searchTerm={searchTerm} onSearchChange={setSearchTerm} inputRef={searchInputRef} />
      )}

      {/* 본문 콘텐츠 */}
      <div className='flex-1 overflow-y-auto'>
        {!selectedGroup ? (
          // 대화 목록 화면
          <>
            {conversationGroups.length === 0 ? (
              <EmptyState />
            ) : filteredGroups.length === 0 ? (
              <NoSearchResults />
            ) : (
              <ConversationListView />
            )}
          </>
        ) : (
          // 대화 상세 화면
          <ConversationDetailView />
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
