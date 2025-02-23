import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 w-[320px]'>
      <div className='flex gap-8 mb-8'>
        <a href='https://wxt.dev' target='_blank' className='hover:opacity-80 transition-opacity'>
          <img src={wxtLogo} className='h-16 w-16 animate-pulse' alt='WXT logo' />
        </a>
        <a href='https://react.dev' target='_blank' className='hover:opacity-80 transition-opacity'>
          <img src={reactLogo} className='h-16 w-16 animate-spin' alt='React logo' />
        </a>
      </div>

      <h1 className='text-4xl font-bold text-gray-800 mb-8'>WXT + React</h1>

      <div className='flex flex-col items-center gap-4 mb-8'>
        <button
          onClick={() => setCount((count) => count + 1)}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          count is {count}
        </button>
        <p className='text-gray-600'>
          Edit <code className='bg-gray-200 px-2 py-1 rounded'>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className='text-gray-500 text-sm'>Click on the WXT and React logos to learn more</p>
    </div>
  );
}

export default App;
