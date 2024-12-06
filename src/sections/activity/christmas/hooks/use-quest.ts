import { useEffect, useMemo, useRef, useState } from 'react';
import useCustomAccount from '@/hooks/use-account';
import { get } from '@/utils/http';
import { useQuestStore } from '@/sections/activity/christmas/stores/use-quest-store';
import { useAuthCheck } from '@/hooks/use-auth-check';
import Big from 'big.js';
import { dAppsInfo } from '@/configs/dapp';
import { DAppQuests, EcosystemQuests } from '@/sections/activity/christmas/config';
import { cloneDeep } from 'lodash';
import { useBase } from '@/sections/activity/christmas/hooks/use-base';

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
  const { getUserInfo } = useBase();

  const timerRef = useRef<any>();
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

  const findSpecifiedTypeQuest = (categories: QuestCategory[], actionType?: string[]) => {
    return questList.filter((it) => {
      return categories.includes(it.category as QuestCategory) && (actionType ? it.action_type && actionType?.includes(it.action_type) : true);
    });
  };

  const dAppSwapAndLiquidityQuest = useMemo(() => {
    return findSpecifiedTypeQuest([QuestCategory.DApp], ['Swap', 'Liquidity']);
  }, [questList]);

  const dAppLendingQuest = useMemo(() => {
    return findSpecifiedTypeQuest([QuestCategory.DApp], ['Lending']);
  }, [questList]);

  const dAppVaultsQuest = useMemo(() => {
    return findSpecifiedTypeQuest([QuestCategory.DApp], ['Staking', 'Delegate']);
  }, [questList]);

  const ecosystemQuest = useMemo(() => {
    return findSpecifiedTypeQuest([QuestCategory.TokenBalance, QuestCategory.Learn, QuestCategory.View, QuestCategory.Wallet]);
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
      const questIdx = _latestQuestList.findIndex((_it) => _it.name === it.name);

      it.completed = Big(it.total_box || 0).gte(it.box || 1);

      const createChildren = (_quest: Partial<Quest>) => {
        _quest.parentId = _quest.id;
        _quest.missions = [cloneDeep(_quest)];
        // ⚠️ merge data for the same name that may have multiple tasks
        if (questIdx > -1) {
          _quest.parentId = _latestQuestList[questIdx].id;
          _latestQuestList[questIdx].missions?.push(cloneDeep(_quest));
          _latestQuestList[questIdx].missions?.sort?.((a, b) => (a.id as number) - (b.id as number))
        }
      };

      if (it.category === QuestCategory.DApp) {
        it.dappInfo = {
          name: it.name as string,
          category: it.action_type ? DAPP_CATEGORY[it.action_type] : (it.action_type as string),
          missions: DAppQuests[it.name as string]?.missions,
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

        createChildren(it);

        if (questIdx > -1) {
          if (!_latestQuestList[questIdx].actions?.some((_ac) => _ac.text === it.actions?.[0]?.text)) {
            _latestQuestList[questIdx].actions?.push(it.actions[0]);
          }
          return;
        }

        _latestQuestList.push(it);
        return;
      }

      if (it.name && EcosystemQuests[it.name]) {
        it.ecosystemInfo = EcosystemQuests[it.name];
        it.socials = EcosystemQuests[it.name].socials;
        it.description = EcosystemQuests[it.name].missions?.[it.category as string]?.text;
        it.missionAction = EcosystemQuests[it.name].missions?.[it.category as string]?.action;

        if (it.name === 'Beraji') {
          it.description = EcosystemQuests[it.name].missions?.wallet1?.text;
          it.missionAction = EcosystemQuests[it.name].missions?.wallet1?.action;
        }

        createChildren(it);

        if (questIdx > -1) {
          return;
        }
      }

      _latestQuestList.push(it);
    });
    _latestQuestList.sort((a, b) => (a.id as number) - (b.id as number)).forEach((it) => {
      if (it.name === 'Beraji') {
        it.missions?.forEach?.((_it, idx) => {
          _it.description = EcosystemQuests[it.name as string].missions?.['wallet' + (idx + 1)]?.text;
          _it.missionAction = EcosystemQuests[it.name as string].missions?.['wallet' + (idx + 1)]?.action;
        });
      }
      if (it.missions) {
        it.box = it.missions.map((it) => it.box || 0).reduce((a, b) => Big(a).plus(b).toNumber());
        it.total_box = it.missions.map((it) => it.total_box || 0).reduce((a, b) => Big(a).plus(b).toNumber());
      }
    });
    setQuestList(_latestQuestList);
    setLoading(false);
  };

  const requestCheck = (_id: number) => {
    const params = {
      id: _id,
      account,
    };
    return new Promise((resolve) => {
      get('/api/mas/quest/check', params).then((res) => {
        resolve(res);
      }).catch((err) => {
        resolve({ code: 0, data: {} });
      });
    });
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

    let totalBox = 0;
    let totalCompletedTimes = 0;

    // ⚠️ merge data for the same DApp that may have multiple tasks
    if (quest.missions?.length) {
      const checkList = quest.missions.filter((it) => {
        // ecosystem quests
        if ([QuestCategory.TokenBalance, QuestCategory.Learn, QuestCategory.View, QuestCategory.Wallet].includes(it.category as QuestCategory)) {
          if (it.name === 'Beraji') return true;
          if (it.url) {
            return getQuestVisited(it.id);
          }
          return true;
        }
        return true;
      });
      const checks = checkList.map((it) => requestCheck(it.id as number));
      const res = await Promise.all(checks);
      res.forEach((_res: any) => {
        const { total_box, total_completed_times } = _res.data || {};
        totalBox += (total_box || 0);
        totalCompletedTimes += (total_completed_times || 0);
      });
      quest.missions.filter((it) => !checkList.some((_it) => _it.id === it.id)).forEach((it) => {
        const { total_box, total_completed_times } = it;
        totalBox += (total_box || 0);
        totalCompletedTimes += (total_completed_times || 0);
      });
    } else {
      const res: any = await requestCheck(quest.id);
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
    });
    getUserInfo?.();

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleQuestUpdate(quest, {
        checking: false,
      });
    }, 600);
  };

  const handleQuestMissionUpdate = (mission: Partial<Quest>, values: Partial<Quest>) => {
    const _questList = questList.slice();
    const currQuest: any = _questList.find((it) => it.id === mission?.parentId);
    if (!currQuest) return;
    const currMission = currQuest.missions?.find?.((it: any) => it.id === mission?.id);
    if (!currMission) return;
    for (const key in values) {
      currMission[key] = values[key as keyof Partial<Quest>];
    }
    currQuest.box = currQuest.missions.map((it: any) => it.box || 0).reduce((a: any, b: any) => Big(a).plus(b).toNumber());
    currQuest.total_box = currQuest.missions.map((it: any) => it.total_box || 0).reduce((a: any, b: any) => Big(a).plus(b).toNumber());
    setQuestList(_questList);
  };

  const handleQuestMissionCheck = async (mission: Partial<Quest>) => {
    if (!mission || mission?.checking || !mission?.id) return;
    handleQuestMissionUpdate(mission, { checking: true });
    let totalBox = 0;
    let totalCompletedTimes = 0;

    const res: any = await requestCheck(mission.id);
    if (res.code !== 0) {
      handleQuestMissionUpdate(mission, { checking: false });
      return;
    }
    const { total_box, total_completed_times } = res.data || {};
    totalBox = (total_box || 0);
    totalCompletedTimes = (total_completed_times || 0);

    const completed = Big(totalBox || 0).gte(mission.box || 1);
    handleQuestMissionUpdate(mission, {
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
    ecosystemQuest,
    handleQuestMissionCheck,
    setQuestVisited,
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
  ecosystemQuest: Partial<Quest>[];
  getQuestVisited(id?: number): boolean;
  handleQuestCheck(quest?: Partial<Quest>): void;
  handleQuestMissionCheck(mission?: Partial<Quest>): void;
  handleQuest(quest?: Partial<Quest>): void;
  setQuestVisited(params: { id?: number | string, visited?: boolean; }): void;
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

  description?: string;
  missionAction?: string;
  parentId?: number;
  completed?: boolean;
  checking?: boolean;
  total_completed_times?: number;
  dappInfo?: { name: string; icon?: number; category: string; path?: string; missions?: string[]; };
  actions?: { text: string; box?: number; path?: string; }[];
  ecosystemInfo?: { categories?: string[]; icon?: string; banner?: string; description?: string; };
  missions?: Partial<Quest>[];
  socials?: { label?: string; link?: string; }[];
}
