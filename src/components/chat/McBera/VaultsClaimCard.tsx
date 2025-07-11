import { usePriceStore } from '@/stores/usePriceStore';
import { useMemo } from 'react';
import Big from 'big.js';
import LazyImage from '@/components/layz-image';
import { getTokenLogo } from '@/sections/dashboard/utils';
import { numberFormatter } from '@/utils/number-formatter';
import clsx from 'clsx';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { useVaultAction } from '@/components/chat/hooks/useVaultAction';
import { useThrottleFn } from 'ahooks';
import { useTypewriter } from '@/components/chat/hooks/useTypewriter';
import { motion } from 'framer-motion';
import { motionStaggerChildren, motionStaggerParent } from '@/components/chat/utils/motion-stagger-children';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const VaultsClaimCard = (props: any) => {
  const { parsedContent, functionType } = props;

  const isGetVaultsReward = functionType === "getVaultsReward";

  const { vaultsList } = useVaultAction(props);
  const prices = usePriceStore((store: any) => store.beraTownPrice);
  const { toggleClaimVisible, setCurrentProtocol } = useVaultsV2Context();

  const totalRewardUsd = useMemo(() => {
    return parsedContent.reduce((prev: any, curr: any) => {
      let currUsd = Big(prev);
      curr.user_reward?.forEach((reward: any) => {
        const currPrice = prices?.[reward.symbol] || prices?.[reward.address] || 0;
        reward.usd = Big(reward.amount || 0).times(currPrice);
        reward.icon = getTokenLogo(reward.symbol);
        currUsd = currUsd.plus(reward.usd);
      });
      curr.reward_tokens?.forEach((token: any) => {
        token.icon = getTokenLogo(token.symbol);
      });
      return currUsd;
    }, Big(0));
  }, [parsedContent, prices]);

  const { run: handleClaim } = useThrottleFn((protocol: any) => {
    const findProtocol = () => {
      for (const vault of vaultsList) {
        for (const it of vault.list) {
          if (it.backendId === protocol.id) {
            return it;
          }
        }
      }
    };
    const currentProtocol: any = findProtocol();
    setCurrentProtocol(currentProtocol);
    toggleClaimVisible(true, currentProtocol.user_reward);
  }, { wait: 1000 });

  const message = useMemo(() => {
    return `Your total value of rewards is **${numberFormatter(totalRewardUsd, 2, true, { prefix: "$", isZeroPrecision: true })}**\nHere's the distribution of rewards:`;
  }, [totalRewardUsd]);

  const { typedContent, isTyping } = useTypewriter(message, {
    interval: 30,
    step: [1, 3],
    initialIndex: 0,
  });

  return (
    <div className="w-full min-w-[554px]">
      <div data-typing={isTyping ? 'true' : 'false'} className="text-[#392C1D] font-montserrat text-[14px] font-medium leading-[150%]">
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            )
          }}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {typedContent}
        </ReactMarkdown>
      </div>
      <motion.div
        className="mt-[10px] w-full flex flex-col gap-[8px]"
        {...motionStaggerParent(0.1)}
      >
        {
          parsedContent?.filter((vault: any) => {
            if (isGetVaultsReward) {
              return !!vault.user_reward && vault.user_reward.length > 0;
            }
            return true;
          }).map((vault: any, idx: number) => (
            <motion.div
              key={idx}
              className="flex justify-between items-center pl-[10px] pr-[10px] h-[48px] shrink-0 rounded-[10px] border border-[#D6D1CC] text-[#392C1D] font-montserrat text-[12px] font-medium leading-[100%]"
              {...motionStaggerChildren}
            >
              <div className="flex items-center gap-[8px] flex-1 overflow-hidden">
                {
                  vault.reward_tokens?.map((token: any, idx: number) => (
                    <LazyImage
                      key={idx}
                      src={token.icon}
                      width={26}
                      height={26}
                      fallbackSrc="/assets/tokens/default_icon.png"
                      containerClassName={clsx("shrink-0 rounded-full overflow-hidden", idx > 0 && "ml-[-20px]")}
                    />
                  ))
                }
                <div className="text-[#392C1D] font-[700]">
                  {vault.reward_tokens?.map((token: any, idx: number) => token.symbol).join("/")}
                </div>
                <div className="ml-[4px]">
                  Vaults: <span className="underline underline-offset-2">{vault.tokens?.map((token: any, idx: number) => token.symbol).join("-")}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-[15px] shrink-0">
                <div className="text-[#392C1D] font-[700] flex items-center">
                  {vault.user_reward?.map((token: any, idx: number) => (
                    <div className="">
                      {idx === 0 ? "+" : "/"}{numberFormatter(token.amount, 2, true, { isShort: true, isZeroPrecision: true, isShortUppercase: true })}({numberFormatter(token.usd, 2, true, { prefix: "$", isShort: true, isZeroPrecision: true, isShortUppercase: true })})
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="px-[9px] h-[22px] shrink-0 rounded-[6px] border border-black bg-[#FFF5A9] shadow-[2px_2px_0px_0px_#000] text-[#392C1D] font-montserrat text-[14px] font-medium leading-[100%]"
                  onClick={() => handleClaim(vault)}
                >
                  Claim
                </button>
              </div>
            </motion.div>
          ))
        }
      </motion.div>
    </div>
  );
};

export default VaultsClaimCard;
