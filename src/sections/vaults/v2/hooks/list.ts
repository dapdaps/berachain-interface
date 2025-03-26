import { useEffect, useMemo, useState } from "react";
import {
  StrategyPool,
  ORDER_DIRECTION,
  ORDER_KEYS,
  SPECIAL_VAULTS, FILTER_KEYS, FilterItem, SUPPORTED_PROTOCOLS, SPECIAL_PROTOCOLS, FILTERS
} from '@/sections/vaults/v2/config';
import { BASE_URL } from "@/utils/http";
import useCustomAccount from "@/hooks/use-account";
import axios from "axios";
import { getDappLogo, getTokenLogo } from "@/sections/dashboard/utils";
import kodiakConfig from "@/configs/pools/kodiak";
import Big from "big.js";
import { cloneDeep } from 'lodash';
import chains from '@/configs/chains';
import { Contract, providers, utils } from 'ethers';
import { TOKEN_ABI } from '@/hooks/use-token-balance';
import { bera } from '@/configs/tokens/bera';

const DEFAULT_FILTER_SELECTED: Record<FILTER_KEYS, FilterItem[]> = {
  [FILTER_KEYS.ASSETS]: [],
  [FILTER_KEYS.REWARDS]: [],
  [FILTER_KEYS.PROTOCOLS]: [],
};

const DEFAULT_FILTER_ASSETS_BALANCE: { symbol?: string; balance: string; address?: string; decimals?: number; }[] = FILTERS.ASSETS.map((it) => ({
  ...it.token,
  balance: "0",
}));

export function useList(): List {
  const { account } = useCustomAccount();

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [orderKey, setOrderKey] = useState<ORDER_KEYS>(ORDER_KEYS.TVL);
  const [orderDirection, setDirection] = useState<ORDER_DIRECTION>(
    ORDER_DIRECTION.DESC
  );
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterSelected, setFilterSelected] = useState<Record<FILTER_KEYS, FilterItem[]>>(cloneDeep(DEFAULT_FILTER_SELECTED));
  const [availableAssets, setAvailableAssets] = useState(false);
  const [filterAssetsBalance, setFilterAssetsBalance] = useState(cloneDeep(DEFAULT_FILTER_ASSETS_BALANCE));
  const [filterAssetsBalanceLoading, setFilterAssetsBalanceLoading] = useState(false);

  const dataShown = useMemo(() => {
    if (!data || data.length === 0) return [];

    const filteredData = data.filter((item: any) => {
      if (
        filterSelected[FILTER_KEYS.ASSETS].length > 0 &&
        !item.tokens.some((token: any) =>
          filterSelected[FILTER_KEYS.ASSETS].some((filter) =>
            filter.reg.test(token.symbol)
          )
        )
      ) {
        return false;
      }

      if (
        filterSelected[FILTER_KEYS.REWARDS].length > 0 &&
        !item.reward_tokens.some((token: any) =>
          filterSelected[FILTER_KEYS.REWARDS].some((filter) =>
            filter.reg.test(token.symbol)
          )
        )
      ) {
        return false;
      }

      if (
        filterSelected[FILTER_KEYS.PROTOCOLS].length > 0 &&
        !filterSelected[FILTER_KEYS.PROTOCOLS].some((filter) =>
          filter.reg.test(item.project)
        )
      ) {
        return false;
      }

      return true;
    });

    const sortedData = [...filteredData].sort((a: any, b: any) => {
      const valA = new Big(a[orderKey] || 0);
      const valB = new Big(b[orderKey] || 0);

      if (orderDirection === ORDER_DIRECTION.ASC) {
        return valA.gt(valB) ? 1 : valA.lt(valB) ? -1 : 0;
      } else {
        return valA.lt(valB) ? 1 : valA.gt(valB) ? -1 : 0;
      }
    });

    return sortedData;
  }, [data, orderKey, orderDirection, filterSelected]);

  const [dataTopAPY, dataTopTVL, dataHotStrategy] = useMemo<any>(() => {
    const topAPY = data.reduce(
      (prev: any, curr: any) =>
        Big(curr.totalApy || 0).gt(Big(prev.totalApy || 0)) ? curr : prev,
      {}
    );

    const topTVL = data.reduce(
      (prev: any, curr: any) =>
        Big(curr.tvl || 0).gt(Big(prev.tvl || 0)) ? curr : prev,
      {}
    );

    const hotStrategy = data.find(
      (item: any) => item.vault_address === StrategyPool.vaultAddress
    );

    return [topAPY, topTVL, hotStrategy];
  }, [data]);

  const filterSelectedLength = useMemo(() => {
    return Object.values(filterSelected).flat().length;
  }, [filterSelected]);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/go/vaults/list`, {
        params: {
          address: account
        }
      });
      if (res.status !== 200 || res.data.code !== 200) {
        console.log("get vaults list error:", res.data.message);
        return;
      }
      const _list = res.data.data || [];
      const _data = _list
        .filter((item: any) =>
          SUPPORTED_PROTOCOLS.includes(item.project)
        )
        .map((item: any) => {
          item.apr = parseJSONString(item.apr, {});
          item.reward_tokens = parseJSONString(item.reward_tokens, []);
          item.tokens = parseJSONString(item.tokens, []);
          item.extra_data = parseJSONString(item.extra_data, {});

          item.tokens.forEach((token: any) => {
            token.icon = getTokenLogo(token.symbol);
          });
          item.reward_tokens.forEach((token: any) => {
            token.icon = getTokenLogo(token.symbol);
          });

          const specialVault: any = SPECIAL_VAULTS.find(
            (sp) => sp.vaultAddress === item.vault_address
          );
          if (specialVault) {
            for (const key in specialVault) {
              item[key] = specialVault[key];
            }
          }
          const specialProtocol: any = SPECIAL_PROTOCOLS.find(
            (sp) => sp.protocol === item.project
          );
          if (specialProtocol) {
            for (const key in specialProtocol) {
              if (key === "protocol") continue;
              item[key] = specialProtocol[key];
            }
          }
          item.apy = item.apr.pool || "0";
          let totalApy = Big(item.apy || 0);
          if (item.apr) {
            Object.keys(item.apr)
              .filter((ak) => ak !== "pool")
              .forEach((ak: any) => {
                totalApy = totalApy.plus(Big(item.apr[ak] || 0));
              });
          }
          item.totalApy = totalApy;
          item.token = {
            symbol: item.name,
            address: item.pool_address === "0x0000000000000000000000000000000000000000" ? "native" : item.pool_address,
            decimals: 18
          };
          item.protocol = item.project;
          item.protocolIcon = getDappLogo(
            ["Hub"].includes(item.project) ? item.pool_project : item.project
          );
          item.lpProtocol = item.pool_project;
          item.backendId = item.id;
          item.id = item.extra_data.pool_id;
          item.balance = "0";
          item.vaultAddress = item.vault_address;

          if (item.protocol === "Kodiak") {
            item.vaultAddress = (kodiakConfig.sweetenedIslands as any)[
              item.pool_address
            ]?.farmAddress;
          }

          return item;
        });
      console.log("vaults list: %o", _data);
      setData(_data);
    } catch (err: any) {
      console.log("get vaults list error:", err.message);
    }
    setLoading(false);
    // FIXME Mock data
    // setTimeout(() => {
    //   const _list = [
    //     {
    //       tokens: [
    //         {
    //           icon: "/assets/tokens/honey.svg",
    //           symbol: "HONEY",
    //           decimals: 18,
    //           address: "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce"
    //         },
    //         {
    //           icon: "/assets/tokens/usdc.png",
    //           symbol: "USDC.e",
    //           decimals: 6,
    //           address: "0x549943e04f40284185054145c6E4e9568C1D3241"
    //         }
    //       ],
    //       protocol: "Bex",
    //       lpProtocol: "Bex",
    //       tvl: "308320000",
    //       apy: "0.16",
    //       rewards: [
    //         {
    //           address: "0x46eFC86F0D7455F135CC9df501673739d513E982",
    //           decimals: 18,
    //           symbol: "iBGT",
    //           name: "Infrared BGT",
    //           icon: "/assets/tokens/ibgt.png",
    //           apy: "11.42",
    //           claim: "2999999.123"
    //         },
    //         {
    //           address: "0xbaadcc2962417c01af99fb2b7c75706b9bd6babe",
    //           symbol: "LBGT",
    //           name: "Liquid BGT",
    //           decimals: 18,
    //           icon: "/assets/tokens/lbgt.png",
    //           apy: "14.55"
    //         }
    //       ],
    //       balance: "20.34",
    //       token: {
    //         symbol: "HONEY-USDC.e",
    //         address: "0xF961a8f6d8c69E7321e78d254ecAfBcc3A637621",
    //         decimals: 18
    //       },
    //       vaultAddress: "0xf99be47baf0c22b7eb5eac42c8d91b9942dc7e84",
    //       id: "0xf961a8f6d8c69e7321e78d254ecafbcc3a637621000000000000000000000001",
    //       poolType: "COMPOSABLE_STABLE"
    //     },
    //     {
    //       tokens: [
    //         DolomiteConfig.networks["80094"].markets[bera["bera"].address]
    //       ],
    //       token: {
    //         ...bera["bera"],
    //         marketId: "1"
    //       },
    //       protocol: "Dolomite",
    //       protocolIcon: DolomiteConfig.basic.icon,
    //       tvl: "3080000",
    //       apy: "79",
    //       balance: "1.34",
    //       vaultAddress: DolomiteConfig.networks["80094"].spenderAddress,
    //       config: {
    //         ...DolomiteConfig.basic,
    //         ...DolomiteConfig.networks["80094"]
    //       }
    //     },
    //     {
    //       tokens: [
    //         {
    //           icon: "/assets/tokens/bera.svg",
    //           symbol: "BERA",
    //           decimals: 18,
    //           isNative: true,
    //           address: "0x6969696969696969696969696969696969696969"
    //         },
    //         {
    //           icon: "/assets/tokens/honey.svg",
    //           symbol: "HONEY",
    //           decimals: 18,
    //           address: "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce"
    //         }
    //       ],
    //       protocol: "Kodiak",
    //       lpProtocol: "Kodiak",
    //       tvl: "308320000",
    //       apy: "0.16",
    //       rewards: [
    //         {
    //           address: "0x46eFC86F0D7455F135CC9df501673739d513E982",
    //           decimals: 18,
    //           symbol: "xKDK",
    //           name: "xKDK",
    //           icon: "/assets/tokens/kdk.svg",
    //           apy: "11.42",
    //           claim: "2999999.123"
    //         }
    //       ],
    //       balance: "20.34",
    //       token: {
    //         symbol: "HONEY-BERA",
    //         address: "0x4a254B11810B8EBb63C5468E438FC561Cb1bB1da",
    //         decimals: 18
    //       },
    //       vaultAddress: "0x40c4d0a87157c3c1df26267ac02505d930baeeeb"
    //     },
    //     {
    //       tokens: [
    //         {
    //           icon: "/assets/tokens/honey.svg",
    //           symbol: "HONEY",
    //           decimals: 18,
    //           address: "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce"
    //         },
    //         {
    //           icon: "/assets/tokens/wbera.png",
    //           symbol: "WBERA",
    //           decimals: 18,
    //           address: "0x6969696969696969696969696969696969696969"
    //         }
    //       ],
    //       protocol: "Infrared",
    //       lpProtocol: "Bex",
    //       id: "0x2c4a603a2aa5596287a06886862dc29d56dbc354000200000000000000000002",
    //       tvl: "308320000",
    //       apy: "0.16",
    //       rewards: [
    //         {
    //           address: "0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b",
    //           decimals: 18,
    //           symbol: "iBGT",
    //           name: "Infrared BGT",
    //           icon: "/assets/tokens/ibgt.png",
    //           apy: "11.42",
    //           claim: "2999999.123"
    //         }
    //       ],
    //       balance: "20.34",
    //       token: {
    //         symbol: "HONEY-WBERA",
    //         address: "0x2c4a603a2aa5596287a06886862dc29d56dbc354",
    //         decimals: 18
    //       },
    //       vaultAddress: "0xe2d8941dfb85435419d90397b09d18024ebeef2c"
    //     }
    //   ];
    //   setData(_list);
    //   setLoading(false);
    // }, 1000);
  };

  const toggleOrder = (key: ORDER_KEYS) => {
    if (loading) return;
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

  const toggleFilterSelected = (key: FILTER_KEYS, item: FilterItem) => {
    const _filterSelected = { ...filterSelected };
    for (const k in _filterSelected) {
      if (key === k) {
        if (_filterSelected[k].some((it) => it.label === item.label)) {
          _filterSelected[k] = _filterSelected[k].filter(
            (it) => it.label !== item.label
          );
        } else {
          _filterSelected[k].push(item);
        }
        break;
      }
    }
    setFilterSelected(_filterSelected);
  };

  const toggleAvailableAssets = (_availableAssets?: boolean) => {
    const __availableAssets = typeof _availableAssets === "boolean"
      ? _availableAssets
      : !availableAssets;
    setAvailableAssets(__availableAssets);
    if (__availableAssets) {
      const _filterSelected = { ...filterSelected };
      _filterSelected.ASSETS = [];
      setFilterSelected(_filterSelected);
    }
  };

  const clearFilterSelected = () => {
    setFilterSelected(cloneDeep(DEFAULT_FILTER_SELECTED));
  };

  const getFilterAssetsBalance = async () => {
    setFilterAssetsBalanceLoading(true);
    const getBalance = async (token: any) => {
      const rpcUrl = chains[80094].rpcUrls.default.http[0];
      const rpcProvider = new providers.JsonRpcProvider(rpcUrl);

      try {
        if (token.address === "native") {
          const rawBalance = await rpcProvider.getBalance(account);
          return {
            ...token,
            balance: utils.formatEther(rawBalance),
          };
        } else {
          const TokenContract = new Contract(token.address, TOKEN_ABI, rpcProvider);
          const rawBalance = await TokenContract.balanceOf(account);
          return {
            ...token,
            balance: utils.formatUnits(rawBalance, token.decimals),
          };
        }
      } catch (error) {
        console.log("get token %s balance failed: %o", token.symbol, error);
      }
      return {
        ...token,
        balance: "0",
      };
    };
    try {
      const balances = await Promise.all(filterAssetsBalance.map((it) => getBalance(it)));
      const WBERABalance = await getBalance(bera.wbera);
      const BERABalance = balances.find((it) => it.symbol === "BERA");
      if (BERABalance && Big(BERABalance.balance || 0).lte(0) && Big(WBERABalance.balance || 0).gt(0)) {
        BERABalance.balance = WBERABalance.balance;
      }
      setFilterAssetsBalance(balances);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
    setFilterAssetsBalanceLoading(false);
  };

  useEffect(() => {
    if (!account) return;
    getData();
    getFilterAssetsBalance();
  }, [account]);

  return {
    listData: data,
    listDataShown: dataShown,
    listDataTopAPY: dataTopAPY,
    listDataTopTVL: dataTopTVL,
    listDataHotStrategy: dataHotStrategy,
    listLoading: loading,
    listOrderKey: orderKey,
    listOrderDirection: orderDirection,
    toggleListOrder: toggleOrder,
    listFilterVisible: filterVisible,
    toggleListFilterVisible: toggleFilterVisible,
    listFilterSelected: filterSelected,
    toggleListFilterSelected: toggleFilterSelected,
    clearListFilterSelected: clearFilterSelected,
    listAvailableAssets: availableAssets,
    toggleListAvailableAssets: toggleAvailableAssets,
    listFilterAssetsBalanceLoading: filterAssetsBalanceLoading,
    listFilterAssetsBalance: filterAssetsBalance,
    listFilterSelectedLength: filterSelectedLength,
  };
}

export interface List {
  listData: any;
  listDataShown: any;
  listDataTopAPY: any;
  listDataTopTVL: any;
  listDataHotStrategy: any;
  listLoading: boolean;
  listOrderKey: ORDER_KEYS;
  listOrderDirection: ORDER_DIRECTION;
  toggleListOrder: (key: ORDER_KEYS) => void;
  listFilterVisible: boolean;
  toggleListFilterVisible: (filterVisible?: boolean) => void;
  listFilterSelected: Record<FILTER_KEYS, FilterItem[]>;
  toggleListFilterSelected: (key: FILTER_KEYS, item: FilterItem) => void;
  clearListFilterSelected: () => void;
  listAvailableAssets: boolean;
  toggleListAvailableAssets: (availableAssets?: boolean) => void;
  listFilterAssetsBalanceLoading: boolean;
  listFilterAssetsBalance: any;
  listFilterSelectedLength: number;
}

function parseJSONString(str: string, defaultValue: any = {}) {
  try {
    return str ? JSON.parse(str) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}
