import useApprove from '@/hooks/use-approve';
import { useAccount, useSwitchChain } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import Button from '@/components/button';
import type { Chain, Token } from '@/types';

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

  if (!address || !chainId) {
    return (
      <Button
        type={type}
        onClick={() => {
          modal.open();
        }}
        style={style}
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
