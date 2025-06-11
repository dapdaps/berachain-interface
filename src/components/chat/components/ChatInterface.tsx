import { useAccount } from "wagmi";
import useUser from "@/hooks/use-user";
import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import LazyImage from "../../layz-image";
import IconSend from "@public/images/chat/send.svg";
import { useChatContext, Message } from "../context/chat-context";
import { createNewChat, postAddMessageItem } from "../utils/chat-service";
import InteractiveMarkdown from "./InteractiveMarkdown";
import useSwapStore from "../stores/useSwapStores";
import SwapModal from "@/sections/swap/SwapModal";
import useEnsoStore from "../stores/useEnsoStore";
import EnsoModal from "../McBera/EnsoCard/modal";
import useHaikuStore from "../stores/useHaikuStore";
import HaikuModal from "../McBera/SwapCard/Haiku/modal";
import useBridgeStore from "../stores/useBridgeStore";
import BridgeModal from "@/sections/bridge/bridge-modal";
import useBgtBoostStore from "../stores/useBgtBoostStore";
import BgtBoostModal from "@/sections/bgt/components/delegate";
import { bera } from "@/configs/tokens/bera";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useDebounceFn } from "ahooks";

export type MessageType = {
  id: string;
  sender: "user" | "assistant";
  content: string;
  senderName?: string;
};

interface ITrade {
  inputCurrencyAmount: string;
  outputCurrencyAmount: string;
  inputCurrency: any;
  outputCurrency: any;
  transactionHash: string;
  tradeFrom: string;
}

const UserAvatar: React.FC = () => {
  const { userInfo } = useUser();
  const { address } = useAccount();
  return !address || !userInfo.avatar ? (
    <div className="shrink-0 w-[26px] h-[26px] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#00D1FF_0deg,#FF008A_360deg)]" />
  ) : (
    <div className="w-[26px] h-[26px] shrink-0">
      <LazyImage src={userInfo.avatar} className="rounded-full shrink-0 " />
    </div>
  );
};

export default function ChatInterface() {
  const timerRef = useRef<any>();
  const {
    messages: contextMessages,
    addMessage,
    addChatHistory,
    startNewChat,
    updateMessage,
    sessionId,
    isFromHistory,
    setIsFromHistory,
    setSessionId,
    isProcessing,
    setIsProcessing,
    resetChatState
  } = useChatContext();

  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    console.log("ChatInterface mounted with address:", address);
    if (!isConnected && !address) {
      resetChatState();
    }
  }, [address]);

  const handleSubmit = async (inputValue: string) => {
    if (!address) {
      openConnectModal?.();
      return;
    }

    if (inputValue.trim() === "" || isProcessing) return;

    try {
      const userMessage = inputValue;
      setIsProcessing(true);
      const isNewChat = contextMessages.length === 0;
      setIsFromHistory(false);
      if (!isNewChat) {
        const newUserMessage: Message = {
          id: Date.now().toString(),
          sender: "user",
          content: userMessage
        };
        addMessage(newUserMessage);
        onScrollToBottom(0);
        const assistantMessageId = (Date.now() + 1).toString();
        const emptyAssistantMessage: Message = {
          id: assistantMessageId,
          sender: "assistant",
          senderName: "McBera",
          content: ""
        };
        addMessage(emptyAssistantMessage);

        await createNewChat(userMessage, emptyAssistantMessage, {
          updateMessage: (updatedMessage: Message) => {
            if (updatedMessage.sender === "assistant") {
              updateMessage(updatedMessage);
            }
          },
          addChatHistory,
          setSessionId,
          getSessionId: () => sessionId,
          onComplete: () => {
            setIsProcessing(false);
          },
          onError: () => {
            updateMessage({
              ...emptyAssistantMessage,
              content: "Sorry, I can't assist with that."
            });
            setIsProcessing(false);
          }
        });
      } else {
        startNewChat(userMessage);
        const assistantMessageId = (Date.now() + 1).toString();
        const emptyAssistantMessage: Message = {
          id: assistantMessageId,
          sender: "assistant",
          senderName: "McBera",
          content: ""
        };
        await createNewChat(userMessage, emptyAssistantMessage, {
          updateMessage: (updatedMessage: Message) => {
            if (updatedMessage.sender === "assistant") {
              updateMessage(updatedMessage);
            }
          },
          addChatHistory,
          setSessionId,
          getSessionId: () => null,
          onComplete: () => {
            setIsProcessing(false);
          },
          onError: () => {
            updateMessage({
              ...emptyAssistantMessage,
              content: "Sorry, I can't assist with that."
            });
            setIsProcessing(false);
          }
        });
      }
      onScrollToBottom(1000);
    } catch (error) {
      console.error("Get error:", error);
      setIsProcessing(false);
      const lastAssistantMessage = [...contextMessages]
        .reverse()
        .find((msg) => msg.sender === "assistant");
      if (lastAssistantMessage) {
        updateMessage({
          ...lastAssistantMessage,
          content: "Sorry, I can't assist with that."
        });
      }
    }
  };

  const onScrollToBottom = useCallback(
    (delay = 500) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth"
        });
      }, delay);
    },
    [messagesEndRef.current]
  );

  const successCb = useCallback(
    ({ messageContent }: any) => {
      const successMessageId = Date.now().toString();

      const successMessage: Message = {
        id: successMessageId,
        sender: "assistant",
        senderName: "McBera",
        content: messageContent
      };
      setIsFromHistory(false);
      addMessage(successMessage);
      postAddMessageItem(messageContent, sessionId!);
    },
    [sessionId]
  );

  return (
    <div className="flex flex-col justify-center w-[600px] mx-auto">
      <List {...{ messagesEndRef, contextMessages, isFromHistory }} />
      <Send
        {...{
          setIsComposing,
          handleSubmit,
          isProcessing,
          isComposing
        }}
      />
      <Modals successCb={successCb} />
    </div>
  );
}

const List = ({ messagesEndRef, contextMessages, isFromHistory }: any) => {
  const displayMessages = useMemo(
    () => (contextMessages.length > 0 ? contextMessages : []),
    [contextMessages]
  );
  const mountedRef = useRef(false);
  useEffect(() => {
    if (isFromHistory && !mountedRef.current) {
      setTimeout(() => {
        mountedRef.current = true;
        messagesEndRef.current?.scrollIntoView();
      }, 500);
    }
  }, [displayMessages, isFromHistory]);

  const { run } = useDebounceFn(
    () => {
      if (isFromHistory) return;
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    },
    { wait: 50 }
  );
  return (
    <div className="mt-5 overflow-y-auto pr-[20px] h-[500px]">
      {displayMessages.map((message: any) => {
        return (
          <div
            key={message.id}
            data-role={message.sender}
            className={`flex items-start mb-4 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "user" ? (
              <div className="flex flex-col items-end">
                <div
                  className={`
                    max-w-[300px] break-all border border-[#DAD9CD] rounded-[10px] bg-opacity-30 bg-[#DAD9CD] px-[5px] py-1 flex items-center gap-2`}
                >
                  <UserAvatar />
                  <div className="font-Montserrat text-black/50 text-[14px] leading-[14px] font-[500]">
                    {message.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-[26px] h-[26px] flex-shrink-0 aspect-square flex items-center justify-center">
                    <img
                      src="/images/chat/mcbera.png"
                      className="w-full object-contain"
                      alt=""
                    />
                  </div>
                  {message.senderName && (
                    <span className="text-sm text-black/50 font-[500] font-Montserrat">
                      {message.senderName}:
                    </span>
                  )}
                </div>
                <div className="text-black text-sm leading-tight font-medium font-Montserrat w-full">
                  {message.sender === "assistant" && message.content === "" ? (
                    <div className="text-gray-500">Thinking...</div>
                  ) : message.sender === "assistant" && message.content ? (
                    <InteractiveMarkdown
                      message={message}
                      content={message.content}
                      component={message.component}
                      skipTyping={message.skipTyping}
                      onResize={run}
                    />
                  ) : (
                    <div className="text-gray-500">No Data</div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} className="h-[1px]" id="chat-bottom" />
    </div>
  );
};

export const Modals = memo(({ successCb }: any) => {
  const {
    isSwapModalOpen,
    closeSwapModal,
    defaultInputCurrency,
    defaultOutputCurrency,
    successCb: swapSuccessCallback
  } = useSwapStore();

  const ensoStore = useEnsoStore();

  const haikuStore = useHaikuStore();

  const bridgeStore = useBridgeStore();

  const bgtBoostStore = useBgtBoostStore();

  return (
    <>
      <SwapModal
        defaultInputCurrency={
          bera[defaultInputCurrency?.symbol?.toLowerCase()] ||
          defaultInputCurrency
        }
        defaultOutputCurrency={
          bera[defaultOutputCurrency?.symbol?.toLowerCase()] ||
          defaultOutputCurrency
        }
        show={!!isSwapModalOpen}
        onClose={() => {
          closeSwapModal();
        }}
        onSuccess={(trade: ITrade) => {
          if (swapSuccessCallback) {
            swapSuccessCallback();
            return;
          }

          const txUrl = `https://berascan.com/tx/${trade.transactionHash}`;

          const messageContent = `You swapped ${trade.inputCurrencyAmount} ${
            trade.inputCurrency?.symbol || ""
          } for ${trade.outputCurrencyAmount} ${
            trade.outputCurrency?.symbol || ""
          } via ${trade.tradeFrom}\n Here is Tx: [${txUrl}](${txUrl})`;

          successCb({ messageContent });
        }}
        from="ai-chat"
      />
      {ensoStore.modalOpen && (
        <EnsoModal
          open={ensoStore.modalOpen}
          onSuccess={({ transactionHash, amount, symbol, isSuccess }: any) => {
            const txUrl = `https://berascan.com/tx/${transactionHash}`;

            const messageContent = `${
              isSuccess ? "✅" : "❌"
            } You staked ${amount} ${symbol || ""} via enso ${
              isSuccess ? "successfully" : "failly"
            }.\n Here is Tx: [${txUrl}](${txUrl})`;

            successCb({ messageContent });
          }}
        />
      )}
      {haikuStore.modalOpen && (
        <HaikuModal
          open={haikuStore.modalOpen}
          onSuccess={({
            transactionHash,
            inputCurrencyAmount,
            inputCurrency,
            outputCurrencyAmount,
            outputCurrency,
            isSuccess
          }: any) => {
            const txUrl = `https://berascan.com/tx/${transactionHash}`;

            const messageContent = `${
              isSuccess ? "✅" : "❌"
            } You swapped ${inputCurrencyAmount} ${
              inputCurrency?.symbol || ""
            } for ${outputCurrencyAmount} ${
              outputCurrency?.symbol || ""
            } via Haiku\n ${
              transactionHash ? `Here is Tx: [${txUrl}](${txUrl})` : ""
            }`;

            successCb({ messageContent });
          }}
        />
      )}
      {bridgeStore.modalOpen && (
        <BridgeModal
          open={bridgeStore.modalOpen}
          onClose={() => bridgeStore.set({ modalOpen: false })}
          onCallback={(result: any) => {
            const txUrl = `https://berascan.com/tx/${result.txHash}`;

            const messageContent = `${
              result.isSuccess ? "✅" : "❌"
            } You bridged ${result.inputCurrencyAmount} ${
              result.inputCurrency?.symbol || ""
            } for ${result.outputCurrencyAmount} ${
              result.outputCurrency?.symbol || ""
            } via ${result.template}\n ${
              result.txHash ? `Here is Tx: [${txUrl}](${txUrl})` : ""
            }`;

            successCb({ messageContent });
          }}
        />
      )}
      {bgtBoostStore.modalOpen && (
        <BgtBoostModal
          visible={bgtBoostStore.modalOpen}
          onClose={() => bgtBoostStore.set({ modalOpen: false })}
          validator={bgtBoostStore.data}
          onValidatorSelect={(validator: any) => {
            bgtBoostStore.set({ data: validator });
          }}
          operationType="delegate"
          onCallback={(result: any) => {
            const txUrl = `https://berascan.com/tx/${result.txHash}`;

            const messageContent = `${
              result.isSuccess ? "✅" : "❌"
            } You boosted ${result.amount} BGT via ${
              bgtBoostStore.data.metadata.name
            }\n ${result.txHash ? `Here is Tx: [${txUrl}](${txUrl})` : ""}`;
            successCb({ messageContent });
          }}
        />
      )}
    </>
  );
});

const Send = ({
  setIsComposing,
  handleSubmit,
  isProcessing,
  isComposing
}: any) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex w-[560px] items-center relative mt-auto">
      <textarea
        className="font-Montserrat text-[14px] font-[500] leading-[12px] w-full py-[14px] px-4 rounded-lg border border-black bg-white shadow-[inset_6px_5px_0px_0px_rgba(0,0,0,0.25)] focus:outline-none resize-none"
        placeholder="Ask anything..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !isComposing) {
            e.preventDefault();
            handleSubmit(inputValue);
            setInputValue("");
          }
        }}
        onCompositionStart={() => {
          setIsComposing(true);
        }}
        onCompositionEnd={() => {
          setIsComposing(false);
        }}
      />
      <div
        onClick={() => {
          handleSubmit(inputValue);
          setInputValue("");
        }}
        className={`absolute right-3 bottom-3 ${
          isProcessing ? "opacity-40 pointer-events-none" : "cursor-pointer"
        }`}
      >
        <IconSend />
      </div>
    </div>
  );
};
