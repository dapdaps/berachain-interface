"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import RemovePercent from "../components/remove-percent";
import RemoveAmount from "../bex/remove-amount";
import RemoveButton from "../components/button/remove-button";
import RemoveInput from "../bex/remove-input";
import SwitchTabs from "@/components/switch-tabs";
import TokenSelector from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs/index";
import useAccount from "@/hooks/use-account";
import chains from "@/configs/chains";
import useRemove from "./use-remove";

const Remove = ({ data, onSuccess, from }: any) => {
  const [percent, setPercent] = useState(0);
  const [type, setType] = useState(1);

  const [exitAmount, setExitAmount] = useState("");
  const [showTokensModal, setShowTokenModal] = useState(false);
  const { account, chainId } = useAccount();

  const {
    loading: removing,
    amounts,
    balanceLoading,
    exitToken,
    setExitToken,
    onRemove
  } = useRemove({
    data,
    percent,
    type,
    exitAmount,
    from,
    onSuccess: () => {
      onSuccess();
    }
  });

  const errorTips = useMemo(() => {
    if (!percent) return "Select a percent";
    return "";
  }, [percent]);

  useEffect(() => {
    if (!data) return;
    setExitToken(data.tokens[0]);
  }, [data]);

  return (
    <>
      <SwitchTabs
        tabs={[
          { label: "Proportional pool tokens", value: 1 },
          { label: "Single token", value: 0 }
        ]}
        style={{
          height: 40,
          padding: 4
        }}
        tabStyle={{
          fontSize: 14
        }}
        onChange={(val) => {
          setType(val);
        }}
        current={type}
        className="md:bg-[#DFDCC4] md:border-none md:rounded-[12px]"
        cursorClassName="md:rounded-[12px]"
      />
      {type === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <RemovePercent percent={percent} setPercent={setPercent} />
          <RemoveAmount
            tokens={data.tokens}
            percent={percent}
            amounts={amounts}
          />
          <RemoveButton
            text="Remove Liquidity"
            loading={removing}
            onClick={onRemove}
            errorTips={errorTips}
          />
        </motion.div>
      )}
      {type === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-[20px]"
        >
          <RemoveInput
            amount={exitAmount}
            currency={exitToken}
            onCurrencySelectOpen={() => {
              setShowTokenModal(true);
            }}
            onAmountChange={(val: any) => {
              setExitAmount(val);
            }}
            balanceLoading={balanceLoading}
            tokenBalance={amounts[exitToken.address]}
          />
          <RemoveButton
            text="Remove Liquidity"
            loading={removing}
            onClick={onRemove}
            errorTips={exitAmount ? "" : "Select a percent"}
          />
        </motion.div>
      )}
      <TokenSelector
        display={showTokensModal}
        chainIdNotSupport={chainId !== DEFAULT_CHAIN_ID}
        selectedTokenAddress={exitToken?.address}
        chainId={DEFAULT_CHAIN_ID}
        tokens={data.tokens}
        account={account}
        explor={chains[DEFAULT_CHAIN_ID].blockExplorers.default.url}
        showBalance={false}
        onClose={() => {
          setShowTokenModal(false);
        }}
        onSelect={(token: any) => {
          setExitToken(token);
          setExitAmount("");
        }}
        showSearch={false}
      />
    </>
  );
};

export default memo(Remove);
