import Basic from "../basic";
import Steps from "../steps";
import Button from "@/components/button";
import ModalLoading from "../loading";
import AllowancePanel from "../allowance-panel";
import SupplyPanel from "./supply-panel";
import LockTimePanel from "./lock-time-panel";
import ApprovePanel from "./approve-panel";
import StakePanel from "./stake-panel";
import { useEffect, useMemo, useState } from "react";
import useApprove from "@/hooks/use-approve";

export default function DepositModal({
  data,
  info,
  amount0,
  amount1,
  open,
  received,
  type,
  onClose,
  onSuccess
}: any) {
  const [step, setStep] = useState(1);
  const [lockData, setLockData] = useState();
  const {
    approved: token0Approved,
    approve: token0Approve,
    approving: token0Approving,
    checking: token0Checking,
    allowance: token0Allowance
  } = useApprove({
    token: data.token0,
    amount: amount0,
    isMax: true,
    spender: data.router,
    onSuccess() {}
  });
  const {
    approved: token1Approved,
    approve: token1Approve,
    approving: token1Approving,
    checking: token1Checking,
    allowance: token1Allowance
  } = useApprove({
    token: data.token1,
    amount: amount1,
    isMax: true,
    spender: data.router,
    onSuccess() {}
  });

  const title = useMemo(() => {
    if (step === 2 && type === "deposit") return "Confirm Deposit";
    if (step === 3 && type === "staking") return "Select Lock Time";
    if (step === 4)
      return (
        <div className="flex gap-[16px] items-center">
          <button
            onClick={() => {
              setStep(3);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="16"
              viewBox="0 0 9 16"
              fill="none"
            >
              <path
                d="M6.80078 2L2.00078 8L6.80078 14"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span>Confirm Deposit</span>
        </div>
      );
    if (step === 6) return "Confirm Stake";
    return "Deposit Liquidity to Island";
  }, [step, type, data]);

  useEffect(() => {
    let _step = 1;
    if (token0Approved) _step++;
    if (token1Approved) _step++;
    setStep(_step);
  }, [token0Approved, token1Approved]);

  return (
    <Basic title={title} open={open} onClose={onClose}>
      <Steps
        num={type === "deposit" ? 3 : 6}
        active={step}
        className="mt-[20px]"
      />
      {token0Checking || token1Checking ? (
        <ModalLoading title="Checking Allowance" />
      ) : !token0Approved ? (
        <>
          <AllowancePanel
            amount={amount0}
            allowance={token0Allowance}
            token={data.token0}
          />
          <Button
            loading={token0Approving}
            type="primary"
            className="w-full h-[46px] mt-[16px]"
            onClick={token0Approve}
          >
            Approve {data.token0.symbol}
          </Button>
        </>
      ) : !token1Approved ? (
        <>
          <AllowancePanel
            amount={amount1}
            allowance={token1Allowance}
            token={data.token1}
          />
          <Button
            loading={token1Approving}
            type="primary"
            className="w-full h-[46px] mt-[16px]"
            onClick={token1Approve}
          >
            Approve {data.token1.symbol}
          </Button>
        </>
      ) : (
        <>
          {type === "deposit" && step === 3 && (
            <SupplyPanel
              data={data}
              amount0={amount0}
              amount1={amount1}
              received={received}
              onSuccess={onSuccess}
            />
          )}
          {type === "staking" && step === 3 && (
            <LockTimePanel
              data={data}
              info={info}
              received={received}
              onClick={(lock: any) => {
                setLockData(lock);
                setStep(4);
              }}
            />
          )}
          {type === "staking" && step === 4 && (
            <SupplyPanel
              data={data}
              amount0={amount0}
              amount1={amount1}
              received={received}
              type="staking"
              onSuccess={() => {
                setStep(5);
              }}
            />
          )}
          {type === "staking" && step === 5 && (
            <ApprovePanel
              data={data}
              amount={received}
              onSuccess={() => {
                setStep(6);
              }}
            />
          )}
          {type === "staking" && step === 6 && (
            <StakePanel
              data={data}
              amount={received}
              lockData={lockData}
              onSuccess={onSuccess}
              info={info}
            />
          )}
        </>
      )}
    </Basic>
  );
}
