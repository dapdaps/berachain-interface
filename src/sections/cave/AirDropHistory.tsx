import { useState } from 'react';
import Modal from '@/components/modal';
import { AirDropHistoryData } from './useAirdrop';
import Empty from '@/components/empty';
interface Props {
  show: boolean;
  onClose: () => void;
  airDropHistory: AirDropHistoryData[];
}

const cloth_cateogries: any = {
  'hats': 'hat', 
  'jackets': 'clothing', 
  'cars': 'key', 
  'necklaces': 'neck', 
}

export default function AirdropHistory({ show, onClose, airDropHistory }: Props) {
  return (
    <Modal
      open={show}
      closeIconClassName="right-[15px] top-[15px]"
      onClose={onClose}
    >
      <div className="w-[850px] min-h-[450px] bg-[#FFFDEB] rounded-[10px] p-[20px]">
        <div className="text-[20px] font-bold mb-[20px]">Your Airdrop History</div>

        {
          airDropHistory?.length === 0 && <Empty mt={100} desc="No airdrop history" />
        }
        {
          airDropHistory?.map((item, index) => {
            return (
              <div className="mb-[20px]  font-CherryBomb" key={item.round}>
                <div className="flex items-center text-[22px] justify-between mb-[10px]">
                  <div className="font-bold">Airdrop Round {item.round}</div>
                  <div className="flex items-center" style={{ opacity: Number(item.amount) === 0 ? 0.3 : 1 }}>
                    <img src="/images/cave/bera-token.png" alt="bera" className="w-[31px]" />
                    <span className="ml-1">{item.amount}</span>
                  </div>
                </div>
                <div className="text-[16px] text-[#000000] mb-[5px]">{new Date(item.startTime).toLocaleDateString()} - {new Date(item.endTime).toLocaleDateString()}</div>
                
                
                <div className="bg-[#0000000F] p-[10px] rounded-[5px] mt-[10px]">
                  <div className="text-[16px] text-[#F7F9EA] mb-[10px]" style={{ WebkitTextStroke: '1px #4B371F' }}>
                    {item.reward?.items?.length > 0 ? 'Items you got in this round' : "You didn’t get any items in this round"}
                  </div>
                  <div className="flex gap-[30px] items-center">
                    {
                      item.reward?.items?.map((cloth, index) => {
                        return (
                          <img src={`/images/cave/${cloth_cateogries[cloth.category]}/${cloth_cateogries[cloth.category]}-${cloth.level}-${cloth.level}.png`} key={index} alt="task" className="w-[50px]" />
                        )
                      })  
                    }
                  </div>
                </div>
              </div>
            )
          })
        }

      </div>
    </Modal>
  );
}
