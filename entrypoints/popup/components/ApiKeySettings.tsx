import React, { useState, useEffect } from 'react';
import { FaKey, FaSpinner, FaCheck, FaTimes, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import { useApiKeyStore } from '../../store/apiKeyStore';

interface ApiKeySettingsProps {
  onClose: () => void;
}

const ApiKeySettings = ({ onClose }: ApiKeySettingsProps) => {
  const { apiKey, isKeyValid, isLoading, error, setApiKey, clearApiKey, setError } = useApiKeyStore();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [isVisible, setIsVisible] = useState(false);

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

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-md transition-all duration-300 animate-fade-in'>
      <div className='glass-card p-6 w-[90%] max-w-md font-sans animate-bounce-sm rounded-modern-lg'>
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-xl font-bold text-gray-800 tracking-tight'>API 키 설정</h2>
          <button
            onClick={onClose}
            className='btn-icon text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:bg-opacity-50 rounded-modern animate-click'
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className='bg-red-50 bg-opacity-80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-3 mb-5 rounded-modern animate-bounce-sm'>
            <p className='font-medium'>{error}</p>
          </div>
        )}

        <div className='mb-5'>
          <p className='text-gray-600 mb-3 leading-relaxed'>OpenAI API 키를 입력하세요. 키는 로컬에만 저장됩니다.</p>
          <a
            href='https://platform.openai.com/api-keys'
            target='_blank'
            rel='noopener noreferrer'
            className='text-purple-600 hover:text-purple-800 hover:underline text-sm font-medium transition-colors duration-250 animate-hover-float inline-block relative group'
          >
            API 키 발급받기
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300'></span>
          </a>
        </div>

        <div className='mb-4'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <FaKey className='text-purple-400' />
            </div>
            <input
              type={isVisible ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder='여기에 API 키를 입력하세요'
              className='w-full pl-10 px-4 py-3 rounded-modern bg-white bg-opacity-50 backdrop-blur-sm border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-40 shadow-sm transition-all duration-300 placeholder-gray-400'
              disabled={isLoading}
            />
            <div className='absolute right-10 top-1/2 transform -translate-y-1/2'>
              {isKeyValid && (
                <span className='text-green-500 flex items-center'>
                  <FaCheck className='animate-pulse-slow' />
                </span>
              )}
            </div>
            <button
              type='button'
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors duration-200'
              onClick={toggleVisibility}
            >
              {isVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && (
            <div className='mt-2 text-red-500 text-sm flex items-center'>
              <FaExclamationCircle className='mr-1' />
              {error}
            </div>
          )}
        </div>

        <div className='flex justify-between gap-3'>
          <button
            onClick={handleClearKey}
            disabled={isLoading || !apiKey}
            className='btn btn-secondary btn-micro-interaction btn-glow-effect flex-1 py-2.5 rounded-modern animate-click disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed group relative overflow-hidden'
          >
            <span className='relative z-10'>키 삭제</span>
          </button>

          <button
            onClick={handleSaveKey}
            disabled={isLoading || inputKey === apiKey}
            className='btn btn-primary btn-micro-interaction btn-glow-effect flex-1 py-2.5 rounded-modern animate-click disabled:bg-purple-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden'
          >
            {isLoading ? (
              <>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 shimmer-loading opacity-80'></div>
                <FaSpinner className='animate-spin mr-2 relative z-10 text-white' />
                <span className='relative z-10 loading-dots text-white'>저장 중</span>
              </>
            ) : (
              <>
                <span className='relative z-10'>저장하기</span>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;
