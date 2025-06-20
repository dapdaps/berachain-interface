import { ChatHistory, Message } from "../context/chat-context";
import { postSSE } from "@/utils/http";
import { handleFunctionOutput } from "./chat-action-output";

export interface ChatCallbacks {
  addMessage?: (message: Message) => void;
  updateMessage?: (message: Message) => void;
  addChatHistory?: (history?: ChatHistory) => void;
  setSessionId?: (sessionId: string) => void;
  getSessionId?: () => string | null;
  onComplete?: () => void;
  onError?: () => void;
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
  extra?: string;
};

const errorMessage =
  "Sorry, no results found. Please try asking a different question.";

export const createChatHistory = (
  localId: string,
  message: string,
  assistantContent: string,
  serverSessionId?: string
): ChatHistory => {
  return {
    session_id: serverSessionId || localId,
    title: message.length > 20 ? `${message.substring(0, 20)}...` : message,
    address: "",
    timestamp: Math.floor(Date.now() / 1000)
  };
};

export const processSSEStream = async (
  response: Response,
  assistantMessage: Message,
  userMessage: string,
  callbacks?: ChatCallbacks
): Promise<{
  messages: Message[];
}> => {
  return new Promise((resolve, reject) => {
    if (!response.ok) {
      if (callbacks?.onError) {
        callbacks.onError();
      }
      throw new Error(`HTTP Error: ${response.status}`);
    }

    if (!response.body) {
      if (callbacks?.onError) {
        callbacks.onError();
      }
      throw new Error("Response body is null");
    }

    let fullResponse = "";
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    const abortController = new AbortController();

    function processStream(
      result: ReadableStreamReadResult<Uint8Array>
    ): Promise<void> {
      if (result.done) {
        console.log("Data stream closed");

        if (callbacks?.addChatHistory) {
          callbacks.addChatHistory();
        }

        resolve({
          messages: [
            { id: assistantMessage.id, sender: "user", content: userMessage },
            assistantMessage
          ]
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

        const updatedFullResponse = handleSSEMessage(
          event,
          data,
          fullResponse,
          assistantMessage,
          userMessage,
          callbacks,
          abortController,
          resolve
        );

        if (updatedFullResponse !== undefined) {
          fullResponse = updatedFullResponse;
        }
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
  userMessage: string,
  callbacks?: ChatCallbacks,
  abortController?: AbortController,
  resolvePromise?: (result: { messages: Message[] }) => void,
  serverSessionIdRef?: { current?: string }
) => {
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

        callbacks?.updateMessage?.({
          ...assistantMessage,
          backendId: metaData.message_id,
          like_status: 0
        });
      }
    } catch (e) {
      console.error("Failed to parse meta data:", e);
    }
    return fullResponse;
  } else if (event === "completion") {
    return handleCompletionEvent(
      data,
      fullResponse,
      assistantMessage,
      userMessage,
      callbacks,
      abortController,
      resolvePromise
    );
  } else if (event === "error") {
    return handleErrorEvent(assistantMessage, callbacks);
  } else if (!event && data) {
    return handleDataWithoutEvent(
      data,
      fullResponse,
      assistantMessage,
      userMessage,
      callbacks,
      abortController,
      resolvePromise
    );
  }
  return fullResponse;
};

const handleErrorEvent = (
  assistantMessage: Message,
  callbacks?: ChatCallbacks
) => {
  assistantMessage.content = errorMessage;

  if (callbacks?.updateMessage) {
    callbacks.updateMessage({
      ...assistantMessage,
      content: errorMessage
    });
  }
};

const handleCompletionEvent = (
  data: string,
  fullResponse: string,
  assistantMessage: Message,
  userMessage: string,
  callbacks?: ChatCallbacks,
  abortController?: AbortController,
  resolvePromise?: (result: { messages: Message[] }) => void
): string => {
  if (data === "[DONE]") {
    let responseContent = fullResponse.trim();
    if (!responseContent) {
      responseContent = "Sorry, I can't assist with that.";
      assistantMessage.content = responseContent;

      if (callbacks?.updateMessage) {
        callbacks.updateMessage({
          ...assistantMessage,
          content: responseContent
        });
      }
    }
    console.log("Final callbacks:", callbacks);

    if (callbacks?.onComplete) {
      callbacks.onComplete();
    }

    if (callbacks?.addChatHistory) {
      callbacks.addChatHistory();
    }

    if (resolvePromise) {
      resolvePromise({
        messages: [
          { id: assistantMessage.id, sender: "user", content: userMessage },
          assistantMessage
        ]
      });
    }

    if (abortController) {
      abortController.abort();
    }
    return fullResponse;
  } else {
    try {
      const jsonData: SSEResponseType =
        typeof data === "string" ? JSON.parse(data) : data;

      if (jsonData.type === "Chunk" && jsonData.text) {
        const updatedResponse = fullResponse + jsonData.text;

        assistantMessage.content = updatedResponse;

        if (callbacks?.updateMessage) {
          callbacks.updateMessage({
            ...assistantMessage,
            content: updatedResponse
          });
        }

        return updatedResponse;
      } else if (jsonData.type === "Action" && jsonData.function) {
        console.log("Action --- model jsonData:", jsonData);
        if (
          jsonData.text === "" &&
          [
            "getVaultsPositions",
            "getWalletAssets",
            "getInterestVaults",
            "bridge",
            "lend"
          ].includes(jsonData.function)
        ) {
          handleFunctionOutput(
            jsonData.function,
            jsonData.text || "",
            assistantMessage,
            callbacks,
            jsonData.extra
          );
        } else if (jsonData.text === "") {
          assistantMessage.content = errorMessage;

          if (callbacks?.updateMessage) {
            callbacks.updateMessage({
              ...assistantMessage,
              content: errorMessage
            });
          }
        } else {
          handleFunctionOutput(
            jsonData.function,
            jsonData.text || "",
            assistantMessage,
            callbacks
          );
        }
      }
    } catch (e) {
      console.error("Failed to parse SSE data:", e, data);
      if (callbacks?.onError) {
        callbacks.onError();
      }
    }
    return fullResponse;
  }
};

const handleDataWithoutEvent = (
  data: string,
  fullResponse: string,
  assistantMessage: Message,
  userMessage: string,
  callbacks?: ChatCallbacks,
  abortController?: AbortController,
  resolvePromise?: (result: { messages: Message[] }) => void
) => {
  if (data === "[DONE]") {
    if (callbacks?.addChatHistory) {
      callbacks.addChatHistory();
    }

    if (callbacks?.onComplete) {
      callbacks.onComplete();
    }

    if (resolvePromise) {
      resolvePromise({
        messages: [
          { id: assistantMessage.id, sender: "user", content: userMessage },
          assistantMessage
        ]
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

        assistantMessage.content = updatedResponse;

        if (callbacks?.updateMessage) {
          callbacks.updateMessage({
            ...assistantMessage,
            content: updatedResponse
          });
        }
      }
    } catch (e) {
      const updatedResponse = fullResponse + `${data} `;

      assistantMessage.content = updatedResponse;

      if (callbacks?.updateMessage) {
        callbacks.updateMessage({
          ...assistantMessage,
          content: updatedResponse
        });
      }
    }
  }
};

export const sendChatSSERequest = async (
  message: string,
  sessionId: string
): Promise<Response> => {
  let url = `/api/go/chat/conversation`;
  const data: Record<string, string> = {
    msg: message
  };

  if (sessionId) {
    data.sessionId = sessionId;
  }

  return postSSE(url, data);
};
