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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-[90%] max-w-md'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-gray-800'>API 키 설정</h2>
          <button 
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <FaTimes />
          </button>
        </div>
        
        {error && (
          <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4'>
            <p>{error}</p>
          </div>
        )}
        
        <div className='mb-4'>
          <p className='text-gray-600 mb-2'>
            OpenAI API 키를 입력하세요. API 키는 로컬에만 저장되며 외부로 전송되지 않습니다.
          </p>
          <a 
            href='https://platform.openai.com/api-keys' 
            target='_blank' 
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline text-sm'
          >
            API 키 발급받기
          </a>
        </div>
        
        <div className='flex items-center mb-4'>
          <div className='relative flex-1'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <FaKey className='text-gray-400' />
            </div>
            <input
              type='password'
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder='sk-...'
              className='w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          
          {isKeyValid && (
            <div className='ml-2 text-green-500'>
              <FaCheck />
            </div>
          )}
        </div>
        
        <div className='flex justify-between'>
          <button
            onClick={handleClearKey}
            disabled={isLoading || !apiKey}
            className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300'
          >
            키 삭제
          </button>
          
          <button
            onClick={handleSaveKey}
            disabled={isLoading || inputKey === apiKey}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center'
          >
            {isLoading ? (
              <>
                <FaSpinner className='animate-spin mr-2' />
                저장 중...
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