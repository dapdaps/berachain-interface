import { useAccount } from "wagmi";
import useUser from "@/hooks/use-user";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import LazyImage from "../../layz-image";
import IconSend from "@public/images/chat/send.svg";
import { useChatContext } from "../context/chat-context";
import { createNewChat } from "../services/chat-service";
import TypingMarkdown from "./TypingMarkdown";

type MessageType = {
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
  const { messages: contextMessages, addMessage, addChatHistory } = useChatContext();
  
  const [localMessages] = useState<MessageType[]>([
    {
      id: "1",
      sender: "user",
      content: "How to get infrared points?",
    },
    {
      id: "2",
      sender: "assistant",
      senderName: "McBera",
      content:
        "Infrared rewards you for actions that contribute to the protocol. Points are calculated and updated automatically based on your onchain activity. You can earn points by:\n\n**Staking IBGT**\nEarn points continuously while your IBGT is staked. The longer it stays staked, the more you earn.",
    },
  ]);

  const displayMessages = contextMessages.length > 0 ? contextMessages : localMessages;
  
  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 当消息列表变化时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  // 处理打字内容大小变化时的滚动
  const handleMessageResize = () => {
    scrollToBottom();
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === "") return;

    const newUserMessage: MessageType = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
    };

    addMessage(newUserMessage);
    setInputValue("");

    try {
      const { messages, chatHistory } = await createNewChat(inputValue);
      
      if (messages.length > 1) {
        addMessage(messages[1]);
      }
      
      addChatHistory(chatHistory);
    } catch (error) {
      console.error("获取回复失败:", error);
      
      const defaultResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        senderName: "McBera",
        content: "抱歉，我无法处理您的请求。请稍后再试。",
      };
      addMessage(defaultResponse);
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
            <div className="mt-5 flex-1 overflow-y-auto max-h-[500px] hide-scrollbar" ref={messagesContainerRef}>
        {displayMessages.map((message) => (
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
                  <div className="font-Montserrat text-black/50 text-[14px] leading-[14px] font-[500]">{message.content}</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start">
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
                <div className="text-black text-sm leading-tight font-medium font-Montserrat">
                  <TypingMarkdown 
                    content={message.content} 
                    options={{ 
                      interval: 30,
                      step: [1, 3],
                      initialIndex: 0
                    }} 
                    onResize={handleMessageResize}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
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
          <div className="absolute right-3 bottom-3 cursor-pointer" onClick={handleSubmit}>
            <IconSend />
          </div>
        </div>
    </div>
  );
}