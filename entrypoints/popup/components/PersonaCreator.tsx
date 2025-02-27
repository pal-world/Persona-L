import { FaSpinner } from 'react-icons/fa';
import chatIcon from '/assets/chat.svg';

interface PersonaCreatorProps {
  onCreatePersona: () => void;
  isLoading: boolean;
}

const PersonaCreator = ({ onCreatePersona, isLoading }: PersonaCreatorProps) => {
  return (
    <div className='bg-white rounded-lg shadow-card p-6 flex flex-col items-center hover:shadow-card-hover transition-shadow'>
      <div className='text-purple-600 mb-4'>
        <img src={chatIcon} alt='Chat Icon' width={100} height={100} />
      </div>

      <h2 className='text-xl font-bold text-gray-800 mb-3'>페르소나 생성</h2>

      <p className='text-gray-600 mb-5 text-center'>현재 페이지의 내용을 분석하여 작가의 페르소나를 생성합니다.</p>

      <button
        onClick={onCreatePersona}
        disabled={isLoading}
        className='w-full py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 flex items-center justify-center'
      >
        {isLoading ? (
          <>
            <FaSpinner className='animate-spin mr-2' />
            생성 중...
          </>
        ) : (
          '페르소나 생성하기'
        )}
      </button>
    </div>
  );
};

export default PersonaCreator;
