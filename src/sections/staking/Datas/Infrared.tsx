// @ts-nocheck
import Big from 'big.js';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { beraB } from '@/configs/tokens/bera-bArtio';
import { asyncFetch } from '@/utils/http';

const IBGT_VAULT_ADDRESS = "0x31e6458c83c4184a23c761fdaffb61941665e012"
export default function useInfraredData(props: any) {
  const {
    name,
    pairs,
    sender,
    provider,
    addresses,
    allData,
    onLoad,
    multicallAddress,
    IBGT_ADDRESS,
  } = props;
  const dataList = [];

  const [reloadCount, setReloadCount] = useState(0);

  const MULTICALL_ABI = [
    {
      inputs: [
        { internalType: 'bool', name: 'requireSuccess', type: 'bool' },
        {
          components: [
            { internalType: 'address', name: 'target', type: 'address' },
            { internalType: 'bytes', name: 'callData', type: 'bytes' }
          ],
          internalType: 'struct Multicall2.Call[]',
          name: 'calls',
          type: 'tuple[]'
        }
      ],
      name: 'tryAggregate',
      outputs: [
        {
          components: [
            { internalType: 'bool', name: 'success', type: 'bool' },
            { internalType: 'bytes', name: 'returnData', type: 'bytes' }
          ],
          internalType: 'struct Multicall2.Result[]',
          name: 'returnData',
          type: 'tuple[]'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ];

  const ERC20_ABI = [
    'function balanceOf(address) view returns (uint256)',
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_rewardsToken',
          type: 'address'
        }
      ],
      name: 'earned',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      "inputs": [],
      "name": "shareToAssetsPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentEpoch",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentEpochStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "marketCap",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "completeBalanceOfAssets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "completeBalanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "totalSharesBeingWithdrawn",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "shares",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
  ];

  const MulticallContract = multicallAddress && new ethers.Contract(multicallAddress, MULTICALL_ABI, provider?.getSigner());
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
            return result && data !== '0x'
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
      dataList: dataList?.filter(data => ['bex', 'kodiak', 'beraborrow', 'berps', 'honeypot'].includes(data?.initialData?.protocol?.id) || data?.id !== "iBGT-HONEY"),
      fullDataList: dataList
    });
  }
  async function getIbgtData() {
    try {
      const result = await asyncFetch("/api.infrared.finance/vault/infrared-ibgt")
      const data = result?.vault
      const pair = pairs?.find(pair => addresses[pair?.id] === IBGT_VAULT_ADDRESS) ?? {}
      return {
        ...pair,
        tvl: Big(data?.tvl).toFixed(),
        apy: Big(data?.apr).times(100).toFixed(),
        vaultAddress: IBGT_VAULT_ADDRESS,
        initialData: data,
        type: 'Staking',
        rewardSymbol: data?.reward_tokens?.[0]?.symbol,
        protocolType:
          data?.protocol?.id === 'bex' ? 'AMM' : 'Perpetuals'
      }
    } catch (error) {
      console.error(error)
    }
  }
  async function getDataList() {
    for (const pair of pairs) {
      const vaultAddress = addresses[pair?.id];
      const findIndex = allData?.findIndex(
        (data) =>
          data?.address.toLocaleLowerCase() ===
          vaultAddress?.toLocaleLowerCase()
      );
      if (findIndex > -1) {
        const initialData = allData[findIndex];
        initialData?.reward_tokens?.forEach((it: any) => {
          const curr = Object.values(beraB).find((_it) => _it.address.toLowerCase() === it.address.toLowerCase());
          if (!curr) return;
          it.icon = curr.icon;
        });
        const _data = {
          ...pair,
          name,
          tvl: Big(initialData?.tvl).toFixed(),
          apy: Big(initialData?.apr).times(100).toFixed(),
          initialData,
          type: 'Staking',
          vaultAddress,
          rewardSymbol: initialData?.reward_tokens?.[0]?.symbol,
          protocolType:
            initialData?.protocol?.id === 'bex' ? 'AMM' : 'Perpetuals'
        };
        dataList.push(_data);
      }
    }
    const ibgtData = await getIbgtData()
    dataList.push(ibgtData)
    formatedData('dataList');
  }
  function getUsdDepositAmount() {
    const calls = [];
    dataList.forEach((data) => {
      const _address = ethers.utils.getAddress(addresses[data?.id]);
      calls.push({
        address: _address,
        name: 'balanceOf',
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
        formatedData('getUsdDepositAmount');
      },
      (error) => {
        console.log('=error', error);
      }
    );
  }

  function getEarned() {
    const calls = [];
    dataList.forEach((data) => {
      calls.push({
        address: ethers.utils.getAddress(addresses[data?.id]),
        name: 'earned',
        params: [
          sender,
          data?.id === 'iBGT-HONEY'
            ? '0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03'
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
            ethers.utils.formatUnits(result[i][0])
          ).toFixed();
        }
        formatedData('getEarned');
      },
      (error) => {
        console.log('=error', error);
      }
    );
  }

  useEffect(() => {
    if (name !== 'Infrared' || !allData) return;
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
