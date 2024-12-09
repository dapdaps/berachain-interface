import Top from "@/sections/activity/christmas/sections/top";
import NFTProgress from "@/sections/activity/christmas/sections/progress";
import Summary from "@/sections/activity/christmas/sections/summary";
import GiftBox from "@/sections/activity/christmas/sections/gift-box";
import Quest from "@/sections/activity/christmas/sections/quest";
import { ChristmasContext } from '@/sections/activity/christmas/context';
import SwapModal from '@/sections/swap/SwapModal';
import { beraB } from '@/configs/tokens/bera-bArtio';
import { protocols, SnowToken } from '@/sections/activity/christmas/config';
import { useContext } from 'react';
import ChristmasSnow from '@/components/bear-background/home/christmas/snow';

const Christmas = () => {
  const {
    showSwapModal,
    setShowSwapModal,
  } = useContext(ChristmasContext);

  return (
    <div className="relative overflow-hidden">
      <ChristmasSnow className="!z-[0]" />
      <div className="relative z-[1]">
        <Top>
          <NFTProgress />
        </Top>
        <Summary />
        <GiftBox />
        <Quest />
        {showSwapModal && (
          <SwapModal
            show={showSwapModal}
            defaultInputCurrency={beraB['bera']}
            defaultOutputCurrency={SnowToken}
            protocols={protocols}
            onClose={() => {
              setShowSwapModal?.(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Christmas;
