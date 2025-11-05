import { DEFAULT_CHAIN_ID } from "@/configs";
import multicallAddresses from "@/configs/contract/multicall";
import infraredConfig from "@/configs/staking/dapps/infrared";
import useCustomAccount from "@/hooks/use-account";
import { post } from "@/utils/http";
import { useEffect, useMemo, useState } from "react";
import useInfraredData from "../Datas/Infrared";
import { useIbgtVaults } from "@/stores/ibgt-vaults";
import { useDebounceFn } from "ahooks";
import VAULTS from "../config/infrared/vaults";
import MATCHED_VAULTS from "../config/infrared/matchedVaults";
import NATIVE_TOKENS from "../config/infrared/native-tokens";

export default function useInfraredList(updater?: number, name?: string) {
  const { chainId, account: sender, provider } = useCustomAccount();
  // @ts-ignore
  const infraredDexConfig = infraredConfig.chains[DEFAULT_CHAIN_ID];
  const { ALL_DATA_URL, IBGT_ADDRESS, IBGT_VAULT_ADDRESS } = infraredDexConfig;
  const ibgtVaults: any = useIbgtVaults();
  const [maxApr, setMaxApr] = useState(0);
  const [allData, setAllData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<any>(null);
  const [fullDataList, setFullDataList] = useState<any>(null);

  const multicallAddress = useMemo(
    () => chainId && multicallAddresses[chainId],
    [chainId]
  );

  const { run: debounceFetchAllData } = useDebounceFn(
    () => {
      !loading && fetchAllData();
    },
    {
      wait: 300
    }
  );
  async function fetchAllData() {
    setLoading(true);

    const priceAddresses = MATCHED_VAULTS.map((vault) => vault.depositTokenAddress)

    const pricesRes = await post(
      `${process.env.NEXT_PUBLIC_API}/api/go/infrared`,
      {
        "params": {
          addresses: priceAddresses,
          includeSevenDayPriceChange: false
        },
        "path": "/api/prices?chainId=80094"
      }
    )

    post(
      `${process.env.NEXT_PUBLIC_API}/api/go/infrared`,
      {
        "params": VAULTS,
        "path": "/api/backend-vaults?chainId=80094"
      }
    ).then((res) => {
      const allData: any = []
      let maxApr = 0

      for (const key in res) {
        const item = res[key]
        const newItem: any = {}
        const matchedVault = MATCHED_VAULTS.find((matchedVault) => matchedVault.vaultsAddress.toLowerCase() === key.toLowerCase())
        if (!matchedVault) {
          continue
        }

        const infraredApy = Object.values(item.aprBreakdown?.infrared || {}).reduce((acc, curr: any) => acc + curr.apr, 0)
        const operatorApy = Object.values(item.aprBreakdown?.operator || {}).reduce((acc, curr: any) => acc + curr.apr, 0)
        if (item.aprBreakdown?.depositToken && item.aprBreakdown?.depositToken.apr) {
          newItem.apy = item.aprBreakdown?.depositToken.apr + infraredApy
        } else {
          newItem.apy = operatorApy || 0
        }
        newItem.vaultAddress = key
        newItem.tvl = item.tvlBreakdown.infrared
        newItem.protocol = matchedVault.matchedToken.protocol
        newItem.images = ['https://infrared.finance' + matchedVault.matchedToken.image]
        const tokens: any = []

        matchedVault.matchedToken.name.split('-').forEach((token: any) => {
          const nativeToken = NATIVE_TOKENS.find((nativeToken) => nativeToken.symbol.toLowerCase() === token.toLowerCase())
          if (nativeToken) {
            tokens.push({
              name: nativeToken.name,
              symbol: nativeToken.symbol,
              decimals: nativeToken.decimals,
              image: 'https://infrared.finance' + nativeToken.image,
              address: nativeToken.address
            })
          } 
        })

        newItem.name = matchedVault.matchedToken.name
        newItem.slug = matchedVault.slug
        newItem.initialData = {
          pointsMultiplier: item.pointsMultiplier,
          stakeTokenPrice: pricesRes[matchedVault.depositTokenAddress]?.price || 0,
          underlyingTokens: tokens,
          rewardTokens: matchedVault.rewardTokens.map((rewardToken: any) => ({
            ...rewardToken,
            image: 'https://infrared.finance' + rewardToken.image,
            price: pricesRes[rewardToken.address]?.price || 0
          }))
        }

        if (newItem.apy > maxApr) {
          maxApr = newItem.apy
        }

        allData.push(newItem)
      }

      setAllData(allData);
      setMaxApr(maxApr);
    });
  }

  const { reload } = useInfraredData({
    name: name || infraredConfig.name,
    sender,
    provider,
    allData,
    multicallAddress,
    IBGT_ADDRESS,
    IBGT_VAULT_ADDRESS,
    onLoad: (data: any) => {
      const ibgt = data.dataList.filter((item: any) => item.id === "iBGT" && !item.protocol);
      if (ibgt && ibgt.length > 0) {
        ibgt[0].protocol = "infrared";
      }

      setDataList([...data.dataList]);
      setFullDataList([...data.fullDataList]);
      setLoading(false);
      ibgtVaults.set({ vaults: [...data.dataList] });
    }
  });

  useEffect(() => {
    debounceFetchAllData();
  }, [updater]);

  return {
    loading,
    dataList,
    fullDataList,
    maxApr,
    fetchAllData,
    reload
  };
}
