import Modal from '@/components/modal';
import Info from '@/sections/Lending/Beraborrow/info';
import CurrencyInput from '@/sections/Lending/components/input';
import { useState } from 'react';
import Health from '@/sections/Lending/Beraborrow/health';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import InputNumber from '@/components/input-number';
import Button from '@/components/button';

export const Form = (props: any) => {
  const { market, borrowToken } = props;

  const [amount, setAmount] = useState<string>();
  const [borrowAmount, setBorrowAmount] = useState<string>();

  return (
    <div className="px-[12px] py-[20px] flex justify-between items-stretch gap-4">
      <Info {...props} />
      <div className="w-[450px] shrink-0 flex flex-col items-stretch gap-[10px]">
        <div className="text-black text-[16px] font-[600]">
          Deposit Collateral
        </div>
        <CurrencyInput
          className=""
          token={market}
          amount={amount}
          onAmount={setAmount}
          onBalance={() => {
          }}
          tokens={[]}
        />
        <div className="text-black text-[16px] font-[600]">
          Borrow {borrowToken?.symbol}
        </div>
        <CurrencyInput
          className=""
          token={borrowToken}
          amount={borrowAmount}
          onAmount={setBorrowAmount}
          onBalance={() => {
          }}
          tokens={[]}
        />
        <div className="text-black text-[16px] font-[600] flex justify-between items-center">
          <div className="flex items-center gap-[5px]">
            <div>Updated Ratio</div>
            <Popover
              trigger={PopoverTrigger.Hover}
              placement={PopoverPlacement.Top}
              contentStyle={{ zIndex: 200 }}
              content={(
                <Card className="w-[300px] text-[14px]">
                  The ratio of your bHONEY's value to your NECT debt. It's vital to maintain this ratio above the minimum ratio of 110% to avoid liquidations
                </Card>
              )}
            >
              <img src="/images/icon-tips.svg" alt="" className="w-[18px] h-[18px] cursor-pointer" />
            </Popover>
          </div>
          <Health />
        </div>
        <div className="w-full h-[72px] relative">
          <InputNumber
            className="w-full h-full border border-[#373A53] bg-white rounded-[12px] text-[26px] font-[700] pl-[20px] pr-[40px]"
            placeholder="0"
            value={amount}
            onNumberChange={() => {}}
          />
          <div className="absolute right-[20px] top-0 h-full flex items-center text-[26px] font-[700] text-black">%</div>
        </div>
        <div className="w-full mt-[10px]">
          <Button
            type="primary"
            className="w-full h-[60px]"
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
};

const BorrowModal = (props: any) => {
  const { visible, onClose } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
    >
      <div className="bg-[#FFFDEB] rounded-[20px] border border-black shadow-shadow1 w-[900px]">
        <div className="text-black font-[700] text-[18px] px-[12px] pt-[20px]">
        Borrow
        </div>
        <Form {...props} />
      </div>
    </Modal>
  );
};

export default BorrowModal;