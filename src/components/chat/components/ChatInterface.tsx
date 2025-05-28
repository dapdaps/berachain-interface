import { useAccount } from "wagmi";
import useUser from "@/hooks/use-user";
import { useState, useRef, useEffect, useCallback } from 'react';
import LazyImage from "../../layz-image";
import IconSend from "@public/images/chat/send.svg";
import { useChatContext, Message } from "../context/chat-context";
import { createNewChat } from "../utils/chat-service";
import InteractiveMarkdown from "./InteractiveMarkdown";
import { useScroll } from '@/components/chat/hooks/useScroll';

import useSwapStore from "../stores/useSwapStores";
import SwapModal from "@/sections/swap/SwapModal";
import { bera } from "@/configs/tokens/bera";

export type MessageType = {
  id: string;
  sender: "user" | "assistant";
  content: string;
  senderName?: string;
};

interface ITrade {
  inputCurrencyAmount: string;
  outputCurrencyAmount: string;
  inputCurrency: any;
  outputCurrency: any;
  transactionHash: string;
  tradeFrom: string;
}


const UserAvatar: React.FC = () => {
  const { userInfo } = useUser();
  const { address } = useAccount();
  return !address || !userInfo.avatar ? (
    <div className="shrink-0 w-[26px] h-[26px] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#00D1FF_0deg,#FF008A_360deg)]" />
  ) : (
    <div className="w-[26px] h-[26px] shrink-0">
      <LazyImage src={userInfo.avatar} className="rounded-full shrink-0 " />
    </div>
  );
};

export default function ChatInterface() {
  const {
    messages: contextMessages,
    addMessage,
    addChatHistory,
    startNewChat,
    setMessages,
    updateMessage,
    sessionId,
    isFromHistory,
    setIsFromHistory,
    setSessionId,
    isProcessing,
    setIsProcessing
  } = useChatContext();

  const {
    isSwapModalOpen,
    closeSwapModal,
    defaultInputCurrency,
    defaultOutputCurrency
  } = useSwapStore();

  const displayMessages =
    contextMessages.length > 0 ? contextMessages : [];

  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timer = useRef<any>(null);
  const { containerRef } = useScroll();

  const scrollToBottom = useCallback((isToLastUserMessage?: boolean) => {
    const getOffsetTopRelativeToContainer = (child: any, container: any) => {
      const childRect = child?.getBoundingClientRect();
      const containerRect = container?.getBoundingClientRect();
      return childRect.top - containerRect.top + container.scrollTop;
    }
    const chatContainer = containerRef.current;

    clearTimeout(timer.current);

    if (chatContainer) {
      if (isToLastUserMessage) {
        const userMessages = chatContainer.querySelectorAll('[data-role="user"]');
        const lastUserMessage = userMessages[userMessages.length - 1] as HTMLElement;
        if (lastUserMessage) {
          const elementOffset = getOffsetTopRelativeToContainer(lastUserMessage, chatContainer);
          timer.current = setTimeout(() => {
            chatContainer.scrollTo({
              top: elementOffset,
              behavior: 'smooth'
            });
            clearTimeout(timer.current);
          }, 0);
          return;
        }
      }
      timer.current = setTimeout(() => {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth'
        });
        clearTimeout(timer.current);
      }, 0);
    }
  }, []);

  useEffect(() => {
    scrollToBottom(isFromHistory);
  }, [displayMessages, isFromHistory]);

  const handleMessageResize = useCallback(() => {
    scrollToBottom();
  }, []);

  const handleSubmit = async () => {
  if (inputValue.trim() === "" || isProcessing) return;

  try {
    const userMessage = inputValue;
    setInputValue("");
    setIsProcessing(true);
    const isNewChat = contextMessages.length === 0;
    setIsFromHistory(false);
    if (!isNewChat) {
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

    await createNewChat(
      userMessage,
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
        onComplete: () => {
          setIsProcessing(false);
        },
        onError: () => {
          updateMessage({
            ...emptyAssistantMessage,
            content: "Sorry, I can't assist with that."
          });
          setIsProcessing(false);
        }
      }
    );
    } else {
      startNewChat(userMessage);
          const assistantMessageId = (Date.now() + 1).toString();
          const emptyAssistantMessage: Message = {
            id: assistantMessageId,
            sender: "assistant",
            senderName: "McBera",
            content: "",
          };
      await createNewChat(userMessage, 
        emptyAssistantMessage, // 传入已创建的消息对象
        {
        updateMessage: (updatedMessage: Message) => {
          if (updatedMessage.sender === "assistant") {
            updateMessage(updatedMessage);
          }
        },
        addChatHistory,
        setSessionId,
        getSessionId: () => null,
        onComplete: () => {
          setIsProcessing(false);
        },
        onError: () => {
          updateMessage({
            ...emptyAssistantMessage,
            content: "Sorry, I can't assist with that."
          });
          setIsProcessing(false);
        }
      });
    }
    
  } catch (error) {
    console.error("Get error:", error);
    setIsProcessing(false);
    const lastAssistantMessage = [...contextMessages].reverse().find(
      msg => msg.sender === "assistant"
    );
    if (lastAssistantMessage) {
      updateMessage({
        ...lastAssistantMessage,
        content: "Sorry, I can't assist with that."
      });
    }
  }
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  console.log("ChatInterface rendered with messages:", displayMessages);

  return (
    <div className="flex flex-col w-[560px] mx-auto">
      <div
        className="mt-5 flex-1 overflow-y-auto max-h-[500px] hide-scrollbar"
        ref={containerRef}
      >
        {displayMessages.map((message) => {
          return (
            <div
              key={message.id}
              data-role={message.sender}
              className={`flex items-start mb-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "user" ? (
                <div className="flex flex-col items-end">
                  <div
                    className={`
                    max-w-[300px] break-all border border-[#DAD9CD] rounded-[10px] bg-opacity-30 bg-[#DAD9CD] px-[5px] py-1 flex items-center gap-2`}
                  >
                    <UserAvatar />
                    <div className="font-Montserrat text-black/50 text-[14px] leading-[14px] font-[500]">
                      {message.content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-[26px] h-[26px] flex-shrink-0 aspect-square flex items-center justify-center">
                      <img
                        src="/images/chat/mcbera.png"
                        className="w-full object-contain"
                        alt=""
                      />
                    </div>
                    {message.senderName && (
                      <span className="text-sm text-black/50 font-[500] font-Montserrat">
                        {message.senderName}:
                      </span>
                    )}
                  </div>
                  <div className="text-black text-sm leading-tight font-medium font-Montserrat w-full">
                    {message.sender === "assistant" && message.content === "" ? (
                      <div className="text-gray-500">Thinking...</div>
                    ) : message.sender === "assistant" && message.content ? (
                      <InteractiveMarkdown
                        message={message}
                        content={message.content}
                        component={message.component}
                        onResize={handleMessageResize}
                        skipTyping={message.skipTyping}
                      />
                    ) : (
                      <div className="text-gray-500">No Data</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center relative mt-auto">
        <textarea
          className="font-Montserrat text-[14px] font-[500] leading-[12px] w-full py-[14px] px-4 rounded-lg border border-black bg-white shadow-[inset_6px_5px_0px_0px_rgba(0,0,0,0.25)] focus:outline-none resize-none"
          placeholder="Ask anything..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => {
            setIsComposing(true);
          }}
          onCompositionEnd={() => {
            setIsComposing(false);
          }}
        />
      <div
       onClick={handleSubmit}
        className={`absolute right-3 bottom-3 ${
          isProcessing ? 'opacity-40 pointer-events-none' : 'cursor-pointer'
        }`}>
          <IconSend />
        </div>
      </div>
      
      {/* 全局 SwapModal */}
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
        onSuccess={(trade: ITrade) => {
          const successMessageId = Date.now().toString();
          const txUrl = `https://berascan.com/tx/${trade.transactionHash}`;

          const messageContent = `You swapped ${trade.inputCurrencyAmount} ${trade.inputCurrency?.symbol || ''} for ${trade.outputCurrencyAmount} ${trade.outputCurrency?.symbol || ''} via ${trade.tradeFrom}\n Here is Tx: [${txUrl}](${txUrl})`;

          const successMessage: Message = {
            id: successMessageId,
            sender: "assistant",
            senderName: "McBera",
            content: messageContent,
          };
          setIsFromHistory(false);
          addMessage(successMessage);
        }}
        from="ai-chat"
      />
    </div>
  );
}
