import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaRegCopy } from 'react-icons/fa';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// 타입 선언 추가
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

interface CommonProps {
  node?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  // 마크다운을 HTML로 변환
  const getMarkdownHtml = () => {
    // 마크다운을 HTML로 변환
    const rawHtml = marked.parse(content, { breaks: true });
    // XSS 공격 방지를 위한 HTML 정화
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return { __html: cleanHtml };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // 컴포넌트 타입 정의
  const components: Components = {
    code({ node, inline, className, children, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className='relative group'>
          <div className='absolute -top-1 -right-1 bg-gray-700 text-xs text-white px-2 py-0.5 rounded-modern opacity-0 group-hover:opacity-100 transition-opacity'>
            {match[1]}
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag='div'
            className='rounded-modern-lg shadow-lg overflow-hidden animate-fade-in'
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
          <button
            onClick={() => copyToClipboard(String(children))}
            className='absolute top-2 right-2 bg-gray-700 bg-opacity-70 text-white p-1 rounded-modern opacity-0 group-hover:opacity-100 hover:bg-opacity-100 transition-all duration-250 animate-click'
          >
            <FaRegCopy size={14} />
          </button>
        </div>
      ) : (
        <code className='bg-gray-100 text-gray-800 px-1 py-0.5 rounded-modern font-mono text-sm'>{children}</code>
      );
    },
    a({ node, ...props }: CommonProps) {
      return (
        <a
          {...props}
          target='_blank'
          rel='noopener noreferrer'
          className='text-purple-600 hover:text-purple-800 transition-colors duration-250 relative group'
        >
          {props.children}
          <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300'></span>
        </a>
      );
    },
    blockquote({ node, ...props }: CommonProps) {
      return (
        <blockquote
          className='border-l-4 border-purple-300 pl-4 italic text-gray-700 glass-card p-3 rounded-r-modern-lg my-4'
          {...props}
        />
      );
    },
    ul({ node, ...props }: CommonProps) {
      return <ul className='list-disc pl-5 space-y-2 my-3' {...props} />;
    },
    ol({ node, ...props }: CommonProps) {
      return <ol className='list-decimal pl-5 space-y-2 my-3' {...props} />;
    },
    li({ node, ...props }: CommonProps) {
      return <li className='animate-fade-in' {...props} />;
    },
    h1({ node, ...props }: CommonProps) {
      return <h1 className='text-xl font-bold text-gray-800 my-4 pb-1 border-b border-gray-200' {...props} />;
    },
    h2({ node, ...props }: CommonProps) {
      return <h2 className='text-lg font-bold text-gray-800 my-3 pb-1 border-b border-gray-200' {...props} />;
    },
    h3({ node, ...props }: CommonProps) {
      return <h3 className='text-md font-bold text-gray-800 my-2' {...props} />;
    },
    p({ node, ...props }: CommonProps) {
      return <p className='my-2 leading-relaxed' {...props} />;
    },
    table({ node, ...props }: CommonProps) {
      return (
        <div className='overflow-x-auto my-4 rounded-modern-lg shadow-sm'>
          <table className='min-w-full bg-white bg-opacity-70 backdrop-blur-sm' {...props} />
        </div>
      );
    },
    th({ node, ...props }: CommonProps) {
      return (
        <th
          className='bg-gray-100 bg-opacity-80 backdrop-blur-sm px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'
          {...props}
        />
      );
    },
    td({ node, ...props }: CommonProps) {
      return <td className='border-t border-gray-200 px-4 py-2 text-sm' {...props} />;
    },
    hr({ node, ...props }: CommonProps) {
      return <hr className='my-6 border-t border-gray-200 shimmer' {...props} />;
    },
    img({ node, ...props }: CommonProps) {
      return <img className='rounded-modern-lg shadow-lg max-w-full my-4 animate-fade-in' {...props} />;
    },
  };

  return (
    <div className='prose prose-sm max-w-none leading-relaxed markdown-content'>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
