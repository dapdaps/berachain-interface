"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import RemovePercent from "../components/remove-percent";
import RemoveAmount from "./remove-amount";
import RemoveButton from "../components/button/remove-button";
import RemoveInput from "./remove-input";
import SwitchTabs from "@/components/switch-tabs";
import useRemove from "./use-remove";

const Remove = ({ data, onSuccess }: any) => {
  const [percent, setPercent] = useState(0);
  const [type, setType] = useState(1);
  const [exitToken, setExitToken] = useState<any>();
  const [exitAmount, setExitAmount] = useState("");
  const [showTokensModal, setShowTokenModal] = useState(false);

  const {
    loading: removing,
    tokenBalance,
    balanceLoading,
    onRemove,
    onQuerySingleAmountOut
  } = useRemove({
    data,
    percent,
    type,
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
    setTimeout(() => {
      console.log("timer", 35);
      onQuerySingleAmountOut(data.tokens[0]);
    }, 3000);
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
          <RemoveAmount tokens={data.tokens} percent={percent} />
          <RemoveButton
            text="Remove Liquidity"
            loading={removing}
            onClick={onRemove}
            errorTips={errorTips}
          />
        </motion.div>
      )}
      {type === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <RemoveInput
            amount={exitAmount}
            currency={exitToken}
            onCurrencySelectOpen={() => {}}
            onAmountChange={(val: any) => {
              setExitAmount(val);
            }}
            tokenBalance={tokenBalance}
            balanceLoading={balanceLoading}
          />
        </motion.div>
      )}
    </>
  );
};

export default memo(Remove);
