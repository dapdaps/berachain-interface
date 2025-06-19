import Button from "./index";
import useAccount from "@/hooks/use-account";
import { useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function ButtonWithCheckingChain({
  children,
  buttonProps,
  onClick,
  disabled,
  loading
}: any) {
  const { isPending: switching, switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { account, chainId } = useAccount();

  if (!account || !chainId) {
    return (
      <Button
        onClick={() => {
          openConnectModal?.();
        }}
        {...buttonProps}
      >
        Connect wallet
      </Button>
    );
  }

  if (chainId !== DEFAULT_CHAIN_ID) {
    return (
      <Button
        onClick={() => {
          switchChain({
            chainId: DEFAULT_CHAIN_ID
          });
        }}
        loading={switching}
        {...buttonProps}
      >
        Switch Network
      </Button>
    );
  }

  if (loading) {
    return (
      <Button loading={true} disabled {...buttonProps}>
        {children}
      </Button>
    );
  }

  return (
    <Button onClick={onClick} disabled={disabled} {...buttonProps}>
      {children}
    </Button>
  );
}
