import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTypewriter, Options } from '../hooks/useTypewriter';
import { clsx } from 'clsx';

interface TypingMarkdownProps {
  content: string;
  className?: string;
  options?: Options;
  onResize?: (element: HTMLDivElement) => void;
}

const TypingMarkdown: React.FC<TypingMarkdownProps> = ({ 
  content, 
  className, 
  options,
  onResize 
}) => {
  const { typedContent, isTyping } = useTypewriter(content, options);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!('ResizeObserver' in window) || !onResize || !containerRef.current) {
      return;
    }
    
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        onResize(containerRef.current);
      }
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [onResize]);
  
  return (
    <div 
      ref={containerRef}
      className={clsx(className)} 
      data-typing={isTyping ? 'true' : 'false'}
    >
      <ReactMarkdown>{typedContent}</ReactMarkdown>
    </div>
  );
};

export default TypingMarkdown;