import { useContext, useEffect, useMemo, useState } from 'react';
import useCustomAccount from '@/hooks/use-account';
import { get } from '@/utils/http';
import { useQuestStore } from '@/sections/activity/christmas/stores/use-quest-store';
import { useAuthCheck } from '@/hooks/use-auth-check';
import Big from 'big.js';
import { ChristmasContext } from '@/sections/activity/christmas/context';
import { dAppsInfo } from '@/configs/dapp';

const DAPP_ACTIONS: any = {
  Swap: 'Trade',
  Liquidity: 'Deposit',
  Lending: 'Lend',
  Staking: 'Deposit',
  Delegate: 'Deposit',
};
const DAPP_CATEGORY: any = {
  Swap: 'Dex',
  Liquidity: 'Dex',
  Lending: 'Lending',
  Staking: 'Vaults',
  Delegate: 'Vaults',
};

export function useQuest(): IQuest {
  const {
    getUserInfo,
  } = useContext(ChristmasContext);

  const { account, provider } = useCustomAccount();
  const { onAuthCheck } = useAuthCheck();
  const questVisited = useQuestStore((store) => store.visited);
  const _getQuestVisited = useQuestStore((store) => store.getVisited);
  const setQuestVisited = useQuestStore((store) => store.setVisited);
  const setVisitedUpdate = useQuestStore((store) => store.setUpdate);

  const [loading, setLoading] = useState(false);
  const [questList, setQuestList] = useState<Partial<Quest>[]>([]);

  const followXQuest = useMemo(() => {
    return questList.find((it) => it.category === QuestCategory.Social && it.name?.toLowerCase() === 'follow beratown on x');
  }, [questList]);

  const findSpecifiedTypeQuest = (category: QuestCategory, actionType: string[]) => {
    return questList.filter((it) => {
      return it.category === category && it.action_type && actionType.includes(it.action_type);
    });
  };

  const dAppSwapAndLiquidityQuest = useMemo(() => {
    return findSpecifiedTypeQuest(QuestCategory.DApp, ['Swap', 'Liquidity']);
  }, [questList]);

  const dAppLendingQuest = useMemo(() => {
    return findSpecifiedTypeQuest(QuestCategory.DApp, ['Lending']);
  }, [questList]);

  const dAppVaultsQuest = useMemo(() => {
    return findSpecifiedTypeQuest(QuestCategory.DApp, ['Staking', 'Delegate']);
  }, [questList]);

  const getQuestVisited = (id?: number) => {
    return _getQuestVisited({ id, account });
  };

  const getQuestList = async () => {
    setLoading(true);
    const res = await get('/api/mas/quest/list', { account });
    if (res.code !== 0) {
      setLoading(false);
      return;
    }
    const _questList: Partial<Quest>[] = res.data || [];
    const _latestQuestList: Partial<Quest>[] = [];
    _questList.forEach((it) => {
      it.completed = Big(it.total_box || 0).gte(it.box || 1);
      if (it.category === QuestCategory.DApp) {
        it.checkIds = [it.id as number];
        it.dappInfo = {
          name: it.name as string,
          category: it.action_type ? DAPP_CATEGORY[it.action_type] : (it.action_type as string),
        };
        it.actions = [
          { text: it.action_type ? DAPP_ACTIONS[it.action_type] : 'Trade', box: it.box },
        ];
        let currDApp = dAppsInfo.find((_it) => _it.name.toLowerCase() === it.name?.toLowerCase?.());
        if (it.name === 'Marketplace') {
          currDApp = {
            name: it.name,
            icon: '/images/dapps/marketplace.svg',
            path: '/marketplace',
          };
        }
        if (it.name === 'Top Validators') {
          currDApp = {
            name: it.name,
            icon: '/images/dapps/bgt.svg',
            path: '/bgt',
          };
        }
        if (currDApp) {
          it.dappInfo = {
            ...it.dappInfo,
            ...currDApp,
          };
          it.actions[0].path = currDApp.path;
          if (it.action_type === 'Liquidity') {
            it.actions[0].path = currDApp.path + '/pools';
          }
        }
        const questIdx = _latestQuestList.findIndex((_it) => _it.name === it.name);
        // ⚠️ merge data for the same DApp that may have multiple tasks
        if (questIdx > -1) {
          _latestQuestList[questIdx].box = (_latestQuestList[questIdx].box || 0) + (it.box || 0);
          _latestQuestList[questIdx].total_box = (_latestQuestList[questIdx].total_box || 0) + (it.total_box || 0);
          _latestQuestList[questIdx].checkIds?.push(it.id as number);
          if (!_latestQuestList[questIdx].actions?.some((_ac) => _ac.text === it.actions?.[0]?.text)) {
            _latestQuestList[questIdx].actions?.push(it.actions[0]);
          }
          return;
        }
        _latestQuestList.push(it);
        return;
      }
      _latestQuestList.push(it);
    });
    setQuestList(_latestQuestList);
    setLoading(false);
  };

  const handleQuestUpdate = (quest: Partial<Quest>, values: Partial<Quest>) => {
    const _questList = questList.slice();
    const curr: any = _questList.find((it) => it.id === quest?.id);
    if (!curr) return;
    for (const key in values) {
      curr[key] = values[key as keyof Partial<Quest>];
    }
    setQuestList(_questList);
  };

  const handleQuestCheck = async (quest: Partial<Quest>) => {
    if (!quest || quest?.checking || !quest?.id) return;
    handleQuestUpdate(quest, { checking: true });
    const requestCheck = (_id: number) => {
      const params = {
        id: _id,
        account,
      };
      return get('/api/mas/quest/check', params);
    };

    let totalBox = 0;
    let totalCompletedTimes = 0;

    // ⚠️ merge data for the same DApp that may have multiple tasks
    if (quest.checkIds?.length) {
      const checks = quest.checkIds.map((_id) => requestCheck(_id));
      const res = await Promise.all(checks);
      res.forEach((_res) => {
        const { total_box, total_completed_times } = _res.data || {};
        totalBox += (total_box || 0);
        totalCompletedTimes += (total_completed_times || 0);
      });
    } else {
      const res = await requestCheck(quest.id);
      if (res.code !== 0) {
        handleQuestUpdate(quest, { checking: false });
        return;
      }
      const { total_box, total_completed_times } = res.data || {};
      totalBox = (total_box || 0);
      totalCompletedTimes = (total_completed_times || 0);
    }

    const completed = Big(totalBox || 0).gte(quest.box || 1);
    handleQuestUpdate(quest, {
      total_box: totalBox,
      completed,
      total_completed_times: totalCompletedTimes,
      checking: false,
    });
    getUserInfo?.();
  };

  const handleSocialQuest = (quest: Partial<Quest>) => {
    if (quest.url) {
      window?.open(quest.url);
      setQuestVisited({ id: quest.id, visited: true });
      return;
    }
  };

  const handleQuest = async (quest?: Partial<Quest>) => {
    await onAuthCheck();
    if (!quest) return;
    switch (quest.category) {
      case QuestCategory.DApp:
        break;
      case QuestCategory.Learn:
        break;
      case QuestCategory.TokenBalance:
        break;
      case QuestCategory.View:
        break;
      case QuestCategory.Wallet:
        break;
      case QuestCategory.Social:
        handleSocialQuest(quest);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getQuestList();
    setVisitedUpdate();
  }, [account]);

  return {
    questLoading: loading,
    questList,
    handleQuestCheck,
    followXQuest,
    handleQuest,
    getQuestVisited,
    questVisited,
    dAppSwapAndLiquidityQuest,
    dAppLendingQuest,
    dAppVaultsQuest,
  };
}

export interface IQuest {
  questLoading: boolean;
  questList: Partial<Quest>[];
  followXQuest?: Partial<Quest>;
  questVisited?: Record<number, boolean>;
  dAppSwapAndLiquidityQuest: Partial<Quest>[];
  dAppLendingQuest: Partial<Quest>[];
  dAppVaultsQuest: Partial<Quest>[];
  getQuestVisited(id?: number): boolean;
  handleQuestCheck(quest?: Partial<Quest>): void;
  handleQuest(quest?: Partial<Quest>): void;
}

export enum QuestCategory {
  DApp = 'dapp',
  Learn = 'learn',
  TokenBalance = 'token_balance',
  View = 'view',
  Wallet = 'wallet',
  Social = 'social',
}

export interface Quest {
  action_type: string;
  box: number;
  category: QuestCategory;
  chain_id: number;
  id: number;
  name: string;
  sub_type: string;
  template: string;
  // times = 0 indicates infinite completion times
  // otherwise， it specifies the allowed number of completions
  times: number;
  timestamp: number;
  token: string;
  token_amount: string;
  total_box: number;
  url: string | null;

  completed?: boolean;
  checking?: boolean;
  total_completed_times?: number;
  dappInfo?: { name: string; icon?: number; category: string; path?: string; };
  checkIds?: number[];
  actions?: { text: string; box?: number; path?: string; }[];
}
