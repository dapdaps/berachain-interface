import PageBack from "@/components/back";
import Card from "@/components/card";
import Dashboard from "@/sections/vaults/v2/components/dashboard";
import TopCard from "@/sections/vaults/v2/components/top-card";
import ActionModal from "@/sections/vaults/v2/components/action/modal";
import VaultsV2ContextProvider from "@/sections/vaults/v2/context";
import { useVaultsV2 } from "@/sections/vaults/v2/hooks";
import ClaimModal from "@/sections/vaults/v2/components/claim/modal";
import ClaimSuccessModal from "@/sections/vaults/v2/components/claim/success";
import StrategyModal from "@/sections/vaults/v2/components/strategy/modal";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import VaultsTableMobile from "@/sections/vaults/v2/components/vaults-table/mobile";
import { useList } from "@/sections/vaults/v2/hooks/list";
import FilterModal from "@/sections/vaults/v2/components/filter/modal";
import Loading from "@/components/loading";
import { useRef } from "react";
import { Description, Statistics, Tips } from '@/sections/vaults/v2/components/aggregating';
import RewardTopCard from '@/sections/vaults/v2/components/reward-top-card';
import useBoycoData from '@/sections/boyco/use-data';

const VaultsV2Mobile = (props: any) => {
  const {} = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const vaultsV2 = useVaultsV2();
  const list = useList();
  const boycoData = useBoycoData(list.listDataGroupByPoolAll || []);

  return (
    <VaultsV2ContextProvider value={{ ...vaultsV2, ...list, boycoData, containerRef }}>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-y-auto pb-[64px] bg-[url('/images/vaults/v2/bg.png')] bg-black/90 bg-no-repeat bg-top bg-cover"
      >
        <div className="pt-[23px] px-[16px] flex justify-center items-center">
          <PageBack className="absolute left-[17px]" />
          <div className="w-full h-[50px] flex justify-center items-center gap-[10px] mx-auto shrink-0 text-white text-center font-[400] font-CherryBomb text-[30px] leading-[90%]">
            <div className="">Vaults</div>
            {/*<div className="flex justify-center items-center w-[24px] h-[24px] shrink-0 bg-[#edc784] border border-[#bb9451] rounded-[6px] text-black text-right font-Montserrat text-[12px] font-[500] leading-[90%]">
              {list.listLoading ? <Loading size={12} /> : list.listData.length}
            </div>*/}
          </div>
          <Tips className="absolute right-[17px]" />
        </div>

        <Description className="mt-[12px] text-center text-white font-Montserrat text-[12px] font-[500] leading-[120%]" />

        <Statistics className="mt-[20px]" />

        <div className="w-full pl-[8px] md:pl-0 mt-[27px] md:mt-[17px]">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000 }}
            loop={true}
            className="w-full h-[130px]"
            spaceBetween={0}
            slidesPerView={2}
            updateOnWindowResize={true}
          >
            <SwiperSlide>
              <div className="pl-[10px] pt-[10px]">
                <RewardTopCard type={1} />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="pl-[10px] pt-[10px]">
                <RewardTopCard type={0} />
              </div>
            </SwiperSlide>
            {/*<SwiperSlide>
              <TopCard
                type={0}
                className="!px-[15px]"
                pool={list.listDataTopAPY}
              />
            </SwiperSlide>
            <SwiperSlide>
              <TopCard
                type={1}
                className="!px-[15px]"
                pool={list.listDataTopTVL}
              />
            </SwiperSlide>
            <SwiperSlide>
              <TopCard
                type={2}
                className="!px-[15px]"
                pool={list.listDataHotStrategy}
              />
            </SwiperSlide>*/}
          </Swiper>
        </div>

        <div className="px-[12px] mt-[14px]">
          <Dashboard />
        </div>

        <Card className="w-full !rounded-[18px] !px-[12px] mt-[16px] !pt-[13px]">
          <VaultsTableMobile />
        </Card>

        <ActionModal />
        <ClaimModal />
        <ClaimSuccessModal />
        <StrategyModal pool={list.listDataHotStrategy} />
        <FilterModal />
      </div>
    </VaultsV2ContextProvider>
  );
};

export default VaultsV2Mobile;
