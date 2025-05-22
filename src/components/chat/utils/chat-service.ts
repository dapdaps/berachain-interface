import { get } from "@/utils/http";
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
  contextCallbacks?: ChatCallbacks
): Promise<{
  messages: Message[];
  chatHistory: ChatHistory;
}> => {
  try {
    const { assistantMessage } = createChatMessages(message);
    
    const existingSessionId = contextCallbacks?.getSessionId?.();
    const sessionIdToUse = existingSessionId || "";
    
    const response = await sendChatSSERequest(message, sessionIdToUse);
    
    const tempLocalId = Date.now().toString();
    
    return processSSEStream(
      response,
      assistantMessage,
      tempLocalId, 
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
  timestamp: number;
}

export const fetchChatHistory = async (address: string, sessionId: string): Promise<Message[]> => {
  try {

    const response = await get(`/api/go/chat/conversation/message?address=${address}&sessionId=${sessionId}`);

    const historyMessages: Message[] = [];
    
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((item: ChatMessageResponse, index: number) => {
        historyMessages.push({
          id: `user-${Date.now()}-${index}`,
          sender: "user",
          content: item.message ? decodeURIComponent(item.message) : "",
        });
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}-${index}`,
          sender: "assistant",
          senderName: "McBera",
          content: item.reply || "",
        };
        
        if (item.action && item.reply) {
          try {
            const functionOutput = item.action;
            const functionContent = item.reply;
            
            const historyCallbacks: ChatCallbacks = {
              updateMessage: (updatedMessage: Message) => {
                assistantMessage.content = updatedMessage.content;
                assistantMessage.richContent = updatedMessage.richContent;
                assistantMessage.skipTyping = updatedMessage.skipTyping;
                assistantMessage.component = updatedMessage.component;
              }
            };
            
            handleFunctionOutput(
              functionOutput, 
              functionContent, 
              assistantMessage,
              historyCallbacks
            );
          } catch (e) {
            console.error("Failed to parse function output in history:", e);
          }
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