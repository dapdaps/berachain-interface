import CheckButton from "../check-button";
import Button from "./button";
import { useRouter } from 'next/navigation';

export default function DappCard(props: any) {
  const { total_box, onCheck, checking, actions, dappInfo } = props;

  const router = useRouter();

  return (
    <DappCardWrapper>
      <div>
        <div className="flex justify-between items-start">
          <div className="flex flex-1 gap-[10px]">
            <img src={dappInfo?.icon} className="w-[80px] h-[80px] rounded-[10px] shrink-0" />
            <div className="flex flex-1 w-0 flex-col gap-[4px] text-black text-left whitespace-nowrap">
              <div className="text-[20px] font-bold text-ellipsis overflow-hidden leading-[120%]">{dappInfo?.name}</div>
              <div className="text-[14px] font-medium">DeFi, {dappInfo?.category}</div>
            </div>
          </div>
          <CheckButton
            number={total_box}
            checked={false}
            className="!bg-[#DCBC95] border-black text-black items-center shadow-[-20px_26px_60px_0px_rgba(0, 0, 0, 0.20)_inset] shrink-0"
            onClick={onCheck}
            checking={checking}
          />
        </div>
        <ul className="mt-[20px] text-left text-black leading-[150%]">
          {
            dappInfo?.missions?.map?.((m: string, idx: number) => (
              <li className="text-[14px] font-medium list-disc" key={idx}>
                {m}
              </li>
            ))
          }
        </ul>
      </div>
      <div className="flex gap-[16px]">
        {
          actions?.map?.((action: any, idx: number) => (
            <Button
              key={idx}
              action={action.text}
              reward={action.box}
              className="w-full"
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
    <div className={`w-[400px] h-[260px] flex flex-col justify-between p-[20px] rounded-[20px] border border-black bg-[#B5956E] shadow-[-20px_26px_60px_0px_rgba(0, 0, 0, 0.20)_inset] ${className}`}>
      {children}
    </div>
  );
};
