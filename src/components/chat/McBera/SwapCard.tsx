import React, { useEffect, useState } from "react";
import { bera } from "@/configs/tokens/bera";
import SwapModal from "@/sections/swap/SwapModal";
import useSwapStore from "../stores/useSwapStores";
import { useChatContext, Message } from "../context/chat-context";
import { createNewChat } from "../utils/chat-service";
import { RichMessageContent } from "../utils/chat-stream-handler";
import { useTypewriter } from "../hooks/useTypewriter";

interface SwapCardProps {
  content?: string;
  richContent?: RichMessageContent;
}

const SwapCard: React.FC<SwapCardProps> = ({ content, richContent }) => {
  const {
    isSwapModalOpen,
    closeSwapModal,
    openSwapModal,
    defaultInputCurrency,
    defaultOutputCurrency,
    setDefaultInputCurrency,
    setDefaultOutputCurrency,
  } = useSwapStore();

  const { addMessage, updateMessage, sessionId, setSessionId, addChatHistory } =
    useChatContext();

  const [contentFinished, setContentFinished] = useState(false);

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

        await createNewChat(userMessage, {
          updateMessage: (updatedMessage: Message) => {
            if (updatedMessage.sender === "assistant") {
              updateMessage(updatedMessage);
            }
          },
          addChatHistory,
          setSessionId,
          getSessionId: () => sessionId,
        });
      } catch (error) {
        console.error("Chat action error:", error);
        addMessage({
          id: Date.now().toString(),
          sender: "assistant",
          senderName: "McBera",
          content: "Sorry, I can't assist with that.",
        });
      }
    }
  };

  const renderContent = () => {
    if (!content) {
      useEffect(() => {
        setContentFinished(true);
      }, []);
      return null;
    }

    const boldRegex = /\*\*([^*]+)\*\*/;
    const match = content.match(boldRegex);

    if (match) {
      const symbolName = match[1];
      const parts = content.split(boldRegex);

      const { typedContent, isTyping } = useTypewriter(content, {
        interval: 40,
        step: [1, 3],
      });

      useEffect(() => {
        if (!isTyping) {
          setContentFinished(true);
        } else {
          setContentFinished(false);
        }
      }, [isTyping]);

      if (isTyping) {
        return <div className="markdown-content">{typedContent}</div>;
      }

      return (
        <div className="markdown-content">
          {parts[0]}
          <span
            className="font-bold cursor-pointer text-[#471C1C] underline"
            onClick={openSwapModal}
          >
            {symbolName}
          </span>
          {parts[2]}
        </div>
      );
    }

    useEffect(() => {
      setContentFinished(true);
    }, []);

    return null;
  };

  useEffect(() => {
    return () => {
      closeSwapModal();
      setDefaultInputCurrency(null);
      setDefaultOutputCurrency(null);
    };
  }, [closeSwapModal, setDefaultInputCurrency, setDefaultOutputCurrency]);


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

      <SwapModal
        defaultInputCurrency={
          bera[defaultInputCurrency?.symbol?.toLowerCase()] ||
          defaultInputCurrency
        }
        defaultOutputCurrency={
          bera[defaultOutputCurrency?.symbol?.toLowerCase()] ||
          defaultOutputCurrency
        }
        show={!!isSwapModalOpen}
        onClose={() => {
          closeSwapModal();
        }}
        from="ai-chat"
      />
    </>
  );
};

export default SwapCard;
