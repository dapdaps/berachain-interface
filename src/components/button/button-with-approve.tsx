import Button from "./index";
import useApprove from "@/hooks/use-approve";
import useAccount from "@/hooks/use-account";
import { useSwitchChain } from "wagmi";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect } from "react";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function ButtonWithApprove({
  spender,
  token,
  amount,
  loading,
  errorTips,
  disabled,
  onClick,
  onRefresh,
  updater,
  children,
  buttonProps
}: any) {
  const { approve, approved, approving, checking, checkApproved } = useApprove({
    amount,
    token,
    spender,
    onSuccess: onRefresh
  });
  const { isPending: switching, switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { account, chainId } = useAccount();

  useEffect(() => {
    checkApproved();
  }, [updater, chainId, account]);

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

  if (approving) {
    return (
      <Button loading={true} disabled {...buttonProps}>
        Approving
      </Button>
    );
  }

  if (checking || loading) {
    return (
      <Button loading={true} disabled {...buttonProps}>
        {children}
      </Button>
    );
  }

  if (errorTips) {
    return (
      <Button disabled {...buttonProps}>
        {errorTips}
      </Button>
    );
  }

  if (!approved && spender) {
    return (
      <Button onClick={approve} {...buttonProps}>
        Approve {token?.symbol}
      </Button>
    );
  }

  return (
    <Button onClick={onClick} disabled={disabled} {...buttonProps}>
      {children}
    </Button>
  );
}
