import React, { useState, useEffect } from 'react';
import { FaKey, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import { useApiKeyStore } from '../../store/apiKeyStore';

interface ApiKeySettingsProps {
  onClose: () => void;
}

const ApiKeySettings = ({ onClose }: ApiKeySettingsProps) => {
  const { apiKey, isKeyValid, isLoading, error, setApiKey, clearApiKey, setError } = useApiKeyStore();
  const [inputKey, setInputKey] = useState(apiKey || '');

  useEffect(() => {
    // 컴포넌트 마운트 시 기존 API 키 로드
    setInputKey(apiKey || '');
  }, [apiKey]);

  const handleSaveKey = async () => {
    if (!inputKey.trim()) {
      setError('API 키를 입력해주세요.');
      return;
    }

    await setApiKey(inputKey.trim());
  };

  const handleClearKey = () => {
    clearApiKey();
    setInputKey('');
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300'>
      <div className='bg-white rounded-lg shadow-card p-6 w-[90%] max-w-md font-sans animate-bounce-sm'>
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-xl font-bold text-gray-800 tracking-tight'>API 키 설정</h2>
          <button
            onClick={onClose}
            className='btn-icon text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full animate-click'
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-5 rounded animate-bounce-sm'>
            <p className='font-medium'>{error}</p>
          </div>
        )}

        <div className='mb-5'>
          <p className='text-gray-600 mb-3 leading-relaxed'>OpenAI API 키를 입력하세요. 키는 로컬에만 저장됩니다.</p>
          <a
            href='https://platform.openai.com/api-keys'
            target='_blank'
            rel='noopener noreferrer'
            className='text-purple-600 hover:text-purple-800 hover:underline text-sm font-medium transition-colors duration-250 animate-hover-float inline-block'
          >
            API 키 발급받기
          </a>
        </div>

        <div className='mb-5'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <FaKey className='text-gray-400' />
            </div>
            <input
              type='password'
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder='sk-...'
              className='input-field w-full pl-10 p-3 rounded-lg font-mono text-sm animate-focus'
            />
            {isKeyValid && (
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 text-green-500 animate-pulse-slow'>
                <FaCheck />
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-between gap-3'>
          <button
            onClick={handleClearKey}
            disabled={isLoading || !apiKey}
            className='btn btn-secondary flex-1 py-2.5 rounded-lg animate-click disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed'
          >
            키 삭제
          </button>

          <button
            onClick={handleSaveKey}
            disabled={isLoading || inputKey === apiKey}
            className='btn btn-primary flex-1 py-2.5 rounded-lg animate-click disabled:bg-purple-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center'
          >
            {isLoading ? (
              <>
                <FaSpinner className='animate-spin mr-2' />
                저장 중
              </>
            ) : (
              '저장하기'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;
