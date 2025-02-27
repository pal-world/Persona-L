import React from 'react';
import {
  FaArrowLeft,
  FaSearch,
  FaTrash,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaBook,
  FaClock,
} from 'react-icons/fa';
import MarkdownRenderer from './MarkdownRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistoryProps {
  messages: Message[];
  onClose: () => void;
  onClearHistory: () => void;
}

// 대화 그룹 인터페이스 정의
interface ConversationGroup {
  id: number;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, onClose, onClearHistory }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [expandedGroupId, setExpandedGroupId] = React.useState<number | null>(null);

  // 메시지를 대화 그룹으로 변환
  const conversationGroups = React.useMemo(() => {
    if (messages.length === 0) return [];

    const groups: ConversationGroup[] = [];
    let currentGroup: Message[] = [];
    let groupId = 0;

    // 첫 번째 메시지가 assistant인 경우 시작 메시지로 간주
    if (messages[0].role === 'assistant') {
      currentGroup.push(messages[0]);
    }

    // 사용자 메시지를 기준으로 대화 그룹 생성
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];

      // 사용자 메시지를 만나면 새 그룹 시작
      if (message.role === 'user') {
        // 이전 그룹이 있으면 저장
        if (currentGroup.length > 0) {
          const title =
            currentGroup[0].role === 'user'
              ? currentGroup[0].content.substring(0, 30) + (currentGroup[0].content.length > 30 ? '...' : '')
              : `대화 ${groupId + 1}`;

          groups.push({
            id: groupId++,
            title,
            messages: [...currentGroup],
            timestamp: new Date(),
          });
          currentGroup = [];
        }

        // 새 그룹에 현재 사용자 메시지 추가
        currentGroup.push(message);

        // 다음 메시지가 assistant 응답이면 같은 그룹에 추가
        if (i + 1 < messages.length && messages[i + 1].role === 'assistant') {
          currentGroup.push(messages[i + 1]);
          i++; // assistant 메시지는 이미 처리했으므로 건너뜀
        }
      } else if (currentGroup.length > 0) {
        // assistant 메시지가 있고 현재 그룹이 있으면 추가
        currentGroup.push(message);
      }
    }

    // 마지막 그룹 처리
    if (currentGroup.length > 0) {
      const title =
        currentGroup[0].role === 'user'
          ? currentGroup[0].content.substring(0, 30) + (currentGroup[0].content.length > 30 ? '...' : '')
          : `대화 ${groupId + 1}`;

      groups.push({
        id: groupId,
        title,
        messages: [...currentGroup],
        timestamp: new Date(),
      });
    }

    // 최신 대화가 상단에 오도록 정렬
    return groups.reverse();
  }, [messages]);

  // 검색어에 따라 대화 그룹 필터링
  const filteredGroups = React.useMemo(() => {
    if (!searchTerm.trim()) return conversationGroups;

    return conversationGroups.filter((group) =>
      group.messages.some((message) => message.content.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [conversationGroups, searchTerm]);

  // 그룹 확장/축소 토글
  const toggleGroup = (groupId: number) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
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

  // 메시지가 없을 때 표시할 컴포넌트
  const EmptyState = () => (
    <div className='flex flex-col items-center justify-center h-full py-12 px-4 text-center'>
      <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
        <FaCalendarAlt className='text-purple-500 text-xl' />
      </div>
      <h3 className='text-lg font-medium text-gray-800 mb-2'>대화 내역이 없습니다</h3>
      <p className='text-gray-500 max-w-xs'>아직 대화 내역이 없습니다. 작가와 대화를 시작해보세요.</p>
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

  return (
    <div className='fixed inset-0 bg-white z-50 flex flex-col animate-slide-up'>
      <header className='p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm'>
        <div className='flex items-center'>
          <button
            onClick={onClose}
            className='mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors'
            aria-label='뒤로 가기'
          >
            <FaArrowLeft className='text-gray-700' />
          </button>
          <h2 className='text-xl font-semibold text-gray-800'>대화 내역</h2>
        </div>

        <button
          onClick={onClearHistory}
          className='p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors'
          aria-label='대화 내역 삭제'
          title='대화 내역 삭제'
        >
          <FaTrash />
        </button>
      </header>

      <div className='p-4 border-b border-gray-200 bg-white'>
        <div
          className={`flex items-center bg-gray-100 rounded-full px-4 py-2 transition-all ${isSearchFocused ? 'ring-2 ring-purple-400' : ''}`}
        >
          <FaSearch className='text-gray-400 mr-2' />
          <input
            type='text'
            placeholder='대화 내용 검색...'
            className='bg-transparent border-none outline-none w-full text-gray-700'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      <div className='flex-1 overflow-y-auto bg-gray-50'>
        {messages.length === 0 ? (
          <EmptyState />
        ) : filteredGroups.length === 0 ? (
          <NoSearchResults />
        ) : (
          <ul className='divide-y divide-gray-200'>
            {filteredGroups.map((group) => (
              <li key={group.id} className='bg-white'>
                <div
                  className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors'
                  onClick={() => toggleGroup(group.id)}
                >
                  <div className='flex items-center flex-1 min-w-0'>
                    <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0'>
                      {group.messages[0].role === 'user' ? (
                        <FaUser className='text-purple-600' />
                      ) : (
                        <FaBook className='text-purple-600' />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-medium text-gray-800 line-clamp-1'>{group.title}</h3>
                      <div className='flex items-center text-xs text-gray-500 mt-1'>
                        <FaClock className='mr-1 text-gray-400' />
                        <span>{formatDate(group.timestamp)}</span>
                        <span className='mx-1.5'>•</span>
                        <span>{group.messages.length}개의 메시지</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center ml-2'>
                    <div
                      className={`p-2 rounded-full transition-colors ${expandedGroupId === group.id ? 'bg-purple-100' : 'bg-gray-100'}`}
                    >
                      {expandedGroupId === group.id ? (
                        <FaChevronUp
                          className={`${expandedGroupId === group.id ? 'text-purple-600' : 'text-gray-400'}`}
                        />
                      ) : (
                        <FaChevronDown className='text-gray-400' />
                      )}
                    </div>
                  </div>
                </div>

                {expandedGroupId === group.id && (
                  <div className='p-4 bg-gray-50 border-t border-gray-200 animate-fade-in'>
                    <div className='space-y-4'>
                      {group.messages.map((message, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-purple-50 border-l-4 border-purple-400 ml-4'
                              : 'bg-white border-l-4 border-gray-300 mr-4'
                          }`}
                        >
                          <div className='mb-1'>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                message.role === 'user' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {message.role === 'user' ? '사용자' : '작가'}
                            </span>
                          </div>

                          <div className='text-gray-700 text-sm'>
                            {message.role === 'user' ? (
                              <p>{message.content}</p>
                            ) : (
                              <MarkdownRenderer content={message.content} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
