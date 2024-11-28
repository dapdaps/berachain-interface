import { usePriceStore } from '@/stores/usePriceStore';
import Big from 'big.js';
export default function useMergeDataList() {
  const prices = usePriceStore(store => store.price);
  const getMergeDataList = ({
    infrared,
    aquaBera
  }: {
    infrared: any;
    aquaBera: any
  }) => {
    const _dataList = []
    infrared?.forEach((_data: any) => {
      _dataList.push({
        ..._data,
        pool: {
          name: _data?.initialData?.pool?.name || 'iBGT',
          protocol: _data?.initialData?.pool?.protocol
        },
        platform: "infrared"
      })
    })
    aquaBera?.forEach((_data: any) => {
      const _depositAmount = _data?.pairedTokens?.reduce((acc, curr) => Big(acc).plus(curr?.yourValue).toFixed(), Big(0))
      const _usdDepositAmount = _data?.pairedTokens?.reduce((acc, curr) => {
        const [amount0, amount1] = curr?.values
        const _usd = Big(Big(amount0).times(prices?.[_data?.symbol] ?? 0).plus(Big(amount1).times(prices?.[curr?.symbol] ?? 0))).div(prices["USDC"]).toFixed()
        return Big(acc).plus(_usd).toFixed()
      }, Big(0))
      _dataList.push({
        ..._data,
        images: [_data?.icon],
        tokens: [_data?.symbol],
        apy: _data?.maxApr,
        type: "Staking",
        depositAmount: _depositAmount,
        usdDepositAmount: _usdDepositAmount,
        platform: "aquabera",
        poolName: _data?.symbol,
        pool: {
          name: _data?.symbol,
          protocol: 'aquabera'
        },
      })
    })
    return _dataList
  }

  return {
    getMergeDataList
  }
}
