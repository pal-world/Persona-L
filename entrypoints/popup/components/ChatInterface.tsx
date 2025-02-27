import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import MarkdownRenderer from './MarkdownRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatInterface = ({ messages, isLoading, onSendMessage }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className='flex-1 flex flex-col h-full bg-white rounded-lg shadow-card overflow-hidden'>
      <div className='flex-1 overflow-y-auto p-4.5'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'}`}
          >
            <div
              className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-purple-50 text-gray-800 rounded-bl-none'
              }`}
            >
              {message.role === 'user' ? message.content : <MarkdownRenderer content={message.content} />}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className='mr-auto max-w-[80%] mb-4'>
            <div className='p-3 bg-purple-50 text-gray-800 rounded-lg rounded-bl-none flex items-center'>
              <FaSpinner className='animate-spin mr-2 text-purple-600' />
              생각 중...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className='p-4.5 border-t border-gray-200 bg-gray-50'>
        <div className='flex'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='작가에게 메시지 보내기...'
            className='flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
            disabled={isLoading}
          />
          <button
            type='submit'
            disabled={isLoading || !input.trim()}
            className='bg-purple-600 text-white p-3 rounded-r-lg hover:bg-purple-700 disabled:bg-purple-400 flex items-center justify-center w-12'
          >
            {isLoading ? <FaSpinner className='animate-spin' /> : <FaPaperPlane />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
