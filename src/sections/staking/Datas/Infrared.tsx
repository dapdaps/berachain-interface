// @ts-nocheck
import Big from "big.js";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { bera } from "@/configs/tokens/bera";
import { asyncFetch } from "@/utils/http";

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

  const MulticallContract =
    multicallAddress &&
    new ethers.Contract(multicallAddress, MULTICALL_ABI, provider?.getSigner());
  const multicallv2 = (abi, calls, options, onSuccess, onError) => {
    const { requireSuccess, ...overrides } = options || {};
    const itf = new ethers.utils.Interface(abi);
    const calldata = calls.map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf?.encodeFunctionData(call.name, call.params)
    }));
    MulticallContract?.callStatic
      .tryAggregate(requireSuccess || true, calldata, overrides)
      .then((res) => {
        onSuccess(
          res.map((call, i) => {
            const [result, data] = call;
            return result && data !== "0x"
              ? itf.decodeFunctionResult(calls[i].name, data)
              : null;
          })
        );
      })
      .catch((err) => {
        onError?.(err);
      });
  };

  function formatedData() {
    onLoad({
      dataList: dataList?.filter(
        (data) =>
          ["bex", "kodiak", "beraborrow", "berps", "honeypot", "dolomite"].includes(
            data?.initialData?.protocol?.id
          ) || data?.id === "iBGT-HONEY"
      ),
      fullDataList: dataList
    });
  }

  async function getIbgtData() {
    return await asyncFetch("https://dev-api.beratown.app/infrared?path=api%2Fvault%2Finfrared-ibgt-v2&params=chainId%3D80094")
  }
  async function getDataList() {
    allData?.forEach((item) => {
      if (!["kodiak", "dolomite", "bex"].includes(item?.protocol?.id)) return;
      item?.reward_tokens?.forEach((it: any) => {
        const curr = Object.values(bera).find(
          (_it) => _it.address.toLowerCase() === it.address.toLowerCase()
        );
        if (!curr) return;
        it.icon = curr.icon;
      });
      let tokensInfo: any = {
        tokens: [],
        images: []
      };
      item.underlying_tokens?.forEach((slip: any, i: number) => {
        tokensInfo[`decimals${i}`] = slip.decimals;
        tokensInfo.tokens.push(slip.name);
        tokensInfo.images.push(slip.image);
      });
      const _data = {
        id: tokensInfo.tokens?.join("-"),
        strategy: "Dynamic",
        strategy2: "",
        ...tokensInfo,
        decimals: item.stake_token.decimals,
        LP_ADDRESS: item.stake_token.address,
        tvl: Big(item?.tvl || 0).toFixed(),
        apy: Big(item?.apr || 0)
          .times(100)
          .toFixed(),
        initialData: item,
        type: "Staking",
        vaultAddress: item.address,
        rewardSymbol: item?.reward_tokens?.[0]?.symbol,
        protocolType: ["bex", "kodiak"].includes(item?.protocol?.id)
          ? "AMM"
          : "Perpetuals"
      };
      dataList.push(_data);
    });
    const ibgt = await getIbgtData()

    console.log('====ibgt', ibgt)
    dataList.push({
      id: 'iBGT-HONEY',
      tokens: ['iBGT'],
      images: ['/images/dapps/infrared/ibgt.svg'],
      decimals: 18,
      decimals0: 18,
      decimals1: 18,

      LP_ADDRESS: '0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b',
      vaultAddress: '0x75F3Be06b02E235f6d0E7EF2D462b29739168301',
      tvl: Big(ibgt?.tvl || 0).toFixed(),
      apy: Big(ibgt?.apr || 0),
      initialData: ibgt,
      type: "Staking",
      rewardSymbol: "Honey",
      protocolType: "-"
    })
    formatedData("dataList");
  }
  function getUsdDepositAmount() {
    const calls = [];
    dataList.forEach((data) => {
      const _address = ethers.utils.getAddress(data.vaultAddress);
      calls.push({
        address: _address,
        name: "balanceOf",
        params: [sender]
      });
    });
    multicallv2(
      ERC20_ABI,
      calls,
      {},
      (result) => {
        for (let i = 0; i < dataList.length; i++) {
          const element = dataList[i];
          dataList[i].depositAmount = Big(
            ethers.utils.formatUnits(result?.[i]?.[0] ?? 0)
          ).toFixed();
          dataList[i].usdDepositAmount = Big(
            ethers.utils.formatUnits(result?.[i]?.[0] ?? 0)
          )
            .times(element?.initialData?.stake_token?.price ?? 0)
            .toFixed();
        }
        formatedData("getUsdDepositAmount");
      },
      (error) => {
        console.log("=error", error);
      }
    );
  }

  function getEarned() {
    const calls = [];
    dataList.forEach((data) => {
      calls.push({
        address: ethers.utils.getAddress(data.vaultAddress),
        name: "earned",
        params: [
          sender,
          data?.id === "iBGT-HONEY"
            ? "0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce"
            : IBGT_ADDRESS
        ]
      });
    });

    multicallv2(
      ERC20_ABI,
      calls,
      {},
      (result) => {
        for (let i = 0; i < dataList.length; i++) {
          const element = dataList[i];
          dataList[i].earned = Big(
            ethers.utils.formatUnits(result?.[i]?.[0] ?? 0)
          ).toFixed();
        }
        formatedData("getEarned");
      },
      (error) => {
        console.log("=error", error);
      }
    );
  }

  useEffect(() => {
    if (name !== "Infrared" || !allData) return;
    getDataList().then(() => {
      if (sender && provider) {
        getUsdDepositAmount();
        getEarned();
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
