import React, { useEffect, useState } from "react";
import { bera } from "@/configs/tokens/bera";
import useSwapStore from "../stores/useSwapStores";
import { useChatContext, Message } from "../context/chat-context";
import { createNewChat } from "../utils/chat-service";
import { RichMessageContent } from "../utils/chat-stream-handler";
import { useTypewriter } from "../hooks/useTypewriter";

interface SwapCardProps {
  parsedContent: any
  content?: string;
  richContent?: RichMessageContent;
}

const SwapCard: React.FC<SwapCardProps> = ({ parsedContent, content, richContent }) => {
  const {
    openSwapModal,
    setDefaultInputCurrency,
    setDefaultOutputCurrency,
  } = useSwapStore();

  const { addMessage, updateMessage, sessionId, setSessionId, addChatHistory, isFromHistory } =
    useChatContext();

  const [contentFinished, setContentFinished] = useState(false);
  
  const { typedContent, isTyping } = useTypewriter(content || "", {
    interval: 40,
    step: [1, 3],
  });
  
  const boldRegex = /\*\*([^*]+)\*\*/;
  const match = content ? content.match(boldRegex) : null;
  const symbolName = match ? match[1] : null;
  const contentParts = content ? content.split(boldRegex) : [];

  useEffect(() => {
    if (isFromHistory || !content || !isTyping) {
      setContentFinished(true);
    } else {
      setContentFinished(false);
    }
  }, [isTyping, isFromHistory, content]);

  const handleActionClick = async (actionType: string, params?: any) => {
    if (actionType === "chat") {
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

        await createNewChat(userMessage,
          emptyAssistantMessage,
           {
          updateMessage: (updatedMessage: Message) => {
            if (updatedMessage.sender === "assistant") {
              updateMessage(updatedMessage);
            }
          },
          addChatHistory,
          setSessionId,
          getSessionId: () => sessionId,
          onError: () => {
            updateMessage({
              ...emptyAssistantMessage,
              content: "Sorry, I can't assist with that."
            });
          }
        });
      } catch (error) {
        console.error("Chat action error:", error);
      }
    }
  };

  const handleAction = async () => {
    if (parsedContent && parsedContent.input_token) {
      setDefaultInputCurrency(parsedContent.input_token);
    }

    if (parsedContent && parsedContent.output_token) {
      setDefaultOutputCurrency(parsedContent.output_token);
    }

    openSwapModal();
  }

  // 渲染内容
  const renderContent = () => {
    if (!content) {
      return null;
    }

    if (match) {
      if (isFromHistory || !isTyping) {
        return (
          <div className="markdown-content">
            {contentParts[0]}
            <span
              className="font-bold cursor-pointer text-[#471C1C] underline"
              onClick={handleAction}
            >
              {symbolName}
            </span>
            {contentParts[2]}
          </div>
        );
      }
      
      return <div className="markdown-content">{typedContent}</div>;
    }

    return <div className="markdown-content">{content}</div>;
  };

  return (
    <>
      {renderContent()}

      {contentFinished &&
        richContent?.actions &&
        richContent.actions.length > 0 && (
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
  );
};

export default SwapCard;