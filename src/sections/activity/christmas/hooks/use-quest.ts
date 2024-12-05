import { useEffect, useMemo, useState } from 'react';
import useCustomAccount from '@/hooks/use-account';
import { get } from '@/utils/http';
import { useQuestStore } from '@/sections/activity/christmas/stores/use-quest-store';
import { useAuthCheck } from '@/hooks/use-auth-check';
import Big from 'big.js';

export function useQuest(): IQuest {
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
    _questList.forEach((it) => {
      it.completed = Big(it.total_box || 0).gte(it.box || 1);
    });
    setQuestList(_questList);
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
    const params = {
      id: quest.id,
      account,
    };
    const res = await get('/api/mas/quest/check', params);
    if (res.code !== 0) {
      handleQuestUpdate(quest, { checking: false });
      return;
    }
    const { total_box, total_completed_times } = res.data || {};
    const completed = Big(total_completed_times || 0).gte(quest.times || 1);
    handleQuestUpdate(quest, {
      total_box,
      completed,
      total_completed_times,
      checking: false,
    });
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
  };
}

export interface IQuest {
  questLoading: boolean;
  questList: Partial<Quest>[];
  followXQuest?: Partial<Quest>;
  questVisited?: Record<number, boolean>;
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
}
