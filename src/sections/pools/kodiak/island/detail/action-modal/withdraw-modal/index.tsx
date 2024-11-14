import Basic from "../basic";
import Steps from "../steps";
import Button from "@/components/button";
import ModalLoading from "../loading";
import AllowancePanel from "../allowance-panel";
import WithdrawPanel from "./withdraw-panel";
import SelectPanel from "./select-panel";
import { useEffect, useMemo, useState } from "react";
import useApprove from "@/hooks/use-approve";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function WithdrawModal({
  data,
  info,
  amount,
  amount0,
  amount1,
  open,
  onClose,
  onSuccess
}: any) {
  const [step, setStep] = useState(1);
  const [withdrawData, setWithdrawData] = useState<any>({});

  const token = useMemo(
    () => ({
      address: data.id,
      symbol: data.symbol,
      chainId: DEFAULT_CHAIN_ID,
      decimals: 18,
      icon: data.icon
    }),
    [data]
  );

  const { approved, approve, approving, checking, allowance } = useApprove({
    token,
    amount,
    isMax: true,
    spender: data.router,
    onSuccess() {}
  });

  useEffect(() => {
    let _step = 1;
    if (approved) _step++;
    setStep(_step);
  }, [approved]);

  return (
    <Basic title={"Withdraw from Island"} open={open} onClose={onClose}>
      <Steps num={3} active={step} className="mt-[20px]" />
      {checking ? (
        <ModalLoading title="Checking Allowance" />
      ) : !approved ? (
        <>
          <AllowancePanel amount={amount} allowance={allowance} token={token} />
          <Button
            loading={approving}
            type="primary"
            className="w-full h-[46px] mt-[16px]"
            onClick={approve}
          >
            Approve {token.symbol}
          </Button>
        </>
      ) : (
        <>
          {step === 2 && (
            <SelectPanel
              amount={amount}
              amount0={amount0}
              amount1={amount1}
              info={info}
              data={data}
              onSuccess={(data: any) => {
                setStep(3);
                setWithdrawData(data);
              }}
            />
          )}
          {step === 3 && (
            <WithdrawPanel
              data={data}
              totalSupply={info.totalSupply}
              amounts={withdrawData}
              onSuccess={onSuccess}
            />
          )}
        </>
      )}
    </Basic>
  );
}
