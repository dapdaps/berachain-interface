import React, { createContext, useState, useContext, ReactNode } from 'react';
import { createNewChat, fetchChatHistoryList } from '../utils/chat-service';
import { RichMessageContent } from "../utils/chat-stream-handler";
import { useVaults, Vaults } from '@/components/chat/hooks/useVaults';
import { List } from '@/sections/vaults/v2/hooks/list';
import { useAccount } from 'wagmi';

type ChatMode = 'initial' | 'chat';

export interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  senderName?: string;
  richContent?: RichMessageContent; // 添加富文本内容字段
  component?: any;
  skipTyping?: boolean;
  isFromHistory?: boolean;
  backendId?: number;
  like_status?: number;
}

export type ChatHistory = {
  timestamp: number; 
  address: string;
  session_id: string;
  title: string;
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
  addChatHistory: (history?: ChatHistory) => void;
  updateMessages: (messages: Message[]) => void;
  updateMessage: (updatedMessage: Message) => void; 
  sendChatMessage: (message: string) => Promise<void>;
  vaults: Vaults;
  isFromHistory: boolean;
  setIsFromHistory: (isFromHistory: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  resetChatState: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode; vaultsList: List; }> = ({ children, vaultsList }) => {
  const [chatMode, setChatMode] = useState<ChatMode>('initial');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const vaults = useVaults({ vaultsList });
  const [isFromHistory, setIsFromHistory] = useState<boolean>(false);
  const { address } = useAccount();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
  

const resetChatState = () => {
    setChatMode('initial');
    setMessages([]);
    setIsFromHistory(false);
    setSessionId(null);
    setChatHistories([]);
    if (vaults.resetRecommendList) {
      vaults.resetRecommendList();
    }
  };

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
  
  // 返回 assistantMessageObj
  return { userMessageObj, assistantMessageObj, chatId: newChatId };
};
  
  const addMessage = (message: Message) => {

    console.log("Adding message:", message);
    console.log("messages:", messages);

    setMessages(prev => [...prev, message]);
  };
  
  const addChatHistory = () => {
      fetchChatHistoryList(address)
        .then(response => {
          if (response && response.data && response.data.length > 0) {
            const sortedHistories = [...response.data].sort((a, b) => {
              return b.timestamp - a.timestamp;
            });
            setChatHistories(sortedHistories);
          }
        })
        .catch(error => {
          console.error("Silent history refresh failed:", error);
        });
  };
  
  const updateMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    setChatMode('chat');
  };

  const updateMessage = (updatedMessage: Message) => {
    setMessages(prevMessages => {
      return prevMessages.map((msg) => {
        if (msg.id === updatedMessage.id) {
          const _newObj = {
            ...msg, 
            content: updatedMessage.content,
            richContent: updatedMessage.richContent,
            component: updatedMessage.component,
            skipTyping: updatedMessage.skipTyping,
          };
          if (typeof updatedMessage.backendId !== "undefined") {
            _newObj.backendId = updatedMessage.backendId;
          }
          if (typeof updatedMessage.like_status !== "undefined") {
            _newObj.like_status = updatedMessage.like_status;
          }
          return _newObj;
        }
        return msg;
      });
    });
  };

  const sendChatMessage = async (message: string) => {
    try {
      setIsProcessing(true);
      setSessionId(null);
      const { assistantMessageObj } = startNewChat(message);
      
      await createNewChat(
        message,
        assistantMessageObj, 
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
            console.log("Chat completed");
            setIsProcessing(false);
          }
        }
      );
    } catch (error) {
      console.error("Chat error:", error);
      setIsProcessing(false);
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
        isFromHistory,
        setIsFromHistory,
        vaults,
        isProcessing,
        setIsProcessing,
        resetChatState
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