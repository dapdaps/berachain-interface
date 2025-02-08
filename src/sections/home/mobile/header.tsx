import ConnectWallet from "@/components/connect-wallet";
import Big from "big.js";
import BGTCoin, { CoinType } from "@/layouts/main/BGTCoin";
import React from "react";
import { useBgt } from "@/sections/home/hooks/useBgt";
import { useBgtCount } from "@/hooks/use-bgt-count";
import useIsMobile from "@/hooks/use-isMobile";
import { useTapSoundStore } from "@/stores/tap-sound";
import BGTMobileView from "@/sections/bgt/mobile";
import IBGTMobileView from "@/sections/bgt/ibgt/mobile";

const MobileHeader = () => {
  const bgt = useBgt();
  const { iBGTCount, BGTCount } = useBgtCount();
  const isMobile = useIsMobile();
  const tapSound = useTapSoundStore();

  const handleBGTClick = (type: CoinType) => {
    bgt.handleBgt(true, type);
    tapSound.play?.();
  };

  return (
    <div className="w-full flex items-center justify-between px-3 fixed top-4 left-0 right-0 z-[10]">
      <div className="flex h-[10.77vw]">
        <ConnectWallet />
      </div>
      <div
        className="text-white flex items-center justify-end gap-x-[10px]"
        style={
          isMobile &&
          ((Big(BGTCount || 0).gt(0) && Big(BGTCount || 0).lt(1e2)) ||
            (Big(iBGTCount || 0).gt(0) && Big(iBGTCount || 0).lt(1e2)))
            ? { scale: 0.85 }
            : {}
        }
      >
        <BGTCoin
          type={CoinType.BGT}
          count={BGTCount}
          bp="1015-009"
          onClick={handleBGTClick}
        />
        <BGTCoin
          type={CoinType.iBGT}
          count={iBGTCount}
          bp="1015-010"
          onClick={handleBGTClick}
        />
      </div>
      <BGTMobileView
        visible={bgt.visible && bgt.type === CoinType.BGT}
        onClose={() => {
          bgt.handleBgt(false);
        }}
      />
      <IBGTMobileView
        visible={bgt.visible && bgt.type === CoinType.iBGT}
        onClose={() => {
          bgt.handleBgt(false);
        }}
      />
    </div>
  );
};

export default MobileHeader;
