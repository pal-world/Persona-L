import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

/**
 * 에러 메시지 컴포넌트
 * 서버에서 오는 에러 메시지를 포맷팅하여 표시합니다.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  // 에러 메시지가 JSON 형식인지 확인하고 파싱
  const formatErrorMessage = (errorMsg: string): string => {
    try {
      // 에러 메시지에 JSON이 포함되어 있는지 확인
      if (errorMsg.includes('{') && errorMsg.includes('}')) {
        const jsonStartIndex = errorMsg.indexOf('{');
        const jsonEndIndex = errorMsg.lastIndexOf('}') + 1;
        const jsonStr = errorMsg.substring(jsonStartIndex, jsonEndIndex);
        const parsedError = JSON.parse(jsonStr);
        
        if (parsedError.error) return parsedError.error;
        if (parsedError.message) return parsedError.message;
      }
    } catch (e) {
      // JSON 파싱 실패 시 원래 메시지 사용
    }
    
    return errorMsg;
  };

  return (
    <div className='glass-card bg-red-50 bg-opacity-90 border-l-4 border-red-500 text-red-700 p-4 animate-bounce-sm rounded-modern relative'>
      <p className='font-medium pr-6'>{formatErrorMessage(message)}</p>
      <button
        onClick={onClose}
        className='absolute top-2 right-2 text-red-700 hover:text-red-900 focus:outline-none'
        aria-label='닫기'
      >
        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </div>
  );
};

export default ErrorMessage; 