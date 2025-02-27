import { useState, useEffect } from 'react';
import { FaSpinner, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useApiKeyStore } from '../../store/apiKeyStore';

interface ApiKeySettingsProps {
  onClose: () => void;
}

const ApiKeySettings = ({ onClose }: ApiKeySettingsProps) => {
  const { apiKey, isKeyValid, isLoading, error, setApiKey, clearApiKey, setError } = useApiKeyStore();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 기존 API 키 로드
    setInputKey(apiKey || '');
  }, [apiKey]);

  useEffect(() => {
    // 모달이 열릴 때 입력 필드에 포커스
    const timer = setTimeout(() => {
      document.getElementById('api-key-input')?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveKey = async () => {
    if (!inputKey.trim()) {
      setError('API 키를 입력해주세요.');
      return;
    }

    await setApiKey(inputKey.trim());

    // 키가 유효하면 설정 화면 닫기
    if (useApiKeyStore.getState().isKeyValid) {
      onClose();
    }
  };

  const handleClearKey = () => {
    clearApiKey();
    setInputKey('');
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in'>
      <div className='glass-card p-6 rounded-modern-lg w-[90%] max-w-md shadow-float relative'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors'
          aria-label='닫기'
        >
          <FaTimes />
        </button>

        <h2 className='text-xl font-bold text-gray-800 mb-4'>API 키 설정</h2>

        <p className='text-gray-600 mb-4 text-sm'>
          OpenAI API 키를 입력하세요. 키는 로컬에만 저장되며 서버로 전송되지 않습니다.
        </p>

        <div className='mb-4 relative'>
          <input
            id='api-key-input'
            type={showKey ? 'text' : 'password'}
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder='sk-...'
            className='w-full p-2.5 pr-24 border border-purple-300 rounded-modern focus:border-purple-600 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 focus:outline-none transition-colors'
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-purple-600 bg-white px-2 py-1 rounded'
          >
            {showKey ? '숨기기' : '표시'}
          </button>
        </div>

        {error && (
          <div className='mb-4 text-red-600 text-sm flex items-center gap-2'>
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}

        {isKeyValid && (
          <div className='mb-4 text-green-600 text-sm flex items-center gap-2'>
            <FaCheck />
            <span>API 키가 유효합니다.</span>
          </div>
        )}

        <div className='flex gap-3'>
          <button
            onClick={handleClearKey}
            disabled={isLoading || !apiKey}
            className='btn btn-secondary py-2 px-4 rounded-modern'
          >
            삭제
          </button>
          <button
            onClick={handleSaveKey}
            disabled={isLoading || !inputKey.trim()}
            className='flex-1 btn btn-primary py-2 rounded-modern flex items-center justify-center gap-2'
          >
            {isLoading ? (
              <>
                <FaSpinner className='animate-spin' />
                <span>확인 중...</span>
              </>
            ) : (
              '저장'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;
