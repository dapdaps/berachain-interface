import { Message } from "../context/chat-context";
import { handleSwapOutput } from "../handler/swap";
import { ChatCallbacks } from "./chat-stream-handler";
import { handleVaultsOutput } from "@/components/chat/handler/vaults";

export const handleFunctionOutput = (
  functionType: string,
  content: string,
  assistantMessage: Message,
  callbacks?: ChatCallbacks
): void => {
  if (!content) {
    console.error("Function output content is empty");
    return;
  }

  let parsedContent;

  try {
    parsedContent = typeof content === "string" ? JSON.parse(content) : content;
    console.log("Function output:", parsedContent);
  } catch (e) {
    console.error("Failed to parse function output content:", e);
    return;
  }

  switch (functionType) {
    case "swap":
      handleSwapOutput(parsedContent, assistantMessage, callbacks);
      break;
    case "getHotTokens":
      break;
    case "getInterestVaults":
      break;
    case "getVaultsPositions":
      break;
    case "getWalletAssets":
      break;
    case "filterVaults":
      handleVaultsOutput(parsedContent, assistantMessage, callbacks);
      break;
  }
};
