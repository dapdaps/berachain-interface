import { Contract, utils } from "ethers";
import { useRequest } from "ahooks";
import { BAULT_ABI } from "../abi";
import useCustomAccount from "@/hooks/use-account";
import Big from "big.js";

export function useShares(props: any) {
  const { data, lpAmount } = props;
  const { account, provider } = useCustomAccount();

  const { tokenLp, baults, farm } = data ?? {};

  const { id: baultContractAddress, apy, blacklisted, price, totalAssets, totalSupply } = baults?.[0] ?? {};
  const { id: islandContractAddress, decimals: lpDecimals } = tokenLp ?? {};
  const { id: rewardVaultContractAddress } = farm ?? {};

  const exitFee = 3;
  const depositFee = 0;

  const { data: baultTokenShareAmount, loading: baultTokenShareAmountLoading } = useRequest(async () => {
    const result = {
      value: utils.parseUnits("0", lpDecimals),
      amount: "0",
    };
    if (!account || !provider || !baultContractAddress || !lpAmount || Big(lpAmount).lte(0)) return result;
    const contract = new Contract(baultContractAddress, BAULT_ABI, provider);
    let response: any;
    try {
      response = await contract.convertToShares(utils.parseUnits(lpAmount, lpDecimals));
      result.amount = utils.formatUnits(response, lpDecimals);
      result.value = response;
      return result;
    } catch (error) {
      console.log('convertToShares error: %o', error);
    }

    return result;
  }, { refreshDeps: [baultContractAddress, lpAmount, account, provider, lpDecimals] });

  return {
    baultTokenShareAmount,
    baultTokenShareAmountLoading,
    exitFee,
    depositFee,
    baultContractAddress,
    islandContractAddress,
    rewardVaultContractAddress,
    lpDecimals,
    lpAmount,
  };
}
