import React, { useEffect } from 'react';
import TypingMarkdown from './TypingMarkdown';
import { useChatContext } from '../context/chat-context';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_TYPING_OPTIONS = {
  interval: 30,
  step: [1, 3],
  initialIndex: 0,
};

interface InteractiveMarkdownProps {
  message: any;
  content: string;
  component?: React.ReactNode;
  onResize?: () => void;
  skipTyping?: boolean;
  typingOptions?: typeof DEFAULT_TYPING_OPTIONS;
}

const InteractiveMarkdown: React.FC<InteractiveMarkdownProps> = ({
  message,
  content,
  component,
  onResize,
  skipTyping = false,
  typingOptions = DEFAULT_TYPING_OPTIONS
}) => {
  useEffect(() => {
    if (onResize) {
      onResize();
    }
  }, [content, onResize]);

  const { isFromHistory } = useChatContext();
  
  const shouldShowTyping = !skipTyping;
  const isHistoryMessage = isFromHistory || message.isFromHistory;
  const useTypingAnimation = shouldShowTyping && !isHistoryMessage;
  
  if (!shouldShowTyping) {
    return (
      <div className="interactive-markdown">
        {component}
      </div>
    );
  }

  return (
    <div className="interactive-markdown">
      {useTypingAnimation ? (
        <TypingMarkdown 
          options={typingOptions}
          content={content}
          onScrollToBottom={onResize}
        />
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      )}
      {component}
    </div>
  );
};

export default InteractiveMarkdown;