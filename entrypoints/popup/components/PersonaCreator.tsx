import { FaSpinner } from 'react-icons/fa';
import chatIcon from '/assets/chat.svg';

interface PersonaCreatorProps {
  onCreatePersona: () => void;
  isLoading: boolean;
}

const PersonaCreator = ({ onCreatePersona, isLoading }: PersonaCreatorProps) => {
  return (
    <div className='flex-1 flex flex-col items-center justify-center p-6 text-center'>
      <div className='text-purple-600'>
        <img src={chatIcon} alt='Chat Icon' width={120} height={120} />
      </div>

      <h2 className='text-2xl font-bold text-gray-800 mb-4'>작가의 페르소나 생성하기</h2>

      <p className='text-gray-600 mb-8 max-w-xs'>
        현재 페이지의 내용을 분석하여 글을 작성한 작가의 페르소나를 생성합니다. 생성된 페르소나와 대화를 나눌 수
        있습니다.
      </p>

      <button
        onClick={onCreatePersona}
        disabled={isLoading}
        className='px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 flex items-center'
      >
        {isLoading ? (
          <>
            <FaSpinner className='animate-spin mr-2' />
            페르소나 생성 중...
          </>
        ) : (
          '페르소나 생성하기'
        )}
      </button>
    </div>
  );
};

export default PersonaCreator;
