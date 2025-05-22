import { useAccount } from "wagmi";
import useUser from "@/hooks/use-user";
import { useState, useRef, useEffect } from "react";
import LazyImage from "../../layz-image";
import IconSend from "@public/images/chat/send.svg";
import { useChatContext, Message } from "../context/chat-context";
import { createNewChat } from "../utils/chat-service";
import InteractiveMarkdown from "./InteractiveMarkdown";

export type MessageType = {
  id: string;
  sender: "user" | "assistant";
  content: string;
  senderName?: string;
};

const UserAvatar: React.FC = () => {
  const { userInfo } = useUser();
  const { address } = useAccount();
  return !address || !userInfo.avatar ? (
    <div className="w-[26px] h-[26px] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#00D1FF_0deg,#FF008A_360deg)]" />
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
    setSessionId
  } = useChatContext();

  const displayMessages =
    contextMessages.length > 0 ? contextMessages : [];

  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  const handleMessageResize = () => {
    scrollToBottom();
  };

  const handleSubmit = async () => {
  if (inputValue.trim() === "") return;

  try {
    const userMessage = inputValue;
    setInputValue("");

    const isNewChat = contextMessages.length === 0;
    
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
    } else {
      startNewChat(userMessage);
      
      await createNewChat(userMessage, {
        updateMessage: (updatedMessage: Message) => {
          if (updatedMessage.sender === "assistant") {
            updateMessage(updatedMessage);
          }
        },
        addChatHistory,
        setSessionId,
        getSessionId: () => null 
      });
    }
    
  } catch (error) {
    console.error("Get error:", error);
    if (contextMessages.length > 0) {
      const updatedMessages = contextMessages.map((msg: Message) =>
        msg.sender === "assistant" && msg.content === ""
          ? { ...msg, content: "Sorry, I can't assist with that." }
          : msg
      );
      setMessages(updatedMessages);
    } else {
      addMessage({
        id: Date.now().toString(),
        sender: "assistant",
        senderName: "McBera",
        content: "Sorry, I can't assist with that.",
      });
    }
  }
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col w-[560px] mx-auto">
      <div
        className="mt-5 flex-1 overflow-y-auto max-h-[500px] hide-scrollbar"
        ref={messagesContainerRef}
      >
        {displayMessages.map((message) => {
          return (
            <div
              key={message.id}
              className={`flex items-start mb-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "user" ? (
                <div className="flex flex-col items-end">
                  <div
                    className={`
                    max-w-[300px] border border-[#DAD9CD] rounded-[10px] bg-opacity-30 bg-[#DAD9CD] px-[5px] py-1 flex items-center gap-2`}
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
        />
        <div
          className="absolute right-3 bottom-3 cursor-pointer"
          onClick={handleSubmit}
        >
          <IconSend />
        </div>
      </div>
    </div>
  );
}
