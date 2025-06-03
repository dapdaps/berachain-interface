import { Message } from "../context/chat-context";
import useSwapStore from "../stores/useSwapStores";
import {
  ChatCallbacks,
  RichMessageContent,
} from "../utils/chat-stream-handler";
import VaultsCard from '@/components/chat/McBera/VaultsCard';
import Big from 'big.js';
import { numberFormatter } from '@/utils/number-formatter';
import InvestCard from '@/components/chat/McBera/InvestCard';
import VaultsClaimCard from '@/components/chat/McBera/VaultsClaimCard';
import WalletAssetsCard from '@/components/chat/McBera/WalletAssetsCard';

export const handleVaultsOutput = (
  functionType: string,
  parsedContent: any,
  assistantMessage: Message,
  callbacks?: ChatCallbacks,
  isFallbackSuggestion: boolean = false
): void => {
  const isGetVaultsPositions = functionType === "getVaultsPositions";
  const isGetVaultsReward = functionType === "getVaultsReward";
  const isGetWalletAssets = functionType === "getWalletAssets";
  const isGetInterestVaults = functionType === "getInterestVaults";

  let messageText = `Based on your interest in this token, here are some top-performing vaults you might want to explore:`;
  let component = (
    <VaultsCard parsedContent={parsedContent} isFallbackSuggestion={isFallbackSuggestion} />
  );

  if (isGetVaultsPositions) {
    const hasPositions = parsedContent?.some((item: any) => item.user_stake);
    
    if (hasPositions) {
      const totalStakedUsd = parsedContent?.reduce((prev: any, curr: any) => Big(prev).plus(curr.user_stake?.usd || 0), Big(0));
      messageText = `Your total investing is **${numberFormatter(totalStakedUsd, 2, true, { prefix: "$", isZeroPrecision: true })}**\n\nHere's the distribution of invest:`;
      component = (
        <InvestCard type="vaults" parsedContent={parsedContent} />
      );
    } else if (isFallbackSuggestion) {
      messageText = "No positions found. Create or deposit into a vault to get started:";
    }
  }
  
  if (isGetVaultsReward) {
    messageText = "\n";
    component = (
      <VaultsClaimCard functionType={functionType} parsedContent={parsedContent} />
    );
  }
  
  if (isGetWalletAssets) {
    const hasAssets = Array.isArray(parsedContent) && parsedContent.length > 0;
    
    if (hasAssets) {
      messageText = "\n";
      component = (
        <WalletAssetsCard parsedContent={parsedContent} />
      );
    } else {
      messageText = "No assets found. Try bridging some assets to get started: [Bridge Bera](/bridge?tokenOut=bera)";
      component = <></>;
    }
  }
  
  if (isGetInterestVaults) {
    if (isFallbackSuggestion) {
      messageText = "No top vaults found. More vaults you might be interested in:";
    } else {
      messageText = "Based on your assets, we recommend these top vaults for you:";
    }
    component = (
      <VaultsCard parsedContent={parsedContent} isFallbackSuggestion={isFallbackSuggestion} />
    );
  }

  const richContent: RichMessageContent = {
    text: messageText,
    actions: [],
  };

  const updatedMessage: Message = {
    ...assistantMessage,
    content: messageText,
    richContent: richContent,
    component,
  };

  if (callbacks?.updateMessage) {
    callbacks.updateMessage(updatedMessage);
  }
};