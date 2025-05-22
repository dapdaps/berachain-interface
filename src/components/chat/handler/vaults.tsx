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

export const handleVaultsOutput = (
  functionType: string,
  parsedContent: any,
  assistantMessage: Message,
  callbacks?: ChatCallbacks
): void => {
  const isGetVaultsPositions = functionType === "getVaultsPositions";
  const isGetVaultsReward = functionType === "getVaultsReward";

  let messageText = `Based on your interest in this token, here are some top-performing vaults you might want to explore:`;
  let component = (
    <VaultsCard parsedContent={parsedContent} />
  );
  if (isGetVaultsPositions) {
    const totalStakedUsd = parsedContent?.reduce((prev: any, curr: any) => Big(prev).plus(curr.user_stake?.usd || 0), Big(0));
    messageText = `Your total investing is **${numberFormatter(totalStakedUsd, 2, true, { prefix: "$", isZeroPrecision: true })}**\n\nHere's the distribution of invest:`;
    component = (
      <InvestCard type="vaults" parsedContent={parsedContent} />
    );
  }
  if (isGetVaultsReward) {
    messageText = "\n";
    component = (
      <VaultsClaimCard parsedContent={parsedContent} />
    );
  }

  console.log('messageText: %o', messageText);
  console.log('component: %o', component);

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
