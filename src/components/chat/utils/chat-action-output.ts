import { Message } from "../context/chat-context";
import { handleHotTokensOutput } from "../handler/hot-tokens";
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
      handleHotTokensOutput(parsedContent, assistantMessage, callbacks);
      break;
    case "getInterestVaults":
      break;
    case "getVaultsPositions":
      handleVaultsOutput(functionType, parsedContent, assistantMessage, callbacks);
      break;
    case "getWalletAssets":
      break;
    case "filterVaults":
      handleVaultsOutput(functionType, parsedContent, assistantMessage, callbacks);
      break;
    case "getVaultsReward":
      handleVaultsOutput(functionType, parsedContent, assistantMessage, callbacks);
      break;
  }
};
