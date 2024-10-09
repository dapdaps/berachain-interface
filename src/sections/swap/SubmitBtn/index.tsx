import Loading from '@/components/circle-loading';
import useApprove from '@/hooks/use-approve';
import useAccount from '@/hooks/use-account';
import { useSwitchChain } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect } from 'react';

const BaseButton = ({ loading, onClick, children, disabled = false }: any) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className='h-[60px] w-full duration-500 hover:opacity-70 active:opacity-90 flex items-center justify-center border border-[#000000] rounded-[10px] bg-[#FFDC50] text-[18px] font-[600] mt-[16px] cursor-pointer'
    >
      {loading ? <Loading /> : children}
    </button>
  );
};

export default function SubmitBtn({
  chain,
  spender,
  token,
  amount,
  loading,
  errorTips,
  disabled,
  onClick,
  onRefresh,
  updater
}: any) {
  const { approve, approved, approving, checking, checkApproved } = useApprove({
    amount,
    token,
    spender,
    onSuccess: onRefresh
  });
  const { isPending: switching, switchChain } = useSwitchChain();
  const { open } = useWeb3Modal();
  const { account, chainId } = useAccount();

  useEffect(() => {
    checkApproved();
  }, [updater]);

  if (!account || !chainId) {
    return (
      <BaseButton
        chain={chain}
        onClick={() => {
          open();
        }}
      >
        Connect wallet
      </BaseButton>
    );
  }

  if (chainId !== chain.chainId) {
    return (
      <BaseButton
        onClick={() => {
          switchChain({
            chainId: chain.chainId
          });
        }}
        loading={switching}
      >
        Switch Network
      </BaseButton>
    );
  }

  if (checking || approving || loading) {
    return <BaseButton loading={true} disabled />;
  }

  if (errorTips) {
    return <BaseButton disabled>{errorTips}</BaseButton>;
  }

  if (!spender) return <BaseButton disabled>Insufficient Liquidity</BaseButton>;

  if (!approved) {
    return <BaseButton onClick={approve}>Approve {token?.symbol}</BaseButton>;
  }

  return (
    <BaseButton onClick={onClick} disabled={disabled}>
      Swap
    </BaseButton>
  );
}
