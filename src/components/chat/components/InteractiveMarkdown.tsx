import React, { useEffect } from 'react';
import { executeAction } from '../utils/action-manager';
import { RichMessageContent } from '../utils/chat-stream-handler';
import TypingMarkdown from './TypingMarkdown';

interface InteractiveMarkdownProps {
  content: string;
  richContent?: RichMessageContent;
  onResize?: () => void;
}

const InteractiveMarkdown: React.FC<InteractiveMarkdownProps> = ({ 
  content, 
  richContent,
  onResize 
}) => {
  useEffect(() => {
    if (onResize) {
      onResize();
    }
  }, [content, onResize]);

  const handleActionClick = (actionType: string, params?: any) => {
    console.log(`Action button clicked: ${actionType}`, params);
    executeAction(actionType, params);
  };

  return (
    <div className="interactive-markdown">
      <TypingMarkdown 
        options={{
          interval: 30,
          step: [1, 3],
          initialIndex: 0,
        }}
        content={content}  
      />

      {!richContent && <div style={{display: 'none'}}>No rich content available</div>}

      {richContent?.actions && richContent.actions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {richContent.actions.map((action, index) => (
            <button
              key={index}
              className="px-3 py-1 bg-[#DAD9CD] hover:bg-[#C8C7B7] rounded-md text-sm font-Montserrat"
              onClick={() => handleActionClick(action.type, action.params)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractiveMarkdown;
