import { useSettingsStore } from '@/stores/settings';
import { balanceFormated } from '@/utils/balance';

export default function Result({ price, token0, token1 }: any) {
  const slippage = useSettingsStore((store: any) => store.slippage);
  return (
    <div className='flex flex-col gap-[13px] rounded-[12px] border border-[#373A53] mt-[18px] p-[12px] text-[14px] font-medium'>
      <div className='flex justify-between items-center'>
        <div>Pool price</div>
        <div>
          1 {token0.symbol} = {price ? balanceFormated(price, 4) : '-'} 
          {token1.symbol}
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <div>Total value</div>
        <div>-</div>
      </div>
      <div className='flex justify-between items-center'>
        <div>Slippage</div>
        <div>{slippage}%</div>
      </div>
    </div>
  );
}
