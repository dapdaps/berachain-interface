import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { useMemo } from 'react';
import { APY, Pool, Vaults } from '@/sections/vaults/v2/components/vaults-table/columns';
import { ACTION_TYPE } from '@/sections/vaults/v2/config';
import { uniqBy } from 'lodash';

const VaultsCard = (props: any) => {
  const { parsedContent } = props;

  const { listDataGroupByPoolAll, toggleActionVisible } = useVaultsV2Context();

  const vaultsList = useMemo(() => {
    if (!parsedContent) return [];
    return uniqBy(parsedContent.map((vault: any) => {
      const curr = listDataGroupByPoolAll.find((item: any) => item.list?.some((_vault: any) => _vault.backendId === vault.id));
      return curr;
    }).filter((it: any) => !!it), ["pool_address"]);
  }, [parsedContent, listDataGroupByPoolAll]);

  const handleOpen = (vault: any) => {
    toggleActionVisible({
      type: ACTION_TYPE.DEPOSIT,
      record: vault,
      visible: true
    });
  };

  return (
    <div className="mt-[10px] w-full flex flex-col gap-[8px]">
      {
        vaultsList.map((vault: any) => (
          <div onClick={() => handleOpen(vault)} className="cursor-pointer w-full h-[38px] flex justify-between items-center flex-shrink-0 rounded-[10px] border border-[#DAD9CD] p-[6px] text-black font-Montserrat text-[13px] font-medium leading-[100%]">
            <div className="flex items-center gap-[8px]">
              <Vaults record={vault} />
              <Pool record={vault} />
              <APY record={vault} />
            </div>
            <img src="/images/home-earth/mc-bera/icon-open.svg" alt="" className="shrink-0 w-[9px] h-[9px] object-contain object-center" />
          </div>
        ))
      }
    </div>
  );
};

export default VaultsCard;
