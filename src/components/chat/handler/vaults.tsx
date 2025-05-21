import { Message } from "../context/chat-context";
import useSwapStore from "../stores/useSwapStores";
import {
  ChatCallbacks,
  RichMessageContent,
} from "../utils/chat-stream-handler";
import VaultsCard from '@/components/chat/McBera/VaultsCard';

export const handleVaultsOutput = (
  parsedContent: any,
  assistantMessage: Message,
  updateFullResponse?: (response: string) => void,
  callbacks?: ChatCallbacks
): void => {
  const messageText = `Based on your interest in this token, here are some top-performing vaults you might want to explore:`;

  const richContent: RichMessageContent = {
    text: messageText,
    actions: [],
  };

  const updatedMessage: Message = {
    ...assistantMessage,
    content: messageText,
    richContent: richContent,
    component: <VaultsCard parsedContent={parsedContent} />
  };

  assistantMessage.content = messageText;
  assistantMessage.richContent = richContent;

  if (updateFullResponse) {
    updateFullResponse(messageText);
  }

  if (callbacks?.updateMessage) {
    callbacks.updateMessage(updatedMessage);
  }
};
