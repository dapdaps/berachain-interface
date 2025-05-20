import { Message, ChatHistory } from "../context/chat-context";
import { 
  ChatCallbacks, 
  processSSEStream, 
  sendChatSSERequest 
} from "./chat-stream-handler";


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

export const fetchChatHistory = async (chatId: string): Promise<Message[]> => {
  try {
    console.log(`Get Chat history ${chatId}`);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const historyMessages: Message[] = [
      {
        id: "1",
        sender: "user",
        content: `This is id ${chatId} message from user.`,
      },
      {
        id: "2",
        sender: "assistant",
        senderName: "McBera",
        content: "This is a simulated response from the assistant.",
      },
    ];

    return historyMessages;
  } catch (error) {
    console.error("Get History:", error);
    throw error;
  }
};

export const fetchChatHistoryList = async (): Promise<ChatHistory[]> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const histories: ChatHistory[] = [
      {
        id: "1",
        title: "How to use DapDap",
        lastMessage: "Connect...",
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Berachain title",
        lastMessage: "Berachain is focused on DeFi...",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 昨天
      },
    ];

    return histories;
  } catch (error) {
    console.error("Get History:", error);
    throw error;
  }
};