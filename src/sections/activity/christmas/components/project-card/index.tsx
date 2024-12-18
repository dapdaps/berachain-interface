import CheckButton from "../check-button";
import Button from "../../task-modal/button";
import useCustomAccount from '@/hooks/use-account';
import { useAppKit } from '@reown/appkit/react';
import Big from 'big.js';

export default function ProjectCard(props: any) {
  const {
    id,
    name,
    total_box,
    box,
    ecosystemInfo,
    onOpen,
    onReload,
    checking,
    completed,
  } = props;

  const { account } = useCustomAccount();
  const modal = useAppKit();

  return (
    <div className="relative text-black flex flex-col items-center w-[230px] h-[358px] p-[20px] pb-[26px] rounded-[20px] border border-black bg-[#B5956E] shadow-[-20px_26px_60px_0px_rgba(0, 0, 0, 0.20)_inset] md:w-full md:p-[28px_15px_15px] md:h-[unset]">
      <CheckButton
        number={`${total_box} / ${box}`}
        checked={Big(total_box || 0).gte(box || 1)}
        className="!bg-[#DCBC95] border-black text-black !absolute top-[-18px] left-[50px] w-[126px] shadow-[-20px_26px_60px_0px_rgba(0, 0, 0, 0.20)_inset] md:left-1/2 md:-translate-x-1/2"
        onClick={onReload}
        checking={checking}
      />
      <img src={ecosystemInfo?.icon} className="w-[180px] h-[180px] rounded-[10px] md:w-[127px] md:h-[127px]" />
      <div className="w-full text-center text-[20px] font-bold mt-[16px] whitespace-nowrap overflow-hidden text-ellipsis leading-[120%] md:text-[14px]">
        {name}
      </div>
      <div className="text-center text-[14px] font-medium md:text-[10px]">
        {ecosystemInfo?.categories?.join(', ')}
      </div>
      <Button
        className="w-full mt-auto"
        onClick={() => {
          if (!account) {
            modal.open({ view: 'Connect' });
            return;
          }
          onOpen();
        }}
      >
        Check
      </Button>
    </div>
  );
}
