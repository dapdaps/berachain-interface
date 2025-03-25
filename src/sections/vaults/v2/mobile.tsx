import PageBack from '@/components/back';
import Card from '@/components/card';
import Dashboard from '@/sections/vaults/v2/components/dashboard';
import TopCard from '@/sections/vaults/v2/components/top-card';
import ActionModal from '@/sections/vaults/v2/components/action/modal';
import VaultsV2ContextProvider from '@/sections/vaults/v2/context';
import { useVaultsV2 } from '@/sections/vaults/v2/hooks';
import ClaimModal from '@/sections/vaults/v2/components/claim/modal';
import ClaimSuccessModal from '@/sections/vaults/v2/components/claim/success';
import StrategyModal from '@/sections/vaults/v2/components/strategy/modal';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import VaultsTableMobile from '@/sections/vaults/v2/components/vaults-table/mobile';
import { useList } from '@/sections/vaults/v2/hooks/list';
import FilterModal from '@/sections/vaults/v2/components/filter/modal';

const VaultsV2Mobile = (props: any) => {
  const { } = props;

  const vaultsV2 = useVaultsV2();
  const list = useList();

  return (
    <VaultsV2ContextProvider value={{ ...vaultsV2, ...list }}>
      <div className="relative w-full h-full overflow-y-auto pb-[64px] bg-[url('/images/vaults/v2/bg.png')] bg-black/90 bg-no-repeat bg-top bg-cover">
        <div className="pt-[23px] flex justify-center items-center">
          <PageBack className="absolute left-[17px]" />
          <div className="w-[200px] h-[50px] flex justify-center items-center gap-[10px] mx-auto shrink-0 rounded-[4px] border border-[#000] bg-[#E9B965] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] text-[#000] text-center font-[400] font-CherryBomb text-[24px] leading-[90%]">
            <div className="">Vaults</div>
            <div className="flex justify-center items-center w-[24px] h-[24px] shrink-0 bg-[#edc784] border border-[#bb9451] rounded-[6px] text-black text-right font-Montserrat text-[12px] font-[500] leading-[90%]">
              54
            </div>
          </div>
        </div>

        <div className="w-full pl-[8px] mt-[27px]">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000 }}
            loop={true}
            className="w-full h-[157px]"
            spaceBetween={11}
            slidesPerView={1.2}
            updateOnWindowResize={true}
          >
            <SwiperSlide>
              <TopCard type={0} className="!px-[15px]" />
            </SwiperSlide>
            <SwiperSlide>
              <TopCard type={1} className="!px-[15px]" />
            </SwiperSlide>
            <SwiperSlide>
              <TopCard type={2} className="!px-[15px]" />
            </SwiperSlide>
          </Swiper>
        </div>

        <Card className="w-full !rounded-[18px] !px-[12px] mt-[17px]">
          <Dashboard />
          <VaultsTableMobile />
        </Card>

        <ActionModal />
        <ClaimModal />
        <ClaimSuccessModal />
        <StrategyModal />
        <FilterModal />
      </div>
    </VaultsV2ContextProvider>
  );
};

export default VaultsV2Mobile;
