import React, { useEffect } from 'react';
import TypingMarkdown from './TypingMarkdown';
import { useChatContext } from '../context/chat-context';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface InteractiveMarkdownProps {
  content: string;
  component?: React.ReactNode;
  onResize?: () => void;
  skipTyping?: boolean; 
}

const InteractiveMarkdown: React.FC<InteractiveMarkdownProps> = ({ 
  content, 
  component,
  onResize,
  skipTyping = false
}) => {
  useEffect(() => {
    if (onResize) {
      onResize();
    }
  }, [content, onResize]);

  const { isFromHistory } = useChatContext()

  if (isFromHistory && !skipTyping) {
    return (
      <div className="interactive-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        {component}
      </div>
    );
  }

  return (
    <div className="interactive-markdown">
      {!skipTyping && (
        <TypingMarkdown 
          options={{
            interval: 30,
            step: [1, 3],
            initialIndex: 0,
          }}
          content={content}
          onScrollToBottom={onResize}
        />
      )}
      {component}
    </div>
  );
};

export default InteractiveMarkdown;
