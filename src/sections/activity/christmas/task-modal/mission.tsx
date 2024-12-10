import Button from "./button";
import PresentIcon from "./present-icon";
import { Quest } from '@/sections/activity/christmas/hooks/use-quest';
import { useContext, useMemo, useState } from 'react';
import { ChristmasContext } from '@/sections/activity/christmas/context';
import { useWalletName } from '@/hooks/use-wallet-name';
import useCustomAccount from '@/hooks/use-account';
import { useAppKit } from '@reown/appkit/react';
import BerasigPrompt from '@/sections/activity/christmas/task-modal/berasig-prompt';

export default function Mission({ mission }: Props) {
  const {
    handleQuestMissionCheck,
    questVisited,
    getQuestVisited,
    setQuestVisited,
  } = useContext(ChristmasContext);
  const { name: walletName } = useWalletName();
  const { account } = useCustomAccount();
  const modal = useAppKit();

  const missionVisited = useMemo(() => {
    return getQuestVisited?.(mission?.id);
  }, [questVisited, mission, account]);

  const [visitedBerasigDownload, setVisitedBerasigDownload] = useState(false);
  const [berasigVisible, setBerasigVisible] = useState(false);

  const actionText = useMemo(() => {
    if (mission.name === 'Beraji') {
      if (visitedBerasigDownload) {
        return 'Reload Page';
      }
      // @ts-ignore
      if (!window?.berasig) {
        return 'Download BeraSig';
      }
      if (walletName !== 'Berasig') {
        return 'Connect BeraSig';
      }
      if (missionVisited) {
        return 'Check';
      }
    }
    return mission.missionAction;
  }, [mission, walletName, visitedBerasigDownload]);

  const handleMission = () => {
    if (!account) {
      modal.open({ view: 'Connect' });
      return;
    }
    if (mission.name === 'Beraji') {
      if (visitedBerasigDownload) {
        window?.history?.go(0);
        return;
      }
      // @ts-ignore
      if (!window?.berasig) {
        window?.open(mission.url || 'https://chromewebstore.google.com/detail/berasig/ckedkkegjbflcfblcjklibnedmfjppbj?hl=en-US&utm_source=ext_sidebar');
        setVisitedBerasigDownload(true);
        return;
      }
      if (walletName !== 'Berasig') {
        // @ts-ignore
        // window.berasig.ethereum.request({ method: 'eth_requestAccounts' });
        modal.open({ view: 'Connect' });
        return;
      }
      if (!missionVisited) {
        setBerasigVisible(true);
        setQuestVisited?.({ id: mission.id, visited: true, account });
        return;
      }
      handleQuestMissionCheck?.(mission);
      return;
    }
    if (mission.url) {
      window?.open(mission.url);
      setQuestVisited?.({ id: mission.id, visited: true, account });
      handleQuestMissionCheck?.(mission);
      return;
    }
    handleQuestMissionCheck?.(mission);
  };

  return (
    <div className="mt-[10px] bg-black/5 rounded-[10px] h-[78px] px-[16px] flex justify-between items-center">
      <div className="text-[16px] font-medium">{mission.description}</div>
      {
        mission.completed ? (
          <div className="w-[110px] h-[33px] flex justify-center items-center gap-[6px] bg-[#FFFDEB] border border-black rounded-[17px] px-[6px]">
            <div className="text-black text-[14px] font-[600] leading-[100%]">
              {mission.total_box || 0} boxed
            </div>
            <img src="/images/activity/christmas/icon-complete.svg" alt="" className="w-[26px] h-[26px] rounded-full" />
          </div>
        ) : (
          <Button
            disabled={mission?.checking}
            onClick={handleMission}
            className="whitespace-nowrap !disabled:opacity-50"
          >
            <span>{actionText}</span>
            {new Array(mission.box).fill(1).map((i: any) => (
              <PresentIcon key={i} />
            ))}
          </Button>
        )
      }
      <BerasigPrompt
        visible={berasigVisible}
        onClose={() => {
          setBerasigVisible(false);
        }}
      />
    </div>
  );
}

interface Props {
  mission: Partial<Quest>;
}
