import useApprove from '@/hooks/use-approve';
import { useAccount, useSwitchChain } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import Button from '@/components/button';
import type { Chain, Token } from '@/types';
import Big from 'big.js';
import { useEffect, useState } from 'react';
import useToast from '@/hooks/use-toast';

const LendingButton = ({
  chain,
  spender,
  token,
  amount,
  loading,
  disabled,
  children,
  style,
  type,
  isSkipApproved,
  onSuccess,
  onApprovedSuccess,
  provider,
  unsignedTx,
  gas,
  config,
  addAction,
  isApproveMax,
}: Props) => {
  const toast = useToast();
  const { approve, approved, approving, checking } = useApprove({
    amount,
    token,
    spender,
    isSkip: isSkipApproved,
    isMax: isApproveMax,
    onSuccess: () => {
      onApprovedSuccess && onApprovedSuccess();
    },
  });
  const { isPending, switchChain } = useSwitchChain();
  const modal = useWeb3Modal();
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
          modal.open();
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

  const handleSubmit = () => {
    if (pending) return;
    const toastId = toast?.loading({
      title: `Submitting ${token?.symbol} ${children.toLowerCase()} request...`
    });
    setPending(true);
    provider
      .getSigner()
      .sendTransaction(unsignedTx)
      .then((tx: any) => {
        const handleSucceed = (res: any) => {
          const { status, transactionHash } = res;
          toast?.dismiss(toastId);
          setPending(false);
          addAction?.({
            type: 'Lending',
            action: children,
            token: token,
            amount,
            template: config.name,
            add: false,
            status,
            transactionHash
          });
          if (status === 1) {
            onSuccess?.();
            toast?.success({
              title: `${token?.symbol} ${children.toLowerCase()} request succeed!`,
              tx: transactionHash,
              chainId
            });
          } else {
            toast?.fail({
              title: `${token?.symbol} ${children.toLowerCase()} request failed!`,
              tx: transactionHash,
              chainId
            });
          }
        };
        tx.wait()
          .then((res: any) => {
            handleSucceed(res);
          })
          .catch((err: any) => {
            console.log('tx.wait failure: %o', err);
            // fix#-32000 transaction indexing is in progress
            if (err?.code === -32000) {
              const timer = setTimeout(async () => {
                clearTimeout(timer);
                // try again
                try {
                  const res: any = await tx.wait();
                  handleSucceed(res);
                } catch (_err: any) {
                  setPending(false);
                  onSuccess?.();
                  toast?.dismiss(toastId);
                  toast?.success({
                    title: `${token?.symbol} ${children.toLowerCase()} request successed!`,
                    chainId
                  });
                }
              }, 10000);
              return;
            }
            setPending(false);
            console.log('sendTransaction tx.wait failure: %o', err);
            toast?.dismiss(toastId);
            toast?.fail({
              title: err?.message?.includes('user rejected transaction')
                ? 'User rejected transaction'
                : `${token?.symbol} ${children.toLowerCase()} request failed!`,
              tx: err ? err.hash : '',
              chainId
            });
          });
      })
      .catch((err: any) => {
        setPending(false);
        console.log('sendTransaction failure: %o', err);
        toast?.dismiss(toastId);
        toast?.fail({
          title: err?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : `${token?.symbol} ${children.toLowerCase()} request failed!`,
          tx: err ? err.hash : '',
          chainId
        });
      });
  };

  return (
    <Button
      type={type}
      onClick={handleSubmit}
      loading={checking || approving || loading || pending}
      disabled={checking || approving || loading || disabled || pending}
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
  onSuccess?(): void;
  onApprovedSuccess?(): void;
  children?: any;
  style?: React.CSSProperties;
  type?: 'default' | 'primary';
  isSkipApproved?: boolean;
  provider: any;
  unsignedTx: any;
  gas: any;
  config: any;
  addAction?: any;
  isApproveMax?: boolean;
}
