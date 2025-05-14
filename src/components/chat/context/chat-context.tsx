import React, { createContext, useState, useContext, ReactNode } from 'react';

type ChatMode = 'initial' | 'chat';

export type Message = {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  senderName?: string;
};

export type ChatHistory = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
};

interface ChatContextType {
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  chatHistories: ChatHistory[];
  setChatHistories: (histories: ChatHistory[]) => void;
  startNewChat: (userMessage: string) => void;
  addMessage: (message: Message) => void;
  addChatHistory: (history: ChatHistory) => void;
  updateMessages: (messages: Message[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatMode, setChatMode] = useState<ChatMode>('initial');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);

  // 开始新聊天 - 只负责状态更新
  const startNewChat = (userMessage: string) => {
    const userMessageObj: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: userMessage,
    };
    
    setMessages([userMessageObj]);
    setChatMode('chat');
    // 实际的聊天ID应该由API创建返回，这里临时使用时间戳
    setCurrentChatId(Date.now().toString());
  };
  
  // 添加消息
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };
  
  // 添加聊天历史
  const addChatHistory = (history: ChatHistory) => {
    setChatHistories(prev => [history, ...prev]);
  };
  
  // 更新消息列表（用于加载历史记录）
  const updateMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    setChatMode('chat');
  };

  return (
    <ChatContext.Provider
      value={{
        chatMode,
        setChatMode,
        currentChatId,
        setCurrentChatId,
        messages,
        setMessages,
        chatHistories,
        setChatHistories,
        startNewChat,
        addMessage,
        addChatHistory,
        updateMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};