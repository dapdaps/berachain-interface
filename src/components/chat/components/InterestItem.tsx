import React from 'react';
import IconArrow from '@public/images/chat/xs-link.svg';
import { numberFormatter } from '@/utils/number-formatter';
import { useChatContext } from '@/components/chat/context/chat-context';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { ACTION_TYPE } from '@/sections/vaults/v2/config';

const InterestItem: React.FC<any> = ({ item, onClick }) => {
  const { tokens, totalApr } = item;

  const { vaults } = useChatContext();
  const { toggleActionVisible } = useVaultsV2Context();

  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick?.();
      return;
    }
    toggleActionVisible({
      type: ACTION_TYPE.DEPOSIT,
      record: item.groupVault,
      visible: true
    });
  };

  return (
    <div
      className="flex justify-between items-center cursor-pointer font-Montserrat p-[6px] h-[38px] border border-[#DAD9CD] rounded-lg"
      onClick={handleClick}
    >
      <div className="flex items-center gap-[14px]">
          <span
            className="p-2 border border-black leading-[12px] text-xs font-[600] rounded-[6px] font-Montserrat"
            style={{ backgroundColor: "#FF888A" }}
          >
            Vaults
          </span>
        <span className="text-[13px] leading-[13px] text-[rgba(0,0,0,0.5)]">
            Join <strong>{tokens?.map((token: any) => token.symbol).join("-")}</strong> vaults, earning APY up to <strong>{numberFormatter(totalApr, 2, true, { isShort: true, isShortUppercase: true })}%</strong>
          </span>
      </div>
      <IconArrow />
    </div>
  );
};

export default InterestItem;