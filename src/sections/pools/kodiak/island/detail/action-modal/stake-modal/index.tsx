import Basic from "../basic";
import Steps from "../steps";
import LockTimePanel from "../deposit-modal/lock-time-panel";
import ApprovePanel from "../deposit-modal/approve-panel";
import StakePanel from "../deposit-modal/stake-panel";
import { useMemo, useState } from "react";

export default function StakeModal({
  data,
  info,
  open,
  liquidity,
  onClose,
  onSuccess
}: any) {
  const [step, setStep] = useState(1);
  const [lockData, setLockData] = useState();

  const title = useMemo(() => {
    if (step === 2) return "Select Lock Time";
    if (step === 3)
      return (
        <div className="flex gap-[16px] items-center">
          <button
            onClick={() => {
              setStep(2);
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
    return "Stake Liquidity";
  }, [step]);

  return (
    <Basic title={title} open={open} onClose={onClose}>
      <Steps num={3} active={step} className="mt-[20px]" />
      <>
        {step === 1 && (
          <ApprovePanel
            data={data}
            amount={liquidity}
            onSuccess={() => {
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <LockTimePanel
            data={data}
            info={info}
            received={liquidity}
            onClick={(lock: any) => {
              setLockData(lock);
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <StakePanel
            data={data}
            amount={liquidity}
            lockData={lockData}
            onSuccess={onSuccess}
          />
        )}
      </>
    </Basic>
  );
}
