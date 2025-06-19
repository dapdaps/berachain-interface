import { usePriceStore } from "@/stores/usePriceStore";
import Big from "big.js";
export default function useMergeDataList() {
  const prices = usePriceStore((store) => store.price);
  const getMergeDataList = ({
    infrared,
    aquaBera
  }: {
    infrared: any;
    aquaBera: any;
  }) => {
    const _dataList: any[] = [];
    infrared?.forEach((_data: any) => {
      _dataList.push({
        ..._data,
        pool: {
          name: _data?.poolName || "iBGT",
          protocol: _data?.protocol
        },
        platform: "infrared"
      });
    });
    aquaBera?.forEach((_data: any) => {
      const images: any[] = [];
      const tokens: any[] = [];
      _data?.tokens?.forEach((token: any) => {
        images.push(token?.icon);
        tokens.push(token?.symbol);
      });
      _dataList.push({
        ..._data,
        images,
        // tokens,
        apy: _data?.apr,
        type: "Staking",
        depositAmount: _data.yourValue,
        usdDepositAmount: _data.usdDepositAmount,
        platform: "aquabera",
        poolName: _data?.id,
        pool: {
          name: _data?.id,
          protocol: "aquabera"
        }
      });
    });

    return _dataList;
  };

  return {
    getMergeDataList
  };
}
