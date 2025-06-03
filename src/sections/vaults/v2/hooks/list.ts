import { useEffect, useMemo, useRef, useState } from 'react';
import {
  StrategyPool,
  ORDER_DIRECTION,
  ORDER_KEYS,
  FILTER_KEYS,
  FilterItem,
  FILTERS,
  PAGINATION_ACTION,
  Order,
  OrderKeys
} from "@/sections/vaults/v2/config";
import { BASE_URL } from "@/utils/http";
import useCustomAccount from "@/hooks/use-account";
import axios from "axios";
import { getDappLogo } from "@/sections/dashboard/utils";
import Big from "big.js";
import { cloneDeep, trim, uniqBy } from "lodash";
import chains from "@/configs/chains";
import { Contract, providers, utils } from "ethers";
import { TOKEN_ABI } from "@/hooks/use-token-balance";
import { bera } from "@/configs/tokens/bera";
import useIsMobile from "@/hooks/use-isMobile";
import getD2FinanceInfo from "@/sections/vaults/dapps/d2-finance/info";
import { usePriceStore } from '@/stores/usePriceStore';
import { addItem2Group, generateGroup, vaultsDataFormatter } from '@/sections/vaults/v2/utils';

const DEFAULT_FILTER_SELECTED: Record<FILTER_KEYS, FilterItem[]> = {
  [FILTER_KEYS.ASSETS]: [],
  [FILTER_KEYS.REWARDS]: [],
  [FILTER_KEYS.PROTOCOLS]: [],
  [FILTER_KEYS.CREATORS]: []
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

export function useList(notNeedingFetchData?: boolean): List {
  const { account } = useCustomAccount();
  const isMobile = useIsMobile();
  const prices = usePriceStore(store => store.beraTownPrice);

  const filterRef = useRef<any>();
  const boycoAssetsRef = useRef<any>();

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [defaultOrder, setDefaultOrder] = useState(true);
  const [orderKeys, setOrderKeys] = useState<Order[]>([
    { ...OrderKeys[ORDER_KEYS.YOURS] },
    { ...OrderKeys[ORDER_KEYS.TVL] },
    { ...OrderKeys[ORDER_KEYS.APY] }
  ]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterSelected, setFilterSelected] = useState<
    Record<FILTER_KEYS, FilterItem[]>
  >(cloneDeep(DEFAULT_FILTER_SELECTED));
  const [availableAssets, setAvailableAssets] = useState(true);
  const [filterAssetsBalance, setFilterAssetsBalance] = useState(
    cloneDeep(DEFAULT_FILTER_ASSETS_BALANCE)
  );
  const [filterAssetsBalanceLoading, setFilterAssetsBalanceLoading] =
    useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchValueDelay, setSearchValueDelay] = useState<string>();
  const [filterAssetsViewMore, setFilterAssetsViewMore] = useState(false);
  const [vaultsStaked, setVaultsStaked] = useState(false);
  const [vaultsBoyco, setVaultsBoyco] = useState(false);
  const [boycoAssetsSelected, setBoycoAssetsSelected] = useState<any>([]);

  // pagination & grouped by pool_address & sorted & filters
  // 20250425#Added BeraPaw pool, BeraPaw's pool_address corresponds to hub's vault_address;
  // After merging non-BeraPaw pools, check if there are any pools in the list whose vault_address matches
  // BeraPaw pool's pool_address, if match then append to the list
  const [dataGroupByPool, dataGroupByPoolAll] = useMemo(() => {
    if (!data || data.length === 0) return [[], []];

    const beraPawList = data.filter(
      (item: any) => item.project?.toLowerCase() === "berapaw"
    );
    const hubList = data.filter(
      (item: any) => item.project?.toLowerCase() !== "berapaw"
    );

    const grouped = generateGroup(hubList);

    grouped.forEach((group: any) => {
      for (let i = beraPawList.length - 1; i >= 0; i--) {
        const currentBeraPaw = beraPawList[i];
        const linkVault = group.list.find(
          (_protocol: any) =>
            _protocol.vault_address === currentBeraPaw.pool_address
        );
        if (linkVault) {
          currentBeraPaw.linkVault = linkVault;
          addItem2Group(group, currentBeraPaw);
          beraPawList.splice(i, 1);
          break;
        }
      }
    });

    const groupedWithBeraPaw = generateGroup(beraPawList, grouped);

    const filteredData = groupedWithBeraPaw.filter((item: any) => {
      // Boyco
      if (vaultsBoyco) {
        if (!boycoAssetsSelected?.some((asset: any) => asset.pool_address.some((pool: any) => item.pool_address === pool))) {
          return false;
        }
      } else {
        // Deposit Asset
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

        // Reward Asset
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

        // Defi Protocol
        if (
          filterSelected[FILTER_KEYS.PROTOCOLS].length > 0 &&
          !filterSelected[FILTER_KEYS.PROTOCOLS].some((filter) =>
            item.list.some((__it: any) => filter.reg.test(__it.project))
          )
        ) {
          return false;
        }

        if (
          filterSelected[FILTER_KEYS.CREATORS].length > 0 &&
          !filterSelected[FILTER_KEYS.CREATORS].some((filter) =>
            filter.reg.test(item.creator_project)
          )
        ) {
          return false;
        }
      }

      const _search = trim(searchValueDelay || "").toLowerCase();

      if (_search) {
        if (/[_\-|/\\,:~]/.test(_search) && !item.name?.toLowerCase().includes(_search)) {
          const matchTokens = item.list.some((v: any) => {
            if (v.tokens.length < 2) return false;
            const _regPrefix1 = new RegExp(`^${v.tokens[0].symbol}`, "i");
            const _regSuffix1 = new RegExp(`${v.tokens[1].symbol}$`, "i");
            const _regPrefix2 = new RegExp(`^${v.tokens[1].symbol}`, "i");
            const _regSuffix2 = new RegExp(`${v.tokens[0].symbol}$`, "i");
            if (_regPrefix1.test(_search) && _regSuffix1.test(_search)) {
              return true;
            }
            if (_regPrefix2.test(_search) && _regSuffix2.test(_search)) {
              return true;
            }
            return false;
          });
          if (!matchTokens) return false;
        }
        else {
          if (
            !item.tokens?.some((tk: any) =>
              tk.symbol?.toLowerCase().includes(_search)
            ) &&
            !item.reward_tokens?.some((tk: any) =>
              tk.symbol?.toLowerCase().includes(_search)
            ) &&
            !item.pool_project?.toLowerCase().includes(_search) &&
            !item.list.some((__it: any) =>
              __it.project?.toLowerCase().includes(_search)
            ) &&
            !item.name?.toLowerCase().includes(_search)
          ) {
            return false;
          }
        }
      }

      if (vaultsStaked && Big(item.user_stake?.amount || 0).lte(0)) {
        return false;
      }

      return true;
    });

    const sortedData = [...filteredData].sort((a: any, b: any) => {
      if (defaultOrder) {
        const tvlA = Big(a[ORDER_KEYS.TVL] || 0);
        const tvlB = Big(b[ORDER_KEYS.TVL] || 0);
        const apyA0 = Big(a[ORDER_KEYS.APY]?.[0] || 0);
        const apyB0 = Big(b[ORDER_KEYS.APY]?.[0] || 0);
        const apyA1 = Big(a[ORDER_KEYS.APY]?.[1] || 0);
        const apyB1 = Big(b[ORDER_KEYS.APY]?.[1] || 0);

        const calculatePoints = (tvl: Big, apy1: Big) => {
          const tvlPoints = Big(tvl).div(1000000);
          const apyPoints = Big(apy1).times(0.02);
          return Big(tvlPoints).plus(apyPoints);
        };

        const aEligible = tvlA.gt(1000000) && apyA1.gt(10);
        const bEligible = tvlB.gt(1000000) && apyB1.gt(10);

        if (aEligible && bEligible) {
          const pointsA = calculatePoints(tvlA, apyA1);
          const pointsB = calculatePoints(tvlB, apyB1);
          return Big(pointsB).minus(pointsA).toNumber();
        }

        if (aEligible) return -1;
        if (bEligible) return 1;

        if (tvlA.eq(tvlB)) {
          return apyB1.minus(apyA1).toNumber();
        }

        return tvlB.minus(tvlA).toNumber();
      }

      for (const key of orderKeys) {
        let valA: any;
        let valB: any;

        if (key.value === ORDER_KEYS.APY) {
          if (key.direction === ORDER_DIRECTION.ASC) {
            valA = new Big(a[key.value]?.[0] || 0);
            valB = new Big(b[key.value]?.[0] || 0);
          } else {
            valA = new Big(a[key.value]?.[1] || 0);
            valB = new Big(b[key.value]?.[1] || 0);
          }
        } else {
          valA = new Big(a[key.value] || 0);
          valB = new Big(b[key.value] || 0);
        }

        if (valA.gt(valB))
          return key.direction === ORDER_DIRECTION.ASC ? 1 : -1;
        if (valA.lt(valB))
          return key.direction === ORDER_DIRECTION.ASC ? -1 : 1;
      }

      return 0; // If all fields are equal, maintain the original order
    });

    setPageTotal(Math.ceil(sortedData.length / pageSize));

    if (isMobile) {
      return [sortedData, groupedWithBeraPaw];
    }

    return [
      sortedData.slice((pageIndex - 1) * pageSize, pageIndex * pageSize),
      groupedWithBeraPaw
    ];
  }, [
    data,
    filterSelected,
    searchValueDelay,
    pageIndex,
    pageSize,
    isMobile,
    orderKeys,
    defaultOrder,
    vaultsStaked,
    vaultsBoyco,
    boycoAssetsSelected
  ]);

  const [dataTopAPY, dataTopTVL, dataHotStrategy] = useMemo<any>(() => {
    const topAPY = dataGroupByPoolAll.reduce(
      (prev: any, curr: any) =>
        Big(curr.totalApy?.[1] || 0).gt(Big(prev.totalApy?.[1] || 0))
          ? curr
          : prev,
      {}
    );

    const topTVL = dataGroupByPoolAll.reduce(
      (prev: any, curr: any) =>
        Big(curr.tvl || 0).gt(Big(prev.tvl || 0)) ? curr : prev,
      {}
    );

    const hotStrategy = dataGroupByPoolAll.find(
      (item: any) => item.pool_address === StrategyPool
    );

    return [topAPY, topTVL, hotStrategy];
  }, [dataGroupByPoolAll]);

  const filterSelectedLength = useMemo(() => {
    return Object.values(filterSelected).flat().length;
  }, [filterSelected]);

  const [
    totalUserStakeUsd,
    totalUserRewardUsd,
    totalUserVaultsCount,
    totalUserRewardTokens
  ] = useMemo<any>(() => {
    const DEFAULT = [Big(0), Big(0), Big(0), []];
    if (!data?.length) return [...DEFAULT];
    let _totalUserStakeUsd = Big(0);
    let _totalUserRewardUsd = Big(0);
    let _totalUserVaultsCount = Big(0);
    const rewardTokensMap = new Map<
      string,
      {
        symbol: string;
        amount: Big;
        link: string;
        icon: string;
        address: string;
      }
    >();

    data.forEach((item: any) => {
      if (item.user_stake?.usd) {
        _totalUserStakeUsd = _totalUserStakeUsd.plus(
          Big(item.user_stake.usd || 0)
        );
      }
      if (Big(item.user_stake?.amount || 0).gt(0)) {
        _totalUserVaultsCount = _totalUserVaultsCount.plus(1);
      }
      if (item.user_reward?.length) {
        const _totalUsd = item.user_reward.reduce(
          (prev: any, curr: any) => Big(prev.usd || 0).plus(Big(curr.usd || 0)),
          Big(0)
        );
        _totalUserRewardUsd = _totalUserRewardUsd.plus(_totalUsd);
        item.user_reward.forEach((reward: any) => {
          if (!reward.address) return;
          const existingReward = rewardTokensMap.get(
            reward.address.toLowerCase()
          );
          const rewardAmount = Big(reward.amount || 0);
          if (existingReward) {
            existingReward.amount = existingReward.amount.plus(rewardAmount);
          } else {
            rewardTokensMap.set(reward.address.toLowerCase(), {
              symbol: reward.symbol,
              amount: rewardAmount,
              link: reward.link,
              icon: reward.icon,
              address: reward.address
            });
          }
        });
      }
    });

    const totalUserRewardTokens = Array.from(rewardTokensMap.values()).map((it: any) => {
      let price = prices?.[it.symbol];
      if (!price) {
        price = prices?.[it.address];
      }
      return {
        ...it,
        usd: Big(it.amount || 0).times(price || 0),
      };
    });
    return [
      _totalUserStakeUsd,
      _totalUserRewardUsd,
      _totalUserVaultsCount,
      totalUserRewardTokens
    ];
  }, [data, prices]);

  const [rewardTokens, poolProjects, creatorProjects] = useMemo(() => {
    const _tokens = data
      .flatMap((item: any) => item.reward_tokens || [])
      .filter(
        (token: any, index: any, self: any) =>
          self.findIndex((t: any) => t.address === token.address) === index
      );

    const _poolProjectsMap = new Map();
    data.forEach((item: any) => {
      const poolProjectKey = item.project;
      if (_poolProjectsMap.has(poolProjectKey)) {
        const poolProject = _poolProjectsMap.get(poolProjectKey);
        poolProject.vaults.push(item);
      } else {
        _poolProjectsMap.set(poolProjectKey, {
          label: poolProjectKey,
          reg: new RegExp(`^${poolProjectKey}$`, "i"),
          icon: getDappLogo(poolProjectKey),
          vaults: [item]
        });
      }
    });
    const _poolProjects = Array.from(_poolProjectsMap.values())
      .sort((a, b) => b.vaults.length - a.vaults.length)
      .map((item, index) => {
        return {
          ...item,
          sort: index + 1
        };
      });

    const _creatorProjects = Array.from(
      new Set(data.map((item: any) => item.creator_project).filter(Boolean))
    );

    return [_tokens, _poolProjects, _creatorProjects];
  }, [data]);

  const getData = async () => {
    if (notNeedingFetchData) return;
    setLoading(true);
    let _data: any = [];
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

      _data = await vaultsDataFormatter(_list);
    } catch (err: any) {
      console.log("get vaults list error:", err.message);
    }
    setData(_data);
    setLoading(false);
  };

  const togglePageIndex = (index: PAGINATION_ACTION | number) => {
    if (typeof index === "number") {
      setPageIndex(index);
      return;
    }
    if (index === PAGINATION_ACTION.FIRST) {
      setPageIndex(1);
      return;
    }
    if (index === PAGINATION_ACTION.PREV) {
      if (pageIndex <= 1) return;
      setPageIndex(pageIndex - 1);
      return;
    }
    if (index === PAGINATION_ACTION.NEXT) {
      if (pageIndex >= pageTotal) return;
      setPageIndex(pageIndex + 1);
      return;
    }
    if (index === PAGINATION_ACTION.LAST) {
      setPageIndex(pageTotal);
      return;
    }
  };

  const toggleOrder = (key: ORDER_KEYS, direction?: ORDER_DIRECTION) => {
    if (loading) return;
    setDefaultOrder(false);
    const _orderKeys: Order[] = orderKeys.slice();
    // first order
    if (key === _orderKeys[0]?.value) {
      _orderKeys[0].direction = direction
        ? direction === ORDER_DIRECTION.ASC
          ? ORDER_DIRECTION.DESC
          : ORDER_DIRECTION.ASC
        : _orderKeys[0]?.direction === ORDER_DIRECTION.ASC
        ? ORDER_DIRECTION.DESC
        : ORDER_DIRECTION.ASC;
      setOrderKeys(_orderKeys);
    }
    // new order
    else {
      const currentOrder = _orderKeys.find((it) => it.value === key);
      if (!currentOrder) return;
      const __orderKeys: Order[] = [
        {
          ...currentOrder,
          direction: ORDER_DIRECTION.DESC
        },
        ..._orderKeys
          .filter((it) => it.value !== key)
          .sort((a, b) => a.sort - b.sort)
      ];
      setOrderKeys(__orderKeys);
    }
  };

  const toggleFilterVisible = (_filterVisible?: boolean) => {
    setFilterVisible(
      typeof _filterVisible === "boolean" ? _filterVisible : !filterVisible
    );
  };

  const toggleSearchOpen = (_searchOpen?: boolean) => {
    setSearchOpen(typeof _searchOpen === "boolean" ? _searchOpen : !searchOpen);
  };

  const toggleFilterAssetsViewMore = (_filterAssetsViewMore?: boolean) => {
    setFilterAssetsViewMore(
      typeof _filterAssetsViewMore === "boolean"
        ? _filterAssetsViewMore
        : !filterAssetsViewMore
    );
  };

  const handleSearchValue = (_searchValue?: string) => {
    setSearchValue(_searchValue);
    togglePageIndex(PAGINATION_ACTION.FIRST);
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
    togglePageIndex(PAGINATION_ACTION.FIRST);
    const isSthSelected = Object.values(_filterSelected).some((f) => f.length > 0);
    if (isSthSelected) {
      setVaultsBoyco(false);
      setBoycoAssetsSelected([]);
    } else {
      // 👇this condition is not necessary
      // setVaultsBoyco(true);
      setBoycoAssetsSelected(boycoAssetsRef.current || []);
    }
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
      togglePageIndex(PAGINATION_ACTION.FIRST);
    }
  };

  const toggleVaultsStaked = (_vaultsStaked?: boolean) => {
    const __vaultsStaked =
      typeof _vaultsStaked === "boolean" ? _vaultsStaked : !vaultsStaked;
    if (__vaultsStaked) {
      togglePageIndex(PAGINATION_ACTION.FIRST);
    }
    setVaultsStaked(__vaultsStaked);
  };

  const clearFilterSelected = () => {
    setFilterSelected(cloneDeep(DEFAULT_FILTER_SELECTED));
    togglePageIndex(PAGINATION_ACTION.FIRST);
  };

  const toggleVaultsBoyco = (_vaultsBoyco?: boolean) => {
    const __vaultsBoyco =
      typeof _vaultsBoyco === "boolean" ? _vaultsBoyco : !vaultsBoyco;
    if (__vaultsBoyco) {
      clearFilterSelected();
    }
    setVaultsBoyco(__vaultsBoyco);
    if (!__vaultsBoyco) {
      setBoycoAssetsSelected([]);
    } else {
      setBoycoAssetsSelected(boycoAssetsRef.current || []);
    }
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

  const onBoycoAssetsSelect = (item: any) => {
    if (item === "clear") {
      setBoycoAssetsSelected([]);
      toggleVaultsBoyco(false);
      return;
    }
    if (boycoAssetsSelected?.some((asset: any) => asset.key === item.key)) {
      setBoycoAssetsSelected((_boycoAssetsSelected: any) => {
        const _selected = _boycoAssetsSelected.filter((asset: any) => asset.key !== item.key);
        if (!_selected.length) {
          toggleVaultsBoyco(false);
        }
        return _selected;
      });
    } else {
      setBoycoAssetsSelected((_boycoAssetsSelected: any) => [..._boycoAssetsSelected, { ...item }]);
    }
  };

  useEffect(() => {
    getData();
    if (account) {
      getFilterAssetsBalance();
    }
  }, [account]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValueDelay(searchValue);
      clearTimeout(timer);
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);

  return {
    listData: data,
    getListData: getData,
    listDataGroupByPool: dataGroupByPool,
    listDataGroupByPoolAll: dataGroupByPoolAll,
    listDataTopAPY: dataTopAPY,
    listDataTopTVL: dataTopTVL,
    listDataHotStrategy: dataHotStrategy,
    listLoading: loading,
    listOrderKeys: orderKeys,
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
    totalUserRewardTokens: totalUserRewardTokens,
    listRewardTokens: rewardTokens,
    listPoolProjects: poolProjects,
    listCreatorProjects: creatorProjects,
    listPageIndex: pageIndex,
    listPageSize: pageSize,
    listPageTotal: pageTotal,
    toggleListPageIndex: togglePageIndex,
    listSearchOpen: searchOpen,
    toggleListSearchOpen: toggleSearchOpen,
    listSearchValue: searchValue,
    handleListSearchValue: handleSearchValue,
    listFilterAssetsViewMore: filterAssetsViewMore,
    toggleListFilterAssetsViewMore: toggleFilterAssetsViewMore,
    listVaultsStaked: vaultsStaked,
    toggleListVaultsStaked: toggleVaultsStaked,
    listDefaultOrder: defaultOrder,
    vaultsBoyco,
    toggleVaultsBoyco,
    filterRef,
    boycoAssetsSelected,
    onBoycoAssetsSelect,
    boycoAssetsRef,
  };
}

export interface List {
  listData: any;
  getListData: () => Promise<void>;
  listDataGroupByPool: any;
  listDataGroupByPoolAll: any;
  listDataTopAPY: any;
  listDataTopTVL: any;
  listDataHotStrategy: any;
  listLoading: boolean;
  listOrderKeys: Order[];
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
  totalUserRewardTokens: {
    address: string;
    symbol: string;
    amount: string;
    icon: string;
    link: string;
  }[];
  listRewardTokens: any;
  listPoolProjects: any;
  listCreatorProjects: any;
  listPageIndex: number;
  listPageSize: number;
  listPageTotal: number;
  toggleListPageIndex: (index: PAGINATION_ACTION | number) => void;
  listSearchOpen: boolean;
  toggleListSearchOpen: (searchOpen?: boolean) => void;
  listSearchValue?: string;
  handleListSearchValue: (searchValue?: string) => void;
  listFilterAssetsViewMore: boolean;
  toggleListFilterAssetsViewMore: (filterAssetsViewMore?: boolean) => void;
  listVaultsStaked: boolean;
  toggleListVaultsStaked: (_listVaultsStaked?: boolean) => void;
  listDefaultOrder: boolean;
  vaultsBoyco: any;
  toggleVaultsBoyco: (vaultsBoyco?: any) => void;
  filterRef: any;
  boycoAssetsSelected: any;
  onBoycoAssetsSelect: (item: any) => void;
  boycoAssetsRef: any;
}
