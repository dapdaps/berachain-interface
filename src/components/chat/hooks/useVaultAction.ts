import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { useMemo } from 'react';
import { ACTION_TYPE } from '@/sections/vaults/v2/config';
import { usePriceStore } from '@/stores/usePriceStore';
import Big from 'big.js';

export const useVaultAction = (props: any) => {
  const { parsedContent } = props;

  const prices = usePriceStore((store: any) => store.beraTownPrice);
  const { listDataGroupByPoolAll, toggleActionVisible } = useVaultsV2Context();

  const vaultsList = useMemo(() => {
    const _vaultsList: any = [];
    if (!parsedContent) return _vaultsList;
    parsedContent.forEach((vault: any) => {
      const curr = listDataGroupByPoolAll.find((item: any) => item.list?.some((_vault: any) => _vault.backendId === vault.id));
      if (curr && !_vaultsList.some((it: any) => it.pool_address === curr.pool_address)) {
        if (curr.user_reward) {
          curr.user_reward.forEach((rewardToken: any) => {
            const currPrice = prices[rewardToken.symbol] || prices[rewardToken.address] || 0;
            rewardToken.usd = Big(rewardToken.amount || 0).times(currPrice);
          });
          curr.total_user_reward_usd = curr.user_reward.reduce((_prev: any, _curr: any) => Big(_prev).plus(_curr.usd || 0), Big(0));
        }
        _vaultsList.push(curr);
      }
    })
    return _vaultsList;
  }, [parsedContent, listDataGroupByPoolAll, prices]);

  const handleOpen = (vault: any) => {
    toggleActionVisible({
      type: ACTION_TYPE.DEPOSIT,
      record: vault,
      visible: true
    });
  };

  return {
    vaultsList,
    handleOpen,
  };
}
