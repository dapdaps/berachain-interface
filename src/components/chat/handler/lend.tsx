import React from "react";
import { Message } from "../context/chat-context";
import { ChatCallbacks } from "../utils/chat-stream-handler";
import LendCard from "../McBera/LendCard";

export const handleLendOutput = async (
  parsedContent: any,
  assistantMessage: Message,
  callbacks?: ChatCallbacks
) => {
  const messageText =
    "Easily lend your assets on Beratown's Lend pages: **Lend Assets**";
  callbacks?.updateMessage?.({
    id: assistantMessage.id,
    sender: "assistant",
    content: " ",
    component: <LendCard parsedContent={parsedContent} content={messageText} />
  });

  return;
};
