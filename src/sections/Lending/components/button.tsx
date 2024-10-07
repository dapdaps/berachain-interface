import useApprove from '@/hooks/use-approve';
import { useAccount, useSwitchChain } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import Button from '@/components/button';
import type { Chain, Token } from '@/types';
import Big from 'big.js';

const LendingButton = ({
  chain,
  spender,
  token,
  amount,
  loading,
  disabled,
  onClick,
  children,
  style,
  type,
  isSkipApproved,
}: Props) => {
  const { approve, approved, approving, checking } = useApprove({
    amount,
    token,
    spender,
    isSkip: isSkipApproved,
  });
  const { isPending, switchChain } = useSwitchChain();
  const modal = useWeb3Modal();
  const { address, chainId } = useAccount();

  if (!amount || Big(amount).eq(0)) {
    return (
      <Button
        type={type}
        style={style}
        disabled={loading || disabled}
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
          modal.open();
        }}
        style={style}
        disabled={loading || disabled}
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
        loading={isPending}
        disabled={loading || disabled}
        style={style}
      >
        Switch Network
      </Button>
    );
  }

  if (!approved) {
    return (
      <Button
        type={type}
        loading={checking || approving || loading}
        onClick={approve}
        disabled={checking || approving || loading || disabled}
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
      loading={checking || approving || loading}
      disabled={checking || approving || loading || disabled}
      style={style}
    >
      {children}
    </Button>
  );
};

export default LendingButton;

interface Props {
  chain: Partial<Chain>;
  spender: string;
  token: Token;
  amount: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?(): void;
  children?: any;
  style?: React.CSSProperties;
  type?: 'default' | 'primary';
  isSkipApproved?: boolean;
}
