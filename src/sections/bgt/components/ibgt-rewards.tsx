import { formatValueDecimal } from "@/utils/balance";
import Big from "big.js";
import clsx from "clsx";
import { memo, useMemo, useState } from "react";
import { ethers } from 'ethers';
import useCustomAccount from "@/hooks/use-account";
import { multicallWrite, multicallAddresses } from "@/utils/multicall";
import useToast from "@/hooks/use-toast";
import Loading from "@/components/loading";
import { usePriceStore } from "@/stores/usePriceStore";
export default memo(function IbgtRewards({
  rewards,
  onSuccess
}: {
  rewards: any,
  onSuccess: VoidFunction
}) {
  const toast = useToast()
  const prices = usePriceStore((store) => store.price);
  const { account, provider, chainId } = useCustomAccount()
  const multicallAddress = multicallAddresses[chainId];
  const [loading, setLoading] = useState(false)
  const count = useMemo(() => rewards?.reduce((acc, curr) => acc = Big(acc).plus(Big(curr?.earned ?? 0).times(prices?.[curr?.rewardSymbol] ?? 0)), 0), [rewards])
  const handleClaimAllRewards = async () => {
    const toastId = toast?.loading({
      title: `Claim All Rewards...`
    });
    const calls = []
    const abi = [{
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getRewardForUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }]
    const erc20Interface = new ethers.utils.Interface(abi);
    rewards?.forEach(reward => {
      calls.push({
        target: reward?.vaultAddress,
        allowFailure: true,
        callData: erc20Interface.encodeFunctionData('getRewardForUser', [account]),
      })
    })
    try {

      setLoading(true)
      const receipt = await multicallWrite({
        calls,
        provider,
        multicallAddress
      })
      const { status, transactionHash } = receipt;

      toast?.dismiss(toastId);
      toast?.success({
        title: "Claim Successful!"
      });

      setTimeout(() => {
        onSuccess?.();
      }, 1500);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast?.dismiss(toastId);
      toast?.fail({
        title: "Claim Failed!",
        text: error?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : error?.message ?? ""
      });
      throw Error(error)
    }
  }
  return (
    <div className="flex items-center gap-[8px] md:justify-between">
      <div className="flex items-center gap-[8px]">
        <div className="flex items-center min-w-[50px]">
          {
            rewards?.map((reward, index) => (
              <img className="w-[30px] h-[30px] rounded-full" style={{ objectPosition: "left center", marginLeft: -10 * index }} src={`/images/dapps/infrared/${reward?.rewardSymbol?.toLocaleLowerCase()}.svg`} alt={reward?.rewardSymbol} />
            ))
          }
        </div>
        <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">{formatValueDecimal(count, '$', 2)}</div>
      </div>
      <div className="cursor-pointer flex items-center justify-center md:w-[126px] w-[206px] md:h-[32px] h-[40px] rounded-[10px] border border-black bg-white text-black md:text-[12px] text-[16px] font-Montserrat font-semibold" onClick={handleClaimAllRewards}>
        {loading ? <Loading size={16} /> : "Claim All Rewards"}
      </div>
    </div>
  )
})