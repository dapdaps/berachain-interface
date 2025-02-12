import Input from "@/sections/pools/components/deposit-amounts/input";
import SwitchTabs from "@/components/switch-tabs";
import Button from "@/components/button";
import DepositOnly from "../../action-modal/deposit-modal";
import SwitchNetworkButton from "@/sections/pools/components/button/switch-network";
import ConnectWalletButton from "@/sections/pools/components/button/connect-wallet";
import ReceivedPanel from "./received-panel";
import { useState, useMemo, useEffect } from "react";
import useDepositAmount from "../../../hooks/use-deposit-amount";
import { useDebounceFn } from "ahooks";
import Big from "big.js";
import useCustomAccount from "@/hooks/use-account";
import SingleInput from "./single-input";
import { DEFAULT_CHAIN_ID } from "@/configs";
import useQuoteSingleAmount from "../../../hooks/use-quote-single-amount";

export default function Deposit({ data, info, onSuccess }: any) {
  const [type, setType] = useState("deposit");
  const [mode, setMode] = useState("double");
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [balance0, setBalance0] = useState("");
  const [balance1, setBalance1] = useState("");
  const [receives, setReceives] = useState<any>();
  const { account, chainId } = useCustomAccount();
  const [singleIndex, setSingleIndex] = useState(0);
  const { querying, queryAmounts } = useDepositAmount({
    islandContract: data.id,
    token0: data.token0,
    token1: data.token1
  });
  const { loading: singleQuoting, queryAmounts: querySingleAmounts } =
    useQuoteSingleAmount(data, queryAmounts);
  const [errorTips, setErrorTips] = useState("");

  const setAmounts = (amounts: any) => {
    setAmount0(amounts.amount0);
    setAmount1(amounts.amount1);
    setReceives({
      received: amounts.received,
      miniReceived: amounts.miniReceived
    });
  };

  const { run: runQuoter } = useDebounceFn(
    () => {
      queryAmounts({
        amount0,
        amount1,
        cb: setAmounts
      });
    },
    {
      wait: 500
    }
  );

  const { run: singleQuoter } = useDebounceFn(
    (amount: string, index: number) => {
      querySingleAmounts(amount, index, setAmounts);
      setSingleIndex(index);
    },
    { wait: 500 }
  );

  useEffect(() => {
    if (mode === "single") {
      return;
    }
    if (!amount0 || !amount1) {
      setErrorTips("Enter an amount");
      return;
    }
    if (Big(balance0 || 0).lt(amount0) || Big(balance1 || 0).lt(amount1)) {
      setErrorTips("Insufficient Balance");
      return;
    }
    setErrorTips("");
  }, [amount0, amount1, balance0, balance1, mode]);
  return (
    <>
      <SwitchTabs
        tabs={[
          { label: "Double-sided", value: "double" },
          { label: "Single-sided", value: "single" }
        ]}
        current={mode}
        onChange={setMode}
        className="mt-[14px] !h-[40px] !p-[3px_4px] !bg-[#DFDCC4] md:!border-none md:!bg-transparent md:!p-0"
        cursorClassName="md:!rounded-[10px]"
        tabClassName="font-semibold md:font-medium"
      />
      {mode === "double" ? (
        <>
          <Input
            value={amount0}
            readOnly
            token={data.token0}
            className="mt-[16px]"
            setValue={(val: any) => {
              setAmount0(val);
              setAmount1("");
              runQuoter();
            }}
            onLoad={setBalance0}
          />
          <Input
            value={amount1}
            readOnly
            token={data.token1}
            className="mt-[16px]"
            setValue={(val: any) => {
              setAmount1(val);
              setAmount0("");
              runQuoter();
            }}
            onLoad={setBalance1}
          />
        </>
      ) : (
        <SingleInput
          data={data}
          setErrorTips={setErrorTips}
          singleQuoter={singleQuoter}
        />
      )}
      <ReceivedPanel {...{ querying, receives, data }} />
      {!!data.farmAddress && (
        <SwitchTabs
          tabs={[
            { label: "Deposit only", value: "deposit" },
            { label: "With staking", value: "staking" }
          ]}
          current={type}
          onChange={setType}
          className="mt-[14px] !h-[40px] !p-[3px_4px] !bg-[#DFDCC4] md:!border-none md:!bg-transparent md:!p-0"
          cursorClassName="md:!rounded-[10px]"
          tabClassName="font-semibold md:font-medium"
        />
      )}
      {account ? (
        chainId !== DEFAULT_CHAIN_ID ? (
          <SwitchNetworkButton className="!h-[46px]" />
        ) : (
          <Button
            disabled={!!errorTips}
            type="primary"
            className="w-full h-[46px] mt-[16px]"
            onClick={() => {
              setShowModal(true);
            }}
            loading={singleQuoting}
          >
            {singleQuoting ? "Preparing Zap" : errorTips || "Supply"}
          </Button>
        )
      ) : (
        <ConnectWalletButton className="!h-[46px]" />
      )}

      {showModal && (
        <DepositOnly
          data={data}
          info={info}
          amount0={amount0}
          amount1={amount1}
          open={showModal}
          received={receives?.received}
          type={type}
          mode={mode}
          singleIndex={singleIndex}
          onClose={() => {
            setShowModal(false);
          }}
          onSuccess={() => {
            setShowModal(false);
            onSuccess();
          }}
        />
      )}
    </>
  );
}
