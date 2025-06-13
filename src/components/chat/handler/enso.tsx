import React from "react";
import { Message } from "../context/chat-context";
import { ChatCallbacks } from "../utils/chat-stream-handler";
import EnsoCard from "../McBera/EnsoCard";

export const handleEnsoOutput = async (
  parsedContent: any,
  assistantMessage: Message,
  callbacks?: ChatCallbacks
) => {
  callbacks?.updateMessage?.({
    id: assistantMessage.id,
    sender: "assistant",
    content: " ",
    component: <EnsoCard data={parsedContent} />
  });

  return;
};
