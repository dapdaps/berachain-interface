import { Message } from "../context/chat-context";
import { handleHotTokensOutput } from "../handler/hot-tokens";
import { handleSwapOutput } from "../handler/swap";
import { ChatCallbacks } from "./chat-stream-handler";
import { handleVaultsOutput } from "@/components/chat/handler/vaults";
import VaultsCard from '@/components/chat/McBera/VaultsCard';

export const handleFunctionOutput = (
  functionType: string,
  content: string,
  assistantMessage: Message,
  callbacks?: ChatCallbacks,
  extra?: string
): void => {
  if (content === "" && ["getVaultsPositions", "getWalletAssets", "getInterestVaults"].includes(functionType)) {
    let parsedExtra = undefined;
    
    if (extra) {
      try {
        parsedExtra = JSON.parse(extra);
        console.log("Parsed Extra data:", parsedExtra);
      } catch (e) {
        console.error("Failed to parse extra data:", e);
      }
    }
    
    handleSpecialEmptyResponse(functionType, parsedExtra, assistantMessage, callbacks);
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
      handleVaultsOutput(functionType, parsedContent, assistantMessage, callbacks);
      break;
    case "getVaultsPositions":
      handleVaultsOutput(functionType, parsedContent, assistantMessage, callbacks);
      break;
    case "getWalletAssets":
      handleVaultsOutput(functionType, parsedContent, assistantMessage, callbacks);
      break;
    case "filterVaults":
      handleVaultsOutput(functionType, parsedContent, assistantMessage, callbacks);
      break;
    case "getVaultsReward":
      handleVaultsOutput(functionType, parsedContent, assistantMessage, callbacks);
      break;
  }
};

const handleSpecialEmptyResponse = (
  functionType: string,
  extraData: any,
  assistantMessage: Message,
  callbacks?: ChatCallbacks
): void => {
  let messageText = "";
  let component = null;

  const parseFallbackSuggestion = (suggestion: any) => {
    try {
      return typeof suggestion === 'string' 
        ? JSON.parse(suggestion) 
        : suggestion;
    } catch (e) {
      console.error("Failed to parse fallback_suggestion:", e);
      return null;
    }
  };

  switch (functionType) {
    case "getVaultsPositions": 
      messageText = "No positions found. Create or deposit into a vault to get started:";
      if (extraData.fallback_suggestion) {
        const parsedSuggestion = parseFallbackSuggestion(extraData.fallback_suggestion);
        if (parsedSuggestion) {
          component = (
            <VaultsCard parsedContent={parsedSuggestion} isFallbackSuggestion={true} />
          );
        }
      }
      break;
    case "getWalletAssets":
      messageText = "No assets found. Try bridging some assets to get started: [Bridge Bera](/bridge/lifi?fromToken=eth&toToken=bera)";
      break;
    case "getInterestVaults":
      messageText = "No top vaults found. More vaults you might be interested in:";
      if (extraData.fallback_suggestion) {
        const parsedSuggestion = parseFallbackSuggestion(extraData.fallback_suggestion);
        if (parsedSuggestion) {
          component = (
            <VaultsCard parsedContent={parsedSuggestion} isFallbackSuggestion={true} />
          );
        }
      }
      break;
  }

  const richContent = {
    text: messageText,
    actions: [],
  };

  const updatedMessage = {
    ...assistantMessage,
    content: messageText,
    richContent,
    component,
  };

  if (callbacks?.updateMessage) {
    callbacks.updateMessage(updatedMessage);
  }
};