import PageBack from '@/components/back';
import Content from '@/sections/staking/Content';
import Chest from '../components/chest';
import Bg from '../components/pc-bg';
export default function Laptop({ dapp }: any) {

  return (
    <div className='bg-vault relative h-full overflow-hidden'>
      <div className='absolute w-full flex flex-col items-center'>
        <Bg />
      </div>
      <div className='pt-[68px] relative z-[2]'>
        <PageBack className='absolute left-[36px] top-[100px] text-white' />
        <div className='text-center text-[60px] font-CherryBomb text-white mt-[10px]'>
          Vaults
        </div>
        <div className='w-[970px] mx-[auto] mt-[20px] relative'>
          <Content dapp={dapp} />
          <Chest />
        </div>
      </div>
      <div className='w-full h-[249px] bg-[#FFDC50] absolute bottom-0' />
    </div>
  );
}
