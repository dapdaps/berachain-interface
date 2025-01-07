import Card from '@/components/card';
import TransferItem from '@/sections/cave/components/TransferItems/Item';

const TransferItems = (props: any) => {
  const {} = props;

  return (
    <Card className="!rounded-[20px] w-[702px] pt-[20px] px-[32px] pb-[33px]">
      <div className="text-black text-[32px] font-CherryBomb text-center font-[400] leading-[90%]">
        Transfer Boost Items
      </div>
      <div className="mt-[20px] flex justify-between items-start gap-[33px]">
        <div className="flex: 1">
          <div className="text-[#000] font-[Montserrat] text-[18px] font-bold leading-[100%]">
            Choose Boost Items
          </div>
          <div className="mt-[5px] text-[#000] font-[Montserrat] text-[16px] font-medium leading-[150%]">
            Choose items below to Beraciaga (the TG game) for boost mining. <br />The highest level in the each category will boost in Beraciaga.
          </div>
        </div>
        <div className="shrink-0 text-[#3672F4] text-center font-[Montserrat] text-[14px] font-semibold leading-[100%] underline decoration-solid decoration-skip-ink-[none] underline-offset-[auto] underline-position-[from-font]">
          Check All
        </div>
      </div>
      <div className="grid grid-cols-4 gap-x-[6px] gap-y-[5px] mt-[12px]">
        <TransferItem />
        <TransferItem />
        <TransferItem />
        <TransferItem />
        <TransferItem />
        <TransferItem />
      </div>
      <div className="text-[#000] font-[Montserrat] text-[16px] font-bold leading-[100%] mt-[28px]">
        Transfer to Beraciaga Account
      </div>
      <div className="flex justify-between items-center w-full h-[52px] rounded-[16px] border border-[#000] bg-white mt-[17px]">
        <input type="text" className="text-[#000] font-[Montserrat] text-[16px] font-medium leading-[50px] flex-1 h-full rounded-[16px] px-[20px]" />
        <button
          type="button"
          className="shrink-0 px-[12px] text-[#3672F4] text-center font-[Montserrat] text-[14px] font-semibold leading-[100%] underline decoration-solid decoration-[auto] decoration-skip-ink-[none] underline-offset-[auto] underline-position-[from-font]"
        >
          Paste
        </button>
      </div>
      <div className="flex justify-start items-center gap-[5px] mt-[10px]">
        <img src="/images/cave/icon-form-checked.svg" alt="" className="w-[24px] h-[24px] shrink-0" />
        <div className="text-[#000] font-[Montserrat] text-[16px] font-medium leading-[150%]">
          TG account verified.
        </div>
      </div>
      <div className="mt-[25px] relative w-full h-[128px] bg-[url('/images/cave/transfer-slogan.svg')] bg-no-repeat bg-center bg-contain">
        <div className="absolute bottom-0 left-[45%] -translate-y-1/2 w-[56px] h-[56px] bg-[url('/images/cave/transfer-flash-bg.svg')] bg-no-repeat bg-center bg-cover border-[2px] border-[#709d28] bg-[#c7ff6d] rounded-full flex justify-center items-center text-[#6376FF] text-center text-stroke-[1px] text-stroke-[#E1FF0A] font-[Montserrat] text-[20px] italic font-extrabold leading-[100%]">
          1x
        </div>
      </div>
      <div className="mt-[15px] flex justify-center">
        <button
          type="button"
          className="px-[80px] flex justify-center items-center gap-[8px] h-[54px] bg-[#FFD335] border border-black rounded-[16px] text-[16px] text-black font-[700] font-[Montserrat]"
        >
          Transfer Now
        </button>
      </div>
    </Card>
  );
};

export default TransferItems;
