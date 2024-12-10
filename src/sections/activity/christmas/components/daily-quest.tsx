import Modal from '@/components/modal';
import Card from '@/components/card';
import { useContext } from 'react';
import { ChristmasContext } from '@/sections/activity/christmas/context';

const DailyQuest = (props: any) => {
  const { visible, onClose, list } = props;

  const {
    handleQuest,
    handleQuestCheck,
  } = useContext(ChristmasContext);

  return (
    <Modal
      open={visible}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <Card
        className="w-[595px] font-CherryBomb leading-[150%] text-[16px] font-[700] text-black"
      >
        <div className="text-[20px] font-[400] leading-[90%]">
          Quest of the day
        </div>
        <div className="flex flex-col justify-stretch gap-[20px] mt-[20px]">
          {
            list.map((item: any, index: number) => (
              <div className="flex justify-between items-center gap-[15px]" key={index}>
                <div
                  className="cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis w-[0] flex-1 h-[45px] border border-black rounded-[10px] bg-[#FFDC50] shadow-shadow1 flex items-center p-[0_12px]"
                  onClick={async () => {
                    await handleQuest?.(item);
                    await handleQuestCheck?.(item);
                  }}
                >
                  {index + 1}. {item.name}
                </div>
                <div
                  className={`flex justify-center items-center shrink-0 w-[26px] h-[26px] rounded-[8px] border border-black shadow-[3px_3px_0px_0px_rgba(0,_0,_0,_0.25)_inset] ${item.completed ? 'bg-[#7FE585]' : 'bg-[#E9E3B5]'}`}
                >
                  {
                    item.completed && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4.5L4.33333 8L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )
                  }
                </div>
              </div>
            ))
          }
        </div>
      </Card>
    </Modal>
  );
};

export default DailyQuest;
