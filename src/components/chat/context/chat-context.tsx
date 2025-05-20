import React, { createContext, useState, useContext, ReactNode } from 'react';
import { createNewChat } from '../utils/chat-service';

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
  updateMessage: (updatedMessage: Message) => void; 
  sendChatMessage: (message: string) => Promise<void>; 
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatMode, setChatMode] = useState<ChatMode>('initial');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);

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
    setChatHistories(prev => [history, ...prev]);
  };
  
  const updateMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    setChatMode('chat');
  };

  const updateMessage = (updatedMessage: Message) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === updatedMessage.id ? { ...msg, content: updatedMessage.content } : msg
      )
    );
  };

  const sendChatMessage = async (message: string) => {
    try {
      startNewChat(message);
      
      await createNewChat(message, {
        updateMessage: (updatedMessage: Message) => {
          if (updatedMessage.sender === "assistant") {
            updateMessage(updatedMessage);
          }
        },
        addChatHistory,
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
        messages,
        setMessages,
        chatHistories,
        setChatHistories,
        startNewChat,
        addMessage,
        addChatHistory,
        updateMessages,
        updateMessage,
        sendChatMessage
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