import CheckButton from "../check-button";
import Button from "./button";
import { useRouter } from 'next/navigation';
import useIsMobile from '@/hooks/use-isMobile';
import Big from 'big.js';
import { useMemo } from 'react';
import { numberFormatter } from '@/utils/number-formatter';

export default function DappCard(props: any) {
  const { total_box, onCheck, checking, actions, dappInfo, missions, disabled } = props;

  const router = useRouter();
  const isMobile = useIsMobile();

  const [limitTotal] = useMemo(() => {
    let _total = Big(0);
    missions?.forEach?.((mission: any) => {
      _total = Big(_total).plus(Big(mission.times || 0).times(mission.box || 0));
    });
    return [
      _total.toString(),
    ];
  }, [missions]);

  return (
    <DappCardWrapper>
      <div>
        <div className="flex justify-between items-start">
          <div className="flex flex-1 gap-[10px]">
            <img src={dappInfo?.icon} className="w-[80px] h-[80px] md:w-[50px] md:h-[50px] rounded-[10px] shrink-0" />
            <div className="flex flex-1 w-0 flex-col gap-[4px] text-black text-left whitespace-nowrap">
              <div className="text-[20px] font-bold text-ellipsis overflow-hidden leading-[120%] flex justify-between items-center">
                <div className="md:text-[16px] md:overflow-hidden">
                  {dappInfo?.name}
                </div>
                <CheckButton
                  number={numberFormatter(total_box, 1, true, { isShort: true })}
                  checked={false}
                  className="!bg-[#DCBC95] border-black text-black items-center shadow-[-20px_26px_60px_0px_rgba(0, 0, 0, 0.20)_inset] shrink-0 !w-[102px] !h-[35px]"
                  numberClassName="!pl-[10px] !text-[12px]"
                  onClick={onCheck}
                  checking={checking}
                  disabled={disabled}
                />
              </div>
              <div className="text-[14px] font-medium flex justify-between items-center">
                <div className="text-[14px] font-medium md:text-[12px]">
                  DeFi, {dappInfo?.category}
                </div>
                {
                  !isMobile && (
                    <div className="bg-[rgba(0,_0,_0,_0.17)] rounded-[16px] text-black text-[14px] font-[500] leading-[120%] px-[10px] h-[30px] flex justify-center items-center">
                      {dappInfo?.limit?.text?.(limitTotal)}
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
        <ul className="mt-[20px] text-left text-black leading-[150%] md:pl-[13px]">
          {
            dappInfo?.missions?.map?.((m: string, idx: number) => (
              <li className="text-[14px] font-medium list-disc" key={idx}>
                {m}
              </li>
            ))
          }
        </ul>
      </div>
      <div className="flex gap-[16px] md:gap-[10px] md:mt-[10px]">
        {
          actions?.map?.((action: any, idx: number) => (
            <Button
              key={idx}
              action={action.text}
              reward={action.box}
              className="w-full"
              disabled={Big(action.total_box || 0).gte(Big(action.box || 0).times(action.times || 0))}
              style={{
                width: `${100 / actions.length}%`,
              }}
              onClick={() => {
                if (!action.path) return;
                router.push(action.path);
              }}
            />
          ))
        }
      </div>
    </DappCardWrapper>
  );
}

export const DappCardWrapper = (props: any) => {
  const { children, className } = props;

  return (
    <div className={`w-[400px] md:w-full h-[260px] md:h-[unset] flex flex-col justify-between p-[20px] md:p-[10px_13px_17px_13px] rounded-[20px] border border-black bg-[#B5956E] shadow-[-20px_26px_60px_0px_rgba(0, 0, 0, 0.20)_inset] ${className}`}>
      {children}
    </div>
  );
};
