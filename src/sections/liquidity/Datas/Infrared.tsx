// @ts-nocheck
import Big from 'big.js';
import { ethers } from 'ethers';
import { useEffect } from 'react';


export default function useInfraredData(props: any) {
  const {
    pairs,
    sender,
    provider,
    addresses,
    allData,
    onLoad,
    multicallAddress,
    IBGT_ADDRESS
  } = props;
  const dataList = [];

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
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_rewardsToken",
          "type": "address"
        }
      ],
      "name": "earned",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }

  ];
  const MulticallContract = multicallAddress && new ethers.Contract(multicallAddress, MULTICALL_ABI, provider?.getSigner());
  const multicallv2 = (abi, calls, options, onSuccess, onError) => {
    const { requireSuccess, ...overrides } = options || {};
    const itf = new ethers.utils.Interface(abi);
    const calldata = calls.map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf?.encodeFunctionData(call.name, call.params)
    }));
    MulticallContract.callStatic
      .tryAggregate(requireSuccess || true, calldata, overrides)
      .then((res) => {
        onSuccess(
          res.map((call, i) => {
            const [result, data] = call;
            return result && data !== '0x' ? itf.decodeFunctionResult(calls[i].name, data) : null;
          })
        );
      })
      .catch((err) => {
        onError?.(err);
      });
  };

  function formatedData() {
    onLoad({
      dataList
    });
  }
  function getDataList() {
    pairs.forEach((pair) => {

      const vaultAddress = addresses[pair?.id]
      const findIndex = allData?.findIndex(
        (data) => data?.address.toLocaleLowerCase() === vaultAddress?.toLocaleLowerCase()
      );
      if (findIndex > -1) {

        const initialData = allData[findIndex]

        dataList.push({
          ...pair,
          tvl: Big(ethers.utils.formatUnits(initialData?.current_staked_amount))
            .times(initialData?.stake_token?.price ?? 0)
            .toFixed(),
          apy: initialData?.apy_percentage,
          initialData,
          type: "Staking",
          vaultAddress,
          rewardSymbol: initialData?.reward_tokens?.[0]?.symbol,
          protocolType: initialData?.pool?.protocol === 'BEX' ? 'AMM' : 'Perpetuals',
        });
      }
    });
    formatedData('dataList');
  }
  function getUsdDepositAmount() {
    const calls = []
    dataList.forEach(data => {
      calls.push({
        address: ethers.utils.getAddress(addresses[data?.id]),
        name: 'balanceOf',
        params: [sender]
      })
    })
    multicallv2(
      ERC20_ABI,
      calls,
      {},
      (result) => {
        for (let i = 0; i < dataList.length; i++) {
          const element = dataList[i];
          dataList[i].depositAmount = Big(ethers.utils.formatUnits(result[i][0])).toFixed()
          dataList[i].usdDepositAmount = Big(ethers.utils.formatUnits(result[i][0])).times(element?.initialData?.stake_token?.price).toFixed()
        }
        formatedData('getUsdDepositAmount')
      },
      (error) => {
        console.log('=error', error);
      }
    )
  }

  function getEarned() {
    const calls = []
    dataList.forEach(data => {
      calls.push({
        address: ethers.utils.getAddress(addresses[data?.id]),
        name: 'earned',
        params: [sender, IBGT_ADDRESS]
      })
    })

    multicallv2(
      ERC20_ABI,
      calls,
      {},
      (result) => {
        for (let i = 0; i < dataList.length; i++) {
          const element = dataList[i];
          dataList[i].earned = Big(ethers.utils.formatUnits(result[i][0])).toFixed()
        }

        console.log('====dataList', dataList)
        formatedData('getEarned')
      },
      (error) => {
        console.log('=error', error);
      }
    )
  }

  useEffect(() => {
    console.log('====sender', sender)
    if (allData && sender) {
      getDataList();
      getUsdDepositAmount()
      getEarned()
    }
    return function () {
      console.log('====销毁=====')
    }
  }, [allData, sender]);
}