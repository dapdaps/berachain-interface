import { useEffect, useState } from 'react';

export function useList(): List {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    setTimeout(() => {
      const _list = [
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
          vaultAddress: "0xf99be47baf0c22b7eb5eac42c8d91b9942dc7e84"
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

  useEffect(() => {
    getData();
  }, []);

  return {
    listData: data,
    listLoading: loading,
  };
}

export interface List {
  listData: any;
  listLoading: boolean;
}
