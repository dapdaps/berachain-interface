import Button from "./button";
import PresentIcon from "./present-icon";
import { Quest } from '@/sections/activity/christmas/hooks/use-quest';
import { useContext } from 'react';
import { ChristmasContext } from '@/sections/activity/christmas/context';

export default function Mission({ mission }: Props) {
  const {
    handleQuestCheck,
  } = useContext(ChristmasContext);

  const handleMission = () => {
    if (mission.name === 'Beraji') {
      // @ts-ignore
      if (!window?.berasig) {
        window?.open(mission.url || 'https://chromewebstore.google.com/detail/berasig/ckedkkegjbflcfblcjklibnedmfjppbj?hl=en-US&utm_source=ext_sidebar');
        return;
      }
      return;
    }
    if (mission.url) {
      window?.open(mission.url);
    }
  };

  return (
    <div className="mt-[10px] bg-black/5 rounded-[10px] h-[78px] px-[16px] flex justify-between items-center">
      <div className="text-[16px] font-medium">{mission.description}</div>
      <Button onClick={handleMission}>
        <span>{mission.missionAction}</span>
        {new Array(mission.box).fill(1).map((i: any) => (
          <PresentIcon key={i} />
        ))}
      </Button>
    </div>
  );
}

interface Props {
  mission: Partial<Quest>;
}
