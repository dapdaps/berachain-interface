import MarketPlaceView from '@/sections/marketplace';
import PageBack from '@/components/back';
import PageTitle from '@/components/title';

const MarketPlace = () => {
  return (
    <div className="relative">
      <PageBack className="absolute left-[36px] top-[31px]" />
      <PageTitle className="pt-[30px]">Marketplace</PageTitle>
      <MarketPlaceView />
    </div>
  );
};

export default MarketPlace;