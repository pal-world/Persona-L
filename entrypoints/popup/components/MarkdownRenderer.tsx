import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownRendererProps {
  content: string;
  className?: string;
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

  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={getMarkdownHtml()} 
    />
  );
};

export default MarkdownRenderer; 