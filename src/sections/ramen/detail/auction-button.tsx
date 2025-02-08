import Loading from "@/components/circle-loading";
import useAccount from "@/hooks/use-account";
import { useSwitchChain } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { DEFAULT_CHAIN_ID } from "@/configs";

const BaseButton = ({ loading, onClick, children, disabled = false }: any) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full border border-black rounded-[10px] bg-[#FFDC50] h-[46px] flex justify-center items-center"
    >
      {loading ? <Loading /> : children}
    </button>
  );
};

export default function AuctionButton({
  errorTips,
  disabled,
  onClick,
  loading
}: any) {
  const { isPending: switching, switchChain } = useSwitchChain();
  const { open } = useAppKit();
  const { account, chainId } = useAccount();

  if (!account || !chainId) {
    return (
      <BaseButton
        onClick={() => {
          open();
        }}
      >
        Connect wallet
      </BaseButton>
    );
  }

  if (chainId !== DEFAULT_CHAIN_ID) {
    return (
      <BaseButton
        onClick={() => {
          switchChain({
            chainId: DEFAULT_CHAIN_ID
          });
        }}
        loading={switching}
      >
        Switch Network
      </BaseButton>
    );
  }

  if (errorTips) {
    return <BaseButton disabled>{errorTips}</BaseButton>;
  }

  return (
    <BaseButton onClick={onClick} disabled={disabled} loading={loading}>
      Auction
    </BaseButton>
  );
}
