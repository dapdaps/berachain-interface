import useAccount from "@/hooks/use-account";
import useApprove from "@/hooks/use-approve";
import ConnectWalletButton from "../components/button/connect-wallet";
import SwitchNetworkButton from "../components/button/switch-network";
import { DEFAULT_CHAIN_ID } from "@/configs";
import BaseButton from "../components/button/base-button";
import { useEffect, useRef, useState } from "react";

const ActionButton = ({ spender, value, token }: any) => {
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
};

const ActionButtons = ({ spender, values, tokens, text, onClick }: any) => {
  const [showButton, setShowButton] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!buttonRef.current) return;
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          setShowButton(buttonRef.current?.childNodes.length === 0);
        }
      }
    });
    observer.observe(buttonRef.current, { childList: true });
  }, []);

  return (
    <>
      <div ref={buttonRef}>
        {tokens.map((token: any) => (
          <ActionButton
            key={token.address}
            spender={spender}
            value={values?.[token.address]}
            token={token}
          />
        ))}
      </div>
      {showButton && <BaseButton onClick={onClick}>{text}</BaseButton>}
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
