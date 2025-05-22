import { Message } from "../context/chat-context";
import HotTokensCard from "../McBera/HotTokensCard";
import {
  ChatCallbacks,
  RichMessageContent,
} from "../utils/chat-stream-handler";

export const handleHotTokensOutput = (
  parsedContent: any,
  assistantMessage: Message,
  callbacks?: ChatCallbacks
): void => {
  const messageText = `Here are some popular Berachain tokens you might like:`;

  const richContent: RichMessageContent = {
    text: messageText,
    actions: [],
  };

  const updatedMessage: Message = {
    ...assistantMessage,
    content: messageText,
    richContent: richContent,
    component: <HotTokensCard parsedContent={parsedContent} />
  };

  if (callbacks?.updateMessage) {
    callbacks.updateMessage(updatedMessage);
  }
};
