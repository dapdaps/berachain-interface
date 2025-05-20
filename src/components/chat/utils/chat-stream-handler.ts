import { ChatHistory, Message } from "../context/chat-context";
import { postSSE } from "@/utils/http";
import { handleFunctionOutput } from "./chat-action-output";

export interface ChatCallbacks {
  addMessage?: (message: Message) => void;
  updateMessage?: (message: Message) => void;
  addChatHistory?: (history: ChatHistory) => void;
  setSessionId?: (sessionId: string) => void;
  getSessionId?: () => string | null; 
}

export interface RichMessageContent {
  text: string;
  actions?: Array<{
    type: string;
    label: string;
    params?: any;
  }>;
}

type SSEResponseType = {
  type?: string;
  text?: string;
  function?: string;
  sessionId?: string;
};


export const createChatHistory = (
  localId: string, 
  message: string, 
  assistantContent: string,
  serverSessionId?: string
): ChatHistory => {
  return {
    id: serverSessionId || localId,
    title: message.length > 20 ? `${message.substring(0, 20)}...` : message,
    lastMessage: assistantContent || "No response",
    timestamp: new Date().toISOString(),
    sessionId: serverSessionId
  };
};

export const processSSEStream = async (
  response: Response,
  assistantMessage: Message,
  localId: string,
  userMessage: string,
  callbacks?: ChatCallbacks
): Promise<{
  messages: Message[];
  chatHistory: ChatHistory;
}> => {
  return new Promise((resolve, reject) => {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    let fullResponse = "";
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    const abortController = new AbortController();

    let serverSessionId: string | undefined;

    function processStream(
      result: ReadableStreamReadResult<Uint8Array>
    ): Promise<void> {
      if (result.done) {
        console.log("Data stream closed");

        const chatHistory = createChatHistory(
          localId, 
          userMessage, 
          assistantMessage.content, 
          serverSessionId
        );
        
        if (callbacks?.addChatHistory) {
          callbacks.addChatHistory(chatHistory);
        }
        
        resolve({
          messages: [
            { id: assistantMessage.id, sender: "user", content: userMessage },
            assistantMessage
          ],
          chatHistory,
        });

        return Promise.resolve();
      }

      const chunk = decoder.decode(result.value, { stream: true });
      buffer += chunk;

      const messages = buffer.split("\n\n");
      buffer = messages.pop() || "";

      for (const sseMessage of messages) {
        if (!sseMessage.trim()) continue;

        const lines = sseMessage.split("\n");
        let event = "";
        let data = "";

        for (const line of lines) {
          if (line.startsWith("event:")) {
            event = line.substring(6).trim();
          } else if (line.startsWith("data:")) {
            data = line.substring(5).trim();
          }
        }

        console.log("SSE:", event, "SSE DATA:", data);
        
        handleSSEMessage(
          event, 
          data, 
          fullResponse, 
          assistantMessage, 
          localId, 
          userMessage, 
          callbacks, 
          abortController,
          (updatedResponse) => {
            fullResponse = updatedResponse;
          },
          resolve
        );
      }

      return reader.read().then(processStream);
    }

    reader.read().then(processStream).catch(reject);
  });
};

export const handleSSEMessage = (
  event: string,
  data: string,
  fullResponse: string,
  assistantMessage: Message,
  localId: string,
  userMessage: string,
  callbacks?: ChatCallbacks,
  abortController?: AbortController,
  updateFullResponse?: (response: string) => void,
  resolvePromise?: (result: { messages: Message[]; chatHistory: ChatHistory }) => void,
  serverSessionIdRef?: { current?: string }
): void => {
  if (event === "meta") {
    try {
      const metaData = JSON.parse(data);
      if (metaData.sessionId) {
        console.log("Got sessionId from server:", metaData.sessionId);
        
        if (serverSessionIdRef) {
          serverSessionIdRef.current = metaData.sessionId;
        }
        
        if (callbacks?.setSessionId) {
          callbacks.setSessionId(metaData.sessionId);
        }
      }
    } catch (e) {
      console.error("Failed to parse meta data:", e);
    }
  } else if (event === "completion") {
    handleCompletionEvent(
      data, 
      fullResponse, 
      assistantMessage, 
      localId, 
      userMessage, 
      callbacks, 
      abortController, 
      updateFullResponse, 
      resolvePromise
    );
  } else if (!event && data) {
    handleDataWithoutEvent(
      data, 
      fullResponse, 
      assistantMessage, 
      localId, 
      userMessage, 
      callbacks, 
      abortController, 
      updateFullResponse, 
      resolvePromise
    );
  }
};

const handleCompletionEvent = (
  data: string,
  fullResponse: string,
  assistantMessage: Message,
  localId: string,
  userMessage: string,
  callbacks?: ChatCallbacks,
  abortController?: AbortController,
  updateFullResponse?: (response: string) => void,
  resolvePromise?: (result: { messages: Message[]; chatHistory: ChatHistory }) => void,
  serverSessionId?: string
): void => {
  if (data === "[DONE]") {
    let responseContent = fullResponse.trim();
    if (!responseContent) {
      responseContent = "Sorry, I can't assist with that.";
      assistantMessage.content = responseContent;

      if (callbacks?.updateMessage) {
        callbacks.updateMessage({
          ...assistantMessage,
          content: responseContent,
        });
      }
    }

    const chatHistory = createChatHistory(
      localId, 
      userMessage, 
      assistantMessage.content,
      serverSessionId
    );

    if (callbacks?.addChatHistory) {
      callbacks.addChatHistory(chatHistory);
    }

    if (resolvePromise) {
      resolvePromise({
        messages: [
          { id: assistantMessage.id, sender: "user", content: userMessage },
          assistantMessage
        ],
        chatHistory,
      });
    }

    if (abortController) {
      abortController.abort();
    }
  } else {
    try {
      const jsonData: SSEResponseType = typeof data === "string" ? JSON.parse(data) : data;
      
      if (jsonData.type === "Chunk" && jsonData.text) {
        const updatedResponse = fullResponse + jsonData.text;
        
        if (updateFullResponse) {
          updateFullResponse(updatedResponse);
        }
        
        assistantMessage.content = updatedResponse;

        if (callbacks?.updateMessage) {
          callbacks.updateMessage({
            ...assistantMessage,
            content: updatedResponse,
          });
        }
      } else if (jsonData.type === "Action" && jsonData.function) {
        console.log("Action --- model jsonData:", jsonData);

        handleFunctionOutput(jsonData.function, jsonData.text || "");
        
        if (jsonData.function === "swap") {
          const messageText = fullResponse + "\n\nI can help you swap tokens. Would you like to proceed?";
          
          const richContent: RichMessageContent = {
            text: messageText,
            actions: [{
              type: "swap",
              label: "Open Swap Interface",
              params: {} 
            }]
          };

          console.log("Creating rich content for message:", richContent);
          
          const updatedMessage: Message = {
            ...assistantMessage,
            content: messageText,
            richContent: richContent
          };
          
          assistantMessage.content = messageText;
          assistantMessage.richContent = richContent;
          
          if (updateFullResponse) {
            updateFullResponse(messageText);
          }
          
          if (callbacks?.updateMessage) {
            callbacks.updateMessage(updatedMessage);
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse SSE data:", e, data);
    }
  }
};

const handleDataWithoutEvent = (
  data: string,
  fullResponse: string,
  assistantMessage: Message,
  localId: string,
  userMessage: string,
  callbacks?: ChatCallbacks,
  abortController?: AbortController,
  updateFullResponse?: (response: string) => void,
  resolvePromise?: (result: { messages: Message[]; chatHistory: ChatHistory }) => void
): void => {
  if (data === "[DONE]") {
    const chatHistory = createChatHistory(localId, userMessage, assistantMessage.content);

    if (callbacks?.addChatHistory) {
      callbacks.addChatHistory(chatHistory);
    }

    if (resolvePromise) {
      resolvePromise({
        messages: [
          { id: assistantMessage.id, sender: "user", content: userMessage },
          assistantMessage
        ],
        chatHistory,
      });
    }

    if (abortController) {
      abortController.abort();
    }
  } else {
    try {
      let jsonData: SSEResponseType;
      try {
        jsonData = JSON.parse(data);
      } catch {
        jsonData = { type: "Chunk", text: data };
      }

      if (jsonData.type === "Chunk" && jsonData.text) {
        const updatedResponse = fullResponse + jsonData.text;
        
        if (updateFullResponse) {
          updateFullResponse(updatedResponse);
        }
        
        assistantMessage.content = updatedResponse;

        if (callbacks?.updateMessage) {
          callbacks.updateMessage({
            ...assistantMessage,
            content: updatedResponse,
          });
        }
      }
    } catch (e) {
      const updatedResponse = fullResponse + `${data} `;
      
      if (updateFullResponse) {
        updateFullResponse(updatedResponse);
      }
      
      assistantMessage.content = updatedResponse;

      if (callbacks?.updateMessage) {
        callbacks.updateMessage({
          ...assistantMessage,
          content: updatedResponse,
        });
      }
    }
  }
};

export const sendChatSSERequest = async (
  message: string,
  sessionId: string
): Promise<Response> => {
  let url = `/api/go/chat/conversation?msg=${encodeURIComponent(message)}`;
  const data: Record<string, string> = {
    msg: encodeURIComponent(message),
  };

  if (sessionId) {
    url += `&sessionId=${sessionId}`;
    data.sessionId = sessionId;
  }

  return postSSE(url, data);
};


