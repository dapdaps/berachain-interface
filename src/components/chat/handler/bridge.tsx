import React from "react";
import { Message } from "../context/chat-context";
import { ChatCallbacks } from "../utils/chat-stream-handler";
import BridgeCard from "../McBera/BridgeCard";

export const handleBridgeOutput = async (
  parsedContent: any,
  assistantMessage: Message,
  callbacks?: ChatCallbacks
) => {
  const messageText =
    "Got it, Use BeraTown to bridge your assets: **Bridge Assets**";
  callbacks?.updateMessage?.({
    id: assistantMessage.id,
    sender: "assistant",
    content: " ",
    component: (
      <BridgeCard parsedContent={parsedContent} content={messageText} />
    )
  });

  return;
};
