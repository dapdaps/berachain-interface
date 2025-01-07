import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import { formatLongText } from '@/utils/utils';

interface Props {
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  item?: any;
  onCheckChange?: (v: boolean) => void;
}

export default function CheckBox({
  className,
  checked,
  disabled,
  onCheckChange,
  item,
}: Props) {

  return <>
    {
      disabled ? (
        <div className="w-[24px] h-[24px] rounded-[24px] flex items-center justify-center border-[2px] border-[#4B371F] cursor-pointer backdrop-blur-[10px] bg-gray">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.3999 6L5.9999 9.6L13.5999 2" stroke="#4B371F" stroke-width="3" stroke-linecap="round" />
          </svg>
        </div>
      ) : (
        !!item?.transfer_to ? (
          <Popover
            content={(
              <Card className="w-[192px] text-center text-black text-[14px] font-[400] !p-[10px_15px] !rounded-[20px]">
                This item is already<br /> transfer to Beraciaga<br /> account: <strong className="font-[700]">{formatLongText(item.transfer_to, 4, 4)}</strong>
              </Card>
            )}
            placement={PopoverPlacement.Right}
            trigger={PopoverTrigger.Hover}
          >
            <div className="w-[24px] h-[24px] rounded-[24px] border border-[#FFF5A9] cursor-pointer backdrop-blur-[10px] bg-[url('/images/cave/icon-beraciaga.svg')] bg-no-repeat bg-center bg-cover" />
          </Popover>
        ) : (
          checked ? (
            <div
              onClick={() => {
                onCheckChange && onCheckChange(false);
              }}
              className={`w-[24px] h-[24px] rounded-[24px] flex items-center justify-center border-[2px] border-[#4B371F] cursor-pointer backdrop-blur-[10px] bg-[#C7FF6E] ${className}`}
            >
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.3999 6L5.9999 9.6L13.5999 2" stroke="#4B371F" stroke-width="3" stroke-linecap="round" />
              </svg>
            </div>
          ) : (
            <div
              onClick={() => {
                onCheckChange && onCheckChange(true)
              }}
              className={`w-[24px] h-[24px] rounded-[24px] border-[2px] border-[#FFF5A9] cursor-pointer backdrop-blur-[10px] bg-[#0000004D] ${className}`}
            />
          )
        )
      )
    }
  </>
}