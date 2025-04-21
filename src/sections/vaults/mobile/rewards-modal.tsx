import Modal from "@/components/modal";
import Image from "next/image";
import { formatValueDecimal } from "@/utils/balance";
import Button from "@/sections/pools/components/button/remove-button";
import useInfraredClaim from "@/sections/staking/hooks/use-infrared-claim";

export default function ClaimModal({ show, onClose, data, onSuccess }: any) {
  const { loading, onClaim } = useInfraredClaim({
    amount: data.earned,
    tokens: data.tokens,
    data,
    vaultAddress: data.vaultAddress,
    onSuccess() {
      onClose();
      onSuccess();
    }
  });

  return (
    <Modal open={show} onClose={onClose} closeIconClassName="md:hidden">
      <div className="bg-[#FFFDEB] px-[15px] py-[20px] rounded-t-[20px]">
        <div className="text-[18px] font-bold">Reward</div>
        <div className="flex items-center gap-[8px] mt-[20px]">
          <div className="flex items-center gap-[6px] shrink-0">
            <div className="text-[16px] font-semibold">{data.rewardSymbol}</div>
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
          <div className="h-px border-b border-dashed	grow border-[#373A53]" />
          <div className="text-[16px] font-semibold">
            {formatValueDecimal(data?.earned, "", 2, true, false)}
          </div>
        </div>

        <div className="mt-[25px]">
          <Button
            text="Claim"
            errorTips=""
            loading={loading}
            onClick={onClaim}
          />
        </div>
      </div>
    </Modal>
  );
}
