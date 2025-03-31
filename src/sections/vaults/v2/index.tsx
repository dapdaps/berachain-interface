import PageBack from "@/components/back";
import Card from "@/components/card";
import Dashboard from "@/sections/vaults/v2/components/dashboard";
import VaultsTable from "@/sections/vaults/v2/components/vaults-table";
import TopCard from "@/sections/vaults/v2/components/top-card";
import ActionModal from "@/sections/vaults/v2/components/action/modal";
import VaultsV2ContextProvider from "@/sections/vaults/v2/context";
import { useVaultsV2 } from "@/sections/vaults/v2/hooks";
import ClaimModal from "@/sections/vaults/v2/components/claim/modal";
import ClaimSuccessModal from "@/sections/vaults/v2/components/claim/success";
import StrategyModal from "@/sections/vaults/v2/components/strategy/modal";
import { useList } from "@/sections/vaults/v2/hooks/list";
import Filter from "@/sections/vaults/v2/components/filter";
import Loading from "@/components/loading";
import Search from "@/sections/vaults/v2/components/filter/search";
import Feedback from "@/sections/vaults/v2/components/feedback/feedback";
import SubmitVault from "@/sections/vaults/v2/components/feedback/submit-vault";

const VaultsV2 = (props: any) => {
  const {} = props;

  const vaultsV2 = useVaultsV2();
  const list = useList();

  return (
    <VaultsV2ContextProvider value={{ ...vaultsV2, ...list }}>
      <div className="relative w-full min-w-[1257px] min-h-[750px] pb-[56px]">
        <PageBack className="absolute left-[36px] top-[32px] text-white" />
        <div className="w-[1257px] mx-auto h-[103px] pt-[49px] flex items-end justify-end relative">
          <img
            src="/images/vaults/v2/title.png"
            alt=""
            className="w-[180px] h-[54px] shrink-0 pointer-events-none object-center object-contain absolute left-1/2 -translate-x-1/2"
          />
          <SubmitVault className="shrink-0" />
        </div>
        <div className="w-[1257px] mx-auto pt-[54px]">
          <div className="w-full grid grid-cols-3 gap-[21px]">
            <TopCard type={0} pool={list.listDataTopAPY} />
            <TopCard type={1} pool={list.listDataTopTVL} />
            <TopCard type={2} pool={list.listDataHotStrategy} />
          </div>
          <div className="min-h-[320px] pt-[25px] flex justify-between items-start gap-[13px] w-full text-[14px] text-black leading-[90%] font-[500] font-Montserrat">
            <div className="w-[337px] shrink-0">
              <Card className="w-full !rounded-[18px] !px-0 flex flex-col">
                <div className="w-full flex justify-between items-center gap-[15px] pb-[24px] pl-[17px] pr-[20px] border-b border-[rgba(0,0,0,0.2)]">
                  <div className="flex items-center gap-[7px] shrink-0">
                    <div className="text-[20px] font-[700]">Vaults</div>
                    <div className="shrink-0 text-[12px] w-[24px] h-[24px] flex justify-center items-center rounded-[5px] border border-[rgba(0,0,0,0.2)]">
                      {list.listLoading ? (
                        <Loading size={12} />
                      ) : (
                        list.listData.length
                      )}
                    </div>
                  </div>
                  <Search className="flex-1 w-0" />
                </div>
                <Filter />
              </Card>
              <div className="w-full flex justify-center pt-[20px]">
                <Feedback className="opacity-70" />
              </div>
            </div>
            <Card className="w-0 flex-1 !rounded-[18px] !px-[18px] flex flex-col gap-[20px]">
              <Dashboard className="shrink-0" />
              <VaultsTable className="flex-1 h-0" />
            </Card>
          </div>
        </div>
        <ActionModal />
        <ClaimModal />
        <ClaimSuccessModal />
        <StrategyModal pool={list.listDataHotStrategy} />
      </div>
    </VaultsV2ContextProvider>
  );
};

export default VaultsV2;
