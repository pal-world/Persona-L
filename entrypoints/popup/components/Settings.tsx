import React from 'react';

// API 키 설정 제거된 간소화된 설정 컴포넌트
const Settings: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">설정</h2>
      
      {/* 다른 설정 옵션들 */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">일반 설정</h3>
        {/* 필요한 다른 설정 옵션들 */}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Persona-L은 Supabase를 통해 OpenAI API에 연결됩니다.</p>
      </div>
    </div>
  );
};

export default Settings; 