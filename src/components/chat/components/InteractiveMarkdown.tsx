import React, { useEffect } from 'react';
import TypingMarkdown from './TypingMarkdown';

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
        />
      )}
      {component}
    </div>
  );
};

export default InteractiveMarkdown;
