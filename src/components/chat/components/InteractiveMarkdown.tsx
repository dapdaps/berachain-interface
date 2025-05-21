import React, { useEffect, useMemo, useState } from 'react';
import { RichMessageContent } from '../utils/chat-stream-handler';
import TypingMarkdown from './TypingMarkdown';
import useSwapStore from '../stores/useSwapStores';
import SwapCard from '../McBera/SwapCard';
import { useChatContext, Message } from '../context/chat-context';
import { createNewChat } from '../utils/chat-service';

interface InteractiveMarkdownProps {
  content: string;
  richContent?: RichMessageContent;
  component?: any;
  onResize?: () => void;
}

const InteractiveMarkdown: React.FC<InteractiveMarkdownProps> = ({ 
  content, 
  richContent,
  component,
  onResize
}) => {
  const swapStore = useSwapStore();

  const { 
    addMessage, 
    updateMessage, 
    sessionId, 
    setSessionId, 
    addChatHistory,
  } = useChatContext();
  
  useEffect(() => {
    if (onResize) {
      onResize();
    }
  }, [content, onResize]);

  const handleActionClick = async (actionType: string, params?: any) => {
    console.log(`Action button clicked: ${actionType}`, params);
    if (actionType === 'chat') {
      try {
        const userMessage = params.label;
        
        const newUserMessage: Message = {
          id: Date.now().toString(),
          sender: "user",
          content: userMessage,
        };
        addMessage(newUserMessage);
        
        const assistantMessageId = (Date.now() + 1).toString();
        const emptyAssistantMessage: Message = {
          id: assistantMessageId,
          sender: "assistant",
          senderName: "McBera",
          content: "",
        };
        addMessage(emptyAssistantMessage);
        
        await createNewChat(userMessage, {
          updateMessage: (updatedMessage: Message) => {
            if (updatedMessage.sender === "assistant") {
              updateMessage(updatedMessage);
            }
          },
          addChatHistory,
          setSessionId,
          getSessionId: () => sessionId 
        });
      } catch (error) {
        console.error("Chat action error:", error);
        addMessage({
          id: Date.now().toString(),
          sender: "assistant",
          senderName: "McBera",
          content: "Sorry, I can't assist with that."
        });
      }
    }
  };
  
  const handleBoldTextClick = () => {
    swapStore.openSwapModal();
  };

  const renderContent = () => {
    const boldRegex = /\*\*([^*]+)\*\*/;
    const match = content.match(boldRegex);

    if (match) {
      const symbolName = match[1]; 
      const parts = content.split(boldRegex);
      
      return (
        <div className="markdown-content">
          {parts[0]}
          <span 
            className="font-bold cursor-pointer text-[#471C1C] underline" 
            onClick={handleBoldTextClick}
          >
            {symbolName}
          </span>
          {parts[2]}
        </div>
      );
    }

    return (
      <TypingMarkdown 
        options={{
          interval: 30,
          step: [1, 3],
          initialIndex: 0,
        }}
        content={content}  
      />
    );
  };

  return (
    <div className="interactive-markdown">
      {renderContent()}
      {
        component ? component : (
          <>
            {!richContent && <div style={{display: 'none'}}>No rich content available</div>}

            {richContent?.actions && richContent.actions.length > 0 && (
              <div className="mt-[14px] flex flex-col items-start gap-2">
                {richContent.actions.map((action, index) => (
                  <button
                    key={index}
                    className="w-auto max-w-full px-2 py-1 border border-[#DAD9CD] hover:bg-[#DAD9CD]/30 text-[#999999] hover:text-[#471C1C] rounded-[18px] text-[13px] font-Montserrat"
                    onClick={() => handleActionClick(action.type, action)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )
      }
    </div>
  );
};

export default InteractiveMarkdown;
