import { FaSpinner } from 'react-icons/fa';
import chatIcon from '/assets/chat.svg';

interface PersonaCreatorProps {
  onCreatePersona: () => void;
  isLoading: boolean;
}

const PersonaCreator = ({ onCreatePersona, isLoading }: PersonaCreatorProps) => {
  return (
    <div className='glass-card p-6 flex flex-col items-center justify-center h-full rounded-modern-lg'>
      <div className='text-purple-600 mb-4 animate-float relative'>
        <div className='absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-30 animate-pulse-slow'></div>
        <img src={chatIcon} alt='Chat Icon' width={100} height={100} className='relative z-10' />
      </div>

      <h2 className='text-xl font-bold text-gray-800 mb-3 tracking-tight'>페르소나 생성</h2>

      <p className='text-gray-600 mb-5 text-center leading-relaxed'>
        현재 페이지의 내용을 분석하여 작가의 페르소나를 생성합니다.
      </p>

      <button
        onClick={onCreatePersona}
        disabled={isLoading}
        className='btn btn-primary btn-glow-effect w-full py-2.5 rounded-modern animate-click disabled:bg-purple-400 disabled:shadow-none disabled:cursor-not-allowed relative overflow-hidden group'
      >
        {isLoading ? (
          <>
            <div className='absolute inset-0 bg-purple-500 shimmer'></div>
            <FaSpinner className='animate-spin mr-2 relative z-10' />
            <span className='tracking-wide relative z-10 loading-dots'>생성 중</span>
          </>
        ) : (
          <>
            <span className='tracking-wide relative z-10'>페르소나 생성하기</span>
            <div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
          </>
        )}
      </button>
    </div>
  );
};

export default PersonaCreator;
