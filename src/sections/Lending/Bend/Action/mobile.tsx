import { IProps } from '@/sections/Lending/Bend/Action/index';
import React, { forwardRef } from 'react';
import Drawer from '@/components/drawer';
import ActionPanelForm from '@/sections/Lending/Bend/Action/form';

const ActionPanelMobile = forwardRef<HTMLDivElement, IProps>((props: IProps, ref) => {
  const { isOpen, onClose, action, token } = props;

  if (!isOpen) return null;

  return (
    <Drawer
      visible={isOpen}
      onClose={onClose}
      size="500px"
      className='!bg-[#FFFDEB]'
    >
      <div className="py-[23px]">
        <div className="text-[18px] font-[700] text-black px-[24px]">
          {action?.[0].toUpperCase() + action?.slice(1)} {token?.symbol}
        </div>
        <div className="px-[12px] mt-[33px]">
          <ActionPanelForm {...props} isMobile={true} />
        </div>
      </div>
    </Drawer>
  );
});

export default ActionPanelMobile;
