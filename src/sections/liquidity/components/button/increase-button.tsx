import useAccount from '@/hooks/use-account';
import useApprove from '@/hooks/use-approve';
import ConnectWalletButton from './connect-wallet';
import SwitchNetworkButton from './switch-network';
import { DEFAULT_CHAIN_ID } from '@/configs';
import BaseButton from './base-button';

const ActionButton = ({
  onClick,
  text,
  value0,
  value1,
  token0,
  token1,
  spender
}: any) => {
  const {
    approve: handleToken0Approve,
    approved: value0Approved,
    approving: value0Approving,
    checking: value0Checking
  } = useApprove({
    amount: value0,
    token: token0,
    spender
  });

  const {
    approve: handleToken1Approve,
    approved: value1Approved,
    approving: value1Approving,
    checking: value1Checking
  } = useApprove({
    amount: value1,
    token: token1,
    spender
  });

  if (value0Checking || value1Checking) {
    return <BaseButton disabled loading={true} />;
  }

  if (!value0Approved && value0 && !value1Approved && value1) {
    return (
      <div className='flex items-center gap-[20px]'>
        <BaseButton
          onClick={handleToken0Approve}
          loading={value0Approving}
          disabled={value0Approving}
        >
          {`Approve ${token0.symbol}`}
        </BaseButton>
        <BaseButton
          onClick={handleToken1Approve}
          loading={value1Approving}
          disabled={value1Approving}
        >
          {`Approve ${token1.symbol}`}
        </BaseButton>
      </div>
    );
  }

  if (!value0Approved && value0) {
    return (
      <BaseButton
        onClick={handleToken0Approve}
        loading={value0Approving}
        disabled={value0Approving}
      >
        {`Approve ${token0.symbol}`}
      </BaseButton>
    );
  }

  if (!value1Approved && value1) {
    return (
      <BaseButton
        onClick={handleToken1Approve}
        loading={value1Approving}
        disabled={value1Approving}
      >
        {`Approve ${token1.symbol}`}
      </BaseButton>
    );
  }

  return <BaseButton onClick={onClick}>{text}</BaseButton>;
};

const AddButton = ({ errorTips, loading, ...rest }: any) => {
  const { account, chainId } = useAccount();

  if (!account || !chainId) {
    return <ConnectWalletButton />;
  }

  if (chainId !== DEFAULT_CHAIN_ID) {
    return <SwitchNetworkButton />;
  }

  if (errorTips) {
    return <BaseButton disabled>{errorTips}</BaseButton>;
  }

  if (!rest.token0 || !rest.token1) {
    return <BaseButton disabled>Select Token</BaseButton>;
  }

  if (loading) {
    return <BaseButton disabled loading={true} />;
  }

  return <ActionButton {...rest} />;
};

export const CreateButton = ({ text, loading, onClick }: any) => {
  const { account, chainId } = useAccount();
  if (!account || !chainId) {
    return <ConnectWalletButton />;
  }

  if (chainId !== DEFAULT_CHAIN_ID) {
    return <SwitchNetworkButton />;
  }
  if (loading) {
    return <BaseButton disabled loading={true} />;
  }

  return <BaseButton onClick={onClick}>{text || 'Create Pair'}</BaseButton>;
};

export default AddButton;
