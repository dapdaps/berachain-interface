import Input from "@/sections/pools/components/deposit-amounts/input";
import SwitchTabs from "@/components/switch-tabs";
import Button from "@/components/button";
import Loading from "@/components/loading";
import DepositOnly from "../action-modal/deposit-modal";
import SwitchNetworkButton from "@/sections/pools/components/button/switch-network";
import ConnectWalletButton from "@/sections/pools/components/button/connect-wallet";
import { useState, useMemo } from "react";
import useDepositAmount from "../../hooks/use-deposit-amount";
import { useDebounceFn } from "ahooks";
import { balanceFormated } from "@/utils/balance";
import Big from "big.js";
import useCustomAccount from "@/hooks/use-account";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function Deposit({ data, info, onSuccess }: any) {
  const [type, setType] = useState("deposit");
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [balance0, setBalance0] = useState("");
  const [balance1, setBalance1] = useState("");
  const [receives, setReceives] = useState<any>();
  const { account, chainId } = useCustomAccount();
  const { querying, queryAmounts } = useDepositAmount(data, info);

  const errorTips = useMemo(() => {
    if (!amount0 || !amount1) return "Enter an amount";
    if (Big(balance0 || 0).lt(amount0) || Big(balance1 || 0).lt(amount1))
      return "Insufficient Balance";
    return "";
  }, [amount0, amount1, balance0, balance1]);

  const { run: runQuoter } = useDebounceFn(
    () => {
      queryAmounts({
        amount0,
        amount1,
        cb(amounts: any) {
          setAmount0(amounts.amount0);
          setAmount1(amounts.amount1);
          setReceives({
            received: amounts.received,
            miniReceived: amounts.miniReceived
          });
        }
      });
    },
    {
      wait: 500
    }
  );

  return (
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
      <div className="rounded-[12px] border-[#373A53] border p-[14px] mt-[10px] text-[14px] text-[#3D405A] font-medium">
        <div className="flex justify-between items-start">
          <div>Estimated Received</div>
          {querying ? (
            <Loading />
          ) : (
            <div className="text-right">
              <div>
                {receives?.received
                  ? balanceFormated(receives.received, 5)
                  : "-"}{" "}
                {data.symbol}
              </div>
              <div>
                (${" "}
                {receives?.received && data.tokenLp.price
                  ? balanceFormated(
                      Big(receives.received).mul(data.tokenLp.price).toString(),
                      5
                    )
                  : "-"}
                )
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-start mt-[12px]">
          <div>Minimum Received</div>
          {querying ? (
            <Loading />
          ) : (
            <div className="text-right">
              <div>
                {receives?.miniReceived
                  ? balanceFormated(receives.miniReceived, 5)
                  : "-"}{" "}
                {data.symbol}
              </div>
              {receives?.miniReceived && data.tokenLp.price && (
                <div>
                  (${" "}
                  {balanceFormated(
                    Big(receives.miniReceived)
                      .mul(data.tokenLp.price)
                      .toString(),
                    5
                  )}
                  )
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {!!data.farm?.id && (
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
          >
            {errorTips || "Supply"}
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
