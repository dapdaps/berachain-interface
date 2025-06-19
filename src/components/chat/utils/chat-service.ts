import { deleteRequest, get, post } from "@/utils/http";
import { Message, ChatHistory } from "../context/chat-context";
import { 
  ChatCallbacks, 
  processSSEStream, 
  sendChatSSERequest 
} from "./chat-stream-handler";
import { handleFunctionOutput } from "./chat-action-output";


export const createChatMessages = (message: string): { 
  userMessage: Message, 
  assistantMessage: Message 
} => {
  const userMessage: Message = {
    id: Date.now().toString(),
    sender: "user",
    content: message,
  };

  const assistantMessage: Message = {
    id: (Date.now() + 1).toString(),
    sender: "assistant",
    senderName: "McBera",
    content: "",
  };

  return { userMessage, assistantMessage };
};

export const createNewChat = async (
  message: string,
  assistantMessage: Message, 
  contextCallbacks?: ChatCallbacks
): Promise<{
  messages: Message[];
}> => {
  try {
    const existingSessionId = contextCallbacks?.getSessionId?.();
    const sessionIdToUse = existingSessionId || "";
    
    const response = await sendChatSSERequest(message, sessionIdToUse);
    
    return processSSEStream(
      response,
      assistantMessage,
      message,
      contextCallbacks
    ).catch((error) => {
      console.error("Processing stream error:", error);
      throw error;
    });
  } catch (error) {
    console.error("Create New Chat Failed:", error);
    throw error;
  }
};

interface ChatMessageResponse {
  address: string;
  session_id: string;
  message: string;
  reply: string;
  action: string;
  extra?: string; 
  timestamp: number;
  id: number;
  like_status: number;
}

export const fetchChatHistory = async (address: string, sessionId: string): Promise<Message[]> => {
  try {
    const response = await get(`/api/go/chat/conversation/message?address=${address}&sessionId=${sessionId}`);
    const historyMessages: Message[] = [];
    
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((item: ChatMessageResponse, index: number) => {
        if (item.message && item.message.trim() !== "") {
          historyMessages.push({
            id: `user-${Date.now()}-${index}`,
            sender: "user",
            content: decodeURIComponent(item.message),
          });
        }
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}-${index}`,
          sender: "assistant",
          senderName: "McBera",
          content: item.reply || "",
          isFromHistory: true,
          backendId: item.id,
          like_status: item.like_status,
        };
        
        const historyCallbacks: ChatCallbacks = {
          updateMessage: (updatedMessage: Message) => {
            assistantMessage.content = updatedMessage.content;
            assistantMessage.richContent = updatedMessage.richContent;
            assistantMessage.skipTyping = updatedMessage.skipTyping;
            assistantMessage.component = updatedMessage.component;
          }
        };
        
        if (item.action) {
          const functionType = item.action;
          const functionContent = item.reply || "";
          const extra = item.extra;
          
          try {
            handleFunctionOutput(
              functionType, 
              functionContent, 
              assistantMessage,
              historyCallbacks,
              extra
            );
          } catch (e) {
            console.error("Failed to parse function output in history:", e);
            if (item.reply === "") {
              assistantMessage.content = "Sorry, no results found. Please try asking a different question.";
            }
          }
        } 
        else if (item.reply === "") {
          assistantMessage.content = "Sorry, no results found. Please try asking a different question.";
        }
        
        historyMessages.push(assistantMessage);
      });
    }

    return historyMessages;
  } catch (error) {
    console.error("Get History:", error);
    throw error;
  }
};

export const fetchChatHistoryList = async (address: any): Promise<{ code: number; data: ChatHistory[] }> => {
  try {
    return await get(`/api/go/chat/conversation/list?address=${address}`);
  } catch (error) {
    console.error("Get Chat History List:", error);
    throw error;
  }
};


export const editChatHistoryItemName = async (sessionId: string, title: string): Promise<{ code: number; data: string }> => {
  try {
    const encodedTitle = title.includes('%') ? title : encodeURIComponent(title);
    const response = await post(`/api/go/chat/conversation/title`, { sessionId, title: encodedTitle });
    return response.data;
  } catch (error) {
    console.error("Edit Chat History Item Name:", error);
    throw error;
  }
};

export const deleteChatHistoryItem = async (sessionId: string): Promise<{ code: number; data: string }> => {
  try {
    const response = await deleteRequest(`/api/go/chat/conversation?sessionId=${sessionId}`, { sessionId });
    return response.data;
  } catch (error) {
    console.error("Delete Chat History Item:", error);
    throw error;
  }
};

export const postAddMessageItem = async (reply: string, sessionId: string) => {
  try {
    const response = await post(`/api/go/chat/message/add`, { reply, sessionId });
    return response.data;
  } catch (error) {
    console.error("Add Message Item:", error);
    throw error;
  }
}