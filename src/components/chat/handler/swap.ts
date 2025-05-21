import { Message } from "../context/chat-context";
import useSwapStore from "../stores/useSwapStores";
import { ChatCallbacks, RichMessageContent } from "../utils/chat-stream-handler";

export const handleSwapOutput = (
  parsedContent: any,
  assistantMessage: Message,
  updateFullResponse?: (response: string) => void,
  callbacks?: ChatCallbacks,
): void => {
  const messageText = "\n\nOf course, BeraTown provides an all-in-one trading service, you can do this here: ?";

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
      if (parsedContent && parsedContent.input_token) {
        swapStore.setDefaultInputCurrency?.(parsedContent.input_token);
      }
  
};