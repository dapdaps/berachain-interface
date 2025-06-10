import useApprove from '@/hooks/use-approve';
import { useAccount, useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Button from '@/components/button';
import type { Chain, Token } from '@/types';
import Big from 'big.js';
import { useEffect, useState } from 'react';
import useToast from '@/hooks/use-toast';
import { TokenInfo } from '@/sections/Lending/Bend/hooks/useBend';

const BendingButton = ({
  chain,
  token,
  amount,
  loading,
  disabled,
  children,
  style,
  type,
  provider,
  gas,
  approving,
  approved,
  approve,
  onClick
}: Props) => {
  const toast = useToast();
  const { isPending, switchChain } = useSwitchChain();
  const modal = useConnectModal();
  const { address, chainId } = useAccount();

  const [pending, setPending] = useState(false);
  const [isGasEnough, setIsGasEnough] = useState(true);

  useEffect(() => {
    if (!children || !address || !gas) return;
    provider.getBalance(address).then((rawBalance: any) => {
      setIsGasEnough(!Big(rawBalance.toString()).lt(gas.toString()));
    });
  }, [address, gas, children]);

  if (!amount || Big(amount).eq(0)) {
    return (
      <Button
        type={type}
        style={style}
        disabled={loading || disabled}
        loading={loading}
      >
        Enter An Amount
      </Button>
    );
  }

  if (!address || !chainId) {
    return (
      <Button
        type={type}
        onClick={() => {
          modal.openConnectModal?.();
        }}
        style={style}
        disabled={loading || disabled}
        loading={loading}
      >
        Connect wallet
      </Button>
    );
  }

  if (chainId !== chain.chainId) {
    return (
      <Button
        type={type}
        onClick={() => {
          switchChain({
            chainId: chain.chainId as number,
          });
        }}
        loading={isPending || loading}
        disabled={loading || disabled}
        style={style}
      >
        Switch Network
      </Button>
    );
  }

  if (!isGasEnough) {
    return (
      <Button
        type={type}
        style={style}
        disabled={loading || disabled}
        loading={loading}
      >
        Not enough gas
      </Button>
    );
  }


  if (approved) {
    return (
      <Button
        type={type}
        loading={approving}
        onClick={approve}
        disabled={approving || disabled}
        style={style}
      >
        Approve {token?.symbol}
      </Button>
    );
  }



  return (
    <Button
      type={type}
      onClick={onClick}
      loading={approving || loading || pending}
      disabled={approving || loading || disabled || pending}
      style={style}
    >
      {children}
    </Button>
  );
};

export default BendingButton;

interface Props {
  chain: Partial<Chain>;
  token: TokenInfo;
  amount: string;
  loading?: boolean;
  disabled?: boolean;
  children?: any;
  style?: React.CSSProperties;
  type?: 'default' | 'primary';
  provider: any;
  gas: any;
  config: any;
  approving: boolean;
  approved: boolean;
  approve: () => void;
  onClick: () => void;
}
