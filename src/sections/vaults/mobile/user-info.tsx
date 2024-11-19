import Image from "next/image";
import { formatValueDecimal } from "@/utils/balance";
import clsx from "clsx";
import Big from 'big.js';

const UserInfo = ({ data, className, onClaim }: any) => {
  const isBERPS = data?.name === 'Berps';

  return (
    <div className={clsx("flex items-center gap-[30px]", className)}>
      <div>
        <div className="text-[14px]">You {isBERPS ? 'Deposited' : 'Staked'}</div>
        <div className="mt-[3px] flex items-center gap-[3px]">
          <span className="text-[16px] font-semibold">
            {formatValueDecimal(data?.usdDepositAmount, "$", 2, true, false)}
          </span>
          <span className="text-[12px] font-medium">
             {
               isBERPS ? data?.withdrawToken?.symbol : `${data?.id || "iBGT"}-LP`
             }
          </span>
        </div>
      </div>
      {
        Big(data?.earned || 0).gt(0) && (
          <div>
            <div className="text-[14px]">Rewards</div>
            <div className="mt-[3px] flex items-center gap-[6px]">
          <span
            onClick={onClaim}
            className="text-[16px] font-semibold underline decoration-dashed"
          >
            {formatValueDecimal(data?.earned, "", 2, true, false)}
          </span>
              <span className="text-[12px] font-medium">
            {data.rewardSymbol === "iBGT" && (
              <Image
                src={"/images/dapps/infrared/ibgt.svg"}
                width={20}
                height={20}
                alt="Reward Token"
              />
            )}
                {data.rewardSymbol === "HONEY" && (
                  <Image
                    src={"/images/dapps/honey.png"}
                    width={20}
                    height={20}
                    alt="Reward Token"
                  />
                )}
          </span>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default UserInfo;
