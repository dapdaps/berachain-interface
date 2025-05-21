import { Message } from "../context/chat-context";
import useSwapStore from "../stores/useSwapStores";
import {
  ChatCallbacks,
  RichMessageContent,
} from "../utils/chat-stream-handler";

export const handleSwapOutput = (
  parsedContent: any,
  assistantMessage: Message,
  updateFullResponse?: (response: string) => void,
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
  };

  assistantMessage.content = messageText;
  assistantMessage.richContent = richContent;

  if (updateFullResponse) {
    updateFullResponse(messageText);
  }

  if (callbacks?.updateMessage) {
    callbacks.updateMessage(updatedMessage);
  }

  const swapStore = useSwapStore.getState();
  if (parsedContent && parsedContent.output_token) {
    swapStore?.setDefaultOutputCurrency?.(parsedContent.output_token);
  } else if (parsedContent && parsedContent.input_token) {
    swapStore?.setDefaultInputCurrency?.(parsedContent.input_token);
  }
};
