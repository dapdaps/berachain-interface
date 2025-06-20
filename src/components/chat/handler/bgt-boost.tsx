import React from "react";
import BgtBoostCard from "@/components/chat/McBera/BgtBoostCard";

import { Message } from "../context/chat-context";
import { ChatCallbacks } from "../utils/chat-stream-handler";

export const handleBgtBoostOutput = (
  parsedContent: any,
  assistantMessage: Message,
  callbacks?: ChatCallbacks
): void => {
  const messageText =
    "Boost your BGT on Beratown to earn more rewards. Here are the top 3 recommended validators:";

  const updatedMessage: Message = {
    ...assistantMessage,
    content: messageText,
    skipTyping: true,
    component: (
      <BgtBoostCard parsedContent={parsedContent} content={messageText} />
    )
  };

  if (callbacks?.updateMessage) {
    callbacks.updateMessage(updatedMessage);
  }
};
