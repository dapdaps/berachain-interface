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
        <div className="mt-[14px] flex flex-col items-start gap-2">
          {richContent.actions.map((action, index) => (
            <button
              key={index}
              className="w-auto max-w-full px-2 py-1 border border-[#DAD9CD] hover:bg-[#DAD9CD]/30 text-[#999999] hover:text-[#471C1C] rounded-[18px] text-[13px] font-Montserrat"
              onClick={() => handleActionClick(action.type, action.label)}
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
