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
    <div className='flex-1 flex flex-col h-full bg-white rounded-lg shadow-card overflow-hidden font-sans'>
      <div className='flex-1 overflow-y-auto p-4.5'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'}`}
          >
            <div
              className={`p-3 rounded-lg transform transition-all duration-250 ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none font-medium shadow-button'
                  : 'bg-purple-50 text-gray-800 rounded-bl-none shadow-button hover:shadow-button-hover hover:scale-102'
              }`}
            >
              {message.role === 'user' ? (
                <p className='leading-relaxed tracking-wide'>{message.content}</p>
              ) : (
                <div className='prose prose-sm max-w-none leading-relaxed'>
                  <MarkdownRenderer content={message.content} />
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className='mr-auto max-w-[80%] mb-4'>
            <div className='p-3 bg-purple-50 text-gray-800 rounded-lg rounded-bl-none flex items-center shadow-button animate-pulse-slow'>
              <FaSpinner className='animate-spin mr-2 text-purple-600' />
              <span className='font-medium'>생각 중...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className='p-4.5 border-t border-gray-200 bg-gray-50'>
        <div className='flex group'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='작가에게 메시지 보내기...'
            className='input-field flex-1 p-3 rounded-l-lg font-sans animate-focus'
            disabled={isLoading}
          />
          <button
            type='submit'
            disabled={isLoading || !input.trim()}
            className='btn btn-primary p-3 rounded-r-lg animate-click disabled:bg-purple-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center w-12'
          >
            {isLoading ? (
              <FaSpinner className='animate-spin' />
            ) : (
              <FaPaperPlane className='transform transition-transform duration-250 group-hover:translate-x-1 group-hover:-translate-y-1' />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
