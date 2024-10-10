import useAccount from '@/hooks/use-account';
import useApprove from '@/hooks/use-approve';
import ConnectWalletButton from './connect-wallet';
import SwitchNetworkButton from './switch-network';
import { DEFAULT_CHAIN_ID } from '@/configs';
import BaseButton from './base-button';

const ActionButton = ({ onClick, text, value, token, spender }: any) => {
  const {
    approve: handleTokenApprove,
    approved: valueApproved,
    approving: valueApproving,
    checking: valueChecking
  } = useApprove({
    amount: value,
    token: token,
    spender,
    isSkip: !spender
  });

  if (valueChecking) {
    return <BaseButton loading={valueChecking} disabled />;
  }

  if (!valueApproved && token) {
    return (
      <BaseButton
        onClick={handleTokenApprove}
        loading={valueApproving}
        disabled={valueApproving}
      >
        Approve {token.symbol}
      </BaseButton>
    );
  }

  return <BaseButton onClick={onClick}>{text}</BaseButton>;
};

const RemoveButton = (props: any) => {
  const { account, chainId } = useAccount();
  const { errorTips, loading } = props;
  if (!account || !chainId) {
    return <ConnectWalletButton />;
  }

  if (chainId !== DEFAULT_CHAIN_ID) {
    return <SwitchNetworkButton />;
  }

  if (errorTips) {
    return <BaseButton disabled>{errorTips}</BaseButton>;
  }

  if (loading) {
    return <BaseButton disabled loading={true} />;
  }

  return <ActionButton {...props} />;
};

export default RemoveButton;
