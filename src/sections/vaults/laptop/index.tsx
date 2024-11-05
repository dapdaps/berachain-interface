import Bg from '../components/pc-bg';
import PageBack from '@/components/back';
import Content from '@/sections/liquidity/Content';

export default function Laptop({ dapp }: any) {
  return (
    <div className='h-screen bg-vault relative'>
      <div className='absolute w-full flex flex-col items-center'>
        <Bg />
      </div>
      <div className='pt-[68px] relative z-[2]'>
        <PageBack
          className='absolute left-[36px] top-[100px] text-white'
        />
        <div className='text-center text-[60px] font-CherryBomb text-white mt-[10px]'>
          Vaults
        </div>
        <div className='w-[970px] mx-[auto] mt-[20px]'>
          <Content dapp={dapp} />
        </div>
      </div>
    </div>
  );
}
