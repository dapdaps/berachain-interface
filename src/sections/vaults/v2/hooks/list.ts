import { useEffect, useState } from "react";
import { ORDER_DIRECTION, ORDER_KEYS } from "@/sections/vaults/v2/config";

export function useList(): List {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [orderKey, setOrderKey] = useState<ORDER_KEYS>(ORDER_KEYS.TVL);
  const [orderDirection, setDirection] = useState<ORDER_DIRECTION>(
    ORDER_DIRECTION.DESC
  );
  const [filterVisible, setFilterVisible] = useState(false);

  const getData = async () => {
    setLoading(true);
    setTimeout(() => {
      const _list = [
        {
          tokens: [
            {
              icon: "/assets/tokens/honey.svg",
              symbol: "HONEY",
              decimals: 18,
              address: "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce"
            },
            {
              icon: "/assets/tokens/usdc.png",
              symbol: "USDC.e",
              decimals: 6,
              address: "0x549943e04f40284185054145c6E4e9568C1D3241"
            }
          ],
          protocol: "Bex",
          tvl: "308320000",
          apy: "0.16",
          rewards: [
            {
              address: "0x46eFC86F0D7455F135CC9df501673739d513E982",
              decimals: 18,
              symbol: "iBGT",
              name: "Infrared BGT",
              icon: "/assets/tokens/ibgt.png",
              apy: "11.42",
              claim: "2999999.123"
            },
            {
              address: "0xbaadcc2962417c01af99fb2b7c75706b9bd6babe",
              symbol: "LBGT",
              name: "Liquid BGT",
              decimals: 18,
              icon: "/assets/tokens/lbgt.png",
              apy: "14.55"
            }
          ],
          balance: "20.34",
          token: {
            symbol: "HONEY-USDC.e",
            address: "0xF961a8f6d8c69E7321e78d254ecAfBcc3A637621",
            decimals: 18
          },
          vaultAddress: "0xf99be47baf0c22b7eb5eac42c8d91b9942dc7e84",
          id: "0xf961a8f6d8c69e7321e78d254ecafbcc3a637621000000000000000000000001",
          poolType: "COMPOSABLE_STABLE"
        },
        {
          tokens: [
            {
              icon: "/assets/tokens/honey.svg",
              symbol: "HONEY",
              decimals: 18
            },
            {
              icon: "/assets/tokens/usdc.png",
              symbol: "USDC.e",
              decimals: 6
            }
          ],
          protocol: "Berps",
          tvl: "30800",
          apy: "0.30",
          balance: "20.34"
        }
      ];
      setData(_list);
      setLoading(false);
    }, 1000);
  };

  const toggleOrder = (key: ORDER_KEYS) => {
    if (key === orderKey) {
      setDirection(
        orderDirection === ORDER_DIRECTION.DESC
          ? ORDER_DIRECTION.ASC
          : ORDER_DIRECTION.DESC
      );
    } else {
      setOrderKey(key);
      setDirection(ORDER_DIRECTION.DESC);
    }
  };

  const toggleFilterVisible = (_filterVisible?: boolean) => {
    setFilterVisible(
      typeof _filterVisible === "boolean" ? _filterVisible : !filterVisible
    );
  };

  useEffect(() => {
    getData();
  }, []);

  return {
    listData: data,
    listLoading: loading,
    listOrderKey: orderKey,
    listOrderDirection: orderDirection,
    toggleListOrder: toggleOrder,
    listFilterVisible: filterVisible,
    toggleListFilterVisible: toggleFilterVisible
  };
}

export interface List {
  listData: any;
  listLoading: boolean;
  listOrderKey: ORDER_KEYS;
  listOrderDirection: ORDER_DIRECTION;
  toggleListOrder: (key: ORDER_KEYS) => void;
  listFilterVisible: boolean;
  toggleListFilterVisible: (filterVisible?: boolean) => void;
}
