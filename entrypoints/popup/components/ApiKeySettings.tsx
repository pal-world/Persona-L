import React from 'react';

// API 키 설정이 제거된 간소화된 설정 컴포넌트
const ApiKeySettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">설정</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Persona-L은 Supabase를 통해 OpenAI API와 연결됩니다. 
            별도의 API 키 설정이 필요하지 않습니다.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;
