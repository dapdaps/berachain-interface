import React, { createContext, useState, useContext, ReactNode } from 'react';
import { createNewChat } from '../utils/chat-service';
import { RichMessageContent } from "../utils/chat-stream-handler";
import { useVaults, Vaults } from '@/components/chat/hooks/useVaults';
import { List } from '@/sections/vaults/v2/hooks/list';

type ChatMode = 'initial' | 'chat';

export interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  senderName?: string;
  richContent?: RichMessageContent; // 添加富文本内容字段
}

export type ChatHistory = {
  id?: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  sessionId?: string; 
};

interface ChatContextType {
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  chatHistories: ChatHistory[];
  setChatHistories: (histories: ChatHistory[]) => void;
  startNewChat: (userMessage: string) => void;
  addMessage: (message: Message) => void;
  addChatHistory: (history: ChatHistory) => void;
  updateMessages: (messages: Message[]) => void;
  updateMessage: (updatedMessage: Message) => void; 
  sendChatMessage: (message: string) => Promise<void>;
  vaults: Vaults;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode; vaultsList: List; }> = ({ children, vaultsList }) => {
  const [chatMode, setChatMode] = useState<ChatMode>('initial');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const vaults = useVaults({ vaultsList });

  const startNewChat = (userMessage: string) => {
    const userMessageObj: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: userMessage,
    };
    
    const assistantMessageObj: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      senderName: 'McBera',
      content: '',
    };
    
    setMessages([userMessageObj, assistantMessageObj]);
    
    setChatMode('chat');
    
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    
    return { userMessageObj, chatId: newChatId };
  };
  
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };
  
  const addChatHistory = (history: ChatHistory) => {
    // 如果有sessionId，确保添加到历史记录中
    if (sessionId) {
      history.sessionId = sessionId;
    }
    setChatHistories(prev => [history, ...prev]);
  };
  
  const updateMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    setChatMode('chat');
  };

  const updateMessage = (updatedMessage: Message) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === updatedMessage.id ? 
        { 
          ...msg, 
          content: updatedMessage.content,
          richContent: updatedMessage.richContent 
        } : msg
      )
    );
  };

  const sendChatMessage = async (message: string) => {
    try {
      setSessionId(null);
      startNewChat(message);
      
      await createNewChat(message, {
        updateMessage: (updatedMessage: Message) => {
          if (updatedMessage.sender === "assistant") {
            updateMessage(updatedMessage);
          }
        },
        addChatHistory,
        setSessionId,
        getSessionId: () => null, 
      });
    } catch (error) {
      console.error("Chat error:", error);
      addMessage({
        id: Date.now().toString(),
        sender: "assistant",
        senderName: "McBera",
        content: "Sorry, I can't assist with that."
      });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chatMode,
        setChatMode,
        currentChatId,
        setCurrentChatId,
        sessionId,
        setSessionId,
        messages,
        setMessages,
        chatHistories,
        setChatHistories,
        startNewChat,
        addMessage,
        addChatHistory,
        updateMessages,
        updateMessage,
        sendChatMessage,
        vaults
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