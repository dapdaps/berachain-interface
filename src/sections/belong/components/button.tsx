import Loading from "@/components/loading";
import { DEFAULT_CHAIN_ID } from "@/configs";
import useCustomAccount from "@/hooks/use-account";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import { useMemo } from "react";
import { useSwitchChain } from "wagmi";

const BelongButton = (props: any) => {
  const { className, onClick, children, loading, ...restProps } = props;

  const { account, chainId } = useCustomAccount();
  const modal = useConnectModal();
  const { switchChain } = useSwitchChain();

  const handleClick = async (e: any) => {
    if (!account) {
      modal.openConnectModal?.();
      return;
    }
    if (DEFAULT_CHAIN_ID !== chainId) {
      switchChain({
        chainId: DEFAULT_CHAIN_ID,
      });
      return;
    }
    onClick?.(e);
  };

  const text = useMemo(() => {
    if (!account) {
      return "Connect Wallet";
    }
    if (DEFAULT_CHAIN_ID !== chainId) {
      return "Switch Network";
    }
    return children;
  }, [children, account, chainId]);

  return (
    <button
      type="button"
      className={clsx("disabled:!cursor-not-allowed disabled:opacity-50 gap-[5px] w-full bg-[#FFDC50] text-black text-[16px] flex justify-center items-center h-[40px] rounded-[10px] border border-[#000]", className)}
      onClick={handleClick}
      {...restProps}
    >
      {
        loading && (
          <Loading size={16} />
        )
      }
      <div>{text}</div>
    </button>
  );
};

export default BelongButton;
