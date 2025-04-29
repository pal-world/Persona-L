import React, { useEffect, useState } from 'react';

// 사용자 설정 컴포넌트
const UserSettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.sync.get('personaUuid', (result) => {
      if (result.personaUuid) setUuid(result.personaUuid);
      else setUuid(null);
    });
  }, []);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-xl'>
        <div className='mb-6'>
          <div className='mt-4 p-3 bg-gray-100 rounded'>
            <span className='font-semibold text-gray-700'>사용자 UUID: </span>
            {uuid ? (
              <span className='text-purple-700 break-all'>{uuid}</span>
            ) : (
              <span className='text-gray-400'>아직 id가 생성되지 않은 사용자</span>
            )}
          </div>
        </div>

        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors'
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
