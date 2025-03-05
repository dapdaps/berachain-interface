import { FC, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import Loading from "@/components/loading";
import { DEFAULT_CHAIN_ID } from "@/configs";
import useApprove from "@/hooks/use-approve";
import useTokenBalance from "@/hooks/use-token-balance";

interface MintButtonProps {
  onClick?: () => void;
  loading?: boolean;
  children: React.ReactNode;
  amount: string;
  token: any;
  spender: string;
  onRefresh: () => void;
  updater: string;
  currency?: any;
}

const Button: FC<MintButtonProps> = ({
  loading,
  onClick,
  children,
  amount,
  token,
  spender,
  onRefresh,
  updater,
  currency
}) => {
  const { address, chainId } = useAccount();
  const modal = useAppKit();

  const { tokenBalance, update } = useTokenBalance(
    currency?.isNative ? "native" : currency?.address,
    currency?.decimals,
    currency?.chainId
  );

  const { isPending, switchChain } = useSwitchChain();

  const { approve, approved, approving, checking, checkApproved } = useApprove({
    amount,
    token,
    spender,
    onSuccess: onRefresh,
  });

  useEffect(() => {
    checkApproved();
    update();
  }, [updater]);

  if (!address) {
    return (
      <button
        className="w-full font-Montserrat text-[#3D405A] text-[18px] font-[500] bg-[#FFDC50] rounded-[10px] border border-black flex items-center justify-center h-[46px]"
        onClick={() => modal.open()}
      >
        Connect Wallet
      </button>
    );
  }

  if (DEFAULT_CHAIN_ID !== chainId) {
    return (
      <button
        disabled={isPending || loading}
        className="w-full font-Montserrat text-[#3D405A] text-[18px] font-[500] bg-[#FFDC50] rounded-[10px] border border-black flex items-center justify-center h-[46px]"
        onClick={() =>
          switchChain({
            chainId: DEFAULT_CHAIN_ID,
          })
        }
      >
        Switch Network
      </button>
    );
  }

  if (checking || approving || loading) {
    return <button
    disabled={true}
    className="w-full font-Montserrat text-[#3D405A] text-[18px] font-[500] bg-[#FFDC50] rounded-[10px] border border-black flex items-center justify-center h-[46px]"
  >
    <Loading />
  </button>
  }

  if (Number(tokenBalance) < Number(amount)) {
    return (
      <button
        disabled={true}
        className="w-full font-Montserrat text-[#3D405A] text-[18px] font-[500] bg-[#FFDC50] rounded-[10px] border border-black flex items-center justify-center h-[46px] disabled:opacity-50"
      >
        Insufficient balance
      </button>
    )
  }

  if (!approved && Number(amount) > 0) {
    return (
      <button
        className="w-full font-Montserrat text-[#3D405A] text-[18px] font-[500] bg-[#FFDC50] rounded-[10px] border border-black flex items-center justify-center h-[46px]"
        onClick={approve}
      >
        Approve {token?.symbol}
      </button>
    );
  }

  return (
    <button
      disabled={loading}
      className="w-full font-Montserrat text-[#3D405A] text-[18px] font-[500] bg-[#FFDC50] rounded-[10px] border border-black flex items-center justify-center h-[46px]"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
