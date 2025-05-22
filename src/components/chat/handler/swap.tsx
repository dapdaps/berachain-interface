import React from 'react';
import SwapCard from '@/components/chat/McBera/SwapCard';

import { Message } from "../context/chat-context";
import useSwapStore from "../stores/useSwapStores";
import {
  ChatCallbacks,
  RichMessageContent,
} from "../utils/chat-stream-handler";

export const handleSwapOutput = (
  parsedContent: any,
  assistantMessage: Message,
  callbacks?: ChatCallbacks
): void => {
  let messageText =
    "\n\nOf course, BeraTown provides an all-in-one trading service, you can do this here: ?";

  if (parsedContent.input_token && parsedContent.input_token.symbol) {
    messageText = `\n\nOf course, BeraTown provides an all-in-one trading service, you can do this here: **Swap ${parsedContent.input_token.symbol}**`;
  }

  if (parsedContent.output_token && parsedContent.output_token.symbol) {
    messageText = `\n\nOf course, BeraTown provides an all-in-one trading service, you can do this here: **Get ${parsedContent.output_token.symbol}**`;
  }

  const actions = [
    {
      type: "chat",
      label: "Hot Tokens",
    },
  ];

  if (parsedContent.input_token && parsedContent.input_token.symbol) {
    actions.push({
      type: "chat",
      label: `Hot ${parsedContent.input_token.symbol} Vaults`,
    });
  }

  if (parsedContent.output_token && parsedContent.output_token.symbol) {
    actions.push({
      type: "chat",
      label: `Hot ${parsedContent.output_token.symbol} Vaults`,
    });
  }

  const richContent: RichMessageContent = {
    text: messageText,
    actions: actions,
  };

  const updatedMessage: Message = {
    ...assistantMessage,
    content: messageText,
    richContent: richContent,
    skipTyping: true,
    component: <SwapCard content={messageText} richContent={richContent} />,
  };

  if (callbacks?.updateMessage) {
    callbacks.updateMessage(updatedMessage);
  }

  const swapStore = useSwapStore.getState();

  if (parsedContent && parsedContent.output_token) {
    swapStore?.setDefaultOutputCurrency?.(parsedContent.output_token);
  } 
  
  if (parsedContent && parsedContent.input_token) {
    swapStore?.setDefaultInputCurrency?.(parsedContent.input_token);
  }
};
