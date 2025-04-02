import Button from "./index";
import useApprove from "@/hooks/use-approve";
import useAccount from "@/hooks/use-account";
import { useSwitchChain } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
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
  const { open } = useAppKit();
  const { account, chainId } = useAccount();

  useEffect(() => {
    checkApproved();
  }, [updater]);

  if (!account || !chainId) {
    return (
      <Button
        onClick={() => {
          open();
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

  if (checking || approving || loading) {
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
