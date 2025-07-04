import clsx from "clsx";
import { useVaultAction } from '@/components/chat/hooks/useVaultAction';
import { numberFormatter } from '@/utils/number-formatter';
import { Message, useChatContext } from '@/components/chat/context/chat-context';
import { useThrottleFn } from 'ahooks';
import { createNewChat } from '@/components/chat/utils/chat-service';
import { motion } from "framer-motion";
import { motionStaggerChildren, motionStaggerParent } from '@/components/chat/utils/motion-stagger-children';
import { useRef, useCallback, useEffect } from "react";

const TYPES = {
  vaults: {
    bg: "bg-[#DB8181]",
    label: "VAULTS"
  },
  staking: {
    bg: "bg-[#C1A1DB]",
    label: "STAKING"
  },
  liquidity: {
    bg: "bg-[#9AC2DE]",
    label: "LIQUIDITY"
  }
};

export default function InvestCard(props: {
  className?: string;
  type: keyof typeof TYPES;
  parsedContent: any;
}) {
  const {
    className,
    type
  } = props;

  const config = TYPES[type];
  const { vaultsList, vaultsShowList, handleOpen } = useVaultAction(props);
  const { addMessage, updateMessage, addChatHistory, setSessionId, sessionId, setIsProcessing } = useChatContext();
  const scrollTimer = useRef<any>();

  const { run: handleMessage } = useThrottleFn(async (chatMsg: string) => {
    addMessage({
      id: Date.now().toString(),
      sender: "user",
      content: chatMsg,
    });
    const assistantMessageId = (Date.now() + 1).toString();
    const emptyAssistantMessage: Message = {
      id: assistantMessageId,
      sender: "assistant",
      senderName: "McBera",
      content: "",
    };
    addMessage(emptyAssistantMessage);
    try {
      setIsProcessing(true);
      await createNewChat(chatMsg,
        emptyAssistantMessage,
        {
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
    } catch (err: any) {
      console.log('%s err: %o', chatMsg, err);
      setIsProcessing(false);
      updateMessage({
        ...emptyAssistantMessage,
        content: "Sorry, I can't assist with that."
      });
    }
    onScrollToBottom();
  }, { wait: 1000 });

  const onScrollToBottom = useCallback(() => {
    scrollTimer.current = setTimeout(() => {
      clearTimeout(scrollTimer.current);
      document.getElementById("chat-bottom")?.scrollIntoView({
        behavior: "smooth"
      });
    }, 500);
  }, []);

  useEffect(() => {
    clearTimeout(scrollTimer.current);
  }, []);

  return (
    <motion.div
      className="mt-[10px] w-full min-w-[554px] flex flex-col gap-[8px]"
      {...motionStaggerParent(0.1)}
    >
      {
        vaultsShowList?.map((vault: any, idx: number) => (
          <motion.div
            key={idx}
            className={clsx(
              "flex items-center h-[62px] rounded-[10px] border border-[#D6D1CC] cursor-pointer",
              className
            )}
            onClick={() => {
              const _defaultProtocol = vault.groupVault?.list?.find((it: any) => it.backendId === vault.id);
              handleOpen(vault.groupVault, _defaultProtocol);
            }}
            {...motionStaggerChildren}
          >
            <div className="flex grow relative pl-[35px] pr-[12px] justify-between items-center text-[#392C1D">
              <div
                className={clsx(
                  "rotate-[90deg] absolute top-1/2 -translate-y-1/2 left-[-18px] rounded-b-[10px] w-[60px] h-[25px] flex items-center justify-center shrink-0",
                  config.bg
                )}
              >
                <span className="text-[12px] font-semibold text-white">
                  {config.label}
                </span>
              </div>
              <div className="flex-1 w-0 overflow-hidden">
                <div className="font-bold text-[14px]">
                  {vault.tokens.map((token: any) => token.symbol).join("-")}
                </div>
                <div className="text-[12px] font-medium flex items-center gap-[6px] mt-[4px]">
                  <RewardIcon />
                  <span>{vault?.reward_tokens?.map((token: any) => token.symbol).join("/")}</span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-bold text-[14px]">
                  {numberFormatter(vault.user_stake?.usd, 2, true, { prefix: "$", isShort: true, isZeroPrecision: true, isShortUppercase: true })}
                </span>
                <span className="text-[12px] font-medium mt-[4px]">
                  +{numberFormatter(vault.total_user_reward_usd, 2, true, { prefix: "$", isShort: true, isZeroPrecision: true, isShortUppercase: true })}
                </span>
              </div>
            </div>
            <button className="flex justify-center items-center w-[44px] h-[62px] border-l border-[#D6D1CC] shrink-0">
              <IconArrowRightIcon />
            </button>
          </motion.div>
        ))
      }
      <motion.div
        className="mt-[10px]"
        {...motionStaggerChildren}
      >
        <ChatButton
          icon="/images/home-earth/mc-bera/icon-gift.svg"
          onClick={() => {
            handleMessage("Check & claim my rewards");
            onScrollToBottom();
          }}
        >
          Check & claim my rewards
        </ChatButton>
        <ChatButton
          className="mt-[8px]"
          icon="/images/home-earth/mc-bera/icon-wallet.svg"
          onClick={() => {
            handleMessage("Check my wallet assets");
            onScrollToBottom();
          }}
        >
          Check my wallet assets
        </ChatButton>
        <ChatButton
          className="mt-[8px]"
          icon="/images/home-earth/mc-bera/icon-asset.svg"
          onClick={() => {
            handleMessage("Top vaults based on my assets");
            onScrollToBottom();
          }}
        >
          Top vaults based on my assets
        </ChatButton>
      </motion.div>
    </motion.div>
  );
}

const IconArrowRightIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M2 10L11 1M11 1H2M11 1V10"
        stroke="#392C1D"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const RewardIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M12.6501 2.60703H12.1585C12.4077 2.18477 12.5171 1.78201 12.4822 1.40842C12.4532 1.09575 12.3049 0.648565 11.7613 0.292177C11.3106 -0.00399662 10.7311 -0.0766391 10.0881 0.0838318C9.04548 0.345355 7.81147 1.24445 7.00011 2.33101C6.18825 1.24447 4.95523 0.345355 3.91259 0.0838318C3.2691 -0.0776821 2.68906 -0.00452698 2.23846 0.292177C1.69537 0.648565 1.547 1.09575 1.51802 1.40842C1.48307 1.78201 1.59146 2.18477 1.84176 2.60703H1.35015C0.605784 2.60703 0 3.21267 0 3.95686V5.69547C0 6.28416 0.388667 6.80444 0.950988 6.97916C0.897545 7.12689 0.869567 7.2796 0.869567 7.43434V12.6504C0.869567 13.3941 1.47604 14 2.22048 14H11.7813C12.5257 14 13.1312 13.3941 13.1312 12.6504V7.43432C13.1312 7.27859 13.1042 7.12539 13.0508 6.97863C13.6123 6.80294 14 6.28265 14 5.69545V3.9573C14 3.21316 13.3945 2.60703 12.6501 2.60703ZM11.7813 13.0387H7.48074V7.04553H11.7813C11.9956 7.04553 12.1694 7.2202 12.1694 7.43432V12.6504C12.1694 12.8646 11.9956 13.0387 11.7813 13.0387ZM8.01031 2.60703C8.69426 1.8189 9.592 1.19956 10.3209 1.01687C10.6996 0.922057 11.0094 0.948009 11.2337 1.09575C11.472 1.25219 11.5144 1.39168 11.524 1.49703C11.5619 1.88331 11.1472 2.40411 10.9514 2.60703H8.01031ZM13.0377 3.95732V5.69547C13.0377 5.90959 12.8644 6.08373 12.6501 6.08373H7.48074V3.56877H12.6501C12.8644 3.56877 13.0377 3.74323 13.0377 3.95732ZM6.51899 7.04553V13.0387H2.22046C2.00561 13.0387 1.83174 12.8645 1.83174 12.6504V7.43432C1.83174 7.2202 2.00561 7.04553 2.22046 7.04553H6.51899ZM2.47626 1.49703C2.48573 1.39168 2.52871 1.25217 2.76604 1.09575C2.98882 0.948009 3.29858 0.920784 3.6793 1.01687C4.4042 1.19854 5.30096 1.81793 5.98642 2.60703H3.04779C2.87243 2.4296 2.43777 1.89257 2.47626 1.49703ZM0.961465 3.95732C0.961465 3.74325 1.13533 3.56877 1.35013 3.56877H6.51898V6.08373H1.35013C1.13533 6.08373 0.961465 5.90959 0.961465 5.69547V3.95732Z"
        fill="#392C1D"
      />
    </svg>
  );
};

export const ChatButton = (props: any) => {
  const { children, className, icon, ...rest } = props;

  return (
    <button
      type="button"
      className={clsx("flex items-center justify-center transition-all duration-150 hover:bg-[rgba(218,217,205,0.30)] hover:text-[#471C1C] gap-[8px] h-[32px] rounded-[10px] border border-[#DAD9CD] px-[8px] text-[#999] font-montserrat text-[13px] font-medium leading-[120%] shrink-0", className)}
      {...rest}
    >
      {
        icon && (
          <img src={icon} alt="" className="shrink-0 w-[18px] h-[18px] object-center object-contain" />
        )
      }
      <div className="flex-1">
        {children}
      </div>
    </button>
  );
};
