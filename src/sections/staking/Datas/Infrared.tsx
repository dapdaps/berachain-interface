// @ts-nocheck
import Big from "big.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { bera } from "@/configs/tokens/bera";
import { asyncFetch, post } from "@/utils/http";
import { multicall } from "@/utils/multicall";
import MATCHED_VAULTS from "../config/infrared/matchedVaults";
export default function useInfraredData(props: any) {
  const {
    name,
    sender,
    provider,
    allData,
    onLoad,
    multicallAddress,
    IBGT_ADDRESS,
    IBGT_VAULT_ADDRESS
  } = props;
  const dataList = [];

  const [reloadCount, setReloadCount] = useState(0);
  

  const MULTICALL_ABI = [
    {
      inputs: [
        { internalType: "bool", name: "requireSuccess", type: "bool" },
        {
          components: [
            { internalType: "address", name: "target", type: "address" },
            { internalType: "bytes", name: "callData", type: "bytes" }
          ],
          internalType: "struct Multicall2.Call[]",
          name: "calls",
          type: "tuple[]"
        }
      ],
      name: "tryAggregate",
      outputs: [
        {
          components: [
            { internalType: "bool", name: "success", type: "bool" },
            { internalType: "bytes", name: "returnData", type: "bytes" }
          ],
          internalType: "struct Multicall2.Result[]",
          name: "returnData",
          type: "tuple[]"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    }
  ];

  const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    {
      constant: true,
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address"
        },
        {
          internalType: "address",
          name: "_rewardsToken",
          type: "address"
        }
      ],
      name: "earned",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "shareToAssetsPrice",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "currentEpoch",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "currentEpochStart",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "marketCap",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        }
      ],
      name: "completeBalanceOfAssets",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        }
      ],
      name: "completeBalanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        }
      ],
      name: "totalSharesBeingWithdrawn",
      outputs: [
        {
          internalType: "uint256",
          name: "shares",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ];

  function formatedData() {
    onLoad({
      dataList: dataList?.filter(
        (data) =>
          [
            "bex",
            "kodiak",
            "beraborrow",
            "berps",
            "honeypot",
            "dolomite"
          ].includes(data?.protocol) || data?.id === "iBGT"
      ),
      fullDataList: dataList
    });
  }

  async function getIbgtData(rewardTokens: any) {
    // return await asyncFetch(
    //   `${process.env.NEXT_PUBLIC_API}/api/infrared?path=api%2Fbackend-vaults%2Finfrared-ibgt&params=chainId%3D80094`
    // );

    const addresses = ['0x75f3be06b02e235f6d0e7ef2d462b29739168301'];
    const bera = [
      '0xac03caba51e17c86c921e1f6cbfbdc91f8bb2e6b',
      ...rewardTokens?.map((token: any) => token.address).filter((token: any) => token.toLowerCase() !== '0xac03caba51e17c86c921e1f6cbfbdc91f8bb2e6b'.toLowerCase()),
    ]

    const pricesRes = await post(
      `${process.env.NEXT_PUBLIC_API}/api/go/infrared`,
      {
        "params": {
          addresses: bera,
          includeSevenDayPriceChange: false
        },
        "path": "/api/prices?chainId=80094"
      }
    )

    const res = await post(
      `${process.env.NEXT_PUBLIC_API}/api/go/infrared`,
      {
        "params": {
          addresses: addresses,
        },
        "path": "/api/backend-vaults?chainId=80094"
      }
    )

    const item = res[addresses[0]];

    return {
      tvl: item.tvlBreakdown.infrared,
      apr: Object.values(item.aprBreakdown.infrared).reduce((acc, curr) => acc + curr.apr, 0),
      depositTokenPrice: pricesRes[bera[0]]?.price || 0,
      pointsMultiplier: item.pointsMultiplier,
      tokenPrices: pricesRes
    }
  }
  async function getDataList() {

    allData?.forEach((item) => {
      const [protocol, ...restSlug] = item?.slug?.split("-");
      const poolName = restSlug.join("-");
      if (!["kodiak", "dolomite", "bex"].includes(protocol)) return;
      // item?.rewardTokens?.forEach((it: any) => {
      //   const curr = Object.values(bera).find(
      //     (_it) => _it.address.toLowerCase() === it.address.toLowerCase()
      //   );
      //   if (!curr) return;
      //   it.icon = curr.icon;
      // });
      // let tokensInfo: any = {
      //   tokens: [],
      //   images: []
      // };

      // if (item?.underlyingTokens?.length > 1) {
      //   item.underlyingTokens
      //     ?.filter((token) => !!token)
      //     ?.forEach((slip: any, i: number) => {
      //       tokensInfo[`decimals${i}`] = slip.decimals;
      //       tokensInfo.tokens.push(slip.name);
      //       tokensInfo.images.push(slip.image);
      //     });
      // } else {
      //   tokensInfo.tokens.push(item?.underlyingTokens?.[0]?.name);
      //   tokensInfo.images.push(item?.underlyingTokens?.[0]?.image);
      // }

      const _data = {
        id: item.name,
        strategy: "Dynamic",
        strategy2: "",
        images: item.images,
        tokens: item.tokens,
        tvl: Big(item?.tvl || 0).toFixed(),
        poolName: item.name,
        apy: Big(item?.apy || 0)
          .times(100)
          .toFixed(),
        initialData: item.initialData,
        type: "Staking",
        vaultAddress: item.vaultAddress,
        rewardSymbol: item?.rewards?.[0]?.symbol,
        platform: "infrared",
        protocol,
        protocolType: ["bex", "kodiak"].includes(protocol)
          ? "AMM"
          : "Perpetuals"
      };
      dataList.push(_data);
    });
    
    // const _ibgtRewardTokens = ibgt?.rewardTokens?.filter?.((_token: any) => _token.address.toLowerCase() !== bera["ibgt"].address.toLowerCase());
    const ibgtVaultAddress = '0x75F3Be06b02E235f6d0E7EF2D462b29739168301'
    const ibgtRewardTokens = MATCHED_VAULTS.find((item: any) => item.vaultsAddress.toLowerCase() === ibgtVaultAddress.toLowerCase())
    const ibgt = await getIbgtData(ibgtRewardTokens?.rewardTokens);

    dataList.unshift({
      id: "iBGT",
      tokens: ["iBGT"],
      images: ["/images/dapps/infrared/ibgt.svg"],
      decimals: 18,
      decimals0: 18,
      decimals1: 18,
      LP_ADDRESS: "0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b",
      vaultAddress: ibgtVaultAddress,
      rewardSymbol: ibgtRewardTokens?.rewardTokens?.[0]?.symbol,
      tvl: Big(ibgt?.tvl || 0).toFixed(),
      apy: Big(ibgt?.apr || 0)
        .times(100)
        .toFixed(),
      initialData: {
        ...ibgt,
        rewardTokens: ibgtRewardTokens?.rewardTokens.map((token: any) => ({
          ...token,
          image: 'https://infrared.finance' + token.image,
          price: ibgt.tokenPrices[token.address.toLowerCase()]?.price
        })),
        stakeTokenPrice: ibgt.depositTokenPrice,
      },
      type: "Staking",
      platform: "infrared",
      protocolType: "-",
      protocol: "infrared"
    });

    formatedData("dataList");
  }
  async function getUsdDepositAmount() {
    const calls = [];
    dataList.forEach((data) => {
      const _address = ethers.utils.getAddress(data.vaultAddress);
      calls.push({
        address: _address,
        name: "balanceOf",
        params: [sender]
      });
    });
    const result = await multicall({
      abi: ERC20_ABI,
      calls,
      options: {},
      multicallAddress,
      provider
    });

    for (let i = 0; i < dataList.length; i++) {
      const element = dataList[i];
      dataList[i].depositAmount = Big(
        ethers.utils.formatUnits(result?.[i]?.[0] ?? 0)
      ).toFixed();
      dataList[i].usdDepositAmount = Big(
        ethers.utils.formatUnits(result?.[i]?.[0] ?? 0)
      )
        .times(element?.initialData?.stakeTokenPrice ?? 0)
        .toFixed();
    }
    formatedData("getUsdDepositAmount");
  }
  async function getRewardsEarned(vaultAddress, tokens) {
    const calls = [];
    tokens?.forEach((reward_token) => {
      calls.push({
        address: ethers.utils.getAddress(vaultAddress),
        name: "earned",
        params: [sender, reward_token?.address]
      });
    });
    try {
      const result = await multicall({
        abi: ERC20_ABI,
        options: {},
        calls,
        multicallAddress,
        provider
      });
      const rewards = [];
      for (let i = 0; i < result.length; i++) {
        const earned = result?.[i]
          ? Big(ethers.utils.formatUnits(result[i][0])).toFixed()
          : 0;
        if (Big(earned).gt(0))
          rewards.push({
            ...tokens[i],
            earned
          });
      }
      return rewards;
    } catch (error) {
      console.log(error);
    }
  }
  async function getRewards() {
    const promiseArray = [];
    dataList?.forEach((data) => {
      promiseArray.push(
        getRewardsEarned(data?.vaultAddress, data?.initialData?.rewardTokens)
      );
    });
    const result = await Promise.all(promiseArray);
    for (let i = 0; i < result.length; i++) {
      dataList[i].rewards = result[i];
    }
    formatedData(getRewards);
  }

  useEffect(() => {
    if (name !== "Infrared" || !allData) return;
    getDataList().then(() => {
      if (sender && provider) {
        getRewards();
        getUsdDepositAmount();
      }
    });
  }, [allData, sender, provider, reloadCount]);

  return {
    reload: () => {
      setReloadCount(reloadCount + 1);
    },
    getDataList
  };
}
