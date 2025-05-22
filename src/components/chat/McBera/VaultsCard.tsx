import { APY, Pool, Vaults } from '@/sections/vaults/v2/components/vaults-table/columns';
import { useVaultAction } from '@/components/chat/hooks/useVaultAction';

const VaultsCard = (props: any) => {
  const { vaultsList, handleOpen } = useVaultAction(props);

  return (
    <div className="mt-[10px] w-full min-w-[554px] flex flex-col gap-[8px]">
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
