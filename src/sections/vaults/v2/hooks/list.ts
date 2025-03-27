import { useEffect, useMemo, useState } from "react";
import {
  StrategyPool,
  ORDER_DIRECTION,
  ORDER_KEYS,
  SPECIAL_VAULTS,
  FILTER_KEYS,
  FilterItem,
  SUPPORTED_PROTOCOLS,
  SPECIAL_PROTOCOLS,
  FILTERS
} from "@/sections/vaults/v2/config";
import { BASE_URL } from "@/utils/http";
import useCustomAccount from "@/hooks/use-account";
import axios from "axios";
import { getDappLogo, getTokenLogo } from "@/sections/dashboard/utils";
import kodiakConfig from "@/configs/pools/kodiak";
import Big from "big.js";
import { cloneDeep } from "lodash";
import chains from "@/configs/chains";
import { Contract, providers, utils } from "ethers";
import { TOKEN_ABI } from "@/hooks/use-token-balance";
import { bera } from "@/configs/tokens/bera";
import { useDebounceFn } from "ahooks";

const DEFAULT_FILTER_SELECTED: Record<FILTER_KEYS, FilterItem[]> = {
  [FILTER_KEYS.ASSETS]: [],
  [FILTER_KEYS.REWARDS]: [],
  [FILTER_KEYS.PROTOCOLS]: []
};

const DEFAULT_FILTER_ASSETS_BALANCE: {
  symbol?: string;
  balance: string;
  address?: string;
  decimals?: number;
}[] = FILTERS.ASSETS.map((it) => ({
  ...it.token,
  balance: "0"
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
  const [filterSelected, setFilterSelected] = useState<
    Record<FILTER_KEYS, FilterItem[]>
  >(cloneDeep(DEFAULT_FILTER_SELECTED));
  const [availableAssets, setAvailableAssets] = useState(false);
  const [filterAssetsBalance, setFilterAssetsBalance] = useState(
    cloneDeep(DEFAULT_FILTER_ASSETS_BALANCE)
  );
  const [filterAssetsBalanceLoading, setFilterAssetsBalanceLoading] =
    useState(false);

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
          filter.reg.test(item.pool_project)
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

  const [totalUserStakeUsd, totalUserRewardUsd, totalUserVaultsCount] = useMemo(() => {
    const DEFAULT = [Big(0), Big(0), Big(0)];
    if (!data?.length) return [...DEFAULT];
    let _totalUserStakeUsd = Big(0);
    let _totalUserRewardUsd = Big(0);
    let _totalUserVaultsCount = Big(0);
    data.forEach((item: any) => {
      if (item.user_stake?.usd) {
        _totalUserStakeUsd = _totalUserStakeUsd.plus(Big(item.user_stake.usd || 0));
        _totalUserVaultsCount = _totalUserVaultsCount.plus(1);
      }
      if (item.user_reward?.length) {
        const _totalUsd = item.user_reward.reduce((prev: any, curr: any) => Big(prev.usd || 0).plus(Big(curr.usd || 0)), Big(0));
        _totalUserRewardUsd = _totalUserRewardUsd.plus(_totalUsd);
      }
    });
    return [_totalUserStakeUsd, _totalUserRewardUsd, _totalUserVaultsCount];
  }, [data]);

  const rewardTokens = useMemo(() => {
    const tokens = data
      .flatMap((item: any) => item.reward_tokens || [])
      .filter((token: any, index: any, self: any) =>
        self.findIndex((t: any) => t.address === token.address) === index
      );
    return tokens;
  }, [data]);

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
        .filter((item: any) => SUPPORTED_PROTOCOLS.includes(item.pool_project))
        .map((item: any) => {
          item.apr = parseJSONString(item.apr, {});
          item.reward_tokens = parseJSONString(item.reward_tokens, []);
          item.tokens = parseJSONString(item.tokens, []);
          item.extra_data = parseJSONString(item.extra_data, {});
          item.user_reward = item.user_reward || [];
          item.user_stake = item.user_stake || {};

          item.tokens.forEach((token: any) => {
            token.icon = getTokenLogo(token.symbol);
          });
          item.reward_tokens.forEach((token: any) => {
            token.icon = getTokenLogo(token.symbol);
          });
          item.user_reward.forEach((reward: any) => {
            const curr = item.reward_tokens.find((token: any) => token.address.toLowerCase() === reward.address.toLowerCase());
            if (curr) {
              reward.symbol = curr.symbol;
              reward.icon = curr.icon;
            }
          });

          const specialVault: any = SPECIAL_VAULTS.find(
            (sp) => {
              return (
                sp.vaultAddress?.toLowerCase() === item.vault_address.toLowerCase() ||
                sp.project?.toLowerCase() === item.project.toLowerCase()
              );
            }
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
            address:
              item.pool_address === "0x0000000000000000000000000000000000000000"
                ? "native"
                : item.pool_address,
            decimals: 18
          };
          item.protocol = item.project;
          item.protocolIcon = getDappLogo(
            ["Hub"].includes(item.project) ? item.pool_project : item.project
          );
          item.lpProtocol = item.pool_project;
          item.backendId = item.id;
          item.id = item.extra_data.pool_id;
          item.balance = item.user_stake?.usd;
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
  };

  const toggleOrder = (key: ORDER_KEYS, direction?: ORDER_DIRECTION) => {
    if (loading) return;
    if (key === orderKey) {
      setDirection(
        direction ??
        (orderDirection === ORDER_DIRECTION.DESC
          ? ORDER_DIRECTION.ASC
          : ORDER_DIRECTION.DESC)
      );
    } else {
      setOrderKey(key);
      setDirection(direction ?? ORDER_DIRECTION.DESC);
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
    const __availableAssets =
      typeof _availableAssets === "boolean"
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
            balance: utils.formatEther(rawBalance)
          };
        } else {
          const TokenContract = new Contract(
            token.address,
            TOKEN_ABI,
            rpcProvider
          );
          const rawBalance = await TokenContract.balanceOf(account);
          return {
            ...token,
            balance: utils.formatUnits(rawBalance, token.decimals)
          };
        }
      } catch (error) {
        console.log("get token %s balance failed: %o", token.symbol, error);
      }
      return {
        ...token,
        balance: "0"
      };
    };
    try {
      const balances = await Promise.all(
        filterAssetsBalance.map((it) => getBalance(it))
      );
      const WBERABalance = await getBalance(bera.wbera);
      const BERABalance = balances.find((it) => it.symbol === "BERA");
      if (
        BERABalance &&
        Big(BERABalance.balance || 0).lte(0) &&
        Big(WBERABalance.balance || 0).gt(0)
      ) {
        BERABalance.balance = WBERABalance.balance;
      }
      setFilterAssetsBalance(balances);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
    setFilterAssetsBalanceLoading(false);
  };

  const { run: init } = useDebounceFn(
    () => {
      getData();
      getFilterAssetsBalance();
    },
    { wait: 1000 }
  );

  useEffect(() => {
    init();
  }, [account]);

  return {
    listData: data,
    getListData: getData,
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
    totalUserStakeUsd: totalUserStakeUsd,
    totalUserRewardUsd: totalUserRewardUsd,
    totalUserVaultsCount: totalUserVaultsCount,
    listRewardTokens: rewardTokens,
  };
}

export interface List {
  listData: any;
  getListData: () => Promise<void>;
  listDataShown: any;
  listDataTopAPY: any;
  listDataTopTVL: any;
  listDataHotStrategy: any;
  listLoading: boolean;
  listOrderKey: ORDER_KEYS;
  listOrderDirection: ORDER_DIRECTION;
  toggleListOrder: (key: ORDER_KEYS, direction?: ORDER_DIRECTION) => void;
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
  totalUserStakeUsd: Big.Big;
  totalUserRewardUsd: Big.Big;
  totalUserVaultsCount: Big.Big;
  listRewardTokens: any;
}

function parseJSONString(str: any, defaultValue: any = {}) {
  if (typeof str !== "string") return str || defaultValue;
  try {
    return str ? JSON.parse(str) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}
