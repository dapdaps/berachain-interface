import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings';

const TYPES = ['Auto', 'Custom'];

export default function SlippageSettingContent({ show }: any) {
  const settingStore: any = useSettingsStore();
  const [type, setType] = useState(
    settingStore.getSlippage() ? 'Custom' : 'Auto'
  );
  useEffect(() => {
    if (!show && !settingStore.getSlippage()) {
      settingStore.setSlippage(0.5);
    }
  }, [show]);

  return (
    <div className='w-[302px] h-[139px] p-[20px] rounded-[20px] border border-black bg-[#FFFDEB] md:w-full md:rounded-b-none md:h-[150px]'>
      <div className='text-[16px] font-semibold'>Setting</div>
      <div className='text-[14px] font-medium mt-[6px]'>Max. Slippage</div>
      <div className='flex gap-[8px] mt-[10px] text-[14px] font-normal'>
        <div className='rounded-[12px] border border-[#373A53] p-[4px] flex'>
          {TYPES.map((_type) => (
            <div
              key={_type}
              className={`rounded-[10px] cursor-pointer	h-[32px] leading-[32px] min-w-[70px] text-center ${
                _type === type
                  ? 'border border-black bg-[#FFDC50]'
                  : 'border-0 bg-transparent'
              }`}
              onClick={() => {
                setType(_type);
                settingStore.setSlippage(_type === 'Auto' ? '' : '0.5');
              }}
            >
              {_type}
            </div>
          ))}
        </div>
        <div className='w-[82px] h-[40px] rounded-[12px] border border-[#373A53] bg-white flex gap-[10px] items-center pr-[10px]'>
          <input
            placeholder='0.5'
            value={settingStore.getSlippage()}
            className='border-0 leading-[40px] pl-[20px] bg-transparent w-full'
            onChange={(ev: any) => {
              settingStore.setSlippage(Number(ev.target.value));
              setType(Number(ev.target.value) !== 0.5 ? 'Custom' : 'Auto');
            }}
            type='number'
            onWheel={(e: any) => (e.target as HTMLInputElement).blur()}
          />
          <div>%</div>
        </div>
      </div>
    </div>
  );
}
