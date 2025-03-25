import PageBack from '@/components/back';
import Card from '@/components/card';
import { motion } from 'framer-motion';
import FilterItem from '@/sections/vaults/v2/components/filter-item';
import Dashboard from '@/sections/vaults/v2/components/dashboard';
import VaultsTable from '@/sections/vaults/v2/components/vaults-table';
import TopCard from '@/sections/vaults/v2/components/top-card';
import ActionModal from '@/sections/vaults/v2/components/action/modal';
import VaultsV2ContextProvider from '@/sections/vaults/v2/context';
import { useVaultsV2 } from '@/sections/vaults/v2/hooks';

const VaultsV2 = (props: any) => {
  const { } = props;

  const vaultsV2 = useVaultsV2();

  return (
    <VaultsV2ContextProvider value={vaultsV2}>
      <div className="relative w-full h-full bg-[url('/images/vaults/v2/bg.png')] bg-black/90 bg-no-repeat bg-top bg-cover">
        <PageBack className='absolute left-[36px] top-[100px] text-white' />
        <div className="pt-[117px] mx-auto flex justify-center">
          <img src="/images/vaults/v2/title.png" alt="" className="w-[180px] h-[54px] shrink-0 pointer-events-none object-center object-contain" />
        </div>
        <div className="w-[1257px] h-[calc(100dvh_-_228px)] mx-auto pt-[54px]">
          <div className="w-full grid grid-cols-3 gap-[21px]">
            <TopCard type={0} />
            <TopCard type={1} />
            <TopCard type={2} />
          </div>
          <div className="max-h-[calc(100%_-_152px)] min-h-[320px] pt-[25px] flex justify-between gap-[13px] w-full text-[14px] text-black leading-[90%] font-[500] font-Montserrat">
            <Card className="w-[337px] shrink-0 !rounded-[18px] !px-0 max-h-[100%] flex flex-col">
              <div className="flex items-center gap-[7px] pb-[24px] pl-[17px] border-b border-[rgba(0,0,0,0.2)] shrink-0">
                <div className="text-[20px] font-[700]">
                  Vaults
                </div>
                <div className="shrink-0 text-[12px] w-[24px] h-[24px] flex justify-center items-center rounded-[5px] border border-[rgba(0,0,0,0.2)]">
                  54
                </div>
              </div>
              <div className="h-0 flex-1 overflow-y-auto">
                <div className="flex justify-between items-center gap-[10px] pl-[15px] pr-[24px] pt-[14px]">
                  <div className="text-[16px] font-[700]">
                    Filter
                  </div>
                  <button
                    type="button"
                    className="shrink-0 w-[13px] h-[13px] flex justify-center items-center"
                  >
                    <img src="/images/vaults/v2/refresh.svg" alt="" className="w-full h-full object-center object-contain pointer-events-none" />
                  </button>
                </div>
                <div className="text-[15px] font-[600] pt-[26px] px-[15px]">
                  Deposit Asset
                </div>
                <div className="flex justify-between items-center gap-[10px] pl-[15px] pr-[20px] pt-[20px]">
                  <div className="text-[15px] font-[500]">
                    Your available assets only
                  </div>
                  <motion.button
                    type="button"
                    className="w-[45px] h-[26px] shrink-0 rounded-[13px] p-[3px]"
                    animate={{ backgroundColor: vaultsV2.availableAssets ? '#FFDC50' : '#E8E5C7' }}
                    onClick={() => vaultsV2.toggleAvailableAssets()}
                  >
                    <motion.div
                      className="w-[20px] h-[20px] rounded-full border border-[#BBBBBB] bg-[#FFFDEB]"
                      animate={{ x: vaultsV2.availableAssets ? 19 : 0 }}
                    />
                  </motion.button>
                </div>
                <div className="pt-[12px] pl-[15px] pr-[20px] flex items-center gap-[8px] flex-wrap">
                  <FilterItem selected={true} />
                  <FilterItem selected={false} />
                  <FilterItem selected={false} />
                  <FilterItem selected={false} />
                  <FilterItem selected={false} />
                  <FilterItem selected={false} />
                </div>
                <div className="pt-[14px] pl-[15px] pr-[20px]">
                  <button
                    type="button"
                    className="text-[#999] text-[12px]"
                  >
                    View More
                  </button>
                </div>
                <div className="pt-[24px] pl-[15px] pr-[20px] font-[600]">
                  Reward Asset
                </div>
                <div className="pt-[14px] pl-[15px] pr-[20px] flex items-center gap-[8px] flex-wrap">
                  <FilterItem selected={true} />
                  <FilterItem selected={false} />
                  <FilterItem selected={false} />
                  <FilterItem selected={false} />
                  <FilterItem selected={false} />
                  <FilterItem selected={false} />
                </div>
                <div className="pt-[28px] pl-[15px] pr-[20px] font-[600]">
                  Protocol
                </div>
                <div className="pt-[14px] pl-[15px] pr-[20px] flex items-center gap-[8px] flex-wrap">
                  <FilterItem selected={true} />
                  <FilterItem selected={true} />
                  <FilterItem selected={false} />
                  <FilterItem selected={false} />
                  <FilterItem selected={false} />
                  <FilterItem selected={false} />
                </div>
              </div>
            </Card>
            <Card className="w-0 flex-1 !rounded-[18px] !px-[18px]">
              <Dashboard />
              <VaultsTable />
            </Card>
          </div>
        </div>
        <ActionModal />
      </div>
    </VaultsV2ContextProvider>
  );
};

export default VaultsV2;
