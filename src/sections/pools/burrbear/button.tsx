import useAccount from "@/hooks/use-account";
import useApprove from "@/hooks/use-approve";
import ConnectWalletButton from "../components/button/connect-wallet";
import SwitchNetworkButton from "../components/button/switch-network";
import { DEFAULT_CHAIN_ID } from "@/configs";
import BaseButton from "../components/button/base-button";
import { useState } from "react";

const ActionButton = ({ spender, value, token, onLoad }: any) => {
  const { approve, approved, approving, checking } = useApprove({
    amount: value,
    token,
    spender
  });

  if (checking) {
    return <BaseButton disabled loading={true} />;
  }

  if (!approved && value) {
    return (
      <BaseButton onClick={approve} loading={approving} disabled={approving}>
        {`Approve ${token.symbol}`}
      </BaseButton>
    );
  }
  onLoad(true);
  return null;
};

const ActionButtons = ({ spender, values, tokens, text, onClick }: any) => {
  const [count, setCount] = useState(0);
  return (
    <>
      {tokens.map((token: any) => (
        <ActionButton
          spender={spender}
          value={values[token.address]}
          token={token}
          onLoad={() => {
            setCount((prev) => prev + 1);
          }}
        />
      ))}
      {count === tokens.length && (
        <BaseButton onClick={onClick}>{text}</BaseButton>
      )}
    </>
  );
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

  if (loading) {
    return <BaseButton disabled loading={true} />;
  }

  return <ActionButtons {...rest} />;
};

export default AddButton;
