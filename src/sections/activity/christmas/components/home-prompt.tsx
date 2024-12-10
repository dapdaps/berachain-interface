import { useQuestStore } from '@/sections/activity/christmas/stores/use-quest-store';
import Modal from '@/components/modal';
import Button from '@/sections/activity/christmas/components/button';
import { useRouter } from 'next/navigation';

const HomePrompt = () => {
  const visible = useQuestStore((store) => store.homePromptVisible);
  const setVisible = useQuestStore((store) => store.setHomePromptVisible);
  const router = useRouter();

  return (
    <Modal
      open={visible}
      onClose={() => {
        setVisible(false);
      }}
    >
      <div className="w-[680px] rounded-[10px] text-center bg-[#B5956E] border border-[#333648] shadow-[0px_0px_4px_0px_rgba(0,_0,_0,_0.25)]">
        <img
          src="/images/activity/christmas/home-prompt-banner.svg"
          alt=""
          className="w-full h-[408px] rounded-[10px]"
        />
        <div className="px-[27px] pt-[16px] text-[#6C0B0C] text-[24px] font-[700] leading-normal whitespace-nowrap">
          Henlo ho ho, the Bera Claus is coming to da town!
        </div>
        <div className="text-black text-[#16px] font-[400] leading-[150%] pt-[20px] px-[31px]">
          And he’s bringing some <strong>Gift Boxes</strong> to all the nice bera who who diligently exploring and using the <strong>Berachain</strong> ecosystem. <strong>Valuable</strong> ecosystem <strong>NFTs</strong>, <strong>tokens</strong> and lots of <strong>fun</strong> stuff await you inside the boxes! <strong>Grab ‘em now</strong>!
        </div>
        <div className="pt-[20px] pb-[22px] flex justify-center items-center gap-[14px]">
          <Button
            type="primary"
            className="px-[68px]"
            onClick={() => {
              router.push('/activity/christmas');
              setVisible(false);
            }}
          >
            Show me how!
          </Button>
          <Button
            type="primary"
            className="px-[68px] bg-[#FFFDEB]"
            onClick={() => {
              setVisible(false);
            }}
          >
            Explore it later
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HomePrompt;
