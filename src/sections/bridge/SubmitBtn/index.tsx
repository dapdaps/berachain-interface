import Loading from "@/components/loading";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useSwitchChain } from "wagmi";
import { useMemo } from "react";

const cls = 'w-full h-[60px] flex items-center justify-center border border-[#000000] rounded-[10px] bg-[#FFDC50] text-[18px] font-[600] mt-[16px] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'

export default function SubmitBtn(props: any) {
  const { comingSoon, onClick, isLoading, disabled, fromChainId, text, fromToken, amount } = props;
  const { switchChain } = useSwitchChain()
  const { address, chainId } = useAccount()
  const { openConnectModal } = useConnectModal();

  const [loading, innerText] = useMemo(() => {
    let _loading = isLoading;
    let _text = () => {
      if (comingSoon) {
        return "Coming soon...";
      }
      if (_loading) {
        return (
          <Loading size={20} />
        );
      }
      if (chainId !== fromChainId) {
        return "Switch Chain";
      }
      return "Bridge";
    };

    return [
      _loading,
      text === "SuperSwap" ? text : _text(),
    ];
  }, [isLoading, comingSoon, chainId, fromChainId, text]);


  if (!address) {
    return (
      <button
        type="button"
        className={cls}
        onClick={() => {
          openConnectModal?.()
        }}
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cls}
      disabled={comingSoon || (chainId === fromChainId && disabled)}
      onClick={() => {
        if (chainId !== fromChainId) {
          switchChain({ chainId: fromChainId })
          return
        }

        if (disabled) {
          return
        }

        if (loading) {
          return
        }

        onClick()
      }}
    >
      {innerText}
    </button>
  );
}