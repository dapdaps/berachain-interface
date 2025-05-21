import { Message } from "../context/chat-context";
import { handleSwapOutput } from "../handler/swap";
import { ChatCallbacks } from "./chat-stream-handler";

export const handleFunctionOutput = (
  functionType: string,
  content: string,
  assistantMessage: Message,
  updateFullResponse?: (response: string) => void,
  callbacks?: ChatCallbacks
): void => {
  const parsedContent =
    typeof content === "string" ? JSON.parse(content) : content;

  console.log("Function output:", parsedContent);

  switch (functionType) {
    case "swap":
      handleSwapOutput(parsedContent, assistantMessage, updateFullResponse, callbacks);
      break;
    case "getHotTokens":
      break;
    case "getInterestVaults":
      break;
    case "getVaultsPositions":
      break;
    case "getWalletAssets":
      break;
  }
};