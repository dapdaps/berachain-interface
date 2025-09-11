import CheckInEntry from "@/components/check-in/entry";
import ConnectWallet from "@/components/connect-wallet";
import PointsEntry from "@/components/points/entry";
import useCustomAccount from "@/hooks/use-account";
import { useBgtCount } from "@/hooks/use-bgt-count";
import useIsMobile from "@/hooks/use-isMobile";
import { CoinType } from "@/layouts/main/BGTCoin";
import { useBgt } from "@/sections/home/hooks/useBgt";
import { useTapSoundStore } from "@/stores/tap-sound";

const MobileHeader = () => {
  const bgt = useBgt();
  const { iBGTCount, BGTCount } = useBgtCount();
  const isMobile = useIsMobile();
  const tapSound = useTapSoundStore();
  const { accountWithAk } = useCustomAccount();

  const handleBGTClick = (type: CoinType) => {
    bgt.handleBgt(true, type);
    tapSound.play?.();
  };

  return (
    <div className="w-full flex items-center justify-between px-1 fixed top-4 left-0 right-0 z-[10]">
      <div className="flex items-center gap-[10px] pl-[10px]">
        {!!accountWithAk && (
          <PointsEntry />
        )}
        {!!accountWithAk && (
          <CheckInEntry />
        )}
      </div>
      <div className="flex h-[10.77vw]">
        <ConnectWallet />
      </div>
    </div>
  );
};

export default MobileHeader;
