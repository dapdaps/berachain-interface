import Drawer from '@/components/drawer';
import IconClose from '@public/images/modal/close.svg';

import HatHover from '../../HatHover';
import ClothHover from '../../ClothHover';
import NeckHover from '../../NeckHover';
import KeyHover from '../../KeyHover';


interface Props {
  show: boolean;
  onClose: any;
}

export default function Welcome({
  show, onClose
}: Props) {

  return (
    <Drawer visible={show} onClose={onClose} size="580px">
        <div className="w-full flex relative">
            <img src='/images/mobile/cave/hi.png' className='absolute left-[20px] top-[-55px] w-[146px] h-[63px] z-[0]' />
            <IconClose className='absolute top-[-40px] right-[16px]' onClick={onClose} />
            <div className='w-full py-[22px] overflow-y-scroll max-h-[580px]'>
                <div className='w-full flex justify-between items-center px-[20px]'>
                    <div className='font-CherryBomb text-[26px] font-[400] leading-[23.4px] text-left w-[232px]'>Welcome to the Bear Cave!</div>
                    <img src="/images/mobile/cave/bee.png" className='w-[30px] h-[25px]' alt="" />
                </div>
                <div className='my-[10px] text-[16px] font-[500] leading-[19.2px] text-justify font-Montserrat px-[20px]'>
                In BeraTown, every action you take brings you closer to earning unique accessories as you progress through your DeFi journey with our vendors. Imagine your character growing and evolving, piece by piece, as you bridge, swap, lend, and delegate with style. A creative observer is keeping track of your bridge, swap, lending, and BGT delegation activities, ensuring every move you make is properly rewarded with accessories that mark your progress.
                </div>

                <div className='flex flex-col gap-[20px] justify-center items-center px-3'>
                    <HatHover />
                    <ClothHover />
                    <NeckHover />
                    <KeyHover />
                </div>

                {/* <div className='mt-[10px] px-[20px]'>
                    <div className='font-CherryBomb text-[16px] font-[400] leading-[19px] text-left'>Note:</div>
                    <div className='font-Montserrat text-[16px] font-[400] leading-[19px] text-left'>BeraTown is in its trial period, and all our partners are currently on testnet. The accessories you earn might not last forever—but who knows, they could end up meaning something. Or maybe… just maybe… probably nothing.</div>
                </div> */}
            </div>
        </div>
    </Drawer>
  );
}