import { useState } from 'react';
import Modal from '@/components/modal';
import TipModal from './TipModal';
import ClothHover from './ClothHover';
import HatHover from './HatHover';
import KeyHover from './KeyHover';
import NeckHover from './NeckHover';

interface Props {
  show: boolean;
  onClose: any;
}

export default function Welcome({
  show, onClose
}: Props) {
  // const [show, setShow] = useState(true);

  // if (!show) {
  //   return null;
  // }

  return (
    <Modal
      open={show}
      // style={{ alignItems: 'end', paddingBottom: 50 }}
      closeIconClassName=' right-[80px] top-[80px]'
      onClose={() => {
        onClose();
      }}
    >
      <div className='w-[1236px]'>
        <div className="w-[1150px] h-[743px] bg-[url('/images/cave/welcome/welcome-bg.png')] bg-contain bg-no-repeat">
          <div className='pt-[180px] px-[50px] text-[16px] font-medium'>In BeraTown, every action you take brings you closer to earning unique accessories as you progress through your DeFi journey with our vendors. Imagine your character growing and evolving, piece by piece, as you bridge, swap, lend, and delegate with style. A creative observer is keeping track of your bridge, swap, lending, and BGT delegation activities, ensuring every move you make is properly rewarded with accessories that mark your progress.</div>
          <div className='flex w-[1236px] items-start gap-[20px] mt-[10px] ml-[-60px]'>
            <HatHover />
            <ClothHover />
            <NeckHover />
            <KeyHover />
          </div>
          <div className=' px-[50px] text-[16px] font-medium mt-[-5px]'>
            <div className='font-CherryBomb'>Note: </div>
            <div>BeraTown is in its trial period, and all our partners are currently on testnet. The accessories you earn might not last forever—but who knows, they could end up meaning something. Or maybe… just maybe… probably nothing.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
